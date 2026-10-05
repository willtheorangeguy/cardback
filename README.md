<!-- Logo -->
<h1 align="center">Cardback</h1>

<!-- Tagline -->
<h4 align="center">A Canadian cashback calculator for comparing card fees and rewards against your spending.</h4>

<!-- Badges -->
<div align="center">
  <img alt="CI State" src="https://github.com/willtheorangeguy/cardback/actions/workflows/ci.yml/badge.svg">
  <img alt="Test State" src="https://github.com/willtheorangeguy/cardback/actions/workflows/tests.yml/badge.svg">
  <img alt="Pages State" src="https://github.com/willtheorangeguy/cardback/actions/workflows/pages.yml/badge.svg">
  <img alt="Docs Lint State" src="https://github.com/willtheorangeguy/cardback/actions/workflows/docs-lint.yml/badge.svg">
  <img alt="GitHub Issues" src="https://img.shields.io/github/issues/willtheorangeguy/cardback">
  <img alt="GitHub Pull Requests" src="https://img.shields.io/github/issues-pr/willtheorangeguy/cardback">
  <a href="https://williamvdg.me/cardback/docs/"><img alt="Documentation" src="https://img.shields.io/badge/docs-online-c33207"></a>
</div>

<!-- Nav -->
<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#support">Support</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a> •
  <a href="#credits">Credits</a>
</p>

Cardback estimates how much spending recovers a card's ongoing fee and whether it beats a no-fee alternative. All budget calculations happen locally in the browser; inputs are not persisted. The bundled card data was checked September 26, 2026 and does not update automatically.

## Key Features

- Compare thirty-two card entries from fourteen Canadian issuers, including a labeled prepaid option.
- Calculate fee recovery for one category or your monthly spending mix.
- Compare annual rewards after fees against a no-fee card.
- Model monthly and annual caps, shared allowances, and later comparison reversals.
- Configure Tangerine categories, reward redemption values, and eligible customer settings independently for both cards.
- Review issuer sources and locally bundled card artwork alongside results.

## Installation

Use Node.js 22.12+ in the Node.js 22 line, or Node.js 24, and npm.

```bash
git clone https://github.com/willtheorangeguy/cardback.git
cd cardback
npm ci
```

## Usage

```bash
npm run dev
```

Open Vite's printed local address. Keep **Cover the fee** and **Monthly** selected: BMO CashBack World Elite groceries show **$231.67 per month** with the bundled catalog. Select **Try an example budget** to see estimated annual rewards after fees.

The [hosted calculator](https://williamvdg.me/cardback/) needs no installation. Results assume repeating monthly spending and exclude interest, promotions, and most fee rebates. See the [calculation model](docs/calculation-model.md) for assumptions.

## Documentation

Full documentation lives in [`docs/`](docs/index.md) and the [MkDocs site](https://williamvdg.me/cardback/docs/):
[Installation](docs/installation.md) · [Usage](docs/usage.md) · [Configuration](docs/configuration.md) · [Troubleshooting](docs/troubleshooting.md)

Developer guides cover [architecture](docs/architecture.md), [development](docs/development.md), [testing](docs/testing.md), and [deployment](docs/deployment.md). The [card catalog](docs/card-catalog.md) records coverage and redemption assumptions; the [roadmap](docs/roadmap.md) records current limitations.

## Support

File an [issue](https://github.com/willtheorangeguy/cardback/issues/new/choose).

## Contributing

Contributions welcome. See the org-wide [Contributing Guide](https://github.com/willtheorangeguy/.github/blob/main/CONTRIBUTING.md) and [Code of Conduct](https://github.com/willtheorangeguy/.github/blob/main/CODE_OF_CONDUCT.md).

## License

No project license is declared. The repository has no `LICENSE` or `LICENSE.md`; reuse terms need a maintainer decision. Card artwork and trademarks belong to their respective issuers.

## Credits

Built with React, TypeScript, Vite, Tailwind CSS, and Lucide icons. Documentation uses Material for MkDocs and the shared [documentation design system](https://github.com/willtheorangeguy/mkdocs). Issuer artwork sources are recorded in [`scripts/card-image-sources.json`](scripts/card-image-sources.json).
