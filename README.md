# Decked Out 3 Tracker

A public viewer guide for Decked Out 3, focused on searchable, sortable run information for Tracked Out.

## Tech stack

- Bun
- React Router
- React Query
- Hono
- Carbon Discord bot framework
- Drizzle
- Cloudflare Workers + D1 + Cron Triggers
- Base UI
- TanStack React Table
- CSS Modules
- class-variance-authority

## UI foundation

The interface uses Base UI for accessible, unstyled primitives. Base UI handles the boring-but-important interaction details for controls like buttons, inputs, and scroll areas, while the app owns the final visual style.

Current Base UI usage includes:

- Buttons for toolbar actions
- Inputs for search
- Scroll Area for table-local scrolling

Styling is handled with plain CSS Modules. Each reusable component lives in its own folder with:

```txt
index.tsx
component.module.css
component.module.css.d.ts
```

Variants use `class-variance-authority`, with variant names mapped to real CSS Module classes. Global CSS is reserved for design tokens, local font faces, and reset styles.

## Discord bot

The Discord bot is hosted inside the same Cloudflare Worker as the site.

- Interaction endpoint: `https://do3.trackedout.org/api/discord`
- Carbon deploy route: `https://do3.trackedout.org/api/discord/deploy?secret=do3`
- Commands live in `src/server/discord/commands`
- Shared bot code lives in `src/server/discord`
- YouTube video dedupe uses the `discord_videos` D1 table
- A Cloudflare Cron Trigger runs every minute and calls `checkYoutube`

Required Worker secrets:

```txt
DISCORD_BOT_TOKEN
DISCORD_CLIENT_SECRET
```

Apply D1 migrations:

```bash
bun run db:migrate:local
bun run db:migrate:remote
```

## Development

Install dependencies:

```bash
bun install
```

Start the local dev server:

```bash
bun run dev
```

## Build

```bash
bun run build
```

## Deploy

```bash
bun run deploy
```
