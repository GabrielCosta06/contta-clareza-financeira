// Brazilian formatting helpers
export const brl = (v: number, opts: { compact?: boolean; sign?: boolean } = {}) => {
  const { compact, sign } = opts;
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
  }).format(Math.abs(v));
  if (sign) return (v < 0 ? "−" : "+") + " " + formatted;
  return v < 0 ? "−" + formatted : formatted;
};

export const pct = (v: number, opts: { sign?: boolean; digits?: number } = {}) => {
  const { sign, digits = 1 } = opts;
  const s = `${v.toFixed(digits).replace(".", ",")}%`;
  if (!sign) return s;
  return v > 0 ? `+${s}` : v < 0 ? `−${Math.abs(v).toFixed(digits).replace(".", ",")}%` : s;
};

export const dateBR = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(date);
};

export const dateShort = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(date);
};

export const relativeDays = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  const diff = Math.round((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return "hoje";
  if (diff === 1) return "amanhã";
  if (diff === -1) return "ontem";
  if (diff > 0) return `em ${diff} dias`;
  return `há ${Math.abs(diff)} dias`;
};
