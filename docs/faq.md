# FAQ

???+ question "Does Cardback save my budget?"

    No. Inputs and settings stay in browser memory and reset on reload. There are no accounts, analytics, or financial-data API requests. Optional Google Fonts can make font requests; system fonts provide a fallback.

??? question "Are rates updated live?"

    No. Fees, rates, caps, and verification dates are bundled in `src/catalog.ts` and `src/retail-catalog.ts`. Fuel price and partner-store tax are assumptions you control, not live feeds. Check issuer terms before relying on a calculation.

??? question "Are points and prepaid cards counted as cashback credit cards?"

    No. EQ is labeled prepaid. PC Financial, Triangle and Scene+ show estimated reward value, not cash. PC and Scene+ offer a lower statement-credit valuation setting. Redemption minimums and independent loyalty offers are not included. See [Card catalog](./card-catalog.md).

??? question "Why can a card win and then fall behind?"

    Caps change effective reward rates. The engine checks every segment and reports later crossings. See [Calculation model](./calculation-model.md).

??? question "Does the annual toggle change budget inputs?"

    No. It changes category threshold units. Inputs remain monthly CAD amounts.

??? question "Why can statement rewards differ?"

    Shared caps are allocated proportionally in a repeating monthly budget. Merchant coding, purchase timing, and rounding can change actual rewards. Interest and promotions are not modeled.

??? question "Is there an API or backend?"

    No. Deploy static output. The reward engine is internal, not a supported public API.
