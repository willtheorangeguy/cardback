# Roadmap

This page records current limitations supported by the source, catalog notes, and test setup. It does not assign release dates or promise features.

## Catalog maintenance

The bundled catalog is a September 26, 2026 snapshot with thirty-two entries. Rates are not fetched at runtime. Issuer changes require source updates, verification dates, and calculation fixtures; see [Development](./development.md).

Coverage is not exhaustive. Business cards, discontinued products, additional regional issuers, and many points programs are outside the current catalog. The existing Tangerine and Simplii entries do not establish full coverage of their brands. See [Card catalog](./card-catalog.md) for the scan boundaries and already disclosed issuer changes.

## Transaction timing

The model repeats monthly spending across twelve billing cycles and allocates shared caps proportionally. It has no transaction ledger, purchase-order simulation, or transaction-date selector. For the disclosed October 22, 2026 Scotiabank rent and tax change, classification must be adjusted manually as described in the catalog.

For example, a monthly grocery budget of $650 is modeled as $7,800 per year spread evenly across billing cycles. An uneven real spending pattern can produce different rewards.

## Reward scope

Results exclude interest, foreign-exchange costs, welcome offers, supplementary cards, most fee rebates, independent loyalty offers, and variable travel-point valuations. Wealthsimple's waiver setting assumes eligibility for the whole modeled year. Redemption thresholds and transaction rounding are not simulated. These are model boundaries, described in [Calculation model](./calculation-model.md).

## State and interfaces

Budgets reset on reload. There are no accounts, saved budgets, live financial-data feeds, backend services, or supported public API. The internal engine can be inspected through [Engine reference](./engine-reference.md).

## Verification coverage

Vitest covers the engine, catalog, and artwork invariants. The build checker verifies production paths and images. There is no automated browser or accessibility suite; [Testing](./testing.md) retains manual interface checks.

## Maintainer decisions

The missing project license is recorded as an actionable finding in the repository's internal known-issues file. Internal findings are excluded from this site. A license page can be added by reference once the maintainer selects terms and adds the root license file.
