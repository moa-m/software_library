# Repository Guidelines

共通方針: [Web・LP](/Users/moa/Project/html/AGENTS.md)。作業に関連する共通方針を読み、このリポジトリの固有仕様を優先する。

## Project Structure & Module Organization
This repository is a static website for Moa Lab products.
- Root pages: `index.html`, `privacy-policy.html`, `terms-of-service.html`
- Main frontend assets: `css/style.css`, `js/script.js`
- Product LP: `notification-memo/` (`index.html`, `style.css`, `script.js`, `img/`)
- Shared media: `images/` grouped by feature (`notification_memo/`, `memo_usagi/`, `line/`, `icon/`)

Keep new assets in the closest existing category and use relative paths from each page.

## Build, Test, and Development Commands
No build step is required; files are served as-is.
- `python3 -m http.server 8000` : run a local static server from repository root.
- `open http://localhost:8000` : preview locally in a browser (macOS).
- `rg --files -g '*.html'`: list pages when the affected page set is unclear.

## Coding Style & Naming Conventions
- Use 4-space indentation in HTML/CSS/JS (match current files).
- Prefer semantic HTML and accessible attributes (`alt`, `aria-label`).
- CSS class naming uses kebab-case (for example, `hero-section`, `lp-feature-card`).
- JavaScript should stay framework-free and modular by behavior (for example, loader handling, intersection observer animation).
- Reuse existing CSS variables and color tokens in `:root` before adding new ones.

## Badge Update Rule
- When adding or changing `NEW` / `UPDATE` badges, always include a date in the badge text.
- Date format must be `YYYY/MM/DD` (for example, `2026/03/04`).
- Resolve the badge date from the request or existing release information. Ask only if the intended date cannot be determined; do not invent a release date.

## Testing Guidelines
There is currently no automated test framework in this repository. Select relevant manual checks based on the change; use mobile and desktop checks for layout changes:
- Verify desktop and mobile layouts on edited pages.
- Confirm key links (Google Play, LINE, policy pages, back navigation).
- Confirm animations/loaders still run without console errors.
- Validate updated images load and paths resolve from each HTML file.

## Commit & Pull Request Guidelines
Use `gitmoji-commit`: one emoji, a space, and a concise Japanese summary.
For PRs, describe the change, affected pages and relevant validation. Add before/after screenshots for material UI changes.

## Security & Configuration Tips
- Do not commit secrets or API keys.
- Prefer local/static dependencies; review external URLs before adding them.
- Optimize image sizes before committing to keep page load times reasonable.
