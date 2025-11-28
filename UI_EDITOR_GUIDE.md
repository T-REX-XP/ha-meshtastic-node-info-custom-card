# UI Editor Guide

The Meshtastic Node Card now supports visual configuration through the Home Assistant UI!

## 🎨 Using the Visual Editor

### Adding the Card

1. **Open your dashboard**
   - Navigate to your Home Assistant dashboard
   - Click the **"Edit Dashboard"** button (top right, pencil icon)

2. **Add the card**
   - Click **"+ Add Card"** button (bottom right)
   - In the search box, type **"Meshtastic"**
   - Click on **"Meshtastic Node Card"**

3. **Configure the entity**
   - A configuration dialog will appear
   - Click on the **"Entity"** dropdown
   - Search for your Meshtastic node entity
   - Select it from the list (e.g., `sensor.meshtastic_alphanode_1_base`)

4. **Save**
   - Click **"Save"** in the configuration dialog
   - Click **"Done"** to exit dashboard edit mode

### Editing Existing Card

1. Enter dashboard edit mode
2. Click the **three dots** (⋮) on the card
3. Select **"Edit"**
4. Change the entity in the dropdown
5. Click **"Save"**

## 📝 Configuration Options

The UI editor provides:

- **Entity Picker**: Dropdown list of all available entities
- **Auto-complete**: Type to filter entities
- **Validation**: Shows error if entity is required but not selected

## 🔧 Advanced: YAML Configuration

If you prefer YAML, you can still configure manually:

```yaml
type: custom:meshtastic-node-card
entity: sensor.meshtastic_node_alphanode_1
```

## 🎯 Tips

- **Entity filtering**: Type "meshtastic" in the entity picker to quickly find your nodes
- **Multiple cards**: Add multiple cards for different nodes
- **Grid layout**: Use grid cards to organize multiple node cards

## 🐛 Troubleshooting

### Card doesn't appear in search

- Ensure the card is properly installed via HACS or manually
- Clear browser cache (Ctrl+F5)
- Restart Home Assistant

### Entity picker is empty

- Ensure you have Meshtastic entities in Home Assistant
- Check that entities are not disabled
- Verify entity IDs in Developer Tools → States

### Configuration not saving

- Check browser console for errors (F12)
- Ensure entity ID is valid
- Try YAML configuration as fallback

## 📚 Related Documentation

- [README.md](README.md) - Main documentation
- [QUICKSTART.md](QUICKSTART.md) - Quick setup guide
- [example-config.yaml](example-config.yaml) - Configuration examples
