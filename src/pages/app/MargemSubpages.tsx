import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, Info, Pencil, Calculator, ArrowRight } from "lucide-react";

import { marginRepo, categoriesRepo } from "@/services";
import { useMarginPeriod } from "@/hooks/useMarginPeriod";
import { formatBRL, pct } from "@/lib/format";
import { Delta } from "@/components/Delta";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/sonner";

// Map a DRE/cost label to a category filter for the Transações page.
const findCategoryId = (categories: { id: string; name: string }[], label: string): string | undefined => {
  const norm = label.toLowerCase();
  return categories.find(c => norm.includes(c.name.toLowerCase().split(" ")[0]))?.id;
};

const buildTxLink = (categoryId?: string) => {
  const params = new URLSearchParams();
  if (categoryId) params.set("category", categoryId);
  const qs = params.toString();
  return `/app/transacoes${qs ? `?${qs}` : ""}`;
};

export function DRE() {
  const { periodId } = useMarginPeriod();
  const { data } = useQuery({ queryKey: ["dre", periodId], queryFn: () => marginRepo.dre(periodId) });
  const { data: cats = [] } = useQuery({ queryKey: ["cats"], queryFn: () => categoriesRepo.list() });
  const navigate = useNavigate();

  if (!data) return null;
  return (
    <div className="space-y-4 animate-fade-in-up">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-semibold text-lg">Resumo do resultado — {data.period.label}</h2>
          <p className="text-sm text-muted-foreground">
            Quanto entrou, quanto saiu e o que sobrou. Comparado com {data.comparison.label}. Clique em uma linha para ver as transações.
          </p>
        </div>
        <div className="flex items-center gap-2">
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
            {data.lines.map(l => {
              const catId = findCategoryId(cats, l.label);
              const clickable = !l.isTotal;
              return (
                <tr
                  key={l.key}
                  onClick={clickable ? () => navigate(buildTxLink(catId)) : undefined}
                  className={cn(
                    "border-t",
                    l.isTotal && "bg-muted/30 font-medium",
                    clickable && "cursor-pointer hover:bg-muted/40 transition-colors",
                  )}
                >
                  <td className="px-5 py-3" style={{ paddingLeft: 20 + l.level * 16 }}>
                    <span className="inline-flex items-center gap-1.5">
                      {l.label}
                      {clickable && <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100" />}
                    </span>
                  </td>
                  <td className={cn("px-5 py-3 text-right num", l.value < 0 && "text-destructive")}>{formatBRL(l.value)}</td>
                  <td className="px-5 py-3 text-right">{l.variationPct !== undefined && <Delta value={l.variationPct} inverse={l.value < 0} />}</td>
                </tr>
              );
            })}
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
  const { periodId } = useMarginPeriod();
  const { data = [] } = useQuery({ queryKey: ["costs", periodId], queryFn: () => marginRepo.costs(periodId) });
  const { data: cats = [] } = useQuery({ queryKey: ["cats"], queryFn: () => categoriesRepo.list() });
  const navigate = useNavigate();

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div>
        <h2 className="font-semibold text-lg">Onde os custos mais subiram</h2>
        <p className="text-sm text-muted-foreground">As categorias que mais pressionam o resultado. Clique para ver as transações.</p>
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
            {data.map(c => {
              const catId = findCategoryId(cats, c.category);
              return (
                <tr
                  key={c.category}
                  onClick={() => navigate(buildTxLink(catId))}
                  className="border-t cursor-pointer hover:bg-muted/40 transition-colors"
                >
                  <td className="px-5 py-3 font-medium">{c.category}</td>
                  <td className="px-5 py-3 text-right num">{formatBRL(c.current)}</td>
                  <td className="px-5 py-3 text-right num text-muted-foreground">{formatBRL(c.previous)}</td>
                  <td className="px-5 py-3 text-right"><Delta value={c.variationPct} inverse /></td>
                  <td className="px-5 py-3 text-right num text-muted-foreground">{pct(c.share * 100)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const BudgetEditor = ({ category, planned, onSave }: { category: string; planned: number; onSave: (n: number) => void }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(String(planned));
  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (o) setValue(String(planned)); }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
          <Pencil className="h-3 w-3" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar planejado — {category}</DialogTitle>
          <DialogDescription>Ajuste o valor planejado. A variação é recalculada automaticamente.</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="planned-input">Valor planejado (R$)</Label>
          <Input
            id="planned-input"
            type="number"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button
            onClick={() => {
              const n = Number(value);
              if (!Number.isFinite(n) || n < 0) {
                toast.error("Informe um valor válido.");
                return;
              }
              onSave(n);
              setOpen(false);
            }}
          >
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export function Orcamento() {
  const { periodId } = useMarginPeriod();
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["budget", periodId], queryFn: () => marginRepo.budget(periodId) });

  const update = useMutation({
    mutationFn: ({ category, planned }: { category: string; planned: number }) => marginRepo.updateBudget(category, planned),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["budget"] });
      toast.success("Planejado atualizado.");
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Falha ao salvar."),
  });

  return (
    <div className="space-y-4 animate-fade-in-up">
      <div>
        <h2 className="font-semibold text-lg">Orçamento — o que você planejou e o que aconteceu</h2>
        <p className="text-sm text-muted-foreground">Ajuste os valores planejados para acompanhar suas metas em tempo real.</p>
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
              <th className="text-right font-medium px-5 py-3 w-24">Ações</th>
            </tr>
          </thead>
          <tbody>
            {data.map(b => (
              <tr key={b.category} className="border-t">
                <td className="px-5 py-3 font-medium">{b.category}</td>
                <td className="px-5 py-3 text-right num text-muted-foreground">{formatBRL(b.planned)}</td>
                <td className="px-5 py-3 text-right num">{formatBRL(b.actual)}</td>
                <td className="px-5 py-3 text-right">
                  <Delta value={b.variancePct} inverse={b.category === "Resultado" ? false : true} />
                </td>
                <td className="px-5 py-3 text-right">
                  <BudgetEditor
                    category={b.category}
                    planned={b.planned}
                    onSave={(n) => update.mutate({ category: b.category, planned: n })}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const PriceSimulator = ({
  product, currentMarginPct,
}: { product: string; currentMarginPct: number }) => {
  const [open, setOpen] = useState(false);
  const [delta, setDelta] = useState("5");
  const deltaNum = Number(delta) || 0;
  // Simple model: assume cost stays flat. New margin% = 1 - (1 - currentMarginPct/100) / (1 + delta/100)
  const newMargin = (() => {
    const cost = 1 - currentMarginPct / 100;
    const newPriceFactor = 1 + deltaNum / 100;
    if (newPriceFactor <= 0) return 0;
    return (1 - cost / newPriceFactor) * 100;
  })();
  const diff = newMargin - currentMarginPct;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Calculator className="h-4 w-4" /> Simular preço
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simulador de preço — {product}</DialogTitle>
          <DialogDescription>Ajuste o preço em % (mantendo custo) e veja o impacto na margem.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="price-delta">Reajuste de preço (%)</Label>
            <Input id="price-delta" type="number" inputMode="decimal" value={delta} onChange={(e) => setDelta(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3 rounded-md bg-muted/40 p-3 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Margem atual</p>
              <p className="num font-semibold">{pct(currentMarginPct)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Margem simulada</p>
              <p className={cn("num font-semibold", diff > 0 ? "text-success" : diff < 0 ? "text-destructive" : "")}>
                {pct(newMargin)} <span className="text-xs font-normal">({diff >= 0 ? "+" : ""}{diff.toFixed(1)}p.p.)</span>
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Modelo simplificado: assume custo constante e demanda inalterada. Use como referência inicial.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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
                <div className="mt-3">
                  <PriceSimulator product={p.productOrService} currentMarginPct={p.currentMarginPct} />
                </div>
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
