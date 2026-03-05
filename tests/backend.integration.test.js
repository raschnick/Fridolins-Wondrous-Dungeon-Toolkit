const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { Readable, Duplex } = require("node:stream");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fwdt-test-"));
process.env.FWDT_DB_PATH = path.join(tempDir, "integration.sqlite");

const { app } = require("../src/server");

class HttpClient {
  constructor() {
    this.cookie = "";
  }

  async request(method, route, body = undefined) {
    const payload =
      body === undefined ? Buffer.alloc(0) : Buffer.from(JSON.stringify(body), "utf8");

    return new Promise((resolve, reject) => {
      let pushed = false;
      const req = new Readable({
        read() {
          if (!pushed && payload.length > 0) {
            this.push(payload);
            pushed = true;
          }
          this.push(null);
        }
      });

      req.method = method;
      req.url = route;
      req.httpVersion = "1.1";
      req.headers = {};
      if (payload.length > 0) {
        req.headers["content-type"] = "application/json";
        req.headers["content-length"] = String(payload.length);
      }
      if (this.cookie) {
        req.headers.cookie = this.cookie;
      }

      const chunks = [];
      const socket = new Duplex({
        read() {},
        write(chunk, _enc, cb) {
          chunks.push(Buffer.from(chunk));
          cb();
        }
      });
      socket.cork = () => {};
      socket.uncork = () => {};

      req.socket = socket;
      req.connection = socket;

      const res = new http.ServerResponse(req);
      res.assignSocket(socket);

      res.on("error", reject);
      res.on("finish", () => {
        const raw = Buffer.concat(chunks).toString("utf8");
        const [headerText, ...bodyParts] = raw.split("\r\n\r\n");
        const text = bodyParts.join("\r\n\r\n");

        const setCookieMatches = [];
        const cookieRegex = /^set-cookie:\s*(.+)$/gim;
        let match = cookieRegex.exec(headerText);
        while (match) {
          setCookieMatches.push(match[1]);
          match = cookieRegex.exec(headerText);
        }
        if (setCookieMatches.length > 0) {
          this.cookie = setCookieMatches[0].split(";")[0];
        }

        let json = null;
        if (text) {
          try {
            json = JSON.parse(text);
          } catch (_error) {
            json = null;
          }
        }

        resolve({
          status: res.statusCode,
          text,
          json
        });
      });

      app.handle(req, res, reject);
    });
  }
}

async function login(username, password) {
  const client = new HttpClient();
  const response = await client.request("POST", "/api/auth/login", {
    username,
    password
  });
  assert.equal(response.status, 200);
  return client;
}

async function createPlayer(adminClient, suffix) {
  const username = `player_${suffix}`;
  const password = "testpw";
  const response = await adminClient.request("POST", "/api/admin/users", {
    username,
    password,
    role: "player"
  });
  assert.equal(response.status, 201);
  return { id: response.json.id, username, password };
}

function uniqueName(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

test("requires auth for /api/auth/me", async () => {
  const anon = new HttpClient();
  const response = await anon.request("GET", "/api/auth/me");
  assert.equal(response.status, 401);
});

test("allows default admin login and returns session user", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const me = await admin.request("GET", "/api/auth/me");
  assert.equal(me.status, 200);
  assert.equal(me.json.user.username, "fridolin");
  assert.equal(me.json.user.role, "admin");
});

test("restricts player access to non-player APIs", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { username, password } = await createPlayer(admin, "restricted");
  const player = await login(username, password);

  const response = await player.request("GET", "/api/monsters");
  assert.equal(response.status, 403);
  assert.match(response.json.error, /Player access restricted/i);
});

test("allows player access to /api/player/live", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { username, password } = await createPlayer(admin, "live");
  const player = await login(username, password);

  const response = await player.request("GET", "/api/player/live");
  assert.equal(response.status, 200);
  assert.ok(Object.prototype.hasOwnProperty.call(response.json, "shared"));
});

test("logs out session after username change", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { username, password } = await createPlayer(admin, "rename");
  const player = await login(username, password);

  const rename = await player.request("POST", "/api/users/me/username", {
    username: `${username}_new`
  });
  assert.equal(rename.status, 204);

  const me = await player.request("GET", "/api/auth/me");
  assert.equal(me.status, 401);
});

