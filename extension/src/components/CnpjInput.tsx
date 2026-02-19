interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  loading: boolean;
  formatFn: (v: string) => string;
}

export default function CnpjInput({
  value,
  onChange,
  onSubmit,
  loading,
  formatFn,
}: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow the user to type raw or pasted formatted CNPJ
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") onSubmit();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    // Auto-format on paste
    const pasted = e.clipboardData.getData("text");
    e.preventDefault();
    onChange(formatFn(pasted));
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <input
        type="text"
        placeholder="XX.XXX.XXX/XXXX-XX"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        maxLength={18}
        disabled={loading}
        autoFocus
        style={{
          flex: 1,
          padding: "10px 12px",
          borderRadius: 8,
          border: "1px solid #334155",
          background: "#1e293b",
          color: "#f1f5f9",
          fontSize: 14,
          fontFamily: "monospace",
          outline: "none",
          letterSpacing: "0.05em",
        }}
      />
      <button
        onClick={onSubmit}
        disabled={loading || !value.trim()}
        style={{
          padding: "10px 14px",
          borderRadius: 8,
          border: "none",
          background: loading || !value.trim() ? "#1e3a5f" : "#2563eb",
          color: "#fff",
          fontWeight: 600,
          fontSize: 14,
          cursor: loading || !value.trim() ? "not-allowed" : "pointer",
          whiteSpace: "nowrap",
          opacity: loading || !value.trim() ? 0.7 : 1,
        }}
      >
        {loading ? "..." : "Consultar"}
      </button>
    </div>
  );
}
