import { Link } from "react-router-dom";
import { Check, Sparkles, Plus, ArrowRight, Building2, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

export default function Precos() {
  return (
    <div className="container py-20">
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" /> Preço claro, sem surpresa no fim do mês
        </span>
        <h1 className="mt-4 text-4xl md:text-5xl font-semibold tracking-tight">Um preço justo para cada momento da empresa.</h1>
        <p className="mt-3 text-muted-foreground">Comece pelo Essencial. Suba quando o ritual financeiro se firmar.</p>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {tiers.map((t, i) => (
          <div
            key={t.name}
            className={`relative rounded-xl border p-6 bg-card transition-all duration-300 hover-lift animate-fade-in-up flex flex-col ${
              t.featured ? "border-primary shadow-elegant" : "border-border hover:border-primary/30"
            }`}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {t.featured && (
              <Badge className="absolute -top-2.5 left-6 bg-primary text-primary-foreground">Mais escolhido</Badge>
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
        ))}
      </div>

      {/* Custom plan callout — impossible to miss */}
      <div className="mt-10 rounded-2xl border-2 border-primary/30 bg-gradient-to-br from-primary-soft/40 via-card to-card p-6 md:p-8 animate-fade-in-up shadow-card">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <Badge variant="outline" className="mb-3 border-primary/40 text-primary bg-card">
              <Users className="h-3 w-3 mr-1" /> Mais de uma empresa
            </Badge>
            <h2 className="text-2xl font-semibold">Tem mais de uma empresa? Monte o seu plano.</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
              Comece pelo Profissional e inclua quantas empresas precisar. Cada empresa adicional fica por{" "}
              <span className="text-foreground font-semibold">R$ 100/mês</span>. Sem cobrança escondida e sem letra miúda.
            </p>
            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <span className="inline-flex items-center gap-1.5 rounded-md bg-background/80 border border-border px-3 py-1.5">
                <Check className="h-3.5 w-3.5 text-success" /> R$ 249/mês base
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-primary text-primary-foreground px-3 py-1.5 font-medium">
                <Plus className="h-3.5 w-3.5" /> R$ 100 por empresa adicional
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-background/80 border border-border px-3 py-1.5">
                <Check className="h-3.5 w-3.5 text-success" /> Cancele quando quiser
              </span>
            </div>
          </div>
          <Button asChild size="lg" className="w-full md:w-auto shrink-0">
            <Link to="/cadastro">Montar meu plano <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>

      {/* Quick FAQ */}
      <div className="mt-12 grid md:grid-cols-3 gap-4">
        {[
          { q: "Posso trocar de plano depois?", a: "Sim. Você sobe ou desce de plano a qualquer momento, sem multa." },
          { q: "Como funciona o teste?", a: "Você começa pelo plano Essencial e só paga quando decidir continuar." },
          { q: "E se eu tiver várias empresas?", a: "Use o plano Personalizável: R$ 249/mês de base + R$ 100 por empresa adicional." },
        ].map((f, i) => (
          <div
            key={f.q}
            className="rounded-lg border border-border bg-card p-5 hover-lift transition-colors hover:border-primary/30 animate-fade-in-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <p className="font-medium text-foreground">{f.q}</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
