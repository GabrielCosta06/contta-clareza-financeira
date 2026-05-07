import { createContext, useContext, useState, type ReactNode } from "react";

export type MarginPeriodId = "p_curr" | "p_prev" | "p_q";

interface Ctx {
  periodId: MarginPeriodId;
  setPeriodId: (id: MarginPeriodId) => void;
}

const MarginPeriodCtx = createContext<Ctx | null>(null);

export const MarginPeriodProvider = ({ children }: { children: ReactNode }) => {
  const [periodId, setPeriodId] = useState<MarginPeriodId>("p_curr");
  return <MarginPeriodCtx.Provider value={{ periodId, setPeriodId }}>{children}</MarginPeriodCtx.Provider>;
};

export const useMarginPeriod = () => {
  const ctx = useContext(MarginPeriodCtx);
  if (!ctx) throw new Error("useMarginPeriod fora do MarginPeriodProvider");
  return ctx;
};

export const PERIOD_OPTIONS: { id: MarginPeriodId; label: string }[] = [
  { id: "p_curr", label: "Mês atual" },
  { id: "p_prev", label: "Mês anterior" },
  { id: "p_q", label: "Trimestre" },
];
