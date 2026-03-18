const path = require("path");
const crypto = require("crypto");
const express = require("express");
const { db, dbPath, initDb } = require("./db");

initDb();

const app = express();
const port = process.env.PORT || 3000;
const SESSION_COOKIE_NAME = "fwdt_session";
const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 30;
const STREAM_KEEPALIVE_MS = 15000;
const DEFAULT_ADMIN_USERNAME = "fridolin";
const DEFAULT_ADMIN_PASSWORD = "eeZ8Z2n7EkLe8OP0mN43";

let nextStreamClientId = 1;
const playerLiveSubscribersByUser = new Map();
const scenarioMapSubscribersByScenario = new Map();
const playerLivePushTimersByUser = new Map();
const scenarioMapPushTimersByScenario = new Map();

app.use(express.json({ limit: "10mb" }));
app.use(express.static(path.join(__dirname, "..", "public")));

const CONDITION_KEYS = new Set([
  "blinded",
  "charmed",
  "deafened",
  "exhaustion",
  "frightened",
  "grappled",
  "incapacitated",
  "concentrated",
  "invisible",
  "paralyzed",
  "petrified",
  "poisoned",
  "prone",
  "restrained",
  "stunned",
  "unconscious",
  "down"
]);

const CHARACTER_CLASSES = new Set([
  "Artificer",
  "Barbarian",
  "Bard",
  "Cleric",
  "Druid",
  "Fighter",
  "Monk",
  "Paladin",
  "Rogue",
  "Sorcerer",
  "Warlock",
  "Wizard"
]);

const MONSTER_SIZES = new Set(["normal", "large", "huge", "gargantuan"]);
const DICE_SKIN_ORDER = ["default", "emerald", "obsidian"];
const DICE_SKIN_KEYS = new Set(DICE_SKIN_ORDER);

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

function asId(value) {
  if (value == null) return null;
  if (typeof value === "string" && value.trim() === "") return null;
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function normalizeDiceSkinKey(value) {
  const key = `${value || ""}`.trim().toLowerCase();
  return DICE_SKIN_KEYS.has(key) ? key : "default";
}

function normalizeAllowedDiceSkinKeys(value) {
  const values = Array.isArray(value)
    ? value
    : `${value || ""}`
        .split(",")
        .map((entry) => entry.trim())
        .filter(Boolean);
  const requested = new Set(values.map((entry) => normalizeDiceSkinKey(entry)));
  requested.add("default");
  return DICE_SKIN_ORDER.filter((key) => requested.has(key));
}

function serializeAllowedDiceSkinKeys(value) {
  return normalizeAllowedDiceSkinKeys(value).join(",");
}

function getAllowedDiceSkinKeysForUser(user) {
  if (user?.role === "admin") return [...DICE_SKIN_ORDER];
  return normalizeAllowedDiceSkinKeys(user?.allowed_dice_skins);
}

function getEffectiveDiceSkinForUser(user) {
  const allowed = getAllowedDiceSkinKeysForUser(user);
  const selected = normalizeDiceSkinKey(user?.dice_skin);
  return allowed.includes(selected) ? selected : "default";
}

function getScenario(scenarioId) {
  return db
    .prepare(
      "SELECT id, campaign_id, name, notes, map_image_data, map_tokens_json, map_fog_data, map_last_ping_json, map_token_size, is_completed, current_round, current_turn_index, created_at, updated_at FROM combat_scenarios WHERE id = ?"
    )
    .get(scenarioId);
}

function listCombatants(scenarioId) {
  const combatants = db
    .prepare(
      `SELECT
        sc.id, sc.scenario_id, sc.kind, CASE WHEN sc.enemy_role = 'npc' THEN 'ally' ELSE sc.enemy_role END AS enemy_role, sc.character_id, sc.monster_id, sc.name,
        sc.initiative, sc.hp, sc.player_visible, sc.reaction_available, sc.reaction_auto_readied, sc.is_legendary, sc.legendary_actions_count, sc.legendary_actions_remaining, sc.created_at,
        c.class_name AS character_class,
        cu.profile_image_data AS claimed_profile_image_data,
        ms.monster_image_data,
        ms.token_image_data AS monster_token_image_data,
        ms.size AS monster_size
       FROM scenario_combatants sc
       LEFT JOIN characters c ON c.id = sc.character_id
       LEFT JOIN character_claims cc ON cc.character_id = sc.character_id
       LEFT JOIN users cu ON cu.id = cc.user_id
       LEFT JOIN monster_statblocks ms ON ms.id = sc.monster_id
       WHERE sc.scenario_id = ?
       ORDER BY sc.initiative DESC, sc.id ASC`
    )
    .all(scenarioId);

  const conditionRows = db
    .prepare(
      `SELECT scc.combatant_id, scc.condition_key
       FROM scenario_combatant_conditions scc
       JOIN scenario_combatants sc ON sc.id = scc.combatant_id
       WHERE sc.scenario_id = ?
       ORDER BY scc.created_at ASC`
    )
    .all(scenarioId);

  const byCombatant = new Map();
  for (const row of conditionRows) {
    const existing = byCombatant.get(row.combatant_id) || [];
    existing.push(row.condition_key);
    byCombatant.set(row.combatant_id, existing);
  }

  for (const combatant of combatants) {
    combatant.condition_keys = byCombatant.get(combatant.id) || [];
  }
  return combatants;
}

function getCombatantById(combatantId) {
  const combatant = db
    .prepare(
      `SELECT
        sc.id, sc.scenario_id, sc.kind, CASE WHEN sc.enemy_role = 'npc' THEN 'ally' ELSE sc.enemy_role END AS enemy_role, sc.character_id, sc.monster_id, sc.name,
        sc.initiative, sc.hp, sc.player_visible, sc.reaction_available, sc.reaction_auto_readied, sc.is_legendary, sc.legendary_actions_count, sc.legendary_actions_remaining, sc.created_at,
        c.class_name AS character_class,
        cu.profile_image_data AS claimed_profile_image_data,
        ms.monster_image_data,
        ms.token_image_data AS monster_token_image_data,
        ms.size AS monster_size
       FROM scenario_combatants sc
       LEFT JOIN characters c ON c.id = sc.character_id
       LEFT JOIN character_claims cc ON cc.character_id = sc.character_id
       LEFT JOIN users cu ON cu.id = cc.user_id
       LEFT JOIN monster_statblocks ms ON ms.id = sc.monster_id
       WHERE sc.id = ?`
    )
    .get(combatantId);
  if (!combatant) return null;

  combatant.condition_keys = db
    .prepare(
      `SELECT condition_key
       FROM scenario_combatant_conditions
       WHERE combatant_id = ?
       ORDER BY created_at ASC`
    )
    .all(combatantId)
    .map((row) => row.condition_key);

  return combatant;
}

function toFiniteNumberOrNull(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function computeEnemyDamageAndDefeatDelta(previousHp, nextHp) {
  const prev = toFiniteNumberOrNull(previousHp);
  const next = toFiniteNumberOrNull(nextHp);
  if (prev === null || next === null) {
    return { damage: 0, defeats: 0 };
  }
  const damage = Math.max(0, Math.trunc(prev - next));
  const defeats = prev > 0 && next <= 0 ? 1 : 0;
  return { damage, defeats };
}

function applyCampaignEnemyStatsDelta(campaignId, damage, defeats) {
  if (!Number.isInteger(campaignId)) return;
  const safeDamage = Math.max(0, Math.trunc(Number(damage) || 0));
  const safeDefeats = Math.max(0, Math.trunc(Number(defeats) || 0));
  if (safeDamage === 0 && safeDefeats === 0) return;
  db.prepare(
    `INSERT INTO campaign_stats (campaign_id, total_enemy_damage, total_enemy_defeats, updated_at)
     VALUES (?, ?, ?, datetime('now'))
     ON CONFLICT(campaign_id) DO UPDATE SET
       total_enemy_damage = total_enemy_damage + excluded.total_enemy_damage,
       total_enemy_defeats = total_enemy_defeats + excluded.total_enemy_defeats,
       updated_at = datetime('now')`
  ).run(campaignId, safeDamage, safeDefeats);
}

function campaignConditionTargetGroup(combatant, conditionKey) {
  if (!combatant || !conditionKey) return null;
  if (combatant.kind === "enemy" && combatant.enemy_role !== "ally") {
    return "enemy";
  }
  if (combatant.kind === "character" && conditionKey === "down") {
    return "pc";
  }
  return null;
}

function incrementCampaignConditionApplyCount(campaignId, targetGroup, conditionKey, amount = 1) {
  if (!Number.isInteger(campaignId)) return;
  if (targetGroup !== "enemy" && targetGroup !== "pc") return;
  const normalizedCondition = `${conditionKey || ""}`.trim().toLowerCase();
  if (!normalizedCondition) return;
  const safeAmount = Math.max(0, Math.trunc(Number(amount) || 0));
  if (safeAmount <= 0) return;
  db.prepare(
    `INSERT INTO campaign_condition_stats (campaign_id, target_group, condition_key, apply_count, updated_at)
     VALUES (?, ?, ?, ?, datetime('now'))
     ON CONFLICT(campaign_id, target_group, condition_key) DO UPDATE SET
       apply_count = apply_count + excluded.apply_count,
       updated_at = datetime('now')`
  ).run(campaignId, targetGroup, normalizedCondition, safeAmount);
}

function ensureScenarioHasCampaignCharacters(scenario) {
  const characters = db
    .prepare(
      `SELECT id, name
       FROM characters
       WHERE campaign_id = ?
         AND id NOT IN (
           SELECT character_id
           FROM scenario_character_exclusions
           WHERE scenario_id = ?
         )`
    )
    .all(scenario.campaign_id, scenario.id);

  const insertCharacterCombatant = db.prepare(
    "INSERT OR IGNORE INTO scenario_combatants (scenario_id, kind, character_id, name, initiative) VALUES (?, 'character', ?, ?, 0)"
  );

  const tx = db.transaction((rows) => {
    for (const character of rows) {
      insertCharacterCombatant.run(scenario.id, character.id, character.name);
    }
  });
  tx(characters);
}

function normalizeCombatState(scenario, combatants) {
  let nextRound = scenario.current_round || 1;
  let nextTurnIndex = scenario.current_turn_index || 0;

  if (combatants.length === 0) {
    nextRound = 1;
    nextTurnIndex = 0;
  } else if (nextTurnIndex >= combatants.length || nextTurnIndex < 0) {
    nextTurnIndex = 0;
  }

  if (
    nextRound !== scenario.current_round ||
    nextTurnIndex !== scenario.current_turn_index
  ) {
    db.prepare(
      "UPDATE combat_scenarios SET current_round = ?, current_turn_index = ?, updated_at = datetime('now') WHERE id = ?"
    ).run(nextRound, nextTurnIndex, scenario.id);
  }

  return {
    round: nextRound,
    turnIndex: nextTurnIndex,
    activeCombatantId: combatants.length > 0 ? combatants[nextTurnIndex].id : null
  };
}

function parseMonsterPayload(body) {
  const sizeRaw = `${body?.size || ""}`.trim().toLowerCase();
  const size = sizeRaw || "normal";
  if (!MONSTER_SIZES.has(size)) {
    return { error: "Monster size must be normal, large, huge, or gargantuan." };
  }
  const isLegendaryInput = body?.isLegendary;
  const isLegendary =
    isLegendaryInput === true ||
    isLegendaryInput === 1 ||
    `${isLegendaryInput || ""}`.trim().toLowerCase() === "true" ||
    `${isLegendaryInput || ""}`.trim() === "1";
  const legendaryActionsCountRaw = body?.legendaryActionsCount;
  const legendaryActionsCount =
    legendaryActionsCountRaw == null || legendaryActionsCountRaw === ""
      ? null
      : Number(legendaryActionsCountRaw);

  const fields = {
    name: `${body?.name || ""}`.trim(),
    size,
    type: `${body?.type || ""}`.trim(),
    alignment: `${body?.alignment || ""}`.trim(),
    armor_class: `${body?.armorClass || ""}`.trim(),
    hit_points: `${body?.hitPoints || ""}`.trim(),
    speed: `${body?.speed || ""}`.trim(),
    challenge_rating: `${body?.challengeRating || ""}`.trim(),
    proficiency_bonus: `${body?.proficiencyBonus || ""}`.trim(),
    senses: `${body?.senses || ""}`.trim(),
    languages: `${body?.languages || ""}`.trim(),
    traits: `${body?.traits || ""}`.trim(),
    actions: `${body?.actions || ""}`.trim(),
    monster_image_data: `${body?.monsterImageData || ""}`.trim(),
    token_image_data: `${body?.tokenImageData || ""}`.trim(),
    is_legendary: isLegendary ? 1 : 0,
    legendary_actions_count: isLegendary ? legendaryActionsCount : null,
    source: `${body?.source || ""}`.trim() || "Custom",
    str_score: Number(body?.str),
    dex_score: Number(body?.dex),
    con_score: Number(body?.con),
    int_score: Number(body?.int),
    wis_score: Number(body?.wis),
    cha_score: Number(body?.cha)
  };

  if (!fields.name) return { error: "Missing required field: name" };

  const abilityKeys = [
    "str_score",
    "dex_score",
    "con_score",
    "int_score",
    "wis_score",
    "cha_score"
  ];
  for (const key of abilityKeys) {
    if (!Number.isFinite(fields[key])) {
      fields[key] = 10;
    }
    fields[key] = Math.trunc(fields[key]);
  }

  if (isLegendary && !Number.isInteger(legendaryActionsCount)) {
    return { error: "Legendary actions count is required when Is Legendary is true." };
  }
  if (
    legendaryActionsCount !== null &&
    (!Number.isInteger(legendaryActionsCount) || legendaryActionsCount < 2 || legendaryActionsCount > 4)
  ) {
    return { error: "Legendary actions count must be 2, 3, or 4." };
  }

  return { fields };
}

function parseCookieHeader(headerValue) {
  const result = {};
  const raw = `${headerValue || ""}`;
  if (!raw) return result;
  for (const part of raw.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!key) continue;
    result[key] = decodeURIComponent(value);
  }
  return result;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const iterations = 120000;
  const derived = crypto
    .pbkdf2Sync(password, salt, iterations, 32, "sha256")
    .toString("hex");
  return `pbkdf2$${iterations}$${salt}$${derived}`;
}

function verifyPassword(password, storedHash) {
  const parts = `${storedHash || ""}`.split("$");
  if (parts.length !== 4) return false;
  if (parts[0] !== "pbkdf2") return false;
  const iterations = Number(parts[1]);
  const salt = parts[2];
  const expectedHex = parts[3];
  if (!Number.isInteger(iterations) || iterations < 1000) return false;
  const actualHex = crypto
    .pbkdf2Sync(password, salt, iterations, 32, "sha256")
    .toString("hex");
  const expected = Buffer.from(expectedHex, "hex");
  const actual = Buffer.from(actualHex, "hex");
  if (expected.length !== actual.length) return false;
  return crypto.timingSafeEqual(expected, actual);
}

function hashSessionToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function setAuthCookie(res, token) {
  const maxAge = Math.trunc(SESSION_TTL_MS / 1000);
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  const encoded = encodeURIComponent(token);
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=${encoded}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`
  );
}

function clearAuthCookie(res) {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  res.setHeader(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`
  );
}

