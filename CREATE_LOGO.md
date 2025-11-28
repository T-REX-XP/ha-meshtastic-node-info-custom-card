# Creating logo.png for HACS

HACS displays icons from these files (in order of preference):
1. `logo.png` (200x200 recommended)
2. `icon.png`
3. `icon.svg` (we have this)

## Quick Steps to Add PNG Logo

### Option 1: Online Converter (Easiest)

1. Go to https://cloudconvert.com/svg-to-png
2. Upload `icon.svg` from the repository
3. Set dimensions: **200x200 pixels**
4. Download the converted file
5. Rename it to `logo.png`
6. Place it in the repository root (same folder as icon.svg)
7. Commit and push to GitHub

### Option 2: Using Browser DevTools

1. Open `icon.svg` in Chrome/Firefox
2. Right-click on the image → "Inspect Element"
3. In DevTools, right-click the `<svg>` element → "Capture node screenshot"
4. Save as `logo.png`
5. Resize to 200x200 if needed (using Paint, GIMP, etc.)
6. Place in repository root
7. Commit and push to GitHub

### Option 3: Using Command Line Tools

**With Inkscape:**
```bash
inkscape icon.svg --export-type=png --export-filename=logo.png --export-width=200 --export-height=200
```

**With ImageMagick:**
```bash
magick convert -background none icon.svg -resize 200x200 logo.png
```

**With rsvg-convert:**
```bash
rsvg-convert -w 200 -h 200 icon.svg -o logo.png
```

## After Creating logo.png

1. **Commit and push** both `icon.svg` and `logo.png` to GitHub
2. **Wait 5-10 minutes** for HACS to refresh its cache
3. **Force refresh HACS** in Home Assistant:
   - Go to HACS → Settings (three dots)
   - Click "Reload data"
4. **Clear browser cache** and refresh the page

## Note

HACS fetches icons directly from GitHub, so:
- The icon must be committed and pushed
- HACS caches icons, so changes may take time to appear
- You can force a refresh by reloading HACS data
