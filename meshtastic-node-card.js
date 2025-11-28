/** 
 * Meshtastic Node Card
 * v2.2.0 — Auto Related Sensor Discovery
 *
 * - Auto-detects related Meshtastic sensors: sensor.meshtastic_<nodeId>_*
 * - Full/compact layouts
 * - Configurable metrics (battery, signal, snr, details)
 * - Localization (EN / UK)
 * - Editor UI included
 */

///////////////////////////////////////////////////////////////////////////////
// TRANSLATIONS ////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

const TRANSLATIONS = {
  en: {
    battery: "Battery",
    signal: "Signal",
    snr: "SNR",
    lastSeen: "Last Seen",
    hardware: "HW:",
    location: "Loc:",
    config: "Config:",
    counts: "Counts:",
    justNow: "Just now",
    minutesAgo: "{0}m ago",
    hoursAgo: "{0}h ago",
    daysAgo: "{0}d ago",
    unknown: "Unknown",
    unknownNode: "Unknown Node",
    entityNotFound: 'Entity "{0}" not found',
    cardTitle: "Meshtastic Node Card",
    cardDescription: "Display Meshtastic node information with battery, signal, and hardware details.",
    selectEntity: "Select a Meshtastic entity in the configuration.",
    gpsEnabled: "GPS Enabled",
    gpsDisabled: "GPS Disabled",
    gpsAvailable: "GPS Available",
    relatedSensors: "Related Sensors",
  },
  uk: {
    battery: "Батарея",
    signal: "Сигнал",
    snr: "SNR",
    lastSeen: "Востаннє",
    hardware: "Обл:",
    location: "Місце:",
    config: "Конфіг:",
    counts: "Лічильники:",
    justNow: "Щойно",
    minutesAgo: "{0}хв тому",
    hoursAgo: "{0}год тому",
    daysAgo: "{0}дн тому",
    unknown: "Невідомо",
    unknownNode: "Невідомий вузол",
    entityNotFound: 'Обʼєкт "{0}" не знайдено',
    cardTitle: "Картка вузла Meshtastic",
    cardDescription: "Показує інформацію про вузол Meshtastic: батарея, сигнал, обладнання.",
    selectEntity: "Виберіть обʼєкт Meshtastic у конфігурації картки.",
    gpsEnabled: "GPS увімкнено",
    gpsDisabled: "GPS вимкнено",
    gpsAvailable: "GPS доступний",
    relatedSensors: "Повʼязані сенсори",
  },
};