test("persists monster token image and exposes it in combat payloads", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const tokenImageData = "data:image/png;base64,AA==";

  const createdMonster = await admin.request("POST", "/api/monsters", {
    name: "Token Test Monster",
    size: "normal",
    isLegendary: false,
    monsterImageData: "data:image/png;base64,AA==",
    tokenImageData
  });
  assert.equal(createdMonster.status, 201);
  assert.equal(createdMonster.json.token_image_data, tokenImageData);

  const campaign = await admin.request("POST", "/api/campaigns", {
    name: `Token Campaign ${Date.now()}`
  });
  assert.equal(campaign.status, 201);

  const scenario = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/scenarios`,
    { name: "Token Scenario", notes: "" }
  );
  assert.equal(scenario.status, 201);

  const combatant = await admin.request(
    "POST",
    `/api/scenarios/${scenario.json.id}/combatants`,
    {
      kind: "enemy",
      enemyRole: "ally",
      monsterId: createdMonster.json.id,
      name: "Token Ally",
      initiative: 12
    }
  );
  assert.equal(combatant.status, 201);

  const combat = await admin.request("GET", `/api/scenarios/${scenario.json.id}/combat`);
  assert.equal(combat.status, 200);

  const ally = combat.json.combatants.find(
    (entry) => entry.kind === "enemy" && entry.name === "Token Ally"
  );
  assert.ok(ally);
  assert.equal(ally.monster_token_image_data, tokenImageData);
});

test("campaign workflow: create character/scenario and delete scenario", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const campaign = await admin.request("POST", "/api/campaigns", {
    name: uniqueName("WorkflowCampaign")
  });
  assert.equal(campaign.status, 201);

  const character = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/characters`,
    { name: "Workflow PC", className: "Wizard" }
  );
  assert.equal(character.status, 201);

  const scenario = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/scenarios`,
    { name: "Workflow Scenario", notes: "integration note" }
  );
  assert.equal(scenario.status, 201);

  const characters = await admin.request("GET", `/api/campaigns/${campaign.json.id}/characters`);
  assert.equal(characters.status, 200);
  assert.ok(characters.json.some((entry) => entry.id === character.json.id));

  const scenarios = await admin.request("GET", `/api/campaigns/${campaign.json.id}/scenarios`);
  assert.equal(scenarios.status, 200);
  assert.ok(scenarios.json.some((entry) => entry.id === scenario.json.id));

  const deleted = await admin.request("DELETE", `/api/scenarios/${scenario.json.id}`);
  assert.equal(deleted.status, 204);

  const afterDelete = await admin.request("GET", `/api/campaigns/${campaign.json.id}/scenarios`);
  assert.equal(afterDelete.status, 200);
  assert.ok(!afterDelete.json.some((entry) => entry.id === scenario.json.id));
});

test("share workflow: player sees shared encounter and completion clears share", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const playerIdentity = await createPlayer(admin, `share_${Date.now()}`);
  const player = await login(playerIdentity.username, playerIdentity.password);

  const campaign = await admin.request("POST", "/api/campaigns", {
    name: uniqueName("ShareCampaign")
  });
  assert.equal(campaign.status, 201);

  const addMember = await admin.request("POST", `/api/campaigns/${campaign.json.id}/members`, {
    userId: playerIdentity.id,
    role: "player"
  });
  assert.equal(addMember.status, 204);

  const scenario = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/scenarios`,
    { name: "Shared Scenario", notes: "" }
  );
  assert.equal(scenario.status, 201);

  const share = await admin.request("POST", `/api/scenarios/${scenario.json.id}/share`);
  assert.equal(share.status, 200);
  assert.equal(share.json.shared_scenario_id, scenario.json.id);

  const playerLive = await player.request("GET", "/api/player/live");
  assert.equal(playerLive.status, 200);
  assert.equal(playerLive.json.shared.scenarioId, scenario.json.id);

  const complete = await admin.request("POST", `/api/scenarios/${scenario.json.id}/completed`, {
    completed: true
  });
  assert.equal(complete.status, 200);
  assert.equal(Number(complete.json.is_completed), 1);

  const liveAfterComplete = await admin.request("GET", `/api/campaigns/${campaign.json.id}/live`);
  assert.equal(liveAfterComplete.status, 200);
  assert.equal(liveAfterComplete.json.shared_scenario_id, null);

  const playerLiveAfterComplete = await player.request("GET", "/api/player/live");
  assert.equal(playerLiveAfterComplete.status, 200);
  assert.equal(playerLiveAfterComplete.json.shared, null);
});

