import { useQuery } from "@tanstack/react-query";
import { marginRepo } from "@/services";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { brl, pct } from "@/lib/format";
import { Delta } from "@/components/Delta";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function DRE() {
  const { data } = useQuery({ queryKey: ["dre"], queryFn: () => marginRepo.dre() });
  if (!data) return null;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-semibold">DRE — {data.period.label}</h2>
          <p className="text-sm text-muted-foreground">Comparado com {data.comparison.label}</p>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceBadge level={data.confidence} />
          <Button asChild variant="outline" size="sm"><Link to="/app/ai"><Sparkles className="h-4 w-4" /> Perguntar sobre uma linha</Link></Button>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground"><tr><th className="text-left font-medium px-5 py-3">Linha</th><th className="text-right font-medium px-5 py-3">Valor</th><th className="text-right font-medium px-5 py-3">Variação</th></tr></thead>
          <tbody>
            {data.lines.map(l => (
              <tr key={l.key} className={cn("border-t", l.isTotal && "bg-muted/30 font-medium")}>
                <td className="px-5 py-3" style={{ paddingLeft: 20 + l.level * 16 }}>{l.label}</td>
                <td className={cn("px-5 py-3 text-right num", l.value < 0 && "text-destructive")}>{brl(l.value)}</td>
                <td className="px-5 py-3 text-right">{l.variationPct !== undefined && <Delta value={l.variationPct} inverse={l.value < 0} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Custos() {
  const { data = [] } = useQuery({ queryKey: ["costs"], queryFn: () => marginRepo.costs() });
  return (
    <div className="space-y-4">
      <h2 className="font-semibold">Custos sob pressão</h2>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground"><tr><th className="text-left font-medium px-5 py-3">Categoria</th><th className="text-right font-medium px-5 py-3">Atual</th><th className="text-right font-medium px-5 py-3">Anterior</th><th className="text-right font-medium px-5 py-3">Variação</th><th className="text-right font-medium px-5 py-3">Participação</th></tr></thead>
          <tbody>
            {data.map(c => (
              <tr key={c.category} className="border-t">
                <td className="px-5 py-3 font-medium">{c.category}</td>
                <td className="px-5 py-3 text-right num">{brl(c.current)}</td>
                <td className="px-5 py-3 text-right num text-muted-foreground">{brl(c.previous)}</td>
                <td className="px-5 py-3 text-right"><Delta value={c.variationPct} inverse /></td>
                <td className="px-5 py-3 text-right num text-muted-foreground">{pct(c.share * 100)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Orcamento() {
  const { data = [] } = useQuery({ queryKey: ["budget"], queryFn: () => marginRepo.budget() });
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold">Orçamento — Planejado vs Realizado</h2>
        <p className="text-sm text-muted-foreground">Variações relevantes do mês atual.</p>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground"><tr><th className="text-left font-medium px-5 py-3">Categoria</th><th className="text-right font-medium px-5 py-3">Planejado</th><th className="text-right font-medium px-5 py-3">Realizado</th><th className="text-right font-medium px-5 py-3">Variação</th></tr></thead>
          <tbody>
            {data.map(b => (
              <tr key={b.category} className="border-t"><td className="px-5 py-3 font-medium">{b.category}</td><td className="px-5 py-3 text-right num text-muted-foreground">{brl(b.planned)}</td><td className="px-5 py-3 text-right num">{brl(b.actual)}</td><td className="px-5 py-3 text-right"><Delta value={b.variancePct} inverse={b.category === "Resultado" ? false : true} /></td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function Precificacao() {
  const { data = [] } = useQuery({ queryKey: ["pricing"], queryFn: () => marginRepo.pricing() });
  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold">Precificação — onde investigar</h2>
        <p className="text-sm text-muted-foreground">Sugestões direcionadas onde preço pode estar comprometendo a margem.</p>
      </div>
      <div className="space-y-3">
        {data.map(p => (
          <div key={p.productOrService} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{p.productOrService}</p>
                <p className="text-sm text-muted-foreground mt-1">{p.recommendation}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">Margem atual</p>
                <p className="text-xl font-semibold num">{pct(p.currentMarginPct)}</p>
                <p className="text-xs text-muted-foreground mt-1">Faixa: {pct(p.benchmarkMarginPct)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