function createSession(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS).toISOString();
  db.prepare(
    "INSERT INTO user_sessions (user_id, token_hash, expires_at) VALUES (?, ?, ?)"
  ).run(userId, tokenHash, expiresAt);
  return token;
}

function ensureDefaultAdminUser() {
  const existing = db
    .prepare("SELECT id FROM users WHERE username = ?")
    .get(DEFAULT_ADMIN_USERNAME);
  if (existing) return;
  db.prepare(
    "INSERT INTO users (username, password_hash, role, active, updated_at) VALUES (?, ?, 'admin', 1, datetime('now'))"
  ).run(DEFAULT_ADMIN_USERNAME, hashPassword(DEFAULT_ADMIN_PASSWORD));
}

function loadAuthUser(req, _res, next) {
  req.authUser = null;
  const cookies = parseCookieHeader(req.headers.cookie);
  const sessionToken = cookies[SESSION_COOKIE_NAME];
  if (!sessionToken) return next();
  const tokenHash = hashSessionToken(sessionToken);
  const session = db
    .prepare(
      `SELECT
        us.id AS session_id,
        us.user_id,
        u.username,
        u.role,
        u.active,
        u.profile_image_data,
        u.dice_skin,
        u.allowed_dice_skins
       FROM user_sessions us
       JOIN users u ON u.id = us.user_id
       WHERE us.token_hash = ?
         AND us.expires_at > datetime('now')
       LIMIT 1`
    )
    .get(tokenHash);
  if (!session || Number(session.active) !== 1) return next();
  const allowedDiceSkins = getAllowedDiceSkinKeysForUser(session);
  req.authUser = {
    id: session.user_id,
    username: session.username,
    role: session.role,
    profileImageData: session.profile_image_data || "",
    diceSkin: getEffectiveDiceSkinForUser(session),
    availableDiceSkins: allowedDiceSkins,
    sessionId: session.session_id
  };
  return next();
}

function requireAuth(req, res, next) {
  if (!req.authUser) {
    return res.status(401).json({ error: "Authentication required." });
  }
  return next();
}

function requireAdmin(req, res, next) {
  if (!req.authUser || req.authUser.role !== "admin") {
    return res.status(403).json({ error: "Admin access required." });
  }
  return next();
}

function isAdminUser(user) {
  return Boolean(user && user.role === "admin");
}

function isPlayerAllowedApiRequest(req) {
  if (!req) return false;
  const method = `${req.method || ""}`.toUpperCase();
  const path = `${req.path || ""}`;
  if (method === "GET" && path === "/auth/me") return true;
  if (method === "POST" && path === "/auth/logout") return true;
  if (method === "POST" && path === "/users/me/change-password") return true;
  if (method === "POST" && path === "/users/me/username") return true;
  if (method === "GET" && path === "/users/me/settings") return true;
  if (method === "POST" && path === "/users/me/profile-image") return true;
  if (method === "POST" && path === "/users/me/dice-skin") return true;
  if (method === "POST" && path === "/users/me/active-campaign") return true;
  if (method === "POST" && path === "/users/me/claim-character") return true;
  if (method === "POST" && path === "/users/me/unclaim-character") return true;
  if (method === "GET" && path === "/player/live") return true;
  if (method === "GET" && path === "/player/live/stream") return true;
  if (method === "POST" && path === "/player/live/map-token") return true;
  if (method === "POST" && path === "/player/live/map-ping") return true;
  if (method === "GET" && path === "/campaigns") return true;
  if (method === "GET" && /^\/campaigns\/\d+\/stats$/.test(path)) return true;
  return false;
}

function campaignExists(campaignId) {
  return Boolean(
    db.prepare("SELECT 1 FROM campaigns WHERE id = ?").get(campaignId)
  );
}

function hasCampaignMembership(userId, campaignId) {
  return Boolean(
    db
      .prepare(
        "SELECT 1 FROM campaign_members WHERE campaign_id = ? AND user_id = ?"
      )
      .get(campaignId, userId)
  );
}

function listCampaignsForUser(userId) {
  return db
    .prepare(
      `SELECT c.id, c.name
       FROM campaign_members cm
       JOIN campaigns c ON c.id = cm.campaign_id
       WHERE cm.user_id = ?
       ORDER BY c.name ASC, c.id ASC`
    )
    .all(userId);
}

function getStoredActiveCampaignIdForUser(userId) {
  const row = db
    .prepare("SELECT active_campaign_id FROM users WHERE id = ?")
    .get(userId);
  const activeCampaignId = Number(row?.active_campaign_id);
  return Number.isInteger(activeCampaignId) ? activeCampaignId : null;
}

function setStoredActiveCampaignIdForUser(userId, activeCampaignId) {
  const normalized = Number.isInteger(activeCampaignId) ? activeCampaignId : null;
  db.prepare("UPDATE users SET active_campaign_id = ?, updated_at = datetime('now') WHERE id = ?").run(
    normalized,
    userId
  );
}

function ensureValidActiveCampaignForUser(userId) {
  const campaigns = listCampaignsForUser(userId);
  const availableIds = new Set(campaigns.map((campaign) => campaign.id));
  const storedActiveCampaignId = getStoredActiveCampaignIdForUser(userId);

  let activeCampaignId = null;
  if (Number.isInteger(storedActiveCampaignId) && availableIds.has(storedActiveCampaignId)) {
    activeCampaignId = storedActiveCampaignId;
  } else if (campaigns.length > 0) {
    activeCampaignId = campaigns[0].id;
  }

  const normalizedStored = Number.isInteger(storedActiveCampaignId) ? storedActiveCampaignId : null;
  const normalizedNext = Number.isInteger(activeCampaignId) ? activeCampaignId : null;
  if (normalizedStored !== normalizedNext) {
    setStoredActiveCampaignIdForUser(userId, normalizedNext);
  }

  return {
    campaigns,
    activeCampaignId: normalizedNext
  };
}

function canAccessCampaign(user, campaignId) {
  if (isAdminUser(user)) return true;
  return hasCampaignMembership(user.id, campaignId);
}

function ensureCampaignAccess(req, res, campaignId) {
  if (!campaignExists(campaignId)) {
    badRequest(res, "Campaign not found.");
    return false;
  }
  if (canAccessCampaign(req.authUser, campaignId)) return true;
  res.status(403).json({ error: "Campaign access denied." });
  return false;
}

function ensureScenarioAccess(req, res, scenarioId) {
  const scenario = getScenario(scenarioId);
  if (!scenario) {
    badRequest(res, "Scenario not found.");
    return null;
  }
  if (canAccessCampaign(req.authUser, scenario.campaign_id)) return scenario;
  res.status(403).json({ error: "Scenario access denied." });
  return null;
}

function ensureCombatantAccess(req, res, combatantId) {
  const row = db
    .prepare(
      `SELECT sc.id, sc.scenario_id, cs.campaign_id
       FROM scenario_combatants sc
       JOIN combat_scenarios cs ON cs.id = sc.scenario_id
       WHERE sc.id = ?`
    )
    .get(combatantId);
  if (!row) {
    badRequest(res, "Combatant not found.");
    return null;
  }
  if (canAccessCampaign(req.authUser, row.campaign_id)) return row;
  res.status(403).json({ error: "Combatant access denied." });
  return null;
}

function getCampaignLiveState(campaignId) {
  const row = db
    .prepare(
      `SELECT
        cls.campaign_id,
        cls.shared_scenario_id,
        cls.shared_scene_image_id,
        cls.updated_at,
        cs.name AS shared_scenario_name,
        csi.name AS shared_scene_image_name
       FROM campaign_live_state cls
       LEFT JOIN combat_scenarios cs ON cs.id = cls.shared_scenario_id
       LEFT JOIN campaign_scene_images csi ON csi.id = cls.shared_scene_image_id
       WHERE cls.campaign_id = ?`
    )
    .get(campaignId);
  if (!row) {
    return {
      campaign_id: campaignId,
      shared_scenario_id: null,
      shared_scene_image_id: null,
      shared_scenario_name: null,
      shared_scene_image_name: null,
      updated_at: null
    };
  }
  return row;
}

function liveStateForCampaign(campaignId) {
  if (!Number.isInteger(campaignId)) return null;
  return db
    .prepare(
      `SELECT
        cls.campaign_id,
        cls.shared_scenario_id AS scenario_id,
        cls.shared_scene_image_id AS scene_image_id,
        cls.updated_at
       FROM campaign_live_state cls
       WHERE cls.campaign_id = ?
         AND (cls.shared_scenario_id IS NOT NULL OR cls.shared_scene_image_id IS NOT NULL)
       LIMIT 1`
    )
    .get(campaignId);
}

function buildPlayerLiveSnapshotForUser(userId) {
  const activeCampaign = ensureValidActiveCampaignForUser(userId);
  if (!Number.isInteger(activeCampaign.activeCampaignId)) {
    return {
      shared: null,
      scene: null,
      activeCampaignId: null
    };
  }
  const shared = liveStateForCampaign(activeCampaign.activeCampaignId);
  const payload = {
    shared: null,
    scene: null,
    activeCampaignId: activeCampaign.activeCampaignId
  };
  if (!shared) return payload;

  if (Number.isInteger(shared.scenario_id)) {
    const scenario = getScenario(shared.scenario_id);
    if (scenario) {
      const combatants = listCombatants(scenario.id);
      const combatState = normalizeCombatState(scenario, combatants);
      const visibleCombatants = combatants.filter((combatant) => Number(combatant.player_visible) !== 0);
      const active =
        visibleCombatants.find((combatant) => combatant.id === combatState.activeCombatantId) || null;
      payload.shared = {
        campaignId: scenario.campaign_id,
        scenarioId: scenario.id,
        name: scenario.name,
        notes: scenario.notes || "",
        mapImageData: scenario.map_image_data || "",
        mapTokensJson: scenario.map_tokens_json || "",
        mapFogData: scenario.map_fog_data || "",
        mapLastPingJson: scenario.map_last_ping_json || "",
        mapTokenSize: Number.isInteger(Number(scenario.map_token_size))
          ? Number(scenario.map_token_size)
          : 44,
        round: combatState.round,
        turnIndex: combatState.turnIndex,
        activeCombatantId: combatState.activeCombatantId,
        activeCombatantName: active ? active.name : null,
        combatants: visibleCombatants.map((combatant) => ({
          id: combatant.id,
          name: combatant.name,
          initiative: combatant.initiative,
          kind: combatant.kind,
          enemy_role: combatant.enemy_role,
          monster_size: combatant.monster_size,
          monster_token_image_data: combatant.monster_token_image_data || "",
          claimed_profile_image_data: combatant.claimed_profile_image_data || "",
          character_class: combatant.character_class,
          reaction_available: combatant.reaction_available,
          is_legendary: combatant.is_legendary,
          legendary_actions_count: combatant.legendary_actions_count,
          legendary_actions_remaining: combatant.legendary_actions_remaining,
          is_defeated:
            combatant.kind === "enemy" &&
            Number.isFinite(Number(combatant.hp)) &&
            Number(combatant.hp) <= 0
              ? 1
              : 0,
          condition_keys: Array.isArray(combatant.condition_keys) ? combatant.condition_keys : []
        }))
      };
    }
  }

  if (Number.isInteger(shared.scene_image_id)) {
    const scene = db
      .prepare(
        `SELECT id, campaign_id, name, image_data, updated_at
         FROM campaign_scene_images
         WHERE id = ?
         LIMIT 1`
      )
      .get(shared.scene_image_id);
    if (scene) {
      payload.scene = {
        id: scene.id,
        campaignId: scene.campaign_id,
        name: scene.name,
        imageData: scene.image_data || "",
        updatedAt: scene.updated_at || null
      };
    }
  }

  if (!payload.shared && !payload.scene) {
    return payload;
  }
  return payload;
}

function beginSseStream(res) {
  res.status(200);
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  if (typeof res.flushHeaders === "function") {
    res.flushHeaders();
  }
}

function writeSseEvent(res, eventName, payload) {
  if (!res || res.writableEnded || res.destroyed) return false;
  try {
    res.write(`event: ${eventName}\n`);
    res.write(`data: ${JSON.stringify(payload)}\n\n`);
    return true;
  } catch (_error) {
    return false;
  }
}

function writeSseComment(res, comment = "ping") {
  if (!res || res.writableEnded || res.destroyed) return false;
  try {
    res.write(`: ${comment}\n\n`);
    return true;
  } catch (_error) {
    return false;
  }
}