test("combat workflow: next turn and revoke turn restore active combatant", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const campaign = await admin.request("POST", "/api/campaigns", {
    name: uniqueName("CombatCampaign")
  });
  assert.equal(campaign.status, 201);

  const scenario = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/scenarios`,
    { name: "Combat Scenario", notes: "" }
  );
  assert.equal(scenario.status, 201);

  const first = await admin.request(
    "POST",
    `/api/scenarios/${scenario.json.id}/combatants`,
    { kind: "enemy", enemyRole: "enemy", name: "Fast", initiative: 20 }
  );
  assert.equal(first.status, 201);
  const second = await admin.request(
    "POST",
    `/api/scenarios/${scenario.json.id}/combatants`,
    { kind: "enemy", enemyRole: "enemy", name: "Slow", initiative: 10 }
  );
  assert.equal(second.status, 201);

  const initial = await admin.request("GET", `/api/scenarios/${scenario.json.id}/combat`);
  assert.equal(initial.status, 200);
  const initialActive = initial.json.activeCombatantId;
  assert.equal(initialActive, first.json.id);

  const next = await admin.request("POST", `/api/scenarios/${scenario.json.id}/combat/next-turn`);
  assert.equal(next.status, 200);
  assert.equal(next.json.activeCombatantId, second.json.id);

  const prev = await admin.request("POST", `/api/scenarios/${scenario.json.id}/combat/prev-turn`);
  assert.equal(prev.status, 200);
  assert.equal(prev.json.activeCombatantId, initialActive);
});

test("visibility workflow: hidden non-PC combatants are excluded from player live data", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const playerIdentity = await createPlayer(admin, `hidden_${Date.now()}`);
  const player = await login(playerIdentity.username, playerIdentity.password);

  const campaign = await admin.request("POST", "/api/campaigns", {
    name: uniqueName("HiddenSkipCampaign")
  });
  assert.equal(campaign.status, 201);

  const addMember = await admin.request("POST", `/api/campaigns/${campaign.json.id}/members`, {
    userId: playerIdentity.id,
    role: "player"
  });
  assert.equal(addMember.status, 204);

  const scenario = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/scenarios`,
    { name: "Hidden Skip Scenario", notes: "" }
  );
  assert.equal(scenario.status, 201);

  const visibleEnemy = await admin.request(
    "POST",
    `/api/scenarios/${scenario.json.id}/combatants`,
    { kind: "enemy", enemyRole: "enemy", name: "Visible", initiative: 20 }
  );
  assert.equal(visibleEnemy.status, 201);
  const hiddenEnemy = await admin.request(
    "POST",
    `/api/scenarios/${scenario.json.id}/combatants`,
    { kind: "enemy", enemyRole: "enemy", name: "Hidden", initiative: 10 }
  );
  assert.equal(hiddenEnemy.status, 201);

  const hide = await admin.request(
    "POST",
    `/api/combatants/${hiddenEnemy.json.id}/player-visible`,
    { visible: false }
  );
  assert.equal(hide.status, 200);
  assert.equal(Number(hide.json.player_visible), 0);

  const share = await admin.request("POST", `/api/scenarios/${scenario.json.id}/share`);
  assert.equal(share.status, 200);

  const playerLive = await player.request("GET", "/api/player/live");
  assert.equal(playerLive.status, 200);
  assert.ok(playerLive.json.shared);
  const names = playerLive.json.shared.combatants.map((entry) => entry.name);
  assert.ok(names.includes(visibleEnemy.json.name));
  assert.ok(!names.includes(hiddenEnemy.json.name));
});

test("tracks enemy condition applications and PC down events per campaign", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");

  const campaign = await admin.request("POST", "/api/campaigns", {
    name: uniqueName("ConditionStatsCampaign")
  });
  assert.equal(campaign.status, 201);

  const character = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/characters`,
    { name: "Condition PC", className: "Cleric" }
  );
  assert.equal(character.status, 201);

  const scenario = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/scenarios`,
    { name: "Condition Scenario", notes: "" }
  );
  assert.equal(scenario.status, 201);

  const enemy = await admin.request(
    "POST",
    `/api/scenarios/${scenario.json.id}/combatants`,
    { kind: "enemy", enemyRole: "enemy", name: "Enemy Target", initiative: 15, hp: 20 }
  );
  assert.equal(enemy.status, 201);

  const ally = await admin.request(
    "POST",
    `/api/scenarios/${scenario.json.id}/combatants`,
    { kind: "enemy", enemyRole: "ally", name: "Ally Target", initiative: 10, hp: 20 }
  );
  assert.equal(ally.status, 201);

  const combat = await admin.request("GET", `/api/scenarios/${scenario.json.id}/combat`);
  assert.equal(combat.status, 200);
  const pcCombatant = combat.json.combatants.find(
    (entry) => entry.kind === "character" && entry.character_id === character.json.id
  );
  assert.ok(pcCombatant);

  let response = await admin.request("POST", `/api/combatants/${enemy.json.id}/conditions`, {
    conditionKey: "poisoned"
  });
  assert.equal(response.status, 200);

  response = await admin.request("POST", `/api/combatants/${enemy.json.id}/conditions`, {
    conditionKey: "poisoned"
  });
  assert.equal(response.status, 200);

  response = await admin.request("DELETE", `/api/combatants/${enemy.json.id}/conditions/poisoned`);
  assert.equal(response.status, 200);

  response = await admin.request("POST", `/api/combatants/${enemy.json.id}/conditions`, {
    conditionKey: "poisoned"
  });
  assert.equal(response.status, 200);

  response = await admin.request("POST", `/api/combatants/${ally.json.id}/conditions`, {
    conditionKey: "stunned"
  });
  assert.equal(response.status, 200);

  response = await admin.request("POST", `/api/combatants/${pcCombatant.id}/conditions`, {
    conditionKey: "down"
  });
  assert.equal(response.status, 200);

  response = await admin.request("DELETE", `/api/combatants/${pcCombatant.id}/conditions/down`);
  assert.equal(response.status, 200);

  response = await admin.request("POST", `/api/combatants/${pcCombatant.id}/conditions`, {
    conditionKey: "down"
  });
  assert.equal(response.status, 200);

  const stats = await admin.request("GET", `/api/campaigns/${campaign.json.id}/stats`);
  assert.equal(stats.status, 200);
  assert.equal(stats.json.enemyConditionApplies.poisoned, 2);
  assert.ok(!Object.prototype.hasOwnProperty.call(stats.json.enemyConditionApplies, "stunned"));
  assert.equal(stats.json.pcDownCount, 2);
});

