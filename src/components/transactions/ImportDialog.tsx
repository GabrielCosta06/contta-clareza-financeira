import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { transactionsRepo } from "@/services";
import { toast } from "@/components/ui/sonner";
import { Upload, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import type { ImportJob } from "@/domain/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: Props) {
  const qc = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [job, setJob] = useState<ImportJob | null>(null);
  const [busy, setBusy] = useState(false);

  const reset = () => { setFile(null); setJob(null); setBusy(false); };

  const onClose = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleImport = async () => {
    if (!file) return;
    setBusy(true);
    try {
      const result = await transactionsRepo.importFile(file);
      setJob(result);
      qc.invalidateQueries({ queryKey: ["transactions"] });
      toast.success("Importação concluída", { description: `${result.rowsImported} de ${result.rowsTotal} linhas processadas.` });
    } catch (err) {
      toast.error("Falha na importação.", { description: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar transações</DialogTitle>
          <DialogDescription>
            Envie um CSV ou OFX exportado do seu banco. Vamos categorizar e levar os itens incertos para a revisão.
          </DialogDescription>
        </DialogHeader>

        {!job ? (
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="w-full rounded-lg border-2 border-dashed border-border bg-muted/20 p-6 text-center transition-colors hover:bg-muted/40"
            >
              <Upload className="mx-auto h-6 w-6 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">Clique para selecionar arquivo</p>
              <p className="text-xs text-muted-foreground">CSV ou OFX, até 10 MB</p>
            </button>
            <input
              ref={inputRef}
              type="file"
              accept=".csv,.ofx,text/csv"
              className="hidden"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
            />
            {file && (
              <div className="flex items-center gap-3 rounded-md border border-border bg-card p-3 text-sm">
                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 truncate">{file.name}</span>
                <span className="text-xs text-muted-foreground">{Math.round(file.size / 1024)} KB</span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-lg border border-success/30 bg-success-soft p-4 text-sm">
            <div className="flex items-center gap-2 font-medium text-success">
              <CheckCircle2 className="h-4 w-4" /> Importação concluída
            </div>
            <p className="mt-2 text-foreground">
              {job.rowsImported} de {job.rowsTotal} linhas processadas.
            </p>
            {job.rowsImported < job.rowsTotal && (
              <p className="mt-1 text-xs text-muted-foreground">
                {job.rowsTotal - job.rowsImported} item(s) foram para a fila de revisão.
              </p>
            )}
          </div>
        )}

        <DialogFooter>
          {job ? (
            <Button onClick={() => onClose(false)}>Fechar</Button>
          ) : (
            <>
              <Button variant="ghost" onClick={() => onClose(false)} disabled={busy}>Cancelar</Button>
              <Button onClick={handleImport} disabled={!file || busy}>
                {busy ? "Importando…" : "Importar"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
