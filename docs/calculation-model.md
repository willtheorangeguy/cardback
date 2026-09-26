# Calculation model

The pure functions in `src/engine.js` calculate rewards from bundled data. No live issuer rates or interest calculations are fetched.

## Fees and rates

`annualFee` multiplies monthly fees by twelve. Rates are fractions: `0.05` means 5%. For an uncapped single rate, annual break-even is fee divided by rate.

BMO World Elite groceries in the bundled catalog demonstrate the calculation:

```text
Annual threshold = 139 / 0.05 = 2780 CAD
Monthly threshold = 2780 / 12 = 231.666... CAD
Displayed monthly threshold = 231.67 CAD
```

## Reward valuations and merchant fields

The `cashback` function returns annual reward value in dollars, including fixed-value points when applicable. `rewardKind` identifies PC Optimum, Scene+ or Canadian Tire Money. Statement-credit settings multiply PC reward value by 0.7 and Scene+ reward value by two-thirds. Fees are not discounted by these multipliers. EQ's `prepaid` flag labels its different funding model without changing the reward calculation.

Merchant-specific budget fields inherit general category bonuses where appropriate. Loblaw and Sobeys-family groceries share existing grocery caps. Shoppers shares drugstore caps. Fuel-chain fields share gas caps. Triangle excludes Walmart from its grocery pool. RBC's no-fee non-grocery tier excludes all grocery subfields.

Per-litre groups add `perLitre / fuelPrice` to their fractional rate. PC groups retain their base card points per dollar. Triangle fuel groups start at zero, so the per-litre reward replaces rather than stacks with the ordinary rate. Triangle partner-store groups marked `preTax` divide their rate by `1 + retailTaxPercent / 100`. For $105 tax-inclusive spending at a 5% tax assumption, the eligible pre-tax amount is $100 and the 4% reward is $4.

Rogers groups are enabled only for qualifying service customers. Otherwise its domestic base rate applies. See [Card catalog](./card-catalog.md) for rewards excluded from these models.

## Spending caps

`cashback` annualizes monthly spending and monthly caps. Categories earn the highest matching group rate before its threshold, then the base rate. A group rate can be lower than the eventual base, as on RBC's ascending non-grocery tier. Shared caps allocate allowance proportionally across eligible categories. CIBC groups also constrain everyday bonus eligibility using total annual spending; eligible portal travel is exempt from those bonus caps.

This represents a steady budget, not statement purchase order.

## Threshold search

`breakEven` converts the budget to category weights and checks each linear segment between cap boundaries. It subtracts annual fees and, when provided, the baseline card's net rewards.

It returns `first` (first qualifying monthly spending, or `null`), `reversals` (later monthly thresholds where the selected card falls behind), and `empty` (no positive budget total). The interface rounds thresholds upward to the nearest cent.

## Assumptions and exclusions

- Spending repeats evenly for a complete reward year with fresh caps.
- One modeled month equals one billing cycle.
- Merchant coding determines eligibility; delivery and EV charging follow card notes.
- Balances are assumed paid in full.
- Interest, foreign exchange costs, supplementary cards, insurance, perks, redemption timing and promotional offers are excluded. Wealthsimple's explicit waiver assumes ongoing eligibility; other fee rebates are excluded.
- Tangerine's foreign-currency category is not modeled.

Actual rewards can differ with purchase timing and statement rounding. The bundled verification date is September 26, 2026, not an automatic update. Check issuer links before making a financial decision.
