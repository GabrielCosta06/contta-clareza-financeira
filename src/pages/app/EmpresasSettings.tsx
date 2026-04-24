import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Building2,
  Check,
  CreditCard,
  Plus,
  Sparkles,
} from "lucide-react";

import { useCompanies } from "@/hooks/useCompanies";
import { subscriptionRepo } from "@/services";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { brl, dateBR } from "@/lib/format";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import type { SubscriptionPlan } from "@/domain/types";

export default function EmpresasSettings() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const {
    active,
    companies,
    subscription,
    canAddCompany,
    extraCompanies,
    estimatedMonthly,
    switchTo,
    loading,
  } = useCompanies();

  const handleSwitch = async (id: string) => {
    if (id === active?.id) return;
    await switchTo(id);
    toast.success("Empresa alterada");
  };

  const handleUpgrade = async (plan: SubscriptionPlan) => {
    await subscriptionRepo.setPlan(plan);
    await qc.invalidateQueries();
    toast.success("Plano atualizado", { description: "Agora você pode adicionar mais empresas." });
  };

  const limitLabel = subscription
    ? subscription.maxCompanies === Infinity
      ? "ilimitado"
      : `${companies.length} de ${subscription.maxCompanies}`
    : "—";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => navigate("/app/configuracoes")}
          className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Configurações
        </button>
        <span>/</span>
        <span className="text-foreground">Empresas</span>
      </div>

      <PageHeader
        title="Empresas"
        subtitle="Gerencie todas as empresas da sua conta, alterne entre elas e adicione novas conforme seu plano."
      />

      {/* Plan summary */}
      <div className="rounded-xl border border-border bg-gradient-to-br from-primary-soft/40 via-card to-card p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-primary-foreground">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-primary">Plano atual</p>
              <p className="mt-0.5 text-lg font-semibold">
                {subscription?.planLabel ?? <Skeleton className="h-5 w-32" />}
              </p>
              <p className="text-xs text-muted-foreground">
                Empresas: {limitLabel}
                {extraCompanies > 0 && subscription?.addonPricePerCompany ? (
                  <>
                    {" "}· {extraCompanies} adicional(is) ×{" "}
                    {brl(subscription.addonPricePerCompany)}/mês
                  </>
                ) : null}
              </p>
            </div>
          </div>

          <div className="text-left md:text-right">
            <p className="text-xs text-muted-foreground">Estimativa mensal</p>
            <p className="text-2xl font-semibold tracking-tight">
              {estimatedMonthly !== null ? brl(estimatedMonthly) : "—"}
              <span className="ml-1 text-sm font-normal text-muted-foreground">/mês</span>
            </p>
          </div>
        </div>
      </div>

      {/* Companies list */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold">Suas empresas</h2>
            <p className="text-xs text-muted-foreground">
              {companies.length} empresa{companies.length === 1 ? "" : "s"} na sua conta
            </p>
          </div>
          {canAddCompany ? (
            <Button onClick={() => navigate("/app/onboarding?mode=new")} size="sm">
              <Plus className="h-4 w-4" />
              Nova empresa
            </Button>
          ) : (
            <UpgradeDialog onUpgrade={handleUpgrade} currentPlan={subscription?.plan} />
          )}
        </div>

        <ul className="divide-y divide-border">
          {loading && companies.length === 0 && (
            <li className="px-5 py-4">
              <Skeleton className="h-12 w-full" />
            </li>
          )}
          {companies.map((c) => {
            const isActive = c.id === active?.id;
            return (
              <li
                key={c.id}
                className={cn(
                  "flex flex-col gap-3 px-5 py-4 transition-colors sm:flex-row sm:items-center sm:justify-between",
                  isActive && "bg-primary-soft/20",
                )}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={cn(
                      "grid h-10 w-10 shrink-0 place-items-center rounded-lg",
                      isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                    )}
                  >
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="truncate font-medium">{c.tradeName}</p>
                      {isActive && (
                        <Badge variant="outline" className="border-primary/30 bg-primary-soft/40 text-primary text-[10px]">
                          Ativa
                        </Badge>
                      )}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {c.legalName} · {c.cnpj} · {c.taxRegime}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Criada em {dateBR(c.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {isActive ? (
                    <Button variant="ghost" size="sm" disabled>
                      <Check className="h-4 w-4 text-primary" />
                      Em uso
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={() => handleSwitch(c.id)}>
                      Alternar
                    </Button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Add-on cost banner for personalizavel */}
      {subscription?.addonPricePerCompany ? (
        <div className="rounded-lg border border-info/20 bg-info-soft/40 p-4 text-sm text-foreground">
          <p className="font-medium">Como funciona o custo por empresa adicional</p>
          <p className="mt-1 text-muted-foreground">
            No plano {subscription.planLabel}, cada empresa além da primeira adiciona{" "}
            <strong>{brl(subscription.addonPricePerCompany)}/mês</strong> à sua fatura. O valor entra automaticamente no próximo ciclo.
          </p>
        </div>
      ) : null}
    </div>
  );
}

interface UpgradeDialogProps {
  onUpgrade: (plan: SubscriptionPlan) => Promise<void>;
  currentPlan?: SubscriptionPlan;
}

const UpgradeDialog = ({ onUpgrade, currentPlan }: UpgradeDialogProps) => {
  const options: { plan: SubscriptionPlan; label: string; price: string; perks: string }[] = [
    { plan: "profissional", label: "Profissional", price: "R$ 249/mês", perks: "Até 3 empresas, conexão com bancos." },
    { plan: "personalizavel", label: "Personalizável", price: "R$ 249 + R$ 100/empresa", perks: "Empresas ilimitadas, suporte dedicado." },
  ];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="default" className="gap-1.5">
          <Sparkles className="h-4 w-4" />
          Fazer upgrade
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-primary" />
            Você atingiu o limite do plano atual
          </DialogTitle>
          <DialogDescription>
            Faça upgrade para adicionar mais empresas à sua conta. A alteração é instantânea.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          {options.filter(o => o.plan !== currentPlan).map((opt) => (
            <button
              key={opt.plan}
              onClick={() => onUpgrade(opt.plan)}
              className="w-full rounded-lg border border-border bg-card p-4 text-left transition-all hover:border-primary/40 hover:shadow-card"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold">{opt.label}</p>
                <span className="text-sm font-medium text-primary">{opt.price}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{opt.perks}</p>
            </button>
          ))}
        </div>

        <DialogFooter>
          <p className="text-xs text-muted-foreground">
            Esta é uma simulação. A integração com cobrança real será feita em breve.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
