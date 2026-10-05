# Installation

Cardback is a static browser application. Source installation is the supported development path; there is no desktop package or server service. To use the calculator without installing developer tools, open the [hosted application](https://williamvdg.me/cardback/).

## Requirements

Use Git, npm, and Node.js 22.12+ in the Node.js 22 line, or Node.js 24. Vite also supports Node.js 20.19+, but the repository's test matrix covers Node.js 22 and 24. Documentation uses Python and pip; CI builds with Python 3.12. Linux, macOS, and Windows can use the source workflow.

```sh
node --version
npm --version
git --version
```

Cloning this private repository requires GitHub access. No application API keys, database, or environment variables are needed.

## Application installation

```sh
git clone https://github.com/willtheorangeguy/cardback.git
cd cardback
npm ci
npm run dev
```

Open the local address printed by Vite. See [Getting started](./getting-started.md) for the first calculation.

## Verify the installation

```sh
npm run build
npm run check:build
npm run preview
```

The build runs TypeScript checking and emits `dist/`. The checker reports that assets use `/cardback/` and all catalog images are bundled. Open the printed preview address with `/cardback/` appended. The default groceries threshold for BMO CashBack World Elite is $231.67 per month with the bundled catalog.

## Documentation installation

Create a virtual environment to isolate the shared Python toolchain. Run the matching platform commands from the project root:

<!-- markdownlint-disable MD046 -->

=== "Windows"

    ```powershell
    python -m venv .venv-docs
    .\.venv-docs\Scripts\Activate.ps1
    ```

=== "macOS / Linux"

    ```sh
    python3 -m venv .venv-docs
    . .venv-docs/bin/activate
    ```

<!-- markdownlint-enable MD046 -->

With the environment active:

```sh
npm run docs:prepare
python -m pip install -r .mkdocs-shared/shared/requirements-docs.txt
npm run docs:build
npm run docs:serve
```

Preparation clones the pinned shared configuration and stages its theme assets. Dependency versions come from that checkout's requirements file. The strict build creates `site/`; the preview command prints the local docs address. Keep the environment active when running docs commands, which invoke `python`.

New pages without Git history can produce revision-date warnings before their first commit. See [Troubleshooting](./troubleshooting.md#strict-build-fails) for that local build case.

## Upgrading

Pull source changes and reinstall locked application dependencies:

```sh
git pull --ff-only
npm ci
```

For documentation dependency changes, restage the shared configuration and reinstall its requirements. If the pinned ref changes, update the ignored checkout as described in [Development](./development.md).

## Uninstalling

Stop servers with Ctrl+C. Remove the local checkout to remove the application, generated output, and local documentation environment. There is no system-wide Cardback package, background service, or saved budget to remove.
