const path = require("path");
const express = require("express");
const { db, dbPath, initDb } = require("./db");

initDb();

const app = express();
const port = process.env.PORT || 3000;

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

function badRequest(res, message) {
  return res.status(400).json({ error: message });
}

function asId(value) {
  const id = Number(value);
  return Number.isInteger(id) ? id : null;
}

function getScenario(scenarioId) {
  return db
    .prepare(
      "SELECT id, campaign_id, name, notes, current_round, current_turn_index, created_at, updated_at FROM combat_scenarios WHERE id = ?"
    )
    .get(scenarioId);
}

function listCombatants(scenarioId) {
  const combatants = db
    .prepare(
      `SELECT
        sc.id, sc.scenario_id, sc.kind, sc.enemy_role, sc.character_id, sc.monster_id, sc.name,
        sc.initiative, sc.hp, sc.reaction_available, sc.reaction_auto_readied, sc.is_legendary, sc.legendary_actions_count, sc.legendary_actions_remaining, sc.created_at,
        c.class_name AS character_class,
        ms.monster_image_data
       FROM scenario_combatants sc
       LEFT JOIN characters c ON c.id = sc.character_id
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
        sc.id, sc.scenario_id, sc.kind, sc.enemy_role, sc.character_id, sc.monster_id, sc.name,
        sc.initiative, sc.hp, sc.reaction_available, sc.reaction_auto_readied, sc.is_legendary, sc.legendary_actions_count, sc.legendary_actions_remaining, sc.created_at,
        c.class_name AS character_class,
        ms.monster_image_data
       FROM scenario_combatants sc
       LEFT JOIN characters c ON c.id = sc.character_id
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
    size: `${body?.size || ""}`.trim(),
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

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, dbPath });
});

app.get("/api/monsters", (_req, res) => {
  const monsters = db
    .prepare(
      `SELECT
        id, name, size, type, alignment, armor_class, hit_points, speed,
        str_score, dex_score, con_score, int_score, wis_score, cha_score,
        challenge_rating, proficiency_bonus, senses, languages,
        traits, actions, monster_image_data, is_legendary, legendary_actions_count, source, created_at, updated_at
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
          challenge_rating, proficiency_bonus, senses, languages, traits, actions, monster_image_data, is_legendary, legendary_actions_count, source
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
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
           challenge_rating = ?, proficiency_bonus = ?, senses = ?, languages = ?, traits = ?, actions = ?, monster_image_data = ?, is_legendary = ?, legendary_actions_count = ?, source = ?,
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
  const campaigns = db
    .prepare("SELECT id, name, created_at FROM campaigns ORDER BY name ASC")
    .all();
  res.json(campaigns);
});

app.post("/api/campaigns", (req, res) => {
  const name = `${req.body?.name || ""}`.trim();
  if (!name) return badRequest(res, "Campaign name is required.");

  try {
    const result = db
      .prepare("INSERT INTO campaigns (name) VALUES (?)")
      .run(name);
    const campaign = db
      .prepare("SELECT id, name, created_at FROM campaigns WHERE id = ?")
      .get(result.lastInsertRowid);
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

  db.prepare("DELETE FROM campaigns WHERE id = ?").run(campaignId);
  res.status(204).send();
});

app.get("/api/campaigns/:campaignId/characters", (req, res) => {
  const campaignId = Number(req.params.campaignId);
  if (!Number.isInteger(campaignId)) return badRequest(res, "Invalid campaign id.");

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

  const scenarios = db
    .prepare(
      "SELECT id, campaign_id, name, notes, current_round, current_turn_index, created_at, updated_at FROM combat_scenarios WHERE campaign_id = ? ORDER BY id DESC"
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
      "SELECT id, campaign_id, name, notes, current_round, current_turn_index, created_at, updated_at FROM combat_scenarios WHERE id = ?"
    )
    .get(result.lastInsertRowid);

  res.status(201).json(scenario);
});

app.put("/api/scenarios/:scenarioId", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  const name = `${req.body?.name || ""}`.trim();
  const notes = `${req.body?.notes || ""}`;

  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");
  if (!name) return badRequest(res, "Scenario name is required.");

  const scenarioExists = db
    .prepare("SELECT 1 FROM combat_scenarios WHERE id = ?")
    .get(scenarioId);
  if (!scenarioExists) return badRequest(res, "Scenario not found.");

  db.prepare(
    "UPDATE combat_scenarios SET name = ?, notes = ?, updated_at = datetime('now') WHERE id = ?"
  ).run(name, notes, scenarioId);

  const updated = db
    .prepare(
      "SELECT id, campaign_id, name, notes, current_round, current_turn_index, created_at, updated_at FROM combat_scenarios WHERE id = ?"
    )
    .get(scenarioId);
  res.json(updated);
});

