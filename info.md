# Meshtastic Node Card

A beautiful custom card for Home Assistant to display Meshtastic node information.

## Features

- 📱 **Node Information** - Display node name, ID, and avatar
- 🔋 **Battery Status** - Visual battery level with voltage indicator
- 📶 **Signal Strength** - RSSI/SNR with visual signal bars
- ⏰ **Last Seen** - Human-readable timestamp
- 🔧 **Hardware Info** - Device hardware model
- 📍 **Location Data** - GPS and location information
- 💬 **Message Stats** - Total, sent, and received message counts
- 🎨 **UI Editor** - Configure via visual editor or YAML

## Configuration

### Visual Editor (Recommended)

1. Click "+ Add Card" in dashboard edit mode
2. Search for "Meshtastic Node Card"
3. Select your entity from the dropdown
4. Save

### YAML Configuration

```yaml
type: custom:meshtastic-node-card
entity: sensor.meshtastic_node_alphanode_1
```

### Options

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `entity` | string | Yes | Meshtastic node entity ID |

## Example

```yaml
type: custom:meshtastic-node-card
entity: sensor.meshtastic_alphanode_1_base
```

For multiple nodes, use a grid layout:

```yaml
type: grid
columns: 2
cards:
  - type: custom:meshtastic-node-card
    entity: sensor.meshtastic_node_1
  - type: custom:meshtastic-node-card
    entity: sensor.meshtastic_node_2
```
