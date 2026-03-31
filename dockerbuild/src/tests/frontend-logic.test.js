const test = require("node:test");
const assert = require("node:assert/strict");

const {
  addDieToPoolState,
  buildDiceEntry,
  buildDicePoolNotation,
  buildDiceSkinPreviewModel,
  deriveRunMapSyncSnapshot,
  fogAlphaToPlayerVisibilityAlpha,
  getDicePoolSegments,
  getDicePoolTotalCount,
  parseRoute,
  resetDicePoolState,
  routePathFor
} = require("../public/js/core/app-logic.js");
const { createApiClient } = require("../public/js/controllers/api-client.js");
const { createCombatUiController } = require("../public/js/controllers/combat-ui-controller.js");
const { createRoutingController } = require("../public/js/controllers/routing-controller.js");
const { createLibraryPageController } = require("../public/js/pages/library-page.js");
const { createCampaignPageController } = require("../public/js/pages/campaign-page.js");
const { createScenarioEditPageController } = require("../public/js/pages/scenario-edit-page.js");
const { createPlayerLivePageController } = require("../public/js/pages/player-live-page.js");
const { createScenarioRunPageController } = require("../public/js/pages/scenario-run-page.js");
const { createCampaignMapPageController } = require("../public/js/pages/campaign-map-page.js");

const DICE_SKIN_OPTIONS = [
  {
    key: "default",
    label: "Crimson Default",
    previewImageUrl: "/images/crimson_preview.png"
  },
  {
    key: "emerald",
    label: "Emerald Excess",
    previewImageUrl: "/images/emerald_preview.png"
  },
  {
    key: "obsidian",
    label: "Obsidian Cataclysm",
    previewImageUrl: "/images/obsidian_preview.png"
  }
];

function createScenarioRunShortcutHarness(overrides = {}) {
  const calls = [];
  const state = {
    page: "scenario-map",
    authUser: { role: "admin" },
    selectedCampaignId: 7,
    selectedScenarioId: 11,
    runMap: { fogMode: "navigate", pingMode: false, hoverCombatantId: null },
    playerMap: { hoverCombatantId: null },
    combat: { combatants: [], activeCombatantId: null },
    ...overrides.state
  };
  const selectedScenarioValue =
    overrides.selectedScenario || { id: state.selectedScenarioId, is_completed: 0 };

  const controller = createScenarioRunPageController({
    state,
    els: {
      nextTurnBtn: { disabled: false },
      revokeTurnBtn: { disabled: false },
      runOrderList: null,
      playerLiveCombatantList: null,
      ...overrides.els
    },
    api: overrides.api || (async () => ({})),
    setStatus: overrides.setStatus || ((message) => calls.push(["status", message])),
    selectedScenario: overrides.selectedScenarioFn || (() => selectedScenarioValue),
    isAllyCombatant: overrides.isAllyCombatant || (() => false),
    scenarioMapTokenSize: overrides.scenarioMapTokenSize || (() => 44),
    hydrateRunMapTokensFromScenario: overrides.hydrateRunMapTokensFromScenario || (() => {}),
    startRunMapSyncPolling: overrides.startRunMapSyncPolling || (() => {}),
    stopRunMapSyncPolling: overrides.stopRunMapSyncPolling || (() => {}),
    setRunMapTokenSizeUI: overrides.setRunMapTokenSizeUI || (() => {}),
    setRunMapDragLockUi: overrides.setRunMapDragLockUi || (() => {}),
    ensureRunMapFogCanvasFromScenario: overrides.ensureRunMapFogCanvasFromScenario || (() => {}),
    resetRunMapViewForScenario: overrides.resetRunMapViewForScenario || (() => {}),
    maybeShowRunMapPing: overrides.maybeShowRunMapPing || (() => {}),
    applyRunMapTransform: overrides.applyRunMapTransform || (() => {}),
    hideRunMapFogCursorPreview: overrides.hideRunMapFogCursorPreview || (() => {}),
    clearRunMapFogCanvas: overrides.clearRunMapFogCanvas || (() => {}),
    navigateToPage: overrides.navigateToPage || (async (...args) => {
      calls.push(["navigate", ...args]);
    }),
    createCombatantNameElement: overrides.createCombatantNameElement || (() => null),
    hasRevealMoment: overrides.hasRevealMoment || (() => false),
    createPlayerVisibilityToggle: overrides.createPlayerVisibilityToggle || (() => null),
    createConditionSelect: overrides.createConditionSelect || (() => null),
    setupRunQuickEditInput: overrides.setupRunQuickEditInput || (() => {}),
    attachInitiativeBlurUpdate: overrides.attachInitiativeBlurUpdate || (() => {}),
    attachEnemyHpBlurUpdate: overrides.attachEnemyHpBlurUpdate || (() => {}),
    applyConditionStyle: overrides.applyConditionStyle || (() => {}),
    safeLoadCombatState: overrides.safeLoadCombatState || (async () => {}),
    getScenarioTokenPositions: overrides.getScenarioTokenPositions || (() => ({})),
    mapNaturalSize: overrides.mapNaturalSize || (() => ({ width: 1000, height: 1000 })),
    ensureMapTokensForCombatants: overrides.ensureMapTokensForCombatants || (() => {}),
    fadeOutAndRemoveToken: overrides.fadeOutAndRemoveToken || (() => {}),
    clamp: overrides.clamp || ((value) => value),
    combatantTokenSizeScale: overrides.combatantTokenSizeScale || (() => 1),
    isSameCombatantId: overrides.isSameCombatantId || ((left, right) => left === right),
    combatantUsesPortraitToken: overrides.combatantUsesPortraitToken || (() => false),
    combatantIconFallbackSrc: overrides.combatantIconFallbackSrc || (() => ""),
    combatantTokenIconSrc: overrides.combatantTokenIconSrc || (() => ""),
    hideMapStatblockHover: overrides.hideMapStatblockHover || (() => calls.push(["hideHover"])),
    showMapStatblockHover: overrides.showMapStatblockHover || (() => {}),
    openImageModal: overrides.openImageModal || (() => {}),
    maybeCelebrateEncounterWin: overrides.maybeCelebrateEncounterWin || (() => {}),
    setRunMapFogMode: overrides.setRunMapFogMode || ((mode) => calls.push(["fog", mode])),
    setRunMapPingModeUi: overrides.setRunMapPingModeUi || ((enabled) => calls.push(["ping", enabled])),
    windowRef: overrides.windowRef || { confirm: () => true, requestAnimationFrame: () => {} }
  });

  return { controller, calls, state };
}

