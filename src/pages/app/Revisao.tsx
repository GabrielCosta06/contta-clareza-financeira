import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  Check,
  ChevronRight,
  Copy,
  FileQuestion,
  Receipt,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  X,
} from "lucide-react";

import { reviewRepo, transactionsRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTrustBanner } from "@/components/DataTrustBanner";
import { EmptyState } from "@/components/EmptyState";
import { dateBR } from "@/lib/format";
import { toast } from "@/components/ui/sonner";
import { useDemoScenario } from "@/hooks/useDemoScenario";
import type { ReviewItem, ReviewItemKind } from "@/domain/types";

const sevColor = { critical: "destructive", medium: "secondary", low: "outline" } as const;
const sevLabel = { critical: "Crítico", medium: "Médio", low: "Baixo" };
const sevWeight = { critical: 0, medium: 1, low: 2 };

const kindMeta: Record<ReviewItemKind, { Icon: typeof Tag; label: string }> = {
  uncategorized: { Icon: Tag, label: "Sem categoria" },
  "missing-evidence": { Icon: Receipt, label: "Sem comprovante" },
  "amount-anomaly": { Icon: TrendingUp, label: "Variação atípica" },
  duplicate: { Icon: Copy, label: "Possível duplicidade" },
  "tax-inconsistency": { Icon: AlertTriangle, label: "Inconsistência fiscal" },
  "date-gap": { Icon: FileQuestion, label: "Lacuna de período" },
};

type Filter = "all" | "critical" | "medium" | "low";

