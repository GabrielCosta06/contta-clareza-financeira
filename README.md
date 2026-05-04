# Contta - Clareza financeira para empresas brasileiras

Contta e uma aplicacao web de leitura financeira para pequenas e medias empresas brasileiras. A proposta do produto e transformar extratos, vendas, recebiveis, obrigacoes e pendencias de revisao em uma leitura semanal clara: o que aconteceu com a margem, como esta o caixa, quais dados ainda nao sao confiaveis e qual proxima acao tem maior impacto financeiro.

O app nao tenta ser um ERP completo, emissor de nota, sistema de estoque ou substituto da contabilidade. Ele fica entre as ferramentas que a empresa ja usa e a decisao financeira da semana.

## O que o app faz

- Mostra uma visao geral da saude financeira da empresa com margem, caixa, revisao e alertas prioritarios.
- Organiza transacoes de entrada e saida por fonte, categoria, status de revisao e contraparte.
- Destaca pendencias que podem alterar o fechamento, como transacoes sem categoria, comprovantes ausentes, possiveis duplicidades, anomalias e inconsistencias tributarias.
- Le margem bruta, margem de contribuicao, DRE simplificada, custos, orcamento e pontos de precificacao.
- Projeta caixa para os proximos 30 dias com recebiveis, obrigacoes, janela de aperto e risco de curto prazo.
- Oferece uma experiencia de Contta AI, um assistente financeiro contextual que responde sobre margem, caixa, revisao e impostos usando os dados normalizados do produto.
- Suporta multiplas empresas conforme o plano ativo, com troca de empresa, criacao de nova empresa e estimativa de custo mensal.
- Simula planos Essencial, Profissional e Personalizavel, incluindo limite de empresas e adicional por empresa no plano personalizavel.
- Permite compartilhar/imprimir um resumo semanal em uma rota dedicada.
- Exibe nivel de confianca dos dados em cada leitura: sem dados, insuficiente, parcial, com ressalvas ou confiavel.

## Estado atual da implementacao

Este repositorio e uma implementacao frontend-first. A interface, rotas, contratos de servico, estados de demonstracao e fluxos principais estao implementados, mas os dados ainda vem de mocks locais.

O que existe hoje:

- React + Vite + TypeScript.
- UI com Tailwind CSS, shadcn/ui, Radix UI, lucide-react e Recharts.
- React Router para rotas publicas e autenticadas.
- TanStack Query para cache e carregamento de dados.
- Contratos tipados para repositorios em `src/services/contracts.ts`.
- Implementacao mock em `src/services/mock`, com dados da empresa exemplo "Padaria & Cafe Estrela".
- Sessao, empresas, plano e cenario de demo persistidos em `localStorage`.
- Autenticacao fake: qualquer e-mail e senha validos entram na conta de demonstracao.
- Contta AI simulado: as respostas sao geradas pelo mock `aiRepo.ask`, nao por uma API real de LLM.

O que ainda nao existe:

- Backend de producao.
- Banco de dados real.
- Integracao bancaria real.
- Importacao real de arquivos no backend.
- Motor real de IA/LLM.
- Cobranca real.
- Permissoes/RBAC reais.
- Auditoria real.
- Geracao server-side de PDF. O resumo semanal usa rota imprimivel.

## Visoes publicas

As paginas publicas explicam o posicionamento, o produto e o modelo comercial.

- `/` - Home: apresenta a promessa central do Contta, os problemas que resolve, os quatro pilares do produto, o fluxo de uso e a proposta de valor.
- `/produto` - Produto: detalha o que o Contta e e o que ele nao e, reforcando que e uma camada de leitura financeira, nao um ERP.
- `/como-funciona` - Como funciona: mostra as seis etapas do uso: entrada de dados, revisao, leitura de margem, leitura de caixa, explicacao contextual e proxima acao.
- `/contta-ai` - Contta AI: explica a camada de interpretacao financeira e exemplos de perguntas que o assistente responde.
- `/precos` - Precos: mostra os planos Essencial, Profissional e Personalizavel, com simulador de empresas adicionais.
- `/sobre` - Sobre: descreve a visao de produto e o motivo de existencia do Contta.
- `/privacidade` - Politica de privacidade: texto base sobre dados, uso, isolamento por empresa e LGPD.
- `/termos` - Termos de uso: texto base sobre uso da plataforma e limitacoes.
- `/login` - Entrada na demo.
- `/cadastro` - Criacao de conta e redirecionamento para onboarding.

