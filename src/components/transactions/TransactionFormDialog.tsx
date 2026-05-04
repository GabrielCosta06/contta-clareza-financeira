import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { categoriesRepo, transactionsRepo } from "@/services";
import { toast } from "@/components/ui/sonner";
import type { Transaction } from "@/domain/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When provided, dialog is in edit mode. */
  transaction?: Transaction | null;
}

const todayIso = () => new Date().toISOString().slice(0, 10);

export function TransactionFormDialog({ open, onOpenChange, transaction }: Props) {
  const isEdit = !!transaction;
  const qc = useQueryClient();
  const { data: cats = [] } = useQuery({ queryKey: ["cats"], queryFn: () => categoriesRepo.list() });

  const [date, setDate] = useState(todayIso());
  const [direction, setDirection] = useState<"in" | "out">("out");
  const [description, setDescription] = useState("");
  const [counterparty, setCounterparty] = useState("");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (transaction) {
      setDate(transaction.date.slice(0, 10));
      setDirection(transaction.direction);
      setDescription(transaction.description);
      setCounterparty(transaction.counterparty || "");
      setAmount(String(transaction.amount));
      setCategoryId(transaction.categoryId || "");
      setNotes(transaction.notes || "");
    } else {
      setDate(todayIso());
      setDirection("out");
      setDescription("");
      setCounterparty("");
      setAmount("");
      setCategoryId("");
      setNotes("");
    }
  }, [open, transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const value = Number(amount.replace(",", "."));
    if (!description.trim() || !value || Number.isNaN(value)) {
      toast.error("Preencha descrição e valor.");
      return;
    }
    setSaving(true);
    try {
      if (isEdit && transaction) {
        await transactionsRepo.update(transaction.id, {
          date: new Date(date).toISOString(),
          description: description.trim(),
          counterparty: counterparty.trim() || undefined,
          amount: value,
          direction,
          categoryId: categoryId || undefined,
          notes: notes.trim() || undefined,
          reviewStatus: categoryId ? "reviewed" : "needs-categorization",
        });
        toast.success("Transação atualizada.");
        qc.invalidateQueries({ queryKey: ["tx", transaction.id] });
      } else {
        await transactionsRepo.create({
          date: new Date(date).toISOString(),
          description: description.trim(),
          counterparty: counterparty.trim() || undefined,
          amount: value,
          direction,
          categoryId: categoryId || undefined,
          notes: notes.trim() || undefined,
        });
        toast.success("Transação criada.");
      }
      qc.invalidateQueries({ queryKey: ["transactions"] });
      qc.invalidateQueries({ queryKey: ["review"] });
      onOpenChange(false);
    } catch (err) {
      toast.error("Não foi possível salvar.", { description: (err as Error).message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Editar transação" : "Nova transação"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Ajuste os campos e salve para atualizar a leitura." : "Adicione um lançamento manual ao seu fluxo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tx-date">Data</Label>
              <Input id="tx-date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tx-direction">Tipo</Label>
              <Select value={direction} onValueChange={v => setDirection(v as "in" | "out")}>
                <SelectTrigger id="tx-direction"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Entrada</SelectItem>
                  <SelectItem value="out">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tx-desc">Descrição</Label>
            <Input id="tx-desc" value={description} onChange={e => setDescription(e.target.value)} placeholder="Ex.: Pagamento fornecedor" required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="tx-cp">Contraparte</Label>
              <Input id="tx-cp" value={counterparty} onChange={e => setCounterparty(e.target.value)} placeholder="Opcional" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tx-amount">Valor (R$)</Label>
              <Input id="tx-amount" type="number" step="0.01" min="0" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0,00" required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tx-cat">Categoria</Label>
            <Select value={categoryId || "none"} onValueChange={v => setCategoryId(v === "none" ? "" : v)}>
              <SelectTrigger id="tx-cat"><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sem categoria (ir para revisão)</SelectItem>
                {cats.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="tx-notes">Observações</Label>
            <Textarea id="tx-notes" value={notes} onChange={e => setNotes(e.target.value)} rows={2} placeholder="Opcional" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={saving}>Cancelar</Button>
            <Button type="submit" disabled={saving}>{saving ? "Salvando…" : isEdit ? "Salvar" : "Criar transação"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
