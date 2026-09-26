# Troubleshooting

Use command output to distinguish application, documentation, and deployment failures.

## Shared configuration is missing

Run `npm run docs:prepare` from the project root if MkDocs cannot find its inherited file. If preparation reports a ref mismatch, preserve local changes in the shared checkout and check out the exact ref shown before restaging.

## Python cannot find MkDocs

Activate the docs virtual environment if used, then install dependencies with the same interpreter:

```sh
python -m pip install -r .mkdocs-shared/shared/requirements-docs.txt
```

## Strict build fails

Read the warning above the failure. Check relative Markdown targets, heading anchors, and navigation entries. Snippet targets must exist; do not include missing root license or changelog files.

The shared revision-date plugin also warns when new pages have no Git history. A strict build can fail locally before their first commit. Commit the pages through your normal workflow and rerun; CI checks the committed tree with full history.

## Production assets fail

Run `npm run build` and `npm run check:build`. Preview at `/cardback/`, not `/`. Confirm required image files exist in `public/cards/`.

## Docs disappear after an app build

Vite cleans its output. Rebuild docs afterward with `npm run docs:build -- --site-dir dist/docs`.

## Pages does not deploy

Check CI failures first. Tests and both builds must pass. Confirm Pages uses GitHub Actions, the run targets `main`, and the deployment job has Pages and OIDC permissions. Do not add another deployment workflow.