function addPlayerLiveSubscriber(userId, res) {
  const clientId = nextStreamClientId++;
  let subscribers = playerLiveSubscribersByUser.get(userId);
  if (!subscribers) {
    subscribers = new Map();
    playerLiveSubscribersByUser.set(userId, subscribers);
  }

  const keepAliveTimer = setInterval(() => {
    writeSseComment(res);
  }, STREAM_KEEPALIVE_MS);

  subscribers.set(clientId, { userId, res, keepAliveTimer });

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    clearInterval(keepAliveTimer);
    const current = playerLiveSubscribersByUser.get(userId);
    if (!current) return;
    current.delete(clientId);
    if (current.size === 0) {
      playerLiveSubscribersByUser.delete(userId);
      const timer = playerLivePushTimersByUser.get(userId);
      if (timer) {
        clearTimeout(timer);
        playerLivePushTimersByUser.delete(userId);
      }
    }
  };

  res.on("close", cleanup);
  res.on("error", cleanup);
  return cleanup;
}

function addScenarioMapSubscriber(scenarioId, res, userId) {
  const clientId = nextStreamClientId++;
  let subscribers = scenarioMapSubscribersByScenario.get(scenarioId);
  if (!subscribers) {
    subscribers = new Map();
    scenarioMapSubscribersByScenario.set(scenarioId, subscribers);
  }

  const keepAliveTimer = setInterval(() => {
    writeSseComment(res);
  }, STREAM_KEEPALIVE_MS);

  subscribers.set(clientId, { userId, res, keepAliveTimer });

  let cleanedUp = false;
  const cleanup = () => {
    if (cleanedUp) return;
    cleanedUp = true;
    clearInterval(keepAliveTimer);
    const current = scenarioMapSubscribersByScenario.get(scenarioId);
    if (!current) return;
    current.delete(clientId);
    if (current.size === 0) {
      scenarioMapSubscribersByScenario.delete(scenarioId);
      const timer = scenarioMapPushTimersByScenario.get(scenarioId);
      if (timer) {
        clearTimeout(timer);
        scenarioMapPushTimersByScenario.delete(scenarioId);
      }
    }
  };

  res.on("close", cleanup);
  res.on("error", cleanup);
  return cleanup;
}

function flushPlayerLivePushForUser(userId) {
  const subscribers = playerLiveSubscribersByUser.get(userId);
  if (!subscribers || subscribers.size === 0) return;
  const payload = buildPlayerLiveSnapshotForUser(userId);
  for (const [clientId, subscriber] of subscribers.entries()) {
    if (writeSseEvent(subscriber.res, "player-live", payload)) continue;
    clearInterval(subscriber.keepAliveTimer);
    subscribers.delete(clientId);
  }
  if (subscribers.size === 0) {
    playerLiveSubscribersByUser.delete(userId);
  }
}

function schedulePlayerLivePushForUser(userId, delayMs = 80) {
  if (!Number.isInteger(userId)) return;
  if (!playerLiveSubscribersByUser.has(userId)) return;
  if (playerLivePushTimersByUser.has(userId)) return;
  const timer = setTimeout(() => {
    playerLivePushTimersByUser.delete(userId);
    flushPlayerLivePushForUser(userId);
  }, delayMs);
  playerLivePushTimersByUser.set(userId, timer);
}

function notifyPlayerLiveForCampaign(campaignId) {
  if (!Number.isInteger(campaignId)) return;
  if (playerLiveSubscribersByUser.size === 0) return;
  const members = db
    .prepare("SELECT user_id FROM campaign_members WHERE campaign_id = ?")
    .all(campaignId);
  for (const member of members) {
    const userId = Number(member.user_id);
    if (!Number.isInteger(userId)) continue;
    schedulePlayerLivePushForUser(userId);
  }
}

function notifyPlayerLiveForScenario(scenarioId) {
  if (!Number.isInteger(scenarioId)) return;
  const scenario = getScenario(scenarioId);
  if (!scenario) return;
  notifyPlayerLiveForCampaign(scenario.campaign_id);
}

function notifyPlayerLiveForCombatant(combatantId) {
  if (!Number.isInteger(combatantId)) return;
  const row = db
    .prepare(
      `SELECT cs.campaign_id
       FROM scenario_combatants sc
       JOIN combat_scenarios cs ON cs.id = sc.scenario_id
       WHERE sc.id = ?`
    )
    .get(combatantId);
  if (!row) return;
  notifyPlayerLiveForCampaign(row.campaign_id);
}

function flushScenarioMapPushForScenario(scenarioId) {
  const subscribers = scenarioMapSubscribersByScenario.get(scenarioId);
  if (!subscribers || subscribers.size === 0) return;

  const scenario = getScenario(scenarioId);
  if (!scenario) {
    for (const [clientId, subscriber] of subscribers.entries()) {
      writeSseEvent(subscriber.res, "scenario-map", {
        scenarioId,
        deleted: true
      });
      clearInterval(subscriber.keepAliveTimer);
      subscribers.delete(clientId);
      if (!subscriber.res.writableEnded) {
        subscriber.res.end();
      }
    }
    scenarioMapSubscribersByScenario.delete(scenarioId);
    return;
  }

  const payload = {
    scenarioId: scenario.id,
    mapTokensJson: `${scenario.map_tokens_json || ""}`,
    mapFogData: `${scenario.map_fog_data || ""}`,
    mapLastPingJson: `${scenario.map_last_ping_json || ""}`,
    mapTokenSize: Number.isInteger(Number(scenario.map_token_size)) ? Number(scenario.map_token_size) : 44,
    updatedAt: scenario.updated_at || null
  };

  for (const [clientId, subscriber] of subscribers.entries()) {
    if (writeSseEvent(subscriber.res, "scenario-map", payload)) continue;
    clearInterval(subscriber.keepAliveTimer);
    subscribers.delete(clientId);
  }
  if (subscribers.size === 0) {
    scenarioMapSubscribersByScenario.delete(scenarioId);
  }
}

function scheduleScenarioMapPushForScenario(scenarioId, delayMs = 70) {
  if (!Number.isInteger(scenarioId)) return;
  if (!scenarioMapSubscribersByScenario.has(scenarioId)) return;
  if (scenarioMapPushTimersByScenario.has(scenarioId)) return;
  const timer = setTimeout(() => {
    scenarioMapPushTimersByScenario.delete(scenarioId);
    flushScenarioMapPushForScenario(scenarioId);
  }, delayMs);
  scenarioMapPushTimersByScenario.set(scenarioId, timer);
}

function closePlayerLiveSubscribersForUser(userId) {
  const subscribers = playerLiveSubscribersByUser.get(userId);
  if (!subscribers || subscribers.size === 0) return;
  for (const [clientId, subscriber] of subscribers.entries()) {
    clearInterval(subscriber.keepAliveTimer);
    subscribers.delete(clientId);
    if (!subscriber.res.writableEnded) {
      subscriber.res.end();
    }
  }
  playerLiveSubscribersByUser.delete(userId);
  const timer = playerLivePushTimersByUser.get(userId);
  if (timer) {
    clearTimeout(timer);
    playerLivePushTimersByUser.delete(userId);
  }
}

function closeScenarioMapSubscribersForUser(userId) {
  for (const [scenarioId, subscribers] of scenarioMapSubscribersByScenario.entries()) {
    for (const [clientId, subscriber] of subscribers.entries()) {
      if (subscriber.userId !== userId) continue;
      clearInterval(subscriber.keepAliveTimer);
      subscribers.delete(clientId);
      if (!subscriber.res.writableEnded) {
        subscriber.res.end();
      }
    }
    if (subscribers.size === 0) {
      scenarioMapSubscribersByScenario.delete(scenarioId);
      const timer = scenarioMapPushTimersByScenario.get(scenarioId);
      if (timer) {
        clearTimeout(timer);
        scenarioMapPushTimersByScenario.delete(scenarioId);
      }
    }
  }
}

function closeStreamsForUser(userId) {
  if (!Number.isInteger(userId)) return;
  closePlayerLiveSubscribersForUser(userId);
  closeScenarioMapSubscribersForUser(userId);
}

ensureDefaultAdminUser();
app.use(loadAuthUser);

app.post("/api/auth/login", (req, res) => {
  const username = `${req.body?.username || ""}`.trim();
  const password = `${req.body?.password || ""}`;
  if (!username || !password) {
    return badRequest(res, "Username and password are required.");
  }

  const user = db
    .prepare(
      "SELECT id, username, role, active, password_hash, profile_image_data, dice_skin, allowed_dice_skins FROM users WHERE username = ? LIMIT 1"
    )
    .get(username);
  if (!user || Number(user.active) !== 1 || !verifyPassword(password, user.password_hash)) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  db.prepare("DELETE FROM user_sessions WHERE expires_at <= datetime('now')").run();
  const token = createSession(user.id);
  setAuthCookie(res, token);
  const allowedDiceSkins = getAllowedDiceSkinKeysForUser(user);
  return res.json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      profileImageData: user.profile_image_data || "",
      diceSkin: getEffectiveDiceSkinForUser(user),
      availableDiceSkins: allowedDiceSkins
    }
  });
});

app.use("/api", (req, res, next) => {
  if (req.path === "/auth/login") return next();
  return requireAuth(req, res, next);
});

app.use("/api", (req, res, next) => {
  if (req.path === "/auth/login") return next();
  if (isAdminUser(req.authUser)) return next();
  if (isPlayerAllowedApiRequest(req)) return next();
  return res.status(403).json({
    error: "Player access restricted to player endpoints."
  });
});

app.get("/api/auth/me", (req, res) => {
  res.json({
    user: {
      id: req.authUser.id,
      username: req.authUser.username,
      role: req.authUser.role,
      profileImageData: req.authUser.profileImageData || "",
      diceSkin: normalizeDiceSkinKey(req.authUser.diceSkin),
      availableDiceSkins: [...(req.authUser.availableDiceSkins || ["default"])]
    }
  });
});

app.post("/api/auth/logout", (req, res) => {
  const cookies = parseCookieHeader(req.headers.cookie);
  const sessionToken = cookies[SESSION_COOKIE_NAME];
  if (sessionToken) {
    const tokenHash = hashSessionToken(sessionToken);
    db.prepare("DELETE FROM user_sessions WHERE token_hash = ?").run(tokenHash);
  }
  if (req.authUser?.id) {
    closeStreamsForUser(req.authUser.id);
  }
  clearAuthCookie(res);
  res.status(204).send();
});

app.post("/api/users/me/change-password", (req, res) => {
  const newPassword = `${req.body?.newPassword || ""}`;
  if (req.body?.newPassword === undefined) {
    return badRequest(res, "New password is required.");
  }
  if (!newPassword) {
    return badRequest(res, "New password is required.");
  }
  db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(
    hashPassword(newPassword),
    req.authUser.id
  );
  db.prepare("DELETE FROM user_sessions WHERE user_id = ?").run(req.authUser.id);
  closeStreamsForUser(req.authUser.id);
  clearAuthCookie(res);
  return res.status(204).send();
});

app.get("/api/users/me/settings", (req, res) => {
  const user = db
    .prepare(
      "SELECT id, username, role, profile_image_data, dice_skin, allowed_dice_skins FROM users WHERE id = ?"
    )
    .get(req.authUser.id);
  if (!user) return res.status(404).json({ error: "User not found." });
  const availableDiceSkins = getAllowedDiceSkinKeysForUser(user);

  let characters = [];
  let campaigns = [];
  let activeCampaignId = null;
  if (!isAdminUser(req.authUser)) {
    const activeCampaign = ensureValidActiveCampaignForUser(req.authUser.id);
    campaigns = activeCampaign.campaigns;
    activeCampaignId = activeCampaign.activeCampaignId;
    characters = db
      .prepare(
        `SELECT
          ch.id,
          ch.name,
          ch.class_name,
          ch.campaign_id,
          cp.name AS campaign_name,
          cc.user_id AS claimed_user_id,
          cu.username AS claimed_by_username
         FROM characters ch
         JOIN campaigns cp ON cp.id = ch.campaign_id
         JOIN campaign_members cm ON cm.campaign_id = ch.campaign_id AND cm.user_id = ?
         LEFT JOIN character_claims cc ON cc.character_id = ch.id
         LEFT JOIN users cu ON cu.id = cc.user_id
         ORDER BY cp.name ASC, ch.name ASC`
      )
      .all(req.authUser.id);
  }

  return res.json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      profileImageData: user.profile_image_data || "",
      diceSkin: getEffectiveDiceSkinForUser(user),
      availableDiceSkins
    },
    campaigns,
    activeCampaignId,
    characters
  });
});

app.post("/api/users/me/username", (req, res) => {
  const username = `${req.body?.username || ""}`.trim();
  if (!username) return badRequest(res, "Username is required.");
  if (username.length < 3) return badRequest(res, "Username must be at least 3 characters.");
  if (username.length > 64) return badRequest(res, "Username is too long.");
  try {
    db.prepare("UPDATE users SET username = ?, updated_at = datetime('now') WHERE id = ?").run(
      username,
      req.authUser.id
    );
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return badRequest(res, "Username must be unique.");
    }
    throw error;
  }
  db.prepare("DELETE FROM user_sessions WHERE user_id = ?").run(req.authUser.id);
  closeStreamsForUser(req.authUser.id);
  clearAuthCookie(res);
  return res.status(204).send();
});

