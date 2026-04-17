import { Link } from "react-router-dom";

export default function Precos() {
  const tiers = [
    { name: "Essencial", price: "R$ 89", period: "/mês", desc: "Para PMEs no início da estruturação financeira.", features: ["1 empresa","Importação manual e CSV","Margem e caixa básicos","Contta AI (limites básicos)"] },
    { name: "Profissional", price: "R$ 249", period: "/mês", desc: "Para quem precisa de leitura semanal confiável.", features: ["Até 3 empresas","Conexão bancária","Margem, caixa e revisão completos","Contta AI sem limites"], featured: true },
    { name: "Empresarial", price: "Sob consulta", period: "", desc: "Para grupos e operações com múltiplas unidades.", features: ["Empresas ilimitadas","Papéis e auditoria","Suporte dedicado","Onboarding assistido"] },
  ];
  return (
    <div className="container py-20">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl font-semibold tracking-tight">Preço justo para PMEs brasileiras.</h1>
        <p className="mt-3 text-muted-foreground">Comece pelo Essencial. Cresça quando o ritual financeiro se firmar.</p>
      </div>
      <div className="mt-12 grid md:grid-cols-3 gap-5">
        {tiers.map(t => (
          <div key={t.name} className={`rounded-xl border p-6 bg-card ${t.featured ? "border-primary shadow-elegant" : "border-border"}`}>
            {t.featured && <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">Mais escolhido</p>}
            <h3 className="text-xl font-semibold">{t.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <p className="mt-5"><span className="text-3xl font-semibold num">{t.price}</span><span className="text-muted-foreground">{t.period}</span></p>
            <ul className="mt-5 space-y-2 text-sm">
              {t.features.map(f => <li key={f} className="flex items-center gap-2"><span className="h-1 w-1 rounded-full bg-primary" /> {f}</li>)}
            </ul>
            <Link to="/cadastro" className={`mt-6 block text-center rounded-md px-4 py-2.5 text-sm font-medium ${t.featured ? "bg-primary text-primary-foreground" : "border border-border"}`}>Começar</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
