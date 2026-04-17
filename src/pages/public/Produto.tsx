import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Wallet, Receipt, Sparkles, Check } from "lucide-react";

const Section = ({ eyebrow, title, children }: any) => (
  <section className="container py-16 border-b border-border last:border-b-0">
    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
    <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight max-w-3xl text-balance">{title}</h2>
    <div className="mt-6">{children}</div>
  </section>
);

export default function Produto() {
  return (
    <>
      <section className="bg-gradient-soft">
        <div className="container py-20">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl text-balance">O Contta é uma plataforma de leitura financeira — não um ERP.</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">Cabe entre o seu sistema operacional e a sua decisão semanal. Foco em margem, caixa, contexto tributário e ação.</p>
          <div className="mt-7 flex gap-3">
            <Button asChild size="lg" className="gap-2"><Link to="/cadastro">Criar conta <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/login">Já tenho conta</Link></Button>
          </div>
        </div>
      </section>

      <Section eyebrow="Quatro pilares" title="Uma leitura coerente entre profitabilidade, liquidez e contexto.">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { Icon: TrendingUp, t: "Clareza de margem", d: "DRE simplificado, custos sob pressão e precificação onde dói. Direciona o que renegociar e o que reajustar." },
            { Icon: Wallet, t: "Clareza de caixa", d: "Saldo atual, projeção de 30 dias, recebíveis confirmados e obrigações no radar. Antecipa o aperto." },
            { Icon: Receipt, t: "Contexto tributário Brasil", d: "Regime, vencimentos e impacto fiscal — sem substituir a contabilidade, mas sem deixar você no escuro." },
            { Icon: Sparkles, t: "Contta AI", d: "Camada de interpretação. Explica o que mudou no seu negócio em linguagem direta — com nível de confiança." },
          ].map(p => (
            <div key={p.t} className="rounded-lg border border-border bg-card p-6">
              <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary mb-4"><p.Icon className="h-5 w-5" /></div>
              <h3 className="font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Loop principal" title="Entrar dados → confiar nos números → ler → decidir.">
        <ol className="space-y-4 max-w-2xl">
          {[
            "Entre, importe ou organize os dados financeiros da empresa.",
            "Construa confiança nos números com a fila de revisão priorizada.",
            "Leia margem e caixa com indicador de confiança explícito.",
            "Receba do Contta AI a explicação do que mudou e a próxima ação relevante.",
          ].map((s, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">{i+1}</span>
              <p className="text-foreground">{s}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="O que o Contta NÃO é" title="Posicionamento honesto.">
        <div className="grid md:grid-cols-3 gap-4">
          {["Não é um ERP — não emite nota nem opera estoque.","Não é um chatbot genérico — interpreta seus números, não a internet.","Não é automação de back-office — é leitura para decidir."].map(t => (
            <div key={t} className="rounded-lg border border-border p-5 bg-card">
              <p className="text-sm">{t}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Para quem" title="Pensado para quem precisa decidir com clareza.">
        <ul className="grid md:grid-cols-2 gap-3 max-w-3xl">
          {["Founders de PMEs brasileiras","Controllers e líderes financeiros","Sócios-administradores","Quem fecha o mês e precisa explicar o resultado"].map(t => (
            <li key={t} className="flex items-center gap-2 text-foreground"><Check className="h-4 w-4 text-success" /> {t}</li>
          ))}
        </ul>
      </Section>

      <section className="container pb-24 pt-10">
        <div className="rounded-2xl bg-gradient-hero text-primary-foreground p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Pronto para uma leitura confiável?</h2>
          <Button asChild size="lg" variant="secondary" className="mt-6 gap-2"><Link to="/cadastro">Criar conta <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </section>
    </>
  );
}
