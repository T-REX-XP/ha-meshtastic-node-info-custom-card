/**
 * Meshtastic Node Card
 * @version 1.1.0
 * @description A custom card for Home Assistant to display Meshtastic node information
 * @author Your Name
 * @license MIT
 */

class MeshtasticNodeCard extends HTMLElement {
  set hass(hass) {
    if (!this.content) {
      const card = document.createElement('ha-card');
      card.style.cssText = `
        background: #1a1d2e;
        border-radius: 12px;
        padding: 16px;
        color: #fff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      `;
      
      this.content = document.createElement('div');
      card.appendChild(this.content);
      this.appendChild(card);
    }

    const entityId = this.config.entity;
    const entity = hass.states[entityId];
    
    if (!entity) {
      this.content.innerHTML = `<div style="color: #ff5555;">Entity ${entityId} not found</div>`;
      return;
    }

    const attrs = entity.attributes;
    const nodeName = attrs.long_name || attrs.short_name || 'Unknown Node';
    const nodeId = attrs.node_id || entity.state;
    
    // Extract data with fallbacks
    const battery = attrs.battery_level || 0;
    const voltage = attrs.voltage || 0;
    const signal = attrs.snr || attrs.rssi || 0;
    const snr = attrs.snr || 0;
    const lastSeen = attrs.last_heard || entity.last_changed;
    const hardware = attrs.hardware || 'Unknown';
    const location = attrs.position_precision_bits ? 'GPS Available' : attrs.location || 'Unknown';
    const counts = {
      total: attrs.message_count || 0,
      sent: attrs.messages_sent || 0,
      received: attrs.messages_received || 0
    };

    // Format last seen
    const lastSeenTime = this.formatLastSeen(lastSeen);
    
    // Battery icon and color
    const batteryIcon = this.getBatteryIcon(battery);
    const batteryColor = battery > 50 ? '#00ff88' : battery > 20 ? '#ffaa00' : '#ff5555';
    
    // Signal bars
    const signalBars = this.getSignalBars(signal);

    this.content.innerHTML = `
      <style>
        .meshtastic-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .node-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid #2a2d3e;
        }
        .node-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: white;
        }
        .node-info {
          flex: 1;
        }
        .node-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
        }
        .node-id {
          font-size: 12px;
          color: #8b8d98;
          margin: 0;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .stat-label {
          font-size: 11px;
          color: #8b8d98;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-value {
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .battery-icon {
          font-size: 20px;
        }
        .signal-bars {
          display: flex;
          gap: 2px;
          align-items: flex-end;
        }
        .signal-bar {
          width: 3px;
          background: #4a9eff;
          border-radius: 2px;
        }
        .details-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid #2a2d3e;
        }
        .detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }
        .detail-icon {
          color: #8b8d98;
          font-size: 16px;
        }
        .detail-label {
          color: #8b8d98;
          min-width: 60px;
        }
        .detail-value {
          color: #fff;
          font-weight: 500;
        }
      </style>
      
      <div class="meshtastic-card">
        <div class="node-header">
          <div class="node-avatar">${this.getInitials(nodeName)}</div>
          <div class="node-info">
            <h3 class="node-name">${nodeName}</h3>
            <p class="node-id">${nodeId}</p>
          </div>
        </div>
        
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">Battery</div>
            <div class="stat-value">
              <span class="battery-icon" style="color: ${batteryColor};">${batteryIcon}</span>
              <span style="color: ${batteryColor};">${battery}% (${voltage.toFixed(1)}V)</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-label">Signal</div>
            <div class="stat-value">
              <div class="signal-bars">${signalBars}</div>
              <span>${signal}dBm</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-label">SNR</div>
            <div class="stat-value">
              <span style="color: #00ff88;">${snr.toFixed(1)} dB</span>
            </div>
          </div>
          
          <div class="stat-item">
            <div class="stat-label">Last Seen</div>
            <div class="stat-value">
              <span>${lastSeenTime}</span>
            </div>
          </div>
        </div>
        
        <div class="details-section">
          <div class="detail-row">
            <span class="detail-icon">📡</span>
            <span class="detail-label">HW:</span>
            <span class="detail-value">${hardware}</span>
          </div>
          <div class="detail-row">
            <span class="detail-icon">📍</span>
            <span class="detail-label">Loc:</span>
            <span class="detail-value">${location}</span>
          </div>
          <div class="detail-row">
            <span class="detail-icon">💬</span>
            <span class="detail-label">Counts:</span>
            <span class="detail-value">${counts.total} | ↑${counts.sent} | ↓${counts.received}</span>
          </div>
        </div>
      </div>
    `;
  }

