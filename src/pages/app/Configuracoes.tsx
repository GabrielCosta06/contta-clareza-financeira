import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { categoriesRepo, companyRepo } from "@/services";
import { useCompanies } from "@/hooks/useCompanies";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Building2, Link2, Tags, Bell, Lock, LifeBuoy, ChevronRight, Plus, Mail } from "lucide-react";
import { dateBR, brl } from "@/lib/format";
import { toast } from "@/components/ui/sonner";

type DialogKey = null | "categorias" | "alertas" | "privacidade" | "suporte" | "connect";

export default function Configuracoes() {
  const { data: company } = useQuery({ queryKey: ["company"], queryFn: () => companyRepo.current() });
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => companyRepo.accounts() });
  const { data: cats = [] } = useQuery({ queryKey: ["cats"], queryFn: () => categoriesRepo.list() });
  const { companies, subscription, canAddCompany, estimatedMonthly } = useCompanies();
  const [open, setOpen] = useState<DialogKey>(null);

  const sections: { key: DialogKey; Icon: typeof Tags; t: string; d: string }[] = [
    { key: "categorias", Icon: Tags, t: "Categorias", d: "Estrutura de categorização das transações." },
    { key: "alertas", Icon: Bell, t: "Preferências de alertas", d: "Quando e como ser avisado." },
    { key: "privacidade", Icon: Lock, t: "Privacidade", d: "Acessos, papéis e auditoria." },
    { key: "suporte", Icon: LifeBuoy, t: "Suporte", d: "Falar com o time do Contta." },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Configurações" subtitle="Ajustes da empresa, conexões e preferências da sua leitura semanal." />

      <Link
        to="/app/configuracoes/empresas"
        className="group block rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/30 hover:shadow-card"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-md bg-primary text-primary-foreground transition-transform group-hover:scale-105">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-semibold">Empresas</h2>
                <Badge variant="outline" className="text-[10px]">
                  {companies.length} no plano {subscription?.planLabel ?? "—"}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Gerencie todas as empresas, alterne entre elas e adicione novas.
                {estimatedMonthly !== null && (
                  <> Estimativa atual: <strong>{brl(estimatedMonthly)}/mês</strong>.</>
                )}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canAddCompany && (
              <Badge variant="secondary" className="text-[10px]">
                <Plus className="mr-1 h-3 w-3" />
                Pode adicionar mais
              </Badge>
            )}
            <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-border/80">
          <div className="flex items-center gap-3 mb-4"><Building2 className="h-5 w-5 text-primary" /><h2 className="font-semibold">Empresa atual</h2></div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Nome fantasia</dt><dd className="font-medium truncate">{company?.tradeName}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Razão social</dt><dd className="font-medium truncate">{company?.legalName}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">CNPJ</dt><dd className="font-medium num">{company?.cnpj}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Regime</dt><dd className="font-medium">{company?.taxRegime}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Segmento</dt><dd className="font-medium truncate">{company?.segment}</dd></div>
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 transition-colors hover:border-border/80">
          <div className="flex items-center gap-3 mb-4"><Link2 className="h-5 w-5 text-primary" /><h2 className="font-semibold">Contas conectadas</h2></div>
          <ul className="space-y-3">
            {accounts.map(a => (
              <li key={a.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="min-w-0">
                  <p className="font-medium truncate">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.lastSyncAt ? `Última sincronização: ${dateBR(a.lastSyncAt)}` : "—"}</p>
                </div>
                <Badge variant={a.status === "connected" ? "outline" : a.status === "pending" ? "secondary" : "destructive"} className="shrink-0 text-[10px]">{a.status === "connected" ? "Conectada" : a.status === "pending" ? "Pendente" : "Erro"}</Badge>
              </li>
            ))}
          </ul>
          <Button size="sm" variant="outline" className="mt-4 w-full" onClick={() => setOpen("connect")}>
            Conectar nova conta
          </Button>
        </div>

        {sections.map(s => (
          <button
            type="button"
            key={s.t}
            onClick={() => setOpen(s.key)}
            className="group rounded-lg border border-border bg-card p-5 text-left transition-all hover:border-primary/30 hover:shadow-card"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-primary-soft text-primary transition-transform group-hover:scale-110">
                <s.Icon className="h-4 w-4" />
              </div>
              <h2 className="font-semibold">{s.t}</h2>
            </div>
            <p className="text-sm text-muted-foreground">{s.d}</p>
          </button>
        ))}
      </div>

      {/* Categorias */}
      <Dialog open={open === "categorias"} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Categorias</DialogTitle>
            <DialogDescription>Estrutura usada para organizar suas transações em receita, custo, despesa e impostos.</DialogDescription>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto pr-1">
            <ul className="divide-y divide-border rounded-md border border-border">
              {cats.map(c => (
                <li key={c.id} className="flex items-center justify-between gap-3 px-4 py-2.5 text-sm">
                  <span className="font-medium">{c.name}</span>
                  <Badge variant="outline" className="text-[10px]">{c.group}</Badge>
                </li>
              ))}
            </ul>
          </div>
          <DialogFooter>
            <p className="text-xs text-muted-foreground mr-auto">Edição personalizada disponível no plano Profissional.</p>
            <Button variant="outline" onClick={() => setOpen(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Alertas */}
      <AlertasDialog open={open === "alertas"} onClose={() => setOpen(null)} />

      {/* Privacidade */}
      <Dialog open={open === "privacidade"} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Privacidade e acessos</DialogTitle>
            <DialogDescription>Controle quem acessa os dados desta empresa e veja a auditoria recente.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div className="rounded-md border border-border p-3">
              <p className="font-medium">Membros</p>
              <p className="mt-1 text-muted-foreground text-xs">Você é o único membro com acesso de proprietário.</p>
            </div>
            <div className="rounded-md border border-border p-3">
              <p className="font-medium">Auditoria</p>
              <p className="mt-1 text-muted-foreground text-xs">Sem alterações sensíveis nas últimas 24h.</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Leia também a <Link to="/privacidade" className="text-primary underline-offset-2 hover:underline">política de privacidade</Link>.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(null)}>Fechar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suporte */}
      <SuporteDialog open={open === "suporte"} onClose={() => setOpen(null)} />

      {/* Conectar nova conta */}
      <ConnectAccountDialog open={open === "connect"} onClose={() => setOpen(null)} />
    </div>
  );
}

const AlertasDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [weekly, setWeekly] = useState(true);
  const [critical, setCritical] = useState(true);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Preferências de alertas</DialogTitle>
          <DialogDescription>Escolha quando e como o Contta deve te avisar.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {[
            { l: "Resumo semanal por e-mail", v: weekly, set: setWeekly },
            { l: "Alertas críticos (caixa, fiscal)", v: critical, set: setCritical },
            { l: "Notificações por e-mail", v: email, set: setEmail },
            { l: "Notificações push (em breve)", v: push, set: setPush },
          ].map((row) => (
            <div key={row.l} className="flex items-center justify-between gap-3 rounded-md border border-border px-3 py-2.5">
              <Label className="text-sm font-medium">{row.l}</Label>
              <Switch checked={row.v} onCheckedChange={row.set} />
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={() => { toast.success("Preferências salvas."); onClose(); }}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const SuporteDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [msg, setMsg] = useState("");
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Falar com o suporte</DialogTitle>
          <DialogDescription>Conte sua dúvida ou problema. Respondemos em até 1 dia útil.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <a
            href="mailto:suporte@contta.com.br"
            className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5 text-sm transition-colors hover:border-primary/40"
          >
            <Mail className="h-4 w-4 text-primary" />
            <span>suporte@contta.com.br</span>
          </a>
          <div className="space-y-1.5">
            <Label htmlFor="sup-msg">Mensagem</Label>
            <Textarea id="sup-msg" rows={4} value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Como podemos ajudar?" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button
            disabled={!msg.trim()}
            onClick={() => { toast.success("Mensagem enviada.", { description: "Em breve nossa equipe responde no seu e-mail." }); setMsg(""); onClose(); }}
          >
            Enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ConnectAccountDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [name, setName] = useState("");
  const [kind, setKind] = useState<"bank" | "csv" | "erp">("bank");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Conta enviada para conexão.", { description: "Você receberá uma notificação quando estiver sincronizada." });
      setName("");
      onClose();
    }, 600);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Conectar nova conta</DialogTitle>
          <DialogDescription>Banco, maquininha ou planilha. A sincronização inicial pode levar alguns minutos.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            {([
              { k: "bank", l: "Banco" },
              { k: "erp", l: "Maquininha" },
              { k: "csv", l: "Planilha" },
            ] as const).map((opt) => (
              <button
                key={opt.k}
                type="button"
                onClick={() => setKind(opt.k)}
                className={`rounded-md border px-3 py-2.5 text-sm transition-colors ${kind === opt.k ? "border-primary bg-primary-soft/40 text-primary" : "border-border hover:border-primary/30"}`}
              >
                {opt.l}
              </button>
            ))}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="acc-name">Nome da conta</Label>
            <Input id="acc-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex.: Itaú PJ — matriz" />
          </div>
          <p className="text-xs text-muted-foreground">
            A conexão automática com bancos e maquininhas estará disponível em breve. Por enquanto, registramos sua intenção e nossa equipe ajuda no setup.
          </p>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>Cancelar</Button>
          <Button onClick={submit} disabled={submitting || !name.trim()}>
            {submitting ? "Enviando…" : "Solicitar conexão"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
