# AGENTS.md

## Project Overview
- This repository is a **Next.js 15 + React 19 + TypeScript** web app (not Vite runtime).
- Main purpose: landing page for Moa Lab apps and LINE stickers.
- Primary language in UI/content is Japanese.

## Tech Stack
- Framework: Next.js (`src/app` App Router)
- Language: TypeScript (`.ts` / `.tsx`)
- Styling: plain CSS files imported by components/pages
- Package manager: npm (both `package-lock.json` and `yarn.lock` exist, prefer npm unless user requests otherwise)

## Key Commands
Run from repository root:

```bash
npm run dev    # local dev server
npm run build  # production build
npm run start  # run built app
npm run lint   # ESLint (Next.js)
```

## Repository Map
- `src/app/layout.tsx`: root layout + metadata
- `src/app/page.tsx`: top page (Hero / Apps / Stickers / Footer)
- `src/app/privacy-policy/page.tsx`: privacy policy page
- `src/components/*`: UI sections and reusable card component
- `src/hooks/*`: scroll/fade/loader behavior
- `src/App.css`: global theme variables and shared styles
- `public/images/*`: assets for apps, stickers, icons

## Working Rules For Agents
- Keep the existing visual direction (soft, clean, light theme) unless the user asks for redesign.
- Prefer minimal, local changes over broad rewrites.
- Reuse existing components (`Card`, section components, hooks) before adding new abstractions.
- Preserve Japanese copy and existing external links unless asked to update them.
- When adding animations/interactions, ensure cleanup for event listeners/observers in `useEffect`.
- Respect App Router conventions in `src/app`.

## Known Caveats
- `README.md` is currently a Vite template and does not describe actual runtime/setup.
- `useHeaderScroll` targets `header`, but no header element exists in current UI; verify intent before extending this behavior.

## Preferred Change Workflow
1. Inspect related component/hook and CSS together.
2. Make the smallest coherent patch.
3. Run `npm run lint` after changes.
4. If behavior changed visually, describe manual verification steps in the response.

## When Adding New Content
- Add image assets under `public/images/<feature_or_product>/`.
- Keep alt text meaningful (Japanese is acceptable/preferred for this project).
- For new cards/sections, keep responsive behavior consistent with existing `.grid` and `.section` styles.
