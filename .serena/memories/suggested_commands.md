# Suggested Commands for Development

## Local Server
To preview the website locally from the project root:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

## File Listing
To quickly list all HTML pages for smoke-testing:
```bash
find . -name '*.html'
```

## Maintenance & Utilities
Check the system with standard Darwin (macOS) commands:
- `ls -R`: Recursively list all files.
- `grep -r "pattern" .`: Recursively search for a pattern in all files.
- `find . -type f -name "*.png"`: List all image files.

## Git Operations
As per repository guidelines:
- `git status`
- `git add .`
- `git commit -m "✨<emoji-message>"`
