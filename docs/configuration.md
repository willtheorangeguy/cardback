# Configuration

There are no runtime secrets or application environment variables. Browser settings live in React state and reset on reload.

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

The UI excludes `other` and `delivery` from selectable categories. Changing a card resets its category settings. Invalid fields show errors instead of valid personal results.

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
