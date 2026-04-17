import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { transactionsRepo, categoriesRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { brl, dateBR } from "@/lib/format";
import { ArrowLeft, Sparkles, Edit, Check } from "lucide-react";
import { AIInsightCard } from "@/components/AIInsightCard";
import { Badge } from "@/components/ui/badge";

export default function TransacaoDetalhe() {
  const { id } = useParams();
  const { data: tx } = useQuery({ queryKey: ["tx", id], queryFn: () => transactionsRepo.get(id!), enabled: !!id });
  const { data: cats = [] } = useQuery({ queryKey: ["cats"], queryFn: () => categoriesRepo.list() });
  const cat = cats.find(c => c.id === tx?.categoryId);

  if (!tx) return <div className="text-sm text-muted-foreground">Carregando…</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <Button asChild variant="ghost" size="sm" className="-ml-2"><Link to="/app/transacoes"><ArrowLeft className="h-4 w-4" /> Voltar para transações</Link></Button>

      <PageHeader
        eyebrow={dateBR(tx.date)}
        title={tx.description}
        subtitle={tx.counterparty}
        actions={
          <>
            <Button variant="outline" size="sm"><Edit className="h-4 w-4" /> Editar</Button>
            <Button size="sm"><Check className="h-4 w-4" /> Marcar revisado</Button>
          </>
        }
      />

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-lg border border-border bg-card p-6 space-y-5">
          <div className="grid grid-cols-2 gap-5">
            <div><p className="text-xs uppercase text-muted-foreground tracking-wider">Valor</p><p className={`mt-1 text-2xl font-semibold num ${tx.direction === "in" ? "text-success" : "text-foreground"}`}>{tx.direction === "in" ? "+ " : "− "}{brl(tx.amount)}</p></div>
            <div><p className="text-xs uppercase text-muted-foreground tracking-wider">Direção</p><p className="mt-1 font-medium">{tx.direction === "in" ? "Entrada" : "Saída"}</p></div>
            <div><p className="text-xs uppercase text-muted-foreground tracking-wider">Categoria</p><p className="mt-1 font-medium">{cat?.name ?? <span className="text-destructive">Sem categoria</span>}</p></div>
            <div><p className="text-xs uppercase text-muted-foreground tracking-wider">Origem</p><p className="mt-1 font-medium capitalize">{tx.source}</p></div>
            <div><p className="text-xs uppercase text-muted-foreground tracking-wider">Status de revisão</p><div className="mt-1"><Badge variant="secondary">{tx.reviewStatus}</Badge></div></div>
            <div><p className="text-xs uppercase text-muted-foreground tracking-wider">Comprovantes</p><p className="mt-1 font-medium">{tx.evidenceCount}</p></div>
          </div>
        </div>
        <AIInsightCard
          title="Contta AI sobre esta transação"
          summary={`Esta saída faz parte do grupo "${cat?.group ?? "—"}". O padrão de gastos com este fornecedor cresceu nas últimas semanas.`}
          confidence="with-caveats"
          details={["Frequência: 3 lançamentos similares em 30 dias","Categoria sugerida: confirme antes do fechamento"]}
          askLabel="Perguntar sobre esta transação"
        />
      </div>
    </div>
  );
}
