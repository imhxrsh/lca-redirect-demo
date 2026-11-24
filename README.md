# Buildboard

Buildboard is a small CI/CD build-console demo built with Next.js App Router, React, TypeScript, Tailwind CSS v4, and shadcn/ui. It provides a dashboard of sample builds, build status summaries, and an individual detail page for each build.

The sample build data is generated on the server for each request. The homepage shows a fresh set of builds on every load. Each build has a unique 32-character hexadecimal ID, and its details are deterministically generated from that ID so the same build URL continues to show the same data.

## Requirements

- [Bun](https://bun.sh/) (the project uses Bun 1.3.11)
- Node.js supported by the installed Next.js version

Use Bun for installing dependencies and running all project scripts.

## Setup

Clone the repository, enter the project directory, and install the locked dependencies:

```bash
bun install --frozen-lockfile
```

Start the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Copy `.env.example` to `.env.local` if you want to configure the optional redirect or authentication:

```bash
cp .env.example .env.local
```

`.env.local` is ignored by Git. Set values there, and restart the dev server after changing them.

| Variable | Default | Description |
| --- | --- | --- |
| `REDIRECT_TO_RANDOM_BUILD` | `false` | When `true`, requests to `/` are redirected to a newly generated `/builds/{id}` page. The ID is 32 hexadecimal characters. |
| `BUILD_AUTH_ENABLED` | `false` | When `true`, protects application routes with HTTP Basic Authentication. Browsers show their native username/password dialog. |
| `BUILD_AUTH_USERNAME` | empty | Username required when Basic Authentication is enabled. |
| `BUILD_AUTH_PASSWORD` | empty | Password required when Basic Authentication is enabled. |

For example:

```dotenv
REDIRECT_TO_RANDOM_BUILD=true
BUILD_AUTH_ENABLED=true
BUILD_AUTH_USERNAME=demo
BUILD_AUTH_PASSWORD=replace-with-a-private-password
```

Set both credentials before enabling authentication. If authentication is enabled without valid credentials, the app returns an error rather than serving the page without protection. Never commit real credentials. HTTP Basic Authentication should only be used over HTTPS outside local development.

## Features

- **Build dashboard (`/`)**: displays sample projects, branches, commits, statuses, durations, metrics, and the latest generated build.
- **Dynamic sample data**: each homepage request creates fresh build records and unique IDs using Node.js cryptographic randomness.
- **Build details (`/builds/{id}`)**: shows a build’s generated repository, branch, status, timing, progress, and steps. Details are derived from the URL ID, so the same ID produces the same sample record.
- **Optional random redirect**: an environment flag redirects the homepage to a newly generated build detail URL on each request.
- **Optional browser-native authentication**: a root-level Next.js Proxy checks HTTP Basic credentials before serving application routes.
- **shadcn/ui foundation**: initialized for Tailwind CSS v4, with reusable UI primitives in `components/ui`.

This is a front-end demo: build records are generated sample data. Buttons such as “New build”, “Re-run build”, and “View build logs” are visual UI examples and are not connected to a real CI system.

## Project structure

```text
app/
  builds/[id]/page.tsx   Build detail route
  globals.css            Tailwind and shadcn theme
  layout.tsx             Root layout and metadata
  page.tsx               Build dashboard
components/ui/           shadcn/ui components
lib/builds.ts            Sample build generation
proxy.ts                 Basic Auth and optional homepage redirect
components.json          shadcn/ui configuration
```

## Scripts

```bash
bun run dev       # Start the development server
bun run lint      # Run ESLint
bun run build     # Create a production build
bun run start     # Serve the production build
```

To run the production app locally:

```bash
bun run build
bun run start
```

## UI components

The project is initialized with shadcn/ui using the `base-nova` style. To add more components, use the shadcn CLI through Bun:

```bash
bunx --bun shadcn@latest add <component>
```

## Tech stack

- Next.js 16 App Router
- React 19 and TypeScript
- Tailwind CSS v4
- shadcn/ui components and Base UI
- Lucide icons
- Bun package manager
