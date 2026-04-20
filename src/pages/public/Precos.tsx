import { Link } from "react-router-dom";
import { Check, Sparkles, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Essencial",
    price: "R$ 89",
    period: "/mês",
    desc: "Para empresas começando a organizar a vida financeira.",
    features: [
      "1 empresa",
      "Importação manual e CSV",
      "Margem e caixa básicos",
      "Contta AI com limites básicos",
    ],
  },
  {
    name: "Profissional",
    price: "R$ 249",
    period: "/mês",
    desc: "Para quem precisa de uma leitura semanal confiável.",
    features: [
      "Até 3 empresas",
      "Conexão bancária",
      "Margem, caixa e revisão completos",
      "Contta AI sem limites",
    ],
    featured: true,
  },
  {
    name: "Personalizável",
    price: "R$ 249",
    period: "/mês + R$ 100 por empresa adicional",
    desc: "Para grupos e operações com mais de uma empresa.",
    features: [
      "A partir do plano Profissional",
      "Empresas adicionais sob demanda",
      "Acréscimo de R$ 100 por empresa adicional",
      "Suporte dedicado e onboarding assistido",
    ],
    custom: true,
  },
];

export default function Precos() {
  return (
    <div className="container py-20">
      <div className="text-center max-w-2xl mx-auto animate-fade-in-up">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary-soft px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" /> Preço claro, sem pegadinha
        </span>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight">Um preço justo para cada momento da empresa.</h1>
        <p className="mt-3 text-muted-foreground">Comece pelo Essencial. Cresça quando o ritual financeiro se firmar.</p>
      </div>

      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {tiers.map((t, i) => (
          <div
            key={t.name}
            className={`relative rounded-xl border p-6 bg-card transition-all duration-300 hover-lift animate-fade-in-up ${
              t.featured ? "border-primary shadow-elegant" : "border-border hover:border-primary/30"
            }`}
            style={{ animationDelay: `${i * 90}ms` }}
          >
            {t.featured && (
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Mais escolhido</p>
            )}
            {t.custom && (
              <p className="text-xs font-semibold text-warning uppercase tracking-wider mb-2 inline-flex items-center gap-1">
                <Plus className="h-3 w-3" /> Personalizável
              </p>
            )}
            <h3 className="text-xl font-semibold">{t.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <p className="mt-5">
              <span className="text-3xl font-semibold num">{t.price}</span>
              <span className="text-muted-foreground text-sm"> {t.period}</span>
            </p>
            <ul className="mt-5 space-y-2 text-sm">
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
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "border border-border hover:border-primary/40 hover:bg-primary-soft/30"
              }`}
            >
              {t.custom ? "Falar com a gente" : "Começar"}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        ))}
      </div>

      {/* Custom plan callout */}
      <div className="mt-10 rounded-2xl border border-border bg-card p-6 md:p-8 animate-fade-in-up">
        <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <h2 className="text-xl font-semibold">Mais de uma empresa? Monte o seu plano.</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
              Comece pelo Profissional e adicione quantas empresas precisar. Cada empresa adicional custa <span className="text-foreground font-medium">R$ 100/mês</span>. Sem surpresas, sem cobrança escondida.
            </p>
          </div>
          <Button asChild className="w-full md:w-auto">
            <Link to="/cadastro">Montar meu plano <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
