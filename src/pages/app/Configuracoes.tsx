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
      <PageHeader title="Configurações" subtitle="Parâmetros operacionais que sustentam a leitura financeira." />

      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-4"><Building2 className="h-5 w-5 text-primary" /><h2 className="font-semibold">Empresa atual</h2></div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Nome fantasia</dt><dd className="font-medium">{company?.tradeName}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Razão social</dt><dd className="font-medium">{company?.legalName}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">CNPJ</dt><dd className="font-medium num">{company?.cnpj}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Regime</dt><dd className="font-medium">{company?.taxRegime}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Segmento</dt><dd className="font-medium">{company?.segment}</dd></div>
          </dl>
        </div>

        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-4"><Link2 className="h-5 w-5 text-primary" /><h2 className="font-semibold">Contas conectadas</h2></div>
          <ul className="space-y-3">
            {accounts.map(a => (
              <li key={a.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.lastSyncAt ? `Última sincronização: ${dateBR(a.lastSyncAt)}` : "—"}</p>
                </div>
                <Badge variant={a.status === "connected" ? "outline" : a.status === "pending" ? "secondary" : "destructive"} className="text-[10px]">{a.status === "connected" ? "Conectada" : a.status === "pending" ? "Pendente" : "Erro"}</Badge>
              </li>
            ))}
          </ul>
          <Button size="sm" variant="outline" className="mt-4 w-full">Conectar nova conta</Button>
        </div>

        {sections.slice(2).map(s => (
          <div key={s.t} className="rounded-lg border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-2"><s.Icon className="h-5 w-5 text-primary" /><h2 className="font-semibold">{s.t}</h2></div>
            <p className="text-sm text-muted-foreground">{s.d}</p>
            <Button size="sm" variant="ghost" className="mt-3 -ml-3 text-primary">Abrir</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
