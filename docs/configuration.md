# Configuration

There are no runtime secrets or application environment variables. Browser settings live in React state and reset on reload.

## Precedence

Browser choices override initial React state; omitted engine settings use the engine's defaults. Settings are independent for the selected card and baseline. There is no config-file, environment-variable, or application command-line layer for calculator settings.

For build tooling, explicit command options such as MkDocs `--site-dir` override project settings. Project mappings override inherited shared mappings. Vite selects its source-defined base according to development, build, or preview mode.

## Browser options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| Selected card | Catalog ID | `bmo-world` | Card whose fee and rewards are modeled. |
| Comparison card | No-fee catalog ID | `bmo-free` | Baseline in comparison mode. |
| Calculation mode | `fee` or `compare` | `fee` | Recover fees or match baseline net rewards. |
| Threshold period | `monthly` or `annual` | `monthly` | Category threshold display units. |
| Budget | Monthly CAD amounts | Empty | Fields accept 0 through 1,000,000. |
| Tangerine categories | Category selection | Groceries, dining | Two categories, or three with savings deposits. |
| Savings deposits | Boolean | `false` | Enables the third Tangerine category. |
| Wealthsimple fee waiver | Boolean | `false` | Set `true` only when eligible throughout the modeled year. |
| Rogers qualifying service | Boolean | `false` | Set `true` to enable the customer rate below the annual cap. |
| Statement-credit redemption | Boolean | `false` | PC: 10,000 points = $7. Scene+: 3,000 points = $20. |
| Fuel price | CAD per litre | `1.6` | Illustrative assumption for per-litre rewards. Example: `2` means $2/L. Values outside $1–$10 use the default. |
| Triangle partner-store tax | Percentage | `5` | Illustrative assumption for tax-inclusive budgets. Example: `13` means 13%. Values outside 0–20 use the default. |

Tangerine offers twelve selectable categories. Split merchant fields inherit eligible parent-category selections and do not consume extra selection slots. Changing a card resets its settings. Invalid budget fields show errors instead of valid personal results. Fuel and tax settings use the defaults when invalid.

## Source options

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| Vite development base | URL path | `/` | Local development root. |
| Vite build/preview base | URL path | `/cardback/` | Asset prefix; checked in `scripts/check-build.mjs`. |
| MkDocs site URL | Absolute URL | `https://williamvdg.me/cardback/docs/` | Canonical docs address. |
| Shared configuration | File path | `.mkdocs-shared/shared/mkdocs.base.yml` | Theme, extensions, plugins, and validation. |
| Shared ref | Git commit | `a1dbb03a549c964821efbff190b4bd52408d1b79` | Pinned in the preparation script and workflows. |

MkDocs merges project settings over the inherited base. Do not declare `plugins` or `markdown_extensions` in the project: lists replace shared lists. Default output is `site/`; CI overrides it to `dist/docs/`.

If the hosted path changes, update `vite.config.ts`, the build checker, MkDocs URL, and workflow assembly together. See [CI/CD](./ci-cd.md).

## Examples

To model a Triangle partner-store purchase with 13% included tax, select a Triangle card, set **Tax on partner-store purchases (%)** to `13`, and enter `113` in the Triangle partner-store budget field. That represents $100 before tax and produces $48 of annual reward value from this field at its 4% pre-tax rate.

A TypeScript test can pass the equivalent engine configuration:

```typescript
import { cards } from './src/catalog';
import { cashback } from './src/engine';

const card = cards.find(card => card.id === 'triangle')!;
const yearlyReward = cashback(card, { triangle: 113 }, { retailTaxPercent: 13 });
// yearlyReward is 48 CAD before fees.
```

For documentation output, the normal `site/` default can be overridden with a real deployment path:

```sh
npm run docs:build -- --site-dir dist/docs
```

Use [Deployment](./deployment.md) for the required application-before-docs build order.
