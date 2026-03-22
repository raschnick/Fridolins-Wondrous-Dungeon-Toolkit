const test = require("node:test");
const assert = require("node:assert/strict");

const {
  addDieToPoolState,
  buildDiceEntry,
  buildDicePoolNotation,
  buildDiceSkinPreviewModel,
  deriveRunMapSyncSnapshot,
  getDicePoolSegments,
  getDicePoolTotalCount,
  parseRoute,
  resetDicePoolState,
  routePathFor
} = require("../public/app-logic.js");

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
  assert.deepEqual(parseRoute("/campaigns/7/scenarios/11/map"), {
    page: "scenario-map",
    campaignId: 7,
    scenarioId: 11
  });
  assert.equal(routePathFor("player-home", null, null, "map"), "/player/map");
  assert.equal(routePathFor("scenario-run", 7, 11), "/campaigns/7/scenarios/11/initiative");
  assert.equal(routePathFor("dice-shop"), "/shop");
});
