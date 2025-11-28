/**
 * Meshtastic Node Card
 * @version 1.4.0
 * @description A custom card for Home Assistant to display Meshtastic node information
 * @features Theme support, gateway device support, preview support, battery monitoring, signal strength, hardware info
 * @license MIT
 */

class MeshtasticNodeCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this.config = null;
    this._card = null;
    this._content = null;
  }

  /**
   * Called by Home Assistant to supply configuration
   * This must NOT be called by the card itself.
   */
  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Configuration error: config must be an object.");
    }

    // Allow empty entity (for preview); validate shape
    this.config = {
      entity: config.entity || null,
    };

    // Re-render if hass is already set
    if (this._hass) {
      this._updateContent();
    }
  }

  /**
   * Called by Home Assistant whenever hass changes.
   */
  set hass(hass) {
    this._hass = hass;

    if (!this._card) {
      const card = document.createElement("ha-card");
      card.style.cssText = "padding: 16px;";
      const content = document.createElement("div");

      card.appendChild(content);
      this.appendChild(card);

      this._card = card;
      this._content = content;
    }

    this._updateContent();
  }

  /**
   * Main render logic, called whenever hass or config changes.
   */
  _updateContent() {
    if (!this._content || !this._hass) {
      return;
    }

    // If config was never set, do nothing (HA contract: setConfig should be called)
    if (!this.config) {
      this._content.innerHTML = this._renderPlaceholder();
      return;
    }

    const entityId = this.config.entity;

    // Preview / unconfigured card
    if (!entityId) {
      this._content.innerHTML = this._renderPlaceholder();
      return;
    }

    const entity = this._hass.states[entityId];

    if (!entity) {
      this._content.innerHTML = `
        <div style="color: var(--error-color);">
          Entity "${entityId}" not found
        </div>
      `;
      return;
    }

    this._content.innerHTML = this._renderEntity(entity);
  }

  /**
   * Placeholder shown when no entity is configured.
   */
  _renderPlaceholder() {
    return `
      <div style="text-align: center; padding: 40px 20px; color: var(--secondary-text-color);">
        <div style="font-size: 48px; margin-bottom: 16px;">📡</div>
        <div style="font-size: 18px; font-weight: 600; margin-bottom: 8px; color: var(--primary-text-color);">
          Meshtastic Node Card
        </div>
        <div style="font-size: 14px;">
          Display Meshtastic node information with battery, signal, and hardware details
        </div>
        <div style="margin-top: 16px; font-size: 12px; opacity: 0.7;">
          Select a Meshtastic entity in the card configuration
        </div>
      </div>
    `;
  }

  /**
   * Main entity renderer.
   */
  _renderEntity(entity) {
    const attrs = entity.attributes || {};

    // Detect entity type: gateway device or node sensor
    const isGateway = attrs.device_class === "gateway";

    // Extract node name and ID
    const nodeName =
      attrs.friendly_name ||
      attrs.long_name ||
      attrs.short_name ||
      "Unknown Node";

    const nodeId =
      attrs.node_id ||
      (typeof entity.entity_id === "string"
        ? entity.entity_id.split(".")[1]
        : "") ||
      entity.state ||
      "unknown";

    // Extract data with fallbacks
    const battery = Number(attrs.battery_level ?? 0) || 0;
    const voltage = Number(attrs.voltage ?? 0) || 0;
    const signal = Number(attrs.snr ?? attrs.rssi ?? 0) || 0;
    const snr = Number(attrs.snr ?? 0) || 0;
    const lastSeen = attrs.last_heard || entity.last_changed || null;

    // Hardware info - gateway shows config, sensors show hardware model
    const hardware = isGateway
      ? `${attrs.config_lora_region || "Unknown"} / ${
          attrs.config_lora_modemPreset || "Unknown"
        }`
      : attrs.hardware || "Unknown";

    // Location - check GPS settings for gateway
    const location = isGateway
      ? attrs.config_position_gpsEnabled
        ? "GPS Enabled"
        : "GPS Disabled"
      : attrs.position_precision_bits
      ? "GPS Available"
      : attrs.location || "Unknown";

    // Message counts / config summary
    const counts = isGateway
      ? {
          hopLimit: attrs.config_lora_hopLimit || 0,
          txPower: attrs.config_lora_txPower || 0,
          role: attrs.config_device_role || "Unknown",
        }
      : {
          total: attrs.message_count || 0,
          sent: attrs.messages_sent || 0,
          received: attrs.messages_received || 0,
        };

    // Format derived values
    const lastSeenTime = this.formatLastSeen(lastSeen);
    const batteryIcon = this.getBatteryIcon(battery);
    const batteryColor =
      battery > 50 ? "#00ff88" : battery > 20 ? "#ffaa00" : "#ff5555";

    const signalBars = this.getSignalBars(signal);

    const safeVoltage = voltage.toFixed ? voltage.toFixed(1) : voltage;
    const safeSnr = snr.toFixed ? snr.toFixed(1) : snr;

    return `
      <style>
        .meshtastic-card {
          display: flex;
          flex-direction: column;
          gap: 16px;
          color: var(--primary-text-color);
          font-family: var(--paper-font-body1_-_font-family);
        }
        .node-header {
          display: flex;
          align-items: center;
          gap: 12px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--divider-color);
        }
        .node-avatar {
          width: 48px;
          height: 48px;
          background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: var(--text-primary-color);
        }
        .node-info {
          flex: 1;
        }
        .node-name {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: var(--primary-text-color);
        }
        .node-id {
          font-size: 12px;
          color: var(--secondary-text-color);
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
          color: var(--secondary-text-color);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .stat-value {
          font-size: 16px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--primary-text-color);
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
          background: var(--primary-color);
          border-radius: 2px;
        }
        .details-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 16px;
          border-top: 1px solid var(--divider-color);
        }
        .detail-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
        }
        .detail-icon {
          color: var(--secondary-text-color);
          font-size: 16px;
        }
        .detail-label {
          color: var(--secondary-text-color);
          min-width: 60px;
        }
        .detail-value {
          color: var(--primary-text-color);
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
              <span style="color: ${batteryColor};">${battery}% (${safeVoltage}V)</span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-label">Signal</div>
            <div class="stat-value">
              <div class="signal-bars">${signalBars}</div>
              <span>${signal} dBm</span>
            </div>
          </div>

          <div class="stat-item">
            <div class="stat-label">SNR</div>
            <div class="stat-value">
              <span style="color: #00ff88;">${safeSnr} dB</span>
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
            <span class="detail-icon">${isGateway ? "⚙️" : "💬"}</span>
            <span class="detail-label">${isGateway ? "Config:" : "Counts:"}</span>
            <span class="detail-value">
              ${
                isGateway
                  ? `${counts.role} | Hop:${counts.hopLimit} | TX:${counts.txPower} dBm`
                  : `${counts.total} | ↑${counts.sent} | ↓${counts.received}`
              }
            </span>
          </div>
        </div>
      </div>
    `;
  }

  getCardSize() {
    return 4;
  }

  getGridOptions() {
    return {
      rows: 4,
      columns: 6,
      min_rows: 4,
      max_rows: 6,
    };
  }

  // --- Helpers -------------------------------------------------------------

  getInitials(name) {
    if (!name || typeof name !== "string") {
      return "??";
    }
    return name
      .split(/[\s-]/)
      .filter((w) => w.length > 0)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  }

  getBatteryIcon(level) {
    if (level > 75) return "🔋";
    if (level > 50) return "🔋";
    if (level > 25) return "🪫";
    return "🪫";
  }

  getSignalBars(signal) {
    // crude mapping: better than nothing
    const strength = signal > -70 ? 4 : signal > -80 ? 3 : signal > -90 ? 2 : 1;
    let bars = "";
    for (let i = 1; i <= 4; i++) {
      const height = i * 4;
      const opacity = i <= strength ? 1 : 0.3;
      bars += `<div class="signal-bar" style="height: ${height}px; opacity: ${opacity};"></div>`;
    }
    return bars;
  }

  formatLastSeen(timestamp) {
    if (!timestamp) return "Unknown";

    const now = new Date();
    const then = new Date(timestamp);
    if (Number.isNaN(then.getTime())) {
      return "Unknown";
    }

    const diffMs = Math.max(0, now - then);
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;

    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;

    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  // UI Configuration Editor Support
  static getConfigElement() {
    return document.createElement("meshtastic-node-card-editor");
  }

  static getStubConfig() {
    return {
      entity: "",
    };
  }
}