## Visoes autenticadas

As rotas em `/app` ficam protegidas por `RequireAuth`.

### Onboarding

Rota: `/app/onboarding`

Fluxo guiado para configurar a empresa, informar CNPJ/regime tributario e selecionar fontes de dados. Tambem permite iniciar com dados de exemplo. Ao criar uma nova empresa, a rota aceita `?mode=new`.

### Dashboard

Rota: `/app/dashboard`

Primeira tela operacional do produto. Consolida:

- acao recomendada da semana;
- alertas criticos;
- receita semanal;
- margem;
- caixa;
- itens de revisao;
- grafico de projecao de caixa;
- drivers da margem;
- atalhos para as principais areas;
- link para gerar o resumo semanal.

### Transacoes

Rota: `/app/transacoes`

Lista entradas e saidas com busca por descricao/contraparte, filtro por status e filtro por categoria. Mostra data, descricao, categoria, status de revisao e valor. Cada linha abre a visao de detalhe.

Rota de detalhe: `/app/transacoes/:id`

Mostra dados de uma transacao especifica: data, valor, categoria, origem, status, comprovantes, observacoes e entrada contextual para perguntar ao Contta AI sobre aquela transacao.

### Revisao

Rota: `/app/revisao`

Centro de confianca dos numeros. Lista pendencias por severidade, explica impacto no fechamento e permite marcar itens como resolvidos com desfazer temporario. A tela influencia o nivel de confianca exibido nas leituras.

### Margem

Rota base: `/app/margem`

Mostra receita, margem bruta, margem de contribuicao, grafico de receita vs. custo das ultimas oito semanas, drivers de variacao e leitura do Contta AI.

Subvisoes:

- `/app/margem/dre` - Resultado/DRE simplificada.
- `/app/margem/custos` - Categorias de custo que mais subiram.
- `/app/margem/orcamento` - Planejado vs. realizado.
- `/app/margem/precificacao` - Produtos ou servicos onde o preco pode estar pressionando margem.

### Caixa

Rota base: `/app/caixa`

Mostra saldo atual, saldo projetado em 30 dias, risco de curto prazo, grafico de projecao, janela de aperto e recomendacoes.

Subvisoes:

- `/app/caixa/projecao` - Projecao detalhada de caixa.
- `/app/caixa/recebiveis` - Recebiveis esperados, origem, vencimento, status e valor.
- `/app/caixa/obrigacoes` - Obrigacoes proximas, categoria, severidade, vencimento e valor.

### Contta AI

Rota: `/app/ai`

Interface de conversa com historico lateral, sugestoes de perguntas, composer com envio por Enter, respostas em blocos, referencias internas e acao de copiar resposta. Tambem aceita `?prompt=` para abrir uma pergunta contextual disparada de outras telas.

### Configuracoes

Rota: `/app/configuracoes`

Mostra dados da empresa atual, contas conectadas simuladas, acesso a empresas, categorias, preferencias de alertas, privacidade e suporte.

Rota: `/app/configuracoes/empresas`

Gerencia empresas da conta, plano atual, limite de empresas, troca de empresa ativa, criacao de nova empresa e upgrade simulado de plano.

### Compartilhamento

Rota: `/app/compartilhar?print=1`

Gera uma pagina de resumo semanal preparada para impressao ou PDF pelo navegador, com contexto da empresa, margem, caixa, revisao prioritaria, alertas e notas para compartilhamento.

## Cenarios de demonstracao

A barra inferior do app permite alternar o estado dos dados:

- `Confiavel` - dados completos e conciliados.
- `Parcial` - algumas pendencias e categorias faltando.
- `Sem dados` - simula conta nova sem base financeira.
- `Pendencia critica` - simula caixa apertado e revisoes criticas.

