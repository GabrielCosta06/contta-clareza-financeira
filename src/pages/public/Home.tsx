import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, ShieldCheck, Sparkles, TrendingUp, Wallet, Receipt, Lock, Eye } from "lucide-react";

const Pillar = ({ icon: Icon, title, children }: any) => (
  <div className="group rounded-lg border border-border bg-card p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-card hover-lift">
    <div className="grid h-10 w-10 place-items-center rounded-md bg-primary-soft text-primary mb-4 transition-transform duration-300 group-hover:scale-110">
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
          <div className="animate-fade-in-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Feito para empresas brasileiras
            </span>
            <h1 className="mt-5 text-4xl md:text-5xl lg:text-[56px] font-semibold leading-[1.05] tracking-tight text-foreground text-balance">
              Veja toda semana onde sua margem está <span className="font-display italic font-normal text-primary">melhorando</span> — e onde está caindo.
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl text-balance">
              O Contta lê seus extratos, vendas e contas a pagar e mostra, em uma única tela, o que importa: sua margem, o caixa dos próximos dias, o impacto dos impostos e a próxima ação que faz diferença no resultado.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="gap-2 shadow-card hover:shadow-lg transition-shadow"><Link to="/cadastro">Começar grátis <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/produto">Ver como funciona</Link></Button>
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Primeira leitura em minutos</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Sem instalar nada</span>
              <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success" /> Cancele quando quiser</span>
            </div>
          </div>

          {/* Hero visual: dashboard mock */}
          <div className="relative animate-fade-in" style={{ animationDelay: "120ms" }}>
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
                    <p className="text-xs text-destructive mt-0.5">−5,2% vs mês anterior</p>
                  </div>
                  <div className="rounded-lg border bg-background p-4">
                    <p className="text-xs text-muted-foreground">Caixa em 30d</p>
                    <p className="mt-1 text-2xl font-semibold num">R$ 18,4 mil</p>
                    <p className="text-xs text-warning mt-0.5">Risco de aperto em ~19 dias</p>
                  </div>
                </div>
                <div className="rounded-lg border border-primary/20 bg-primary-soft/40 p-3.5">
                  <p className="text-xs font-medium text-primary uppercase tracking-wider flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> Contta AI</p>
                  <p className="mt-1.5 text-sm text-foreground">Recomendo renegociar 2 fornecedores de insumos antes do próximo fechamento. Pode recuperar cerca de 3% da margem.</p>
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
          <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-balance">Muitas empresas olham o extrato, mas ainda não conseguem saber se realmente tiveram lucro.</h2>
          <p className="mt-4 text-muted-foreground text-balance">Planilhas espalhadas, categorias inconsistentes, conciliação atrasada. A leitura financeira chega tarde — e quase nunca diz qual é a próxima decisão.</p>
        </div>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { t: "Margem invisível", d: "Você sabe quanto vendeu, mas não sabe onde está perdendo dinheiro." },
            { t: "Caixa sem antecipação", d: "Descobre o aperto quando ele já está acontecendo, não com semanas de antecedência." },
            { t: "Pouca confiança nos números", d: "Categorias incompletas, conciliação atrasada, dúvida no fechamento." },
            { t: "Controles dispersos", d: "Bancos, maquininha, planilha e ERP cada um contando uma história diferente." },
          ].map(p => (
            <div key={p.t} className="rounded-lg border border-border bg-card p-5 hover-lift transition-colors hover:border-primary/30">
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
            <Pillar icon={TrendingUp} title="Entenda sua margem com clareza">Veja onde sua margem está melhorando ou caindo por categoria, produto e tipo de receita.</Pillar>
            <Pillar icon={Wallet} title="Antecipe o caixa">Saiba quando o caixa pode apertar nas próximas semanas, com recebíveis e contas a pagar no radar.</Pillar>
            <Pillar icon={Receipt} title="Contexto tributário">Regime, obrigações e o impacto dos impostos no que você está prestes a fazer — sem virar contabilidade.</Pillar>
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
            { n: "02", t: "Foque no que muda o resultado", d: "A revisão destaca primeiro o que mais pode impactar o resultado: categorias, comprovantes e duplicidades." },
            { n: "03", t: "Ler margem e caixa", d: "Visão semanal de lucro e caixa de curto prazo, com nível de confiança explícito." },
            { n: "04", t: "Decidir a próxima ação", d: "O Contta AI explica o que mudou e sugere a próxima ação financeiramente relevante." },
          ].map((s, i) => (
            <div key={s.n} className="rounded-lg border border-border p-5 bg-card hover-lift transition-colors hover:border-primary/30 animate-fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
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
            <p className="text-xs font-semibold uppercase tracking-wider text-primary-foreground/75">Resultado prático</p>
            <h2 className="mt-2 text-3xl md:text-4xl font-semibold tracking-tight text-balance text-primary-foreground">A pergunta certa, no dia certo, com o número confiável.</h2>
            <p className="mt-4 text-primary-foreground/85 max-w-xl">A leitura semanal do Contta substitui o ritual de "abrir 4 planilhas no domingo à noite" por uma única conversa com seus números.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { t: "Antecipa apertos de caixa", d: "Em média, 15 a 30 dias antes." },
              { t: "Mostra onde a margem está caindo", d: "Por categoria, com causa provável." },
              { t: "Reduz o tempo de fechamento", d: "Você revisa primeiro o que mais impacta o resultado." },
              { t: "Direciona a próxima ação", d: "Não é dashboard. É decisão." },
            ].map(p => (
              <div key={p.t} className="rounded-lg bg-primary-foreground/10 border border-primary-foreground/20 p-5 backdrop-blur-sm hover-lift">
                <p className="font-semibold text-primary-foreground">{p.t}</p>
                <p className="mt-1.5 text-sm text-primary-foreground/80">{p.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="container py-20 md:py-24">
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="rounded-lg border border-border p-6 bg-card hover-lift transition-colors hover:border-primary/30">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold">Confiança explícita nos dados</h3>
            <p className="mt-2 text-sm text-muted-foreground">Cada visão mostra se os dados são suficientes, parciais, com ressalvas ou confiáveis.</p>
          </div>
          <div className="rounded-lg border border-border p-6 bg-card hover-lift transition-colors hover:border-primary/30">
            <Lock className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold">Privacidade e isolamento</h3>
            <p className="mt-2 text-sm text-muted-foreground">Cada empresa em ambiente próprio. Acesso por papel. Auditoria das ações sensíveis.</p>
          </div>
          <div className="rounded-lg border border-border p-6 bg-card hover-lift transition-colors hover:border-primary/30">
            <Eye className="h-6 w-6 text-primary" />
            <h3 className="mt-4 font-semibold">Sem caixa-preta</h3>
            <p className="mt-2 text-sm text-muted-foreground">Toda interpretação do Contta AI mostra de onde veio o número e o nível de confiança.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container pb-24">
        <div className="rounded-2xl border border-border bg-card p-10 md:p-14 text-center hover-lift">
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
