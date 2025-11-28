# GitHub Repository Setup for HACS

To complete HACS validation, you need to configure your GitHub repository settings.

## 1. Add Repository Description

1. Go to your repository on GitHub: `https://github.com/T-REX-XP/ha-meshtastic-node-info-custom-card`
2. Click the **⚙️ Settings** icon (gear icon) at the top right of the repository page
3. In the "About" section (right sidebar), click the **⚙️ gear icon**
4. Add this description:
   ```
   Custom Home Assistant card for displaying Meshtastic node information with battery level, signal strength, and hardware details
   ```
5. Click **Save changes**

## 2. Add Repository Topics

In the same "About" section dialog:

1. In the "Topics" field, add the following topics (press Enter after each):
   - `home-assistant`
   - `hacs`
   - `lovelace`
   - `custom-card`
   - `meshtastic`
   - `home-assistant-frontend`
   - `homeassistant-integration`

2. Click **Save changes**

## 3. Verify Changes

After making these changes:

1. Commit and push the updated `README.md` file (with the image)
2. Wait a few minutes for GitHub to process the changes
3. Re-run HACS validation

## Expected Result

All HACS validation checks should pass:
- ✅ Images in README
- ✅ Repository description
- ✅ Repository topics

## Additional Recommendations

Consider also adding:
- A website URL (if you have documentation hosted elsewhere)
- Enabling Issues (if not already enabled)
- Adding a proper LICENSE file (MIT is already present)
