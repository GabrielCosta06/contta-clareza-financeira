import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUp,
  Copy,
  ExternalLink,
  History,
  Landmark,
  Plus,
  ReceiptText,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";

import { aiRepo } from "@/services";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { dateBR } from "@/lib/format";
import type { AIMessage } from "@/domain/types";

const starterGroups = [
  {
    id: "margem",
    title: "Margem",
    Icon: TrendingUp,
    prompts: ["Por que a margem caiu este mês?", "Quais despesas cresceram acima do esperado?"],
  },
  {
    id: "caixa",
    title: "Caixa",
    Icon: Wallet,
    prompts: ["Posso pagar a folha sem apertar o caixa?", "Em quanto tempo o caixa pode ficar negativo?"],
  },
  {
    id: "revisao",
    title: "Revisão",
    Icon: ReceiptText,
    prompts: ["O que ainda pode mudar o fechamento deste mês?", "Quais itens críticos preciso resolver primeiro?"],
  },
  {
    id: "tributario",
    title: "Tributário",
    Icon: Landmark,
    prompts: ["Qual vencimento tributário merece atenção agora?", "O regime atual está refletido corretamente?"],
  },
];

const messageToPlainText = (message: AIMessage) => {
  const blocks = (message.blocks ?? []).map((b) =>
    `${b.title}: ${Array.isArray(b.content) ? b.content.join(" • ") : b.content}`,
  );
  const refs = (message.references ?? []).map((r) => r.label);
  return [message.content, ...blocks, refs.length ? `Referências: ${refs.join(" • ")}` : ""]
    .filter(Boolean)
    .join("\n\n");
};

export default function ContaAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const consumedPrompt = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { data: convs = [] } = useQuery({ queryKey: ["ai-convs"], queryFn: () => aiRepo.conversations() });

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
    const next = new URLSearchParams(searchParams);
    next.delete("prompt");
    setSearchParams(next, { replace: true });
  }, [ask, searchParams, setSearchParams]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, ask.isPending]);

  // Auto-resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
  }, [input]);

  const display = messages.length > 0 ? messages : convs[0]?.messages ?? [];
  const pendingPrompt = ask.isPending ? ask.variables : null;
  const isEmpty = display.length === 0 && !pendingPrompt;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !ask.isPending) ask.mutate(input.trim());
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !ask.isPending) ask.mutate(input.trim());
    }
  };

  const copyResponse = async (m: AIMessage) => {
    await navigator.clipboard.writeText(messageToPlainText(m));
    toast.success("Resposta copiada");
  };

  const newChat = () => {
    setMessages([]);
    setInput("");
    textareaRef.current?.focus();
  };

  const allStarters = useMemo(() => starterGroups.flatMap((g) => g.prompts), []);

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
              setMessages(c.messages);
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
      {/* Sidebar — desktop */}
      <aside className="hidden w-60 shrink-0 border-r border-border bg-background/40 md:flex md:flex-col">
        <HistoryPanel />
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
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
              <p className="truncate text-[11px] text-muted-foreground">Assistente financeiro</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="h-8 gap-1.5" onClick={newChat}>
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Nova conversa</span>
          </Button>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center px-4 py-10 text-center">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-card">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold tracking-tight">Como posso ajudar hoje?</h2>
              <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
                Pergunte sobre os números da sua empresa. Resposta em blocos, com fontes e premissas.
              </p>

              <div className="mt-8 grid w-full gap-2.5 sm:grid-cols-2">
                {starterGroups.map((g) => {
                  const Icon = g.Icon;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => ask.mutate(g.prompts[0])}
                      className="group flex items-start gap-3 rounded-lg border border-border bg-background/40 p-3 text-left transition-all hover:border-primary/40 hover:bg-primary-soft/30"
                    >
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:bg-primary-soft group-hover:text-primary">
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                          {g.title}
                        </p>
                        <p className="mt-0.5 line-clamp-2 text-sm text-foreground">{g.prompts[0]}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6 px-4 py-6 md:px-8">
              {display.map((message) =>
                message.role === "user" ? (
                  <div key={message.id} className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                      {message.content}
                    </div>
                  </div>
                ) : (
                  <article key={message.id} className="flex gap-3">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                      <Sparkles className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-3">
                      <p className="text-[15px] leading-relaxed text-foreground">{message.content}</p>

                      {message.blocks && message.blocks.length > 0 && (
                        <div className="grid gap-2 sm:grid-cols-2">
                          {message.blocks.map((block) => (
                            <div
                              key={block.title}
                              className={cn(
                                "rounded-lg border p-3",
                                block.type === "next-actions"
                                  ? "border-primary/20 bg-primary-soft/40"
                                  : "border-border bg-muted/30",
                              )}
                            >
                              <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                                {block.title}
                              </p>
                              {Array.isArray(block.content) ? (
                                <ul className="space-y-1 text-sm">
                                  {block.content.map((c) => (
                                    <li key={c} className="flex gap-2">
                                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
                                      <span>{c}</span>
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

                      {message.references && message.references.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          {message.references.map((ref) => (
                            <Link
                              key={`${ref.id}-${ref.label}`}
                              to={ref.href ?? "#"}
                              className="inline-flex items-center gap-1 rounded-md border border-border bg-background/60 px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                            >
                              <ExternalLink className="h-3 w-3" />
                              {ref.label}
                              <ArrowRight className="h-3 w-3" />
                            </Link>
                          ))}
                        </div>
                      )}

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
                    </div>
                  </article>
                ),
              )}

              {pendingPrompt && (
                <>
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl rounded-tr-md bg-primary px-4 py-2.5 text-sm leading-relaxed text-primary-foreground">
                      {pendingPrompt}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-primary text-primary-foreground">
                      <Sparkles className="h-3.5 w-3.5 animate-pulse" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-2 pt-1">
                      <Skeleton className="h-3 w-4/5" />
                      <Skeleton className="h-3 w-3/5" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Composer */}
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
                className="min-h-[40px] resize-none border-0 bg-transparent px-3 py-2 text-sm shadow-none focus-visible:ring-0"
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || ask.isPending}
                className="h-9 w-9 shrink-0 rounded-xl"
                aria-label="Enviar"
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
            </div>

            {!isEmpty || pendingPrompt ? (
              <p className="mt-2 px-1 text-center text-[11px] text-muted-foreground">
                Enter envia · Shift + Enter para nova linha
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {allStarters.slice(0, 4).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => ask.mutate(p)}
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