test("reports PC average initiative dominance across campaign encounters", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");

  const campaign = await admin.request("POST", "/api/campaigns", {
    name: uniqueName("InitiativeDominanceCampaign")
  });
  assert.equal(campaign.status, 201);

  const pcA = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/characters`,
    { name: "Ayla", className: "Wizard" }
  );
  assert.equal(pcA.status, 201);
  const pcB = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/characters`,
    { name: "Borin", className: "Fighter" }
  );
  assert.equal(pcB.status, 201);

  const scenarioOne = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/scenarios`,
    { name: "Encounter One", notes: "" }
  );
  assert.equal(scenarioOne.status, 201);

  const scenarioTwo = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/scenarios`,
    { name: "Encounter Two", notes: "" }
  );
  assert.equal(scenarioTwo.status, 201);

  const combatOne = await admin.request("GET", `/api/scenarios/${scenarioOne.json.id}/combat`);
  assert.equal(combatOne.status, 200);
  const aylaOne = combatOne.json.combatants.find(
    (entry) => entry.kind === "character" && entry.character_id === pcA.json.id
  );
  const borinOne = combatOne.json.combatants.find(
    (entry) => entry.kind === "character" && entry.character_id === pcB.json.id
  );
  assert.ok(aylaOne);
  assert.ok(borinOne);

  let response = await admin.request("PUT", `/api/combatants/${aylaOne.id}`, { initiative: 18 });
  assert.equal(response.status, 200);
  response = await admin.request("PUT", `/api/combatants/${borinOne.id}`, { initiative: 12 });
  assert.equal(response.status, 200);

  const combatTwo = await admin.request("GET", `/api/scenarios/${scenarioTwo.json.id}/combat`);
  assert.equal(combatTwo.status, 200);
  const aylaTwo = combatTwo.json.combatants.find(
    (entry) => entry.kind === "character" && entry.character_id === pcA.json.id
  );
  const borinTwo = combatTwo.json.combatants.find(
    (entry) => entry.kind === "character" && entry.character_id === pcB.json.id
  );
  assert.ok(aylaTwo);
  assert.ok(borinTwo);

  response = await admin.request("PUT", `/api/combatants/${aylaTwo.id}`, { initiative: 14 });
  assert.equal(response.status, 200);
  response = await admin.request("PUT", `/api/combatants/${borinTwo.id}`, { initiative: 16 });
  assert.equal(response.status, 200);

  const stats = await admin.request("GET", `/api/campaigns/${campaign.json.id}/stats`);
  assert.equal(stats.status, 200);
  const averages = stats.json.pcInitiativeAverages;
  assert.ok(Array.isArray(averages));

  const aylaStats = averages.find((entry) => entry.characterId === pcA.json.id);
  const borinStats = averages.find((entry) => entry.characterId === pcB.json.id);
  assert.ok(aylaStats);
  assert.ok(borinStats);

  assert.equal(aylaStats.encounterCount, 2);
  assert.equal(aylaStats.averageInitiative, 16);
  assert.equal(borinStats.encounterCount, 2);
  assert.equal(borinStats.averageInitiative, 14);
});

test.after(() => {
  delete process.env.FWDT_DB_PATH;
  fs.rmSync(tempDir, { recursive: true, force: true });
});
