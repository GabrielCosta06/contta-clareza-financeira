import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowUp,
  Copy,
  History,
  Landmark,
  Plus,
  ReceiptText,
  Sparkles,
  Square,
  TrendingUp,
  Wallet,
} from "lucide-react";
import ReactMarkdown from "react-markdown";

import { aiRepo, marginRepo, cashRepo, reviewRepo, companyRepo } from "@/services";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/sonner";
import { dateBR } from "@/lib/format";

type ChatMessage = { id: string; role: "user" | "assistant"; content: string; createdAt: string };

const starterGroups = [
  { id: "margem", title: "Margem", Icon: TrendingUp, prompt: "Por que a margem caiu este mês?" },
  { id: "caixa", title: "Caixa", Icon: Wallet, prompt: "Posso pagar a folha sem apertar o caixa?" },
  { id: "revisao", title: "Revisão", Icon: ReceiptText, prompt: "O que ainda pode mudar o fechamento deste mês?" },
  { id: "tributario", title: "Tributário", Icon: Landmark, prompt: "Qual vencimento tributário merece atenção agora?" },
];

export default function ContaAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [streaming, setStreaming] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const consumedPrompt = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const { data: convs = [] } = useQuery({ queryKey: ["ai-convs"], queryFn: () => aiRepo.conversations() });
  const { data: company } = useQuery({ queryKey: ["company"], queryFn: () => companyRepo.current() });
  const { data: margin } = useQuery({ queryKey: ["margin"], queryFn: () => marginRepo.overview(), retry: false });
  const { data: cash } = useQuery({ queryKey: ["cash"], queryFn: () => cashRepo.overview(), retry: false });
  const { data: review = [] } = useQuery({ queryKey: ["review"], queryFn: () => reviewRepo.queue() });

  const buildContext = () => ({
    company: company?.tradeName,
    margin: margin
      ? { revenue: margin.revenue, grossMarginPct: margin.grossMarginPct, deltaPct: margin.delta.pct }
      : undefined,
    cash: cash
      ? { currentBalance: cash.currentBalance, projected30d: cash.projected30d, riskLevel: cash.riskLevel }
      : undefined,
    review: {
      criticalCount: review.filter((r) => r.severity === "critical").length,
      pendingCount: review.length,
    },
  });

  const send = async (prompt: string) => {
    if (!prompt.trim() || streaming) return;
    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
      createdAt: new Date().toISOString(),
    };
    const assistantId = crypto.randomUUID();
    setMessages((prev) => [
      ...prev,
      userMsg,
      { id: assistantId, role: "assistant", content: "", createdAt: new Date().toISOString() },
    ]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    const updateAssistant = (chunk: string) => {
      setMessages((prev) =>
        prev.map((m) => (m.id === assistantId ? { ...m, content: m.content + chunk } : m)),
      );
    };

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-ai`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          context: buildContext(),
        }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) {
        const data = await resp.json().catch(() => ({}));
        if (resp.status === 429) toast.error(data.error ?? "Limite de uso atingido. Tente novamente em alguns segundos.");
        else if (resp.status === 402) toast.error(data.error ?? "Sem créditos no workspace de IA.");
        else toast.error(data.error ?? "Falha ao falar com o assistente.");
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
        return;
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;
      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, nl);
          buffer = buffer.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") {
            done = true;
            break;
          }
          try {
            const parsed = JSON.parse(payload);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) startTransition(() => updateAssistant(delta));
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        console.error(err);
        toast.error("Conexão com o assistente foi interrompida.");
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  };

  useEffect(() => {
    const prompt = searchParams.get("prompt")?.trim();
    if (!prompt || streaming || consumedPrompt.current === prompt) return;
    consumedPrompt.current = prompt;
    void send(prompt);
    const next = new URLSearchParams(searchParams);
    next.delete("prompt");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
  }, [input]);

  const isEmpty = messages.length === 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input.trim());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(input.trim());
    }
  };

  const stop = () => abortRef.current?.abort();

  const copyResponse = async (m: ChatMessage) => {
    await navigator.clipboard.writeText(m.content);
    toast.success("Resposta copiada");
  };

  const newChat = () => {
    abortRef.current?.abort();
    setMessages([]);
    setInput("");
    textareaRef.current?.focus();
  };

  const allStarters = useMemo(() => starterGroups.map((g) => g.prompt), []);

  const HistoryPanel = ({ onClose }: { onClose?: () => void }) => (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Conversas</p>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={() => {
            newChat();
            onClose?.();
          }}
        >
          <Plus className="h-3.5 w-3.5" />
          Nova
        </Button>
      </div>
      <div className="flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {convs.length === 0 && (
          <p className="px-3 py-4 text-xs text-muted-foreground">Suas conversas aparecem aqui.</p>
        )}
        {convs.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              const initial: ChatMessage[] = c.messages.map((m) => ({
                id: m.id,
                role: m.role,
                content: m.content,
                createdAt: m.createdAt,
              }));
              setMessages(initial);
              onClose?.();
            }}
            className="block w-full rounded-md px-3 py-2 text-left transition-colors hover:bg-muted/60"
          >
            <p className="line-clamp-1 text-sm font-medium text-foreground">{c.title}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">{dateBR(c.updatedAt)}</p>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-9rem)] min-h-[520px] animate-fade-in flex-col gap-0 overflow-hidden rounded-xl border border-border bg-card md:h-[calc(100vh-10rem)] md:flex-row">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-background/40 md:flex md:flex-col">
        <HistoryPanel />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 md:hidden" aria-label="Histórico">
                  <History className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <SheetHeader className="px-4 py-3">
                  <SheetTitle className="text-sm">Conversas</SheetTitle>
                  <SheetDescription className="sr-only">Histórico de conversas com Contta AI</SheetDescription>
                </SheetHeader>
                <HistoryPanel />
              </SheetContent>
            </Sheet>
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground">
              <Sparkles className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-tight">Contta AI</p>
              <p className="truncate text-[11px] text-muted-foreground">
                {company?.tradeName ? `Contexto: ${company.tradeName}` : "Assistente financeiro"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={newChat}>
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Nova conversa</span>
          </Button>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-4 py-10 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-card">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight">Como posso ajudar hoje?</h2>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                Pergunte sobre os números da sua empresa. Trabalho com os dados que estão na tela e cito as premissas.
              </p>

              <div className="mt-8 grid w-full gap-2.5 sm:grid-cols-2">
                {starterGroups.map((g) => {
                  const Icon = g.Icon;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => void send(g.prompt)}
                      className="group flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3 text-left transition-all hover:border-primary/40 hover:bg-primary-soft/30"
                    >
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary-soft group-hover:text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {g.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-sm text-foreground">{g.prompt}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-8">
              {messages.map((message) =>
                message.role === "user" ? (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <article key={message.id} className="flex gap-3">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                      <Sparkles className={`h-3.5 w-3.5 ${streaming && !message.content ? "animate-pulse" : ""}`} />
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      {message.content ? (
                        <div className="prose prose-sm max-w-none text-[15px] leading-relaxed text-foreground prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-strong:text-foreground prose-headings:text-foreground prose-code:rounded prose-code:bg-muted prose-code:px-1 prose-code:py-0.5 prose-code:text-[13px] prose-code:before:content-none prose-code:after:content-none">
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">Pensando…</p>
                      )}

                      {message.content && !streaming && (
                        <div className="flex items-center gap-1 pt-1 opacity-60 transition-opacity hover:opacity-100">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 gap-1.5 px-2 text-[11px] text-muted-foreground"
                            onClick={() => copyResponse(message)}
                          >
                            <Copy className="h-3 w-3" />
                            Copiar
                          </Button>
                        </div>
                      )}
                    </div>
                  </article>
                ),
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border bg-card/60 px-3 py-3 md:px-6 md:py-4">
          <form onSubmit={submit} className="mx-auto max-w-3xl">
            <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-background p-1.5 shadow-sm transition-colors focus-within:border-primary/50">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Pergunte algo sobre seus números…"
                rows={1}
                disabled={streaming}
                className="min-h-[40px] resize-none border-0 bg-transparent px-3 py-2 text-sm shadow-none focus-visible:ring-0 disabled:opacity-70"
              />
              {streaming ? (
                <Button
                  type="button"
                  size="icon"
                  variant="secondary"
                  onClick={stop}
                  className="h-9 w-9 shrink-0 rounded-xl"
                  aria-label="Parar"
                >
                  <Square className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim()}
                  className="h-9 w-9 shrink-0 rounded-xl"
                  aria-label="Enviar"
                >
                  <ArrowUp className="h-4 w-4" />
                </Button>
              )}
            </div>

            {!isEmpty ? (
              <p className="mt-2 px-1 text-center text-[11px] text-muted-foreground">
                Enter envia · Shift + Enter para nova linha
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {allStarters.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => void send(p)}
                    className="rounded-full border border-border bg-background px-3 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

// Suppress unused import warning when Link is not directly used
void Link;
