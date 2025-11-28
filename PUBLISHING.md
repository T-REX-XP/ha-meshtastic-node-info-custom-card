# Publishing to GitHub and HACS

## Quick Start Commands

### 1. Initialize Git Repository

```bash
cd "d:\Projects\My\ha-custom-card-meshtastik"
git init
git add .
git commit -m "Initial commit: Meshtastic Node Card v1.0.0"
```

### 2. Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ha-custom-card-meshtastik`
3. Description: `Custom Home Assistant card for Meshtastic node information`
4. Public repository
5. **Do NOT** initialize with README (we already have one)
6. Click "Create repository"

### 3. Push to GitHub

```bash
git branch -M main
git remote add origin https://github.com/T-REX-XP/ha-custom-card-meshtastik.git
git push -u origin main
```

Replace `T-REX-XP` with your GitHub username.

### 4. Create First Release

On GitHub:
1. Go to your repository
2. Click "Releases" (right sidebar)
3. Click "Create a new release"
4. Fill in:
   - **Tag**: `v1.0.0`
   - **Title**: `v1.0.0 - Initial Release`
   - **Description**:
     ```markdown
     ## 🎉 Initial Release
     
     ### Features
     - 📱 Node information display with avatar
     - 🔋 Battery level with visual indicator
     - 📶 Signal strength (RSSI/SNR) with bars
     - ⏰ Last seen timestamp
     - 🔧 Hardware information
     - 📍 Location data
     - 💬 Message statistics
     
     ### Installation
     See README.md for installation instructions.
     ```
5. Click "Publish release"

## HACS Integration

### Immediate Use (Custom Repository)

Users can add your card right away:

1. Open HACS in Home Assistant
2. Go to "Frontend"
3. Click ⋮ menu → "Custom repositories"
4. Add:
   - **URL**: `https://github.com/T-REX-XP/ha-custom-card-meshtastik`
   - **Category**: `Lovelace`
5. Click "Add"
6. Search for "Meshtastic Node Card"
7. Click "Download"

### Official HACS Repository (Optional)

To get listed in HACS default repository:

1. Ensure your repo has:
   - ✅ At least one release
   - ✅ Valid `hacs.json`
   - ✅ `info.md` file
   - ✅ `README.md`
   - ✅ LICENSE file

2. Submit to HACS:
   - Go to https://github.com/hacs/default
   - Fork the repository
   - Edit the `plugin` file
   - Add your repository entry
   - Create Pull Request

## File Checklist

Your repository includes all required files:

- ✅ `src/meshtastic-node-card.js` - Main card file
- ✅ `hacs.json` - HACS configuration
- ✅ `info.md` - HACS info page
- ✅ `README.md` - Documentation
- ✅ `LICENSE` - MIT License
- ✅ `.gitignore` - Git ignore rules
- ✅ `.github/workflows/validate.yml` - HACS validation
- ✅ `.github/workflows/release.yml` - Release automation
- ✅ `example-config.yaml` - Usage examples
- ✅ `HACS_SETUP.md` - Detailed HACS guide

## After Publishing

### Update README

Don't forget to update `README.md` line 30:
```markdown
3. Add repository URL: `https://github.com/T-REX-XP/ha-custom-card-meshtastik`
```

Replace `T-REX-XP` with your actual GitHub username.

### Share Your Card

- Post on Home Assistant Community Forum
- Share on Reddit r/homeassistant
- Tweet about it with #HomeAssistant
- Add to Home Assistant Discord

## Future Updates

When you make changes:

1. Update version in `src/meshtastic-node-card.js` (line 3)
2. Commit changes
3. Push to GitHub
4. Create new release with incremented version
5. HACS will auto-detect the update

## Need Help?

- HACS Documentation: https://hacs.xyz/
- Home Assistant Community: https://community.home-assistant.io/
- GitHub Issues: Create issues in your repository
