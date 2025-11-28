/** 
 * Meshtastic Node Card
 * v2.3.0 — All features
 *
 * - Auto-detects related Meshtastic sensors: sensor.meshtastic_<nodeId>_*
 * - Collapsible "Related Sensors"
 * - Mini-graph using hui-graph-card
 * - Theme presets: auto / dark / neon / radio
 * - Tap sensor row → more-info
 * - Mesh path and packet stats (if attributes present)
 * - Localization (EN / UK)
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
    meshPath: "Mesh Path",
    packetStats: "Packet Stats",
    txPackets: "TX:",
    rxPackets: "RX:",
    packetLoss: "Loss:",
    retransmissions: "Retrans:",
    show: "Show",
    hide: "Hide",
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
    meshPath: "Маршрут Mesh",
    packetStats: "Статистика пакетів",
    txPackets: "TX:",
    rxPackets: "RX:",
    packetLoss: "Втрати:",
    retransmissions: "Повтори:",
    show: "Показати",
    hide: "Сховати",
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
    this._relatedCollapsed = false;
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
      // new options
      theme: "auto", // auto | dark | neon | radio
      show_related_sensors: true,
      related_sensors_collapsible: true,
      related_sensors_initially_collapsed: false,
      related_sensors_limit: 8,
      show_mini_graph: false,
      mini_graph_sensor: null,
      show_mesh_path: true,
      show_packet_stats: true,
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

    this._relatedCollapsed = !!this._config.related_sensors_initially_collapsed;

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
    this._setupDynamicParts(data);
  }

  /////////////////////////////////////////////////////////////////////////////
  // PLACEHOLDER / ERROR //////////////////////////////////////////////////////
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

  _renderError(text) {
    return `<div style="padding:16px; color:var(--error-color);">${text}</div>`;
  }

  /////////////////////////////////////////////////////////////////////////////
  // CARD RENDER //////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _renderCard(data) {
    const cfg = this._config;
    const layout = cfg.compact ? "compact" : "full";

    // Theme presets
    const theme = cfg.theme || "auto";
    let cardBackground = "transparent";
    let avatarGradient = "linear-gradient(135deg,var(--primary-color),var(--accent-color))";
    let cardBorder = "1px solid var(--divider-color)";

    if (theme === "dark") {
      cardBackground = "rgba(0,0,0,0.4)";
      avatarGradient = "linear-gradient(135deg,#1e293b,#0f172a)";
      cardBorder = "1px solid rgba(148,163,184,0.4)";
    } else if (theme === "neon") {
      cardBackground = "radial-gradient(circle at top left,#22c55e20,#0ea5e920)";
      avatarGradient = "linear-gradient(135deg,#22c55e,#0ea5e9)";
      cardBorder = "1px solid rgba(34,197,94,0.4)";
    } else if (theme === "radio") {
      cardBackground = "radial-gradient(circle at center,#4b556320,#111827ff)";
      avatarGradient = "linear-gradient(135deg,#f97316,#22c55e)";
      cardBorder = "1px solid rgba(249,115,22,0.6)";
    }

    const styles = `
      <style>
        .meshtastic-card {
          display:flex;
          flex-direction:column;
          gap:16px;
          background:${cardBackground};
          border-radius:12px;
          border:${cardBorder};
          padding:8px;
        }
        .node-header {
          display:flex;
          align-items:center;
          gap:12px;
          padding:8px;
          padding-bottom:${layout === "full" ? "16px" : "8px"};
          border-bottom:1px solid var(--divider-color);
        }
        .node-avatar {
          width:${layout === "full" ? "48px" : "40px"};
          height:${layout === "full" ? "48px" : "40px"};
          background:${avatarGradient};
          border-radius:12px;
          display:flex; align-items:center; justify-content:center;
          font-weight:bold; color:var(--text-primary-color);
          font-size:${layout === "full" ? "20px" : "16px"};
        }
        .node-title { font-weight:600; font-size:${layout === "full" ? "18px" : "16px"}; }
        .node-subtitle { font-size:12px; color:var(--secondary-text-color); }
        .stats-grid-full { display:grid; grid-template-columns:1fr 1fr; gap:16px; padding:8px; }
        .stats-row-compact { display:flex; flex-wrap:wrap; gap:12px; align-items:center; padding:8px; }
        .stat-item { display:flex; flex-direction:column; }
        .stat-label { font-size:11px; color:var(--secondary-text-color); text-transform:uppercase; }
        .stat-value { font-weight:600; display:flex; gap:6px; align-items:center; }
        .signal-bars { display:flex; gap:2px; align-items:flex-end; }
        .signal-bar { width:3px; background:var(--primary-color); border-radius:2px; }
        .details-section { border-top:1px solid var(--divider-color); padding:8px 8px 0 8px; display:flex; flex-direction:column; gap:6px; font-size:13px; }
        .detail-row { display:flex; gap:8px; }
        .detail-label { color:var(--secondary-text-color); min-width:60px; }
        .detail-value { font-weight:500; }
        .mini-graph-section { padding:8px; border-top:1px solid var(--divider-color); }
        .mini-graph-title { font-size:13px; font-weight:600; margin-bottom:4px; }
        .related-header {
          display:flex;
          justify-content:space-between;
          align-items:center;
          cursor:pointer;
          user-select:none;
        }
        .related-toggle {
          font-size:11px;
          color:var(--secondary-text-color);
        }
        .related-container.collapsed .related-body {
          display:none;
        }
        .sensor-row {
          cursor:pointer;
        }
        .sensor-row:hover {
          background:rgba(148,163,184,0.15);
          border-radius:6px;
          padding:2px 4px;
          margin:0 -4px;
        }
      </style>
    `;

    const miniGraph = cfg.show_mini_graph
      ? `<div class="mini-graph-section">
           <div class="mini-graph-title">History</div>
           <div id="mini-graph-container"></div>
         </div>`
      : "";

    return `
      ${styles}
      <div class="meshtastic-card">
        ${this._renderHeader(data)}
        ${this._renderStats(data, layout, cfg)}
        ${cfg.show_details ? this._renderDetails(data) : ""}
        ${cfg.show_mesh_path ? this._renderMeshPath(data) : ""}
        ${cfg.show_packet_stats ? this._renderPacketStats(data) : ""}
        ${miniGraph}
        ${cfg.show_related_sensors ? this._renderRelatedSensors(data.relatedSensors) : ""}
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
        <div class="stat-value"><span style="color:#22c55e;">${data.snr} dB</span></div>
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
  // DETAILS / MESH / PACKETS ////////////////////////////////////////////////
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

  _renderMeshPath(data) {
    if (!data.meshPath && !data.hopCount) return "";
    const label = this._t("meshPath");
    let pathText = data.meshPath || "";
    if (Array.isArray(pathText)) {
      pathText = pathText.join(" → ");
    } else if (typeof pathText === "string" && pathText.includes(",")) {
      pathText = pathText.split(",").map(p => p.trim()).join(" → ");
    }

    const hopInfo = data.hopCount != null ? ` (${data.hopCount} hops)` : "";
    if (!pathText && hopInfo) pathText = hopInfo;

    return `
      <div class="details-section">
        <div class="detail-row">
          <span class="detail-label">${label}</span>
          <span class="detail-value">${pathText}${hopInfo && pathText ? hopInfo : ""}</span>
        </div>
      </div>
    `;
  }

  _renderPacketStats(data) {
    if (
      data.txPackets == null &&
      data.rxPackets == null &&
      data.packetLoss == null &&
      data.retransmissions == null
    ) {
      return "";
    }

    const pieces = [];
    if (data.txPackets != null) {
      pieces.push(`${this._t("txPackets")} ${data.txPackets}`);
    }
    if (data.rxPackets != null) {
      pieces.push(`${this._t("rxPackets")} ${data.rxPackets}`);
    }
    if (data.packetLoss != null) {
      pieces.push(`${this._t("packetLoss")} ${data.packetLoss}%`);
    }
    if (data.retransmissions != null) {
      pieces.push(`${this._t("retransmissions")} ${data.retransmissions}`);
    }

    return `
      <div class="details-section">
        <div class="detail-row">
          <span class="detail-label">${this._t("packetStats")}</span>
          <span class="detail-value">${pieces.join(" | ")}</span>
        </div>
      </div>
    `;
  }

  /////////////////////////////////////////////////////////////////////////////
  // RELATED SENSOR RENDERING /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _renderRelatedSensors(list) {
    if (!list || list.length === 0) return "";

    const collapsedClass = this._relatedCollapsed ? "collapsed" : "";
    const toggleLabel = this._relatedCollapsed ? this._t("show") : this._t("hide");

    const items = list
      .map(
        s => `
        <div class="detail-row sensor-row" data-entity-id="${s.id}">
          <span class="detail-label">${s.friendly_name}:</span>
          <span class="detail-value">${s.value} ${s.unit}</span>
        </div>`
      )
      .join("");

    return `
      <div class="details-section related-container ${collapsedClass}" data-related-container>
        <div class="detail-row related-header" data-related-toggle>
          <span class="detail-label">${this._t("relatedSensors")}</span>
          <span class="related-toggle">${toggleLabel} (${list.length})</span>
        </div>
        <div class="related-body">
          ${items}
        </div>
      </div>
    `;
  }

  /////////////////////////////////////////////////////////////////////////////
  // ENTITY → DATA EXTRACTION //////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _extractEntityData(entity) {
    const attrs = entity.attributes || {};
    const isGateway = attrs.device_class === "gateway";

    // NodeId for sensors
    let nodeId = null;
    const match = entity.entity_id.match(/(?:meshtastic|gateway|node)[._-](\w+)$/);
    if (match) nodeId = match[1];
    if (!nodeId && attrs.node_id) nodeId = String(attrs.node_id).trim();

    const relatedSensors = this._getRelatedSensors(nodeId);

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
      ? `${attrs.config_lora_region || this._t("unknown")} / ${
          attrs.config_lora_modemPreset || this._t("unknown")
        }`
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
      battery > 50 ? "#22c55e" : battery > 20 ? "#f97316" : "#ef4444";

    const signalBars = this.getSignalBars(signal);

    // Mesh path / hops if present
    const meshPath =
      attrs.mesh_path ||
      attrs.route ||
      attrs.route_text ||
      attrs.mesh_route ||
      null;

    const hopCount =
      attrs.hop_count ||
      attrs.hops ||
      attrs.mesh_hops ||
      attrs.route_hops ||
      null;

    // Packet stats if present
    const txPackets =
      attrs.tx_packets ??
      attrs.packets_tx ??
      attrs.packet_tx ??
      null;

    const rxPackets =
      attrs.rx_packets ??
      attrs.packets_rx ??
      attrs.packet_rx ??
      null;

    const packetLoss =
      attrs.packet_loss ??
      attrs.packet_loss_percentage ??
      null;

    const retransmissions =
      attrs.retransmissions ??
      attrs.retransmit_count ??
      null;

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

      meshPath,
      hopCount,

      txPackets,
      rxPackets,
      packetLoss,
      retransmissions,
    };
  }

  /////////////////////////////////////////////////////////////////////////////
  // RELATED SENSOR DISCOVERY /////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _getRelatedSensors(nodeId) {
    if (!this._hass || !nodeId) return [];

    const prefix = `sensor.meshtastic_${nodeId}`;
    const limit = this._config?.related_sensors_limit || 8;

    return Object.entries(this._hass.states)
      .filter(([id]) => id.startsWith(prefix))
      .map(([id, state]) => ({
        id,
        friendly_name: state.attributes.friendly_name || id,
        value: state.state,
        unit: state.attributes.unit_of_measurement || "",
      }))
      .sort((a, b) => a.friendly_name.localeCompare(b.friendly_name))
      .slice(0, limit);
  }

  /////////////////////////////////////////////////////////////////////////////
  // DYNAMIC PARTS (EVENTS, GRAPH, COLLAPSE, MORE-INFO) //////////////////////
  /////////////////////////////////////////////////////////////////////////////

  _setupDynamicParts(data) {
    const root = this._content;
    if (!root) return;

    // Related sensors collapse toggle
    const container = root.querySelector("[data-related-container]");
    if (container && this._config.related_sensors_collapsible) {
      const toggle = container.querySelector("[data-related-toggle]");
      if (toggle) {
        toggle.addEventListener("click", () => {
          this._relatedCollapsed = !this._relatedCollapsed;
          container.classList.toggle("collapsed", this._relatedCollapsed);
          const labelEl = toggle.querySelector(".related-toggle");
          if (labelEl) {
            const list = data.relatedSensors || [];
            labelEl.textContent = `${this._relatedCollapsed ? this._t("show") : this._t("hide")} (${list.length})`;
          }
        });
      }
      container.classList.toggle("collapsed", this._relatedCollapsed);
    }

    // Tap sensor rows → more-info
    const sensorRows = root.querySelectorAll(".sensor-row[data-entity-id]");
    sensorRows.forEach(row => {
      row.addEventListener("click", () => {
        const entityId = row.getAttribute("data-entity-id");
        if (!entityId) return;
        this.dispatchEvent(
          new CustomEvent("hass-more-info", {
            detail: { entityId },
            bubbles: true,
            composed: true,
          })
        );
      });
    });

    // Mini-graph
    if (this._config.show_mini_graph) {
      const graphContainer = root.querySelector("#mini-graph-container");
      if (graphContainer) {
        this._buildMiniGraph(graphContainer, data);
      }
    }
  }

  _buildMiniGraph(container, data) {
    const cfg = this._config;
    let entityId = cfg.mini_graph_sensor;

    if (!entityId) {
      const numericSensor =
        (data.relatedSensors || []).find(s => !isNaN(parseFloat(s.value))) ||
        null;
      entityId = numericSensor?.id || cfg.entity;
    }

    if (!entityId) {
      container.textContent = "No entity for graph";
      return;
    }

    if (!window.loadCardHelpers) {
      container.textContent = "Graph helpers unavailable";
      return;
    }

    window.loadCardHelpers().then(helpers => {
      const card = helpers.createCardElement({
        type: "graph",
        entities: [entityId],
        hours_to_show: 24,
        line_width: 2,
        detail: 1,
      });
      card.hass = this._hass;
      container.innerHTML = "";
      container.appendChild(card);
    }).catch(() => {
      container.textContent = "Unable to load graph";
    });
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
    this._onSelectChanged = this._onSelectChanged.bind(this);
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
        .select-row { display:flex; gap:8px; align-items:center; font-size:13px; }
        .select-row label { flex:1; font-weight:500; }
        .select-row select { flex:1; }
      </style>

      <div class="card-config">
        <div class="option">
          <label>Entity</label>
          <ha-entity-picker id="entity" allow-custom-entity></ha-entity-picker>
        </div>

        <div class="select-row">
          <label for="theme">Theme</label>
          <select id="theme">
            <option value="auto">Auto</option>
            <option value="dark">Dark</option>
            <option value="neon">Neon</option>
            <option value="radio">Radio</option>
          </select>
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

          <div class="toggle-row">
            <input type="checkbox" id="show_related_sensors" />
            <label for="show_related_sensors">Show related sensors</label>
          </div>

          <div class="toggle-row">
            <input type="checkbox" id="related_sensors_collapsible" />
            <label for="related_sensors_collapsible">Collapsible sensors</label>
          </div>

          <div class="toggle-row">
            <input type="checkbox" id="show_mini_graph" />
            <label for="show_mini_graph">Show mini graph</label>
          </div>

          <div class="toggle-row">
            <input type="checkbox" id="show_mesh_path" />
            <label for="show_mesh_path">Show mesh path</label>
          </div>

          <div class="toggle-row">
            <input type="checkbox" id="show_packet_stats" />
            <label for="show_packet_stats">Show packet stats</label>
          </div>
        </div>
      </div>
    `;

    // Entity picker
    const picker = root.getElementById("entity");
    if (picker) {
      picker.hass = this._hass;
      picker.value = this._config.entity;
      picker.includeDomains = ["meshtastic"];
      picker.removeEventListener("value-changed", this._onEntityChanged);
      picker.addEventListener("value-changed", this._onEntityChanged);
    }

    // Theme select
    const themeSelect = root.getElementById("theme");
    if (themeSelect) {
      themeSelect.value = this._config.theme || "auto";
      themeSelect.removeEventListener("change", this._onSelectChanged);
      themeSelect.addEventListener("change", this._onSelectChanged);
    }

    // Checkboxes
    const flags = [
      "compact",
      "show_battery",
      "show_signal",
      "show_snr",
      "show_details",
      "show_related_sensors",
      "related_sensors_collapsible",
      "show_mini_graph",
      "show_mesh_path",
      "show_packet_stats",
    ];
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

  _onSelectChanged(ev) {
    const id = ev.target.id;
    const value = ev.target.value;
    this._updateConfig({ [id]: value });
  }
}

customElements.define("meshtastic-node-card-editor", MeshtasticNodeCardEditor);

///////////////////////////////////////////////////////////////////////////////
// REGISTER CARD /////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

window.customCards = window.customCards || [];
window.customCards.push({
  type: "meshtastic-node-card",
  name: "Meshtastic Node Card",
  description: "Enhanced Meshtastic node card with auto sensor discovery, themes, and mini-graph.",
  preview: true,
});

console.info(
  "%c MESHTASTIC NODE CARD %c Loaded v2.3.0",
  "color:white; background:#3b82f6; font-weight:bold;",
  "color:#3b82f6; background:white; font-weight:bold;"
);
