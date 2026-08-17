const JLPT_COLORS = {
  N1: { bg: "var(--color-indigo-50)", fg: "var(--color-indigo-700)" },
  N2: { bg: "var(--color-teal-50)", fg: "var(--color-teal-600)" },
  N3: { bg: "var(--color-amber-50)", fg: "var(--color-amber-600)" },
  N4: { bg: "#F1F2F4", fg: "var(--color-ink-soft)" },
  N5: { bg: "#F1F2F4", fg: "var(--color-ink-soft)" },
  NONE: { bg: "#F1F2F4", fg: "var(--color-ink-soft)" },
};

export function JLPTBadge({ level }) {
  const c = JLPT_COLORS[level] || JLPT_COLORS.NONE;
  return (
    <span className="badge" style={{ background: c.bg, color: c.fg }}>
      {level === "NONE" ? "JLPT —" : `JLPT ${level}`}
    </span>
  );
}

export function StatusBadge({ active }) {
  return (
    <span
      className="badge"
      style={{
        background: active ? "var(--color-teal-50)" : "var(--color-danger-50)",
        color: active ? "var(--color-teal-600)" : "var(--color-danger-500)",
      }}
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}