  setConfig(config) {
    if (!config.entity) {
      throw new Error('You need to define a Meshtastic entity');
    }
    this.config = config;
  }

  getCardSize() {
    return 4;
  }

  getGridOptions() {
    return {
      rows: 4,
      columns: 6,
      min_rows: 4,
      max_rows: 6
    };
  }

  // UI Configuration Editor Support
  static getConfigElement() {
    return document.createElement('meshtastic-node-card-editor');
  }

  static getStubConfig() {
    return {
      entity: ''
    };
  }

  getInitials(name) {
    return name
      .split(/[\s-]/)
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  }

  getBatteryIcon(level) {
    if (level > 75) return '🔋';
    if (level > 50) return '🔋';
    if (level > 25) return '🪫';
    return '🪫';
  }

  getSignalBars(signal) {
    const strength = signal > -70 ? 4 : signal > -80 ? 3 : signal > -90 ? 2 : 1;
    let bars = '';
    for (let i = 1; i <= 4; i++) {
      const height = i * 4;
      const opacity = i <= strength ? 1 : 0.3;
      bars += `<div class="signal-bar" style="height: ${height}px; opacity: ${opacity};"></div>`;
    }
    return bars;
  }

  formatLastSeen(timestamp) {
    if (!timestamp) return 'Unknown';
    
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
}

customElements.define('meshtastic-node-card', MeshtasticNodeCard);

// Configuration Editor Element
class MeshtasticNodeCardEditor extends HTMLElement {
  setConfig(config) {
    this._config = config;
    this.render();
  }

  configChanged(newConfig) {
    const event = new Event('config-changed', {
      bubbles: true,
      composed: true,
    });
    event.detail = { config: newConfig };
    this.dispatchEvent(event);
  }

  render() {
    if (!this._config) {
      return;
    }

    this.innerHTML = `
      <style>
        .card-config {
          padding: 16px;
        }
        .option {
          display: flex;
          align-items: center;
          margin-bottom: 16px;
        }
        .option label {
          flex: 1;
          font-weight: 500;
          margin-right: 8px;
        }
        .option ha-entity-picker,
        .option input {
          flex: 2;
        }
        .help-text {
          font-size: 12px;
          color: var(--secondary-text-color);
          margin-top: 4px;
        }
      </style>
      <div class="card-config">
        <div class="option">
          <label for="entity">Entity (Required)</label>
          <ha-entity-picker
            id="entity"
            .hass="${this._hass}"
            .value="${this._config.entity || ''}"
            .configValue="${'entity'}"
            @value-changed="${this._valueChanged}"
            allow-custom-entity
          ></ha-entity-picker>
        </div>
        <div class="help-text">
          Select a Meshtastic node entity (e.g., sensor.meshtastic_node_alphanode_1)
        </div>
      </div>
    `;
  }

  set hass(hass) {
    this._hass = hass;
    // Update entity picker if it exists
    const entityPicker = this.querySelector('ha-entity-picker');
    if (entityPicker) {
      entityPicker.hass = hass;
    }
  }

  _valueChanged(ev) {
    if (!this._config || !this._hass) {
      return;
    }
    const target = ev.target;
    const configValue = target.configValue;
    
    if (this._config[configValue] === target.value) {
      return;
    }
    
    const newConfig = {
      ...this._config,
      [configValue]: target.value,
    };
    
    this.configChanged(newConfig);
  }
}

customElements.define('meshtastic-node-card-editor', MeshtasticNodeCardEditor);

// Register the card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: 'meshtastic-node-card',
  name: 'Meshtastic Node Card',
  description: 'Display Meshtastic node information with battery, signal, and hardware details',
  preview: false,
  documentationURL: 'https://github.com/T-REX-XP/ha-meshtastic-node-info-custom-card',
});

console.info(
  '%c MESHTASTIC-NODE-CARD %c v1.1.0 ',
  'color: white; background: #667eea; font-weight: 700;',
  'color: #667eea; background: white; font-weight: 700;'
);
