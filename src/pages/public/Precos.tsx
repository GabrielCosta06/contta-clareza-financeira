import { Link } from "react-router-dom";
import { useState } from "react";
import {
  Check,
  Sparkles,
  Plus,
  Minus,
  ArrowRight,
  Building2,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/Reveal";
import { usePageMeta } from "@/hooks/usePageMeta";

const tiers = [
  {
    name: "Essencial",
    price: "R$ 89",
    period: "/mês",
    desc: "Para quem está começando a organizar a vida financeira da empresa.",
    icon: Building2,
    features: [
      "1 empresa",
      "Importação manual e por planilha",
      "Margem e caixa em versão básica",
      "Contta AI com limite mensal de uso",
    ],
    cta: "Começar grátis",
  },
  {
    name: "Profissional",
    price: "R$ 249",
    period: "/mês",
    desc: "Para quem quer uma leitura semanal confiável e completa.",
    icon: TrendingUp,
    features: [
      "Até 3 empresas",
      "Conexão direta com bancos",
      "Margem, caixa e revisão completos",
      "Contta AI sem limite de uso",
    ],
    cta: "Assinar Profissional",
    featured: true,
  },
  {
    name: "Personalizável",
    price: "A partir de R$ 249",
    period: "/mês",
    desc: "Para grupos e operações com mais de uma empresa.",
    icon: Users,
    features: [
      "Tudo que o plano Profissional tem",
      "Adicione empresas conforme precisar",
      "Suporte dedicado e ajuda no início do uso",
      "Personalização da estrutura conforme sua operação",
    ],
    cta: "Falar com a gente",
    custom: true,
    addonHighlight: "+ R$ 100 por empresa adicional",
  },
];

const BASE_PRICE = 249;
const ADDON_PRICE = 100;

export default function Precos() {
  usePageMeta({
    title: "Preços · Contta — Planos a partir de R$ 89/mês",
    description:
      "Conheça os planos do Contta. Comece pelo Essencial, evolua para o Profissional ou monte um plano personalizável com R$ 100 por empresa adicional.",
  });

  // Plan builder
  const [extra, setExtra] = useState(2); // empresas adicionais
  const total = BASE_PRICE + extra * ADDON_PRICE;
  const totalCompanies = 1 + extra;

  return (
    <div className="container py-20">
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft/70 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" /> Preço claro, sem surpresa no fim do mês
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">
          Um preço justo para cada momento da empresa.
        </h1>
        <p className="mt-3 text-muted-foreground">
          Comece pelo Essencial. Suba quando o ritual financeiro se firmar.
        </p>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {tiers.map((t, i) => (
          <Reveal key={t.name} delay={i * 90} variant="up">
            <div
              className={`relative h-full rounded-xl border p-6 bg-card transition-all duration-300 card-glow flex flex-col ${
                t.featured ? "border-primary shadow-elegant" : "border-border"
              }`}
            >
              {t.featured && (
                <Badge className="absolute -top-2.5 left-6 bg-primary text-primary-foreground">
                  Mais escolhido
                </Badge>
              )}
              {t.custom && (
                <Badge variant="outline" className="absolute -top-2.5 left-6 bg-card border-primary/40 text-primary">
                  <Plus className="h-3 w-3 mr-1" /> Personalizável
                </Badge>
              )}
              <div className="flex items-center gap-2.5 mb-1">
                <div className="grid h-9 w-9 place-items-center rounded-md bg-primary-soft text-primary">
                  <t.icon className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-semibold">{t.name}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground min-h-[40px]">{t.desc}</p>
              <p className="mt-5">
                <span className="text-3xl font-semibold num">{t.price}</span>
                <span className="text-muted-foreground text-sm">{t.period}</span>
              </p>

              {t.addonHighlight && (
                <div className="mt-3 rounded-md border border-primary/30 bg-primary-soft/50 px-3 py-2 text-sm font-medium text-primary flex items-center gap-1.5">
                  <Plus className="h-3.5 w-3.5" /> {t.addonHighlight}
                </div>
              )}

              <ul className="mt-5 space-y-2 text-sm flex-1">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-success mt-0.5 shrink-0" />
                    <span className="text-foreground/90">{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/cadastro"
                className={`mt-6 group inline-flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                  t.featured
                    ? "bg-primary text-primary-foreground hover:opacity-90 shadow-card"
                    : "border border-border hover:border-primary/40 hover:bg-primary-soft/30"
                }`}
              >
                {t.cta}
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        ))}
      </div>

      {/* Plan Builder — interactive aid */}
      <Reveal variant="scale" className="mt-12">
        <div className="relative rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary-soft/40 via-card to-card p-6 md:p-10 shadow-card overflow-hidden">
          <div
            className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-primary/10 blur-3xl animate-ambient"
            aria-hidden
          />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <Badge variant="outline" className="mb-3 border-primary/40 text-primary bg-card">
                <Users className="h-3 w-3 mr-1" /> Mais de uma empresa
              </Badge>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Monte o seu plano em segundos.
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-xl leading-relaxed">
                Comece pelo Profissional e inclua quantas empresas precisar. Cada empresa adicional fica por{" "}
                <span className="text-foreground font-semibold">R$ 100/mês</span>. Sem cobrança escondida e sem letra
                miúda.
              </p>

              {/* Visual formula */}
              <div className="mt-5 hidden md:flex items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background/80 px-3 py-1.5">
                  <span className="text-muted-foreground">Base</span>
                  <span className="font-semibold num">R$ 249</span>
                </span>
                <Plus className="h-4 w-4 text-muted-foreground" />
                <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary-soft/40 px-3 py-1.5">
                  <span className="text-muted-foreground">Adicional</span>
                  <span className="font-semibold num">R$ 100 × empresa</span>
                </span>
                <span className="text-muted-foreground">=</span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5">
                  <span className="font-semibold num">total/mês</span>
                </span>
              </div>
            </div>

            {/* Counter card */}
            <div className="rounded-xl border border-border bg-background/60 backdrop-blur p-5 md:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                    Empresas adicionais
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">A primeira está incluída no plano base.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setExtra((v) => Math.max(0, v - 1))}
                    className="grid h-9 w-9 place-items-center rounded-md border border-border bg-card text-foreground transition-colors hover:border-primary/50 hover:bg-primary-soft/40 active:scale-95 disabled:opacity-40"
                    disabled={extra === 0}
                    aria-label="Remover empresa"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="min-w-10 text-center text-2xl font-semibold num tabular-nums">{extra}</span>
                  <button
                    type="button"
                    onClick={() => setExtra((v) => Math.min(50, v + 1))}
                    className="grid h-9 w-9 place-items-center rounded-md border border-primary/40 bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95"
                    aria-label="Adicionar empresa"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mt-5 pt-5 border-t border-border space-y-2 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>Plano Profissional (1 empresa)</span>
                  <span className="num">R$ 249</span>
                </div>
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{extra} empresa{extra === 1 ? "" : "s"} adicional{extra === 1 ? "" : "is"}</span>
                  <span className="num">+ R$ {(extra * ADDON_PRICE).toLocaleString("pt-BR")}</span>
                </div>
              </div>

              <div className="mt-4 rounded-lg bg-primary-soft/40 border border-primary/30 px-4 py-3 flex items-baseline justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-primary font-semibold">Total mensal</p>
                  <p className="text-[11px] text-muted-foreground">
                    {totalCompanies} empresa{totalCompanies === 1 ? "" : "s"} no total
                  </p>
                </div>
                <p className="text-3xl font-semibold num text-foreground transition-all duration-300">
                  R$ {total.toLocaleString("pt-BR")}
                </p>
              </div>

              <Button asChild size="lg" className="mt-4 w-full gap-2">
                <Link to="/cadastro">
                  Montar meu plano <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Quick FAQ */}
      <div className="mt-14 grid md:grid-cols-3 gap-4">
        {[
          { q: "Posso trocar de plano depois?", a: "Sim. Você sobe ou desce de plano a qualquer momento, sem multa." },
          { q: "Como funciona o teste?", a: "Você começa pelo plano Essencial e só paga quando decidir continuar." },
          { q: "E se eu tiver várias empresas?", a: "Use o plano Personalizável: R$ 249/mês de base + R$ 100 por empresa adicional." },
        ].map((f, i) => (
          <Reveal key={f.q} delay={i * 80} variant="up">
            <div className="h-full rounded-lg border border-border bg-card p-5 card-glow">
              <p className="font-medium text-foreground">{f.q}</p>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
