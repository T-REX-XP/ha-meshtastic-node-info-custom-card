/**
 * Meshtastic Node Card
 * v1.4.1
 * Fixed: config editor now always produces `type: custom:meshtastic-node-card`
 * Fixed: HA "No type provided" crash
 * Fixed: Safe rendering lifecycle
 */

class MeshtasticNodeCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this.config = null;
    this._card = null;
    this._content = null;
  }

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration.");
    }

    // Always enforce card type
    this.config = {
      type: "custom:meshtastic-node-card",
      entity: config.entity || null,
    };

    if (this._hass) {
      this._updateContent();
    }
  }

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

  _updateContent() {
    if (!this._content || !this._hass) return;

    if (!this.config) {
      this._content.innerHTML = this._renderPlaceholder();
      return;
    }

    const entityId = this.config.entity;

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

  // -------------------------------------------------------------------
  // Placeholder
  // -------------------------------------------------------------------
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
          Select a Meshtastic entity to continue
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------------
  // Entity Renderer
  // -------------------------------------------------------------------
  _renderEntity(entity) {
    const attrs = entity.attributes || {};

    const isGateway = attrs.device_class === "gateway";
    const nodeName =
      attrs.friendly_name ||
      attrs.long_name ||
      attrs.short_name ||
      "Unknown Node";

    const nodeId =
      attrs.node_id ||
      entity.entity_id.split(".")[1] ||
      entity.state ||
      "unknown";

    const battery = Number(attrs.battery_level ?? 0);
    const voltage = Number(attrs.voltage ?? 0);
    const signal = Number(attrs.snr ?? attrs.rssi ?? 0);
    const snr = Number(attrs.snr ?? 0);
    const lastSeen = attrs.last_heard || entity.last_changed;

    const hardware = isGateway
      ? `${attrs.config_lora_region || "Unknown"} / ${
          attrs.config_lora_modemPreset || "Unknown"
        }`
      : attrs.hardware || "Unknown";

    const location = isGateway
      ? attrs.config_position_gpsEnabled
        ? "GPS Enabled"
        : "GPS Disabled"
      : attrs.position_precision_bits
      ? "GPS Available"
      : attrs.location || "Unknown";

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

    const batteryIcon = this.getBatteryIcon(battery);
    const batteryColor =
      battery > 50 ? "#00ff88" : battery > 20 ? "#ffaa00" : "#ff5555";

    const signalBars = this.getSignalBars(signal);
    const lastSeenTime = this.formatLastSeen(lastSeen);

    const V = voltage.toFixed ? voltage.toFixed(1) : voltage;
    const SNR = snr.toFixed ? snr.toFixed(1) : snr;

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
          background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          color: var(--text-primary-color);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        .stat-label {
          font-size: 11px;
          color: var(--secondary-text-color);
        }
      </style>

      <div class="meshtastic-card">
        <div class="node-header">
          <div class="node-avatar">${this.getInitials(nodeName)}</div>
          <div>
            <div style="font-size:18px; font-weight:600;">${nodeName}</div>
            <div style="font-size:12px; color:var(--secondary-text-color);">${nodeId}</div>
          </div>
        </div>

        <div class="stats-grid">
          <div>
            <div class="stat-label">Battery</div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span style="color:${batteryColor}; font-size:20px;">${batteryIcon}</span>
              <span style="color:${batteryColor}; font-weight:600;">${battery}% (${V}V)</span>
            </div>
          </div>

          <div>
            <div class="stat-label">Signal</div>
            <div style="display:flex; align-items:center; gap:6px;">
              <div style="display:flex; gap:2px; align-items:flex-end;">${signalBars}</div>
              <span>${signal} dBm</span>
            </div>
          </div>

          <div>
            <div class="stat-label">SNR</div>
            <div style="font-weight:600; color:#00ff88;">${SNR} dB</div>
          </div>

          <div>
            <div class="stat-label">Last Seen</div>
            <div style="font-weight:600;">${lastSeenTime}</div>
          </div>
        </div>

        <div style="border-top:1px solid var(--divider-color); padding-top:16px;">
          <div><b>HW:</b> ${hardware}</div>
          <div><b>Loc:</b> ${location}</div>
          ${
            isGateway
              ? `<div><b>Config:</b> ${counts.role} | Hop:${counts.hopLimit} | TX:${counts.txPower}dBm</div>`
              : `<div><b>Counts:</b> ${counts.total} | ↑${counts.sent} | ↓${counts.received}</div>`
          }
        </div>
      </div>
    `;
  }

  // -------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------
  getInitials(name) {
    if (!name) return "??";
    return name
      .split(/[\s-]/)
      .filter((w) => w.length > 0)
      .map((w) => w[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  }

  getBatteryIcon(level) {
    return level > 50 ? "🔋" : "🪫";
  }

  getSignalBars(signal) {
    const strength = signal > -70 ? 4 : signal > -80 ? 3 : signal > -90 ? 2 : 1;
    let html = "";
    for (let i = 1; i <= 4; i++) {
      const height = i * 4;
      const opacity = i <= strength ? 1 : 0.3;
      html += `<div style="width:3px; height:${height}px; background:var(--primary-color); opacity:${opacity}; border-radius:2px;"></div>`;
    }
    return html;
  }

  formatLastSeen(timestamp) {
    if (!timestamp) return "Unknown";
    const now = new Date();
    const then = new Date(timestamp);
    if (isNaN(then)) return "Unknown";

    const diff = now - then;
    const mins = Math.floor(diff / 60000);

    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  getCardSize() {
    return 4;
  }

  static getConfigElement() {
    return document.createElement("meshtastic-node-card-editor");
  }

  static getStubConfig() {
    return { entity: "" };
  }
}

// ---------------------------------------------------------------------------
// Editor
// ---------------------------------------------------------------------------
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
      type: "custom:meshtastic-node-card",
      entity: config.entity || "",
    };
    this._render();
  }

  set hass(hass) {
    this._hass = hass;
    this._render();
  }

  _render() {
    const root = this.shadowRoot;
    if (!root) return;

    root.innerHTML = `
      <style>
        .card-config { padding: 16px; }
        .option { display:flex; align-items:center; margin-bottom:16px; }
        .option label { flex:1; font-weight:500; margin-right:8px; }
        .option ha-entity-picker { flex:2; }
      </style>

      <div class="card-config">
        <div class="option">
          <label>Entity</label>
          <ha-entity-picker id="entity" allow-custom-entity></ha-entity-picker>
        </div>
      </div>
    `;

    const picker = root.getElementById("entity");
    if (!picker) return;

    picker.hass = this._hass;
    picker.value = this._config.entity;
    picker.includeDomains = ["meshtastic"];
    picker.configValue = "entity";

    picker.removeEventListener("value-changed", this._onValueChanged);
    picker.addEventListener("value-changed", this._onValueChanged);
  }

  _onValueChanged(ev) {
    const target = ev.target;
    const key = target.configValue || "entity";
    const value = target.value;

    const newConfig = {
      type: "custom:meshtastic-node-card", // **CRITICAL FIX**
      ...this._config,
      [key]: value,
    };

    this._config = newConfig;

    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: newConfig },
        bubbles: true,
        composed: true,
      })
    );
  }
}

// Register elements
customElements.define("meshtastic-node-card", MeshtasticNodeCard);
customElements.define("meshtastic-node-card-editor", MeshtasticNodeCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "meshtastic-node-card",
  name: "Meshtastic Node Card",
  description: "Display Meshtastic node information with signal, battery, and hardware details",
  preview: true,
});

console.info(
  "%c MESHTASTIC-NODE-CARD %c v1.4.1 ",
  "color:white; background:#667eea; font-weight:bold;",
  "color:#667eea; background:white; font-weight:bold;"
);
