import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Check, ChevronDown, Plus, Settings2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompanies } from "@/hooks/useCompanies";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { brl } from "@/lib/format";

export const CompanySwitcher = () => {
  const navigate = useNavigate();
  const {
    active,
    companies,
    subscription,
    canAddCompany,
    extraCompanies,
    estimatedMonthly,
    switchTo,
  } = useCompanies();
  const [switching, setSwitching] = useState<string | null>(null);

  const handleSwitch = async (id: string) => {
    if (id === active?.id) return;
    setSwitching(id);
    try {
      await switchTo(id);
      const next = companies.find((c) => c.id === id);
      toast.success("Empresa alterada", { description: next?.tradeName });
    } finally {
      setSwitching(null);
    }
  };

  const handleCreate = () => {
    if (canAddCompany) {
      navigate("/app/onboarding?mode=new");
      return;
    }
    navigate("/app/configuracoes/empresas");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="min-w-0 gap-2 px-2">
          <div className="grid h-7 w-7 shrink-0 place-items-center rounded bg-primary-soft text-primary">
            <Building2 className="h-3.5 w-3.5" />
          </div>
          <div className="hidden min-w-0 text-left sm:block">
            <p className="text-xs leading-none text-muted-foreground">Empresa atual</p>
            <p className="mt-0.5 max-w-[160px] truncate text-sm font-medium leading-tight">
              {active?.tradeName ?? <Skeleton className="h-3 w-24" />}
            </p>
          </div>
          <ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="flex items-center justify-between gap-2">
          <span>Empresas</span>
          {subscription && (
            <span className="text-[10px] font-normal text-muted-foreground">
              {companies.length}/{subscription.maxCompanies === Infinity ? "∞" : subscription.maxCompanies} no plano {subscription.planLabel}
            </span>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />

        <div className="max-h-72 overflow-y-auto py-1">
          {companies.map((c) => {
            const isActive = c.id === active?.id;
            return (
              <DropdownMenuItem
                key={c.id}
                onSelect={(e) => {
                  e.preventDefault();
                  handleSwitch(c.id);
                }}
                className={cn(
                  "flex items-start gap-2 py-2",
                  isActive && "bg-primary-soft/40",
                )}
                disabled={switching !== null && switching !== c.id}
              >
                <div className="grid h-6 w-6 shrink-0 place-items-center rounded bg-muted">
                  <Building2 className="h-3 w-3 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium leading-tight">{c.tradeName}</p>
                  <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
                    {c.cnpj} · {c.taxRegime}
                  </p>
                </div>
                {isActive && <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </div>

        <DropdownMenuSeparator />

        {canAddCompany ? (
          <DropdownMenuItem onSelect={handleCreate} className="gap-2 text-primary">
            <Plus className="h-4 w-4" />
            Adicionar nova empresa
            {subscription?.addonPricePerCompany ? (
              <span className="ml-auto text-[10px] text-muted-foreground">
                + {brl(subscription.addonPricePerCompany)}/mês
              </span>
            ) : null}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onSelect={handleCreate} className="gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <div className="flex flex-1 flex-col">
              <span className="text-sm">Limite do plano atingido</span>
              <span className="text-[10px] text-muted-foreground">
                Faça upgrade para adicionar mais empresas.
              </span>
            </div>
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onSelect={() => navigate("/app/configuracoes/empresas")} className="gap-2">
          <Settings2 className="h-4 w-4" />
          Gerenciar empresas
          {extraCompanies > 0 && estimatedMonthly !== null && (
            <span className="ml-auto text-[10px] text-muted-foreground">
              {brl(estimatedMonthly)}/mês
            </span>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
