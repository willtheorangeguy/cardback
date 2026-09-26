# Getting started

Run Cardback locally and check a category threshold before entering your budget.

## Prerequisites

Install Git, npm, and Node.js 22.12+ in the Node.js 22 line, or Node.js 24. CI tests Node.js 22 and 24.

```sh
node --version
npm --version
```

## Run the application

```sh
git clone https://github.com/willtheorangeguy/cardback.git
cd cardback
npm ci
npm run dev
```

Open the local address printed by Vite. The page starts with BMO CashBack World Elite selected and an empty budget.

## Check a result

1. Keep **Cover the fee** and **Monthly** selected.
2. Find the groceries threshold: **$231.67 per month** with the bundled catalog.
3. Select **Try an example budget** to populate spending and see annual cashback after fees.
4. Select **Beat a no-fee card** to compare against a baseline.

The groceries example uses the catalog's $139 fee and 5% rate below its monthly cap, not a live issuer quote.

## Next steps

Read [Using the calculator](./usage.md) for inputs, [Calculation model](./calculation-model.md) for assumptions, or [Installation](./installation.md) to preview production output.
