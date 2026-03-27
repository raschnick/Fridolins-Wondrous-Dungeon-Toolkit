(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTAppLogic = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const DICE_POOL_ORDER = [4, 6, 8, 10, 12, 20, 100];
  const MAX_DICE_POOL_COUNT = 20;

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizePathname(pathname) {
    if (!pathname) return "/";
    const cleaned = `${pathname}`.replace(/\/+$/, "");
    return cleaned === "" ? "/" : cleaned;
  }

  function parseRoute(pathname) {
    const path = normalizePathname(pathname);
    if (path === "/login") return { page: "login" };
    if (path === "/settings") return { page: "settings" };
    if (path === "/shop") return { page: "dice-shop" };
    if (path === "/player" || path === "/player/initiative") {
      return { page: "player-home", playerMode: "initiative" };
    }
    if (path === "/player/map") return { page: "player-home", playerMode: "map" };
    if (path === "/player/scene") return { page: "player-home", playerMode: "scene" };
    if (path === "/") return { page: "welcome" };
    if (path === "/library" || path === "/monsters") return { page: "monsters" };
    if (path === "/admin") return { page: "admin" };
    if (path === "/analytics") return { page: "analytics" };

    let match = path.match(/^\/campaigns\/(\d+)$/);
    if (match) {
      return { page: "campaign", campaignId: Number(match[1]) };
    }

    match = path.match(/^\/campaigns\/(\d+)\/completed$/);
    if (match) {
      return { page: "campaign-completed", campaignId: Number(match[1]) };
    }

    match = path.match(/^\/campaigns\/(\d+)\/scene$/);
    if (match) {
      return { page: "campaign-scene", campaignId: Number(match[1]) };
    }

    match = path.match(/^\/campaigns\/(\d+)\/scenarios\/(\d+)\/(edit|initiative|map|run)$/);
    if (match) {
      const mode = match[3];
      return {
        page:
          mode === "initiative" || mode === "run"
            ? "scenario-run"
            : mode === "map"
              ? "scenario-map"
              : "scenario-edit",
        campaignId: Number(match[1]),
        scenarioId: Number(match[2])
      };
    }

    match = path.match(/^\/campaigns\/(\d+)\/scenarios\/(\d+)\/completed\/edit$/);
    if (match) {
      return {
        page: "scenario-completed-edit",
        campaignId: Number(match[1]),
        scenarioId: Number(match[2])
      };
    }

    return null;
  }

  function routePathFor(page, campaignId = null, scenarioId = null, playerMode = null) {
    if (page === "login") return "/login";
    if (page === "player-home") {
      if (playerMode === "map") return "/player/map";
      if (playerMode === "scene") return "/player/scene";
      return "/player/initiative";
    }
    if (page === "settings") return "/settings";
    if (page === "dice-shop") return "/shop";
    if (page === "welcome") return "/";
    if (page === "monsters") return "/library";
    if (page === "admin") return "/admin";
    if (page === "analytics") return "/analytics";
    if (page === "campaign" && Number.isInteger(campaignId)) {
      return `/campaigns/${campaignId}`;
    }
    if (page === "campaign-completed" && Number.isInteger(campaignId)) {
      return `/campaigns/${campaignId}/completed`;
    }
    if (page === "campaign-scene" && Number.isInteger(campaignId)) {
      return `/campaigns/${campaignId}/scene`;
    }
    if (
      (
        page === "scenario-edit" ||
        page === "scenario-run" ||
        page === "scenario-map" ||
        page === "scenario-completed-edit"
      ) &&
      Number.isInteger(campaignId) &&
      Number.isInteger(scenarioId)
    ) {
      if (page === "scenario-completed-edit") {
        return `/campaigns/${campaignId}/scenarios/${scenarioId}/completed/edit`;
      }
      const mode = page === "scenario-run" ? "initiative" : page === "scenario-map" ? "map" : "edit";
      return `/campaigns/${campaignId}/scenarios/${scenarioId}/${mode}`;
    }
    return "/";
  }

  function getDicePoolSegments(pool = {}) {
    return DICE_POOL_ORDER.map((sides) => {
      const count = Number(pool?.[sides]) || 0;
      return { sides, count: Math.max(0, count) };
    }).filter((segment) => segment.count > 0);
  }

  function getDicePoolTotalCount(pool = {}) {
    return getDicePoolSegments(pool).reduce((sum, segment) => sum + segment.count, 0);
  }

  function buildDicePoolNotation(pool = {}) {
    return getDicePoolSegments(pool)
      .map((segment) => `${segment.count}d${segment.sides}`)
      .join("+");
  }

  function formatDiceNotation(notation) {
    return `${notation || ""}`.replace(/\+/g, " + ");
  }

  function buildDiceEntry({ pool = {}, rolls = [], total = 0 }) {
    const notation = buildDicePoolNotation(pool);
    const expression = formatDiceNotation(notation);
    const segments = getDicePoolSegments(pool);
    let rollIndex = 0;
    const groupedBreakdown = segments.map((segment) => {
      const segmentRolls = rolls.slice(rollIndex, rollIndex + segment.count);
      rollIndex += segment.count;
      return `${segment.count}d${segment.sides}: ${segmentRolls.join(", ")}`;
    });
    return {
      expression,
      total,
      breakdown: `${groupedBreakdown.join(" | ")} = ${total}`,
      summary: `${expression}: ${total}`
    };
  }

  function addDieToPoolState(pool = {}, sides, maxCount = MAX_DICE_POOL_COUNT) {
    const normalizedSides = Number(sides);
    if (!Number.isInteger(normalizedSides) || normalizedSides < 2) {
      return { pool: { ...pool }, added: false, reason: "invalid" };
    }
    const totalDice = getDicePoolTotalCount(pool);
    if (totalDice >= maxCount) {
      return { pool: { ...pool }, added: false, reason: "limit" };
    }
    return {
      pool: {
        ...pool,
        [normalizedSides]: (Number(pool?.[normalizedSides]) || 0) + 1
      },
      added: true,
      reason: null
    };
  }

  function resetDicePoolState() {
    return {};
  }

  function buildDiceSkinConfigByKey(diceSkinOptions) {
    return Object.fromEntries((diceSkinOptions || []).map((skin) => [skin.key, skin]));
  }

  function getDiceSkinKey(value, diceSkinConfigByKey = {}) {
    return diceSkinConfigByKey?.[value] ? value : "default";
  }

  function resolveCurrentDiceSkinConfig({
    userSettingsUser = null,
    authUser = null,
    diceSkinOptions = [],
    diceSkinConfigByKey = null
  }) {
    const configByKey =
      diceSkinConfigByKey || buildDiceSkinConfigByKey(diceSkinOptions);
    const fallbackSkin = diceSkinOptions[0] || {
      key: "default",
      label: "Default",
      previewImageUrl: "/images/crimson_preview.png"
    };
    const storedSkin = userSettingsUser?.diceSkin || authUser?.diceSkin || fallbackSkin.key;
    return configByKey[getDiceSkinKey(storedSkin, configByKey)] || fallbackSkin;
  }

  function buildDiceSkinPreviewModel(args) {
    const skin = resolveCurrentDiceSkinConfig(args);
    return {
      key: skin.key,
      label: skin.label,
      previewImageUrl: skin.previewImageUrl || "/images/crimson_preview.png",
      alt: `${skin.label} dice preview`
    };
  }

  function scenarioMapTokenSizeValue(scenario) {
    const raw = Number(scenario?.map_token_size);
    if (!Number.isFinite(raw)) return 44;
    return clamp(Math.round(raw), 24, 128);
  }

  function deriveRunMapSyncSnapshot(currentScenario, snapshot) {
    const scenarioId = Number(snapshot?.scenarioId ?? snapshot?.id);
    if (!Number.isInteger(scenarioId) || !currentScenario) return null;
    const nextMapTokensJson = `${snapshot?.mapTokensJson ?? snapshot?.map_tokens_json ?? ""}`;
    const nextTokenSizeRaw = Number(snapshot?.mapTokenSize ?? snapshot?.map_token_size);
    const nextMapFogRaw =
      snapshot?.mapFogData ??
      snapshot?.map_fog_data ??
      currentScenario.map_fog_data ??
      "";
    const nextMapFogData = `${nextMapFogRaw || ""}`;
    const nextMapLastPingJson = `${
      snapshot?.mapLastPingJson ??
      snapshot?.map_last_ping_json ??
      currentScenario.map_last_ping_json ??
      ""
    }`;
    const nextTokenSize = Number.isFinite(nextTokenSizeRaw)
      ? clamp(Math.round(nextTokenSizeRaw), 24, 128)
      : scenarioMapTokenSizeValue(currentScenario);
    const tokensChanged = `${currentScenario.map_tokens_json || ""}` !== nextMapTokensJson;
    const tokenSizeChanged = scenarioMapTokenSizeValue(currentScenario) !== nextTokenSize;
    const fogChanged = `${currentScenario.map_fog_data || ""}` !== nextMapFogData;
    const pingChanged = `${currentScenario.map_last_ping_json || ""}` !== nextMapLastPingJson;

    return {
      scenarioId,
      nextMapTokensJson,
      nextTokenSize,
      nextMapFogData,
      nextMapLastPingJson,
      tokensChanged,
      tokenSizeChanged,
      fogChanged,
      pingChanged,
      changed: tokensChanged || tokenSizeChanged || fogChanged || pingChanged
    };
  }

  function fogAlphaToPlayerVisibilityAlpha(fogAlpha, hiddenThreshold = 24) {
    const normalized = clamp(Math.round(Number(fogAlpha) || 0), 0, 255);
    return normalized >= hiddenThreshold ? 0 : 255;
  }

  return {
    DICE_POOL_ORDER,
    MAX_DICE_POOL_COUNT,
    clamp,
    normalizePathname,
    parseRoute,
    routePathFor,
    getDicePoolSegments,
    getDicePoolTotalCount,
    buildDicePoolNotation,
    formatDiceNotation,
    buildDiceEntry,
    addDieToPoolState,
    resetDicePoolState,
    getDiceSkinKey,
    resolveCurrentDiceSkinConfig,
    buildDiceSkinPreviewModel,
    deriveRunMapSyncSnapshot,
    fogAlphaToPlayerVisibilityAlpha
  };
});
