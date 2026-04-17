import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ShieldCheck, Sparkles, TrendingUp, Wallet, Receipt, Lock, Eye, Zap } from "lucide-react";

const Pillar = ({ icon: Icon, title, children }: any) => (
  <div className="rounded-lg border border-border bg-card p-6">
    <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary mb-4">
      <Icon className="h-5 w-5" />
    </div>
    <h3 className="font-semibold text-foreground">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{children}</p>
  </div>
);

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-soft">
        <div className="container py-20 md:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Clareza financeira para PMEs brasileiras
            </span>
            <h1 className="mt-5 text-4xl md:text-5xl lg:text-[56px] font-semibold leading-[1.05] tracking-tight text-foreground text-balance">
              Onde sua margem está sendo <span className="font-display italic font-normal text-primary">protegida</span> — e onde está sendo erodida.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl text-balance">
              Contta é a plataforma web de leitura financeira semanal para pequenas e médias empresas brasileiras. Margem, caixa, contexto tributário e a próxima ação relevante — em uma única tela confiável.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2"><Link to="/cadastro">Criar conta <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/produto">Entender o produto</Link></Button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Não é um ERP</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Não é chatbot genérico</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Foco em leitura semanal</span>
            </div>
          </div>

          {/* Hero visual: dashboard mock */}
          <div className="relative animate-fade-in">
            <div className="absolute -inset-6 bg-gradient-hero opacity-10 blur-3xl rounded-3xl" aria-hidden />
            <div className="relative rounded-xl border border-border bg-card shadow-elegant overflow-hidden">
              <div className="border-b px-4 py-3 flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <span className="ml-3 text-xs text-muted-foreground">contta.app · Visão geral</span>
              </div>
              <div className="p-5 space-y-4">
                <div className="rounded-lg border border-warning/30 bg-warning-soft p-3 flex items-start gap-2.5">
                  <span className="mt-0.5 h-2 w-2 rounded-full bg-warning" />
                  <div className="text-sm">
                    <p className="font-medium text-foreground">Margem caiu 5,2% este mês</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Insumos +18% e energia +12% explicam a maior parte.</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-xs text-muted-foreground">Margem bruta</p>
                    <p className="mt-1 text-2xl font-semibold num">59,1%</p>
                    <p className="text-xs text-destructive mt-0.5">−5,2 p.p. vs mês anterior</p>
                  </div>
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-xs text-muted-foreground">Caixa em 30d</p>
                    <p className="mt-1 text-2xl font-semibold num">R$ 18,4 mil</p>
                    <p className="text-xs text-warning mt-0.5">Risco de aperto em ~19 dias</p>
                  </div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary-soft/40 p-3.5">
                  <p className="text-xs font-medium text-primary uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> Contta AI</p>
                  <p className="mt-1.5 text-sm text-foreground">Recomendo renegociar 2 fornecedores de insumos antes do próximo fechamento. Isso pode recuperar ~3 p.p. de margem.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="container py-20 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">O problema</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-balance">A maioria das PMEs olha o extrato e ainda não sabe se ganhou dinheiro.</h2>
          <p className="mt-4 text-muted-foreground text-balance">Planilhas espalhadas, categorias inconsistentes, conciliação atrasada. A leitura financeira chega tarde — e quase nunca diz qual é a próxima decisão.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: "Margem invisível", d: "Você sabe quanto vendeu, mas não sabe onde a margem está sendo erodida." },
            { t: "Caixa sem antecipação", d: "Descobre o aperto quando ele já está acontecendo, não com semanas de antecedência." },
            { t: "Pouca confiança nos números", d: "Categorias incompletas, conciliação atrasada, dúvida no fechamento." },
            { t: "Controles dispersos", d: "Bancos, maquininha, planilha e ERP cada um contando uma história diferente." },
          ].map(p => (
            <div key={p.t} className="rounded-lg border border-border bg-card p-5">
              <p className="font-medium text-foreground">{p.t}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PILLARS */}
      <section className="bg-card/40 border-y border-border">
        <div className="container py-20 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">Quatro pilares</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-balance">Uma leitura semanal que une margem, caixa e contexto.</h2>
          </div>
          <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Pillar icon={TrendingUp} title="Clareza de margem">Onde a margem está sendo protegida ou erodida — por categoria, produto e linha de receita.</Pillar>
            <Pillar icon={Wallet} title="Clareza de caixa">Quando o caixa pode apertar nas próximas semanas, com recebíveis e obrigações no radar.</Pillar>
            <Pillar icon={Receipt} title="Contexto tributário">Regime, obrigações e o impacto fiscal do que você está prestes a fazer — sem virar contabilidade.</Pillar>
            <Pillar icon={Sparkles} title="Contta AI">Interpretação contextual do seu negócio. Não responde no genérico. Responde nos seus números.</Pillar>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container py-20 md:py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Como funciona</p>
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight">Quatro etapas até a leitura semanal.</h2>
        </div>
        <div className="mt-10 grid md:grid-cols-4 gap-6">
          {[
            { n: "01", t: "Entrar com os dados", d: "Importe extratos, planilhas ou conecte bancos e maquininha." },
            { n: "02", t: "Construir confiança", d: "A revisão prioriza o que pode mudar o resultado: categorias, evidências e duplicidades." },
            { n: "03", t: "Ler margem e caixa", d: "Visão semanal de profitabilidade e liquidez de curto prazo, com nível de confiança explícito." },
            { n: "04", t: "Decidir a próxima ação", d: "O Contta AI explica o que mudou e sugere a próxima ação financeiramente relevante." },
          ].map(s => (
            <div key={s.n} className="rounded-lg border border-border p-5 bg-card">
              <p className="font-display text-3xl text-primary">{s.n}</p>
              <p className="mt-3 font-semibold text-foreground">{s.t}</p>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROOF */}
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="container py-20 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider opacity-80">Resultado prático</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-balance">A pergunta certa, no dia certo, com o número confiável.</h2>
            <p className="mt-4 opacity-90 max-w-xl">A leitura semanal do Contta substitui o ritual de "abrir 4 planilhas no domingo à noite" por uma única conversa com seus números.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { t: "Antecipa apertos de caixa", d: "Em média, 15 a 30 dias antes." },
              { t: "Identifica erosão de margem", d: "Por categoria, com causa provável." },
              { t: "Reduz tempo de fechamento", d: "Revisão prioriza o que move o resultado." },
              { t: "Direciona a próxima ação", d: "Não é dashboard. É decisão." },
            ].map(p => (
              <div key={p.t} className="rounded-lg bg-primary-foreground/10 border border-primary-foreground/15 p-5 backdrop-blur-sm">
                <p className="font-semibold">{p.t}</p>
                <p className="mt-1.5 text-sm opacity-85">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="container py-20 md:py-24">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="rounded-lg border border-border p-6 bg-card">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold">Confiança explícita nos dados</h3>
            <p className="mt-2 text-sm text-muted-foreground">Cada visão mostra se os dados são suficientes, parciais, com ressalvas ou confiáveis.</p>
          </div>
          <div className="rounded-lg border border-border p-6 bg-card">
            <Lock className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold">Privacidade e isolamento</h3>
            <p className="mt-2 text-sm text-muted-foreground">Cada empresa em ambiente próprio. Acesso por papel. Auditoria das ações sensíveis.</p>
          </div>
          <div className="rounded-lg border border-border p-6 bg-card">
            <Eye className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold">Sem caixa-preta</h3>
            <p className="mt-2 text-sm text-muted-foreground">Toda interpretação do Contta AI mostra de onde veio o número e o nível de confiança.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container pb-24">
        <div className="rounded-2xl border border-border bg-card p-10 md:p-14 text-center">
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-balance">Pare de adivinhar. Leia o seu negócio.</h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Crie sua conta e tenha sua primeira leitura financeira em poucos minutos.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gap-2"><Link to="/cadastro">Criar conta <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link to="/contta-ai">Conhecer o Contta AI</Link></Button>
          </div>
        </div>
      </section>
    </>
  );
}