app.post("/api/users/me/profile-image", (req, res) => {
  const profileImageData = `${req.body?.profileImageData || ""}`.trim();
  if (profileImageData.length > 10_000_000) {
    return badRequest(res, "Profile image is too large.");
  }
  db.prepare(
    "UPDATE users SET profile_image_data = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(profileImageData, req.authUser.id);
  return res.status(204).send();
});

app.post("/api/users/me/dice-skin", (req, res) => {
  const rawDiceSkin = `${req.body?.diceSkin || ""}`.trim();
  if (!rawDiceSkin) return badRequest(res, "Dice skin is required.");
  const requestedKey = rawDiceSkin.toLowerCase();
  if (!DICE_SKIN_KEYS.has(requestedKey)) {
    return badRequest(res, "Invalid dice skin.");
  }
  const allowedDiceSkins = Array.isArray(req.authUser?.availableDiceSkins)
    ? req.authUser.availableDiceSkins
    : ["default"];
  if (!allowedDiceSkins.includes(requestedKey)) {
    return res.status(403).json({ error: "Dice skin is not enabled for this user." });
  }
  db.prepare("UPDATE users SET dice_skin = ?, updated_at = datetime('now') WHERE id = ?").run(
    requestedKey,
    req.authUser.id
  );
  return res.status(204).send();
});

app.post("/api/users/me/active-campaign", (req, res) => {
  if (isAdminUser(req.authUser)) {
    return badRequest(res, "Admins don't have an active campaign.");
  }
  const campaignId = asId(req.body?.campaignId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (!hasCampaignMembership(req.authUser.id, campaignId)) {
    return res.status(403).json({ error: "Campaign access denied." });
  }
  setStoredActiveCampaignIdForUser(req.authUser.id, campaignId);
  schedulePlayerLivePushForUser(req.authUser.id);
  return res.status(204).send();
});

app.post("/api/users/me/claim-character", (req, res) => {
  const characterId = asId(req.body?.characterId);
  if (characterId === null) return badRequest(res, "Invalid character id.");
  if (isAdminUser(req.authUser)) return badRequest(res, "Admins can't claim player characters.");

  const character = db
    .prepare(
      `SELECT ch.id
       FROM characters ch
       JOIN campaign_members cm ON cm.campaign_id = ch.campaign_id AND cm.user_id = ?
       WHERE ch.id = ?
       LIMIT 1`
    )
    .get(req.authUser.id, characterId);
  if (!character) return badRequest(res, "Character not found in your campaigns.");

  const existing = db
    .prepare("SELECT user_id FROM character_claims WHERE character_id = ?")
    .get(characterId);
  if (existing && Number(existing.user_id) !== req.authUser.id) {
    return badRequest(res, "Character is already claimed by another player.");
  }

  db.prepare(
    `INSERT INTO character_claims (character_id, user_id, created_at, updated_at)
     VALUES (?, ?, datetime('now'), datetime('now'))
     ON CONFLICT(character_id) DO UPDATE SET
       user_id = excluded.user_id,
       updated_at = datetime('now')`
  ).run(characterId, req.authUser.id);

  return res.status(204).send();
});

app.post("/api/users/me/unclaim-character", (req, res) => {
  const characterId = asId(req.body?.characterId);
  if (characterId === null) return badRequest(res, "Invalid character id.");
  db.prepare("DELETE FROM character_claims WHERE character_id = ? AND user_id = ?").run(
    characterId,
    req.authUser.id
  );
  return res.status(204).send();
});

app.get("/api/admin/users", requireAdmin, (_req, res) => {
  const users = db
    .prepare(
      "SELECT id, username, role, active, dice_skin, allowed_dice_skins, created_at, updated_at FROM users ORDER BY username ASC"
    )
    .all();
  res.json(
    users.map((user) => ({
      ...user,
      diceSkin: getEffectiveDiceSkinForUser(user),
      allowedDiceSkins: getAllowedDiceSkinKeysForUser(user)
    }))
  );
});

app.post("/api/admin/users", requireAdmin, (req, res) => {
  const username = `${req.body?.username || ""}`.trim();
  const password = `${req.body?.password || ""}`;
  const role = `${req.body?.role || "player"}`.trim().toLowerCase() === "admin" ? "admin" : "player";
  if (!username || !password) return badRequest(res, "Username and password are required.");
  try {
    const result = db
      .prepare(
        "INSERT INTO users (username, password_hash, role, active, updated_at) VALUES (?, ?, ?, 1, datetime('now'))"
      )
      .run(username, hashPassword(password), role);
    const created = db
      .prepare("SELECT id, username, role, active, created_at, updated_at FROM users WHERE id = ?")
      .get(result.lastInsertRowid);
    return res.status(201).json(created);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return badRequest(res, "Username must be unique.");
    }
    throw error;
  }
});

app.post("/api/admin/users/:userId/reset-password", requireAdmin, (req, res) => {
  const userId = asId(req.params.userId);
  const password = `${req.body?.password || ""}`;
  if (userId === null) return badRequest(res, "Invalid user id.");
  if (req.body?.password === undefined || !password) return badRequest(res, "Password is required.");
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!user) return badRequest(res, "User not found.");
  db.prepare("UPDATE users SET password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(
    hashPassword(password),
    userId
  );
  db.prepare("DELETE FROM user_sessions WHERE user_id = ?").run(userId);
  closeStreamsForUser(userId);
  return res.status(204).send();
});

app.post("/api/admin/users/:userId/dice-skins", requireAdmin, (req, res) => {
  const userId = asId(req.params.userId);
  if (userId === null) return badRequest(res, "Invalid user id.");
  const user = db
    .prepare("SELECT id, role, dice_skin, allowed_dice_skins FROM users WHERE id = ?")
    .get(userId);
  if (!user) return badRequest(res, "User not found.");
  if (user.role === "admin") {
    return badRequest(res, "Dice skin access is only configurable for player accounts.");
  }

  const allowedDiceSkins = normalizeAllowedDiceSkinKeys(req.body?.allowedDiceSkins);
  const effectiveDiceSkin = allowedDiceSkins.includes(normalizeDiceSkinKey(user.dice_skin))
    ? normalizeDiceSkinKey(user.dice_skin)
    : "default";

  db.prepare(
    `UPDATE users
     SET allowed_dice_skins = ?, dice_skin = ?, updated_at = datetime('now')
     WHERE id = ?`
  ).run(serializeAllowedDiceSkinKeys(allowedDiceSkins), effectiveDiceSkin, userId);
  return res.status(204).send();
});

app.post("/api/admin/users/:userId/active", requireAdmin, (req, res) => {
  const userId = asId(req.params.userId);
  const activeInput = req.body?.active;
  const active =
    activeInput === true ||
    activeInput === 1 ||
    `${activeInput || ""}`.trim().toLowerCase() === "true" ||
    `${activeInput || ""}`.trim() === "1";
  if (userId === null) return badRequest(res, "Invalid user id.");
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!user) return badRequest(res, "User not found.");
  db.prepare("UPDATE users SET active = ?, updated_at = datetime('now') WHERE id = ?").run(
    active ? 1 : 0,
    userId
  );
  if (!active) {
    db.prepare("DELETE FROM user_sessions WHERE user_id = ?").run(userId);
    closeStreamsForUser(userId);
  }
  return res.status(204).send();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, dbPath });
});

app.get("/api/monsters", (_req, res) => {
  if (!isAdminUser(_req.authUser)) {
    return res.status(403).json({ error: "Monster library access denied." });
  }
  const monsters = db
    .prepare(
      `SELECT
        id, name, size, type, alignment, armor_class, hit_points, speed,
        str_score, dex_score, con_score, int_score, wis_score, cha_score,
        challenge_rating, proficiency_bonus, senses, languages,
        traits, actions, monster_image_data, token_image_data, is_legendary, legendary_actions_count, source, created_at, updated_at
       FROM monster_statblocks
       ORDER BY name ASC`
    )
    .all();
  res.json(monsters);
});

