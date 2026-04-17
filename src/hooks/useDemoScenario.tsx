import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";

export type DemoScenario = "reliable" | "partial" | "empty" | "critical";

export const SCENARIO_LABELS: Record<DemoScenario, string> = {
  reliable: "Confiável",
  partial: "Parcial",
  empty: "Sem dados",
  critical: "Pendência crítica",
};

export const SCENARIO_DESCRIPTIONS: Record<DemoScenario, string> = {
  reliable: "Dados completos e conciliados.",
  partial: "Algumas pendências e categorias faltando.",
  empty: "Conta nova, sem dados ainda.",
  critical: "Caixa apertado e itens críticos.",
};

const STORAGE_KEY = "contta.demo.scenario";

let currentScenario: DemoScenario = "reliable";
const listeners = new Set<(s: DemoScenario) => void>();

export const getDemoScenario = (): DemoScenario => currentScenario;

const setGlobalScenario = (s: DemoScenario) => {
  currentScenario = s;
  listeners.forEach(l => l(s));
};

interface Ctx {
  scenario: DemoScenario;
  setScenario: (s: DemoScenario) => void;
}

const DemoScenarioContext = createContext<Ctx | null>(null);

export const DemoScenarioProvider = ({ children }: { children: ReactNode }) => {
  const qc = useQueryClient();
  const [scenario, setScenarioState] = useState<DemoScenario>(() => {
    if (typeof window === "undefined") return "reliable";
    const v = localStorage.getItem(STORAGE_KEY) as DemoScenario | null;
    const initial = v && ["reliable", "partial", "empty", "critical"].includes(v) ? v : "reliable";
    currentScenario = initial;
    return initial;
  });

  const setScenario = useCallback((s: DemoScenario) => {
    setScenarioState(s);
    setGlobalScenario(s);
    try { localStorage.setItem(STORAGE_KEY, s); } catch {}
    // Invalidate everything so mock repos return scenario-specific data.
    qc.invalidateQueries();
  }, [qc]);

  useEffect(() => {
    const l = (s: DemoScenario) => setScenarioState(s);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);

  const value = useMemo(() => ({ scenario, setScenario }), [scenario, setScenario]);
  return <DemoScenarioContext.Provider value={value}>{children}</DemoScenarioContext.Provider>;
};

export const useDemoScenario = () => {
  const ctx = useContext(DemoScenarioContext);
  if (!ctx) throw new Error("useDemoScenario must be used inside DemoScenarioProvider");
  return ctx;
};
