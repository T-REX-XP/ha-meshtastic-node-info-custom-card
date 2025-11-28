# Features Overview

## 🎨 Visual Configuration (NEW in v1.1.0)

### UI Editor Support
- **Visual card configuration** through Home Assistant UI
- **Entity picker** with search and autocomplete
- **No YAML required** for basic setup
- **Live preview** while configuring

### How to Use
1. Dashboard edit mode → "+ Add Card"
2. Search "Meshtastic Node Card"
3. Select entity from dropdown
4. Save and done!

See [UI_EDITOR_GUIDE.md](UI_EDITOR_GUIDE.md) for detailed instructions.

## 📊 Data Display

### Node Information
- **Avatar with initials** - Automatically generated from node name
- **Node name** - Long or short name display
- **Node ID** - Unique identifier

### Battery Status
- **Percentage display** - 0-100% with color coding
  - Green (>50%) - Good battery
  - Yellow (20-50%) - Medium battery
  - Red (<20%) - Low battery
- **Voltage** - Actual battery voltage (e.g., 4.0V)
- **Visual icon** - Battery emoji changes based on level

### Signal Strength
- **RSSI/SNR display** - Signal strength in dBm
- **Visual bars** - 4-level signal indicator
  - 4 bars: Excellent (>-70 dBm)
  - 3 bars: Good (-70 to -80 dBm)
  - 2 bars: Fair (-80 to -90 dBm)
  - 1 bar: Poor (<-90 dBm)
- **SNR value** - Signal-to-Noise Ratio in dB

### Time Information
- **Last seen** - Human-readable timestamp
  - "Just now" - Less than 1 minute
  - "Xm ago" - Minutes ago
  - "Xh ago" - Hours ago
  - "Xd ago" - Days ago

### Hardware & Location
- **Hardware model** - Device type (e.g., "Heltec V3")
- **Location** - GPS coordinates or location name
- **GPS status** - Shows if GPS is available

### Message Statistics
- **Total messages** - Overall message count
- **Sent messages** - Outgoing messages (↑)
- **Received messages** - Incoming messages (↓)

## 🎨 Design Features

### Modern Dark Theme
- **Dark background** (#1a1d2e)
- **Gradient avatar** - Purple/blue gradient
- **Color-coded indicators** - Green, yellow, red for status
- **Clean typography** - Modern sans-serif fonts

### Responsive Layout
- **Grid system** - 2-column stats layout
- **Sections** - Organized information sections
- **Borders** - Subtle dividers between sections
- **Spacing** - Comfortable padding and gaps

### Visual Elements
- **Emoji icons** - Battery, signal, hardware, location
- **Signal bars** - Animated opacity for inactive bars
- **Rounded corners** - Modern card appearance
- **Shadows** - Subtle depth effects

## 🔧 Technical Features

### Home Assistant Integration
- **Custom element** - Web Components standard
- **State updates** - Real-time data refresh
- **Entity attributes** - Reads all Meshtastic data
- **Error handling** - Graceful fallbacks for missing data

### Configuration
- **UI editor** - Visual configuration interface
- **YAML support** - Manual configuration option
- **Validation** - Required field checking
- **Default values** - Fallbacks for missing attributes

### Compatibility
- **Home Assistant 2023.1.0+** - Modern HA versions
- **HACS support** - Easy installation
- **Browser support** - All modern browsers
- **Mobile responsive** - Works on all screen sizes

### Performance
- **No dependencies** - Pure JavaScript
- **Lightweight** - ~400 lines of code
- **Fast rendering** - Efficient DOM updates
- **Low memory** - Minimal resource usage

## 📦 Installation Features

### HACS Integration
- **One-click install** - Through HACS store
- **Auto updates** - Notified of new versions
- **Version tracking** - Changelog included

### Manual Installation
- **Single file** - Just one JS file to copy
- **No build step** - Ready to use
- **Clear instructions** - Step-by-step guide

## 🎯 Use Cases

### Single Node Monitoring
- Monitor one Meshtastic node
- Perfect for base stations
- Quick status overview

### Multi-Node Dashboard
- Grid layout for multiple nodes
- Compare node status
- Network overview

### Mobile Monitoring
- Responsive design
- Touch-friendly
- Quick glance information

## 🔮 Future Enhancements

Potential features for future versions:
- Theme customization options
- Configurable display fields
- Historical data charts
- Alert thresholds
- Multiple node comparison
- Custom icons/avatars
- Compact/expanded views

## 📚 Documentation

- [README.md](README.md) - Main documentation
- [UI_EDITOR_GUIDE.md](UI_EDITOR_GUIDE.md) - UI editor instructions
- [QUICKSTART.md](QUICKSTART.md) - Quick setup
- [example-config.yaml](example-config.yaml) - Configuration examples
- [CHANGELOG.md](CHANGELOG.md) - Version history
