const fs = require("fs");
const path = require("path");
const Database = require("better-sqlite3");

const configuredDbPath = process.env.FWDT_DB_PATH
  ? path.resolve(process.env.FWDT_DB_PATH)
  : path.join(__dirname, "..", "data", "itracker.sqlite");
const dbPath = configuredDbPath;
const dataDir = path.dirname(dbPath);

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

    CREATE TABLE IF NOT EXISTS campaign_members (
      campaign_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL DEFAULT 'player',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (campaign_id, user_id),
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_campaign_members_user
      ON campaign_members (user_id);

    CREATE TABLE IF NOT EXISTS campaign_live_state (
      campaign_id INTEGER PRIMARY KEY,
      shared_scenario_id INTEGER,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE,
      FOREIGN KEY (shared_scenario_id) REFERENCES combat_scenarios(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS campaign_stats (
      campaign_id INTEGER PRIMARY KEY,
      total_enemy_damage INTEGER NOT NULL DEFAULT 0,
      total_enemy_defeats INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS campaign_condition_stats (
      campaign_id INTEGER NOT NULL,
      target_group TEXT NOT NULL CHECK(target_group IN ('enemy', 'pc')),
      condition_key TEXT NOT NULL,
      apply_count INTEGER NOT NULL DEFAULT 0,
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (campaign_id, target_group, condition_key),
      FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'player',
      active INTEGER NOT NULL DEFAULT 1,
      profile_image_data TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token_hash TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_user_sessions_user
      ON user_sessions (user_id);
    CREATE INDEX IF NOT EXISTS idx_user_sessions_expires
      ON user_sessions (expires_at);

    CREATE TABLE IF NOT EXISTS character_claims (
      character_id INTEGER PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (character_id) REFERENCES characters(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_character_claims_user
      ON character_claims (user_id);

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
      map_image_data TEXT NOT NULL DEFAULT '',
      map_tokens_json TEXT NOT NULL DEFAULT '',
      map_fog_data TEXT NOT NULL DEFAULT '',
      map_last_ping_json TEXT NOT NULL DEFAULT '',
      map_token_size INTEGER NOT NULL DEFAULT 44,
      is_completed INTEGER NOT NULL DEFAULT 0,
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
      player_visible INTEGER NOT NULL DEFAULT 1,
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
      token_image_data TEXT NOT NULL DEFAULT '',
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
  if (!scenarioColumns.includes("is_completed")) {
    db.exec(
      "ALTER TABLE combat_scenarios ADD COLUMN is_completed INTEGER NOT NULL DEFAULT 0"
    );
  }
  if (!scenarioColumns.includes("map_image_data")) {
    db.exec(
      "ALTER TABLE combat_scenarios ADD COLUMN map_image_data TEXT NOT NULL DEFAULT ''"
    );
  }
  if (!scenarioColumns.includes("map_tokens_json")) {
    db.exec(
      "ALTER TABLE combat_scenarios ADD COLUMN map_tokens_json TEXT NOT NULL DEFAULT ''"
    );
  }
  if (!scenarioColumns.includes("map_fog_data")) {
    db.exec(
      "ALTER TABLE combat_scenarios ADD COLUMN map_fog_data TEXT NOT NULL DEFAULT ''"
    );
  }
  if (!scenarioColumns.includes("map_last_ping_json")) {
    db.exec(
      "ALTER TABLE combat_scenarios ADD COLUMN map_last_ping_json TEXT NOT NULL DEFAULT ''"
    );
  }
  if (!scenarioColumns.includes("map_token_size")) {
    db.exec(
      "ALTER TABLE combat_scenarios ADD COLUMN map_token_size INTEGER NOT NULL DEFAULT 44"
    );
  }
  db.exec(
    "UPDATE combat_scenarios SET is_completed = 0 WHERE is_completed NOT IN (0, 1) OR is_completed IS NULL"
  );
  db.exec("UPDATE combat_scenarios SET map_image_data = '' WHERE map_image_data IS NULL");
  db.exec("UPDATE combat_scenarios SET map_tokens_json = '' WHERE map_tokens_json IS NULL");
  db.exec("UPDATE combat_scenarios SET map_fog_data = '' WHERE map_fog_data IS NULL");
  db.exec("UPDATE combat_scenarios SET map_last_ping_json = '' WHERE map_last_ping_json IS NULL");
  db.exec("UPDATE combat_scenarios SET map_token_size = 44 WHERE map_token_size IS NULL");
  db.exec("UPDATE combat_scenarios SET map_token_size = 44 WHERE map_token_size < 24 OR map_token_size > 128");

  const userColumns = db
    .prepare("PRAGMA table_info(users)")
    .all()
    .map((column) => column.name);
  if (!userColumns.includes("role")) {
    db.exec("ALTER TABLE users ADD COLUMN role TEXT NOT NULL DEFAULT 'player'");
  }
  if (!userColumns.includes("active")) {
    db.exec("ALTER TABLE users ADD COLUMN active INTEGER NOT NULL DEFAULT 1");
  }
  if (!userColumns.includes("profile_image_data")) {
    db.exec("ALTER TABLE users ADD COLUMN profile_image_data TEXT NOT NULL DEFAULT ''");
  }
  db.exec("UPDATE users SET role = 'player' WHERE role IS NULL OR trim(role) = ''");
  db.exec("UPDATE users SET active = 1 WHERE active NOT IN (0, 1) OR active IS NULL");
  db.exec("UPDATE users SET profile_image_data = '' WHERE profile_image_data IS NULL");
  db.exec("DELETE FROM user_sessions WHERE expires_at <= datetime('now')");
  db.exec(
    `INSERT OR IGNORE INTO campaign_stats (campaign_id)
     SELECT id FROM campaigns`
  );
  db.exec(
    "UPDATE campaign_stats SET total_enemy_damage = 0 WHERE total_enemy_damage IS NULL OR total_enemy_damage < 0"
  );
  db.exec(
    "UPDATE campaign_stats SET total_enemy_defeats = 0 WHERE total_enemy_defeats IS NULL OR total_enemy_defeats < 0"
  );
  db.exec(
    "UPDATE campaign_condition_stats SET apply_count = 0 WHERE apply_count IS NULL OR apply_count < 0"
  );

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
  db.exec("UPDATE scenario_combatants SET enemy_role = 'ally' WHERE enemy_role = 'npc'");
  db.exec("UPDATE scenario_combatants SET enemy_role = 'enemy' WHERE enemy_role NOT IN ('enemy', 'ally')");
  if (!combatantColumns.includes("player_visible")) {
    db.exec("ALTER TABLE scenario_combatants ADD COLUMN player_visible INTEGER NOT NULL DEFAULT 1");
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
  db.exec("UPDATE scenario_combatants SET player_visible = 1 WHERE player_visible IS NULL");
  db.exec("UPDATE scenario_combatants SET player_visible = 1 WHERE player_visible NOT IN (0, 1)");
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
        token_image_data TEXT NOT NULL DEFAULT '',
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
        traits, actions, monster_image_data, token_image_data, is_legendary, legendary_actions_count, source, created_at, updated_at
      )
      SELECT
        id, name, size, type, alignment, armor_class, hit_points, speed,
        str_score, dex_score, con_score, int_score, wis_score, cha_score,
        challenge_rating, proficiency_bonus, senses, languages,
        traits, actions, monster_image_data, '',
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
  if (!monsterColumns.includes("token_image_data")) {
    db.exec("ALTER TABLE monster_statblocks ADD COLUMN token_image_data TEXT NOT NULL DEFAULT ''");
  }
  if (!monsterColumns.includes("size")) {
    db.exec("ALTER TABLE monster_statblocks ADD COLUMN size TEXT NOT NULL DEFAULT 'normal'");
  }
  if (!monsterColumns.includes("is_legendary")) {
    db.exec("ALTER TABLE monster_statblocks ADD COLUMN is_legendary INTEGER NOT NULL DEFAULT 0");
  }
  if (!monsterColumns.includes("legendary_actions_count")) {
    db.exec("ALTER TABLE monster_statblocks ADD COLUMN legendary_actions_count INTEGER");
  }
  db.exec(
    "UPDATE monster_statblocks SET size = 'normal' WHERE size IS NULL OR trim(size) = ''"
  );
  db.exec(
    "UPDATE monster_statblocks SET size = lower(trim(size))"
  );
  db.exec(
    "UPDATE monster_statblocks SET size = 'normal' WHERE size NOT IN ('normal', 'large', 'huge', 'gargantuan')"
  );
  db.exec("UPDATE monster_statblocks SET is_legendary = 0 WHERE is_legendary IS NULL");
  db.exec(
    "UPDATE monster_statblocks SET legendary_actions_count = NULL WHERE is_legendary = 0 OR legendary_actions_count NOT BETWEEN 2 AND 4"
  );
}

module.exports = { db, dbPath, initDb };
