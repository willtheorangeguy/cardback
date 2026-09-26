# Cardback

A Canadian cashback calculator built with React, TypeScript, Vite and Tailwind CSS. All budget calculations happen locally in the browser; inputs are not persisted.

Documentation: [project guide](docs/index.md) · [MkDocs site](https://williamvdg.me/cardback/docs/).

## Development

Requires Node.js 20.19+ or 22.12+ and npm.

```sh
npm install
npm run dev
npm test
npm run build
```

The development server prints its local URL. `npm run preview` serves a completed production build. Deploy the `dist` directory to a static host; no backend or secrets are required.

## GitHub Actions and Pages

- **CI** (`.github/workflows/ci.yml`) runs on branch pushes, pull requests targeting `main`, and manual dispatch. It runs the reusable tests workflow and TypeScript/production build checks. On `main`, Pages calls this same CI workflow before deployment.
- **Tests** (`.github/workflows/tests.yml`) runs Vitest on Node.js 22 and 24. Each job uploads a JUnit report, including on test failures. It can also be run manually from Actions.
- **Deploy to GitHub Pages** (`.github/workflows/pages.yml`) runs on pushes to `main` or manual dispatch on `main`. After all CI jobs pass, it deploys the exact validated build artifact to the `github-pages` environment. Failed tests or builds block deployment.

Pages is already configured to use GitHub Actions. Push these files to `main` to start the first deployment. No personal access token or repository secret is needed; the deployment job uses GitHub's built-in token with Pages and OIDC permissions. Action versions are pinned to verified commit SHAs.

The production site lives at `https://williamvdg.me/cardback/`. Vite uses `/cardback/` as the production base, including for local card images. Development stays at `/`; production preview serves `/cardback/`. Run `npm run build` and `npm run check:build` to verify the Pages asset paths and all catalog card images locally. If the production path changes, update the base in `vite.config.ts` and `scripts/check-build.mjs` together.

Reports and production artifacts are retained for seven days. The Pages workflow serializes deployments. Repository branch protections, if desired, can require the build and Node test checks before merging.

## Calculation model

`src/catalog.ts` contains eighteen issuer-sourced card entries, verification dates, rates and spending limits. The [Big Five scan](docs/card-catalog.md) records coverage and exclusions. `src/engine.js` is a pure calculation module with TypeScript-checked JSDoc. Monthly spending repeats over twelve modeled billing cycles. Shared annual caps are allocated proportionally; CIBC's total-purchase caps constrain the same bonus allowance, while eligible portal rewards remain uncapped. Break-even walks exact piecewise-linear segments, including ascending reward tiers, and reports later reversals when comparing against a free card.

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