app.post("/api/monsters", (req, res) => {
  const parsed = parseMonsterPayload(req.body);
  if (parsed.error) return badRequest(res, parsed.error);
  const m = parsed.fields;

  try {
    const result = db
      .prepare(
        `INSERT INTO monster_statblocks (
          name, size, type, alignment, armor_class, hit_points, speed,
          str_score, dex_score, con_score, int_score, wis_score, cha_score,
          challenge_rating, proficiency_bonus, senses, languages, traits, actions, monster_image_data, token_image_data, is_legendary, legendary_actions_count, source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        m.name,
        m.size,
        m.type,
        m.alignment,
        m.armor_class,
        m.hit_points,
        m.speed,
        m.str_score,
        m.dex_score,
        m.con_score,
        m.int_score,
        m.wis_score,
        m.cha_score,
        m.challenge_rating,
        m.proficiency_bonus,
        m.senses,
        m.languages,
        m.traits,
        m.actions,
        m.monster_image_data,
        m.token_image_data,
        m.is_legendary,
        m.legendary_actions_count,
        m.source
      );

    const created = db
      .prepare("SELECT * FROM monster_statblocks WHERE id = ?")
      .get(result.lastInsertRowid);
    res.status(201).json(created);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return badRequest(res, "Monster name must be unique.");
    }
    throw error;
  }
});

app.put("/api/monsters/:monsterId", (req, res) => {
  const monsterId = asId(req.params.monsterId);
  if (monsterId === null) return badRequest(res, "Invalid monster id.");

  const existing = db
    .prepare("SELECT id FROM monster_statblocks WHERE id = ?")
    .get(monsterId);
  if (!existing) return badRequest(res, "Monster not found.");

  const parsed = parseMonsterPayload(req.body);
  if (parsed.error) return badRequest(res, parsed.error);
  const m = parsed.fields;

  try {
    db.prepare(
      `UPDATE monster_statblocks
       SET name = ?, size = ?, type = ?, alignment = ?, armor_class = ?, hit_points = ?, speed = ?,
           str_score = ?, dex_score = ?, con_score = ?, int_score = ?, wis_score = ?, cha_score = ?,
           challenge_rating = ?, proficiency_bonus = ?, senses = ?, languages = ?, traits = ?, actions = ?, monster_image_data = ?, token_image_data = ?, is_legendary = ?, legendary_actions_count = ?, source = ?,
           updated_at = datetime('now')
       WHERE id = ?`
    ).run(
      m.name,
      m.size,
      m.type,
      m.alignment,
      m.armor_class,
      m.hit_points,
      m.speed,
      m.str_score,
      m.dex_score,
      m.con_score,
      m.int_score,
      m.wis_score,
      m.cha_score,
      m.challenge_rating,
      m.proficiency_bonus,
      m.senses,
      m.languages,
      m.traits,
      m.actions,
      m.monster_image_data,
      m.token_image_data,
      m.is_legendary,
      m.legendary_actions_count,
      m.source,
      monsterId
    );
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return badRequest(res, "Monster name must be unique.");
    }
    throw error;
  }

  const updated = db.prepare("SELECT * FROM monster_statblocks WHERE id = ?").get(monsterId);
  res.json(updated);
});

app.delete("/api/monsters/:monsterId", (req, res) => {
  const monsterId = asId(req.params.monsterId);
  if (monsterId === null) return badRequest(res, "Invalid monster id.");

  const existing = db
    .prepare("SELECT id FROM monster_statblocks WHERE id = ?")
    .get(monsterId);
  if (!existing) return badRequest(res, "Monster not found.");

  db.prepare("DELETE FROM monster_statblocks WHERE id = ?").run(monsterId);
  res.status(204).send();
});

app.get("/api/campaigns", (_req, res) => {
  const baseSelect = `SELECT
      c.id,
      c.name,
      c.created_at,
      COALESCE(cs.total_enemy_damage, 0) AS total_enemy_damage,
      COALESCE(cs.total_enemy_defeats, 0) AS total_enemy_defeats,
      (
        SELECT COUNT(*)
        FROM combat_scenarios s
        WHERE s.campaign_id = c.id
      ) AS total_encounters,
      (
        SELECT COUNT(*)
        FROM combat_scenarios s
        WHERE s.campaign_id = c.id
          AND s.is_completed = 1
      ) AS total_finished_encounters
    FROM campaigns c
    LEFT JOIN campaign_stats cs ON cs.campaign_id = c.id`;

  const campaigns = isAdminUser(_req.authUser)
    ? db
      .prepare(`${baseSelect} ORDER BY c.name ASC`)
      .all()
    : db
      .prepare(
        `${baseSelect}
         JOIN campaign_members cm ON cm.campaign_id = c.id
         WHERE cm.user_id = ?
         ORDER BY c.name ASC`
      )
      .all(_req.authUser.id);
  res.json(campaigns);
});

app.get("/api/campaigns/:campaignId/stats", (req, res) => {
  const campaignId = asId(req.params.campaignId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (!ensureCampaignAccess(req, res, campaignId)) return;

  const totals = db
    .prepare(
      `SELECT
        COALESCE(cs.total_enemy_damage, 0) AS total_enemy_damage,
        COALESCE(cs.total_enemy_defeats, 0) AS total_enemy_defeats,
        (
          SELECT COUNT(*)
          FROM combat_scenarios s
          WHERE s.campaign_id = ?
        ) AS total_encounters,
        (
          SELECT COUNT(*)
          FROM combat_scenarios s
          WHERE s.campaign_id = ?
            AND s.is_completed = 1
        ) AS total_finished_encounters
       FROM campaigns c
       LEFT JOIN campaign_stats cs ON cs.campaign_id = c.id
       WHERE c.id = ?`
    )
    .get(campaignId, campaignId, campaignId);
  if (!totals) return badRequest(res, "Campaign not found.");

  const enemyConditionRows = db
    .prepare(
      `SELECT condition_key, apply_count
       FROM campaign_condition_stats
       WHERE campaign_id = ?
         AND target_group = 'enemy'
       ORDER BY apply_count DESC, condition_key ASC`
    )
    .all(campaignId);
  const enemyConditionApplies = {};
  for (const row of enemyConditionRows) {
    enemyConditionApplies[row.condition_key] = Number(row.apply_count) || 0;
  }

  const pcDownCount = db
    .prepare(
      `SELECT COALESCE(apply_count, 0) AS apply_count
       FROM campaign_condition_stats
       WHERE campaign_id = ?
         AND target_group = 'pc'
         AND condition_key = 'down'`
    )
    .get(campaignId);

  const pcInitiativeRows = db
    .prepare(
      `SELECT
        c.id AS character_id,
        c.name AS character_name,
        c.class_name AS character_class,
        cu.profile_image_data AS claimed_profile_image_data,
        COUNT(sc.id) AS encounter_count,
        AVG(sc.initiative) AS avg_initiative
       FROM characters c
       LEFT JOIN character_claims cc ON cc.character_id = c.id
       LEFT JOIN users cu ON cu.id = cc.user_id
       LEFT JOIN combat_scenarios cs
         ON cs.campaign_id = c.campaign_id
       LEFT JOIN scenario_combatants sc
         ON sc.scenario_id = cs.id
        AND sc.kind = 'character'
        AND sc.character_id = c.id
       WHERE c.campaign_id = ?
       GROUP BY c.id, c.name, c.class_name, cu.profile_image_data
       ORDER BY c.name ASC`
    )
    .all(campaignId)
    .map((row) => {
      const encounterCount = Number(row.encounter_count) || 0;
      const rawAvg = Number(row.avg_initiative);
      const averageInitiative = Number.isFinite(rawAvg)
        ? Math.round(rawAvg * 100) / 100
        : null;
      return {
        characterId: Number(row.character_id),
        characterName: row.character_name,
        characterClass: row.character_class || "",
        claimedProfileImageData: `${row.claimed_profile_image_data || ""}`,
        encounterCount,
        averageInitiative
      };
    });

  res.json({
    campaignId,
    totalEnemyDamage: Number(totals.total_enemy_damage) || 0,
    totalEnemyDefeats: Number(totals.total_enemy_defeats) || 0,
    totalEncounters: Number(totals.total_encounters) || 0,
    totalFinishedEncounters: Number(totals.total_finished_encounters) || 0,
    enemyConditionApplies,
    pcDownCount: Number(pcDownCount?.apply_count) || 0,
    pcInitiativeAverages: pcInitiativeRows
  });
});

app.post("/api/campaigns", (req, res) => {
  const name = `${req.body?.name || ""}`.trim();
  if (!name) return badRequest(res, "Campaign name is required.");

  try {
    const tx = db.transaction((campaignName) => {
      const result = db
        .prepare("INSERT INTO campaigns (name) VALUES (?)")
        .run(campaignName);
      db.prepare("INSERT OR IGNORE INTO campaign_stats (campaign_id) VALUES (?)").run(
        result.lastInsertRowid
      );
      return result.lastInsertRowid;
    });
    const campaignId = tx(name);
    const campaign = db
      .prepare("SELECT id, name, created_at FROM campaigns WHERE id = ?")
      .get(campaignId);
    res.status(201).json(campaign);
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return badRequest(res, "Campaign name must be unique.");
    }
    throw error;
  }
});

app.delete("/api/campaigns/:campaignId", (req, res) => {
  const campaignId = asId(req.params.campaignId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");

  const existing = db.prepare("SELECT id FROM campaigns WHERE id = ?").get(campaignId);
  if (!existing) return badRequest(res, "Campaign not found.");

  const affectedUserIds = db
    .prepare(
      `SELECT DISTINCT user_id
       FROM campaign_members
       WHERE campaign_id = ?`
    )
    .all(campaignId)
    .map((row) => row.user_id)
    .filter((userId) => Number.isInteger(userId));

  db.prepare("DELETE FROM campaigns WHERE id = ?").run(campaignId);
  for (const userId of affectedUserIds) {
    ensureValidActiveCampaignForUser(userId);
    schedulePlayerLivePushForUser(userId);
  }
  res.status(204).send();
});

app.get("/api/campaigns/:campaignId/members", requireAdmin, (req, res) => {
  const campaignId = asId(req.params.campaignId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (!campaignExists(campaignId)) return badRequest(res, "Campaign not found.");

  const members = db
    .prepare(
      `SELECT
        u.id AS user_id,
        u.username,
        u.role AS user_role,
        cm.role AS campaign_role,
        cm.created_at
       FROM campaign_members cm
       JOIN users u ON u.id = cm.user_id
       WHERE cm.campaign_id = ?
       ORDER BY u.username ASC`
    )
    .all(campaignId);
  res.json(members);
});

app.get("/api/campaigns/:campaignId/live", (req, res) => {
  const campaignId = asId(req.params.campaignId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (!ensureCampaignAccess(req, res, campaignId)) return;
  res.json(getCampaignLiveState(campaignId));
});

app.get("/api/campaigns/:campaignId/scenes", (req, res) => {
  const campaignId = asId(req.params.campaignId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (!ensureCampaignAccess(req, res, campaignId)) return;
  const scenes = db
    .prepare(
      `SELECT id, campaign_id, name, image_data, created_at, updated_at
       FROM campaign_scene_images
       ORDER BY updated_at DESC, id DESC`
    )
    .all();
  res.json(scenes);
});

app.post("/api/campaigns/:campaignId/scenes", (req, res) => {
  const campaignId = asId(req.params.campaignId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (!ensureCampaignAccess(req, res, campaignId)) return;
  const name = `${req.body?.name || ""}`.trim();
  const imageData = `${req.body?.imageData || ""}`.trim();
  if (!name) return badRequest(res, "Scene name is required.");
  if (!imageData) return badRequest(res, "Scene image is required.");
  if (imageData.length > 10_000_000) return badRequest(res, "Scene image is too large.");
  const result = db
    .prepare(
      `INSERT INTO campaign_scene_images (campaign_id, name, image_data, created_at, updated_at)
       VALUES (?, ?, ?, datetime('now'), datetime('now'))`
    )
    .run(campaignId, name, imageData);
  const scene = db
    .prepare(
      `SELECT id, campaign_id, name, image_data, created_at, updated_at
       FROM campaign_scene_images
       WHERE id = ?`
    )
    .get(result.lastInsertRowid);
  res.status(201).json(scene);
});

app.delete("/api/campaigns/:campaignId/scenes/:sceneId", (req, res) => {
  const campaignId = asId(req.params.campaignId);
  const sceneId = asId(req.params.sceneId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (sceneId === null) return badRequest(res, "Invalid scene id.");
  if (!ensureCampaignAccess(req, res, campaignId)) return;

  const scene = db.prepare("SELECT id FROM campaign_scene_images WHERE id = ?").get(sceneId);
  if (!scene) return badRequest(res, "Scene not found.");

  const affectedCampaignIds = db
    .prepare(
      `SELECT campaign_id
       FROM campaign_live_state
       WHERE shared_scene_image_id = ?`
    )
    .all(sceneId)
    .map((row) => row.campaign_id)
    .filter((value) => Number.isInteger(value));

  db.prepare("DELETE FROM campaign_scene_images WHERE id = ?").run(sceneId);
  db.prepare(
    `UPDATE campaign_live_state
     SET shared_scene_image_id = NULL,
         updated_at = datetime('now')
     WHERE shared_scene_image_id = ?`
  ).run(sceneId);
  for (const affectedCampaignId of affectedCampaignIds) {
    notifyPlayerLiveForCampaign(affectedCampaignId);
  }
  res.status(204).send();
});

app.post("/api/campaigns/:campaignId/scene/share", (req, res) => {
  const campaignId = asId(req.params.campaignId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (!ensureCampaignAccess(req, res, campaignId)) return;
  const sceneId = asId(req.body?.sceneId);
  if (sceneId === null) {
    db.prepare(
      `INSERT INTO campaign_live_state (campaign_id, shared_scene_image_id, updated_at)
       VALUES (?, NULL, datetime('now'))
       ON CONFLICT(campaign_id) DO UPDATE SET
         shared_scene_image_id = NULL,
         updated_at = datetime('now')`
    ).run(campaignId);
    notifyPlayerLiveForCampaign(campaignId);
    return res.json(getCampaignLiveState(campaignId));
  }

  const scene = db
    .prepare("SELECT id FROM campaign_scene_images WHERE id = ?")
    .get(sceneId);
  if (!scene) return badRequest(res, "Scene not found.");

  db.prepare(
    `INSERT INTO campaign_live_state (campaign_id, shared_scene_image_id, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(campaign_id) DO UPDATE SET
       shared_scene_image_id = excluded.shared_scene_image_id,
       updated_at = datetime('now')`
  ).run(campaignId, sceneId);
  notifyPlayerLiveForCampaign(campaignId);
  res.json(getCampaignLiveState(campaignId));
});

app.post("/api/campaigns/:campaignId/members", requireAdmin, (req, res) => {
  const campaignId = asId(req.params.campaignId);
  const userId = asId(req.body?.userId);
  const role = `${req.body?.role || "player"}`.trim().toLowerCase() === "dm" ? "dm" : "player";
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (userId === null) return badRequest(res, "Invalid user id.");
  if (!campaignExists(campaignId)) return badRequest(res, "Campaign not found.");
  const user = db
    .prepare("SELECT id, active FROM users WHERE id = ?")
    .get(userId);
  if (!user) return badRequest(res, "User not found.");
  if (Number(user.active) !== 1) return badRequest(res, "User is not active.");

  db.prepare(
    "INSERT OR REPLACE INTO campaign_members (campaign_id, user_id, role, created_at) VALUES (?, ?, ?, datetime('now'))"
  ).run(campaignId, userId, role);
  ensureValidActiveCampaignForUser(userId);
  schedulePlayerLivePushForUser(userId);
  notifyPlayerLiveForCampaign(campaignId);
  res.status(204).send();
});

app.delete("/api/campaigns/:campaignId/members/:userId", requireAdmin, (req, res) => {
  const campaignId = asId(req.params.campaignId);
  const userId = asId(req.params.userId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (userId === null) return badRequest(res, "Invalid user id.");
  if (!campaignExists(campaignId)) return badRequest(res, "Campaign not found.");

  db.prepare("DELETE FROM campaign_members WHERE campaign_id = ? AND user_id = ?").run(
    campaignId,
    userId
  );
  ensureValidActiveCampaignForUser(userId);
  schedulePlayerLivePushForUser(userId);
  notifyPlayerLiveForCampaign(campaignId);
  res.status(204).send();
});

app.get("/api/admin/campaigns/:campaignId/character-claims", requireAdmin, (req, res) => {
  const campaignId = asId(req.params.campaignId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (!campaignExists(campaignId)) return badRequest(res, "Campaign not found.");

  const claims = db
    .prepare(
      `SELECT
        ch.id AS character_id,
        ch.name AS character_name,
        ch.class_name,
        u.id AS user_id,
        u.username,
        cc.updated_at
       FROM character_claims cc
       JOIN characters ch ON ch.id = cc.character_id
       JOIN users u ON u.id = cc.user_id
       WHERE ch.campaign_id = ?
       ORDER BY ch.name ASC`
    )
    .all(campaignId);
  res.json(claims);
});

app.delete(
  "/api/admin/campaigns/:campaignId/character-claims/:characterId",
  requireAdmin,
  (req, res) => {
    const campaignId = asId(req.params.campaignId);
    const characterId = asId(req.params.characterId);
    if (campaignId === null) return badRequest(res, "Invalid campaign id.");
    if (characterId === null) return badRequest(res, "Invalid character id.");
    if (!campaignExists(campaignId)) return badRequest(res, "Campaign not found.");

    const character = db
      .prepare("SELECT id FROM characters WHERE id = ? AND campaign_id = ?")
      .get(characterId, campaignId);
    if (!character) return badRequest(res, "Character not found in campaign.");

    db.prepare("DELETE FROM character_claims WHERE character_id = ?").run(characterId);
    return res.status(204).send();
  }
);

app.post("/api/campaigns/:campaignId/live/clear", (req, res) => {
  const campaignId = asId(req.params.campaignId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (!ensureCampaignAccess(req, res, campaignId)) return;
  db.prepare(
    `INSERT INTO campaign_live_state (campaign_id, shared_scenario_id, updated_at)
     VALUES (?, NULL, datetime('now'))
     ON CONFLICT(campaign_id) DO UPDATE SET
       shared_scenario_id = NULL,
       updated_at = datetime('now')`
  ).run(campaignId);
  notifyPlayerLiveForCampaign(campaignId);
  res.json(getCampaignLiveState(campaignId));
});

app.post("/api/scenarios/:scenarioId/share", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");
  const scenario = ensureScenarioAccess(req, res, scenarioId);
  if (!scenario) return;

  db.prepare(
    `INSERT INTO campaign_live_state (campaign_id, shared_scenario_id, updated_at)
     VALUES (?, ?, datetime('now'))
     ON CONFLICT(campaign_id) DO UPDATE SET
       shared_scenario_id = excluded.shared_scenario_id,
       updated_at = datetime('now')`
  ).run(scenario.campaign_id, scenario.id);

  notifyPlayerLiveForCampaign(scenario.campaign_id);
  res.json(getCampaignLiveState(scenario.campaign_id));
});

app.get("/api/player/live", (req, res) => {
  if (isAdminUser(req.authUser)) {
    return res.json({ shared: null, scene: null });
  }
  return res.json(buildPlayerLiveSnapshotForUser(req.authUser.id));
});

app.get("/api/player/live/stream", (req, res) => {
  if (isAdminUser(req.authUser)) {
    return res.status(403).json({ error: "Player endpoint is not available for admin users." });
  }

  beginSseStream(res);
  writeSseEvent(res, "player-live", buildPlayerLiveSnapshotForUser(req.authUser.id));
  addPlayerLiveSubscriber(req.authUser.id, res);
});

function publishScenarioMapPing(scenarioId, campaignId, xRaw, yRaw, source = "dm") {
  const x = Math.max(-100000, Math.min(100000, Math.round(Number(xRaw) * 100) / 100));
  const y = Math.max(-100000, Math.min(100000, Math.round(Number(yRaw) * 100) / 100));
  const ping = {
    id: `${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
    x,
    y,
    source: source === "player" ? "player" : "dm",
    sentAt: new Date().toISOString()
  };
  const mapLastPingJson = JSON.stringify(ping);
  db.prepare(
    "UPDATE combat_scenarios SET map_last_ping_json = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(mapLastPingJson, scenarioId);
  notifyPlayerLiveForCampaign(campaignId);
  scheduleScenarioMapPushForScenario(scenarioId);
  return ping;
}

app.post("/api/player/live/map-token", (req, res) => {
  if (isAdminUser(req.authUser)) {
    return res.status(403).json({ error: "Player endpoint is not available for admin users." });
  }
  const scenarioIdInput = asId(req.body?.scenarioId);
  const combatantId = asId(req.body?.combatantId);
  const xRaw = Number(req.body?.x);
  const yRaw = Number(req.body?.y);
  if (scenarioIdInput === null) return badRequest(res, "Invalid scenario id.");
  if (combatantId === null) return badRequest(res, "Invalid combatant id.");
  if (!Number.isFinite(xRaw) || !Number.isFinite(yRaw)) {
    return badRequest(res, "Invalid token position.");
  }

  const activeCampaign = ensureValidActiveCampaignForUser(req.authUser.id);
  if (!Number.isInteger(activeCampaign.activeCampaignId)) {
    return res.status(403).json({ error: "No active campaign selected." });
  }
  const shared = db
    .prepare(
      `SELECT
        cls.campaign_id,
        cls.shared_scenario_id AS scenario_id
       FROM campaign_live_state cls
       WHERE cls.campaign_id = ?
         AND cls.shared_scenario_id IS NOT NULL
       LIMIT 1`
    )
    .get(activeCampaign.activeCampaignId);
  if (!shared || !Number.isInteger(shared.scenario_id)) {
    return res.status(403).json({ error: "No shared encounter available." });
  }
  if (shared.scenario_id !== scenarioIdInput) {
    return res.status(403).json({ error: "Encounter is no longer shared." });
  }

  const combatant = db
    .prepare(
      `SELECT id
       FROM scenario_combatants
       WHERE id = ?
         AND scenario_id = ?
         AND (kind = 'character' OR player_visible = 1)
       LIMIT 1`
    )
    .get(combatantId, shared.scenario_id);
  if (!combatant) {
    return badRequest(res, "Combatant is not movable in this encounter.");
  }

  const scenario = db
    .prepare("SELECT map_tokens_json FROM combat_scenarios WHERE id = ?")
    .get(shared.scenario_id);
  if (!scenario) return badRequest(res, "Scenario not found.");

  const tokensRaw = `${scenario.map_tokens_json || ""}`.trim();
  let tokens = {};
  if (tokensRaw) {
    try {
      const parsed = JSON.parse(tokensRaw);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        tokens = parsed;
      }
    } catch (_error) {
      tokens = {};
    }
  }

  const x = Math.max(-100000, Math.min(100000, Math.round(xRaw * 100) / 100));
  const y = Math.max(-100000, Math.min(100000, Math.round(yRaw * 100) / 100));
  tokens[combatantId] = { x, y };

  const mapTokensJson = JSON.stringify(tokens);
  db.prepare(
    "UPDATE combat_scenarios SET map_tokens_json = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(mapTokensJson, shared.scenario_id);
  notifyPlayerLiveForCampaign(shared.campaign_id);
  scheduleScenarioMapPushForScenario(shared.scenario_id);

  return res.json({
    scenarioId: shared.scenario_id,
    combatantId,
    x,
    y
  });
});

app.post("/api/player/live/map-ping", (req, res) => {
  if (isAdminUser(req.authUser)) {
    return res.status(403).json({ error: "Player endpoint is not available for admin users." });
  }
  const scenarioIdInput = asId(req.body?.scenarioId);
  const xRaw = Number(req.body?.x);
  const yRaw = Number(req.body?.y);
  if (scenarioIdInput === null) return badRequest(res, "Invalid scenario id.");
  if (!Number.isFinite(xRaw) || !Number.isFinite(yRaw)) {
    return badRequest(res, "Invalid ping position.");
  }

  const activeCampaign = ensureValidActiveCampaignForUser(req.authUser.id);
  if (!Number.isInteger(activeCampaign.activeCampaignId)) {
    return res.status(403).json({ error: "No active campaign selected." });
  }
  const shared = db
    .prepare(
      `SELECT
        cls.campaign_id,
        cls.shared_scenario_id AS scenario_id
       FROM campaign_live_state cls
       WHERE cls.campaign_id = ?
         AND cls.shared_scenario_id IS NOT NULL
       LIMIT 1`
    )
    .get(activeCampaign.activeCampaignId);
  if (!shared || !Number.isInteger(shared.scenario_id)) {
    return res.status(403).json({ error: "No shared encounter available." });
  }
  if (shared.scenario_id !== scenarioIdInput) {
    return res.status(403).json({ error: "Encounter is no longer shared." });
  }

  const ping = publishScenarioMapPing(shared.scenario_id, shared.campaign_id, xRaw, yRaw, "player");
  return res.json({ scenarioId: shared.scenario_id, ping });
});

app.get("/api/campaigns/:campaignId/characters", (req, res) => {
  const campaignId = Number(req.params.campaignId);
  if (!Number.isInteger(campaignId)) return badRequest(res, "Invalid campaign id.");
  if (!ensureCampaignAccess(req, res, campaignId)) return;

  const characters = db
    .prepare(
      "SELECT id, campaign_id, name, class_name, created_at FROM characters WHERE campaign_id = ? ORDER BY name ASC"
    )
    .all(campaignId);
  res.json(characters);
});

app.post("/api/campaigns/:campaignId/characters", (req, res) => {
  const campaignId = Number(req.params.campaignId);
  const name = `${req.body?.name || ""}`.trim();
  const className = `${req.body?.className || ""}`.trim();

  if (!Number.isInteger(campaignId)) return badRequest(res, "Invalid campaign id.");
  if (!name) return badRequest(res, "Character name is required.");
  if (!className) return badRequest(res, "Character class is required.");
  if (!CHARACTER_CLASSES.has(className)) {
    return badRequest(res, "Character class must be one of the official 5e classes.");
  }

  const campaignExists = db
    .prepare("SELECT 1 FROM campaigns WHERE id = ?")
    .get(campaignId);
  if (!campaignExists) return badRequest(res, "Campaign not found.");

  const result = db
    .prepare(
      "INSERT INTO characters (campaign_id, name, class_name) VALUES (?, ?, ?)"
    )
    .run(campaignId, name, className);

  // New campaign characters are present by default in all existing scenarios.
  db.prepare(
    `INSERT OR IGNORE INTO scenario_combatants (scenario_id, kind, character_id, name, initiative)
     SELECT s.id, 'character', ?, ?, 0
     FROM combat_scenarios s
     WHERE s.campaign_id = ?
       AND NOT EXISTS (
         SELECT 1 FROM scenario_character_exclusions e
         WHERE e.scenario_id = s.id AND e.character_id = ?
       )`
  ).run(result.lastInsertRowid, name, campaignId, result.lastInsertRowid);

  const character = db
    .prepare(
      "SELECT id, campaign_id, name, class_name, created_at FROM characters WHERE id = ?"
    )
    .get(result.lastInsertRowid);

  res.status(201).json(character);
});

app.get("/api/campaigns/:campaignId/scenarios", (req, res) => {
  const campaignId = asId(req.params.campaignId);
  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (!ensureCampaignAccess(req, res, campaignId)) return;

  const scenarios = db
    .prepare(
      "SELECT id, campaign_id, name, notes, map_image_data, map_tokens_json, map_fog_data, map_last_ping_json, map_token_size, is_completed, current_round, current_turn_index, created_at, updated_at FROM combat_scenarios WHERE campaign_id = ? ORDER BY id DESC"
    )
    .all(campaignId);
  res.json(scenarios);
});

app.post("/api/campaigns/:campaignId/scenarios", (req, res) => {
  const campaignId = asId(req.params.campaignId);
  const name = `${req.body?.name || ""}`.trim();
  const notes = `${req.body?.notes || ""}`;

  if (campaignId === null) return badRequest(res, "Invalid campaign id.");
  if (!name) return badRequest(res, "Scenario name is required.");

  const campaignExists = db
    .prepare("SELECT 1 FROM campaigns WHERE id = ?")
    .get(campaignId);
  if (!campaignExists) return badRequest(res, "Campaign not found.");

  const result = db
    .prepare("INSERT INTO combat_scenarios (campaign_id, name, notes) VALUES (?, ?, ?)")
    .run(campaignId, name, notes);

  // Campaign player characters are added by default to new scenarios.
  db.prepare(
    `INSERT OR IGNORE INTO scenario_combatants (scenario_id, kind, character_id, name, initiative)
     SELECT ?, 'character', c.id, c.name, 0 FROM characters c WHERE c.campaign_id = ?`
  ).run(result.lastInsertRowid, campaignId);

  const scenario = db
    .prepare(
      "SELECT id, campaign_id, name, notes, map_image_data, map_tokens_json, map_fog_data, map_last_ping_json, map_token_size, is_completed, current_round, current_turn_index, created_at, updated_at FROM combat_scenarios WHERE id = ?"
    )
    .get(result.lastInsertRowid);

  res.status(201).json(scenario);
});

app.put("/api/scenarios/:scenarioId", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  const name = `${req.body?.name || ""}`.trim();
  const notes = `${req.body?.notes || ""}`;
  const mapProvided = Object.prototype.hasOwnProperty.call(req.body || {}, "mapImageData");
  const mapImageData = `${req.body?.mapImageData || ""}`;

  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");
  if (!name) return badRequest(res, "Scenario name is required.");

  const existing = db
    .prepare("SELECT id, map_image_data FROM combat_scenarios WHERE id = ?")
    .get(scenarioId);
  if (!existing) return badRequest(res, "Scenario not found.");

  const finalMap = mapProvided ? mapImageData : existing.map_image_data || "";

  db.prepare(
    "UPDATE combat_scenarios SET name = ?, notes = ?, map_image_data = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(name, notes, finalMap, scenarioId);

  const updated = db
    .prepare(
      "SELECT id, campaign_id, name, notes, map_image_data, map_tokens_json, map_fog_data, map_last_ping_json, map_token_size, is_completed, current_round, current_turn_index, created_at, updated_at FROM combat_scenarios WHERE id = ?"
    )
    .get(scenarioId);
  notifyPlayerLiveForScenario(scenarioId);
  res.json(updated);
});

app.get("/api/scenarios/:scenarioId/stream", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");
  const scenario = ensureScenarioAccess(req, res, scenarioId);
  if (!scenario) return;

  beginSseStream(res);
  writeSseEvent(res, "scenario-map", {
    scenarioId: scenario.id,
    mapTokensJson: `${scenario.map_tokens_json || ""}`,
    mapFogData: `${scenario.map_fog_data || ""}`,
    mapLastPingJson: `${scenario.map_last_ping_json || ""}`,
    mapTokenSize: Number.isInteger(Number(scenario.map_token_size)) ? Number(scenario.map_token_size) : 44,
    updatedAt: scenario.updated_at || null
  });
  addScenarioMapSubscriber(scenario.id, res, req.authUser.id);
});

app.post("/api/scenarios/:scenarioId/map-tokens", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = ensureScenarioAccess(req, res, scenarioId);
  if (!scenario) return;

  const tokensInput = req.body?.tokens;
  if (!tokensInput || typeof tokensInput !== "object" || Array.isArray(tokensInput)) {
    return badRequest(res, "tokens must be an object keyed by combatant id.");
  }

  const normalized = {};
  for (const [key, value] of Object.entries(tokensInput)) {
    const combatantId = Number(key);
    const x = Number(value?.x);
    const y = Number(value?.y);
    if (!Number.isInteger(combatantId) || !Number.isFinite(x) || !Number.isFinite(y)) continue;
    normalized[combatantId] = {
      x: Math.max(-100000, Math.min(100000, Math.round(x * 100) / 100)),
      y: Math.max(-100000, Math.min(100000, Math.round(y * 100) / 100))
    };
  }

  const mapTokensJson = JSON.stringify(normalized);
  db.prepare(
    "UPDATE combat_scenarios SET map_tokens_json = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(mapTokensJson, scenarioId);
  notifyPlayerLiveForScenario(scenarioId);
  scheduleScenarioMapPushForScenario(scenarioId);

  res.json({ scenarioId, mapTokensJson });
});

app.post("/api/scenarios/:scenarioId/map-token-size", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = ensureScenarioAccess(req, res, scenarioId);
  if (!scenario) return;

  const tokenSizeRaw = Number(req.body?.tokenSize);
  if (!Number.isFinite(tokenSizeRaw)) {
    return badRequest(res, "tokenSize must be a number.");
  }
  const tokenSize = Math.max(24, Math.min(128, Math.round(tokenSizeRaw)));

  db.prepare(
    "UPDATE combat_scenarios SET map_token_size = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(tokenSize, scenarioId);
  notifyPlayerLiveForScenario(scenarioId);
  scheduleScenarioMapPushForScenario(scenarioId);

  res.json({ scenarioId, mapTokenSize: tokenSize });
});

app.post("/api/scenarios/:scenarioId/map-ping", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = ensureScenarioAccess(req, res, scenarioId);
  if (!scenario) return;

  const xRaw = Number(req.body?.x);
  const yRaw = Number(req.body?.y);
  if (!Number.isFinite(xRaw) || !Number.isFinite(yRaw)) {
    return badRequest(res, "Invalid ping position.");
  }

  const source = isAdminUser(req.authUser) ? "dm" : "player";
  const ping = publishScenarioMapPing(scenarioId, scenario.campaign_id, xRaw, yRaw, source);
  res.json({ scenarioId, ping });
});

app.post("/api/scenarios/:scenarioId/map-fog", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = ensureScenarioAccess(req, res, scenarioId);
  if (!scenario) return;

  const fogDataRaw = `${req.body?.fogData || ""}`.trim();
  if (fogDataRaw.length > 2_000_000) {
    return badRequest(res, "fogData is too large.");
  }
  const fogData =
    fogDataRaw && fogDataRaw.startsWith("data:image/")
      ? fogDataRaw
      : "";

  db.prepare(
    "UPDATE combat_scenarios SET map_fog_data = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(fogData, scenarioId);
  notifyPlayerLiveForScenario(scenarioId);
  scheduleScenarioMapPushForScenario(scenarioId);

  res.json({ scenarioId, mapFogData: fogData });
});

app.post("/api/scenarios/:scenarioId/completed", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  const completedInput = req.body?.completed;
  const completed =
    completedInput === true ||
    completedInput === 1 ||
    `${completedInput || ""}`.trim().toLowerCase() === "true" ||
    `${completedInput || ""}`.trim() === "1";

  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = ensureScenarioAccess(req, res, scenarioId);
  if (!scenario) return;

  db.prepare(
    "UPDATE combat_scenarios SET is_completed = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(completed ? 1 : 0, scenarioId);
  if (completed) {
    db.prepare(
      `UPDATE campaign_live_state
       SET shared_scenario_id = NULL,
           updated_at = datetime('now')
       WHERE campaign_id = ?
         AND shared_scenario_id = ?`
    ).run(scenario.campaign_id, scenarioId);
  }

  const updated = db
    .prepare(
      "SELECT id, campaign_id, name, notes, map_image_data, map_tokens_json, map_fog_data, map_last_ping_json, map_token_size, is_completed, current_round, current_turn_index, created_at, updated_at FROM combat_scenarios WHERE id = ?"
    )
    .get(scenarioId);
  notifyPlayerLiveForCampaign(scenario.campaign_id);
  res.json(updated);
});

app.get("/api/scenarios/:scenarioId", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = ensureScenarioAccess(req, res, scenarioId);
  if (!scenario) return;

  const current = getScenario(scenarioId);
  if (!current) return badRequest(res, "Scenario not found.");
  return res.json(current);
});

app.get("/api/scenarios/:scenarioId/combat", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = ensureScenarioAccess(req, res, scenarioId);
  if (!scenario) return;

  ensureScenarioHasCampaignCharacters(scenario);
  const combatants = listCombatants(scenarioId);
  const state = normalizeCombatState(scenario, combatants);
  res.json({
    scenarioId,
    round: state.round,
    turnIndex: state.turnIndex,
    activeCombatantId: state.activeCombatantId,
    combatants
  });
});

app.post("/api/scenarios/:scenarioId/combatants", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  const kind = `${req.body?.kind || ""}`.trim();
  const enemyRoleInput = `${req.body?.enemyRole || ""}`.trim().toLowerCase();
  const enemyRole = enemyRoleInput === "ally" || enemyRoleInput === "npc" ? "ally" : "enemy";
  const nameInput = `${req.body?.name || ""}`.trim();
  const monsterId = req.body?.monsterId == null ? null : asId(req.body.monsterId);
  const initiative = Number(req.body?.initiative);
  const hp = req.body?.hp == null || req.body?.hp === "" ? null : Number(req.body.hp);
  const isLegendaryInput = req.body?.isLegendary;
  const isLegendaryRequested =
    isLegendaryInput === true ||
    isLegendaryInput === 1 ||
    `${isLegendaryInput || ""}`.trim().toLowerCase() === "true" ||
    `${isLegendaryInput || ""}`.trim() === "1";
  const legendaryActionsCountRaw = req.body?.legendaryActionsCount;
  const legendaryActionsCount =
    legendaryActionsCountRaw == null || legendaryActionsCountRaw === ""
      ? null
      : Number(legendaryActionsCountRaw);
  const conditionKeysInput = Array.isArray(req.body?.conditionKeys)
    ? req.body.conditionKeys
    : [];
  const singleConditionInput = `${req.body?.conditionKey || ""}`.trim().toLowerCase();
  const conditionKeys = [
    ...new Set(
      (conditionKeysInput.length > 0 ? conditionKeysInput : singleConditionInput ? [singleConditionInput] : [])
        .map((value) => `${value || ""}`.trim().toLowerCase())
        .filter(Boolean)
    )
  ];

  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");
  if (kind !== "character" && kind !== "enemy") {
    return badRequest(res, "Combatant kind must be character or enemy.");
  }
  if (!Number.isFinite(initiative)) return badRequest(res, "Initiative is required.");
  if (hp !== null && !Number.isFinite(hp)) return badRequest(res, "HP must be a number.");
  if (conditionKeys.some((key) => !CONDITION_KEYS.has(key))) {
    return badRequest(res, "Invalid condition.");
  }
  if (kind === "character") {
    return badRequest(
      res,
      "Character combatants are managed automatically from campaign characters."
    );
  }

  const scenario = ensureScenarioAccess(req, res, scenarioId);
  if (!scenario) return;

  let name = nameInput;
  let hpFromMonster = null;
  let legendaryFromMonster = null;
  let legendaryCountFromMonster = null;
  if (monsterId !== null) {
    const monster = db
      .prepare(
        "SELECT id, name, hit_points, is_legendary, legendary_actions_count FROM monster_statblocks WHERE id = ?"
      )
      .get(monsterId);
    if (!monster) return badRequest(res, "Monster not found.");
    if (!name) name = monster.name;
    const hpMatch = /\d+/.exec(monster.hit_points || "");
    if (hpMatch) hpFromMonster = Number(hpMatch[0]);
    legendaryFromMonster = Number(monster.is_legendary) === 1;
    legendaryCountFromMonster = Number(monster.legendary_actions_count);
  }
  if (!name) {
    return badRequest(res, "Enemy name is required.");
  }
  const requestedLegendaryCount =
    Number.isInteger(legendaryActionsCount) && legendaryActionsCount >= 2 && legendaryActionsCount <= 4
      ? legendaryActionsCount
      : null;
  const monsterLegendaryCount =
    Number.isInteger(legendaryCountFromMonster) && legendaryCountFromMonster >= 2 && legendaryCountFromMonster <= 4
      ? legendaryCountFromMonster
      : null;
  const isLegendary =
    Boolean(legendaryFromMonster) ||
    (enemyRole === "ally" && isLegendaryRequested);
  const finalLegendaryActionsCount = isLegendary
    ? requestedLegendaryCount ?? monsterLegendaryCount
    : null;
  if (isLegendary && !Number.isInteger(finalLegendaryActionsCount)) {
    return badRequest(res, "Legendary actions count is required when Is Legendary is true.");
  }

  const result = db
    .prepare(
      "INSERT INTO scenario_combatants (scenario_id, kind, enemy_role, is_legendary, legendary_actions_count, legendary_actions_remaining, character_id, monster_id, name, initiative, hp, condition_key) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)"
    )
    .run(
      scenarioId,
      kind,
      enemyRole,
      isLegendary ? 1 : 0,
      finalLegendaryActionsCount,
      isLegendary ? finalLegendaryActionsCount : null,
      null,
      monsterId,
      name,
      Math.trunc(initiative),
      hp === null ? (hpFromMonster == null ? null : hpFromMonster) : Math.trunc(hp)
    );

  if (conditionKeys.length > 0) {
    const insertCondition = db.prepare(
      "INSERT OR IGNORE INTO scenario_combatant_conditions (combatant_id, condition_key) VALUES (?, ?)"
    );
    const tx = db.transaction((keys) => {
      for (const key of keys) {
        insertCondition.run(result.lastInsertRowid, key);
      }
    });
    tx(conditionKeys);
  }

  const combatant = getCombatantById(result.lastInsertRowid);

  notifyPlayerLiveForScenario(scenarioId);
  res.status(201).json(combatant);
});

