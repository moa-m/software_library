> アプリ側仕様の2026-11-04時点の写し。本文中の開発用パスはアプリ側リポジトリ基準。LP用画像は本パッケージの `branding/` と `screenshots/` を使う。

# Mojilta Design System

**Version:** 1.3 (2026-11-03)
**Status:** Current implementation baseline — six selectable accent themes + user-supplied cream M and gold book app icon
**Platforms:** Android and iOS implementation; validation coverage is recorded separately
**Stack:** Flutter / Riverpod / Drift / Hive CE / go_router

This document describes the current code, not a completion claim. Historical references and preview assets do not override the implementation. See `10_IMPLEMENTATION_NOTES.md` for performed checks and remaining verification.

## 1. Product & visual direction

**Tagline:** Your words, unchanged. Read your way. — 文章はそのまま。読み方は自由に。
**Product:** A read-only, offline-first plain-text and Markdown viewer, designed to open existing files directly.

### Principles (priority order)

1. **Text first:** The text is always more important than the app chrome.
2. **Calm:** Quiet, editorial warmth instead of elaborate animation or heavy elevation.
3. **Immediate:** Open a file or resume viewing within one tap of the home screen.
4. **Safe:** No content editing, write permissions, or save controls in the reader.
5. **Viewing interactions:** TXT and Markdown source support document-wide selection. Rich Markdown has separate block selection; source view supplies cross-block copying.
6. **Inclusive:** Clear focus, large targets, system text scaling and screen reader support.

### Relationship to PilcrowMD

Inspiration is limited to user-experience qualities: restrained layout, a clear opening action, readable documents and an accessible recent-files list. **Do not copy** PilcrowMD's screen assets, brand graphics, icon, layout dimensions or source code. Mojilta uses its own palette, iconography, components and file handling.

## 2. Color tokens

Implemented values come from `lib/app/theme/mojilta_theme.dart`. `ColorScheme.fromSeed` supplies Material roles not explicitly overridden below. All values are sRGB hex. Dark mode is a deliberate warm-graphite palette, **not** a simple inversion. Distinguish the page canvas from auxiliary UI surfaces.

| Semantic token | Light | Dark | Primary use |
| --- | --- | --- | --- |
| `background` | `#F7F6F2` | `#171A19` | Entire page / document canvas |
| `surface` | `#FFFFFF` | `#202524` | Cards, bars, dialog |
| `textPrimary` | `#252722` | `#F1F0E9` | Body, labels |
| `textSecondary` | `#646961` | `#AFB7AF` | Description, metadata |
| `accent` | `#FFD866` | `#FFD866` | Default Dandelion primary action, links, current state |
| `onAccent` | `#171A19` | `#171A19` | Text/icon on accent fill |
| `border` | `#DCDDD6` | `#3D4741` | Dividers and outlines |
| `danger` | `#B44443` | `#F5A4A0` | Error and invalid/missing document |
| `selection` | accent at 23% alpha | accent at 32% alpha | Selection highlight |

### Accent-theme options (independent from appearance mode)

**Ink Blue** uses the stable storage ID `original`. The application offers exactly six options, displayed in the following order by name without numeric prefixes:

| Settings label | Stable ID (Hive CE) | Light accent | Dark accent | On dark accent |
| --- | --- | --- | --- | --- |
| Dandelion | `ochre` | `#FFD866` | `#FFD866` | `#171A19` |
| Ink Blue | `original` | `#356C8C` | `#74A6C5` | `#171A19` |
| Evergreen | `evergreen` | `#356C61` | `#A1D1BF` | `#16372F` |
| Terracotta | `terracotta` | `#99523D` | `#EBA991` | `#171A19` |
| Iris | `iris` | `#645A9D` | `#BDB3F5` | `#171A19` |
| Dusty Rose | `dustyRose` | `#97536E` | `#E4A9BE` | `#171A19` |

Light `onAccent` is `#171A19` for Dandelion and `#FFFFFF` for the other options. Non-accent neutral surfaces and reader text do **not** change on theme choice. Theme mode (display order: dark/light/system) is a separate preference, defaulting to dark. Existing saved choices are preserved. The selected accent is shared by home, reader chrome, settings, links, progress and selection handles, and updates immediately without an application restart.

