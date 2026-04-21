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
        <div className="container py-20 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl text-balance">
            O Contta é uma plataforma para você ler o resultado da sua empresa — não um sistema operacional.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Fica entre as ferramentas que sua empresa já usa e a decisão da semana. Foco em margem, caixa, impostos e a próxima ação.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2"><Link to="/cadastro">Criar conta <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/login">Já tenho conta</Link></Button>
          </div>
        </div>
      </section>

      <Section eyebrow="Quatro pilares" title="Uma leitura clara do que está ajudando e do que está prejudicando o resultado.">
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { Icon: TrendingUp, t: "Entenda sua margem com clareza", d: "Veja onde sua margem está melhorando ou caindo por categoria, produto e tipo de receita. O Contta indica o que renegociar e onde reajustar preço." },
            { Icon: Wallet, t: "Antecipe seu caixa", d: "Saldo de hoje, projeção de 30 dias, recebíveis confirmados e contas a pagar no radar. Ajuda você a enxergar o aperto antes de ele acontecer." },
            { Icon: Receipt, t: "Contexto tributário do Brasil", d: "Regime, vencimentos e o impacto dos impostos no que você está prestes a fazer. Não substitui o contador, mas você nunca fica no escuro." },
            { Icon: Sparkles, t: "Contta AI", d: "Explica o que mudou no seu negócio em linguagem direta, mostra de onde tirou cada número e indica o quanto a resposta é confiável." },
          ].map((p, i) => (
            <div
              key={p.t}
              className="rounded-lg border border-border bg-card p-6 hover-lift transition-colors hover:border-primary/30 animate-fade-in-up"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary mb-4"><p.Icon className="h-5 w-5" /></div>
              <h3 className="font-semibold">{p.t}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Como você usa" title="Entrar com os dados → revisar o que importa → ler → decidir.">
        <ol className="space-y-4 max-w-2xl">
          {[
            "Conecte os bancos, importe os dados ou registre manualmente.",
            "Revise primeiro o que mais pode mudar o resultado: categorias, comprovantes e lançamentos duplicados.",
            "Leia margem e caixa, com nível de confiança em cada número.",
            "O Contta AI explica o que mudou e mostra a próxima ação que faz diferença.",
          ].map((s, i) => (
            <li key={i} className="flex gap-4 items-start">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground text-sm font-semibold">{i+1}</span>
              <p className="text-foreground">{s}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section eyebrow="O que o Contta NÃO é" title="Para deixar claro desde o começo.">
        <div className="grid md:grid-cols-3 gap-4">
          {[
            "Não emite nota fiscal nem controla estoque. Para isso, continue com o sistema que você já usa.",
            "Não é um chatbot genérico. O Contta AI lê os seus números, não a internet.",
            "Não substitui o contador. Ele continua sendo seu — o Contta organiza a leitura para você decidir.",
          ].map(t => (
            <div key={t} className="rounded-lg border border-border p-5 bg-card hover-lift transition-colors hover:border-primary/30">
              <p className="text-sm leading-relaxed">{t}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section eyebrow="Para quem é" title="Pensado para quem precisa decidir com clareza, sem virar contador.">
        <ul className="grid md:grid-cols-2 gap-3 max-w-3xl">
          {[
            "Donos de pequenas e médias empresas no Brasil",
            "Sócios e gestores que tocam a parte financeira",
            "Líderes financeiros e controllers",
            "Quem fecha o mês e precisa explicar o resultado para o time",
          ].map(t => (
            <li key={t} className="flex items-center gap-2 text-foreground"><Check className="h-4 w-4 text-success" /> {t}</li>
          ))}
        </ul>
      </Section>

      <section className="container pb-24 pt-10">
        <div className="rounded-2xl bg-gradient-hero text-primary-foreground p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary-foreground">Pronto para uma leitura confiável da sua empresa?</h2>
          <Button asChild size="lg" variant="secondary" className="mt-6 gap-2"><Link to="/cadastro">Criar conta <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </section>
    </>
  );
}
