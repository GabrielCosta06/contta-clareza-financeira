import { useQuery } from "@tanstack/react-query";
import { marginRepo } from "@/services";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { formatBRL, pct } from "@/lib/format";
import { Delta } from "@/components/Delta";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, Info } from "lucide-react";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function DRE() {
  const { data } = useQuery({ queryKey: ["dre"], queryFn: () => marginRepo.dre() });
  if (!data) return null;
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-semibold text-lg">Resumo do resultado — {data.period.label}</h2>
          <p className="text-sm text-muted-foreground">
            Quanto entrou, quanto saiu e o que sobrou. Comparado com {data.comparison.label}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ConfidenceBadge level={data.confidence} />
          <Button asChild variant="outline" size="sm">
            <Link to="/app/ai"><Sparkles className="h-4 w-4" /> Perguntar sobre uma linha</Link>
          </Button>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <caption className="sr-only">Resumo do resultado da empresa por categoria</caption>
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-5 py-3">Categoria</th>
              <th className="text-right font-medium px-5 py-3">Valor</th>
              <th className="text-right font-medium px-5 py-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="inline-flex items-center gap-1">
                      Variação <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Quanto essa linha mudou em relação ao período anterior.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.lines.map(l => (
              <tr key={l.key} className={cn("border-t", l.isTotal && "bg-muted/30 font-medium")}>
                <td className="px-5 py-3" style={{ paddingLeft: 20 + l.level * 16 }}>{l.label}</td>
                <td className={cn("px-5 py-3 text-right num", l.value < 0 && "text-destructive")}>{formatBRL(l.value)}</td>
                <td className="px-5 py-3 text-right">{l.variationPct !== undefined && <Delta value={l.variationPct} inverse={l.value < 0} />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">
        É a versão simples do que a contabilidade chama de DRE (Demonstração do Resultado do Exercício).
      </p>
    </div>
  );
}

export function Custos() {
  const { data = [] } = useQuery({ queryKey: ["costs"], queryFn: () => marginRepo.costs() });
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div>
        <h2 className="font-semibold text-lg">Onde os custos mais subiram</h2>
        <p className="text-sm text-muted-foreground">As categorias que mais pressionam o resultado deste período.</p>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <caption className="sr-only">Tabela de custos que mais subiram</caption>
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-5 py-3">Categoria</th>
              <th className="text-right font-medium px-5 py-3">Atual</th>
              <th className="text-right font-medium px-5 py-3">Anterior</th>
              <th className="text-right font-medium px-5 py-3">Variação</th>
              <th className="text-right font-medium px-5 py-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger className="inline-flex items-center gap-1">
                      % do total <Info className="h-3 w-3" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      Quanto esta categoria representa do total de custos do período.
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map(c => (
              <tr key={c.category} className="border-t">
                <td className="px-5 py-3 font-medium">{c.category}</td>
                <td className="px-5 py-3 text-right num">{formatBRL(c.current)}</td>
                <td className="px-5 py-3 text-right num text-muted-foreground">{formatBRL(c.previous)}</td>
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
    <div className="space-y-4 animate-fade-in-up">
      <div>
        <h2 className="font-semibold text-lg">Orçamento — o que você planejou e o que aconteceu</h2>
        <p className="text-sm text-muted-foreground">As maiores diferenças do mês entre o planejado e o realizado.</p>
      </div>
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <table className="w-full text-sm">
          <caption className="sr-only">Comparação entre orçamento planejado e realizado</caption>
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-5 py-3">Categoria</th>
              <th className="text-right font-medium px-5 py-3">Planejado</th>
              <th className="text-right font-medium px-5 py-3">Realizado</th>
              <th className="text-right font-medium px-5 py-3">Diferença</th>
            </tr>
          </thead>
          <tbody>
            {data.map(b => (
              <tr key={b.category} className="border-t">
                <td className="px-5 py-3 font-medium">{b.category}</td>
                <td className="px-5 py-3 text-right num text-muted-foreground">{formatBRL(b.planned)}</td>
                <td className="px-5 py-3 text-right num">{formatBRL(b.actual)}</td>
                <td className="px-5 py-3 text-right"><Delta value={b.variancePct} inverse={b.category === "Resultado" ? false : true} /></td>
              </tr>
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
    <div className="space-y-4 animate-fade-in-up">
      <div>
        <h2 className="font-semibold text-lg">Preços — onde olhar primeiro</h2>
        <p className="text-sm text-muted-foreground">Produtos e serviços onde o preço pode estar diminuindo seu resultado.</p>
      </div>
      <div className="space-y-3">
        {data.map(p => (
          <div key={p.productOrService} className="rounded-lg border border-border bg-card p-5 hover-lift transition-colors hover:border-primary/30">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium">{p.productOrService}</p>
                <p className="text-sm text-muted-foreground mt-1">{p.recommendation}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs text-muted-foreground">Margem atual</p>
                <p className="text-xl font-semibold num">{pct(p.currentMarginPct)}</p>
                <p className="text-xs text-muted-foreground mt-1">Referência: {pct(p.benchmarkMarginPct)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
