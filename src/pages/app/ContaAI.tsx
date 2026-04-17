import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { aiRepo } from "@/services";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { Sparkles, Send, ArrowRight, History } from "lucide-react";
import type { AIMessage } from "@/domain/types";
import { Link } from "react-router-dom";

export default function ContaAI() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const { data: starters = [] } = useQuery({ queryKey: ["ai-starters"], queryFn: () => aiRepo.starters() });
  const { data: convs = [] } = useQuery({ queryKey: ["ai-convs"], queryFn: () => aiRepo.conversations() });

  const ask = useMutation({
    mutationFn: (p: string) => aiRepo.ask(p),
    onSuccess: (m, p) => {
      setMessages(prev => [...prev,
        { id: crypto.randomUUID(), role: "user", content: p, createdAt: new Date().toISOString() },
        m,
      ]);
      setInput("");
    },
  });

  const submit = (e: React.FormEvent) => { e.preventDefault(); if (input.trim()) ask.mutate(input.trim()); };
  const display = messages.length > 0 ? messages : convs[0]?.messages ?? [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        eyebrow="Interpretação contextual"
        title="Contta AI"
        subtitle="Pergunte sobre os seus números. Resposta em blocos, com fontes e nível de confiança."
      />

      <div className="grid lg:grid-cols-[1fr_280px] gap-6">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <form onSubmit={submit} className="flex gap-2">
              <div className="relative flex-1">
                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ex.: Por que a margem caiu este mês?" className="pl-9 h-11" />
              </div>
              <Button type="submit" disabled={ask.isPending || !input.trim()} className="h-11"><Send className="h-4 w-4" /> Perguntar</Button>
            </form>
            {messages.length === 0 && (
              <div className="mt-4">
                <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-2">Sugestões com base nos seus dados</p>
                <div className="flex flex-wrap gap-2">
                  {starters.map(s => (
                    <button key={s} onClick={() => ask.mutate(s)} className="rounded-full border border-border px-3 py-1.5 text-sm text-foreground hover:border-primary hover:bg-primary-soft transition-colors">{s}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {display.map(m => m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-2xl rounded-lg bg-primary text-primary-foreground px-4 py-3 text-sm">{m.content}</div>
            </div>
          ) : (
            <div key={m.id} className="rounded-lg border border-primary/15 bg-gradient-to-br from-primary-soft/40 via-card to-card p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium uppercase tracking-wider text-primary flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> Contta AI</p>
                {m.confidence && <ConfidenceBadge level={m.confidence} />}
              </div>
              <p className="text-foreground">{m.content}</p>
              {m.blocks && (
                <div className="mt-4 grid sm:grid-cols-2 gap-3">
                  {m.blocks.map(b => (
                    <div key={b.title} className={`rounded-md p-3 ${b.type === "next-actions" ? "bg-primary-soft/50 border border-primary/15" : "bg-secondary"}`}>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">{b.title}</p>
                      {Array.isArray(b.content) ? (
                        <ul className="space-y-1 text-sm">{b.content.map((c, i) => <li key={i} className="flex gap-2"><span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" /><span>{c}</span></li>)}</ul>
                      ) : <p className="text-sm">{b.content}</p>}
                    </div>
                  ))}
                </div>
              )}
              {m.references && m.references.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap gap-2">
                  <p className="text-xs text-muted-foreground self-center">Origem:</p>
                  {m.references.map(r => (
                    <Link key={r.id + r.label} to={r.href ?? "#"} className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-xs text-foreground hover:border-primary">
                      {r.label} <ArrowRight className="h-3 w-3" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          {ask.isPending && <div className="text-sm text-muted-foreground animate-pulse">Contta AI lendo seus dados…</div>}
        </div>

        <aside>
          <div className="rounded-lg border border-border bg-card p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5"><History className="h-3 w-3" /> Histórico recente</p>
            <ul className="space-y-2">
              {convs.map(c => (
                <li key={c.id}><button className="text-sm text-foreground hover:text-primary text-left w-full">{c.title}</button></li>
              ))}
              {convs.length === 0 && <p className="text-xs text-muted-foreground">Suas perguntas aparecem aqui.</p>}
            </ul>
          </div>
          <div className="mt-4 rounded-lg border border-info/20 bg-info-soft p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-info mb-1.5">Como o Contta AI responde</p>
            <p className="text-sm">Sempre em blocos: resumo, o que mudou, causas, próximas ações e links para a origem do número.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
