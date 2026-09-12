Read `README.md` first.

Keep changes small, direct, and easy to verify.

## Rules

- Keep `isbot` installed; React Router needs it at runtime.
- Stack: Bun + React Router + React Query + Hono + Drizzle + Cloudflare Workers/D1.
- Pages live in `src/pages`; API routes live in `src/server/api.ts`; Drizzle schema lives in `src/server/db/schema.ts`.
- Use package-manager commands for dependency changes.
- Use `package.json` scripts for verification; prefer `bun run <script>`.
- Create migrations with Drizzle tooling only.
- Do not write tests unless specifically instructed.
- Never commit or expose secrets.
- Do not create extra types or functions unless they have to be exported.
- Follow the KISS principle.

## Design system and styling

- Use Base UI primitives for accessible interaction/setup, then style them to match the design.
- Use `class-variance-authority` for component variants.
- Use plain CSS Modules for component styles.
- Keep pages as composition/data only where possible; avoid page-level CSS Modules.
- Put reusable UI in `src/components/ui`.
- Each component gets its own folder with:
    - `index.tsx`
    - `<component>.module.css`
    - `<component>.module.css.d.ts`
- Imports should use component folder indexes, e.g. `~/components/ui/button`.
- Use CSS variables for all colors, spacing, sizing, radii, durations, typography values, and layout measurements.
- `src/globals.css` owns design tokens, font faces, and global reset only.
- No hallucinated utility classes; classes must exist in CSS Modules.
- Prefer generic component names and reusable APIs (`Table`, `Nav`, `Toolbar`, `SearchField`) over page/domain-specific names.

## Assets and fonts

- No external URL imports for fonts, assets, scripts, or styles; vendor them into the repo and serve local files.
- Fonts live in `public/fonts` and are referenced with local `@font-face` rules.
- Static runtime assets live in `public/assets`.
- Generic UI icons belong under `public/assets/icons`.
- Do not render third-party image URLs directly from React components. Proxy them through the app when needed.

## Data UI patterns

- Use TanStack React Table for data tables.
- Tables should support sorting/searching in the generic table component, not page-specific ad hoc code.
- Table search should cover all column accessor values.
- Table scroll should be local to the table via Base UI Scroll Area; do not make the whole page scroll just to view table rows.
- Table scrollbars should remain mounted/visible when scrollable.
- Use real `Date` objects for dates; format them at render time.

## Spoiler mode

- Spoiler mode is app state exposed through `useSpoilerMode`.
- Spoiler mode must persist across reloads.
- Spoiler mode must not flicker: SSR should read the cookie and seed the provider before hydration.
- Components that need spoiler state should use the hook; controls should live in a reusable component.
