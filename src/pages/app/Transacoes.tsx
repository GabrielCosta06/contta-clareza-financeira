import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "react-router-dom";
import { transactionsRepo, categoriesRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { brl, dateBR } from "@/lib/format";
import { Search, Upload, Plus, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";

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
  const { data = [], isLoading } = useQuery({
    queryKey: ["transactions", search, status, cat],
    queryFn: () => transactionsRepo.list({ search, status, categoryId: cat }),
  });
  const { data: cats = [] } = useQuery({ queryKey: ["cats"], queryFn: () => categoriesRepo.list() });

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
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por descrição ou contraparte" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-52"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="needs-categorization">Sem categoria</SelectItem>
            <SelectItem value="needs-evidence">Sem comprovante</SelectItem>
            <SelectItem value="reviewed">Revisado</SelectItem>
          </SelectContent>
        </Select>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-56"><SelectValue placeholder="Categoria" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {cats.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-lg border border-border bg-card overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-sm text-muted-foreground">Carregando transações…</div>
        ) : data.length === 0 ? (
          <EmptyState title="Nada por aqui ainda" description="Quando você importar ou conectar dados, as transações aparecem aqui categorizadas e prontas para a leitura." />
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-4 py-3">Data</th>
                <th className="text-left font-medium px-4 py-3">Descrição</th>
                <th className="text-left font-medium px-4 py-3">Categoria</th>
                <th className="text-left font-medium px-4 py-3">Status</th>
                <th className="text-right font-medium px-4 py-3">Valor</th>
              </tr>
            </thead>
            <tbody>
              {data.map(t => {
                const c = cats.find(x => x.id === t.categoryId);
                const s = statusLabels[t.reviewStatus] ?? statusLabels.reviewed;
                return (
                  <tr key={t.id} className="border-t hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 text-muted-foreground whitespace-nowrap num">{dateBR(t.date)}</td>
                    <td className="px-4 py-3">
                      <Link to={`/app/transacoes/${t.id}`} className="font-medium text-foreground hover:text-primary flex items-center gap-2">
                        {t.direction === "in" ? <ArrowDownLeft className="h-3.5 w-3.5 text-success" /> : <ArrowUpRight className="h-3.5 w-3.5 text-destructive" />}
                        {t.description}
                      </Link>
                      {t.counterparty && <p className="text-xs text-muted-foreground mt-0.5">{t.counterparty}</p>}
                    </td>
                    <td className="px-4 py-3">
                      {c ? <span className="text-foreground">{c.name}</span> : <span className="text-destructive text-xs font-medium">Sem categoria</span>}
                    </td>
                    <td className="px-4 py-3"><Badge variant={s.variant} className="text-[10px]">{s.label}</Badge></td>
                    <td className={`px-4 py-3 text-right font-medium num ${t.direction === "in" ? "text-success" : "text-foreground"}`}>
                      {t.direction === "in" ? "+ " : "− "}{brl(t.amount)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{data.length} transações · Fonte: bancos, maquininha e lançamentos manuais.</p>
    </div>
  );
}
