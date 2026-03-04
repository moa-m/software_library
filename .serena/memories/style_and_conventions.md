# Code Style and Conventions

## General Rules
- **Indentation:** Use 4-space indentation for all HTML, CSS, and JS files.
- **Language:** HTML content is primarily in Japanese (`lang="ja"`). Comments and documentation (like `AGENTS.md`) can be in English.
- **Accessibility:** Use semantic HTML tags (`<article>`, `<section>`, `<nav>`) and include proper ARIA attributes (`alt`, `aria-label`).
- **Media:** Optimize image sizes before committing to ensure fast page loads.

## HTML
- Use 4-space indentation.
- Group sections with appropriate IDs for navigation (e.g., `<section id="apps">`).

## CSS
- **Naming:** Use `kebab-case` for class names (e.g., `hero-section`, `lp-feature-card`).
- **Variables:** Reuse existing CSS variables and color tokens in `:root` before adding new ones.
- **Structure:** Standardized layouts using CSS Flexbox and Grid.

## JavaScript
- **Style:** Vanilla JavaScript only. Framework-free.
- **Modularity:** Separate functionality by behavior (e.g., loader handling, intersection observer for animations).
- **APIs:** Prefer modern browser APIs like `IntersectionObserver` and `DOMContentLoaded`.

## Badge Update Rule
- When adding or changing `NEW` / `UPDATE` badges:
  - Always include a date in the badge text.
  - Date format: `YYYY/MM/DD` (e.g., `2026/03/04`).
  - If a date is missing, ask the user before making changes.

## Commit Messages
- Format: `<emoji><short summary>`
- Examples:
  - `✨LPの追加`
  - `💄アニメーションの追加、画像の変更`
- Commits should be focused on one set of changes.
