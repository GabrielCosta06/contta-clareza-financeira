import { useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, AlertTriangle, Check, ShieldCheck } from "lucide-react";

import { reviewRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTrustBanner } from "@/components/DataTrustBanner";
import { EmptyState } from "@/components/EmptyState";
import { dateBR } from "@/lib/format";
import { toast } from "@/components/ui/sonner";
import { useDemoScenario } from "@/hooks/useDemoScenario";
import type { ReviewItem } from "@/domain/types";

const sevColor = { critical: "destructive", medium: "secondary", low: "outline" } as const;
const sevLabel = { critical: "Crítico", medium: "Médio", low: "Baixo" };

export default function Revisao() {
  const { setScenario } = useDemoScenario();
  const { data = [] } = useQuery({ queryKey: ["review"], queryFn: () => reviewRepo.queue() });
  const qc = useQueryClient();
  const pendingResolves = useRef(new Map<string, number>());

  const resolve = (item: ReviewItem) => {
    qc.setQueryData<ReviewItem[]>(["review"], (current = []) => current.filter((entry) => entry.id !== item.id));

    const timeoutId = window.setTimeout(async () => {
      pendingResolves.current.delete(item.id);
      await reviewRepo.resolve(item.id);
      qc.invalidateQueries({ queryKey: ["review"] });
    }, 5000);

    pendingResolves.current.set(item.id, timeoutId);

    toast.success("Item resolvido", {
      description: "Confiança nos números atualizada.",
      duration: 5000,
      action: {
        label: "Desfazer",
        onClick: () => {
          const pending = pendingResolves.current.get(item.id);
          if (pending) {
            window.clearTimeout(pending);
            pendingResolves.current.delete(item.id);
          }

          qc.setQueryData<ReviewItem[]>(["review"], (current = []) => {
            if (current.some((entry) => entry.id === item.id)) return current;
            return [...current, item].sort(
              (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
            );
          });
        },
      },
    });
  };

  const critical = data.filter((item) => item.severity === "critical").length;
  const conf = critical > 0 ? "with-caveats" : data.length > 0 ? "with-caveats" : "reliable";

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Centro de confiança nos números"
        title="Revisão"
        subtitle="O que pode mudar o resultado do fechamento, em ordem de impacto."
      />

      <DataTrustBanner level={conf} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-destructive/20 bg-destructive-soft p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-destructive">Críticos</p>
          <p className="mt-1 text-2xl font-semibold num">{critical}</p>
        </div>
        <div className="rounded-lg border border-warning/20 bg-warning-soft p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-warning">Médios</p>
          <p className="mt-1 text-2xl font-semibold num">{data.filter((item) => item.severity === "medium").length}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Baixos</p>
          <p className="mt-1 text-2xl font-semibold num">{data.filter((item) => item.severity === "low").length}</p>
        </div>
      </div>

      {data.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Tudo conciliado"
          description="Nenhum item pendente. Sua leitura está confiável."
          secondaryAction={
            <Button type="button" variant="outline" size="sm" onClick={() => setScenario("critical")}>
              Ver pendências de exemplo
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <div key={item.id} className="flex items-start gap-4 rounded-lg border border-border bg-card p-5">
              <div
                className={`grid h-9 w-9 place-items-center rounded-md ${
                  item.severity === "critical"
                    ? "bg-destructive-soft text-destructive"
                    : item.severity === "medium"
                      ? "bg-warning-soft text-warning"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {item.severity === "critical" ? <AlertCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <Badge variant={sevColor[item.severity]} className="text-[10px]">
                    {sevLabel[item.severity]}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                <p className="mt-2 text-xs text-foreground">
                  <strong className="font-medium">Impacto:</strong> {item.impact}
                </p>
                <p className="mt-1.5 text-xs text-muted-foreground">Identificado em {dateBR(item.createdAt)}</p>
              </div>

              <Button size="sm" variant="outline" onClick={() => resolve(item)}>
                <Check className="h-4 w-4" />
                Resolver
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
