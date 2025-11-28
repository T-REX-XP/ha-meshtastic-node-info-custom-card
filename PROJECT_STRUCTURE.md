# Project Structure

## 📁 Complete File Overview

```
ha-custom-card-meshtastik/
│
├── 📄 hacs.json                  # HACS configuration (REQUIRED for HACS)
├── 📄 info.md                    # HACS info page (REQUIRED for HACS)
├── 📄 README.md                  # Main documentation (REQUIRED)
├── 📄 LICENSE                    # MIT License (REQUIRED)
├── 📄 .gitignore                 # Git ignore rules
├── 📄 package.json               # NPM package info (optional)
│
├── 📄 example-config.yaml        # Usage examples
├── 📄 HACS_SETUP.md             # Detailed HACS setup guide
├── 📄 PUBLISHING.md             # Publishing instructions
├── 📄 PROJECT_STRUCTURE.md      # This file
│
├── 📁 src/
│   └── meshtastic-node-card.js  # Main custom card component (REQUIRED)
│
├── 📁 .github/
│   └── 📁 workflows/
│       ├── validate.yml         # HACS validation workflow
│       └── release.yml          # Release automation workflow
│
└── 📁 docs/
    ├── instructions.md          # Original requirements
    └── ui_example.png          # UI design reference
```

## 🎯 Core Files Explained

### src/meshtastic-node-card.js
The main JavaScript file containing the custom card component. This is what Home Assistant loads to display the card.

**Key Features:**
- Custom HTML element extending HTMLElement
- Responsive design with modern dark theme
- Real-time data updates from Home Assistant entities
- Signal strength visualization
- Battery status with color coding
- Timestamp formatting

### hacs.json
HACS configuration file that tells HACS how to handle this integration.

```json
{
  "name": "Meshtastic Node Card",
  "content_in_root": false,
  "filename": "src/meshtastic-node-card.js",
  "render_readme": true,
  "homeassistant": "2023.1.0"
}
```

### info.md
Displayed in HACS when users view the card details. Contains quick overview and configuration examples.

### README.md
Main documentation with:
- Installation instructions (HACS & Manual)
- Configuration options
- Expected entity attributes
- Usage examples

## 🚀 GitHub Actions Workflows

### validate.yml
Runs on every push and pull request to validate HACS compatibility.

### release.yml
Automatically creates release assets when you publish a new release on GitHub.

## 📦 Installation Files

### For HACS Users
1. `hacs.json` - Configuration
2. `info.md` - Info page
3. `src/meshtastic-node-card.js` - Card file

### For Manual Installation
1. `src/meshtastic-node-card.js` - Copy to `config/www/`
2. `README.md` - Installation instructions

## 🔄 Version Control

Current version: **1.0.0**

Version is tracked in:
- `src/meshtastic-node-card.js` (line 3)
- `package.json` (line 3)

## 📝 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Main user documentation |
| `HACS_SETUP.md` | Detailed HACS setup guide |
| `PUBLISHING.md` | Quick publishing commands |
| `PROJECT_STRUCTURE.md` | This file - project overview |
| `example-config.yaml` | Dashboard configuration examples |

## 🎨 Design Assets

- `docs/ui_example.png` - Original UI design reference
- Dark theme with gradient avatar
- Color-coded battery and signal indicators
- Modern card layout with sections

## 🔧 Configuration

The card accepts a single required parameter:

```yaml
type: custom:meshtastic-node-card
entity: sensor.meshtastic_node_name
```

## 📊 Expected Entity Attributes

The card reads these attributes from the Meshtastic entity:

| Attribute | Type | Description |
|-----------|------|-------------|
| `long_name` / `short_name` | string | Node name |
| `node_id` | string | Node identifier |
| `battery_level` | number | Battery % (0-100) |
| `voltage` | number | Battery voltage |
| `snr` | number | Signal-to-Noise Ratio |
| `rssi` | number | Signal strength |
| `last_heard` | datetime | Last communication |
| `hardware` | string | Hardware model |
| `location` | string | Location info |
| `message_count` | number | Total messages |
| `messages_sent` | number | Sent messages |
| `messages_received` | number | Received messages |

## 🚀 Next Steps

1. **Initialize Git**: See `PUBLISHING.md`
2. **Create GitHub Repo**: Follow `PUBLISHING.md`
3. **Create Release**: Tag v1.0.0
4. **Add to HACS**: See `HACS_SETUP.md`

## 📄 License

MIT License - See `LICENSE` file for details.

## 🤝 Contributing

Future contributions welcome! Consider adding:
- Configuration UI editor
- More customization options
- Additional themes
- Multi-node comparison view
- Historical data charts
