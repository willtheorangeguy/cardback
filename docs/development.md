# Development

Follow [Getting started](./getting-started.md) to install dependencies. Use [Testing](./testing.md) for automated and manual checks.

## Update cards

Edit `src/catalog.ts` consistently with `src/types.ts`. Rates are fractions, caps are CAD amounts, and fee periods are `monthly` or `annual`.

Review issuer product pages and reward agreements together. Update source links, verification dates, explanatory notes, and test fixtures. Keep the displayed verification date in `src/App.tsx` consistent with catalog data.

## Maintain artwork

`scripts/card-image-sources.json` records original issuer URLs. Refresh downloads with:

```sh
node scripts/card-images.mjs --download
```

The downloader checks signatures before saving. Artwork and trademarks belong to the issuers. New cards also need filename entries in `src/card-artwork.json`; the interface, downloader, catalog tests, and production image checker share that manifest.

## Maintain docs

Follow the [shared writing standard](https://github.com/willtheorangeguy/mkdocs/blob/HEAD/docs.instructions.md). Add source-backed pages and navigation entries, then run:

```sh
npm run docs:prepare
python -m pip install -r .mkdocs-shared/shared/requirements-docs.txt
npm run docs:build
```

Do not commit staged design-system assets. Updating the shared toolchain requires changing the same ref in `scripts/docs.mjs`, `ci.yml`, and `docs-lint.yml`, updating the ignored checkout, reinstalling requirements, and verifying a strict build.