app.delete("/api/characters/:characterId", (req, res) => {
  const characterId = asId(req.params.characterId);
  if (characterId === null) return badRequest(res, "Invalid character id.");

  const character = db
    .prepare("SELECT id FROM characters WHERE id = ?")
    .get(characterId);
  if (!character) return badRequest(res, "Character not found.");

  db.prepare("DELETE FROM scenario_character_exclusions WHERE character_id = ?").run(
    characterId
  );
  db.prepare("DELETE FROM scenario_combatants WHERE character_id = ?").run(characterId);
  db.prepare("DELETE FROM characters WHERE id = ?").run(characterId);
  res.status(204).send();
});

app.delete("/api/scenarios/:scenarioId", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = db
    .prepare("SELECT id, campaign_id FROM combat_scenarios WHERE id = ?")
    .get(scenarioId);
  if (!scenario) return badRequest(res, "Scenario not found.");

  db.prepare("DELETE FROM combat_scenarios WHERE id = ?").run(scenarioId);
  notifyPlayerLiveForCampaign(scenario.campaign_id);
  scheduleScenarioMapPushForScenario(scenarioId);
  res.status(204).send();
});

app.delete("/api/combatants/:combatantId", (req, res) => {
  const combatantId = asId(req.params.combatantId);
  if (combatantId === null) return badRequest(res, "Invalid combatant id.");

  const combatant = db
    .prepare(
      `SELECT sc.id, sc.scenario_id, sc.kind, sc.character_id, cs.campaign_id
       FROM scenario_combatants sc
       JOIN combat_scenarios cs ON cs.id = sc.scenario_id
       WHERE sc.id = ?`
    )
    .get(combatantId);
  if (!combatant) return badRequest(res, "Combatant not found.");

  if (combatant.kind === "character" && combatant.character_id) {
    db.prepare(
      "INSERT OR IGNORE INTO scenario_character_exclusions (scenario_id, character_id) VALUES (?, ?)"
    ).run(combatant.scenario_id, combatant.character_id);
  }

  db.prepare("DELETE FROM scenario_combatants WHERE id = ?").run(combatantId);
  notifyPlayerLiveForCampaign(combatant.campaign_id);
  res.status(204).send();
});

