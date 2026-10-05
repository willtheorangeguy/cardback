# Known issues — Cardback

Concrete defects and gaps found while writing this repository's documentation.
**Nothing here was changed** — each one needs a code, configuration, or
licensing decision rather than a documentation one.

Ordered by severity. See [`docs/roadmap.md`](../roadmap.md) for the narrative version,
which also covers deliberate non-goals.

**1 open:** 1 medium.

## No project license is declared

**Severity:** Medium
**Where:** Repository root and `package.json`

**What:** The repository has no LICENSE or LICENSE.md file and package.json declares no license. Issuer artwork is bundled separately with source URLs and trademark attribution.

**Why it matters:** The docs cannot name project reuse terms or include a root license by reference.

**Suggested fix:** Have the maintainer choose project licensing terms and add the corresponding root license. Keep issuer artwork rights distinct from any project license.