export default function Revisao() {
  const { setScenario } = useDemoScenario();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data = [], isLoading } = useQuery({ queryKey: ["review"], queryFn: () => reviewRepo.queue() });
  const [filter, setFilter] = useState<Filter>("all");
  const pendingTimers = useRef(new Map<string, number>());

  const sorted = useMemo(
    () => [...data].sort((a, b) => sevWeight[a.severity] - sevWeight[b.severity]),
    [data],
  );

  const counts = {
    all: data.length,
    critical: data.filter((i) => i.severity === "critical").length,
    medium: data.filter((i) => i.severity === "medium").length,
    low: data.filter((i) => i.severity === "low").length,
  };

  const visible = filter === "all" ? sorted : sorted.filter((i) => i.severity === filter);

  const removeOptimistic = (item: ReviewItem) => {
    qc.setQueryData<ReviewItem[]>(["review"], (curr = []) => curr.filter((e) => e.id !== item.id));
  };

  const restore = (item: ReviewItem) => {
    qc.setQueryData<ReviewItem[]>(["review"], (curr = []) => {
      if (curr.some((e) => e.id === item.id)) return curr;
      return [...curr, item].sort(
        (l, r) => new Date(r.createdAt).getTime() - new Date(l.createdAt).getTime(),
      );
    });
  };

  const commit = (item: ReviewItem, action: "resolve" | "dismiss") => {
    removeOptimistic(item);
    const timer = window.setTimeout(async () => {
      pendingTimers.current.delete(item.id);
      await (action === "resolve" ? reviewRepo.resolve(item.id) : reviewRepo.dismiss(item.id));
      qc.invalidateQueries({ queryKey: ["review"] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
    }, 4000);
    pendingTimers.current.set(item.id, timer);

    toast[action === "resolve" ? "success" : "info"](
      action === "resolve" ? "Item resolvido" : "Item ignorado",
      {
        description:
          action === "resolve"
            ? "Confiança nos números atualizada."
            : "Não vamos mais sugerir esta verificação.",
        duration: 4000,
        action: {
          label: "Desfazer",
          onClick: () => {
            const t = pendingTimers.current.get(item.id);
            if (t) {
              window.clearTimeout(t);
              pendingTimers.current.delete(item.id);
            }
            restore(item);
          },
        },
      },
    );
  };

  const goToFix = (item: ReviewItem) => {
    if (item.transactionId) {
      navigate(`/app/transacoes/${item.transactionId}`);
      return;
    }
    if (item.kind === "uncategorized") {
      navigate("/app/transacoes?status=needs-categorization");
      return;
    }
    if (item.kind === "missing-evidence") {
      navigate("/app/transacoes?status=needs-evidence");
      return;
    }
    if (item.kind === "tax-inconsistency") {
      navigate("/app/transacoes?status=needs-categorization");
      return;
    }
    navigate("/app/transacoes");
  };

  const askAI = (item: ReviewItem) => {
    const prompt = `Sobre a pendência "${item.title}": ${item.description}. Qual é a melhor próxima ação?`;
    navigate(`/app/ai?prompt=${encodeURIComponent(prompt)}`);
  };

  const fixLabelByKind: Record<ReviewItemKind, string> = {
    uncategorized: "Categorizar agora",
    "missing-evidence": "Anexar comprovante",
    "amount-anomaly": "Investigar período",
    duplicate: "Comparar lançamentos",
    "tax-inconsistency": "Conciliar imposto",
    "date-gap": "Ver período",
  };

  const conf =
    counts.critical > 0 ? "with-caveats" : data.length > 0 ? "with-caveats" : "reliable";

  const resolveAllVisible = async () => {
    if (!visible.length) return;
    const snapshot = [...visible];
    qc.setQueryData<ReviewItem[]>(["review"], (curr = []) =>
      curr.filter((e) => !snapshot.some((s) => s.id === e.id)),
    );
    await Promise.all(snapshot.map((item) => reviewRepo.resolve(item.id)));
    qc.invalidateQueries({ queryKey: ["review"] });
    toast.success(`${snapshot.length} ${snapshot.length === 1 ? "item resolvido" : "itens resolvidos"}.`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Centro de confiança nos números"
        title="Revisão"
        subtitle="O que pode mudar o resultado do fechamento, em ordem de impacto."
        actions={
          visible.length > 0 ? (
            <Button variant="outline" size="sm" onClick={resolveAllVisible}>
              <Check className="h-4 w-4" />
              Resolver visíveis
            </Button>
          ) : undefined
        }
      />

      <DataTrustBanner level={conf} />

      <Tabs value={filter} onValueChange={(v) => setFilter(v as Filter)}>
        <TabsList>
          <TabsTrigger value="all">
            Todos <span className="ml-1.5 text-xs text-muted-foreground">{counts.all}</span>
          </TabsTrigger>
          <TabsTrigger value="critical">
            Críticos <span className="ml-1.5 text-xs text-destructive">{counts.critical}</span>
          </TabsTrigger>
          <TabsTrigger value="medium">
            Médios <span className="ml-1.5 text-xs text-warning">{counts.medium}</span>
          </TabsTrigger>
          <TabsTrigger value="low">
            Baixos <span className="ml-1.5 text-xs text-muted-foreground">{counts.low}</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {!isLoading && data.length === 0 ? (
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
      ) : visible.length === 0 ? (
        <EmptyState
          icon={<ShieldCheck className="h-5 w-5" />}
          title="Sem itens neste filtro"
          description="Tente outra severidade ou limpe o filtro."
          secondaryAction={
            <Button variant="outline" size="sm" onClick={() => setFilter("all")}>Ver todos</Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {visible.map((item) => {
            const KindIcon = kindMeta[item.kind].Icon;
            const isCritical = item.severity === "critical";
            const isMedium = item.severity === "medium";
            return (
              <article
                key={item.id}
                className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-border/80"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-md ${
                      isCritical
                        ? "bg-destructive-soft text-destructive"
                        : isMedium
                          ? "bg-warning-soft text-warning"
                          : "bg-muted text-muted-foreground"
                    }`}
                    aria-hidden
                  >
                    {isCritical ? <AlertCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <Badge variant={sevColor[item.severity]} className="text-[10px]">
                        {sevLabel[item.severity]}
                      </Badge>
                      <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-background/50 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                        <KindIcon className="h-3 w-3" />
                        {kindMeta[item.kind].label}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                    <p className="mt-2 text-xs text-foreground">
                      <strong className="font-medium">Impacto:</strong> {item.impact}
                    </p>
                    <p className="mt-1.5 text-xs text-muted-foreground">
                      Identificado em {dateBR(item.createdAt)}
                      {item.transactionId && (
                        <>
                          {" · "}
                          <Link
                            to={`/app/transacoes/${item.transactionId}`}
                            className="text-primary underline-offset-2 hover:underline"
                          >
                            ver transação
                          </Link>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-border/60 pt-3">
                  <Button variant="ghost" size="sm" onClick={() => askAI(item)}>
                    <Sparkles className="h-4 w-4" />
                    Perguntar à IA
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => commit(item, "dismiss")}>
                    <X className="h-4 w-4" />
                    Ignorar
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => goToFix(item)}>
                    {fixLabelByKind[item.kind]}
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button size="sm" onClick={() => commit(item, "resolve")}>
                    <Check className="h-4 w-4" />
                    Resolver
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
