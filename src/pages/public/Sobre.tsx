export default function Sobre() {
  return (
    <div className="container py-20 max-w-3xl animate-fade-in-up">
      <h1 className="text-4xl font-semibold tracking-tight">Sobre o Contta</h1>
      <p className="mt-5 text-lg text-muted-foreground">
        O Contta nasceu de uma observação simples: muitas empresas brasileiras operam com pouca clareza financeira — não por falta de dados, mas por falta de leitura.
      </p>
      <p className="mt-4 text-muted-foreground">
        Construímos uma plataforma com foco em quatro coisas: entender sua margem, antecipar o caixa, mostrar o impacto dos impostos e explicar o que mudou no seu resultado. O Contta cabe entre o sistema operacional da empresa e a decisão da semana.
      </p>
      <h2 className="mt-12 text-2xl font-semibold">Como pensamos o produto</h2>
      <ul className="mt-4 space-y-3 text-foreground">
        <li>• Clareza antes de quantidade de gráfico.</li>
        <li>• Mostrar a próxima ação, não só o número.</li>
        <li>• Deixar explícito o quanto o número é confiável.</li>
        <li>• AI que entende o seu negócio — não respostas genéricas.</li>
      </ul>
    </div>
  );
}
