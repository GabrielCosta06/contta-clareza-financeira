import { useEffect, useState } from "react";

type CurrencyDisplay = "full" | "compact" | "card" | "table" | "tooltip";

interface CurrencyOptions {
  display?: CurrencyDisplay;
  sign?: boolean;
  compactViewport?: boolean;
}

const COMPACT_CARD_BREAKPOINT = 1024;

const shouldCompactCurrency = (display: CurrencyDisplay, compactViewport = false) => {
  if (display === "compact") return true;
  if (display === "card") return compactViewport;
  return false;
};

export const formatBRL = (value: number, options: CurrencyOptions = {}) => {
  const { display = "full", sign = false, compactViewport = false } = options;
  const compact = shouldCompactCurrency(display, compactViewport);
  const formatted = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
  }).format(Math.abs(value));

  if (sign) return `${value < 0 ? "−" : "+"} ${formatted}`;
  return value < 0 ? `−${formatted}` : formatted;
};

export const brl = (value: number, options: CurrencyOptions = {}) => formatBRL(value, options);

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

export const weekdayShort = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date).replace(".", "");
};

export const dayAndWeekday = (d: Date | string) => {
  const date = typeof d === "string" ? new Date(d) : d;
  return `${weekdayShort(date)} ${new Intl.DateTimeFormat("pt-BR", { day: "2-digit" }).format(date)}`;
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

export const useCompactCurrency = (breakpoint = COMPACT_CARD_BREAKPOINT) => {
  const [compact, setCompact] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const onChange = () => setCompact(window.innerWidth < breakpoint);

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [breakpoint]);

  return compact;
};
