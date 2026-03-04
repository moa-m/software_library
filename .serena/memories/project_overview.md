# Project Overview: Moa Lab. Website

## Purpose
The project is a static website for "Moa Lab.", a software development entity specializing in Android apps and LINE stickers. It serves as a portal/landing page for their products, including "Notification Memo" and "Memo Usagi".

## Tech Stack
- **Languages:** HTML5, CSS3 (Vanilla), JavaScript (Vanilla)
- **Frameworks/Libraries:** None (No external frameworks like React or Vue). Uses modern browser APIs like `IntersectionObserver`.
- **Build Tools:** None (Static site).
- **Hosting/Development Server:** Local development can be done using `python3 -m http.server 8000`.

## Codebase Structure
- `/`: Root directory containing `index.html` (main portal), `privacy-policy.html`, and `terms-of-service.html`.
- `/css/`: Main site CSS (`style.css`).
- `/js/`: Main site JavaScript (`script.js`).
- `/images/`: Shared media assets, organized by product/feature:
  - `notification_memo/`
  - `memo_usagi/`
  - `line/` (LINE stickers)
  - `icon/` (Site icons)
- `/memo-usagi/`: Landing page specific to the "Memo Usagi" app.
- `/notification-memo/`: Landing page specific to the "Notification Memo" app.
- `.vscode/`: VS Code settings.
- `.serena/`: Project-specific data and memories for Serena.
- `AGENTS.md`: Detailed repository guidelines for developers and agents.