///////////////////////////////////////////////////////////////////////////////
// MAIN CARD CLASS ////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class MeshtasticNodeCard extends HTMLElement {
  constructor() {
    super();
    this._hass = null;
    this._config = null;
    this._card = null;
    this._content = null;
    this._lang = "en";
  }

  /////////////////////////////////////////////////////////////////////////////
  // LANGUAGE / TRANSLATION ///////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _getLanguage() {
    if (!this._hass) return "en";
    const lang = this._hass.language || "en";
    return lang.startsWith("uk") ? "uk" : "en";
  }

  _t(key, ...params) {
    this._lang = this._getLanguage();
    const dict = TRANSLATIONS[this._lang] || TRANSLATIONS.en;

    let text = dict[key] || TRANSLATIONS.en[key] || key;
    params.forEach((p, i) => {
      text = text.replace(`{${i}}`, p);
    });
    return text;
  }

  /////////////////////////////////////////////////////////////////////////////
  // DEFAULT CONFIG ///////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  static get DEFAULT_CONFIG() {
    return {
      type: "custom:meshtastic-node-card",
      entity: null,
      compact: false,
      show_battery: true,
      show_signal: true,
      show_snr: true,
      show_details: true,
    };
  }

  /////////////////////////////////////////////////////////////////////////////
  // CONFIG ///////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  setConfig(config) {
    if (!config || typeof config !== "object") {
      throw new Error("Invalid configuration for Meshtastic Node Card.");
    }

    this._config = {
      ...MeshtasticNodeCard.DEFAULT_CONFIG,
      ...config,
      type: "custom:meshtastic-node-card",
    };

    if (this._hass) this._updateContent();
  }

  /////////////////////////////////////////////////////////////////////////////
  // HASS /////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  set hass(hass) {
    this._hass = hass;

    if (!this._card) {
      const card = document.createElement("ha-card");
      card.style.cssText = "padding:16px;";
      const content = document.createElement("div");

      card.appendChild(content);
      this.appendChild(card);

      this._card = card;
      this._content = content;
    }

    this._updateContent();
  }

  /////////////////////////////////////////////////////////////////////////////
  // MAIN RENDER LOGIC ////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _updateContent() {
    if (!this._content || !this._hass) return;

    if (!this._config) {
      this._content.innerHTML = this._renderPlaceholder();
      return;
    }

    const entityId = this._config.entity;
    if (!entityId) {
      this._content.innerHTML = this._renderPlaceholder();
      return;
    }

    const entity = this._hass.states[entityId];
    if (!entity) {
      this._content.innerHTML = this._renderError(this._t("entityNotFound", entityId));
      return;
    }

    const data = this._extractEntityData(entity);
    this._content.innerHTML = this._renderCard(data);
  }

  /////////////////////////////////////////////////////////////////////////////
  // PLACEHOLDER RENDERING ////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _renderPlaceholder() {
    return `
      <div style="text-align:center; padding:40px 20px; color:var(--secondary-text-color);">
        <div style="font-size:48px;">📡</div>
        <div style="font-size:18px; font-weight:600; margin-top:16px;">
          ${this._t("cardTitle")}
        </div>
        <div style="font-size:14px; margin-top:8px;">
          ${this._t("cardDescription")}
        </div>
        <div style="font-size:12px; margin-top:16px; opacity:0.7;">
          ${this._t("selectEntity")}
        </div>
      </div>
    `;
  }

  /////////////////////////////////////////////////////////////////////////////
  // ERROR RENDERING //////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _renderError(text) {
    return `<div style="padding:16px; color:var(--error-color);">${text}</div>`;
  }

  /////////////////////////////////////////////////////////////////////////////
  // CARD RENDER //////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _renderCard(data) {
    const cfg = this._config;
    const layout = cfg.compact ? "compact" : "full";

    const styles = `
      <style>
        .meshtastic-card { display:flex; flex-direction:column; gap:16px; }
        .node-header { display:flex; align-items:center; gap:12px;
          padding-bottom:${layout === "full" ? "16px" : "8px"};
          border-bottom:1px solid var(--divider-color);
        }
        .node-avatar {
          width:${layout === "full" ? "48px" : "40px"};
          height:${layout === "full" ? "48px" : "40px"};
          background:linear-gradient(135deg,var(--primary-color),var(--accent-color));
          border-radius:12px;
          display:flex; align-items:center; justify-content:center;
          font-weight:bold; color:var(--text-primary-color);
          font-size:${layout === "full" ? "20px" : "16px"};
        }
        .node-title { font-weight:600; font-size:${layout === "full" ? "18px" : "16px"}; }
        .node-subtitle { font-size:12px; color:var(--secondary-text-color); }
        .stats-grid-full { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .stats-row-compact { display:flex; flex-wrap:wrap; gap:12px; align-items:center; }
        .stat-item { display:flex; flex-direction:column; }
        .stat-label { font-size:11px; color:var(--secondary-text-color); text-transform:uppercase; }
        .stat-value { font-weight:600; display:flex; gap:6px; align-items:center; }
        .signal-bars { display:flex; gap:2px; align-items:flex-end; }
        .signal-bar { width:3px; background:var(--primary-color); border-radius:2px; }
        .details-section { border-top:1px solid var(--divider-color); padding-top:12px; display:flex; flex-direction:column; gap:6px; }
        .detail-row { display:flex; gap:8px; font-size:13px; }
        .detail-label { color:var(--secondary-text-color); min-width:60px; }
        .detail-value { font-weight:500; }
      </style>
    `;

    return `
      ${styles}
      <div class="meshtastic-card">
        ${this._renderHeader(data, layout)}
        ${this._renderStats(data, layout, cfg)}
        ${cfg.show_details ? this._renderDetails(data) : ""}
        ${this._renderRelatedSensors(data.relatedSensors)}
      </div>
    `;
  }

  /////////////////////////////////////////////////////////////////////////////
  // HEADER ///////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _renderHeader(data) {
    return `
      <div class="node-header">
        <div class="node-avatar">${this.getInitials(data.nodeName)}</div>
        <div>
          <div class="node-title">${data.nodeName}</div>
          <div class="node-subtitle">${data.nodeId}</div>
        </div>
      </div>
    `;
  }

  /////////////////////////////////////////////////////////////////////////////
  // STATS ////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _renderStats(data, layout, cfg) {
    const blocks = [];

    if (cfg.show_battery) blocks.push(this._renderBatteryStat(data));
    if (cfg.show_signal) blocks.push(this._renderSignalStat(data));
    if (cfg.show_snr) blocks.push(this._renderSnrStat(data));
    blocks.push(this._renderLastSeenStat(data));

    if (layout === "compact") {
      return `<div class="stats-row-compact">${blocks.join("")}</div>`;
    }

    return `<div class="stats-grid-full">${blocks.join("")}</div>`;
  }

  _renderBatteryStat(data) {
    return `
      <div class="stat-item">
        <div class="stat-label">${this._t("battery")}</div>
        <div class="stat-value">
          <span style="color:${data.batteryColor}; font-size:20px;">${data.batteryIcon}</span>
          <span>${data.battery}% (${data.voltage}V)</span>
        </div>
      </div>
    `;
  }

  _renderSignalStat(data) {
    return `
      <div class="stat-item">
        <div class="stat-label">${this._t("signal")}</div>
        <div class="stat-value">
          <div class="signal-bars">${data.signalBars}</div>
          <span>${data.signal} dBm</span>
        </div>
      </div>
    `;
  }

  _renderSnrStat(data) {
    return `
      <div class="stat-item">
        <div class="stat-label">${this._t("snr")}</div>
        <div class="stat-value"><span style="color:#00ff88;">${data.snr} dB</span></div>
      </div>
    `;
  }

  _renderLastSeenStat(data) {
    return `
      <div class="stat-item">
        <div class="stat-label">${this._t("lastSeen")}</div>
        <div class="stat-value">${data.lastSeen}</div>
      </div>
    `;
  }

  /////////////////////////////////////////////////////////////////////////////
  // DETAILS //////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _renderDetails(data) {
    return `
      <div class="details-section">
        <div class="detail-row">
          <span class="detail-label">${this._t("hardware")}</span>
          <span class="detail-value">${data.hardware}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${this._t("location")}</span>
          <span class="detail-value">${data.location}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">${data.isGateway ? this._t("config") : this._t("counts")}</span>
          <span class="detail-value">
            ${
              data.isGateway
                ? `${data.role} | Hop:${data.hopLimit} | TX:${data.txPower} dBm`
                : `${data.totalMessages} | ↑${data.sentMessages} | ↓${data.receivedMessages}`
            }
          </span>
        </div>
      </div>
    `;
  }

  /////////////////////////////////////////////////////////////////////////////
  // RELATED SENSOR RENDERING /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _renderRelatedSensors(list) {
    if (!list || list.length === 0) return "";

    const items = list
      .map(
        s => `
        <div class="detail-row">
          <span class="detail-label">${s.friendly_name}:</span>
          <span class="detail-value">${s.value} ${s.unit}</span>
        </div>`
      )
      .join("");

    return `
      <div class="details-section">
        <div style="font-weight:600; margin-bottom:4px;">${this._t("relatedSensors")}</div>
        ${items}
      </div>
    `;
  }

  /////////////////////////////////////////////////////////////////////////////
  // ENTITY → DATA EXTRACTION //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _extractEntityData(entity) {
    const attrs = entity.attributes || {};
    const isGateway = attrs.device_class === "gateway";

    ///////////////////////////////////////////////////////////////////////////
    // EXTRACT NODE ID — required to find related sensors
    ///////////////////////////////////////////////////////////////////////////

    let nodeId = null;

    // Match meshtastic.<type>_<nodeid>
    const match = entity.entity_id.match(/(?:meshtastic|gateway|node)[._-](\w+)$/);
    if (match) nodeId = match[1];

    // If still missing — attempt from attributes (common in Meshtastic HA)
    if (!nodeId && attrs.node_id) nodeId = String(attrs.node_id).trim();

    ///////////////////////////////////////////////////////////////////////////
    // FIND RELATED SENSORS
    ///////////////////////////////////////////////////////////////////////////

    const relatedSensors = this._getRelatedSensors(nodeId);

    ///////////////////////////////////////////////////////////////////////////
    // EXTRACT BASIC STATS
    ///////////////////////////////////////////////////////////////////////////

    const nodeName =
      attrs.friendly_name ||
      attrs.long_name ||
      attrs.short_name ||
      this._t("unknownNode");

    const nodeIdLabel =
      attrs.node_id ||
      entity.entity_id.split(".")[1] ||
      entity.state ||
      this._t("unknown");

    const rawBattery = Number(attrs.battery_level ?? 0);
    const battery = isNaN(rawBattery) ? 0 : rawBattery;

    const rawVoltage = Number(attrs.voltage ?? 0);
    const voltage = isNaN(rawVoltage)
      ? "0.0"
      : (rawVoltage.toFixed ? rawVoltage.toFixed(1) : rawVoltage);

    const rawSignal = Number(attrs.snr ?? attrs.rssi ?? 0);
    const signal = isNaN(rawSignal) ? 0 : rawSignal;

    const rawSnr = Number(attrs.snr ?? 0);
    const snr = isNaN(rawSnr)
      ? "0.0"
      : (rawSnr.toFixed ? rawSnr.toFixed(1) : rawSnr);

    const lastSeenRaw = attrs.last_heard || entity.last_changed;
    const lastSeen = this.formatLastSeen(lastSeenRaw);

    const hardware = isGateway
      ? `${attrs.config_lora_region || this._t("unknown")} / ${attrs.config_lora_modemPreset || this._t("unknown")}`
      : attrs.hardware || this._t("unknown");

    const location = isGateway
      ? attrs.config_position_gpsEnabled
        ? this._t("gpsEnabled")
        : this._t("gpsDisabled")
      : attrs.position_precision_bits
      ? this._t("gpsAvailable")
      : attrs.location || this._t("unknown");

    const hopLimit = attrs.config_lora_hopLimit || 0;
    const txPower = attrs.config_lora_txPower || 0;
    const role = attrs.config_device_role || "Unknown";

    const totalMessages = attrs.message_count || 0;
    const sentMessages = attrs.messages_sent || 0;
    const receivedMessages = attrs.messages_received || 0;

    const batteryIcon = this.getBatteryIcon(battery);
    const batteryColor =
      battery > 50 ? "#00ff88" : battery > 20 ? "#ffaa00" : "#ff5555";

    const signalBars = this.getSignalBars(signal);

    return {
      isGateway,
      nodeName,
      nodeId: nodeIdLabel,
      battery,
      voltage,
      signal,
      snr,
      lastSeen,
      hardware,
      location,
      hopLimit,
      txPower,
      role,
      totalMessages,
      sentMessages,
      receivedMessages,
      batteryIcon,
      batteryColor,
      signalBars,

      nodeId,
      relatedSensors,
    };
  }

  /////////////////////////////////////////////////////////////////////////////
  // RELATED SENSOR DISCOVERY /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _getRelatedSensors(nodeId) {
    if (!this._hass || !nodeId) return [];

    const prefix = `sensor.meshtastic_${nodeId}`;

    return Object.entries(this._hass.states)
      .filter(([id]) => id.startsWith(prefix))
      .map(([id, state]) => ({
        id,
        friendly_name: state.attributes.friendly_name || id,
        value: state.state,
        unit: state.attributes.unit_of_measurement || "",
      }));
  }

  /////////////////////////////////////////////////////////////////////////////
  // UTILITIES ////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

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
    if (level > 75) return "🔋";
    if (level > 50) return "🔋";
    if (level > 25) return "🪫";
    return "🪫";
  }

  getSignalBars(signal) {
    const strength = signal > -70 ? 4 : signal > -80 ? 3 : signal > -90 ? 2 : 1;
    let html = "";
    for (let i = 1; i <= 4; i++) {
      const height = i * 4;
      const opacity = i <= strength ? 1 : 0.3;
      html += `<div class="signal-bar" style="height:${height}px; opacity:${opacity};"></div>`;
    }
    return html;
  }

  formatLastSeen(timestamp) {
    if (!timestamp) return this._t("unknown");
    const now = new Date();
    const then = new Date(timestamp);
    if (isNaN(then.getTime())) return this._t("unknown");

    const diffMs = now - then;
    const mins = Math.floor(diffMs / 60000);

    if (mins < 1) return this._t("justNow");
    if (mins < 60) return this._t("minutesAgo", mins);

    const hours = Math.floor(mins / 60);
    if (hours < 24) return this._t("hoursAgo", hours);

    const days = Math.floor(hours / 24);
    return this._t("daysAgo", days);
  }

  getCardSize() {
    return this._config?.compact ? 2 : 4;
  }

  static getConfigElement() {
    return document.createElement("meshtastic-node-card-editor");
  }

  static getStubConfig() {
    return MeshtasticNodeCard.DEFAULT_CONFIG;
  }
}

