import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    n: "01",
    t: "Entrada de dados",
    d: "Importe CSV, conecte bancos e maquininha, ou registre manualmente. O Contta normaliza e organiza.",
    bullets: ["Importação de extrato OFX/CSV", "Conexão bancária", "Lançamentos manuais", "Categorias sugeridas"],
  },
  {
    n: "02",
    t: "Foque no que pode mudar seu resultado",
    d: "A revisão destaca primeiro o que mais pode impactar o resultado: categorias erradas, valores fora do padrão e possíveis duplicidades.",
    bullets: ["Itens críticos primeiro", "Impacto explicado", "Conciliação assistida", "Indicador de confiança por visão"],
  },
  {
    n: "03",
    t: "Leitura de margem",
    d: "DRE enxuto, principais custos e comparativos por período. Você vê onde o resultado está sendo formado.",
    bullets: ["Margem bruta e de contribuição", "Variações com causa provável", "Custos sob pressão", "Pricing direcionado"],
  },
  {
    n: "04",
    t: "Leitura de caixa",
    d: "Saldo atual, projeção de 30 dias, risco de aperto, recebíveis e contas a pagar.",
    bullets: ["Projeção visual de 30 dias", "Saldo mínimo projetado", "Recebíveis em atraso", "Obrigações por urgência"],
  },
  {
    n: "05",
    t: "Explicação contextual",
    d: "O Contta AI traduz os números em frases diretas: o que mudou, possíveis causas e nível de confiança.",
    bullets: ["Sem caixa-preta", "Confiança explícita", "Referências de origem", "Recomendação acionável"],
  },
  {
    n: "06",
    t: "Próxima ação com AI",
    d: "Para cada leitura, uma ou duas próximas ações financeiramente relevantes — não uma lista de 50 KPIs.",
    bullets: ["Renegociar fornecedor X", "Reajustar produto Y", "Cobrar cliente Z", "Antecipar recebível W"],
  },
];

export default function ComoFunciona() {
  return (
    <>
      <section className="bg-gradient-soft">
        <div className="container py-20 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight max-w-3xl text-balance">Da entrada de dados até a próxima decisão financeira.</h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl">Seis etapas. Uma leitura semanal. Sem virar uma operação paralela.</p>
        </div>
      </section>

      <section className="container py-16">
        <div className="grid md:grid-cols-2 gap-6">
          {steps.map((s, i) => (
            <div
              key={s.n}
              className="rounded-lg border border-border bg-card p-6 hover-lift transition-colors hover:border-primary/30 animate-fade-in-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl text-primary">{s.n}</span>
                <h3 className="text-xl font-semibold">{s.t}</h3>
              </div>
              <p className="mt-3 text-muted-foreground">{s.d}</p>
              <ul className="mt-4 grid grid-cols-2 gap-1.5 text-sm text-foreground">
                {s.bullets.map(b => (
                  <li key={b} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-primary" /> {b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-24">
        <div className="rounded-2xl border border-border bg-card p-10 text-center hover-lift">
          <h2 className="text-3xl font-semibold">Comece pelo seu primeiro fechamento semanal.</h2>
          <Button asChild size="lg" className="mt-6 gap-2"><Link to="/cadastro">Criar conta <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </section>
    </>
  );
}
