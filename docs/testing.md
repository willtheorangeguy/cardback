# Testing

Vitest tests the reward engine independently of the browser. TypeScript checking is part of the production build.

## Automated checks

```sh
npm test
npm run build
npm run check:build
```

Engine fixtures cover fees, caps, category settings, empty budgets, fee recovery, comparisons, and reversals. The production checker verifies asset prefixes and eight required artwork files.

After [installing docs dependencies](./installation.md), run `npm run docs:build`. Strict MkDocs validation catches warnings such as broken links and missing navigation targets. Docs Lint also checks Markdown style and external links on relevant PRs.

## Manual acceptance

- Switch cards and periods; verify rates, caps, and issuer links update.
- Configure Tangerine in both selectors; check the two-category limit and optional third category.
- Load the example, reset, and enter negative or oversized amounts.
- Compare against each no-fee card.
- Check the bundled BMO groceries threshold of $231.67 per month.
- Check narrow and wide layouts, keyboard navigation, focus, labels, and result announcements.

There is no automated browser or accessibility suite. Engine and build checks do not replace interface checks.