test("run map sync snapshot does not flag fog changes when only token positions update", () => {
  const current = {
    id: 42,
    map_tokens_json: '{"1":{"x":120,"y":140}}',
    map_token_size: 44,
    map_fog_data: "fog-data-a",
    map_last_ping_json: ""
  };

  const snapshot = {
    scenarioId: 42,
    mapTokensJson: '{"1":{"x":180,"y":140}}'
  };

  const next = deriveRunMapSyncSnapshot(current, snapshot);
  assert.ok(next);
  assert.equal(next.scenarioId, 42);
  assert.equal(next.tokensChanged, true);
  assert.equal(next.tokenSizeChanged, false);
  assert.equal(next.fogChanged, false);
  assert.equal(next.pingChanged, false);
  assert.equal(next.nextMapFogData, "fog-data-a");
  assert.equal(next.changed, true);
});

test("player fog mask normalizes fog alpha into a binary visibility mask", () => {
  assert.equal(fogAlphaToPlayerVisibilityAlpha(0), 255);
  assert.equal(fogAlphaToPlayerVisibilityAlpha(12), 255);
  assert.equal(fogAlphaToPlayerVisibilityAlpha(24), 0);
  assert.equal(fogAlphaToPlayerVisibilityAlpha(128), 0);
  assert.equal(fogAlphaToPlayerVisibilityAlpha(255), 0);
});

test("dice pool helpers support mixed dice notation and reset cleanly", () => {
  let pool = resetDicePoolState();

  pool = addDieToPoolState(pool, 6).pool;
  pool = addDieToPoolState(pool, 4).pool;
  pool = addDieToPoolState(pool, 6).pool;
  pool = addDieToPoolState(pool, 20).pool;

  assert.deepEqual(getDicePoolSegments(pool), [
    { sides: 4, count: 1 },
    { sides: 6, count: 2 },
    { sides: 20, count: 1 }
  ]);
  assert.equal(getDicePoolTotalCount(pool), 4);
  assert.equal(buildDicePoolNotation(pool), "1d4+2d6+1d20");

  const entry = buildDiceEntry({
    pool,
    rolls: [3, 5, 6, 17],
    total: 31
  });
  assert.equal(entry.expression, "1d4 + 2d6 + 1d20");
  assert.equal(entry.breakdown, "1d4: 3 | 2d6: 5, 6 | 1d20: 17 = 31");
  assert.equal(entry.summary, "1d4 + 2d6 + 1d20: 31");

  assert.deepEqual(resetDicePoolState(), {});
});

