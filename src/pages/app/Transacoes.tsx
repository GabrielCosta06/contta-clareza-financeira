import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { transactionsRepo, categoriesRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brl, dateBR } from "@/lib/format";
import { Search, Upload, Plus, ArrowUpRight, ArrowDownLeft, Receipt } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { DataTable, type DataTableColumn } from "@/components/DataTable";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import type { Transaction } from "@/domain/types";

const statusLabels: Record<string, { label: string; variant: any }> = {
  reviewed: { label: "Revisado", variant: "outline" },
  pending: { label: "Pendente", variant: "secondary" },
  "needs-categorization": { label: "Sem categoria", variant: "destructive" },
  "needs-evidence": { label: "Sem comprovante", variant: "secondary" },
};

export default function Transacoes() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [cat, setCat] = useState("all");
  const navigate = useNavigate();
  const { data = [], isLoading } = useQuery({
    queryKey: ["transactions", search, status, cat],
    queryFn: () => transactionsRepo.list({ search, status, categoryId: cat }),
  });
  const { data: cats = [] } = useQuery({ queryKey: ["cats"], queryFn: () => categoriesRepo.list() });

  const columns: DataTableColumn<Transaction>[] = [
    {
      key: "date",
      header: "Data",
      cell: t => <span className="text-muted-foreground whitespace-nowrap num">{dateBR(t.date)}</span>,
    },
    {
      key: "description",
      header: "Descrição",
      cell: t => (
        <div>
          <p className="font-medium text-foreground flex items-center gap-2">
            {t.direction === "in"
              ? <ArrowDownLeft className="h-3.5 w-3.5 text-success shrink-0" />
              : <ArrowUpRight className="h-3.5 w-3.5 text-destructive shrink-0" />}
            <span className="truncate">{t.description}</span>
          </p>
          {t.counterparty && <p className="text-xs text-muted-foreground mt-0.5">{t.counterparty}</p>}
        </div>
      ),
    },
    {
      key: "category",
      header: "Categoria",
      cell: t => {
        const c = cats.find(x => x.id === t.categoryId);
        return c
          ? <span className="text-foreground">{c.name}</span>
          : <span className="text-destructive text-xs font-medium">Sem categoria</span>;
      },
    },
    {
      key: "status",
      header: "Status",
      cell: t => {
        const s = statusLabels[t.reviewStatus] ?? statusLabels.reviewed;
        return <Badge variant={s.variant} className="text-[10px]">{s.label}</Badge>;
      },
    },
    {
      key: "amount",
      header: "Valor",
      align: "right",
      cell: t => (
        <span className={`font-medium num ${t.direction === "in" ? "text-success" : "text-foreground"}`}>
          {t.direction === "in" ? "+ " : "− "}{brl(t.amount)}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Transações"
        subtitle="Tudo o que entrou e saiu, organizado para virar leitura."
        actions={
          <>
            <Button variant="outline" size="sm"><Upload className="h-4 w-4" /> Importar</Button>
            <Button size="sm"><Plus className="h-4 w-4" /> Nova transação</Button>
          </>
        }
      />

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px] sm:min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por descrição ou contraparte" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="needs-categorization">Sem categoria</SelectItem>
            <SelectItem value="needs-evidence">Sem comprovante</SelectItem>
            <SelectItem value="reviewed">Revisado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-full sm:w-56"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {cats.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <TableSkeleton rows={6} cols={5} />
      ) : (
        <DataTable
          rows={data}
          columns={columns}
          rowKey={t => t.id}
          caption="Lista de transações"
          onRowClick={t => navigate(`/app/transacoes/${t.id}`)}
          empty={
            <EmptyState
              icon={<Receipt className="h-5 w-5" />}
              title="Nada por aqui ainda"
              description="Quando você importar ou conectar dados, as transações aparecem aqui categorizadas e prontas para a leitura."
              action={<Button size="sm"><Upload className="h-4 w-4" /> Importar agora</Button>}
            />
          }
        />
      )}
      {!isLoading && data.length > 0 && (
        <p className="text-xs text-muted-foreground">{data.length} transações · Fonte: bancos, maquininha e lançamentos manuais.</p>
      )}
    </div>
  );
}