Storage: Hive CE key `appearance.accent`, default `ochre` (Dandelion); persist only the stable ID. Unknown IDs must fall back to `ochre` (Dandelion). Preserve the chosen option across restarts. Display names are presentation metadata, not saved values. Dandelion retains the legacy `ochre` ID so existing Ochre selections use the new color.

**Accessibility target:** WCAG AA 4.5:1 for ordinary text. Token definitions alone do not establish accessibility across controls and states; verify selection highlighting, system scaling and TalkBack in context and record results.

**Use rules**
- Reader prose uses `textPrimary`; Markdown links use `accent`.
- The home wordmark, primary actions, links, selected controls, progress, search highlighting and selection handles use `accent`.
- No gradients, glassmorphism, saturated backgrounds, or decorative shadows.
- Use dividers sparingly; whitespace should establish hierarchy first.
- Verify body text and secondary labels against their actual backgrounds when tokens change.
- Android system bars and modal scrims must preserve legibility in either theme.

## 3. Typography

The app must work in Japanese and English, followed by other languages without a redesign.

### UI text

- Use the platform's default Flutter/system sans-serif for UI text; use system fallback for CJK. Document fonts are bundled separately as specified below.
- Home brand logotype: `Mojilta`, 48sp (40sp on short landscape screens), semibold, letter spacing -1.4px, centered in the selected accent color. Place the localized tagline 36dp below it. The wordmark remains one line and scales down when needed; the tagline may wrap. Section labels are localized, e.g. `最近開いたファイル`.

General UI typography uses the Material text theme; the earlier custom role/size table is not implemented.

### Reader-specific typography (separate from UI typography)

- Default font size **18sp**, adjustable via two-finger pinch and settings.
- Range **12–32sp**. Persist value in Hive CE, not in the text file.
- Default line height **1.65** for prose; optional compact **1.45** and spacious **1.85**.
- Paragraphs follow source line breaks in TXT. Preserve full-width spaces, tabs (configurable tab size later) and blank lines. **Never trim source indentation silently.**
- Bundle the same document fonts on Android and iOS: Noto Sans JP (default), Noto Serif JP, and Klee One. Apply the choice to TXT, Markdown prose, and both display previews. Markdown code retains platform monospace. Unsupported characters and emoji use platform fallback.
- Markup headings are scaled relative to the body size; avoid dramatic scale jumps. Markdown code uses platform monospace. h1/h2/h3 use 1.5/1.3/1.15 times body size; h4–h6 use body size, all at weight 600.
- Respect OS accessibility text scale. Do not force `TextScaler.noScaling`.

## 4. Layout, radii, icons, motion

**Spacing:** widget-specific logical dp values; there is no shared spacing-token class.
**Reader margins:** saved choice 16/20/28dp, default 20dp, with no automatic screen-width override. Text measure maximum **680dp**. Document top/bottom padding is 20/40dp.
**Corners:** primary button 12dp; cards 16dp. Unspecified components, including modal corner shapes, use Material defaults.
**Touch targets:** the app theme sets icon buttons to minimum **48×48dp** and filled buttons to **48×52dp**. Other controls and native selection actions still require device accessibility checks.
**UI icons:** 20–24dp, rounded/simple Material icons. **App launcher icon:** user-supplied cream M and gold book on dark navy. See `08_ICON_SPEC.md`.
**Animation:** use Flutter/Material defaults; no shared custom 120–180ms animation token is implemented.

**Surface:** AppBar and cards use elevation 0; cards have an outline.

**System insets:** The reader fills the canvas edge-to-edge, but controls and document text remain inside safe insets. Support gesture navigation, display cutouts, IME and landscape.

## 5. Component specifications

### MjPrimaryAction

- Filled accent, onAccent text, 52dp min height, 12dp radius; `ファイルを開く` / `Open file`.
- Icon left, text centered, fill remaining width up to maximum 520dp.
- Uses Material interaction states; tapping opens the native file picker. There is no separate loading state on the Home button.

