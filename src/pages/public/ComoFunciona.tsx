import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  ArrowRight,
  Database,
  Search,
  TrendingUp,
  Wallet,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    n: "01",
    icon: Database,
    t: "Entrada de dados",
    d: "Importe CSV, conecte bancos e maquininha, ou registre manualmente. O Contta normaliza e organiza.",
    bullets: ["Extrato OFX/CSV", "Conexão bancária", "Lançamentos manuais", "Categorias sugeridas"],
  },
  {
    n: "02",
    icon: Search,
    t: "Foque no que pode mudar seu resultado",
    d: "A revisão destaca primeiro o que mais pode impactar o resultado: categorias erradas, valores fora do padrão e possíveis duplicidades.",
    bullets: ["Itens críticos primeiro", "Impacto explicado", "Conciliação assistida", "Confiança por visão"],
  },
  {
    n: "03",
    icon: TrendingUp,
    t: "Leitura de margem",
    d: "Resumo do resultado, principais custos e comparativos por período. Você vê de onde o lucro está vindo — e onde ele está ficando pelo caminho.",
    bullets: ["Margem bruta e contribuição", "Variações com causa", "Onde os custos subiram", "Onde reajustar preço"],
  },
  {
    n: "04",
    icon: Wallet,
    t: "Leitura de caixa",
    d: "Saldo atual, projeção de 30 dias, risco de aperto, recebíveis e contas a pagar.",
    bullets: ["Projeção de 30 dias", "Saldo mínimo projetado", "Recebíveis em atraso", "Obrigações por urgência"],
  },
  {
    n: "05",
    icon: Sparkles,
    t: "Explicação contextual",
    d: "O Contta AI traduz os números em frases diretas: o que mudou, possíveis causas e nível de confiança.",
    bullets: ["Sem caixa-preta", "Confiança explícita", "Origem do dado", "Recomendação acionável"],
  },
  {
    n: "06",
    icon: CheckCircle2,
    t: "Próxima ação com AI",
    d: "Para cada leitura, uma ou duas próximas ações financeiramente relevantes — não uma lista de 50 KPIs.",
    bullets: ["Renegociar fornecedor", "Reajustar produto", "Cobrar cliente", "Antecipar recebível"],
  },
];

export default function ComoFunciona() {
  usePageMeta({
    title: "Como funciona · Contta — Da entrada de dados até a decisão",
    description:
      "Da importação dos dados até a próxima ação financeira. Conheça as seis etapas que transformam seu extrato em uma leitura semanal confiável.",
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
            <Sparkles className="h-3 w-3" /> Seis etapas, uma leitura
          </span>
          <h1 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl text-balance">
            Da entrada de dados até a próxima decisão financeira.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">
            Seis etapas. Uma leitura semanal. Sem virar uma operação paralela.
          </p>
        </div>
      </section>

      {/* JOURNEY — vertical timeline alternating sides */}
      <section className="container py-20 md:py-24">
        <div className="relative max-w-5xl mx-auto">
          {/* Center vertical line on lg */}
          <div
            className="hidden lg:block absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-px timeline-line"
            aria-hidden
          />
          {/* Mobile/tablet left line */}
          <div
            className="lg:hidden absolute left-6 top-2 bottom-2 w-px timeline-line"
            aria-hidden
          />

          <ol className="space-y-10 lg:space-y-16">
            {steps.map((s, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li key={s.n} className="relative">
                  {/* Node */}
                  <div
                    className="absolute z-10 left-6 lg:left-1/2 lg:-translate-x-1/2 -translate-y-0 grid h-12 w-12 -ml-6 lg:ml-0 place-items-center rounded-full border border-primary/40 bg-background shadow-card"
                  >
                    <s.icon className="h-5 w-5 text-primary" />
                  </div>

                  {/* Card */}
                  <Reveal
                    variant={isLeft ? "right" : "left"}
                    className={`pl-16 lg:pl-0 lg:grid lg:grid-cols-2 lg:gap-10 ${
                      isLeft ? "" : ""
                    }`}
                  >
                    <div className={`${isLeft ? "lg:col-start-1 lg:pr-12 lg:text-right" : "lg:col-start-2 lg:pl-12"}`}>
                      <div
                        className={`group rounded-2xl border border-border bg-card p-6 card-glow ${
                          isLeft ? "lg:ml-auto" : ""
                        }`}
                      >
                        <div
                          className={`flex items-baseline gap-3 ${
                            isLeft ? "lg:justify-end" : ""
                          }`}
                        >
                          <span className="font-display text-3xl text-primary">{s.n}</span>
                          <h3 className="text-xl font-semibold tracking-tight">{s.t}</h3>
                        </div>
                        <p className="mt-3 text-muted-foreground leading-relaxed">{s.d}</p>
                        <ul
                          className={`mt-4 grid grid-cols-2 gap-1.5 text-sm text-foreground ${
                            isLeft ? "lg:justify-items-end" : ""
                          }`}
                        >
                          {s.bullets.map((b) => (
                            <li
                              key={b}
                              className={`flex items-center gap-2 ${
                                isLeft ? "lg:flex-row-reverse" : ""
                              }`}
                            >
                              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {b}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <Reveal variant="scale">
          <div className="relative rounded-2xl border border-primary/30 bg-gradient-to-br from-card via-card to-primary-soft/40 p-10 md:p-14 text-center overflow-hidden card-glow">
            <div
              className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-[60%] rounded-full bg-primary/15 blur-3xl animate-ambient"
              aria-hidden
            />
            <div className="relative">
              <h2 className="text-3xl font-semibold">Comece pelo seu primeiro fechamento semanal.</h2>
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
