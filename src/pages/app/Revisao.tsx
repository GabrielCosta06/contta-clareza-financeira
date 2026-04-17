import { useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { EmptyState } from "@/components/EmptyState";
import { ShieldCheck, Check, AlertTriangle, AlertCircle } from "lucide-react";
import { dateBR } from "@/lib/format";
import { useToast } from "@/hooks/use-toast";

const sevColor = { critical: "destructive", medium: "secondary", low: "outline" } as const;
const sevLabel = { critical: "Crítico", medium: "Médio", low: "Baixo" };

export default function Revisao() {
  const { data = [] } = useQuery({ queryKey: ["review"], queryFn: () => reviewRepo.queue() });
  const qc = useQueryClient();
  const { toast } = useToast();

  const resolve = async (id: string) => {
    await reviewRepo.resolve(id);
    qc.invalidateQueries({ queryKey: ["review"] });
    toast({ title: "Item resolvido", description: "Confiança nos números atualizada." });
  };

  const critical = data.filter(d => d.severity === "critical").length;
  const conf = critical > 0 ? "with-caveats" : data.length > 0 ? "with-caveats" : "reliable";

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Centro de confiança nos números"
        title="Revisão"
        subtitle="O que pode mudar o resultado do fechamento, em ordem de impacto."
        actions={<ConfidenceBadge level={conf as any} />}
      />

      <div className="grid sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-destructive/20 bg-destructive-soft p-4"><p className="text-xs uppercase tracking-wider text-destructive font-medium">Críticos</p><p className="mt-1 text-2xl font-semibold num">{critical}</p></div>
        <div className="rounded-lg border border-warning/20 bg-warning-soft p-4"><p className="text-xs uppercase tracking-wider text-warning font-medium">Médios</p><p className="mt-1 text-2xl font-semibold num">{data.filter(d => d.severity === "medium").length}</p></div>
        <div className="rounded-lg border border-border bg-card p-4"><p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">Baixos</p><p className="mt-1 text-2xl font-semibold num">{data.filter(d => d.severity === "low").length}</p></div>
      </div>

      {data.length === 0 ? (
        <EmptyState icon={<ShieldCheck className="h-5 w-5" />} title="Tudo conciliado" description="Nenhum item pendente. Sua leitura está confiável." />
      ) : (
        <div className="space-y-3">
          {data.map(item => (
            <div key={item.id} className="rounded-lg border border-border bg-card p-5 flex items-start gap-4">
              <div className={`grid h-9 w-9 place-items-center rounded-md ${item.severity === "critical" ? "bg-destructive-soft text-destructive" : item.severity === "medium" ? "bg-warning-soft text-warning" : "bg-muted text-muted-foreground"}`}>
                {item.severity === "critical" ? <AlertCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <Badge variant={sevColor[item.severity] as any} className="text-[10px]">{sevLabel[item.severity]}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                <p className="text-xs text-foreground mt-2"><strong className="font-medium">Impacto:</strong> {item.impact}</p>
                <p className="text-xs text-muted-foreground mt-1.5">Identificado em {dateBR(item.createdAt)}</p>
              </div>
              <Button size="sm" variant="outline" onClick={() => resolve(item.id)}><Check className="h-4 w-4" /> Resolver</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
