# Card catalog

The September 26, 2026 scan covers currently advertised personal cashback products from Canada's Big Five banks. The catalog contains sixteen Big Five entries plus Tangerine, Simplii, and Wealthsimple, for nineteen entries. Student products remain separate where the issuer advertises a student application path.

## Scan coverage

| Bank | Personal products represented | Inventory source |
| --- | --- | --- |
| BMO | CashBack Mastercard, Student CashBack Mastercard, CashBack World Elite Mastercard | [All cards](https://www.bmo.com/main/personal/credit-cards/all-cards/) |
| TD | Cash Back Visa, Cash Back Visa Infinite | [Cashback cards](https://www.td.com/ca/en/personal-banking/products/credit-cards/cash-back) |
| RBC | Cash Back Mastercard, Cash Back Preferred World Elite Mastercard | [Cashback comparison](https://www.rbcroyalbank.com/credit-cards/cash-back.html) |
| Scotiabank | Momentum No-Fee Visa, Momentum Visa, Momentum Visa Infinite +, Momentum Mastercard | [Card comparison](https://www.scotiabank.com/ca/en/personal/credit-cards/compare-cards.html) |
| CIBC | Dividend Visa, Dividend Visa for Students, Dividend Platinum Visa, Dividend Visa Infinite, Costco Mastercard / World Mastercard | [Cashback cards](https://www.cibc.com/en/personal-banking/credit-cards/cash-back-cards.html) |

CIBC's personal Costco Mastercard and World Mastercard share one entry because the issuer specifies identical fees and reward rates. Membership and eligibility requirements still differ from ordinary no-fee cards. BMO's legacy CashBack World Mastercard is referenced in reward agreements but is not included: this scan did not verify a current public application path and fee for that product.

## Wealthsimple addition

The Wealthsimple Visa Infinite + earns unlimited 2% on eligible purchases and charges $20 monthly ($240 annually in Quebec). With the regular fee, cashback covers the fee at $1,000 monthly spending, or $12,000 annually. The calculator excludes welcome cashback boosts and the first-month fee waiver.

Select the fee-waiver checkbox only if you meet the ongoing requirements throughout the modeled year: $100,000 or more in individual eligible assets/net deposits, or qualifying $4,000 direct deposits for each billing cycle. Household tier alone does not qualify. Partial-year eligibility and Quebec prorated refunds are not modeled. The card requires an active Wealthsimple chequing account and issuer eligibility.

Exclude cash-like transactions, refunds, fees, and adjustments from the spending budget. Cashback must be redeemed manually in the app. See [product and fees](https://www.wealthsimple.com/en-ca/wealthsimple-visa-infinite-card), [eligibility and waiver rules](https://help.wealthsimple.com/hc/en-ca/articles/31614256039835-Apply-for-a-Wealthsimple-credit-card), and [cashback exclusions and redemption](https://help.wealthsimple.com/hc/en-ca/articles/37750003281563-Earn-cash-back-with-your-credit-card).

This addition models the current Visa Infinite +, not the invitation-only 1% Visa Infinite beta or the separate Visa Infinite Privilege product.

## New reward rules

- TD has separate annual caps for groceries, fuel/EV, qualifying public transit, and a combined recurring-bills/digital-games/media pool. Use the public transit field for qualifying commuter transportation; taxis and rideshares do not receive TD's public-transit bonus. See [TD Infinite terms](https://www.td.com/ca/en/personal-banking/products/credit-cards/cash-back/cash-back-visa-infinite-card) and [TD no-fee terms](https://www.td.com/ca/en/personal-banking/products/credit-cards/cash-back/cash-back-visa-card).
- RBC's no-fee card has separate grocery and non-grocery tiers. Its non-grocery rate increases after the first $6,000 annually. See the [RBC benefits guide](https://www.rbcroyalbank.com/credit-cards/cash-back/rbc-cash-back-mastercard/rbc-cash-back-mastercard-benefits-guide.pdf).
- Scotia Momentum Visa and No-Fee Visa have shared accelerated-spending caps. Momentum Mastercard has uncapped reward groups and does not list EV charging MCC 5552 as accelerated. See [Visa terms](https://www.scotiabank.com/terms/momentum), [No-Fee Visa terms](https://www.scotiabank.com/terms/momentumnofee), and [Mastercard terms](https://www.scotiabank.com/content/dam/scotiabank/canada/en/documents/creditcards/noc/Credit-Card-NOC-and-Scotia-MC-TC_S-EN-WEB.pdf).
- Dividend Platinum has both eligible-category and total-spending caps. Eligible CIBC by Expedia purchases are exempt from the everyday bonus caps across Dividend cards; taxes, insurance, and service charges are not eligible portal purchases. See [Dividend reward terms](https://www.cibc.com/en/personal-banking/credit-cards/rewards-and-points/cash-back-benefits.html).
- Costco gas and other gas/EV share a fuel cap, while Costco.ca has its own cap. Warehouse purchases do not earn the grocery bonus. Costco cashback is an annual gift certificate; paid membership is required and its cost is not included in the card fee. See the [Costco benefits guide](https://www.cibc.com/content/dam/cibc-public-assets/personal-banking/credit-cards/all-credit-cards/costco/documents/cibc-costco-benefit-guide-en.pdf).

## Budget classification

Count each purchase once. Use Costco gas instead of other gas, public transit instead of taxis/rideshares, and Costco warehouse instead of groceries. Put recurring subscriptions in bills rather than digital media or games when you want the recurring-payment classification. The digital media field assumes the eligible TD merchant codes; entertainment tickets do not belong there.

EV charging has a separate field so unsupported cards use their fallback rate. Tangerine and Simplii do not automatically receive a gas bonus on EV-coded purchases in this model. The CIBC by Expedia field assumes eligible portal spending excluding nonqualifying charges; count those charges in Everything else.

## Announced changes

Scotiabank announces that rent and tax payments stop qualifying for recurring-bill bonus rates on its Momentum Visa cards on October 22, 2026. This is disclosed in each affected card's note; the calculator has no transaction-date selector. From that date, enter those payments in Everything else. See [Infinite + terms](https://www.scotiabank.com/terms/momentumvisainfiniteplus).

## Scope and follow-up

This is a personal cashback scan, not a claim that every bank credit card has been modeled. Business products such as TD Business Cash Back Visa and CIBC Costco Business Mastercard are excluded from the personal budget catalog. Points programs, travel-redemption values, low-interest cards without cashback, discontinued products, supplementary fees, welcome offers, and account-based rebates are also excluded.

Subsidiary catalogs have not been rescanned in full: the existing Tangerine and Simplii entries remain, but this scan does not claim complete coverage of those brands.

Each modeled card stores its fee, ongoing rate groups, source links, and verification date in `src/catalog.ts`. Artwork filenames live in `src/card-artwork.json`, with issuer download URLs in `scripts/card-image-sources.json`. The tests enforce matching identifiers across all three.

Read [Calculation model](./calculation-model.md) for proportional shared-cap allocation and statement-timing limitations.
