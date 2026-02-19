import { useState } from "react";
import { signInWithMagicLink } from "@/lib/api";

type Step = "email" | "sent";

const s = {
  container: {
    padding: 24,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  } as const,
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: "#f1f5f9",
    lineHeight: 1.3,
  } as const,
  subtitle: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 1.5,
  } as const,
  input: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#f1f5f9",
    fontSize: 14,
    outline: "none",
  } as const,
  btn: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "none",
    background: "#2563eb",
    color: "#fff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  } as const,
  btnDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  } as const,
  error: {
    fontSize: 12,
    color: "#f87171",
  } as const,
  success: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
    padding: 16,
    background: "#0f3460",
    borderRadius: 8,
  } as const,
  successTitle: {
    fontWeight: 700,
    fontSize: 14,
    color: "#60a5fa",
  } as const,
  successText: {
    fontSize: 13,
    color: "#93c5fd",
    lineHeight: 1.5,
  } as const,
};

export default function AuthScreen() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await signInWithMagicLink(email.trim());
      setStep("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setLoading(false);
    }
  };

  if (step === "sent") {
    return (
      <div style={s.container}>
        <div style={s.success}>
          <div style={s.successTitle}>Verifique seu e-mail</div>
          <div style={s.successText}>
            Enviamos um link de acesso para <strong>{email}</strong>. Clique no
            link para entrar — nenhuma senha necessária.
          </div>
        </div>
        <button style={s.btn} onClick={() => setStep("email")}>
          Usar outro e-mail
        </button>
      </div>
    );
  }

  return (
    <div style={s.container}>
      <div>
        <div style={s.title}>Bem-vindo</div>
        <div style={{ ...s.subtitle, marginTop: 4 }}>
          Entre com seu e-mail para acessar a extensão.
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input
          type="email"
          required
          placeholder="seu@email.com.br"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={s.input}
          autoFocus
        />
        {error && <div style={s.error}>{error}</div>}
        <button
          type="submit"
          disabled={loading}
          style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}
        >
          {loading ? "Enviando..." : "Entrar com link mágico"}
        </button>
      </form>
      <div style={{ ...s.subtitle, fontSize: 11, textAlign: "center" }}>
        Ao entrar, você concorda com nossos Termos de Uso e Política de
        Privacidade. Dados de CNPJ utilizados com base no legítimo interesse
        (LGPD, Art. 7º, IX).
      </div>
    </div>
  );
}
