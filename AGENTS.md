# Repository Guidelines

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
- `find . -name '*.html'` : quickly list pages to smoke-test after edits.

## Coding Style & Naming Conventions
- Use 4-space indentation in HTML/CSS/JS (match current files).
- Prefer semantic HTML and accessible attributes (`alt`, `aria-label`).
- CSS class naming uses kebab-case (for example, `hero-section`, `lp-feature-card`).
- JavaScript should stay framework-free and modular by behavior (for example, loader handling, intersection observer animation).
- Reuse existing CSS variables and color tokens in `:root` before adding new ones.

## Testing Guidelines
There is currently no automated test framework in this repository. Use manual checks for every change:
- Verify desktop and mobile layouts on edited pages.
- Confirm key links (Google Play, LINE, policy pages, back navigation).
- Confirm animations/loaders still run without console errors.
- Validate updated images load and paths resolve from each HTML file.

## Commit & Pull Request Guidelines
Recent commits follow concise, emoji-prefixed messages (often Japanese), such as:
- `✨LPの追加`
- `💄アニメーションの追加、画像の変更`

Follow this pattern: `<emoji><short summary>` focused on one change set.

For PRs, include:
- What changed and why
- Affected pages/paths
- Before/after screenshots (desktop + mobile) for UI changes
- Manual test steps and results
- Linked issue/task if available

## Security & Configuration Tips
- Do not commit secrets or API keys.
- Prefer local/static dependencies; review external URLs before adding them.
- Optimize image sizes before committing to keep page load times reasonable.
