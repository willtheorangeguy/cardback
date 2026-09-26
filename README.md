# Cardback

A Canadian cashback calculator built with React, TypeScript, Vite and Tailwind CSS. All budget calculations happen locally in the browser; inputs are not persisted.

## Development

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
npm test
npm run build
```

The development server prints its local URL. `npm run preview` serves a completed production build. Deploy the `dist` directory to a static host; no backend or secrets are required.

## Calculation model

`src/catalog.ts` contains eight issuer-sourced cards, verification dates, rates and spending limits. `src/engine.js` is a pure calculation module with TypeScript-checked JSDoc. Monthly spending repeats over twelve modeled billing cycles. Shared annual caps are allocated proportionally; CIBC's total-purchase caps constrain the same bonus allowance. Break-even walks exact piecewise-linear segments and reports later reversals when comparing against a free card.

Card data reflects issuer pages checked September 26, 2026. BMO World Elite's current product page and offer terms show $139, despite older issuer documents showing $120. CIBC Infinite's benefits guide specifies $50,000 total annual spending or $20,000 combined accelerated spending; the no-fee version specifies $30,000 or $20,000. Sources are available in the interface. Review issuer product pages and reward agreements together when updating data, then update the verification date and calculation fixtures.

Foreign-currency category selection, promotional offers, fee rebates and supplementary cards are excluded. Delivery requires the classification stated in each card's notes. Merchant coding and purchase order may cause actual rewards to differ from the estimate.

## Manual acceptance checks

- Switch cards and monthly/annual thresholds; ensure caps and sources change with the card.
- Select Tangerine in either selector; check the two-category limit and savings-account third category.
- Start with an empty budget, load the example, reset, and enter negative or oversized values.
- Compare against each no-fee card; verify the comparison selector and its configuration update results.
- At 139 / 0.05 / 12 dollars of monthly BMO World Elite groceries, annual rewards cover the fee.
- Test narrow and wide viewports, keyboard navigation, visible focus, input labels, and result announcements.

Card images are bundled locally in `public/cards` using artwork from the issuers' product pages. `scripts/card-image-sources.json` records the original asset URLs. Refresh downloads with `node scripts/card-images.mjs --download`; this verifies image signatures before saving. Images retain their aspect ratios, have descriptive alternative text, and show a text fallback if unavailable. Artwork and trademarks belong to their respective issuers.

Google Fonts is optional; system fonts provide a fallback. No analytics or financial-data network requests are made.
