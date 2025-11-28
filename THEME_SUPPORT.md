# Theme Support

## Overview

Version 1.2.0+ includes full Home Assistant theme palette support. The card automatically adapts to your selected theme, including dark mode, light mode, and custom themes.

## Home Assistant CSS Variables Used

The card uses the following Home Assistant CSS variables for theming:

### Colors

| Variable | Usage | Example |
|----------|-------|---------|
| `--primary-color` | Avatar gradient, signal bars | Theme's primary color |
| `--accent-color` | Avatar gradient end | Theme's accent color |
| `--primary-text-color` | Main text, headings | Black (light) / White (dark) |
| `--secondary-text-color` | Labels, icons, node ID | Gray tones |
| `--text-primary-color` | Avatar text | White on colored backgrounds |
| `--error-color` | Error messages | Red tones |
| `--divider-color` | Section borders | Subtle gray lines |

### Typography

| Variable | Usage |
|----------|-------|
| `--paper-font-body1_-_font-family` | Card font family |

### Background

The card uses the default `ha-card` background, which automatically adapts to:
- Light themes: White/light backgrounds
- Dark themes: Dark backgrounds
- Custom themes: Theme-defined card backgrounds

## Theme Examples

### Default Light Theme
- Background: White
- Text: Dark gray/black
- Primary: Blue
- Accent: Orange

### Default Dark Theme
- Background: Dark gray
- Text: White
- Primary: Blue
- Accent: Orange

### Custom Themes
The card will automatically use colors from any custom theme you have installed.

## Battery & Signal Colors

Some colors remain fixed for semantic meaning:

### Battery Level
- **Green** (`#00ff88`): > 50%
- **Orange** (`#ffaa00`): 20-50%
- **Red** (`#ff5555`): < 20%

These colors provide consistent visual feedback regardless of theme.

### Signal Strength
Signal bars use `--primary-color` from your theme, with opacity for inactive bars.

## Testing Themes

To test the card with different themes:

1. **Switch to Dark Mode:**
   - Profile → Theme → Dark
   - Card should adapt to dark colors

2. **Switch to Light Mode:**
   - Profile → Theme → Light
   - Card should adapt to light colors

3. **Try Custom Themes:**
   - Install a custom theme from HACS
   - Select it in your profile
   - Card should use theme colors

## Custom Theme Example

If you want to create a custom theme for your dashboard:

```yaml
# configuration.yaml or themes.yaml
frontend:
  themes:
    meshtastic_purple:
      # Main colors
      primary-color: "#667eea"
      accent-color: "#764ba2"
      
      # Text colors
      primary-text-color: "#212121"
      secondary-text-color: "#727272"
      text-primary-color: "#ffffff"
      
      # Background
      card-background-color: "#ffffff"
      primary-background-color: "#fafafa"
      
      # Other
      divider-color: "rgba(0, 0, 0, 0.12)"
      error-color: "#db4437"
```

Apply this theme and the card will use purple tones for the avatar and signal bars.

## Dark Theme Example

```yaml
frontend:
  themes:
    meshtastic_dark:
      # Main colors
      primary-color: "#667eea"
      accent-color: "#764ba2"
      
      # Text colors (inverted for dark)
      primary-text-color: "#e1e1e1"
      secondary-text-color: "#9b9b9b"
      text-primary-color: "#ffffff"
      
      # Background (dark)
      card-background-color: "#1c1c1c"
      primary-background-color: "#121212"
      
      # Other
      divider-color: "rgba(255, 255, 255, 0.12)"
      error-color: "#cf6679"
```

## Compatibility

### Supported Themes
- ✅ Home Assistant default light theme
- ✅ Home Assistant default dark theme
- ✅ All custom themes from HACS
- ✅ User-defined themes

### Browser Support
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari
- ✅ Home Assistant mobile app

## Migration from v1.1.0

If you're upgrading from v1.1.0 (which had hardcoded dark colors):

**Before (v1.1.0):**
- Fixed dark blue background
- White text
- Purple/blue gradients

**After (v1.2.0):**
- Adapts to your theme
- Text color matches theme
- Avatar uses theme's primary/accent colors

The card will now look better in light themes and match your custom theme colors!

## Troubleshooting

### Card looks wrong in light theme
**Solution**: Clear browser cache (Ctrl+Shift+R) and reload

### Colors don't match my theme
**Solution**: 
1. Check your theme defines the CSS variables listed above
2. Some themes may not define all variables
3. Try switching to default theme and back

### Avatar is hard to read
**Solution**: The avatar uses `--text-primary-color` which should contrast with `--primary-color`. If your theme doesn't define this properly, you may need to adjust your theme.

## Resources

- [Home Assistant Themes Documentation](https://www.home-assistant.io/integrations/frontend/#themes)
- [Community Themes](https://github.com/topics/home-assistant-theme)
- [Theme Variables Reference](https://github.com/home-assistant/frontend/blob/dev/src/resources/ha-style.ts)

## Changelog

### v1.2.0
- ✨ Added full Home Assistant theme support
- 🎨 Card now adapts to light/dark/custom themes
- 🔧 Uses CSS variables for all colors
- 📱 Better visual consistency across themes
