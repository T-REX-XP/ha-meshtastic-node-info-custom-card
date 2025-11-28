![alt text](image.png)# Troubleshooting Guide

## Card Not Appearing in UI Editor

If the card doesn't appear when you click "+ Add Card", follow these steps:

### 1. Verify Installation

Check that the file exists:
- Go to **Settings** → **System** → **Repairs**
- Or check in File Editor: `/config/www/community/ha-meshtastic-node-info-custom-card/meshtastic-node-card.js`

### 2. Add Resource (HACS should do this automatically)

If the card still doesn't appear, manually add the resource:

1. Go to **Settings** → **Dashboards** → **Resources** (three dots menu, top right)
2. Click **"+ Add Resource"**
3. Enter:
   - **URL**: `/hacsfiles/ha-meshtastic-node-info-custom-card/meshtastic-node-card.js`
   - **Resource type**: `JavaScript Module`
4. Click **Create**

### 3. Clear Browser Cache

This is the most common issue:

**Hard Refresh:**
- **Windows/Linux**: `Ctrl + Shift + R` or `Ctrl + F5`
- **Mac**: `Cmd + Shift + R`

**Or clear cache completely:**
1. Open browser DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

**Or in browser settings:**
- Chrome: Settings → Privacy → Clear browsing data → Cached images and files
- Firefox: Settings → Privacy → Clear Data → Cached Web Content
- Safari: Develop → Empty Caches

### 4. Restart Home Assistant

Sometimes a full restart is needed:
1. Go to **Settings** → **System** → **Restart**
2. Wait for Home Assistant to fully restart
3. Clear browser cache again
4. Try adding the card

### 5. Check Browser Console for Errors

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for errors related to `meshtastic-node-card`
4. Common errors:
   - `404 Not Found` - File not installed correctly
   - `Syntax Error` - JavaScript error in the card code
   - `customElements.define` error - Card already defined (refresh needed)

### 6. Verify Card is Loaded

In browser console, type:
```javascript
customElements.get('meshtastic-node-card')
```

If it returns `undefined`, the card isn't loaded. If it returns a class, the card is loaded.

### 7. Check HACS Logs

1. Go to **HACS** → **Settings** (three dots menu)
2. Enable **Debug logging**
3. Try installing/reinstalling the card
4. Check logs in **Settings** → **System** → **Logs**

## Card Loads But Shows Error

### "Entity not found"
- Verify the entity exists: **Developer Tools** → **States**
- Check entity ID spelling
- Ensure the entity is a Meshtastic entity (meshtastic.* or sensor.meshtastic_*)

### "You need to define a Meshtastic entity"
- The `entity` field is required in configuration
- Add it in YAML mode or use the visual editor

### Card Shows But No Data
- Check entity attributes in **Developer Tools** → **States**
- The card expects attributes like: `battery_level`, `snr`, `rssi`, `node_id`, etc.
- If attributes are missing, the card will show 0 or "Unknown"

## Still Not Working?

1. **Reinstall via HACS:**
   - Go to HACS → Frontend
   - Find "Meshtastic Node Card"
   - Click three dots → Reinstall
   - Clear cache and restart

2. **Manual Installation:**
   - Download `src/meshtastic-node-card.js`
   - Copy to `/config/www/meshtastic-node-card.js`
   - Add resource: `/local/meshtastic-node-card.js`
   - Clear cache and restart

3. **Check Home Assistant Version:**
   - Minimum required: 2023.1.0
   - Check your version: **Settings** → **About**

4. **Open an Issue:**
   - If nothing works, open an issue on GitHub
   - Include: HA version, browser, console errors, HACS logs
