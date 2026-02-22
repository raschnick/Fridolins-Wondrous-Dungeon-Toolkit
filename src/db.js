const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const dataDir = path.join(__dirname, "..", "data");
const dbPath = path.join(dataDir, "itracker.sqlite");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma("foreign_keys = ON");

function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS campaigns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS characters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      class_name TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS combat_scenarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      campaign_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      notes TEXT NOT NULL DEFAULT '',
      current_round INTEGER NOT NULL DEFAULT 1,
      current_turn_index INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS scenario_combatants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      scenario_id INTEGER NOT NULL,
      kind TEXT NOT NULL CHECK(kind IN ('character', 'enemy')),
      enemy_role TEXT NOT NULL DEFAULT 'enemy',
      reaction_available INTEGER NOT NULL DEFAULT 1,
      reaction_auto_readied INTEGER NOT NULL DEFAULT 0,
      is_legendary INTEGER NOT NULL DEFAULT 0,
      legendary_actions_count INTEGER,
      legendary_actions_remaining INTEGER,
      character_id INTEGER,
      monster_id INTEGER,
      name TEXT NOT NULL,
      initiative INTEGER NOT NULL DEFAULT 0,
      hp INTEGER,
      condition_key TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (scenario_id) REFERENCES combat_scenarios(id) ON DELETE CASCADE,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS scenario_character_exclusions (
      scenario_id INTEGER NOT NULL,
      character_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (scenario_id, character_id),
      FOREIGN KEY (scenario_id) REFERENCES combat_scenarios(id) ON DELETE CASCADE,
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS scenario_combatant_conditions (
      combatant_id INTEGER NOT NULL,
      condition_key TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (combatant_id, condition_key),
      FOREIGN KEY (combatant_id) REFERENCES scenario_combatants(id) ON DELETE CASCADE
    );

    DELETE FROM scenario_combatants
    WHERE kind = 'character'
      AND character_id IS NOT NULL
      AND id NOT IN (
        SELECT MIN(id)
        FROM scenario_combatants
        WHERE kind = 'character' AND character_id IS NOT NULL
        GROUP BY scenario_id, character_id
      );

    CREATE UNIQUE INDEX IF NOT EXISTS scenario_character_once_per_scenario
      ON scenario_combatants (scenario_id, character_id)
      WHERE kind = 'character' AND character_id IS NOT NULL;

    CREATE TABLE IF NOT EXISTS monster_statblocks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      size TEXT NOT NULL,
      type TEXT NOT NULL,
      alignment TEXT NOT NULL,
      armor_class TEXT NOT NULL,
      hit_points TEXT NOT NULL,
      speed TEXT NOT NULL,
      str_score INTEGER NOT NULL,
      dex_score INTEGER NOT NULL,
      con_score INTEGER NOT NULL,
      int_score INTEGER NOT NULL,
      wis_score INTEGER NOT NULL,
      cha_score INTEGER NOT NULL,
      challenge_rating TEXT NOT NULL,
      proficiency_bonus TEXT NOT NULL,
      senses TEXT NOT NULL,
      languages TEXT NOT NULL,
      traits TEXT NOT NULL DEFAULT '',
      actions TEXT NOT NULL DEFAULT '',
      monster_image_data TEXT NOT NULL DEFAULT '',
      is_legendary INTEGER NOT NULL DEFAULT 0,
      legendary_actions_count INTEGER,
      source TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);

  const scenarioColumns = db
    .prepare("PRAGMA table_info(combat_scenarios)")
    .all()
    .map((column) => column.name);

  if (!scenarioColumns.includes("current_round")) {
    db.exec(
      "ALTER TABLE combat_scenarios ADD COLUMN current_round INTEGER NOT NULL DEFAULT 1"
    );
  }

  if (!scenarioColumns.includes("current_turn_index")) {
    db.exec(
      "ALTER TABLE combat_scenarios ADD COLUMN current_turn_index INTEGER NOT NULL DEFAULT 0"
    );
  }

  const combatantColumns = db
    .prepare("PRAGMA table_info(scenario_combatants)")
    .all()
    .map((column) => column.name);

  if (!combatantColumns.includes("hp")) {
    db.exec("ALTER TABLE scenario_combatants ADD COLUMN hp INTEGER");
  }

  if (!combatantColumns.includes("condition_key")) {
    db.exec("ALTER TABLE scenario_combatants ADD COLUMN condition_key TEXT");
  }
  if (!combatantColumns.includes("monster_id")) {
    db.exec("ALTER TABLE scenario_combatants ADD COLUMN monster_id INTEGER");
  }
  if (!combatantColumns.includes("enemy_role")) {
    db.exec("ALTER TABLE scenario_combatants ADD COLUMN enemy_role TEXT NOT NULL DEFAULT 'enemy'");
    db.exec("UPDATE scenario_combatants SET enemy_role = 'enemy' WHERE enemy_role IS NULL OR enemy_role = ''");
  }
  if (!combatantColumns.includes("reaction_available")) {
    db.exec("ALTER TABLE scenario_combatants ADD COLUMN reaction_available INTEGER NOT NULL DEFAULT 1");
  }
  if (!combatantColumns.includes("reaction_auto_readied")) {
    db.exec("ALTER TABLE scenario_combatants ADD COLUMN reaction_auto_readied INTEGER NOT NULL DEFAULT 0");
  }
  if (!combatantColumns.includes("is_legendary")) {
    db.exec("ALTER TABLE scenario_combatants ADD COLUMN is_legendary INTEGER NOT NULL DEFAULT 0");
  }
  if (!combatantColumns.includes("legendary_actions_count")) {
    db.exec("ALTER TABLE scenario_combatants ADD COLUMN legendary_actions_count INTEGER");
  }
  if (!combatantColumns.includes("legendary_actions_remaining")) {
    db.exec("ALTER TABLE scenario_combatants ADD COLUMN legendary_actions_remaining INTEGER");
  }
  db.exec("UPDATE scenario_combatants SET reaction_available = 1 WHERE reaction_available IS NULL");
  db.exec(
    "UPDATE scenario_combatants SET reaction_available = 1 WHERE reaction_available NOT IN (0, 1)"
  );
  db.exec("UPDATE scenario_combatants SET reaction_auto_readied = 0 WHERE reaction_auto_readied IS NULL");
  db.exec(
    "UPDATE scenario_combatants SET reaction_auto_readied = 0 WHERE reaction_auto_readied NOT IN (0, 1)"
  );
  db.exec("UPDATE scenario_combatants SET is_legendary = 0 WHERE is_legendary IS NULL");
  db.exec(
    "UPDATE scenario_combatants SET legendary_actions_count = NULL WHERE is_legendary = 0 OR legendary_actions_count NOT BETWEEN 2 AND 4"
  );
  db.exec(
    "UPDATE scenario_combatants SET legendary_actions_remaining = NULL WHERE is_legendary = 0 OR legendary_actions_count IS NULL"
  );
  db.exec(
    "UPDATE scenario_combatants SET legendary_actions_remaining = COALESCE(legendary_actions_remaining, legendary_actions_count) WHERE is_legendary = 1 AND legendary_actions_count BETWEEN 2 AND 4"
  );
  db.exec(
    "UPDATE scenario_combatants SET legendary_actions_remaining = legendary_actions_count WHERE is_legendary = 1 AND legendary_actions_count BETWEEN 2 AND 4 AND legendary_actions_remaining > legendary_actions_count"
  );
  db.exec(
    "UPDATE scenario_combatants SET legendary_actions_remaining = 0 WHERE is_legendary = 1 AND legendary_actions_count BETWEEN 2 AND 4 AND legendary_actions_remaining < 0"
  );
  db.exec(`
    UPDATE scenario_combatants
    SET
      is_legendary = 1,
      legendary_actions_count = (
        SELECT ms.legendary_actions_count
        FROM monster_statblocks ms
        WHERE ms.id = scenario_combatants.monster_id
      )
    WHERE
      kind = 'enemy'
      AND monster_id IS NOT NULL
      AND COALESCE(is_legendary, 0) = 0
      AND EXISTS (
        SELECT 1
        FROM monster_statblocks ms
        WHERE
          ms.id = scenario_combatants.monster_id
          AND COALESCE(ms.is_legendary, 0) = 1
          AND ms.legendary_actions_count BETWEEN 2 AND 4
      );
  `);
  db.exec(
    "UPDATE scenario_combatants SET legendary_actions_remaining = COALESCE(legendary_actions_remaining, legendary_actions_count) WHERE is_legendary = 1 AND legendary_actions_count BETWEEN 2 AND 4"
  );

  db.exec(`
    INSERT OR IGNORE INTO scenario_combatant_conditions (combatant_id, condition_key)
    SELECT id, lower(trim(condition_key))
    FROM scenario_combatants
    WHERE condition_key IS NOT NULL
      AND trim(condition_key) <> '';
  `);

  let monsterColumns = db
    .prepare("PRAGMA table_info(monster_statblocks)")
    .all()
    .map((column) => column.name);

  if (monsterColumns.includes("is_builtin")) {
    db.exec("PRAGMA foreign_keys = OFF");
    db.exec(`
      BEGIN;
      ALTER TABLE monster_statblocks RENAME TO monster_statblocks_old;
      CREATE TABLE monster_statblocks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        size TEXT NOT NULL,
        type TEXT NOT NULL,
        alignment TEXT NOT NULL,
        armor_class TEXT NOT NULL,
        hit_points TEXT NOT NULL,
        speed TEXT NOT NULL,
        str_score INTEGER NOT NULL,
        dex_score INTEGER NOT NULL,
        con_score INTEGER NOT NULL,
        int_score INTEGER NOT NULL,
        wis_score INTEGER NOT NULL,
        cha_score INTEGER NOT NULL,
        challenge_rating TEXT NOT NULL,
        proficiency_bonus TEXT NOT NULL,
        senses TEXT NOT NULL,
        languages TEXT NOT NULL,
        traits TEXT NOT NULL DEFAULT '',
        actions TEXT NOT NULL DEFAULT '',
        monster_image_data TEXT NOT NULL DEFAULT '',
        is_legendary INTEGER NOT NULL DEFAULT 0,
        legendary_actions_count INTEGER,
        source TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      INSERT INTO monster_statblocks (
        id, name, size, type, alignment, armor_class, hit_points, speed,
        str_score, dex_score, con_score, int_score, wis_score, cha_score,
        challenge_rating, proficiency_bonus, senses, languages,
        traits, actions, monster_image_data, is_legendary, legendary_actions_count, source, created_at, updated_at
      )
      SELECT
        id, name, size, type, alignment, armor_class, hit_points, speed,
        str_score, dex_score, con_score, int_score, wis_score, cha_score,
        challenge_rating, proficiency_bonus, senses, languages,
        traits, actions, monster_image_data,
        0,
        NULL,
        source, created_at, updated_at
      FROM monster_statblocks_old;
      DROP TABLE monster_statblocks_old;
      COMMIT;
    `);
    db.exec("PRAGMA foreign_keys = ON");
    monsterColumns = db
      .prepare("PRAGMA table_info(monster_statblocks)")
      .all()
      .map((column) => column.name);
  }

  if (!monsterColumns.includes("monster_image_data")) {
    db.exec("ALTER TABLE monster_statblocks ADD COLUMN monster_image_data TEXT NOT NULL DEFAULT ''");
  }
  if (!monsterColumns.includes("is_legendary")) {
    db.exec("ALTER TABLE monster_statblocks ADD COLUMN is_legendary INTEGER NOT NULL DEFAULT 0");
  }
  if (!monsterColumns.includes("legendary_actions_count")) {
    db.exec("ALTER TABLE monster_statblocks ADD COLUMN legendary_actions_count INTEGER");
  }
  db.exec("UPDATE monster_statblocks SET is_legendary = 0 WHERE is_legendary IS NULL");
  db.exec(
    "UPDATE monster_statblocks SET legendary_actions_count = NULL WHERE is_legendary = 0 OR legendary_actions_count NOT BETWEEN 2 AND 4"
  );
}

module.exports = { db, dbPath, initDb };
