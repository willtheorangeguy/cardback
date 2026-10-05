# Getting started

Run Cardback locally and check a category threshold before entering your budget. To use it without a development checkout, open the [hosted calculator](https://williamvdg.me/cardback/).

## Prerequisites

Install Git, npm, and Node.js 22.12+ in the Node.js 22 line, or Node.js 24. CI tests Node.js 22 and 24. Check the installed tools:

```sh
git --version
node --version
npm --version
```

`node --version` must report the supported Node.js version you installed. Docs development additionally uses Python 3.12 in CI; it is not needed to run the calculator.

## Install

```sh
git clone https://github.com/willtheorangeguy/cardback.git
cd cardback
npm ci
```

Git creates the `cardback/` checkout. npm installs the versions in `package-lock.json` into `node_modules/`. Access to this private repository is required to clone it. See [Installation](./installation.md) for documentation setup and production preview.

## First run

1. Start the development server:

    ```sh
    npm run dev
    ```

    Vite prints a local address. Open that address; the calculator starts with BMO CashBack World Elite selected and an empty budget.

2. Keep **Cover the fee** and **Monthly** selected. Find the groceries threshold: **$231.67 per month** with the bundled catalog.
3. Select **Try an example budget** to populate spending and see annual rewards after fees.
4. Select **Beat a no-fee card** to compare against a baseline. Select a different baseline and configure it independently.

## What happened

Vite serves the React application. The bundled $139 annual fee divided by the 5% grocery rate gives $2,780 of annual spending, or $231.67 per month after rounding upward. This threshold is below the modeled grocery cap. No issuer rate request occurs; the calculation uses the September 26, 2026 catalog snapshot.

The example budget sets monthly spending across ten fields. Reloading the page clears it because inputs are held in React state.

## Next steps

Read [Using the calculator](./usage.md) for input classification and [Calculation model](./calculation-model.md) for assumptions. Read [Development](./development.md) to modify source or [Deployment](./deployment.md) to publish static output.
