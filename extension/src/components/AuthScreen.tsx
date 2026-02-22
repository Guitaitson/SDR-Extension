import { useState, useEffect } from "react";
import { signInWithMagicLink } from "@/lib/api";
import { supabase } from "@/lib/supabase";

type Step = "email" | "sent" | "token";

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
  textarea: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#1e293b",
    color: "#f1f5f9",
    fontSize: 12,
    outline: "none",
    minHeight: 80,
    resize: "vertical" as const,
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
  btnSecondary: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 8,
    border: "1px solid #334155",
    background: "transparent",
    color: "#94a3b8",
    fontWeight: 500,
    fontSize: 13,
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
  link: {
    color: "#60a5fa",
    cursor: "pointer",
    textDecoration: "underline",
  } as const,
};

export default function AuthScreen() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for auth state changes from service worker
  useEffect(() => {
    const handleMessage = (message: { type: string }) => {
      if (message.type === "AUTH_STATE_CHANGED") {
        // Reload to update the UI with new auth state
        window.location.reload();
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, []);

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

  const handleTokenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const sessionData = JSON.parse(token.trim());
      
      // Set the session manually in Supabase
      const { error: sessionError } = await supabase.auth.setSession({
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
      });
      
      if (sessionError) throw sessionError;
      
      // Reload to update the UI
      window.location.reload();
    } catch (err) {
      setError("Token inválido. Verifique o formato JSON.");
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
        <div style={{ ...s.subtitle, fontSize: 12, textAlign: "center" }}>
          Após clicar no link, se o login não for automático,{" "}
          <span style={s.link} onClick={() => setStep("token")}>
            cole o token aqui
          </span>
        </div>
        <button style={s.btnSecondary} onClick={() => setStep("email")}>
          Usar outro e-mail
        </button>
      </div>
    );
  }

  if (step === "token") {
    return (
      <div style={s.container}>
        <div>
          <div style={s.title}>Colar Token</div>
          <div style={{ ...s.subtitle, marginTop: 4 }}>
            Cole o token JSON que aparece na página de callback após o login.
          </div>
        </div>
        <form
          onSubmit={handleTokenSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 10 }}
        >
          <textarea
            placeholder='{"access_token": "...", "refresh_token": "..."}'
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={s.textarea}
          />
          {error && <div style={s.error}>{error}</div>}
          <button
            type="submit"
            disabled={loading}
            style={{ ...s.btn, ...(loading ? s.btnDisabled : {}) }}
          >
            {loading ? "Verificando..." : "Entrar com token"}
          </button>
        </form>
        <button style={s.btnSecondary} onClick={() => setStep("email")}>
          Voltar para login
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
      <div style={{ ...s.subtitle, fontSize: 12, textAlign: "center" }}>
        Já tem um token?{" "}
        <span style={s.link} onClick={() => setStep("token")}>
          Cole aqui
        </span>
      </div>
      <div style={{ ...s.subtitle, fontSize: 11, textAlign: "center" }}>
        Ao entrar, você concorda com nossos Termos de Uso e Política de
        Privacidade. Dados de CNPJ utilizados com base no legítimo interesse
        (LGPD, Art. 7º, IX).
      </div>
    </div>
  );
}
