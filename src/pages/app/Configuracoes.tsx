import { useQuery } from "@tanstack/react-query";
import { companyRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Link2, Tags, Bell, Lock, LifeBuoy } from "lucide-react";
import { dateBR } from "@/lib/format";

export default function Configuracoes() {
  const { data: company } = useQuery({ queryKey: ["company"], queryFn: () => companyRepo.current() });
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => companyRepo.accounts() });

  const sections = [
    { Icon: Building2, t: "Empresa", d: "Razão social, CNPJ e regime tributário." },
    { Icon: Link2, t: "Contas e conexões", d: "Bancos, maquininha e fontes de dados." },
    { Icon: Tags, t: "Categorias", d: "Estrutura de categorização das transações." },
    { Icon: Bell, t: "Preferências de alertas", d: "Quando e como ser avisado." },
    { Icon: Lock, t: "Privacidade", d: "Acessos, papéis e auditoria." },
    { Icon: LifeBuoy, t: "Suporte", d: "Falar com o time do Contta." },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader title="Configurações" subtitle="Ajustes da empresa, conexões e preferências da sua leitura semanal." />

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
          <Button size="sm" variant="outline" className="mt-4 w-full">Conectar nova conta</Button>
        </div>

        {sections.slice(2).map(s => (
          <button
            type="button"
            key={s.t}
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
    </div>
  );
}
