import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck, Compass, MessageSquareQuote, X } from "lucide-react";

const questions = [
  "Por que a margem caiu este mês?",
  "Posso pagar a folha sem apertar o caixa?",
  "Quais despesas cresceram acima do esperado?",
  "Quais clientes estão atrasando pagamento?",
  "Em quanto tempo o caixa pode ficar negativo?",
  "Qual produto está com margem mais comprometida?",
];

export default function ContaAI() {
  return (
    <>
      <section className="bg-gradient-soft">
        <div className="container py-20 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Contta AI
            </span>
            <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight text-balance">Uma camada de interpretação, não um chatbot.</h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">O Contta AI lê os seus números — não a internet. Responde no contexto do seu negócio, mostra de onde tirou cada conclusão e indica o nível de confiança.</p>
            <Button asChild size="lg" className="mt-7 gap-2"><Link to="/cadastro">Experimentar grátis <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
          <div className="rounded-xl border border-border bg-card shadow-elegant p-5">
            <p className="text-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> Resposta do Contta AI</p>
            <p className="mt-3 font-medium">Por que a margem caiu este mês?</p>
            <div className="mt-4 space-y-3 text-sm">
              <div className="rounded-md bg-secondary p-3"><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Resumo</p>Margem bruta passou de 64,3% para 59,1%. Receita +4%, custos +14%.</div>
              <div className="rounded-md bg-secondary p-3"><p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">O que mudou</p>Insumos +18% · Energia +12% · Marketing −22%</div>
              <div className="rounded-md bg-primary-soft p-3"><p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Próxima ação</p>Renegociar 2 maiores fornecedores de insumos antes do fechamento.</div>
              <div className="text-xs text-muted-foreground">Confiança: <span className="text-info">com ressalvas</span> · 5 itens pendentes podem alterar o cálculo.</div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight max-w-2xl">Perguntas que ele responde de fato.</h2>
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {questions.map(q => (
            <div key={q} className="rounded-lg border border-border p-4 bg-card flex items-start gap-3">
              <MessageSquareQuote className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <p className="text-sm text-foreground">{q}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card/40 border-y border-border">
        <div className="container py-20 grid md:grid-cols-2 gap-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Como se diferencia</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight max-w-md">Não é um wrapper de LLM com prompt bonito.</h2>
          </div>
          <ul className="space-y-3">
            {[
              { yes: true, t: "Lê seus dados financeiros normalizados — não texto livre." },
              { yes: true, t: "Mostra confiança e dados de origem em toda resposta." },
              { yes: true, t: "Integra com a leitura de margem e de caixa do produto." },
              { yes: false, t: "Não substitui contador. Não dá conselho fiscal genérico." },
              { yes: false, t: "Não responde fora de contexto financeiro do seu negócio." },
            ].map((row, i) => (
              <li key={i} className="flex items-start gap-3">
                {row.yes ? <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" /> : <X className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />}
                <span>{row.t}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container py-20 text-center">
        <Compass className="h-10 w-10 mx-auto text-primary" />
        <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">Pronto para uma interpretação que cabe no seu contexto?</h2>
        <Button asChild size="lg" className="mt-6 gap-2"><Link to="/cadastro">Entrar na plataforma <ArrowRight className="h-4 w-4" /></Link></Button>
      </section>
    </>
  );
}