### MjRecentFileRow

- Use a `ListTile` with 12dp minimum vertical padding and no card shadow; row height follows its content and text scaling.
- Left: TXT / MD outlined document icon (not colorful badge). Middle: filename with one-line end ellipsis and secondary file info/time. Right: popup menu.
- Persisted rows reopen the file; temporary rows open the system picker. The popup offers `再選択` / `Locate file` and `履歴から削除` / `Remove from recent`. **Remove from recent is not delete file.**
- Missing-file/permission errors appear in the reader after opening; there is no per-row error status on Home.

### MjContinueCard

- Show the newest recent entry with `persisted=true`. Source existence/permission is checked on open, not when building the card.
- File name, `前回の続きから` CTA and 2dp position indicator. Hide the indicator when `reader.showProgress` is false; position saving continues.
- One tap resumes at recorded anchor; update progress without blocking animation.

### MjReaderChrome

- Top controls start visible; tapping unselected text toggles them. No bottom tab bar.
- Single tap outside selected text/links toggles top actions and a very slim bottom progress/action strip.
- Top actions: Back, truncated filename, Search and Display settings. Markdown adds source/preview; enabling `reader.showEncoding` adds a UTF-8/Shift_JIS button. There is no Overflow menu.
- Display sheet: the regular settings content except About, including preview, typography, appearance, accent, progress visibility and encoding visibility. Height is 85% of the screen.
- Toolbar never intercepts text selection; while selecting, use native `Copy`, `Select all` and accessibility menu where feasible.
- `MediaQuery.accessibleNavigation` forces controls visible; actual TalkBack behavior remains a device-validation item.

### Settings controls and modal sheets

- Use wrapped Material `ChoiceChip` controls for line spacing, margin, font and appearance. Accent buttons use a two-column layout with a minimum 48×76dp size.
- The earlier `Mj...` component names in this document are descriptive labels, not implemented widget classes.
- Modal sheet uses the theme surface, Material corner defaults, a drag handle and safe inset at bottom.

### Empty, loading, error

- First-run home: brand, short message, a prominent Open file button, no fake recent rows.
- Empty recent: `最近開いたファイルはありません` / `No recent files`.
- File unreadable/moved: show a localized reason, `再選択` / `Locate file` and a return-home action. Decode failures additionally offer encoding selection. Never say Mojilta deleted the source file.
- Large documents: show a quiet progress indicator without blocking system navigation. Avoid flashing skeletons.

## 6. Screen specifications

### `/` Home

1. Maximum width 720dp, 24dp horizontal padding, vertically scrollable. Safe-area header: Settings and then a dedicated language dropdown at the top right, followed by a centered Mojilta wordmark and localized tagline. Behind them, show the current app icon's monochrome M and book at 4.5% opacity, tinted with `textPrimary`. This decorative asset is excluded from accessibility semantics. Use the original supplied logo silhouette without redrawing it. `tool/generate_app_icons.swift` also outputs `assets/branding/app_logo_monochrome.png` to keep the home logo aligned with the launcher artwork.
2. Accent **Open file** action, centered with a maximum width of 520dp, near the top and visible on ordinary phones. Below it, show the localized TXT/Markdown support hint.
3. **Resume card** for the newest persisted recent entry; opening handles missing/revoked sources.
4. `最近開いたファイル` / Recent files heading, list rows in newest-first order.
5. No bottom navigation. Routes are Home, Reader, Settings and Display preview.

### `/reader/:id` Reader

