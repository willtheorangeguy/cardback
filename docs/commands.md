# Commands

Run application and documentation commands from the repository root. npm scripts are defined in `package.json`; artwork maintenance uses a standalone Node.js script. See [Installation](./installation.md) for dependencies.

## Application scripts

| Command | Output or effect |
| --- | --- |
| `npm run dev` | Starts Vite at the development root `/`; prints a local URL. |
| `npm run build` | Runs `tsc --noEmit`, then Vite; replaces `dist/`. |
| `npm run check:build` | Asserts compiled asset paths and catalog images in an existing `dist/`. |
| `npm run preview` | Serves an existing build under `/cardback/`. |
| `npm test` | Runs Vitest once. |

Check a production build in order:

```sh
npm run build
npm run check:build
npm run preview
```

Vitest can filter a test file through npm's argument separator:

```sh
npm test -- src/engine.test.ts
```

## Documentation scripts

| Command | Output or effect |
| --- | --- |
| `npm run docs:prepare` | Clones or validates the pinned shared checkout and stages design-system assets. |
| `npm run docs:build` | Runs `python -m mkdocs build --strict` into `site/`. |
| `npm run docs:serve` | Starts the MkDocs preview server using the prepared shared configuration. |

Build docs beside the calculator after building the app:

```sh
npm run docs:build -- --site-dir dist/docs
```

The docs scripts have no project-specific flags. The arguments after `--` are forwarded to MkDocs. For example, set the local preview address:

```sh
npm run docs:serve -- --dev-addr 127.0.0.1:8001
```

## Artwork maintenance

`node scripts/card-images.mjs` without an action flag does no discovery or downloading. The supported flags come directly from the script:

| Flag | Type | Default | Description |
| --- | --- | --- | --- |
| `--discover` | Flag | Off | Reads issuer product HTML and prints candidate image URLs; does not update the manifest. |
| `--download` | Flag | Off | Downloads manifest URLs into `public/cards/` after checking signatures and extensions. |
| `--only` | Comma-separated card IDs | All entries for the chosen action | Limits discovery or downloads to specified IDs, using `--only=bmo-world,bmo-free`. |

Discover artwork candidates for one card:

```sh
node scripts/card-images.mjs --discover --only=bmo-world
```

After reviewing and updating the source manifest, refresh that card's file:

```sh
node scripts/card-images.mjs --download --only=bmo-world
```

Refresh all manifest entries:

```sh
node scripts/card-images.mjs --download
```

Downloads overwrite matching local artwork. Discovery uses a 25-second request timeout; downloads use 30 seconds. A failed HTTP request, invalid signature, or missing or unsafe filename sets a nonzero process exit code. Review diffs before committing issuer artwork. See [Development](./development.md) for the manifest relationships.
