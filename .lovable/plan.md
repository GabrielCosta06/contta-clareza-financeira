

## Findings (current state)

**Strong:** design tokens, ConfidenceBadge pattern, AIInsightCard, structured AI responses, clear IA, good copy in pt-BR.

**Gaps observed in code:**
1. **Mobile is broken on the app shell.** `AppLayout` sidebar is `hidden md:flex` with no hamburger / mobile drawer replacement — under 768px there's no navigation at all.
2. **`PublicLayout` has no mobile nav** — links hidden under `md:` with no hamburger.
3. **No global loading skeletons.** Pages return `null` while data loads (`Margem`, `Caixa`), causing layout flicker.
4. **No global keyboard shortcuts / command palette** — natural fit for a "managerial reading" tool (cmd+k to jump between Margem / Caixa / Revisão / AI / a transaction).
5. **Tables aren't responsive.** `Transacoes`, `Recebiveis`, `Obrigacoes` use raw `<table>` that overflows on small screens with no card fallback, no row hover-actions, no sort, no pagination, no row count badge per status filter.
6. **No "demo scenario switcher"** — the product spec calls out 7 structural states but only one is reachable. A dev-only banner to toggle no-data / partial / reliable / critical-pending would massively increase perceived polish.
7. **Dashboard hierarchy.** Three equal stat cards then equal grid — the "what to do *first*" message is diluted. The critical alert band is good but doesn't visually anchor a "next best action" CTA.
8. **AI page lacks streaming feel + answer affordances** (copy, save, "abrir referência em aba"), and starter chips don't visually distinguish margin/cash/review categories.
9. **Confidence is under-explained.** The badge is great but has no tooltip describing *why* this level was assigned.
10. **Onboarding has no "skip with demo data" path framed clearly,** no per-step validation feedback, no recap before "Pronto".
11. **Toasts are generic** — no success-icon, no "undo" for resolve in Revisão.
12. **Empty states** are minimal — no illustration, no secondary CTA, no "ver dados de exemplo" toggle.
13. **Accessibility:** focus rings exist but tab order on subnav uses anchors styled as tabs without `role="tablist"`; chart has no aria description; color-only conveys direction (success/destructive) without icons in some places.
14. **Number formatting consistency:** mixed `compact` usage across cards; no unified BRL display rule for short vs full.

---

## Proposed improvements (prioritized)

### P0 — Real product blockers

1. **Mobile app shell**
   - Add `Sheet`-based mobile drawer for `AppLayout` sidebar, triggered by a hamburger in the topbar (visible `md:hidden`).
   - Add mobile menu to `PublicLayout` (Sheet from right, with same nav + CTAs).
   - Make topbar company switcher collapse to icon-only under `sm`.

2. **Responsive tables → card list under `md`**
   - Build a `<DataTable>` wrapper that renders `<table>` on `md+` and a stacked card list under it (Transações, Recebíveis, Obrigações, DRE).

3. **Global loading + error states**
   - Replace `if (!data) return null` with `Skeleton` blocks matching final layout (StatCard skeleton, chart skeleton, table skeleton).
   - Add a top-level error boundary with a "Tentar novamente" CTA.

### P1 — Big perceived-quality wins

4. **Demo scenario switcher**
   - Persistent footer ribbon (only inside `/app`) with a `Select`: *Sem dados · Parcial · Confiável · Pendência crítica*. Wire it through a `DemoScenarioContext` consumed by mock repos. Makes every empty/partial/critical state browsable.

5. **Command palette (`⌘K`)**
   - shadcn `Command` dialog with: navegar (Margem/Caixa/Revisão/AI), abrir transação por descrição, perguntar ao Contta AI, ações (importar, nova transação, marcar revisão).

6. **Dashboard hierarchy refresh**
   - Hero "Próxima ação recomendada" card spanning full width at top (when AI has a high-impact suggestion), with a single primary CTA.
   - Demote the 3-stat grid to secondary, add a 4th tile (Receita semanal) for symmetry.
   - Critical alerts band gains "Adiar 24h" + "Resolver agora".

7. **Confidence explainer**
   - Wrap `ConfidenceBadge` in a `HoverCard`/`Tooltip` showing: "Por que este nível? · X transações sem categoria · Y itens em revisão · Última conciliação há Z dias".

### P2 — Refinements that make it feel premium

8. **Contta AI page**
   - Group starters by pillar (Margem / Caixa / Revisão / Tributário) with subtle color accents.
   - Streaming-feel skeleton bubble while `ask.isPending`.
   - Per-message actions: copiar resposta, abrir todas as referências, salvar como insight.
   - "Sobre esta resposta" collapsible disclosing premises and data freshness.

9. **Empty states**
   - Add subtle SVG illustration slot, primary + secondary CTA (`Importar` + `Ver dados de exemplo` that flips demo scenario).

10. **Onboarding polish**
    - Step 2: visual cards with logos (Itaú, BB, Stone, Cielo) instead of plain buttons.
    - Step 4 recap: short bullet list of what was set, "Editar" links per item.
    - Per-step inline validation with `react-hook-form` + zod.

11. **Toasts & micro-interactions**
    - Resolve-review toast gets "Desfazer" action (5s timeout).
    - Use sonner for action-y toasts, keep `useToast` for system messages.

12. **Subnav as proper Tabs**
    - Replace anchor-styled subnav in Margem/Caixa with shadcn `Tabs` for keyboard nav + `aria-selected`.

13. **Charts**
    - Add hover crosshair, weekday labels, ReferenceArea highlighting the "aperto" window in cash projection, and an empty-chart state with copy explaining what data is needed.

14. **Number/date formatting hygiene**
    - One `formatBRL` rule: compact under `lg` viewport on cards, full in tables and tooltips. Centralize in `lib/format.ts`.

15. **Accessibility pass**
    - Add `aria-label` to icon-only buttons (notifications, menu, theme toggle).
    - Add `<caption className="sr-only">` to all tables.
    - Add `prefers-reduced-motion` respect in `animate-fade-in`.

### P3 — Nice-to-have

16. **Dark mode toggle** in topbar (tokens already exist).
17. **"Compartilhar leitura" export** — generate a clean PDF of the weekly reading.
18. **Keyboard shortcut hints** in tooltips (`Press G then M for Margem`).
19. **Inline AI entry points** as a floating `Pergunte ao Contta AI sobre esta tela` button on Margem/Caixa/Transação detail.

---

## Suggested execution order (one PR each)

1. P0 mobile shell + responsive tables + skeletons
2. Demo scenario switcher + confidence tooltip
3. Command palette + dashboard hierarchy refresh
4. AI page polish + onboarding refinements
5. A11y + formatting hygiene + dark mode

Want me to implement **P0 + the demo scenario switcher** first as a single coherent pass?

