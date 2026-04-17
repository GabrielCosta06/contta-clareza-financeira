import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  BookmarkPlus,
  ChevronDown,
  Copy,
  ExternalLink,
  History,
  Landmark,
  ReceiptText,
  Send,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { aiRepo, companyRepo, reviewRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "@/components/ui/sonner";
import { dateBR, relativeDays } from "@/lib/format";
import type { AIMessage } from "@/domain/types";

const starterGroups = [
  {
    id: "margem",
    title: "Margem",
    accent: "border-warning/25 bg-warning-soft/50 text-warning",
    Icon: TrendingUp,
    prompts: [
      "Por que a margem caiu este mês?",
      "Quais despesas cresceram acima do esperado?",
      "Onde o custo está corroendo mais a rentabilidade?",
    ],
  },
  {
    id: "caixa",
    title: "Caixa",
    accent: "border-info/25 bg-info-soft/50 text-info",
    Icon: Wallet,
    prompts: [
      "Posso pagar a folha sem apertar o caixa?",
      "Em quanto tempo o caixa pode ficar negativo?",
      "Qual ação protege mais o caixa nas próximas 2 semanas?",
    ],
  },
  {
    id: "revisao",
    title: "Revisão",
    accent: "border-destructive/25 bg-destructive-soft/60 text-destructive",
    Icon: ReceiptText,
    prompts: [
      "O que ainda pode mudar o fechamento deste mês?",
      "Quais itens críticos preciso resolver primeiro?",
      "Como as pendências afetam a confiança da leitura?",
    ],
  },
  {
    id: "tributario",
    title: "Tributário",
    accent: "border-primary/25 bg-primary-soft/60 text-primary",
    Icon: Landmark,
    prompts: [
      "Qual vencimento tributário merece atenção agora?",
      "Há algo fiscal que pode distorcer este resultado?",
      "O regime atual está refletido corretamente na leitura?",
    ],
  },
];

const SAVED_INSIGHTS_KEY = "contta.ai.saved-insights";

const messageToPlainText = (message: AIMessage) => {
  const blocks = (message.blocks ?? []).map((block) =>
    `${block.title}: ${Array.isArray(block.content) ? block.content.join(" • ") : block.content}`,
  );
  const references = (message.references ?? []).map((reference) => reference.label);
  return [message.content, ...blocks, references.length ? `Referências: ${references.join(" • ")}` : ""]
    .filter(Boolean)
    .join("\n\n");
};

export default function ContaAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [savedInsights, setSavedInsights] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(SAVED_INSIGHTS_KEY);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });
  const [searchParams, setSearchParams] = useSearchParams();
  const consumedPrompt = useRef<string | null>(null);

  const { data: convs = [] } = useQuery({ queryKey: ["ai-convs"], queryFn: () => aiRepo.conversations() });
  const { data: accounts = [] } = useQuery({ queryKey: ["accounts"], queryFn: () => companyRepo.accounts() });
  const { data: review = [] } = useQuery({ queryKey: ["review"], queryFn: () => reviewRepo.queue() });

  const ask = useMutation({
    mutationFn: (prompt: string) => aiRepo.ask(prompt),
    onSuccess: (message, prompt) => {
      startTransition(() => {
        setMessages((prev) => [
          ...prev,
          { id: crypto.randomUUID(), role: "user", content: prompt, createdAt: new Date().toISOString() },
          message,
        ]);
        setInput("");
      });
    },
  });

  useEffect(() => {
    const prompt = searchParams.get("prompt")?.trim();
    if (!prompt || ask.isPending || consumedPrompt.current === prompt) return;

    consumedPrompt.current = prompt;
    ask.mutate(prompt);

    const nextParams = new URLSearchParams(searchParams);
    nextParams.delete("prompt");
    setSearchParams(nextParams, { replace: true });
  }, [ask, searchParams, setSearchParams]);

  useEffect(() => {
    window.localStorage.setItem(SAVED_INSIGHTS_KEY, JSON.stringify(savedInsights));
  }, [savedInsights]);

  const display = messages.length > 0 ? messages : convs[0]?.messages ?? [];
  const latestSync = accounts
    .map((account) => account.lastSyncAt)
    .filter((value): value is string => Boolean(value))
    .sort((left, right) => new Date(right).getTime() - new Date(left).getTime())[0];

  const pendingPrompt = ask.isPending ? ask.variables : null;

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (input.trim()) ask.mutate(input.trim());
  };

  const saveInsight = (message: AIMessage) => {
    setSavedInsights((current) => {
      if (current.includes(message.id)) return current;
      return [...current, message.id];
    });
    toast.success("Insight salvo", {
      description: "Você pode transformar isso em uma leitura fixa depois.",
    });
  };

  const copyResponse = async (message: AIMessage) => {
    await navigator.clipboard.writeText(messageToPlainText(message));
    toast.success("Resposta copiada", {
      description: "O conteúdo foi enviado para a área de transferência.",
    });
  };

  const openReferences = (message: AIMessage) => {
    message.references?.forEach((reference) => {
      if (reference.href) {
        window.open(reference.href, "_blank", "noopener,noreferrer");
      }
    });
    toast.success("Referências abertas", {
      description: "As origens dessa resposta foram abertas em novas abas.",
    });
  };

  const starterSummary = useMemo(
    () => starterGroups.flatMap((group) => group.prompts),
    [],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Interpretação contextual"
        title="Contta AI"
        subtitle="Pergunte sobre os seus números. Resposta em blocos, com fontes, confiança e premissas da análise."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-5 shadow-card">
            <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Sparkles className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary" />
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ex.: Qual decisão protege melhor o caixa deste mês?"
                  className="h-11 pl-9"
                />
              </div>
              <Button type="submit" disabled={ask.isPending || !input.trim()} className="h-11">
                <Send className="h-4 w-4" />
                Perguntar
              </Button>
            </form>

            {messages.length === 0 && (
              <div className="mt-5 space-y-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Sugestões por pilar
                </p>
                <div className="grid gap-3 md:grid-cols-2">
                  {starterGroups.map((group) => {
                    const Icon = group.Icon;
                    return (
                      <div key={group.id} className="rounded-xl border border-border bg-background/80 p-4">
                        <div className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium ${group.accent}`}>
                          <Icon className="mr-1 h-3.5 w-3.5" />
                          {group.title}
                        </div>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {group.prompts.map((prompt) => (
                            <button
                              key={prompt}
                              type="button"
                              onClick={() => ask.mutate(prompt)}
                              className="rounded-full border border-border px-3 py-1.5 text-left text-sm text-foreground transition-colors hover:border-primary hover:bg-primary-soft"
                            >
                              {prompt}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {display.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-2xl rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground shadow-card">
                  {message.content}
                </div>
              </div>
            ) : (
              <article
                key={message.id}
                className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary-soft/35 via-card to-card p-5 shadow-card"
              >
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-primary">
                      <Sparkles className="h-3 w-3" />
                      Contta AI
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Resposta montada a partir de {message.references?.length ?? 0} referências internas.
                    </p>
                  </div>
                  {message.confidence && <ConfidenceBadge level={message.confidence} />}
                </div>

                <p className="text-foreground">{message.content}</p>

                {message.blocks && (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {message.blocks.map((block) => (
                      <div
                        key={block.title}
                        className={`rounded-xl p-3 ${
                          block.type === "next-actions"
                            ? "border border-primary/15 bg-primary-soft/50"
                            : "bg-secondary"
                        }`}
                      >
                        <p className="mb-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                          {block.title}
                        </p>
                        {Array.isArray(block.content) ? (
                          <ul className="space-y-1 text-sm">
                            {block.content.map((content) => (
                              <li key={content} className="flex gap-2">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                                <span>{content}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-sm">{block.content}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap gap-2 border-t border-border/60 pt-4">
                  <Button type="button" variant="outline" size="sm" onClick={() => copyResponse(message)}>
                    <Copy className="h-4 w-4" />
                    Copiar resposta
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => openReferences(message)}
                    disabled={!message.references?.length}
                  >
                    <ExternalLink className="h-4 w-4" />
                    Abrir referências
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => saveInsight(message)}
                    disabled={savedInsights.includes(message.id)}
                  >
                    <BookmarkPlus className="h-4 w-4" />
                    {savedInsights.includes(message.id) ? "Insight salvo" : "Salvar como insight"}
                  </Button>
                </div>

                {message.references && message.references.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    <p className="self-center text-xs text-muted-foreground">Origem:</p>
                    {message.references.map((reference) => (
                      <Link
                        key={`${reference.id}-${reference.label}`}
                        to={reference.href ?? "#"}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground transition-colors hover:border-primary"
                      >
                        {reference.label}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    ))}
                  </div>
                )}

                <Collapsible className="mt-4 rounded-xl border border-border/70 bg-background/70 px-4 py-3">
                  <CollapsibleTrigger className="flex w-full items-center justify-between text-left text-sm font-medium text-foreground">
                    Sobre esta resposta
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="pt-3 text-sm text-muted-foreground data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <ul className="space-y-2">
                      <li>Premissa principal: leituras financeiras atuais, filas de revisão ativas e referências vinculadas à empresa.</li>
                      <li>
                        Atualização de dados: {latestSync ? `última sincronização ${relativeDays(latestSync)}.` : "nenhuma sincronização recente encontrada."}
                      </li>
                      <li>
                        Fila de revisão considerada: {review.length} {review.length === 1 ? "item pendente" : "itens pendentes"}.
                      </li>
                    </ul>
                  </CollapsibleContent>
                </Collapsible>
              </article>
            ),
          )}

          {pendingPrompt && (
            <>
              <div className="flex justify-end">
                <div className="max-w-2xl rounded-2xl bg-primary px-4 py-3 text-sm text-primary-foreground shadow-card">
                  {pendingPrompt}
                </div>
              </div>

              <div className="rounded-2xl border border-primary/15 bg-gradient-to-br from-primary-soft/35 via-card to-card p-5 shadow-card">
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-xs font-medium uppercase tracking-wider text-primary">Contta AI lendo seus dados</p>
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-5/6" />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Skeleton className="h-24 rounded-xl" />
                    <Skeleton className="h-24 rounded-xl" />
                  </div>
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            </>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-xl border border-border bg-card p-4">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <History className="h-3 w-3" />
              Histórico recente
            </p>
            <ul className="space-y-2">
              {convs.map((conversation) => (
                <li key={conversation.id}>
                  <button
                    type="button"
                    onClick={() => setMessages(conversation.messages)}
                    className="w-full rounded-lg border border-transparent px-3 py-2 text-left text-sm text-foreground transition-colors hover:border-border hover:bg-background"
                  >
                    <p className="font-medium">{conversation.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Atualizado em {dateBR(conversation.updatedAt)}</p>
                  </button>
                </li>
              ))}
              {convs.length === 0 && <p className="text-xs text-muted-foreground">Suas perguntas aparecem aqui.</p>}
            </ul>
          </div>

          <div className="rounded-xl border border-info/20 bg-info-soft p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-info">Como o Contta AI responde</p>
            <p className="mt-2 text-sm text-foreground">
              Sempre em blocos: resumo, o que mudou, causas, próximas ações e links para a origem do número.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Perguntas sugeridas agora</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {starterSummary.slice(0, 4).map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => ask.mutate(prompt)}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-foreground transition-colors hover:border-primary hover:bg-primary-soft"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
