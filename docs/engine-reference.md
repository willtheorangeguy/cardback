# Engine reference

`src/engine.js` is the internal pure calculation module used by React and Vitest. It is not a versioned package or supported public API. Import it when working inside this repository; there are no HTTP endpoints or financial-data API calls.

## Input types

Types live in `src/types.ts`. A `Budget` maps category IDs to monthly CAD amounts; missing fields have no spending. `Card` supplies fee, fee period, base rate, and reward groups. `Configuration` optionally changes category selections, fee waiver, redemption value, customer eligibility, fuel price, or partner-store tax.

Rates are fractions, so `0.05` means 5%. Group caps are CAD amounts with an optional monthly or annual period. `totalSpendCap` restricts the bonus using total purchases across the budget. See [Configuration](./configuration.md) for valid settings and [Calculation model](./calculation-model.md) for allocation rules.

## Exports

| Function | Result | Responsibility |
| --- | --- | --- |
| `annualFee(card, config = {})` | Number, CAD/year | Annualizes monthly fees; returns zero when `feeWaived` is true. |
| `total(budget)` | Number, CAD/month | Sums finite positive spending. |
| `rewardGroups(card, config = {})` | Reward-group array | Applies selections, merchant-field expansion, customer rates, fuel price, and pre-tax adjustment. |
| `initialRate(card, category, config = {})` | Fraction | Uses the highest matching starting rate, or the base rate, then applies redemption valuation. |
| `cashback(card, monthly, config = {})` | Number, CAD/year | Calculates annual reward value before fees, including caps and redemption valuation. |
| `proportions(budget)` | Category-weight object | Divides category spending by the positive total. |
| `breakEven(card, budget, config = {}, baseline, baselineConfig = {})` | Threshold object | Searches fee recovery or net advantage over a baseline. |

## Worked call

This standalone Node.js example uses the uncapped 2% monthly-fee model covered by the Wealthsimple fixtures. The catalog is TypeScript; the synthetic input below exercises the JavaScript engine directly without a TypeScript loader.

```sh
node --input-type=module <<'JS'
import {
  annualFee, total, rewardGroups, initialRate,
  cashback, proportions, breakEven,
} from './src/engine.js';

const card = {
  id: 'wealthsimple', issuer: 'Wealthsimple', name: 'Visa Infinite +',
  fee: 20, feePeriod: 'monthly', base: 0.02, groups: [],
  color: '#34332f', sources: [], verified: '2026-09-26', note: '',
};
const budget = { other: 1000 };
console.log(JSON.stringify({
  fee: annualFee(card),
  spending: total(budget),
  groups: rewardGroups(card),
  rate: initialRate(card, 'other'),
  reward: cashback(card, budget),
  mix: proportions(budget),
  threshold: breakEven(card, budget),
}));
JS
```

Expected output:

```json
{"fee":240,"spending":1000,"groups":[],"rate":0.02,"reward":240,"mix":{"other":1},"threshold":{"first":999.9999999999621,"reversals":[],"empty":false}}
```

The same calls can be made in TypeScript tests with the real card from `cards` in `src/catalog.ts`, as in `src/engine.test.ts`. The shell example uses a Bash heredoc; on Windows, run it in Git Bash or WSL.

## Threshold result

| Field | Type | Meaning |
| --- | --- | --- |
| `first` | Number or `null` | Monthly spending at the first qualifying crossing; zero means already covered, `null` means no crossing. |
| `reversals` | Number array | Later monthly spending thresholds where advantage becomes negative. |
| `empty` | Boolean | True when the budget has no positive total and therefore no spending proportions. |

The engine returns unrounded floating-point numbers; the worked call's first crossing is approximately $1,000 per month. `src/App.tsx` rounds displayed thresholds upward to the next cent. An empty budget returns `{ first: null, reversals: [], empty: true }`.

## Caller boundaries

The browser enforces finite amounts from $0 to $1,000,000. Internal callers should supply finite, nonnegative category values: the helpers' handling of invalid values does not constitute complete input validation for every export. Catalog fixtures supply known card shapes rather than arbitrary user JSON.

Read [Testing](./testing.md) for covered boundary cases and [Architecture](./architecture.md) for the caller relationships.