app.get("/api/scenarios/:scenarioId/combat", (req, res) => {
  const scenarioId = asId(req.params.scenarioId);
  if (scenarioId === null) return badRequest(res, "Invalid scenario id.");

  const scenario = getScenario(scenarioId);
  if (!scenario) return badRequest(res, "Scenario not found.");

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
  const enemyRole = enemyRoleInput === "npc" ? "npc" : "enemy";
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

  const scenario = getScenario(scenarioId);
  if (!scenario) return badRequest(res, "Scenario not found.");

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
    (enemyRole === "npc" && isLegendaryRequested);
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
    .prepare("SELECT id FROM combat_scenarios WHERE id = ?")
    .get(scenarioId);
  if (!scenario) return badRequest(res, "Scenario not found.");

  db.prepare("DELETE FROM combat_scenarios WHERE id = ?").run(scenarioId);
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
      "SELECT id, scenario_id, kind, enemy_role, character_id, name, initiative, hp FROM scenario_combatants WHERE id = ?"
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

  if (conditionProvided) {
    db.prepare("DELETE FROM scenario_combatant_conditions WHERE combatant_id = ?").run(
      combatantId
    );
    if (conditionKey) {
      db.prepare(
        "INSERT OR IGNORE INTO scenario_combatant_conditions (combatant_id, condition_key) VALUES (?, ?)"
      ).run(combatantId, conditionKey);
    }
  }

  const updated = getCombatantById(combatantId);

  res.json(updated);
});

app.post("/api/combatants/:combatantId/conditions", (req, res) => {
  const combatantId = asId(req.params.combatantId);
  const conditionKey = `${req.body?.conditionKey || ""}`.trim().toLowerCase();

  if (combatantId === null) return badRequest(res, "Invalid combatant id.");
  if (!conditionKey || !CONDITION_KEYS.has(conditionKey)) {
    return badRequest(res, "Invalid condition.");
  }

  const existing = db.prepare("SELECT id FROM scenario_combatants WHERE id = ?").get(combatantId);
  if (!existing) return badRequest(res, "Combatant not found.");

  db.prepare(
    "INSERT OR IGNORE INTO scenario_combatant_conditions (combatant_id, condition_key) VALUES (?, ?)"
  ).run(combatantId, conditionKey);

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

  res.json(getCombatantById(combatantId));
});

app.post("/api/combatants/:combatantId/hp-adjust", (req, res) => {
  const combatantId = asId(req.params.combatantId);
  const delta = Number(req.body?.delta);

  if (combatantId === null) return badRequest(res, "Invalid combatant id.");
  if (!Number.isFinite(delta)) return badRequest(res, "delta is required.");

  const existing = db
    .prepare(
      "SELECT id, kind, hp FROM scenario_combatants WHERE id = ?"
    )
    .get(combatantId);
  if (!existing) return badRequest(res, "Combatant not found.");
  if (existing.kind !== "enemy") return badRequest(res, "HP adjustment is only for enemies.");

  const nextHp = (existing.hp || 0) + Math.trunc(delta);
  db.prepare("UPDATE scenario_combatants SET hp = ? WHERE id = ?").run(nextHp, combatantId);

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

  const base = normalizeCombatState(scenario, combatants);
  let nextTurnIndex = base.turnIndex + 1;
  let nextRound = base.round;
  if (nextTurnIndex >= combatants.length) {
    nextTurnIndex = 0;
    nextRound += 1;
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

  const base = normalizeCombatState(scenario, combatants);
  const previousActive = combatants[base.turnIndex] || null;
  const previousActiveId = previousActive?.id || null;
  let nextTurnIndex = base.turnIndex - 1;
  let nextRound = base.round;

  if (nextTurnIndex < 0) {
    if (base.round <= 1) {
      nextTurnIndex = 0;
      nextRound = 1;
    } else {
      nextTurnIndex = combatants.length - 1;
      nextRound -= 1;
    }
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
  res.json(getCombatantById(combatantId));
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

app.listen(port, () => {
  console.log(`iTracker running at http://localhost:${port}`);
});