app.put("/api/combatants/:combatantId", (req, res) => {
  const combatantId = asId(req.params.combatantId);
  const hasInitiative = Object.prototype.hasOwnProperty.call(req.body || {}, "initiative");
  const initiative = Number(req.body?.initiative);
  const nextName = `${req.body?.name || ""}`.trim();
  const hpProvided = Object.prototype.hasOwnProperty.call(req.body || {}, "hp");
  const hpRaw = req.body?.hp;
  const hp =
    hpRaw == null || hpRaw === "" ? null : Number(hpRaw);
  const conditionProvided = Object.prototype.hasOwnProperty.call(req.body || {}, "conditionKey");
  const conditionRaw = `${req.body?.conditionKey || ""}`.trim().toLowerCase();
  const conditionKey = conditionRaw || null;

  if (combatantId === null) return badRequest(res, "Invalid combatant id.");
  if (hasInitiative && !Number.isFinite(initiative)) {
    return badRequest(res, "Initiative must be a number.");
  }
  if (hpProvided && hp !== null && !Number.isFinite(hp)) {
    return badRequest(res, "HP must be a number.");
  }
  if (conditionProvided && conditionKey && !CONDITION_KEYS.has(conditionKey)) {
    return badRequest(res, "Invalid condition.");
  }

  const existing = db
    .prepare(
      `SELECT
        sc.id,
        sc.scenario_id,
        sc.kind,
        sc.enemy_role,
        sc.character_id,
        sc.name,
        sc.initiative,
        sc.hp,
        s.campaign_id
       FROM scenario_combatants sc
       JOIN combat_scenarios s ON s.id = sc.scenario_id
       WHERE sc.id = ?`
    )
    .get(combatantId);
  if (!existing) return badRequest(res, "Combatant not found.");

  const finalName =
    existing.kind === "enemy" && nextName ? nextName : existing.name;
  const finalInitiative = hasInitiative ? Math.trunc(initiative) : existing.initiative;
  const finalHp =
    existing.kind === "enemy" && hpProvided
      ? hp
      : existing.hp;
  db.prepare("UPDATE scenario_combatants SET name = ?, initiative = ?, hp = ? WHERE id = ?").run(
    finalName,
    finalInitiative,
    finalHp,
    combatantId
  );
  if (existing.kind === "enemy" && existing.enemy_role !== "ally") {
    const { damage, defeats } = computeEnemyDamageAndDefeatDelta(existing.hp, finalHp);
    applyCampaignEnemyStatsDelta(existing.campaign_id, damage, defeats);
  }

  if (conditionProvided) {
    const hadConditionAlready = conditionKey
      ? Boolean(
        db
          .prepare(
            "SELECT 1 FROM scenario_combatant_conditions WHERE combatant_id = ? AND condition_key = ?"
          )
          .get(combatantId, conditionKey)
      )
      : false;
    db.prepare("DELETE FROM scenario_combatant_conditions WHERE combatant_id = ?").run(
      combatantId
    );
    if (conditionKey) {
      const insertResult = db.prepare(
        "INSERT OR IGNORE INTO scenario_combatant_conditions (combatant_id, condition_key) VALUES (?, ?)"
      ).run(combatantId, conditionKey);
      if (insertResult.changes > 0 && !hadConditionAlready) {
        const targetGroup = campaignConditionTargetGroup(existing, conditionKey);
        incrementCampaignConditionApplyCount(existing.campaign_id, targetGroup, conditionKey);
      }
    }
  }

  const updated = getCombatantById(combatantId);

  notifyPlayerLiveForScenario(existing.scenario_id);
  res.json(updated);
});

app.post("/api/combatants/:combatantId/conditions", (req, res) => {
  const combatantId = asId(req.params.combatantId);
  const conditionKey = `${req.body?.conditionKey || ""}`.trim().toLowerCase();

  if (combatantId === null) return badRequest(res, "Invalid combatant id.");
  if (!conditionKey || !CONDITION_KEYS.has(conditionKey)) {
    return badRequest(res, "Invalid condition.");
  }

  const existing = db
    .prepare(
      `SELECT
        sc.id,
        sc.kind,
        sc.enemy_role,
        s.campaign_id
       FROM scenario_combatants sc
       JOIN combat_scenarios s ON s.id = sc.scenario_id
       WHERE sc.id = ?`
    )
    .get(combatantId);
  if (!existing) return badRequest(res, "Combatant not found.");

  const insertResult = db.prepare(
    "INSERT OR IGNORE INTO scenario_combatant_conditions (combatant_id, condition_key) VALUES (?, ?)"
  ).run(combatantId, conditionKey);
  if (insertResult.changes > 0) {
    const targetGroup = campaignConditionTargetGroup(existing, conditionKey);
    incrementCampaignConditionApplyCount(existing.campaign_id, targetGroup, conditionKey);
  }

  notifyPlayerLiveForCombatant(combatantId);
  res.json(getCombatantById(combatantId));
});

