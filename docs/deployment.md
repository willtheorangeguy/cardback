# Deployment

Publish the calculator and documentation as one static artifact. The application occupies `/cardback/` and the MkDocs site occupies `/cardback/docs/` on the configured Pages host.

## Build the combined site

Install application and documentation dependencies using [Installation](./installation.md), then run from the repository root:

```sh
npm run build
npm run check:build
npm run docs:build -- --site-dir dist/docs
npm run preview
```

Vite creates `dist/index.html`, compiled assets, and local card images. MkDocs adds `dist/docs/`. Open the printed preview address at `/cardback/` for the application and `/cardback/docs/` for documentation.

Build Vite first: it cleans `dist/`, including any docs generated there by an earlier build. Deploy the complete `dist/` directory after both builds succeed.

## GitHub Pages

`.github/workflows/pages.yml` is the deployment owner. On a `main` push, or manual dispatch on `main`, it calls CI. CI runs the Node.js test matrix, type checking, production-path checks, and a strict docs build. The Pages jobs download that validated artifact, upload it to Pages, and deploy it without rebuilding.

Pages must use **GitHub Actions** as its source. Jobs use the built-in GitHub token with `pages: write` and `id-token: write`. No personal access token or repository secret is required. Deployment uses the `github-pages` environment and serialized runs.

See [CI/CD](./ci-cd.md) for triggers and job responsibilities. Adding a second Pages deployment workflow would replace the same hosted artifact and can remove either the app or docs.

## Other static hosts

Serve the contents of `dist/` under `/cardback/`, preserving `assets/`, `cards/`, and `docs/`. This app has no client router or backend service to configure.

To change the hosting prefix, update the production base in `vite.config.ts`, the expected base in `scripts/check-build.mjs`, and the canonical `site_url` in `mkdocs.yml`. Then rebuild and check both entry points. No application environment variables override these values.

## Rollback and retention

GitHub Actions retains production artifacts and test reports for seven days. To publish an older revision, restore that revision's source through the normal Git workflow and let the `main` deployment run validate it again. A local preview does not deploy anything.
