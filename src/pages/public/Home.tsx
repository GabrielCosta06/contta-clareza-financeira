import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  ArrowRight,
  Check,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Receipt,
  Lock,
  Eye,
  EyeOff,
  CalendarClock,
  AlertTriangle,
  Layers,
  FileSpreadsheet,
  Search,
  LineChart,
  CheckCircle2,
  Zap,
  Clock,
  Target,
} from "lucide-react";

export default function Home() {
  usePageMeta({
    title: "Contta — Clareza financeira para empresas brasileiras",
    description:
      "Veja toda semana onde sua margem está subindo e onde está caindo. O Contta mostra margem, caixa e a próxima ação que faz diferença no resultado da sua empresa.",
  });

  return (
    <>
      {/* HERO — alive with floating chips and ambient grid */}
      <section className="relative overflow-hidden bg-gradient-soft">
        {/* Ambient backdrop */}
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-70" aria-hidden />
        <div
          className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-primary/10 blur-3xl animate-ambient"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-40 -left-32 h-[360px] w-[360px] rounded-full bg-info/10 blur-3xl animate-ambient"
          style={{ animationDelay: "3s" }}
          aria-hidden
        />

        <div className="container relative py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft/70 backdrop-blur px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Feito para empresas brasileiras
            </span>
            <h1 className="mt-5 text-4xl md:text-5xl lg:text-[56px] font-semibold leading-[1.05] tracking-tight text-foreground text-balance">
              Veja toda semana onde sua margem está{" "}
              <span className="font-display italic font-normal text-primary">subindo</span> — e onde está caindo.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl text-balance">
              O Contta lê seus extratos, vendas e contas a pagar e mostra, em uma única tela, o que importa: sua
              margem, o caixa dos próximos dias, o impacto dos impostos e a próxima ação que faz diferença no
              resultado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                asChild
                size="lg"
                className="gap-2 shadow-card hover:shadow-lg transition-shadow hover:-translate-y-0.5 duration-300"
              >
                <Link to="/cadastro">
                  Começar grátis <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="hover:-translate-y-0.5 transition-transform duration-300">
                <Link to="/produto">Ver como funciona</Link>
              </Button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" /> Primeira leitura em minutos
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" /> Sem instalar nada
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-success" /> Cancele quando quiser
              </span>
            </div>
          </div>

          {/* Hero visual: dashboard mock + floating data chips */}
          <div className="relative animate-fade-in" style={{ animationDelay: "120ms" }}>
            <div className="absolute -inset-8 bg-gradient-hero opacity-20 blur-3xl rounded-[2rem]" aria-hidden />

            {/* Floating chips */}
            <div
              className="hidden md:flex chip absolute -left-6 top-6 z-10 animate-float-slow shadow-card"
              aria-hidden
            >
              <TrendingUp className="h-3.5 w-3.5 text-success" /> Margem +3,2%
            </div>
            <div
              className="hidden md:flex chip absolute -right-4 top-24 z-10 animate-float shadow-card"
              style={{ animationDelay: "1.2s" }}
              aria-hidden
            >
              <CalendarClock className="h-3.5 w-3.5 text-warning" /> 19 dias até o aperto
            </div>
            <div
              className="hidden md:flex chip absolute -left-2 -bottom-3 z-10 animate-drift shadow-card"
              style={{ animationDelay: "0.4s" }}
              aria-hidden
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" /> Próxima ação pronta
            </div>

            <div className="relative rounded-xl border border-border bg-card shadow-elegant overflow-hidden transition-transform duration-500 hover:-translate-y-1">
              <div className="border-b px-4 py-3 flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="ml-3 text-xs text-muted-foreground">contta.app · Visão geral</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="rounded-lg border border-warning/30 bg-warning-soft p-3 flex items-start gap-2.5">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-warning animate-pulse-soft" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Margem caiu 5,2% este mês</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Insumos +18% e energia +12% explicam a maior parte.
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-background p-4 transition-colors hover:border-primary/30">
                    <p className="text-xs text-muted-foreground">Margem bruta</p>
                    <p className="mt-1 text-2xl font-semibold num">59,1%</p>
                    <p className="text-xs text-destructive mt-0.5">−5,2% vs mês anterior</p>
                  </div>
                  <div className="rounded-lg border bg-background p-4 transition-colors hover:border-primary/30">
                    <p className="text-xs text-muted-foreground">Caixa em 30d</p>
                    <p className="mt-1 text-2xl font-semibold num">R$ 18,4 mil</p>
                    <p className="text-xs text-warning mt-0.5">Risco de aperto em ~19 dias</p>
                  </div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary-soft/40 p-3.5">
                  <p className="text-xs font-medium text-primary uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3" /> Contta AI
                  </p>
                  <p className="mt-1.5 text-sm text-foreground">
                    Recomendo renegociar 2 fornecedores de insumos antes do próximo fechamento. Pode recuperar cerca
                    de 3% da margem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM — asymmetric: intro left, staggered cards right */}
      <section className="container py-20 md:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start" variant="left">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-primary" /> O problema
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-balance">
              Muitas empresas olham o extrato, mas ainda não conseguem saber se realmente tiveram lucro.
            </h2>
            <p className="mt-4 text-muted-foreground text-balance">
              Planilhas espalhadas, categorias inconsistentes, conciliação atrasada. A leitura financeira chega
              tarde — e quase nunca diz qual é a próxima decisão.
            </p>
            <div className="mt-6 hidden lg:flex items-center gap-2 text-xs text-muted-foreground">
              <span className="h-px w-10 bg-border" />
              <span>4 sintomas que aparecem todo mês</span>
            </div>
          </Reveal>

          <div className="lg:col-span-7 space-y-4">
            {[
              {
                icon: EyeOff,
                t: "Margem invisível",
                d: "Você sabe quanto vendeu, mas não sabe onde está perdendo dinheiro.",
              },
              {
                icon: AlertTriangle,
                t: "Caixa sem antecipação",
                d: "Descobre o aperto quando ele já está acontecendo, não com semanas de antecedência.",
              },
              {
                icon: Search,
                t: "Pouca confiança nos números",
                d: "Categorias incompletas, conciliação atrasada, dúvida no fechamento.",
              },
              {
                icon: Layers,
                t: "Controles dispersos",
                d: "Bancos, maquininha, planilha e ERP cada um contando uma história diferente.",
              },
            ].map((p, i) => (
              <Reveal
                key={p.t}
                delay={i * 90}
                variant="up"
                className={i % 2 === 1 ? "lg:ml-10" : ""}
              >
                <div className="group rounded-xl border border-border bg-card p-5 card-glow flex gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-destructive-soft text-destructive transition-transform group-hover:scale-110">
                    <p.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{p.t}</p>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PILLARS — 2x2 bento with one featured card */}
      <section className="relative bg-card/40 border-y border-border overflow-hidden">
        <div className="pointer-events-none absolute inset-0 grid-fade opacity-40" aria-hidden />
        <div className="container relative py-20 md:py-24">
          <Reveal className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-primary" /> Quatro pilares
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-balance">
              Uma leitura semanal que une margem, caixa e contexto.
            </h2>
          </Reveal>

          <div className="mt-12 grid gap-4 md:grid-cols-3 md:auto-rows-[minmax(220px,auto)]">
            {/* Featured large card */}
            <Reveal variant="scale" className="md:col-span-2 md:row-span-2">
              <div className="group relative h-full rounded-2xl border border-primary/30 bg-gradient-to-br from-primary-soft/60 via-card to-card p-7 md:p-9 overflow-hidden card-glow">
                <div
                  className="pointer-events-none absolute -top-24 -right-16 h-56 w-56 rounded-full bg-primary/15 blur-3xl animate-ambient"
                  aria-hidden
                />
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary text-primary-foreground shadow-card transition-transform group-hover:scale-110">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-2xl font-semibold tracking-tight">Entenda sua margem com clareza</h3>
                <p className="mt-3 text-muted-foreground leading-relaxed max-w-lg">
                  Veja onde sua margem está melhorando ou caindo por categoria, produto e tipo de receita.
                  Identifique rapidamente o que está puxando o resultado para baixo — e o que está ajudando.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs">
                  <span className="chip"><LineChart className="h-3 w-3 text-primary" /> por categoria</span>
                  <span className="chip"><Target className="h-3 w-3 text-primary" /> por produto</span>
                  <span className="chip"><Zap className="h-3 w-3 text-primary" /> causa provável</span>
                </div>
              </div>
            </Reveal>

            {[
              {
                icon: Wallet,
                t: "Antecipe o caixa",
                d: "Saiba quando o caixa pode apertar nas próximas semanas, com recebíveis e contas a pagar no radar.",
                delay: 80,
              },
              {
                icon: Receipt,
                t: "Contexto tributário",
                d: "Regime, obrigações e o impacto dos impostos no que você está prestes a fazer — sem virar contabilidade.",
                delay: 160,
              },
            ].map((p) => (
              <Reveal key={p.t} delay={p.delay} variant="up">
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
              <div className="group rounded-2xl border border-border bg-gradient-to-r from-card via-card to-primary-soft/40 p-6 card-glow flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="flex items-start gap-4">
                  <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary-soft text-primary transition-transform group-hover:scale-110">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Contta AI</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                      Interpretação contextual do seu negócio. Não responde no genérico. Responde nos seus
                      números, com origem do dado e nível de confiança em cada resposta.
                    </p>
                  </div>
                </div>
                <Button asChild variant="outline" size="sm" className="shrink-0">
                  <Link to="/contta-ai" className="gap-1.5">
                    Conhecer o Contta AI <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — connected process flow */}
      <section className="container py-20 md:py-24">
        <Reveal className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary inline-flex items-center gap-2">
            <span className="h-1 w-8 rounded-full bg-primary" /> Como funciona
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight">
            Quatro etapas até a leitura semanal.
          </h2>
        </Reveal>

        <div className="mt-14 relative">
          {/* Horizontal connector line on desktop */}
          <div
            className="hidden lg:block absolute top-6 left-[6%] right-[6%] h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
            aria-hidden
          />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                n: "01",
                icon: FileSpreadsheet,
                t: "Entrar com os dados",
                d: "Importe extratos, planilhas ou conecte bancos e maquininha.",
              },
              {
                n: "02",
                icon: Search,
                t: "Foque no que muda o resultado",
                d: "A revisão destaca primeiro o que mais pode impactar o resultado: categorias, comprovantes e duplicidades.",
              },
              {
                n: "03",
                icon: LineChart,
                t: "Ler margem e caixa",
                d: "Visão semanal de lucro e caixa de curto prazo, com nível de confiança explícito.",
              },
              {
                n: "04",
                icon: CheckCircle2,
                t: "Decidir a próxima ação",
                d: "O Contta AI explica o que mudou e sugere a próxima ação financeiramente relevante.",
              },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 110} variant="up" className="relative">
                <div className="group relative">
                  {/* Numbered node */}
                  <div className="relative z-10 mx-auto grid h-12 w-12 place-items-center rounded-full border border-primary/30 bg-background shadow-card transition-transform group-hover:scale-110">
                    <span className="font-display text-lg text-primary">{s.n}</span>
                  </div>
                  <div className="mt-6 rounded-xl border border-border bg-card p-5 card-glow text-center md:text-left">
                    <s.icon className="h-5 w-5 text-primary mx-auto md:mx-0" />
                    <p className="mt-3 font-semibold text-foreground">{s.t}</p>
                    <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF — before/after comparison feel */}
      <section className="relative bg-gradient-hero text-primary-foreground overflow-hidden">
        <div
          className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full bg-primary/15 blur-3xl animate-ambient"
          aria-hidden
        />
        <div className="container relative py-20 md:py-24">
          <Reveal className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/75 inline-flex items-center gap-2">
              <span className="h-1 w-8 rounded-full bg-primary-foreground/60" /> Resultado prático
            </p>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold tracking-tight text-balance text-primary-foreground">
              A pergunta certa, no dia certo, com o número confiável.
            </h2>
            <p className="mt-4 text-primary-foreground/85 max-w-xl">
              A leitura semanal do Contta substitui o ritual de "abrir 4 planilhas no domingo à noite" por uma única
              conversa com seus números.
            </p>
          </Reveal>

          {/* Before / After */}
          <div className="mt-12 grid lg:grid-cols-2 gap-5">
            <Reveal variant="left">
              <div className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.04] backdrop-blur-sm p-6 md:p-7 h-full">
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary-foreground/65">
                  <Clock className="h-3.5 w-3.5" /> Antes
                </div>
                <h3 className="mt-2 text-xl font-semibold text-primary-foreground">O domingo das planilhas</h3>
                <ul className="mt-5 space-y-3 text-sm text-primary-foreground/80">
                  {[
                    "Abrir 4 abas e ainda assim duvidar do número",
                    "Descobrir o aperto de caixa quando ele já está acontecendo",
                    "Categorias confusas e conciliação sempre atrasada",
                    "Decisão sem contexto, no susto",
                  ].map((t) => (
                    <li key={t} className="flex items-start gap-2.5">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-destructive/80 shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal variant="right" delay={120}>
              <div className="relative rounded-2xl border border-primary/40 bg-primary-foreground/[0.06] backdrop-blur-sm p-6 md:p-7 h-full shadow-elegant">
                <span className="absolute -top-2.5 left-6 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" /> Com Contta
                </span>
                <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-primary-foreground/80">
                  <Zap className="h-3.5 w-3.5" /> Depois
                </div>
                <h3 className="mt-2 text-xl font-semibold text-primary-foreground">Uma leitura, decisão clara</h3>
                <ul className="mt-5 space-y-3 text-sm text-primary-foreground/90">
                  {[
                    { t: "Antecipa apertos de caixa", n: "15–30 dias antes" },
                    { t: "Mostra onde a margem está caindo", n: "por categoria e causa provável" },
                    { t: "Reduz o tempo de fechamento", n: "começa pelo que mais impacta" },
                    { t: "Direciona a próxima ação", n: "decisão, não dashboard" },
                  ].map((p) => (
                    <li key={p.t} className="flex items-start gap-2.5">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                      <span>
                        <span className="font-medium text-primary-foreground">{p.t}</span>{" "}
                        <span className="text-primary-foreground/70">— {p.n}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Highlighted numbers */}
          <Reveal delay={200} className="mt-10">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { n: "−40%", t: "tempo no fechamento semanal" },
                { n: "+3 a 6%", t: "margem recuperada por trimestre" },
                { n: "15–30d", t: "antecedência típica de aperto de caixa" },
              ].map((s) => (
                <div
                  key={s.t}
                  className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.05] p-5 text-center"
                >
                  <p className="text-3xl md:text-4xl font-semibold text-primary-foreground num">{s.n}</p>
                  <p className="mt-1.5 text-xs text-primary-foreground/70">{s.t}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUST */}
      <section className="container py-20 md:py-24">
        <div className="grid lg:grid-cols-3 gap-6">
          {[
            {
              icon: ShieldCheck,
              t: "Confiança explícita nos dados",
              d: "Cada visão mostra se os dados são suficientes, parciais, com ressalvas ou confiáveis.",
            },
            {
              icon: Lock,
              t: "Privacidade e isolamento",
              d: "Cada empresa em ambiente próprio. Acesso por papel. Auditoria das ações sensíveis.",
            },
            {
              icon: Eye,
              t: "Sem caixa-preta",
              d: "Toda interpretação do Contta AI mostra de onde veio o número e o nível de confiança.",
            },
          ].map((s, i) => (
            <Reveal key={s.t} delay={i * 100} variant="up">
              <div className="h-full rounded-xl border border-border p-6 bg-card card-glow">
                <s.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 font-semibold">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container pb-24">
        <Reveal variant="scale">
          <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary-soft/40 p-10 md:p-14 text-center overflow-hidden card-glow">
            <div
              className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[60%] rounded-full bg-primary/15 blur-3xl animate-ambient"
              aria-hidden
            />
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">
                Pare de adivinhar. Leia o seu negócio.
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
                Crie sua conta e tenha sua primeira leitura financeira em poucos minutos.
              </p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <Button asChild size="lg" className="gap-2 hover:-translate-y-0.5 transition-transform">
                  <Link to="/cadastro">
                    Criar conta <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="hover:-translate-y-0.5 transition-transform">
                  <Link to="/contta-ai">Conhecer o Contta AI</Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
