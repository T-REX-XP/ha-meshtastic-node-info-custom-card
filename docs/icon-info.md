# Repository Icon

## Files

- `icon.svg` - Vector icon in the root directory (used by HACS)
- `logo.png` - Optional PNG version for other uses

## Icon Design

The icon features:
- **Mesh network nodes** - Representing the Meshtastic mesh topology
- **Connection lines** - Showing node interconnections
- **Signal waves** - Radiating from the center node
- **Battery indicator** - Small accent in the corner
- **Color scheme** - Purple gradient (#667eea to #764ba2) matching the card UI

## HACS Usage

HACS automatically uses `icon.svg` from the repository root. No configuration needed in `hacs.json`.

## Creating PNG from SVG (Optional)

If you need a PNG version:

1. Open `icon.svg` in a browser
2. Take a screenshot or use an SVG to PNG converter
3. Save as `logo.png` (200x200px recommended)

Or use ImageMagick:
```bash
convert -background none icon.svg -resize 200x200 logo.png
```

Or use Inkscape:
```bash
inkscape icon.svg --export-type=png --export-filename=logo.png --export-width=200
```
