import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  ArrowRight,
  Building2,
  Check,
  ChevronLeft,
  CreditCard,
  Landmark,
  Lock,
  ReceiptText,
  Settings2,
  ShieldCheck,
  Sparkles,
  Store,
} from "lucide-react";

import { authService, companyRepo } from "@/services";
import { useDemoScenario } from "@/hooks/useDemoScenario";
import { useCompanies } from "@/hooks/useCompanies";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";
import { brl } from "@/lib/format";
import type { Company } from "@/domain/types";

const onboardingSchema = z.object({
  tradeName: z.string().min(3, "Informe o nome fantasia usado pela empresa."),
  cnpj: z
    .string()
    .min(14, "Informe um CNPJ válido.")
    .regex(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, "Use o formato 00.000.000/0000-00."),
  taxRegime: z.enum(["MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real"]),
  sources: z.array(z.string()).default([]),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

const dataSourceCards = [
  {
    id: "itau",
    name: "Itaú PJ",
    description: "Conta bancária principal para entradas e saídas.",
    Icon: Landmark,
    accent: "bg-warning-soft text-warning border-warning/25",
  },
  {
    id: "bb",
    name: "Banco do Brasil",
    description: "Conta operacional com conciliação bancária.",
    Icon: Building2,
    accent: "bg-info-soft text-info border-info/25",
  },
  {
    id: "stone",
    name: "Stone",
    description: "Repasse e agenda da maquininha de cartão.",
    Icon: CreditCard,
    accent: "bg-success-soft text-success border-success/25",
  },
  {
    id: "cielo",
    name: "Cielo",
    description: "Agenda de recebíveis de cartão e antecipações.",
    Icon: Store,
    accent: "bg-primary-soft text-primary border-primary/25",
  },
  {
    id: "csv",
    name: "Importar CSV",
    description: "Extratos, ERP ou planilha financeira já existente.",
    Icon: ReceiptText,
    accent: "bg-secondary text-secondary-foreground border-border",
  },
  {
    id: "manual",
    name: "Começar manual",
    description: "Lançamentos iniciais enquanto a integração não entra.",
    Icon: Settings2,
    accent: "bg-muted text-muted-foreground border-border",
  },
];

const steps = ["Boas-vindas", "Empresa", "Dados", "Recap"];

const initialValues: OnboardingValues = {
  tradeName: "Padaria & Café Estrela",
  cnpj: "12.345.678/0001-90",
  taxRegime: "Simples Nacional",
  sources: ["itau", "stone"],
};

const emptyValues: OnboardingValues = {
  tradeName: "",
  cnpj: "",
  taxRegime: "Simples Nacional",
  sources: [],
};

export default function Onboarding() {
  const [searchParams] = useSearchParams();
  const isNewCompany = searchParams.get("mode") === "new";
  const { canAddCompany, subscription, companies, extraCompanies } = useCompanies();
  const navigate = useNavigate();
  const { setScenario } = useDemoScenario();

  const [step, setStep] = useState(isNewCompany ? 1 : 0);
  const [mode, setMode] = useState<"guided" | "demo">("guided");
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: isNewCompany ? emptyValues : initialValues,
    mode: "onTouched",
  });

  // Block access to the new-company flow when the plan limit is reached.
  useEffect(() => {
    if (!isNewCompany) return;
    if (subscription && !canAddCompany) {
      toast.error("Limite do plano atingido", {
        description: `O plano ${subscription.planLabel} permite até ${subscription.maxCompanies} empresa(s).`,
      });
      navigate("/app/configuracoes/empresas", { replace: true });
    }
  }, [isNewCompany, canAddCompany, subscription, navigate]);

  const pct = ((step + 1) / steps.length) * 100;
  const selectedSources = form.watch("sources");
  const values = form.getValues();

  const finish = async (nextMode: "guided" | "demo" = mode, nextSources = selectedSources) => {
    if (isNewCompany) {
      setSubmitting(true);
      try {
        const created = await companyRepo.create({
          tradeName: values.tradeName,
          cnpj: values.cnpj,
          taxRegime: values.taxRegime,
        });
        toast.success("Empresa criada", {
          description: `${created.tradeName} já é a empresa ativa. Configure as fontes em Configurações.`,
        });
        navigate("/app/dashboard");
      } catch (e) {
        toast.error("Não foi possível criar a empresa", {
          description: e instanceof Error ? e.message : "Tente novamente em instantes.",
        });
      } finally {
        setSubmitting(false);
      }
      return;
    }

    authService.setOnboarded(true);
    setScenario(nextMode === "demo" ? "reliable" : nextSources.length > 0 ? "partial" : "empty");
    toast.success(nextMode === "demo" ? "Demo pronta para explorar" : "Configuração inicial concluída", {
      description: nextMode === "demo"
        ? "Carregamos uma leitura confiável para você navegar sem bloqueios."
        : "A leitura inicial já foi preparada com a configuração escolhida.",
    });
    navigate("/app/dashboard");
  };

  const goToStep = (nextStep: number) => setStep(nextStep);

  const skipWithDemo = () => {
    if (isNewCompany) return;
    const demoSources = ["itau", "stone", "csv"];
    setMode("demo");
    form.setValue("sources", demoSources);
    finish("demo", demoSources);
  };

  const continueFromCompany = async () => {
    const valid = await form.trigger(["tradeName", "cnpj", "taxRegime"]);
    if (valid) {
      setMode("guided");
      goToStep(2);
    }
  };

  const continueFromSources = async () => {
    if (!isNewCompany && selectedSources.length === 0) {
      form.setError("sources", { message: "Selecione pelo menos uma fonte ou siga com a demo." });
      return;
    }

    const valid = await form.trigger("sources");
    if (valid) {
      setMode("guided");
      goToStep(3);
    }
  };

  const toggleSource = (sourceId: string) => {
    const next = selectedSources.includes(sourceId)
      ? selectedSources.filter((value) => value !== sourceId)
      : [...selectedSources, sourceId];

    form.setValue("sources", next, { shouldTouch: true, shouldValidate: true });
    form.clearErrors("sources");
  };

  const newCompanyAddonHint = useMemo(() => {
    if (!isNewCompany || !subscription) return null;
    if (subscription.addonPricePerCompany <= 0) return null;
    // Adding this company would push us one over the included quota?
    const willBeExtra = companies.length + 1 > subscription.includedCompanies;
    if (!willBeExtra) return null;
    const newExtra = extraCompanies + 1;
    const newTotal = subscription.basePrice + newExtra * subscription.addonPricePerCompany;
    return `Esta empresa adiciona ${brl(subscription.addonPricePerCompany)}/mês ao seu plano (total estimado: ${brl(newTotal)}/mês).`;
  }, [isNewCompany, subscription, companies.length, extraCompanies]);

  const recapItems = [
    {
      label: "Empresa",
      value: values.tradeName,
      helper: values.cnpj,
      onEdit: () => goToStep(1),
    },
    {
      label: "Regime tributário",
      value: values.taxRegime,
      helper: mode === "demo" ? "Leitura demo pronta para navegação." : "Configuração usada na primeira leitura financeira.",
      onEdit: () => goToStep(1),
    },
    {
      label: "Fontes conectadas",
      value: selectedSources.length
        ? selectedSources
            .map((source) => dataSourceCards.find((card) => card.id === source)?.name ?? source)
            .join(", ")
        : "Nenhuma fonte conectada",
      helper: mode === "demo" ? "Vamos abrir com dados de exemplo enquanto você conhece o produto." : "Você pode adicionar ou trocar fontes depois em Configurações.",
      onEdit: () => goToStep(2),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-soft">
      <div className="container max-w-4xl py-8 md:py-16">
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                {isNewCompany ? "Nova empresa" : "Configuração inicial"} — etapa {step + 1} de {steps.length}
              </p>
              <h1 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
                {isNewCompany ? "Adicionar uma nova empresa" : "Prepare sua primeira leitura."}
              </h1>
              {isNewCompany && newCompanyAddonHint && (
                <p className="mt-2 text-sm text-muted-foreground">{newCompanyAddonHint}</p>
              )}
            </div>
            <Badge variant="outline" className="bg-background/80">
              {steps[step]}
            </Badge>
          </div>
          <Progress value={pct} className="mt-4 h-1.5" />
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 sm:p-8 shadow-card">
          {step === 0 && (
            <div className="grid gap-8 md:gap-10 md:grid-cols-[1.2fr_0.8fr] md:items-center">
              <div>
                <div className="grid size-14 place-items-center rounded-2xl bg-primary-soft text-primary">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h2 className="mt-5 text-2xl sm:text-3xl font-semibold tracking-tight">Bem-vinda ao Contta.</h2>
                <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
                  Vamos configurar os dados mínimos para que margem, caixa e revisão já comecem com contexto. Se preferir, você pode pular direto para a demo e explorar tudo agora.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                  <Button size="lg" onClick={() => goToStep(1)} className="w-full sm:w-auto">
                    Começar configuração
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button size="lg" variant="outline" onClick={skipWithDemo} className="w-full sm:w-auto">
                    <ShieldCheck className="h-4 w-4" />
                    Explorar com dados de exemplo
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-gradient-to-br from-primary-soft/70 via-background to-background p-5 sm:p-6">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">O que você destrava agora</p>
                <ul className="mt-4 space-y-3 text-sm text-foreground">
                  {[
                    "Leitura inicial de margem, caixa e revisão.",
                    "Sugestões do Contta AI com referências já clicáveis.",
                    "Base pronta para testar cenários demo e estados vazios.",
                    "Recap claro do que foi configurado antes de entrar no app.",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {step === 1 && (
            <Form {...form}>
              <div>
                <div className="mb-6 flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Sua empresa</h2>
                    <p className="text-sm text-muted-foreground">Esses dados entram como premissa da primeira leitura.</p>
                  </div>
                </div>

                <div className="grid gap-5 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="tradeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome fantasia</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex.: Padaria & Café Estrela" />
                        </FormControl>
                        <FormDescription>Como a empresa é reconhecida no dia a dia.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="00.000.000/0000-00" />
                        </FormControl>
                        <FormDescription>Usamos o formato completo para evitar inconsistências depois.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxRegime"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Regime tributário</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o regime" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectGroup>
                              {(["MEI", "Simples Nacional", "Lucro Presumido", "Lucro Real"] satisfies Company["taxRegime"][]).map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                        <FormDescription>Ajuda o Contta a contextualizar impostos e fechamento.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="mt-8 flex justify-between gap-2">
                  {isNewCompany ? (
                    <Button variant="ghost" onClick={() => navigate("/app/configuracoes/empresas")}>
                      <ChevronLeft className="h-4 w-4" />
                      Cancelar
                    </Button>
                  ) : (
                    <Button variant="ghost" onClick={() => goToStep(0)}>
                      <ChevronLeft className="h-4 w-4" />
                      Voltar
                    </Button>
                  )}
                  <Button onClick={continueFromCompany}>
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Form>
          )}

          {step === 2 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-primary-soft text-primary">
                  <Settings2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Conectar dados</h2>
                  <p className="text-sm text-muted-foreground">Escolha de onde o Contta deve começar a ler sua operação.</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {dataSourceCards.map((card) => {
                  const selected = selectedSources.includes(card.id);
                  const Icon = card.Icon;

                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => toggleSource(card.id)}
                      className={`rounded-xl border p-4 text-left transition-colors ${
                        selected
                          ? "border-primary bg-primary-soft/40 shadow-card"
                          : "border-border bg-background hover:border-primary/30 hover:bg-primary-soft/20"
                      }`}
                    >
                      <div className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${card.accent}`}>
                        <Icon className="mr-1 h-3.5 w-3.5" />
                        {card.name}
                      </div>
                      <p className="mt-3 text-sm font-medium text-foreground">{card.description}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {selected ? "Selecionado para a leitura inicial." : "Clique para incluir na configuração inicial."}
                      </p>
                    </button>
                  );
                })}
              </div>

              {form.formState.errors.sources && (
                <p className="mt-3 text-sm font-medium text-destructive">{form.formState.errors.sources.message}</p>
              )}

              <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
                {isNewCompany ? (
                  <p className="text-xs text-muted-foreground">
                    <Lock className="mr-1 inline h-3 w-3" />
                    Você poderá conectar bancos e maquininha desta nova empresa em Configurações depois.
                  </p>
                ) : (
                  <div>
                    <p className="text-sm font-medium text-foreground">Quer pular esta etapa?</p>
                    <p className="text-xs text-muted-foreground">Você entra com a demo confiável e conecta dados reais depois.</p>
                  </div>
                )}
                <div className="flex gap-2">
                  {!isNewCompany && (
                    <Button variant="outline" onClick={skipWithDemo}>
                      <Sparkles className="h-4 w-4" />
                      Seguir com demo
                    </Button>
                  )}
                  <Button onClick={continueFromSources}>
                    Revisar configuração
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-success-soft text-success">
                  <Check className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">Revise antes de entrar</h2>
                  <p className="text-sm text-muted-foreground">Resumo do que foi definido para a sua primeira visão do Contta.</p>
                </div>
              </div>

              <div className="space-y-3">
                {recapItems.map((item) => (
                  <div key={item.label} className="flex flex-col gap-3 rounded-xl border border-border bg-background/70 p-4 md:flex-row md:items-start md:justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.label}</p>
                      <p className="mt-1 text-sm font-medium text-foreground">{item.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{item.helper}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={item.onEdit}>
                      Editar
                    </Button>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-xl border border-primary/20 bg-primary-soft/40 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-primary">Modo de entrada</p>
                <p className="mt-1 text-sm text-foreground">
                  {mode === "demo"
                    ? "Você vai abrir com dados de exemplo completos para explorar todas as leituras."
                    : "Você vai abrir com uma leitura inicial baseada nas fontes escolhidas nesta configuração."}
                </p>
              </div>

              <div className="mt-8 flex justify-between gap-2">
                <Button variant="ghost" onClick={() => goToStep(2)}>
                  <ChevronLeft className="h-4 w-4" />
                  Voltar
                </Button>
                <Button onClick={() => finish()}>
                  Abrir minha visão geral
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