///////////////////////////////////////////////////////////////////////////////
// DEFINE CARD ////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

customElements.define("meshtastic-node-card", MeshtasticNodeCard);

///////////////////////////////////////////////////////////////////////////////
// EDITOR ////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

class MeshtasticNodeCardEditor extends HTMLElement {
  constructor() {
    super();
    this._config = MeshtasticNodeCard.DEFAULT_CONFIG;
    this._hass = null;

    this.attachShadow({ mode: "open" });

    this._onEntityChanged = this._onEntityChanged.bind(this);
    this._onCheckboxChanged = this._onCheckboxChanged.bind(this);
  }

  setConfig(config) {
    this._config = {
      ...MeshtasticNodeCard.DEFAULT_CONFIG,
      ...config,
      type: "custom:meshtastic-node-card",
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
        .card-config { padding:16px; display:flex; flex-direction:column; gap:16px; }
        .option { display:flex; gap:8px; align-items:center; }
        .option label { flex:1; font-weight:500; }
        .option ha-entity-picker { flex:2; }
        .toggles { display:grid; grid-template-columns:1fr 1fr; gap:8px 16px; }
        .toggle-row { display:flex; gap:8px; align-items:center; font-size:13px; }
      </style>

      <div class="card-config">
        <div class="option">
          <label>Entity</label>
          <ha-entity-picker id="entity" allow-custom-entity></ha-entity-picker>
        </div>

        <div class="toggles">
          <div class="toggle-row">
            <input type="checkbox" id="compact" />
            <label for="compact">Compact layout</label>
          </div>

          <div class="toggle-row">
            <input type="checkbox" id="show_battery" />
            <label for="show_battery">Show battery</label>
          </div>

          <div class="toggle-row">
            <input type="checkbox" id="show_signal" />
            <label for="show_signal">Show signal</label>
          </div>

          <div class="toggle-row">
            <input type="checkbox" id="show_snr" />
            <label for="show_snr">Show SNR</label>
          </div>

          <div class="toggle-row">
            <input type="checkbox" id="show_details" />
            <label for="show_details">Show details</label>
          </div>
        </div>
      </div>
    `;

    // ENTITY PICKER
    const picker = root.getElementById("entity");
    if (picker) {
      picker.hass = this._hass;
      picker.value = this._config.entity;
      picker.includeDomains = ["meshtastic"];
      picker.removeEventListener("value-changed", this._onEntityChanged);
      picker.addEventListener("value-changed", this._onEntityChanged);
    }

    // CHECKBOXES
    const flags = ["compact", "show_battery", "show_signal", "show_snr", "show_details"];
    for (const id of flags) {
      const el = root.getElementById(id);
      if (!el) continue;
      el.checked = !!this._config[id];
      el.removeEventListener("change", this._onCheckboxChanged);
      el.addEventListener("change", this._onCheckboxChanged);
    }
  }

  _updateConfig(patch) {
    const newConfig = {
      ...this._config,
      ...patch,
      type: "custom:meshtastic-node-card",
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

  _onEntityChanged(ev) {
    const value = ev.target.value;
    if (value === this._config.entity) return;
    this._updateConfig({ entity: value });
  }

  _onCheckboxChanged(ev) {
    const id = ev.target.id;
    const checked = ev.target.checked;
    this._updateConfig({ [id]: checked });
  }
}

///////////////////////////////////////////////////////////////////////////////
// REGISTER EDITOR ///////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

customElements.define("meshtastic-node-card-editor", MeshtasticNodeCardEditor);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "meshtastic-node-card",
  name: "Meshtastic Node Card",
  description: "Enhanced Meshtastic node card with auto sensor discovery.",
  preview: true,
});

console.info(
  "%c MESHTASTIC NODE CARD %c Loaded v2.2.0",
  "color:white; background:#3b82f6; font-weight:bold;",
  "color:#3b82f6; background:white; font-weight:bold;"
);
