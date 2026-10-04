# Kipia

**English** · [Português](#português)

A business metrics app that brings revenue, customers, subscriptions, expenses and vendors into one place, so a small business owner can quickly answer: *"How is my business doing?"*

Kipia is a portfolio project focused on **UX/UI and front-end development**. All data is simulated (mock data), but the code is structured so a real backend can be connected later.

## What it does

- **Overview:** key numbers for the month, each with a short explanation of *why* it changed, plus revenue trend, revenue by channel and recent activity.
- **Analytics:** switch between revenue, customers, subscriptions and churn, with a period filter and a comparison to the previous period.
- **Customers:** searchable, sortable and filterable table, a detail panel for each customer, and CSV export.
- **Revenue:** revenue by plan over time and an invoices list filtered by status.
- **Subscriptions:** recurring revenue, upcoming renewals and accounts that are past due.
- **Expenses:** revenue vs. expenses, spend by category and a list of transactions.
- **Vendors:** suppliers, monthly spend and contracts that end soon, with a detail panel.
- **Reports:** download reports as CSV.
- **Settings:** workspace preferences and notifications.

## Design decisions

- **Numbers come with context.** A metric is never shown alone; a short sentence explains what changed.
- **Every screen handles real-life states:** loading (skeletons), empty, error with a retry button, and "no results for these filters".
- **Responsive by design, not only by shrinking.** Tables become simple lists on mobile, and the sidebar becomes a fixed bottom navigation bar with a "More" menu.
- **Accessible basics:** semantic headings, labelled controls, keyboard-friendly rows, `aria-current` on navigation and reduced-motion support.
- **Consistent data:** every page reads from the same mock data, so a number on the Overview matches the page it summarizes.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router) and TypeScript
- [Tailwind CSS](https://tailwindcss.com/) and [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/) (through the shadcn chart component)
- [Lucide](https://lucide.dev/) icons

## Architecture

The UI never touches the data directly:

```text
Page → hooks → services → mocks
```

To connect a real backend, only the functions in `src/services/` need to change (for example, replacing the mock with a `fetch("/api/...")`). The pages and components stay the same.

```text
src/
├── app/
│   ├── layout.tsx            # root layout (font, metadata)
│   └── (app)/                # route group: pages that share the app shell
│       ├── layout.tsx
│       ├── overview/  analytics/  customers/  revenue/
│       └── subscriptions/  expenses/  vendors/  reports/  settings/
├── components/               # layout, dashboard, feature components and shadcn ui
├── hooks/                    # useAsync, useDebounce
├── lib/                      # types, formatting helpers, navigation
├── mocks/                    # fake data
└── services/                 # data access layer (swap for a real API)
```

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Roadmap

- Real backend: API, database and validation
- Authentication and protected routes
- Multiple workspaces (multi-tenancy)
- CSV import to populate the dashboard
- Interface translation (English, Portuguese, Spanish)

## Author

Made by [pedrosh101](https://github.com/pedrosh101).

---

# Português

[English](#kipia) · **Português**

Um app de métricas de negócio que reúne receita, clientes, assinaturas, despesas e fornecedores em um só lugar, para que o dono de um pequeno negócio responda rápido: *"Como está o meu negócio?"*

O Kipia é um projeto de portfólio com foco em **UX/UI e desenvolvimento front-end**. Todos os dados são simulados (mock data), mas o código foi estruturado para que um backend real possa ser conectado depois.

## O que ele faz

- **Overview:** os principais números do mês, cada um com uma explicação curta do *porquê* da variação, além da evolução da receita, receita por canal e atividade recente.
- **Analytics:** alterna entre receita, clientes, assinaturas e churn, com filtro de período e comparação com o período anterior.
- **Customers:** tabela com busca, ordenação e filtros, um painel de detalhes para cada cliente e exportação em CSV.
- **Revenue:** receita por plano ao longo do tempo e lista de faturas filtrada por status.
- **Subscriptions:** receita recorrente, próximas renovações e contas em atraso.
- **Expenses:** receita contra despesas, gastos por categoria e lista de transações.
- **Vendors:** fornecedores, gasto mensal e contratos que terminam em breve, com painel de detalhes.
- **Reports:** download de relatórios em CSV.
- **Settings:** preferências do workspace e notificações.

## Decisões de design

- **Todo número vem com contexto.** Uma métrica nunca aparece sozinha; uma frase curta explica o que mudou.
- **Todas as telas tratam situações reais:** carregamento (skeletons), vazio, erro com botão para tentar de novo e "nenhum resultado para esses filtros".
- **Responsivo de verdade, não só encolhido.** No celular as tabelas viram listas simples, e a sidebar vira uma barra de navegação fixa na base, com um menu "More".
- **Acessibilidade básica:** títulos semânticos, controles com rótulo, linhas navegáveis pelo teclado, `aria-current` na navegação e suporte a redução de movimento.
- **Dados consistentes:** todas as páginas leem os mesmos mocks, então um número na Overview bate com a página que ele resume.

## Tecnologias

- [Next.js](https://nextjs.org/) (App Router) e TypeScript
- [Tailwind CSS](https://tailwindcss.com/) e [shadcn/ui](https://ui.shadcn.com/)
- [Recharts](https://recharts.org/) (pelo componente de gráfico do shadcn)
- Ícones do [Lucide](https://lucide.dev/)

## Arquitetura

A interface nunca acessa os dados diretamente:

```text
Página → hooks → services → mocks
```

Para conectar um backend real, só as funções em `src/services/` precisam mudar (por exemplo, trocar o mock por um `fetch("/api/...")`). As páginas e os componentes continuam iguais. A estrutura de pastas está na seção em inglês acima.

## Como rodar

```bash
npm install
npm run dev
```

Depois abra [http://localhost:3000](http://localhost:3000).

## Próximos passos

- Backend real: API, banco de dados e validação
- Autenticação e rotas protegidas
- Múltiplos workspaces (multi-tenancy)
- Importação de CSV para popular o dashboard
- Tradução da interface (inglês, português e espanhol)

## Autor

Feito por [pedrosh101](https://github.com/pedrosh101).