test("dice pool rejects additions after the max dice limit", () => {
  let pool = {};
  for (let i = 0; i < 20; i += 1) {
    pool = addDieToPoolState(pool, 4).pool;
  }
  const result = addDieToPoolState(pool, 6);
  assert.equal(result.added, false);
  assert.equal(result.reason, "limit");
  assert.deepEqual(result.pool, pool);
});

test("settings dice preview resolves the currently equipped skin image", () => {
  const preview = buildDiceSkinPreviewModel({
    userSettingsUser: { diceSkin: "emerald" },
    authUser: { diceSkin: "default" },
    diceSkinOptions: DICE_SKIN_OPTIONS
  });

  assert.equal(preview.key, "emerald");
  assert.equal(preview.label, "Emerald Excess");
  assert.equal(preview.previewImageUrl, "/images/emerald_preview.png");
  assert.equal(preview.alt, "Emerald Excess dice preview");
});

test("route helpers parse and rebuild key deep links", () => {
  assert.deepEqual(parseRoute("/shop"), { page: "dice-shop" });
  assert.deepEqual(parseRoute("/player/map"), { page: "player-home", playerMode: "map" });
  assert.deepEqual(parseRoute("/player/campaign-map"), {
    page: "player-home",
    playerMode: "campaign-map"
  });
  assert.deepEqual(parseRoute("/campaigns/7/map"), {
    page: "campaign-map",
    campaignId: 7
  });
  assert.deepEqual(parseRoute("/campaigns/7/scenarios/11/map"), {
    page: "scenario-map",
    campaignId: 7,
    scenarioId: 11
  });
  assert.equal(routePathFor("player-home", null, null, "map"), "/player/map");
  assert.equal(routePathFor("player-home", null, null, "campaign-map"), "/player/campaign-map");
  assert.equal(routePathFor("campaign-map", 7), "/campaigns/7/map");
  assert.equal(routePathFor("scenario-run", 7, 11), "/campaigns/7/scenarios/11/initiative");
  assert.equal(routePathFor("dice-shop"), "/shop");
});

test("api client clears auth and invokes callback on 401 outside login", async () => {
  const state = { authUser: { id: 1, username: "fridolin" } };
  let callbackCount = 0;
  const { api } = createApiClient({
    state,
    fetchImpl: async () => ({
      ok: false,
      status: 401,
      json: async () => ({ error: "Nope." })
    }),
    onAuthRequired: () => {
      callbackCount += 1;
    },
    isLoginPath: (path) => path === "/api/auth/login"
  });

  await assert.rejects(api("/api/campaigns"));
  assert.equal(state.authUser, null);
  assert.equal(callbackCount, 1);
});

test("routing controller loads settings view and syncs history", async () => {
  const state = {
    authUser: { id: 1, role: "admin" },
    campaigns: [],
    scenarios: [],
    characters: [],
    selectedCampaignId: null,
    selectedScenarioId: null,
    analyticsSelectedCampaignId: null
  };
  const calls = [];
  const historyRef = {
    replaceState: (_state, _title, path) => calls.push(`replace:${path}`),
    pushState: (_state, _title, path) => calls.push(`push:${path}`)
  };
  const locationRef = { pathname: "/settings" };

  const controller = createRoutingController({
    state,
    parseRouteBase: parseRoute,
    routePathForBase: routePathFor,
    historyRef,
    locationRef,
    setStatus: (message) => calls.push(`status:${message}`),
    showPage: (page) => calls.push(`page:${page}`),
    loadMonsters: async () => calls.push("loadMonsters"),
    loadUserSettings: async () => calls.push("loadUserSettings"),
    renderSettingsPage: () => calls.push("renderSettingsPage"),
    renderDiceShopPage: () => calls.push("renderDiceShopPage"),
    loadPlayerLive: async () => calls.push("loadPlayerLive"),
    startPlayerLivePolling: () => calls.push("startPlayerLivePolling"),
    loadCampaigns: async () => calls.push("loadCampaigns"),
    setAnalyticsCampaign: async () => calls.push("setAnalyticsCampaign"),
    renderAnalyticsPage: () => calls.push("renderAnalyticsPage"),
    loadAdminData: async () => calls.push("loadAdminData"),
    renderAdminPage: () => calls.push("renderAdminPage"),
    stopPlayerLivePolling: () => calls.push("stopPlayerLivePolling"),
    safeLoadCombatState: async () => calls.push("safeLoadCombatState"),
    loadCampaignData: async () => calls.push("loadCampaignData"),
    renderCompletedScenariosPage: () => calls.push("renderCompletedScenariosPage"),
    loadSceneImages: async () => calls.push("loadSceneImages"),
    renderScenePage: () => calls.push("renderScenePage"),
    selectedScenario: () => null,
    focusPreviewOnActiveNonPc: () => calls.push("focusPreviewOnActiveNonPc"),
    renderScenarioRunPage: () => calls.push("renderScenarioRunPage"),
    renderScenarioCompletedEditPage: () => calls.push("renderScenarioCompletedEditPage"),
    renderScenarioEditPage: () => calls.push("renderScenarioEditPage")
  });

  await controller.navigateToPath("/settings", { replace: true });

  assert.deepEqual(calls, [
    "loadUserSettings",
    "renderSettingsPage",
    "page:settings",
    "replace:/settings"
  ]);
});