app.delete("/api/combatants/:combatantId/conditions/:conditionKey", (req, res) => {
  const combatantId = asId(req.params.combatantId);
  const conditionKey = `${req.params.conditionKey || ""}`.trim().toLowerCase();

  if (combatantId === null) return badRequest(res, "Invalid combatant id.");
  if (!conditionKey || !CONDITION_KEYS.has(conditionKey)) {
    return badRequest(res, "Invalid condition.");
  }

  const existing = db.prepare("SELECT id FROM scenario_combatants WHERE id = ?").get(combatantId);
  if (!existing) return badRequest(res, "Combatant not found.");

  db.prepare(
    "DELETE FROM scenario_combatant_conditions WHERE combatant_id = ? AND condition_key = ?"
  ).run(combatantId, conditionKey);

  notifyPlayerLiveForCombatant(combatantId);
  res.json(getCombatantById(combatantId));
});

app.post("/api/combatants/:combatantId/hp-adjust", (req, res) => {
  const combatantId = asId(req.params.combatantId);
  const delta = Number(req.body?.delta);

  if (combatantId === null) return badRequest(res, "Invalid combatant id.");
  if (!Number.isFinite(delta)) return badRequest(res, "delta is required.");

  const existing = db
    .prepare(
      `SELECT
        sc.id,
        sc.kind,
        sc.enemy_role,
        sc.hp,
        s.campaign_id
       FROM scenario_combatants sc
       JOIN combat_scenarios s ON s.id = sc.scenario_id
       WHERE sc.id = ?`
    )
    .get(combatantId);
  if (!existing) return badRequest(res, "Combatant not found.");
  if (existing.kind !== "enemy") return badRequest(res, "HP adjustment is only for enemies.");

  const nextHp = (existing.hp || 0) + Math.trunc(delta);
  db.prepare("UPDATE scenario_combatants SET hp = ? WHERE id = ?").run(nextHp, combatantId);
  if (existing.enemy_role !== "ally") {
    const { damage, defeats } = computeEnemyDamageAndDefeatDelta(existing.hp, nextHp);
    applyCampaignEnemyStatsDelta(existing.campaign_id, damage, defeats);
  }

  const updated = db
    .prepare(
      "SELECT id, scenario_id, kind, enemy_role, character_id, name, initiative, hp, reaction_available, created_at FROM scenario_combatants WHERE id = ?"
    )
    .get(combatantId);
  updated.condition_keys = db
    .prepare(
      "SELECT condition_key FROM scenario_combatant_conditions WHERE combatant_id = ? ORDER BY created_at ASC"
    )
    .all(combatantId)
    .map((row) => row.condition_key);

  notifyPlayerLiveForCombatant(combatantId);
  res.json(updated);
});

app.post("/api/scenarios/:scenarioId/combat/reset", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = getScenario(scenarioId);
  if (!scenario) return badRequest(res, "Scenario not found.");

  db.prepare(
    "UPDATE combat_scenarios SET current_round = 1, current_turn_index = 0, updated_at = datetime('now') WHERE id = ?"
  ).run(scenarioId);
  db.prepare(
    "UPDATE scenario_combatants SET reaction_available = 1, reaction_auto_readied = 0 WHERE scenario_id = ?"
  ).run(scenarioId);
  db.prepare(
    "UPDATE scenario_combatants SET legendary_actions_remaining = legendary_actions_count WHERE scenario_id = ? AND is_legendary = 1 AND legendary_actions_count BETWEEN 2 AND 4"
  ).run(scenarioId);

  const combatants = listCombatants(scenarioId);
  const state = normalizeCombatState(
    { ...scenario, current_round: 1, current_turn_index: 0 },
    combatants
  );

  notifyPlayerLiveForScenario(scenarioId);
  res.json({
    scenarioId,
    round: state.round,
    turnIndex: state.turnIndex,
    activeCombatantId: state.activeCombatantId,
    combatants
  });
});

app.post("/api/scenarios/:scenarioId/combat/next-turn", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = getScenario(scenarioId);
  if (!scenario) return badRequest(res, "Scenario not found.");

  const combatants = listCombatants(scenarioId);
  if (combatants.length === 0) {
    return badRequest(res, "Add at least one combatant first.");
  }

  const isDefeatedEnemy = (combatant) => {
    if (combatant.kind !== "enemy") return false;
    if (combatant.hp == null || combatant.hp === "") return false;
    const hp = Number(combatant.hp);
    return Number.isFinite(hp) && hp <= 0;
  };

  const isHiddenNonPc = (combatant) => {
    return combatant.kind !== "character" && Number(combatant.player_visible) === 0;
  };

  const base = normalizeCombatState(scenario, combatants);
  let nextTurnIndex = base.turnIndex;
  let nextRound = base.round;
  let foundEligible = false;
  for (let i = 0; i < combatants.length; i += 1) {
    nextTurnIndex += 1;
    if (nextTurnIndex >= combatants.length) {
      nextTurnIndex = 0;
      nextRound += 1;
    }
    if (!isDefeatedEnemy(combatants[nextTurnIndex]) && !isHiddenNonPc(combatants[nextTurnIndex])) {
      foundEligible = true;
      break;
    }
  }

  if (!foundEligible) {
    nextTurnIndex = base.turnIndex + 1;
    nextRound = base.round;
    if (nextTurnIndex >= combatants.length) {
      nextTurnIndex = 0;
      nextRound += 1;
    }
  }

  db.prepare(
    "UPDATE combat_scenarios SET current_round = ?, current_turn_index = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(nextRound, nextTurnIndex, scenarioId);
  const nextCombatant = combatants[nextTurnIndex];
  if (Number(nextCombatant.reaction_available) === 0) {
    db.prepare(
      "UPDATE scenario_combatants SET reaction_available = 1, reaction_auto_readied = 1 WHERE id = ?"
    ).run(nextCombatant.id);
  } else {
    db.prepare("UPDATE scenario_combatants SET reaction_auto_readied = 0 WHERE id = ?").run(
      nextCombatant.id
    );
  }
  if (Number(nextCombatant.is_legendary) === 1 && Number.isInteger(nextCombatant.legendary_actions_count)) {
    db.prepare("UPDATE scenario_combatants SET legendary_actions_remaining = ? WHERE id = ?").run(
      nextCombatant.legendary_actions_count,
      nextCombatant.id
    );
  }

  const latestCombatants = listCombatants(scenarioId);
  notifyPlayerLiveForScenario(scenarioId);
  res.json({
    scenarioId,
    round: nextRound,
    turnIndex: nextTurnIndex,
    activeCombatantId: latestCombatants[nextTurnIndex].id,
    combatants: latestCombatants
  });
});

app.post("/api/scenarios/:scenarioId/combat/prev-turn", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = getScenario(scenarioId);
  if (!scenario) return badRequest(res, "Scenario not found.");

  const combatants = listCombatants(scenarioId);
  if (combatants.length === 0) {
    return badRequest(res, "Add at least one combatant first.");
  }

  const isDefeatedEnemy = (combatant) => {
    if (combatant.kind !== "enemy") return false;
    if (combatant.hp == null || combatant.hp === "") return false;
    const hp = Number(combatant.hp);
    return Number.isFinite(hp) && hp <= 0;
  };

  const isHiddenNonPc = (combatant) => {
    return combatant.kind !== "character" && Number(combatant.player_visible) === 0;
  };

  const base = normalizeCombatState(scenario, combatants);
  const previousActive = combatants[base.turnIndex] || null;
  const previousActiveId = previousActive?.id || null;
  let nextTurnIndex = base.turnIndex;
  let nextRound = base.round;
  let foundEligible = false;

  if (base.round <= 1 && base.turnIndex === 0) {
    nextTurnIndex = 0;
    nextRound = 1;
  } else {
    for (let i = 0; i < combatants.length; i += 1) {
      nextTurnIndex -= 1;
      if (nextTurnIndex < 0) {
        nextTurnIndex = combatants.length - 1;
        nextRound -= 1;
      }
      if (nextRound < 1) {
        nextTurnIndex = 0;
        nextRound = 1;
        break;
      }
      if (!isDefeatedEnemy(combatants[nextTurnIndex]) && !isHiddenNonPc(combatants[nextTurnIndex])) {
        foundEligible = true;
        break;
      }
    }
  }

  if (!foundEligible && !(base.round <= 1 && base.turnIndex === 0)) {
    nextTurnIndex = base.turnIndex;
    nextRound = base.round;
  }

  db.prepare(
    "UPDATE combat_scenarios SET current_round = ?, current_turn_index = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(nextRound, nextTurnIndex, scenarioId);
  if (
    previousActiveId !== null &&
    (nextTurnIndex !== base.turnIndex || nextRound !== base.round) &&
    Number(previousActive?.reaction_auto_readied) === 1
  ) {
    db.prepare(
      "UPDATE scenario_combatants SET reaction_available = 0, reaction_auto_readied = 0 WHERE id = ?"
    ).run(previousActiveId);
  }
  db.prepare(
    "UPDATE scenario_combatants SET reaction_available = 1, reaction_auto_readied = 0 WHERE id = ?"
  ).run(combatants[nextTurnIndex].id);
  if (
    Number(combatants[nextTurnIndex].is_legendary) === 1 &&
    Number.isInteger(combatants[nextTurnIndex].legendary_actions_count)
  ) {
    db.prepare("UPDATE scenario_combatants SET legendary_actions_remaining = ? WHERE id = ?").run(
      combatants[nextTurnIndex].legendary_actions_count,
      combatants[nextTurnIndex].id
    );
  }

  const latestCombatants = listCombatants(scenarioId);
  notifyPlayerLiveForScenario(scenarioId);
  res.json({
    scenarioId,
    round: nextRound,
    turnIndex: nextTurnIndex,
    activeCombatantId: latestCombatants[nextTurnIndex].id,
    combatants: latestCombatants
  });
});

app.post("/api/combatants/:combatantId/reaction", (req, res) => {
  const combatantId = asId(req.params.combatantId);
  if (combatantId === null) return badRequest(res, "Invalid combatant id.");

  const availableRaw = req.body?.available;
  const hasAvailable = Object.prototype.hasOwnProperty.call(req.body || {}, "available");
  if (!hasAvailable) return badRequest(res, "available is required.");
  const available =
    availableRaw === true ||
    availableRaw === 1 ||
    `${availableRaw || ""}`.trim().toLowerCase() === "true" ||
    `${availableRaw || ""}`.trim() === "1";

  const existing = db
    .prepare("SELECT id FROM scenario_combatants WHERE id = ?")
    .get(combatantId);
  if (!existing) return badRequest(res, "Combatant not found.");

  db.prepare("UPDATE scenario_combatants SET reaction_available = ?, reaction_auto_readied = 0 WHERE id = ?").run(
    available ? 1 : 0,
    combatantId
  );

  notifyPlayerLiveForCombatant(combatantId);
  res.json(getCombatantById(combatantId));
});

app.post("/api/combatants/:combatantId/player-visible", (req, res) => {
  const combatantId = asId(req.params.combatantId);
  if (combatantId === null) return badRequest(res, "Invalid combatant id.");

  const availableRaw = req.body?.visible;
  let visible = null;
  if (availableRaw === true || availableRaw === 1 || `${availableRaw}` === "1") {
    visible = 1;
  } else if (availableRaw === false || availableRaw === 0 || `${availableRaw}` === "0") {
    visible = 0;
  }
  if (visible === null) return badRequest(res, "visible must be true or false.");

  const accessRow = ensureCombatantAccess(req, res, combatantId);
  if (!accessRow) return;

  db.prepare("UPDATE scenario_combatants SET player_visible = ? WHERE id = ?").run(
    visible,
    combatantId
  );

  notifyPlayerLiveForCampaign(accessRow.campaign_id);
  res.json(getCombatantById(combatantId));
});

app.post("/api/combatants/:combatantId/legendary-actions", (req, res) => {
  const combatantId = asId(req.params.combatantId);
  const remaining = Number(req.body?.remaining);
  if (combatantId === null) return badRequest(res, "Invalid combatant id.");
  if (!Number.isInteger(remaining)) {
    return badRequest(res, "remaining is required.");
  }

  const existing = db
    .prepare(
      "SELECT id, kind, is_legendary, legendary_actions_count FROM scenario_combatants WHERE id = ?"
    )
    .get(combatantId);
  if (!existing) return badRequest(res, "Combatant not found.");
  if (existing.kind !== "enemy" || Number(existing.is_legendary) !== 1) {
    return badRequest(res, "Combatant is not legendary.");
  }
  const maxActions = Number(existing.legendary_actions_count);
  if (!Number.isInteger(maxActions) || maxActions < 2 || maxActions > 4) {
    return badRequest(res, "Invalid legendary actions count.");
  }
  if (remaining < 0 || remaining > maxActions) {
    return badRequest(res, `remaining must be between 0 and ${maxActions}.`);
  }

  db.prepare("UPDATE scenario_combatants SET legendary_actions_remaining = ? WHERE id = ?").run(
    remaining,
    combatantId
  );
  notifyPlayerLiveForCombatant(combatantId);
  res.json(getCombatantById(combatantId));
});

app.get(/^\/(?!api\/).*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Fridolins Wondrous Dungeon Toolkit running at http://localhost:${port}`);
  });
}

module.exports = { app };
