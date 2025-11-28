# 🚀 Quick Start Guide

Get your Meshtastic Node Card published to GitHub and HACS in 5 minutes!

## ✅ Prerequisites

- [ ] GitHub account
- [ ] Git installed on your computer
- [ ] Home Assistant with HACS installed (for testing)

## 📋 Step-by-Step

### 1️⃣ Create GitHub Repository (2 minutes)

1. Go to https://github.com/new
2. Fill in:
   - **Repository name**: `ha-custom-card-meshtastik`
   - **Description**: `Custom Home Assistant card for Meshtastic node information`
   - **Visibility**: Public
   - **DO NOT** check "Initialize with README"
3. Click **"Create repository"**

### 2️⃣ Push Your Code (1 minute)

Open PowerShell/Terminal in your project folder and run:

```powershell
cd "d:\Projects\My\ha-custom-card-meshtastik"

# Initialize git
git init
git add .
git commit -m "Initial commit: Meshtastic Node Card v1.0.0"

# Connect to GitHub (replace T-REX-XP)
git branch -M main
git remote add origin https://github.com/T-REX-XP/ha-custom-card-meshtastik.git
git push -u origin main
```

**⚠️ Important**: Replace `T-REX-XP` with your actual GitHub username!

### 3️⃣ Create First Release (1 minute)

1. Go to your GitHub repository
2. Click **"Releases"** (right sidebar)
3. Click **"Create a new release"**
4. Fill in:
   - **Tag**: `v1.0.0`
   - **Title**: `v1.0.0 - Initial Release`
   - **Description**: Copy from below ⬇️

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
Add as custom repository in HACS or see README for manual installation.
```

5. Click **"Publish release"**

### 4️⃣ Test in Home Assistant (1 minute)

1. Open Home Assistant
2. Go to **HACS** → **Frontend**
3. Click **⋮** (three dots) → **"Custom repositories"**
4. Add:
   - **Repository**: `https://github.com/T-REX-XP/ha-custom-card-meshtastik`
   - **Category**: `Lovelace`
5. Click **"Add"**
6. Search for **"Meshtastic Node Card"**
7. Click **"Download"**

### 5️⃣ Use the Card

Add to your dashboard:

```yaml
type: custom:meshtastic-node-card
entity: sensor.your_meshtastic_node
```

## ✨ You're Done!

Your card is now:
- ✅ Published on GitHub
- ✅ Available via HACS custom repository
- ✅ Ready to use in Home Assistant

## 🔄 Making Updates

When you make changes:

```powershell
# Make your changes to files
git add .
git commit -m "Description of changes"
git push

# Create new release on GitHub with incremented version
# Example: v1.1.0, v1.2.0, etc.
```

## 📝 Don't Forget

Update `T-REX-XP` in these files:
- [ ] `README.md` (line 30)
- [ ] `package.json` (lines 10, 23, 24)
- [ ] `PUBLISHING.md` (multiple locations)

## 🎯 Optional: Submit to HACS Default

Want your card in the official HACS store? See `HACS_SETUP.md` for instructions.

## 🆘 Need Help?

- **HACS Issues**: https://github.com/hacs/integration/issues
- **Home Assistant Community**: https://community.home-assistant.io/
- **This Project**: Create an issue in your GitHub repository

## 🎉 Share Your Work!

- Post on r/homeassistant
- Share in Home Assistant Discord
- Tweet with #HomeAssistant
- Blog about it!

---

**Estimated Total Time**: 5 minutes ⏱️

**Difficulty**: Easy 🟢
