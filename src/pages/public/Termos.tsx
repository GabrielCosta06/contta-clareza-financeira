export default function Termos() {
  return (
    <div className="container py-16 max-w-3xl">
      <h1 className="text-3xl font-semibold tracking-tight">Termos de Uso</h1>
      <p className="mt-4 text-muted-foreground">Última atualização: {new Date().toLocaleDateString("pt-BR")}.</p>
      <section className="mt-8 space-y-6 text-foreground">
        <div><h2 className="text-lg font-semibold">1. Objeto</h2><p className="mt-2 text-muted-foreground">O Contta é uma plataforma web de leitura financeira para empresas brasileiras. Não substitui sua contabilidade nem aconselhamento fiscal especializado.</p></div>
        <div><h2 className="text-lg font-semibold">2. Conta e acesso</h2><p className="mt-2 text-muted-foreground">Você é responsável pela guarda das credenciais e pela veracidade dos dados informados.</p></div>
        <div><h2 className="text-lg font-semibold">3. Uso aceitável</h2><p className="mt-2 text-muted-foreground">É vedado o uso para fins ilícitos ou violadores de direitos de terceiros.</p></div>
        <div><h2 className="text-lg font-semibold">4. Limitação de responsabilidade</h2><p className="mt-2 text-muted-foreground">As leituras e sugestões do Contta são apoio à decisão e não dispensam conferência humana ou pareceres profissionais.</p></div>
        <div><h2 className="text-lg font-semibold">5. Foro</h2><p className="mt-2 text-muted-foreground">Foro da Comarca de São Paulo/SP.</p></div>
      </section>
    </div>
  );
}