- Document canvas is uninterrupted; default background `background` and primary text color.
- Top bar starts visible and can be toggled by tapping unselected text. Keep it visible during search or accessible navigation. Text width is centered, max 680dp.
- Horizontal padding uses the saved 16/20/28dp setting on all screens; top/bottom padding is 20/40dp.
- No edit/save action, ever. Show clipboard copy only on deliberate selection. Rich Markdown uses `MarkdownBody`; source mode uses one `SelectableText.rich` for cross-block copying.
- Replace all Markdown images with an unsupported-image icon; open only explicitly tapped HTTP/HTTPS links in an external application.
- External files open at `/reader/incoming`; picked/recent files use `/reader/session`. Document identity lives in the shared reader session, rather than the route ID. Successful opens are recorded in Recent, with temporary access distinguished.
- Search source text case-insensitively with non-overlapping matches and cyclic previous/next navigation. Highlight the current match at 38% accent alpha, other matches at 18%. Markdown switches to source during search and returns to the explicitly selected display mode when search closes. There is no separate saved pre-search position to restore.

### `/settings` Settings

- **File text display:** font size, font style, line spacing, margin. Explain that these preferences apply to document contents across files, including files opened later; app menus and buttons keep their UI typography.
- Keep a built-in text sample visible above the scrolling controls so typography and margins can be compared without opening a file. Update the sample continuously during font-size adjustment; commit the preference on release.
- Offer `/settings/preview` with the actual document renderer and display settings. Sample viewing must not access files or create recent-history entries. With less than 240dp available height, provide the preview link in the list instead of pinning a sample. Otherwise sample height is 32% of available height, clamped to 140–220dp.
- **Appearance:** mode (dark/light/system) and **Theme color** selector containing the six accent variants, displayed as a two-column grid with labeled color swatches.
- The currently selected variant has a visible outline and checkmark, not a color-only indicator. Selection applies immediately; no save button.
- Changing appearance mode keeps the chosen accent variant; changing accent keeps the appearance mode.
- Expose accessible labels such as `Evergreen`, selected/not-selected, and respect 48dp touch targets.
- Below the accent grid, show progress visibility (default on) and encoding visibility (default off). Progress visibility controls both the reader bar and the Home resume-card bar, without disabling position saving. There are no launch-resume or external-history toggles.
- Language is changed only from Home: Japanese / English / System, default System. Selection applies immediately and is saved.
- Full-screen preview uses `ReadingBody`, supports pinch and a display sheet, and creates no file/history entry. Its sheet omits the inline sample to avoid nested previews.
- **About:** app version. Third-party license texts and copyright notices are supplied as bundled APK documents; there is no separate license screen or privacy-description footer.
- Avoid developer/debug controls in the production settings view.

## 7. Interaction contracts (must stay consistent in TXT and Markdown)

| Gesture | Behavior |
| --- | --- |
| Tap on text background | Show/hide reader controls; never move selection |
| Long-press text | Start selection (text in *both* `.txt` and `.md`) |
| Drag selection handles | Extend selection across TXT/source paragraphs; rich Markdown selection remains block-based |
| Copy | Preserve source newlines in TXT/source mode; rich Markdown copies rendered text |
| Two-finger pinch | Scale reader typography and reflow; do **not** zoom a bitmap |
| Vertical drag | Scroll only, except native selection-handle drag |
| Back | Close the topmost sheet; in the reader close search, then clear selection, then leave |
| External file change | Reopen latest source, try to preserve logical viewing position |

### Pinch and selection arbitration

- Track two pointers for pinch, and start from the font size captured at gesture start.
- Clamp reader font size 12–32sp. The settings slider has 0.5sp divisions (displayed labels round to whole sp); pinch produces continuous values. Commit pinch settings only after all pointers are released.
- The second pointer clears selection; disable selection and scrolling throughout the pinch, including the remaining single-pointer tail.
- TXT/source preserve a UTF-16 character offset using text layout; rich Markdown restores a scroll ratio. These are approximate positions, not paragraph anchors.
- Test `SelectableText` and Markdown selection independently. Use the explicitly labeled **read-only source view** for multi-paragraph Markdown copying. TXT cross-paragraph selection in the normal reader remains mandatory.

## 8. Multilingual requirements

- Default languages: Japanese (`ja`) and English (`en`); add languages through Flutter `gen_l10n` and ARB files.
- Localize text labels, errors, time/date labels and accessibility hints; never embed Japanese text in component implementation.
- Avoid language-bound symbols (e.g. Japanese `文` as the sole brand icon) if international use is important.
- Handle long filenames and translated button labels without clipping; enable multiline where practical.
- RTL languages are future-facing; use `EdgeInsetsDirectional` / `AlignmentDirectional` for logical start/end.
- Announce `TXT` and `Markdown` accessibly, with localized file type descriptions.
- Observe Android font scaling and screen reader behavior when the reader toolbar is hidden.

