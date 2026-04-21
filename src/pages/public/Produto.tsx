import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  ArrowRight,
  TrendingUp,
  Wallet,
  Receipt,
  Sparkles,
  Check,
  X,
  ShieldCheck,
  Users,
  LineChart,
  Layers,
} from "lucide-react";

export default function Produto() {
  usePageMeta({
    title: "Produto · Contta — Leitura semanal de margem e caixa",
    description:
      "Conheça o Contta: uma plataforma que lê os números da sua empresa e mostra margem, caixa e a próxima ação. Sem virar ERP, sem ser chatbot genérico.",
  });

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-60" aria-hidden />
        <div
          className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl animate-ambient"
          aria-hidden
        />
        <div className="container relative py-20 md:py-24 animate-fade-in-up">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft/70 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="h-3 w-3" /> Plataforma de leitura financeira
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl lg:text-[54px] font-semibold leading-[1.05] tracking-tight max-w-3xl text-balance">
            O Contta é uma plataforma para você{" "}
            <span className="font-display italic font-normal text-primary">ler</span> o resultado da sua empresa — não
            um sistema operacional.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Fica entre as ferramentas que sua empresa já usa e a decisão da semana. Foco em margem, caixa, impostos e
            a próxima ação.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="gap-2 hover:-translate-y-0.5 transition-transform">
              <Link to="/cadastro">
                Criar conta <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="hover:-translate-y-0.5 transition-transform">
              <Link to="/login">Já tenho conta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* SECTION 1 — BENTO: Quatro pilares */}
      <section className="container py-20 md:py-24">
        <Reveal className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-2">
            <span className="h-1 w-8 rounded-full bg-primary" /> Quatro pilares
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight max-w-3xl text-balance">
            Uma leitura clara do que está ajudando e do que está prejudicando o resultado.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 md:grid-cols-3 md:auto-rows-[minmax(200px,auto)]">
          <Reveal variant="scale" className="md:col-span-2 md:row-span-2">
            <div className="group relative h-full rounded-2xl border border-primary/30 bg-gradient-to-br from-primary-soft/60 via-card to-card p-7 md:p-9 overflow-hidden card-glow">
              <div
                className="pointer-events-none absolute -top-20 -right-16 h-52 w-52 rounded-full bg-primary/15 blur-3xl animate-ambient"
                aria-hidden
              />
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card transition-transform group-hover:scale-110">
                <TrendingUp className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight">Entenda sua margem com clareza</h3>
              <p className="mt-3 text-muted-foreground leading-relaxed max-w-lg">
                Veja onde sua margem está melhorando ou caindo por categoria, produto e tipo de receita. O Contta
                indica o que renegociar e onde reajustar preço.
              </p>
            </div>
          </Reveal>

          {[
            {
              icon: Wallet,
              t: "Antecipe seu caixa",
              d: "Saldo de hoje, projeção de 30 dias, recebíveis confirmados e contas a pagar no radar.",
            },
            {
              icon: Receipt,
              t: "Contexto tributário",
              d: "Regime, vencimentos e o impacto dos impostos no que você está prestes a fazer.",
            },
          ].map((p, i) => (
            <Reveal key={p.t} delay={(i + 1) * 90} variant="up">
              <div className="group h-full rounded-2xl border border-border bg-card p-6 card-glow">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-soft text-primary transition-transform group-hover:scale-110">
                  <p.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{p.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            </Reveal>
          ))}

          <Reveal delay={240} variant="up" className="md:col-span-3">
            <div className="group rounded-2xl border border-border bg-gradient-to-r from-card via-card to-primary-soft/40 p-6 card-glow flex flex-col md:flex-row md:items-center gap-5">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-soft text-primary transition-transform group-hover:scale-110 shrink-0">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Contta AI</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  Explica o que mudou no seu negócio em linguagem direta, mostra de onde tirou cada número e indica o
                  quanto a resposta é confiável.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 2 — SPLIT-SCREEN: Como você usa */}
      <section className="relative bg-card/40 border-y border-border overflow-hidden">
        <div className="container py-20 md:py-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            <Reveal variant="left" className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-2">
                <span className="h-1 w-8 rounded-full bg-primary" /> Como você usa
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-balance">
                Entrar com os dados → revisar o que importa → ler → decidir.
              </h2>
              <p className="mt-4 text-muted-foreground">
                Quatro passos curtos. Sem virar uma operação paralela. Você acompanha sem precisar de planilha
                auxiliar.
              </p>
              <Button asChild variant="outline" className="mt-6 gap-1.5">
                <Link to="/como-funciona">Ver detalhes <ArrowRight className="h-3.5 w-3.5" /></Link>
              </Button>
            </Reveal>

            <div className="lg:col-span-7 space-y-3">
              {[
                "Conecte os bancos, importe os dados ou registre manualmente.",
                "Revise primeiro o que mais pode mudar o resultado: categorias, comprovantes e lançamentos duplicados.",
                "Leia margem e caixa, com nível de confiança em cada número.",
                "O Contta AI explica o que mudou e mostra a próxima ação que faz diferença.",
              ].map((s, i) => (
                <Reveal key={i} delay={i * 90} variant="right">
                  <div className="group relative flex gap-4 items-start rounded-xl border border-border bg-card p-4 md:p-5 card-glow">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary text-primary-foreground text-sm font-semibold transition-transform group-hover:scale-110">
                      {i + 1}
                    </span>
                    <p className="text-foreground/95 pt-1">{s}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — CHECKLIST / COMPARISON: O que o Contta É e NÃO é */}
      <section className="container py-20 md:py-24">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-2">
            <span className="h-1 w-8 rounded-full bg-primary" /> Para deixar claro
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-balance">
            O que o Contta é — e o que ele não é.
          </h2>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-2 gap-5">
          <Reveal variant="left">
            <div className="h-full rounded-2xl border border-success/30 bg-success-soft/30 p-6 md:p-7 card-glow">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-success">
                <Check className="h-3.5 w-3.5" /> O Contta é
              </div>
              <ul className="mt-5 space-y-3.5">
                {[
                  "Uma leitura semanal do resultado da sua empresa.",
                  "Margem, caixa, contexto tributário e próxima ação em um único lugar.",
                  "Um assistente que explica o que mudou — com origem do dado.",
                  "Pensado para donos de negócio, não para contadores.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 text-success shrink-0" />
                    <span className="text-foreground/95">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal variant="right" delay={100}>
            <div className="h-full rounded-2xl border border-border bg-card p-6 md:p-7 card-glow">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <X className="h-3.5 w-3.5" /> O Contta não é
              </div>
              <ul className="mt-5 space-y-3.5">
                {[
                  "Não emite nota fiscal nem controla estoque. Continue com o sistema que você já usa.",
                  "Não é um chatbot genérico. O Contta AI lê os seus números, não a internet.",
                  "Não substitui o contador. Ele continua sendo seu — o Contta organiza a leitura para você decidir.",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm">
                    <X className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-foreground/85">{t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* SECTION 4 — STRONG CONTRAST: Para quem é */}
      <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 -left-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl animate-ambient"
          aria-hidden
        />
        <div className="container relative py-20 md:py-24">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
            <Reveal className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/75 inline-flex items-center gap-2">
                <span className="h-1 w-8 rounded-full bg-primary-foreground/60" /> Para quem é
              </p>
              <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-balance text-primary-foreground">
                Pensado para quem precisa decidir com clareza, sem virar contador.
              </h2>
              <p className="mt-4 text-primary-foreground/85 max-w-xl">
                Se você fecha o mês com a sensação de não saber exatamente onde está ganhando ou perdendo, o Contta
                foi feito para você.
              </p>
            </Reveal>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {[
                { icon: Users, t: "Donos de pequenas e médias empresas no Brasil" },
                { icon: ShieldCheck, t: "Sócios e gestores que tocam a parte financeira" },
                { icon: LineChart, t: "Líderes financeiros e controllers" },
                { icon: Layers, t: "Quem fecha o mês e precisa explicar o resultado para o time" },
              ].map((p, i) => (
                <Reveal key={p.t} delay={i * 90} variant="up">
                  <div className="group h-full rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.05] backdrop-blur-sm p-5 transition-all hover:bg-primary-foreground/[0.09] hover:-translate-y-1">
                    <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary-foreground/10 text-primary-foreground transition-transform group-hover:scale-110">
                      <p.icon className="h-5 w-5" />
                    </div>
                    <p className="mt-4 text-sm text-primary-foreground/95 leading-relaxed">{p.t}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container py-20">
        <Reveal variant="scale">
          <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary-soft/40 p-10 md:p-14 text-center overflow-hidden card-glow">
            <div
              className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[60%] rounded-full bg-primary/15 blur-3xl animate-ambient"
              aria-hidden
            />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary-foreground/95 [color:hsl(var(--foreground))]">
                Pronto para uma leitura confiável da sua empresa?
              </h2>
              <Button asChild size="lg" className="mt-6 gap-2 hover:-translate-y-0.5 transition-transform">
                <Link to="/cadastro">
                  Criar conta <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