Os cenarios alteram as respostas dos repositorios mock, invalidam o cache do TanStack Query e ajudam a validar estados vazios, parciais, confiaveis e criticos sem backend.

## Modelo de dados

Os tipos de dominio ficam em `src/domain/types.ts` e cobrem:

- usuarios, empresas e membros;
- contas financeiras e jobs de importacao;
- transacoes, categorias e status de revisao;
- itens de revisao;
- periodos, margem, DRE, custos, orcamento e precificacao;
- caixa, projecao, recebiveis e obrigacoes;
- alertas financeiros;
- mensagens, conversas, blocos e referencias do Contta AI;
- planos e assinaturas;
- contexto tributario brasileiro.

Os contratos de acesso a dados ficam em `src/services/contracts.ts`. A ideia e trocar a implementacao mock por clientes reais de API sem mudar os componentes.

## Arquitetura

```text
src/
  App.tsx                 Rotas e providers globais
  components/             Componentes reutilizaveis e shadcn/ui
  domain/types.ts         Tipos de dominio e schemas de confianca
  hooks/                  Autenticacao, empresas, cenario demo e metadados
  layouts/                Layout publico e layout autenticado
  lib/                    Formatacao e utilitarios
  pages/public/           Site publico
  pages/app/              Produto autenticado
  services/contracts.ts   Interfaces dos repositorios
  services/mock/          Dados e repositorios mock
  test/                   Setup e testes Vitest
```

## Tecnologias

- React 18
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- shadcn/ui + Radix UI
- lucide-react
- Recharts
- React Hook Form + Zod
- Vitest

## Como rodar localmente

Requisitos recomendados:

- Node.js 18 ou superior
- npm ou Bun

Instalacao com npm:

```bash
npm install
npm run dev
```

Build de producao:

```bash
npm run build
```

Preview do build:

```bash
npm run preview
```

Testes:

```bash
npm run test
```

Lint:

```bash
npm run lint
```

Tambem ha lockfiles do Bun no repositorio. Se preferir Bun:

```bash
bun install
bun run dev
```

## Scripts disponiveis

- `dev` - inicia o servidor Vite.
- `build` - gera build de producao.
- `build:dev` - gera build em modo development.
- `preview` - serve o build localmente.
- `lint` - executa ESLint.
- `test` - executa Vitest uma vez.
- `test:watch` - executa Vitest em modo watch.

## Dados de acesso da demo

A tela de login vem preenchida com:

- e-mail: `nati@estrelacafe.com.br`
- senha: `contta2024`

Como a autenticacao e mockada, qualquer e-mail e senha preenchidos iniciam uma sessao local de demonstracao.

## Persistencia local

A aplicacao usa `localStorage` para:

- sessao atual (`contta.session`);
- estado de onboarding (`contta.onboarded`);
- lista de empresas (`contta.companies`);
- empresa ativa (`contta.activeCompanyId`);
- plano simulado (`contta.subscription.plan`);
- cenario de demonstracao (`contta.demo.scenario`).

Para reiniciar a demo, limpe os dados do site no navegador.

## Direcao de produto

O Contta e guiado por quatro ideias:

1. Margem precisa ser legivel. O dono ou gestor deve entender onde o resultado esta sendo ganho ou perdido sem depender de uma planilha auxiliar.
2. Caixa precisa ser antecipado. A empresa deve enxergar a janela de aperto antes de ela virar urgencia.
3. Confianca nos dados precisa ser explicita. Nao basta mostrar um numero; o app deve dizer se ele esta completo, parcial ou com ressalvas.
4. IA precisa ser contextual. O Contta AI deve responder sobre os numeros da empresa, apontar origem e premissas, e sugerir a proxima acao financeira relevante.

## Proximos passos naturais

- Substituir `src/services/mock` por clientes reais de API.
- Criar backend com autenticacao, empresas, permissoes e auditoria.
- Persistir transacoes, categorias, revisoes, empresas e conversas em banco de dados.
- Implementar importacao real de CSV/OFX e integracoes bancarias.
- Conectar o Contta AI a um modelo real com contexto financeiro recuperado do backend.
- Implementar cobranca real para planos e empresas adicionais.
- Ampliar testes alem do teste exemplo atual.
