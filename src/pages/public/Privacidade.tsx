export default function Privacidade() {
  return (
    <div className="container py-16 max-w-3xl prose prose-slate">
      <h1 className="text-3xl font-semibold tracking-tight">Política de Privacidade</h1>
      <p className="mt-4 text-muted-foreground">Última atualização: {new Date().toLocaleDateString("pt-BR")}.</p>
      <section className="mt-8 space-y-6 text-foreground">
        <div><h2 className="text-lg font-semibold">1. Dados que coletamos</h2><p className="mt-2 text-muted-foreground">Coletamos dados financeiros que você importa ou conecta, dados de identificação da empresa e do usuário, e telemetria mínima de uso para melhorar o produto.</p></div>
        <div><h2 className="text-lg font-semibold">2. Como utilizamos</h2><p className="mt-2 text-muted-foreground">Os dados são usados exclusivamente para gerar a leitura financeira da sua empresa dentro do Contta. Não vendemos dados a terceiros.</p></div>
        <div><h2 className="text-lg font-semibold">3. Isolamento por empresa</h2><p className="mt-2 text-muted-foreground">Cada empresa opera em ambiente lógico próprio. Acessos são governados por papéis (RBAC) e auditoria.</p></div>
        <div><h2 className="text-lg font-semibold">4. Direitos do titular (LGPD)</h2><p className="mt-2 text-muted-foreground">Você pode solicitar acesso, correção, portabilidade ou exclusão dos seus dados a qualquer momento.</p></div>
        <div><h2 className="text-lg font-semibold">5. Contato</h2><p className="mt-2 text-muted-foreground">privacidade@contta.com.br</p></div>
      </section>
    </div>
  );
}