## 9. Flutter implementation mapping

- `lib/app/theme/mojilta_theme.dart`: palette and `ThemeData`; layout spacing is defined in individual widgets.
- `MaterialApp.router` uses `mojiltaTheme(Brightness.light, settings.accent)` and its dark counterpart, plus `settings.themeMode`.
- `Riverpod`: reactive app settings state (including a stable string accent ID) and current viewing session.
- `Hive CE`: reader settings, separate appearance mode and accent-theme ID (`appearance.accent`), per-device UI state.
- `Drift`: recent-files metadata, persisted SAF URI, viewing-position anchors.
- `go_router`: `/`, `/reader/:id`, `/settings`, `/settings/preview`.
- `SelectableText.rich` and `MarkdownBody`: Flutter selection, TXT multi-paragraph copying and Markdown read-only source fallback.
- Android SAF read-only access: never ask for write permission to read a file.

## 10. Quality targets and acceptance criteria

These are validation targets, not claims that every device configuration has passed. Use `06_ACCEPTANCE_TESTS.md` and the dated results in `10_IMPLEMENTATION_NOTES.md`.

- Opening app with 0 files shows Open file action immediately.
- Opening a file previously granted via SAF works after app restart where permission is persistable.
- TXT text preserves Japanese full-width indentation and empty lines.
- Long press -> drag -> copy works across multiple paragraphs in **TXT and Markdown source**; rich Markdown remains block-based. No edit cursor appears.
- Pinch changes glyph size and line wrapping, and does not modify file bytes.
- 7,000+ Japanese characters scroll smoothly on mid-range devices; test larger files separately (50k/200k+).
- Missing/revoked file explains what happened and offers recovery.
- Layout handles small (320dp), typical (360–430dp), landscape, tablet, accessibility text scale, dark/light and English expansion.
- All six accents work in Light and Dark and persist after restart; changes never modify or save source files.
- Selecting an accent does not unexpectedly change appearance mode; selecting appearance mode does not reset the accent.
- All interactive targets >=48dp; all important text combinations >= WCAG AA contrast targets.
- No forced onboarding, no account, no files copied/sent to server by default.

## 11. Design decisions & follow-up

- **Locked for v1:** independent visual identity, warm-paper/graphite + six selectable accents (default: Dandelion; appearance: dark); TXT/MD; native selection; read-only; home -> open/continue; no bottom navigation.
- **Further device validation:** Japanese line breaking / punctuation, narrow layouts, text scaling, bundled font rendering, selection and pinch under accessibility tools. Rich Markdown cross-block copying already uses the source fallback; do not describe it as continuous rich-text selection.
- **Out of scope:** edit/save, bookshelf organization, EPUB/PDF, file sync, text-to-speech, syntax coloring beyond Markdown code, third-party/imported themes.

## Sources and rationale

- Flutter themes and ColorScheme: https://docs.flutter.dev/cookbook/design/themes
- Flutter current Material 3 tokens: https://docs.flutter.dev/release/breaking-changes/new-color-scheme-roles
- Android touch target recommendations: https://support.google.com/accessibility/android/answer/7101858?hl=en
- WCAG contrast AA: https://www.w3.org/TR/wcag/#contrast-minimum
- PilcrowMD product reference (experience, not graphics): https://pilcrowmd.com/

## 12. Selected app icon (2026-11-03)

The user-supplied cream M and gold book icon in `reference/assets/app_icon_cream_book_source.png` is adopted. Preserve the supplied cream M, gold pages, dark navy background and texture; convert it to Android adaptive/legacy/monochrome assets and opaque iOS catalog images using `tool/generate_app_icons.swift`. Theme-color choices do not change the launcher icon. The older concept board is retained as historical reference only. See `08_ICON_SPEC.md`.