test("routing controller shows campaign map before rendering it", async () => {
  const state = {
    authUser: { id: 1, role: "admin" },
    campaigns: [],
    scenarios: [],
    characters: [],
    selectedCampaignId: null,
    selectedScenarioId: null,
    analyticsSelectedCampaignId: null
  };
  const calls = [];
  const controller = createRoutingController({
    state,
    parseRouteBase: parseRoute,
    routePathForBase: routePathFor,
    historyRef: {
      replaceState: (_state, _title, path) => calls.push(`replace:${path}`),
      pushState: (_state, _title, path) => calls.push(`push:${path}`)
    },
    locationRef: { pathname: "/campaigns/7/map" },
    setStatus: (message) => calls.push(`status:${message}`),
    showPage: (page) => calls.push(`page:${page}`),
    loadMonsters: async () => {},
    loadUserSettings: async () => {},
    renderSettingsPage: () => {},
    renderDiceShopPage: () => {},
    loadPlayerLive: async () => {},
    startPlayerLivePolling: () => {},
    loadCampaigns: async () => {
      state.campaigns = [{ id: 7, name: "Demo" }];
    },
    loadCampaignMapData: async () => calls.push("loadCampaignMapData"),
    setAnalyticsCampaign: async () => {},
    renderAnalyticsPage: () => {},
    loadAdminData: async () => {},
    renderAdminPage: () => {},
    stopPlayerLivePolling: () => {},
    safeLoadCombatState: async () => {},
    loadCampaignData: async () => calls.push("loadCampaignData"),
    renderCompletedScenariosPage: () => {},
    renderCampaignMapPage: () => calls.push("renderCampaignMapPage"),
    loadSceneImages: async () => {},
    renderScenePage: () => {},
    selectedScenario: () => null,
    focusPreviewOnActiveNonPc: () => {},
    renderScenarioRunPage: () => {},
    renderScenarioCompletedEditPage: () => {},
    renderScenarioEditPage: () => {}
  });

  await controller.navigateToPath("/campaigns/7/map", { replace: true });

  assert.deepEqual(calls, [
    "loadCampaignData",
    "loadCampaignMapData",
    "page:campaign-map",
    "renderCampaignMapPage",
    "replace:/campaigns/7/map"
  ]);
});

test("scenario run shortcut handler toggles fog mode in DM map view", () => {
  const { controller, calls } = createScenarioRunShortcutHarness();
  let prevented = false;

  const handled = controller.handleKeyboardShortcut({
    key: "f",
    preventDefault: () => {
      prevented = true;
    }
  });

  assert.equal(handled, true);
  assert.equal(prevented, true);
  assert.deepEqual(calls, [["fog", "paint"]]);
});

test("scenario run shortcut handler routes edit shortcut from scenario edit to map view", async () => {
  const { controller, calls } = createScenarioRunShortcutHarness({
    state: { page: "scenario-edit" }
  });
  let prevented = false;

  const handled = controller.handleKeyboardShortcut({
    key: "e",
    preventDefault: () => {
      prevented = true;
    }
  });
  await Promise.resolve();

  assert.equal(handled, true);
  assert.equal(prevented, true);
  assert.deepEqual(calls, [[
    "navigate",
    "scenario-map",
    { campaignId: 7, scenarioId: 11 }
  ]]);
});

test("page-specific controller modules export controller factories", () => {
  assert.equal(typeof createCombatUiController, "function");
  assert.equal(typeof createLibraryPageController, "function");
  assert.equal(typeof createCampaignPageController, "function");
  assert.equal(typeof createScenarioEditPageController, "function");
  assert.equal(typeof createPlayerLivePageController, "function");
  assert.equal(typeof createScenarioRunPageController, "function");
  assert.equal(typeof createCampaignMapPageController, "function");
});
