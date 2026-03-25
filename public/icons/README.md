# Custom App Icons Instructions

To update your application's icons, place your image files in this folder (`/public/icons/`).

## Recommended Icon Sizes & Names

| Filename | Size (px) | Purpose |
| :--- | :--- | :--- |
| `favicon.ico` | 16x16, 32x32, 48x48 | Standard browser favicon (multi-size ICO) |
| `icon-192.png` | 192x192 | Android / Chrome PWA icon |
| `icon-512.png` | 512x512 | Large PWA splash screen icon |
| `apple-touch-icon.png` | 180x180 | iOS Home Screen icon |
| `favicon.svg` | Scalable | Modern browser favicon (SVG) |

## Implementation Tips

1. **Format:** Use `.png` for most icons to support transparency. Use `.ico` for the main favicon for legacy support.
2. **Transparency:** Ensure icons have a transparent background unless you want a solid square look.
3. **Safe Area:** Keep the main logo within the center 80% of the icon to avoid clipping on some platforms (like Android adaptive icons).

## How to Update the App

After adding your icons, update the `<link>` tags in `/index.html`:

```html
<link rel="icon" type="image/svg+xml" href="/icons/favicon.svg" />
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
<link rel="manifest" href="/manifest.json" />
```
