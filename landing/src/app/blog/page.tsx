import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Blog — SDR Extension | Prospecção B2B, Inside Sales e Ferramentas para SDRs Brasileiros",
  description:
    "Artigos práticos sobre prospecção B2B, inside sales e ferramentas para SDRs brasileiros. Aprenda a usar dados do CNPJ para vender mais.",
  keywords: [
    "blog SDR Brasil",
    "prospecção B2B",
    "inside sales Brasil",
    "ferramentas SDR",
    "CNPJ prospecção",
  ],
  openGraph: {
    title: "Blog SDR Extension — Prospecção B2B para o mercado brasileiro",
    description:
      "Artigos práticos sobre prospecção B2B, inside sales e ferramentas para SDRs brasileiros.",
    type: "website",
    locale: "pt_BR",
  },
};

const posts = [
  {
    slug: "prospectar-empresas-b2b-cnpj",
    title: "Como prospectar empresas B2B pelo CNPJ: o guia completo para SDRs brasileiros",
    excerpt:
      "Aprenda a transformar qualquer CNPJ em inteligência de prospecção acionável: dados da Receita Federal, análise de porte e CNAE, e mensagem personalizada em menos de um minuto.",
    date: "2024-12-10",
    readTime: "8 min",
    category: "Prospecção",
  },
  {
    slug: "inside-sales-brasil-guia-completo",
    title: "Inside Sales no Brasil: por que 72% dos times perdem meta e como reverter",
    excerpt:
      "O mercado de inside sales brasileiro tem peculiaridades que as metodologias importadas ignoram. Descubra o que os melhores SDRs fazem diferente — e como replicar.",
    date: "2024-12-03",
    readTime: "10 min",
    category: "Inside Sales",
  },
  {
    slug: "ferramentas-sdr-mercado-brasileiro",
    title: "Ferramentas de SDR para o mercado brasileiro: comparativo completo 2025",
    excerpt:
      "Speedio, Neoway, Apollo, LinkedIn Sales Navigator — qual faz sentido para o seu bolso e para o mercado B2B brasileiro? Comparamos preço, dados e produtividade.",
    date: "2024-11-26",
    readTime: "12 min",
    category: "Ferramentas",
  },
];

const s = {
  page: {
    background: "#0f172a",
    minHeight: "100vh",
    color: "#f1f5f9",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  nav: {
    padding: "20px 24px",
    borderBottom: "1px solid #1e293b",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  navLogo: {
    color: "#3b82f6",
    fontWeight: 800,
    fontSize: 18,
    textDecoration: "none",
  },
  navLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: 14,
  },
  hero: {
    padding: "80px 24px 48px",
    textAlign: "center" as const,
    maxWidth: 760,
    margin: "0 auto",
  },
  eyebrow: {
    display: "inline-block",
    background: "#1e3a5f",
    color: "#60a5fa",
    fontSize: 13,
    fontWeight: 600,
    borderRadius: 20,
    padding: "4px 14px",
    marginBottom: 20,
  },
  h1: {
    fontSize: "clamp(28px, 5vw, 48px)",
    fontWeight: 800,
    lineHeight: 1.2,
    color: "#f1f5f9",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: "#94a3b8",
    lineHeight: 1.6,
  },
  grid: {
    maxWidth: 900,
    margin: "48px auto 80px",
    padding: "0 24px",
    display: "grid",
    gap: 28,
  },
  card: {
    background: "#1e293b",
    borderRadius: 16,
    padding: 32,
    border: "1px solid #334155",
    transition: "border-color 0.2s",
    textDecoration: "none",
    display: "block",
    color: "inherit",
  },
  cardMeta: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  category: {
    background: "#1e3a5f",
    color: "#60a5fa",
    fontSize: 12,
    fontWeight: 600,
    borderRadius: 12,
    padding: "3px 10px",
  },
  dateLine: {
    color: "#64748b",
    fontSize: 13,
  },
  cardTitle: {
    fontSize: "clamp(18px, 2.5vw, 22px)",
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: 12,
    lineHeight: 1.35,
  },
  cardExcerpt: {
    color: "#94a3b8",
    fontSize: 15,
    lineHeight: 1.65,
    marginBottom: 20,
  },
  readMore: {
    color: "#3b82f6",
    fontWeight: 600,
    fontSize: 14,
  },
};

export default function BlogPage() {
  return (
    <div style={s.page}>
      <nav style={s.nav}>
        <Link href="/" style={s.navLogo}>
          SDR Extension
        </Link>
        <Link href="/" style={s.navLink}>
          ← Voltar ao início
        </Link>
      </nav>

      <div style={s.hero}>
        <span style={s.eyebrow}>Blog</span>
        <h1 style={s.h1}>Prospecção B2B para o mercado brasileiro</h1>
        <p style={s.subtitle}>
          Artigos práticos sobre CNPJ, inside sales e ferramentas para SDRs que querem bater meta.
        </p>
      </div>

      <div style={s.grid}>
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} style={s.card}>
            <div style={s.cardMeta}>
              <span style={s.category}>{post.category}</span>
              <span style={s.dateLine}>
                {new Date(post.date).toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                · {post.readTime} de leitura
              </span>
            </div>
            <h2 style={s.cardTitle}>{post.title}</h2>
            <p style={s.cardExcerpt}>{post.excerpt}</p>
            <span style={s.readMore}>Ler artigo →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
