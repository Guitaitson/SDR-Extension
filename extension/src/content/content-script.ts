/**
 * Content Script — injected into all pages.
 *
 * Responsibility: detect CNPJ patterns in page text and inject
 * a subtle "Prospectar" button next to each found CNPJ.
 *
 * This runs at document_idle to avoid impacting page load performance.
 */

import { extractCnpjsFromText, formatCnpj } from "@/lib/cnpj";

const BUTTON_CLASS = "sdr-ext-btn";
const ATTR_PROCESSED = "data-sdr-processed";

let isEnabled = true;

// Check user setting for auto-detection
chrome.storage.local.get("settings", (result: { settings?: { auto_detect_cnpj?: boolean } }) => {
  const settings = result.settings;
  if (settings && settings.auto_detect_cnpj === false) {
    isEnabled = false;
  } else {
    injectCnpjButtons();
  }
});

function injectCnpjButtons() {
  if (!isEnabled) return;

  // Walk text nodes to find CNPJ patterns
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: (node) => {
        const parent = node.parentElement;
        // Skip script, style, and already-processed elements
        if (
          !parent ||
          ["SCRIPT", "STYLE", "NOSCRIPT"].includes(parent.tagName) ||
          parent.closest(`.${BUTTON_CLASS}`) ||
          parent.getAttribute(ATTR_PROCESSED)
        ) {
          return NodeFilter.FILTER_REJECT;
        }
        // Only process nodes that contain CNPJ-like patterns
        return /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/.test(
          node.textContent ?? ""
        )
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    }
  );

  const nodesToProcess: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    nodesToProcess.push(node as Text);
  }

  // Limit to first 20 matches to avoid performance issues on heavy pages
  nodesToProcess.slice(0, 20).forEach(processTextNode);
}

function processTextNode(textNode: Text) {
  const parent = textNode.parentElement;
  if (!parent) return;

  const text = textNode.textContent ?? "";
  const cnpjs = extractCnpjsFromText(text);
  if (cnpjs.length === 0) return;

  // Mark parent to avoid double-processing
  parent.setAttribute(ATTR_PROCESSED, "true");

  // Replace each CNPJ occurrence with CNPJ + button
  const fragment = document.createDocumentFragment();
  let lastIndex = 0;
  const regex = /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    // Text before the CNPJ
    if (match.index > lastIndex) {
      fragment.appendChild(
        document.createTextNode(text.slice(lastIndex, match.index))
      );
    }

    // The CNPJ text itself
    fragment.appendChild(document.createTextNode(match[0]));

    // Inline "Prospectar" button
    const btn = document.createElement("button");
    btn.className = BUTTON_CLASS;
    btn.textContent = "Prospectar";
    btn.title = `Analisar ${formatCnpj(match[0])} com SDR Extension`;
    btn.dataset.cnpj = match[0].replace(/\D/g, "");
    applyButtonStyles(btn);
    btn.addEventListener("click", handleButtonClick);
    fragment.appendChild(btn);

    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  parent.replaceChild(fragment, textNode);
}

function applyButtonStyles(btn: HTMLButtonElement) {
  Object.assign(btn.style, {
    display: "inline-block",
    marginLeft: "6px",
    padding: "1px 6px",
    fontSize: "11px",
    fontWeight: "600",
    color: "#fff",
    background: "#2563eb",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    verticalAlign: "middle",
    fontFamily: "sans-serif",
    lineHeight: "1.6",
  });
}

function handleButtonClick(e: Event) {
  const btn = e.currentTarget as HTMLButtonElement;
  const cnpj = btn.dataset.cnpj;
  if (!cnpj) return;

  // Open the extension popup via chrome.runtime message
  // (popup cannot be opened programmatically in MV3; we store the CNPJ and
  // the popup will pick it up when opened)
  chrome.storage.local.set({ pending_cnpj: cnpj }, () => {
    // Visual feedback
    btn.textContent = "Abrir extensao";
    btn.style.background = "#166534";
    setTimeout(() => {
      btn.textContent = "Prospectar";
      btn.style.background = "#2563eb";
    }, 2000);
  });
}
