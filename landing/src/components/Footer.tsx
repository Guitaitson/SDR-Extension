export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid #1e293b",
        padding: "40px 24px",
        textAlign: "center",
        color: "#475569",
        fontSize: 13,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
        <a href="/privacidade" style={{ color: "#475569", textDecoration: "none" }}>
          Política de Privacidade
        </a>
        <a href="/termos" style={{ color: "#475569", textDecoration: "none" }}>
          Termos de Uso
        </a>
        <a href="/lgpd" style={{ color: "#475569", textDecoration: "none" }}>
          Bases Legais LGPD
        </a>
        <a
          href="mailto:suporte@sdrextension.com.br"
          style={{ color: "#475569", textDecoration: "none" }}
        >
          Suporte
        </a>
      </div>
      <div>
        Dados de CNPJ são públicos (Receita Federal / Lei de Acesso à Informação).
        Prospecção B2B com base no legítimo interesse — LGPD Art. 7º, IX.
      </div>
      <div>© {new Date().getFullYear()} SDR Extension. Feito no Brasil.</div>
    </footer>
  );
}
