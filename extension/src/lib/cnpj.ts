/**
 * CNPJ utilities — validation and formatting.
 * No external dependencies; keeps the bundle small.
 */

/** Strip all non-digit characters from a CNPJ string */
export function stripCnpj(cnpj: string): string {
  return cnpj.replace(/\D/g, "");
}

/** Format a raw 14-digit CNPJ to XX.XXX.XXX/XXXX-XX */
export function formatCnpj(cnpj: string): string {
  const digits = stripCnpj(cnpj);
  if (digits.length !== 14) return cnpj;
  return digits.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

/**
 * Validate a CNPJ using the official digit verification algorithm.
 * Returns false for known invalid sequences (00000..., 11111..., etc.)
 */
export function isValidCnpj(cnpj: string): boolean {
  const digits = stripCnpj(cnpj);

  if (digits.length !== 14) return false;

  // Reject sequences of identical digits
  if (/^(\d)\1+$/.test(digits)) return false;

  const calcDigit = (nums: string, weights: number[]) => {
    const sum = nums
      .split("")
      .reduce((acc, d, i) => acc + parseInt(d) * weights[i], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const d1 = calcDigit(digits.slice(0, 12), w1);
  const d2 = calcDigit(digits.slice(0, 13), w2);

  return d1 === parseInt(digits[12]) && d2 === parseInt(digits[13]);
}

/**
 * Detect whether a company might be a MEI or EI by nature of business.
 * This is a heuristic — the definitive check is natureza_juridica from the API.
 */
export function isMeiOrEiNatureza(naturezaJuridica?: string): boolean {
  if (!naturezaJuridica) return false;
  const lower = naturezaJuridica.toLowerCase();
  return (
    lower.includes("microempreendedor individual") ||
    lower.includes("empresário individual")
  );
}

/**
 * Extract all CNPJ candidates from a string (e.g. a webpage's text).
 * Returns an array of raw 14-digit strings.
 */
export function extractCnpjsFromText(text: string): string[] {
  const regex = /\b\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}\b/g;
  const matches = text.match(regex) ?? [];
  return [...new Set(matches.map(stripCnpj).filter(isValidCnpj))];
}
