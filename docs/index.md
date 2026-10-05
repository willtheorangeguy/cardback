# Cardback

Cardback estimates the spending needed to recover a Canadian card's ongoing fee. Developers can run and maintain the static React application; calculator users can compare category thresholds or their monthly budget, including reward caps and differences against a no-fee card.

## Key features

- Compare thirty-two card entries from fourteen Canadian issuers, including a labeled prepaid option.
- Calculate fee recovery for one category or a spending mix.
- Compare net rewards against a no-fee card and see later reversals after caps.
- Configure Tangerine bonus categories independently for both cards.
- Adjust eligible fee waivers, customer rates, and points-redemption assumptions.
- Keep budget inputs in browser memory without saving them.

## Quick start

Open the [calculator](https://williamvdg.me/cardback/) or run these commands from an installed source checkout:

```sh
npm ci
npm run dev
```

Follow [Getting started](./getting-started.md) for prerequisites and a first result. The bundled BMO CashBack World Elite groceries threshold is **$231.67 per month**; the data is a September 26, 2026 snapshot.

## Where to next

<div class="grid cards" markdown>

- **[Getting started](./getting-started.md)**

    Install from source and check your first result.

- **[Using the calculator](./usage.md)**

    Classify spending and interpret results.

- **[Calculation model](./calculation-model.md)**

    Understand cap allocation and model assumptions.

- **[Card catalog](./card-catalog.md)**

    Review issuer coverage, sources, and redemption values.

- **[Configuration](./configuration.md)**

    Find browser defaults and build settings.

- **[Architecture](./architecture.md)**

    Follow components and data flow.

- **[Development](./development.md)**

    Maintain code, artwork, and documentation.

- **[Deployment](./deployment.md)**

    Build the app and docs for one static host.

</div>

Use [Testing](./testing.md), [CI/CD](./ci-cd.md), [Troubleshooting](./troubleshooting.md), [FAQ](./faq.md), and [Roadmap](./roadmap.md) for checks and limitations.

## Support

File an [issue](https://github.com/willtheorangeguy/cardback/issues/new/choose). Include the card, amounts, and comparison settings without personal financial information. Contributions follow the org-wide [Contributing Guide](https://github.com/willtheorangeguy/.github/blob/main/CONTRIBUTING.md) and [Code of Conduct](https://github.com/willtheorangeguy/.github/blob/main/CODE_OF_CONDUCT.md).
