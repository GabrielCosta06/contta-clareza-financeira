import { useDeferredValue, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  LayoutDashboard,
  Plus,
  Receipt,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Upload,
  Wallet,
} from "lucide-react";

import { reviewRepo, transactionsRepo } from "@/services";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { toast } from "@/components/ui/sonner";

const navigationItems = [
  {
    label: "Visão geral",
    hint: "Dashboard executivo",
    to: "/app/dashboard",
    shortcut: "G D",
    icon: LayoutDashboard,
  },
  {
    label: "Transações",
    hint: "Entradas, saídas e lançamentos",
    to: "/app/transacoes",
    shortcut: "G T",
    icon: Receipt,
  },
  {
    label: "Configurações",
    hint: "Empresa, conexões e preferências",
    to: "/app/configuracoes",
    shortcut: "G S",
    icon: Settings,
  },
  {
    label: "Margem",
    hint: "Receita, custos e drivers",
    to: "/app/margem",
    shortcut: "G M",
    icon: TrendingUp,
  },
  {
    label: "Caixa",
    hint: "Saldo e projeção",
    to: "/app/caixa",
    shortcut: "G C",
    icon: Wallet,
  },
  {
    label: "Revisão",
    hint: "Itens que mudam o fechamento",
    to: "/app/revisao",
    shortcut: "G R",
    icon: ShieldCheck,
  },
  {
    label: "Contta AI",
    hint: "Perguntas sobre seus números",
    to: "/app/ai",
    shortcut: "G A",
    icon: Sparkles,
  },
];

const actionItems = [
  {
    label: "Importar transações",
    hint: "Abrir tela de transações",
    icon: Upload,
    run: (navigate: ReturnType<typeof useNavigate>) => {
      navigate("/app/transacoes");
      toast("Tela de transações aberta", {
        description: "Use o botão Importar para trazer novos dados.",
      });
    },
  },
  {
    label: "Nova transação manual",
    hint: "Registrar lançamento manual",
    icon: Plus,
    run: (navigate: ReturnType<typeof useNavigate>) => {
      navigate("/app/transacoes");
      toast("Abra uma transação manual", {
        description: "O próximo passo está na área de transações.",
      });
    },
  },
  {
    label: "Marcar revisão como prioridade",
    hint: "Ir para a fila de revisão",
    icon: ShieldAlert,
    run: (navigate: ReturnType<typeof useNavigate>) => {
      navigate("/app/revisao");
      toast("Fila de revisão aberta", {
        description: "Priorize os itens críticos antes do fechamento.",
      });
    },
  },
];

const normalize = (value: string) => value.trim().toLowerCase();

export const AppCommandPalette = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const query = normalize(deferredSearch);

  const { data: transactions = [] } = useQuery({
    queryKey: ["transactions", "", "all", "all"],
    queryFn: () => transactionsRepo.list(),
  });
  const { data: review = [] } = useQuery({
    queryKey: ["review"],
    queryFn: () => reviewRepo.queue(),
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    setOpen(false);
    setSearch("");
  }, [location.pathname, location.search]);

  const transactionMatches = transactions
    .filter((transaction) => {
      if (!query) return true;
      const description = normalize(transaction.description);
      const counterparty = normalize(transaction.counterparty ?? "");
      return description.includes(query) || counterparty.includes(query);
    })
    .slice(0, 6);

  const firstPriorityReview = review.find((item) => item.severity === "critical") ?? review[0];
  const askPrompt = deferredSearch.trim();

  const run = (callback: () => void) => {
    setOpen(false);
    setSearch("");
    callback();
  };

  return (
    <>
      <Button
        variant="outline"
        className="hidden md:flex h-9 min-w-60 justify-between gap-3 text-muted-foreground"
        onClick={() => setOpen(true)}
        aria-label="Abrir paleta de comandos"
      >
        <span className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Buscar ou navegar
        </span>
        <span className="rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Ctrl K
        </span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Abrir paleta de comandos"
      >
        <Search className="h-4 w-4" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Paleta de comandos do Contta"
        description="Navegue entre as leituras, abra transações e dispare ações rápidas."
        commandProps={{ value: search, onValueChange: setSearch }}
      >
        <CommandInput placeholder="Ir para Margem, abrir transação, perguntar ao Contta AI..." />
        <CommandList className="max-h-[420px]">
          <CommandEmpty>Nenhum resultado para essa busca.</CommandEmpty>

          <CommandGroup heading="Navegar">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.to}
                  value={`${item.label} ${item.hint}`}
                  onSelect={() => run(() => navigate(item.to))}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.hint}</span>
                  </div>
                  <CommandShortcut>{item.shortcut}</CommandShortcut>
                </CommandItem>
              );
            })}
          </CommandGroup>

          <CommandSeparator />

          {askPrompt && (
            <>
              <CommandGroup heading="Perguntar ao Contta AI">
                <CommandItem
                  value={`Perguntar ao Contta AI ${askPrompt}`}
                  onSelect={() => run(() => navigate(`/app/ai?prompt=${encodeURIComponent(askPrompt)}`))}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span>Perguntar ao Contta AI</span>
                    <span className="text-xs text-muted-foreground truncate">{askPrompt}</span>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
            </>
          )}

          <CommandGroup heading="Transações">
            {transactionMatches.length > 0 ? (
              transactionMatches.map((transaction) => (
                <CommandItem
                  key={transaction.id}
                  value={`${transaction.description} ${transaction.counterparty ?? ""}`}
                  onSelect={() => run(() => navigate(`/app/transacoes/${transaction.id}`))}
                >
                  <Receipt className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                    <span className="truncate">{transaction.description}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {transaction.counterparty || "Sem contraparte"}
                    </span>
                  </div>
                </CommandItem>
              ))
            ) : (
              <CommandItem disabled value="sem-transacoes">
                <Receipt className="mr-2 h-4 w-4" />
                <span>Nenhuma transação encontrada</span>
              </CommandItem>
            )}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Ações">
            {actionItems.map((item) => {
              const Icon = item.icon;
              return (
                <CommandItem
                  key={item.label}
                  value={`${item.label} ${item.hint}`}
                  onSelect={() => run(() => item.run(navigate))}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 flex-col gap-0.5">
                    <span>{item.label}</span>
                    <span className="text-xs text-muted-foreground">{item.hint}</span>
                  </div>
                </CommandItem>
              );
            })}

            {firstPriorityReview && (
              <CommandItem
                value={`${firstPriorityReview.title} ${firstPriorityReview.impact}`}
                onSelect={() => run(() => navigate("/app/revisao"))}
              >
                <ShieldAlert className="mr-2 h-4 w-4" />
                <div className="flex flex-1 flex-col gap-0.5">
                  <span>Resolver prioridade atual</span>
                  <span className="text-xs text-muted-foreground truncate">{firstPriorityReview.title}</span>
                </div>
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};
