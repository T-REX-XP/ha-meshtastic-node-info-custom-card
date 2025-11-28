# HACS Setup Guide

This guide will help you publish your Meshtastic Node Card to HACS.

## Prerequisites

1. GitHub account
2. Repository hosted on GitHub
3. HACS installed in your Home Assistant instance

## Step 1: Prepare Your Repository

Your repository already includes all necessary files:

- ✅ `hacs.json` - HACS configuration
- ✅ `info.md` - Card information for HACS
- ✅ `README.md` - Documentation
- ✅ `LICENSE` - MIT License
- ✅ `.github/workflows/` - GitHub Actions for validation and releases

## Step 2: Create a GitHub Repository

1. Go to GitHub and create a new repository
2. Name it: `ha-custom-card-meshtastik` (or your preferred name)
3. Initialize with the files from this project:

```bash
cd d:\Projects\My\ha-custom-card-meshtastik
git init
git add .
git commit -m "Initial commit: Meshtastic Node Card"
git branch -M main
git remote add origin https://github.com/T-REX-XP/ha-custom-card-meshtastik.git
git push -u origin main
```

## Step 3: Create a Release

HACS requires at least one release:

1. Go to your GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `v1.0.0 - Initial Release`
5. Description:
   ```
   ## Features
   - Node information display with avatar
   - Battery level with visual indicator
   - Signal strength with bars
   - Last seen timestamp
   - Hardware and location info
   - Message statistics
   ```
6. Click "Publish release"

## Step 4: Add to HACS (Two Options)

### Option A: Submit to HACS Default Repository (Recommended)

1. Go to https://github.com/hacs/default
2. Fork the repository
3. Edit `plugin` file
4. Add your repository:
   ```json
   {
     "name": "Meshtastic Node Card",
     "description": "Display Meshtastic node information",
     "repository": "T-REX-XP/ha-custom-card-meshtastik"
   }
   ```
5. Create a Pull Request
6. Wait for HACS team approval (can take a few days)

### Option B: Add as Custom Repository (Immediate)

Users can add your card immediately:

1. Open HACS in Home Assistant
2. Click "Frontend"
3. Click three dots menu (top right) → "Custom repositories"
4. Add:
   - Repository: `https://github.com/T-REX-XP/ha-custom-card-meshtastik`
   - Category: `Lovelace`
5. Click "Add"
6. Search for "Meshtastic Node Card" and install

## Step 5: Update README

Update the repository URL in `README.md`:

Replace `T-REX-XP` with your actual GitHub username in line 30.

## Validation

The repository includes GitHub Actions that will:
- Validate HACS compatibility on every push
- Create release assets automatically

## Updating the Card

When you make updates:

1. Make your changes
2. Commit and push to GitHub
3. Create a new release with incremented version (e.g., `v1.1.0`)
4. HACS will automatically detect the update

## Support

For HACS-specific issues, see:
- https://hacs.xyz/
- https://github.com/hacs/integration

## Checklist

- [ ] Create GitHub repository
- [ ] Push all files
- [ ] Create first release (v1.0.0)
- [ ] Test installation via custom repository
- [ ] Submit to HACS default (optional)
- [ ] Update README with correct repository URL
