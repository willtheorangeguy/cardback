# Installation

Cardback is a static browser application. Source installation is the supported development path; there is no desktop package or server service.

## Requirements

Use Git, npm, and Node.js 22.12+ in the Node.js 22 line, or Node.js 24. Docs also require Python and pip; CI uses Python 3.12.

## Application installation

Follow [Getting started](./getting-started.md). No API keys, database, or application environment variables are needed.

For production preview:

```sh
npm run build
npm run check:build
npm run preview
```

Open the printed preview address with `/cardback/` appended. Output lives in `dist/`.

## Documentation installation

Optionally isolate Python dependencies before installing them:

<!-- markdownlint-disable MD046 -->

=== "Windows"

    ```powershell
    python -m venv .venv-docs
    .\.venv-docs\Scripts\Activate.ps1
    ```

=== "macOS / Linux"

    ```sh
    python -m venv .venv-docs
    . .venv-docs/bin/activate
    ```

<!-- markdownlint-enable MD046 -->

From the project root:

```sh
npm run docs:prepare
python -m pip install -r .mkdocs-shared/shared/requirements-docs.txt
npm run docs:build
npm run docs:serve
```

The preparation command clones the pinned shared configuration and stages its assets. The strict build creates `site/`; the preview command prints the local docs address.

## Update or stop

After pulling changes, run `npm ci` again. Stop preview servers with Ctrl+C. There is no system-wide Cardback installation to uninstall.
