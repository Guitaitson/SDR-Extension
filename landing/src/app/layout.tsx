import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SDR Extension — Prospecção B2B pelo CNPJ | Extensão Chrome",
  description:
    "Cole um CNPJ e receba em 15 segundos o briefing completo da empresa, o contato certo para abordar e a mensagem personalizada pronta para enviar. Para SDRs brasileiros.",
  keywords: [
    "extensão chrome prospecção B2B",
    "ferramenta SDR Brasil",
    "buscar CNPJ empresa",
    "prospecção por CNPJ",
    "inteligência comercial extensão chrome",
    "gerar mensagem prospecção",
    "inside sales Brasil",
  ],
  openGraph: {
    title: "SDR Extension — De CNPJ a mensagem pronta em 15 segundos",
    description:
      "A primeira Chrome Extension brasileira que transforma CNPJ em inteligência de prospecção acionável com IA.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body
        style={{
          margin: 0,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          background: "#0f172a",
          color: "#f1f5f9",
        }}
      >
        {children}
      </body>
    </html>
  );
}