customElements.define("meshtastic-node-card", MeshtasticNodeCard);

/**
 * Configuration editor for the Meshtastic Node Card
 */
class MeshtasticNodeCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = {};
    this._hass = null;
    this.attachShadow({ mode: "open" });

    this._onValueChanged = this._onValueChanged.bind(this);
  }

  setConfig(config) {
    this._config = {
      entity: config.entity || "",
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  /**
   * Required for HA editor registry
   */
  get value() {
    return this._config;
  }

  /**
   * Render the editor UI into shadow DOM
   */
  _render() {
    const root = this.shadowRoot;
    if (!root) return;

    root.innerHTML = `
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
            allow-custom-entity
          ></ha-entity-picker>
        </div>
        <div class="help-text">
          Select a Meshtastic entity (e.g., meshtastic.gateway_470c)
        </div>
      </div>
    `;

    const picker = root.getElementById("entity");
    if (!picker) return;

    picker.hass = this._hass;
    picker.value = this._config.entity || "";
    picker.includeDomains = ["meshtastic"];
    picker.configValue = "entity";

    picker.removeEventListener("value-changed", this._onValueChanged);
    picker.addEventListener("value-changed", this._onValueChanged);
  }

  _onValueChanged(ev) {
    if (!this._config) return;

    const target = ev.target;
    const key = target.configValue || "entity";
    const value = target.value;

    if (this._config[key] === value) {
      return;
    }

    this._config = {
      ...this._config,
      [key]: value,
    };

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      })
    );
  }
}

customElements.define("meshtastic-node-card-editor", MeshtasticNodeCardEditor);

// Register the card with Home Assistant
window.customCards = window.customCards || [];
window.customCards.push({
  type: "meshtastic-node-card",
  name: "Meshtastic Node Card",
  description:
    "Display Meshtastic node information with battery, signal, and hardware details",
  preview: true,
  documentationURL:
    "https://github.com/T-REX-XP/ha-meshtastic-node-info-custom-card",
});

console.info(
  "%c MESHTASTIC-NODE-CARD %c v1.4.0 ",
  "color: white; background: #667eea; font-weight: 700;",
  "color: #667eea; background: white; font-weight: 700;"
);
