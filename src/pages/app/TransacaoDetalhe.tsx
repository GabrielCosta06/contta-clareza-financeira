import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Check, Edit } from "lucide-react";

import { transactionsRepo, categoriesRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { brl, dateBR } from "@/lib/format";
import { AIInsightCard } from "@/components/AIInsightCard";
import { Badge } from "@/components/ui/badge";
import { TransactionFormDialog } from "@/components/transactions/TransactionFormDialog";
import { toast } from "@/components/ui/sonner";

const statusLabels: Record<string, string> = {
  reviewed: "Revisado",
  pending: "Pendente",
  "needs-categorization": "Sem categoria",
  "needs-evidence": "Sem comprovante",
};

export default function TransacaoDetalhe() {
  const { id } = useParams();
  const qc = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);
  const { data: tx } = useQuery({ queryKey: ["tx", id], queryFn: () => transactionsRepo.get(id!), enabled: !!id });
  const { data: cats = [] } = useQuery({ queryKey: ["cats"], queryFn: () => categoriesRepo.list() });
  const cat = cats.find((category) => category.id === tx?.categoryId);

  const markReviewed = useMutation({
    mutationFn: () => transactionsRepo.update(tx!.id, { reviewStatus: "reviewed" }),
    onSuccess: () => {
      toast.success("Marcado como revisado.");
      qc.invalidateQueries({ queryKey: ["tx", id] });
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["review"] });
    },
    onError: (err: Error) => toast.error("Não foi possível marcar.", { description: err.message }),
  });

  if (!tx) return <div className="text-sm text-muted-foreground">Carregando…</div>;

  const isReviewed = tx.reviewStatus === "reviewed";

  return (
    <div className="space-y-6 animate-fade-in">
      <Button asChild variant="ghost" size="sm" className="-ml-2">
        <Link to="/app/transacoes">
          <ArrowLeft className="h-4 w-4" />
          Voltar para transações
        </Link>
      </Button>

      <PageHeader
        eyebrow={dateBR(tx.date)}
        title={tx.description}
        subtitle={tx.counterparty}
        actions={
          <>
            <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
              <Edit className="h-4 w-4" />
              Editar
            </Button>
            <Button size="sm" disabled={isReviewed || markReviewed.isPending} onClick={() => markReviewed.mutate()}>
              <Check className="h-4 w-4" />
              {isReviewed ? "Revisado" : markReviewed.isPending ? "Salvando…" : "Marcar revisado"}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Valor</p>
              <p className={`mt-1 text-2xl font-semibold num ${tx.direction === "in" ? "text-success" : "text-foreground"}`}>
                {tx.direction === "in" ? "+ " : "− "}
                {brl(tx.amount)}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Direção</p>
              <p className="mt-1 font-medium">{tx.direction === "in" ? "Entrada" : "Saída"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Categoria</p>
              <p className="mt-1 font-medium">{cat?.name ?? <span className="text-destructive">Sem categoria</span>}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Origem</p>
              <p className="mt-1 font-medium capitalize">{tx.source}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Status de revisão</p>
              <div className="mt-1">
                <Badge variant="secondary">{statusLabels[tx.reviewStatus] ?? tx.reviewStatus}</Badge>
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Comprovantes</p>
              <p className="mt-1 font-medium">{tx.evidenceCount}</p>
            </div>
            {tx.notes && (
              <div className="col-span-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground">Observações</p>
                <p className="mt-1 text-sm text-foreground">{tx.notes}</p>
              </div>
            )}
          </div>
        </div>
        <AIInsightCard
          title="Contta AI sobre esta transação"
          summary={`Esta ${tx.direction === "in" ? "entrada" : "saída"} faz parte do grupo "${cat?.group ?? "—"}". O padrão desse lançamento mudou nas últimas semanas.`}
          confidence="with-caveats"
          details={[
            "Frequência: 3 lançamentos similares em 30 dias.",
            "Categoria sugerida: confirme antes do fechamento.",
          ]}
          askHref={`/app/ai?prompt=${encodeURIComponent(`Analise a transação "${tx.description}" e diga o que merece atenção nesta tela.`)}`}
          askLabel="Perguntar sobre esta transação"
        />
      </div>

      <TransactionFormDialog open={editOpen} onOpenChange={setEditOpen} transaction={tx} />
    </div>
  );
}
