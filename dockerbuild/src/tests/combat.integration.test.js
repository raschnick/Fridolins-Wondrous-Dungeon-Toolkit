const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { Readable, Duplex } = require("node:stream");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fwdt-combat-test-"));
process.env.FWDT_DB_PATH = path.join(tempDir, "combat.integration.sqlite");
process.env.WDT_ADMIN_USERNAME = "fridolin";
process.env.WDT_ADMIN_PASSWORD = "eeZ8Z2n7EkLe8OP0mN43";

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

function uniqueName(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

async function createScenario(admin, suffix = "") {
  const campaign = await admin.request("POST", "/api/campaigns", {
    name: uniqueName(`CombatFocusCampaign${suffix}`)
  });
  assert.equal(campaign.status, 201);

  const scenario = await admin.request(
    "POST",
    `/api/campaigns/${campaign.json.id}/scenarios`,
    { name: uniqueName(`CombatFocusScenario${suffix}`), notes: "" }
  );
  assert.equal(scenario.status, 201);

  return { campaignId: campaign.json.id, scenarioId: scenario.json.id };
}

async function addEnemy(admin, scenarioId, payload) {
  const response = await admin.request("POST", `/api/scenarios/${scenarioId}/combatants`, {
    kind: "enemy",
    enemyRole: "enemy",
    initiative: 10,
    ...payload
  });
  assert.equal(response.status, 201);
  return response.json;
}

test("next turn skips hidden non-PCs and defeated enemies", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { scenarioId } = await createScenario(admin, "Skip");

  const alpha = await addEnemy(admin, scenarioId, { name: "Alpha", initiative: 30, hp: 12 });
  const hidden = await addEnemy(admin, scenarioId, { name: "Hidden", initiative: 20, hp: 10 });
  const defeated = await addEnemy(admin, scenarioId, { name: "Defeated", initiative: 15, hp: 0 });
  const omega = await addEnemy(admin, scenarioId, { name: "Omega", initiative: 10, hp: 8 });

  const hide = await admin.request("POST", `/api/combatants/${hidden.id}/player-visible`, {
    visible: false
  });
  assert.equal(hide.status, 200);

  const initial = await admin.request("GET", `/api/scenarios/${scenarioId}/combat`);
  assert.equal(initial.status, 200);
  assert.equal(initial.json.activeCombatantId, alpha.id);

  const next = await admin.request("POST", `/api/scenarios/${scenarioId}/combat/next-turn`);
  assert.equal(next.status, 200);
  assert.equal(next.json.activeCombatantId, omega.id);
  assert.equal(next.json.round, 1);

  const nextCombatantNames = next.json.combatants.map((entry) => entry.name);
  assert.ok(nextCombatantNames.includes(hidden.name));
  assert.ok(nextCombatantNames.includes(defeated.name));
});

test("revoke turn skips hidden non-PCs and defeated enemies", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { scenarioId } = await createScenario(admin, "PrevSkip");

  const alpha = await addEnemy(admin, scenarioId, { name: "Alpha", initiative: 30, hp: 12 });
  const hidden = await addEnemy(admin, scenarioId, { name: "Hidden", initiative: 20, hp: 10 });
  await addEnemy(admin, scenarioId, { name: "Defeated", initiative: 15, hp: 0 });
  const omega = await addEnemy(admin, scenarioId, { name: "Omega", initiative: 10, hp: 8 });

  const hide = await admin.request("POST", `/api/combatants/${hidden.id}/player-visible`, {
    visible: false
  });
  assert.equal(hide.status, 200);

  const advance = await admin.request("POST", `/api/scenarios/${scenarioId}/combat/next-turn`);
  assert.equal(advance.status, 200);
  assert.equal(advance.json.activeCombatantId, omega.id);

  const prev = await admin.request("POST", `/api/scenarios/${scenarioId}/combat/prev-turn`);
  assert.equal(prev.status, 200);
  assert.equal(prev.json.activeCombatantId, alpha.id);
});

test("revoke turn unreadies reaction only when it was auto-readied", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { scenarioId } = await createScenario(admin, "ReactionAuto");

  const first = await addEnemy(admin, scenarioId, { name: "First", initiative: 20, hp: 10 });
  const second = await addEnemy(admin, scenarioId, { name: "Second", initiative: 10, hp: 10 });

  const setUnavailable = await admin.request("POST", `/api/combatants/${second.id}/reaction`, {
    available: false
  });
  assert.equal(setUnavailable.status, 200);
  assert.equal(Number(setUnavailable.json.reaction_available), 0);

  const next = await admin.request("POST", `/api/scenarios/${scenarioId}/combat/next-turn`);
  assert.equal(next.status, 200);
  assert.equal(next.json.activeCombatantId, second.id);

  const secondAfterNext = next.json.combatants.find((entry) => entry.id === second.id);
  assert.equal(Number(secondAfterNext.reaction_available), 1);
  assert.equal(Number(secondAfterNext.reaction_auto_readied), 1);

  const prev = await admin.request("POST", `/api/scenarios/${scenarioId}/combat/prev-turn`);
  assert.equal(prev.status, 200);
  assert.equal(prev.json.activeCombatantId, first.id);

  const secondAfterPrev = prev.json.combatants.find((entry) => entry.id === second.id);
  assert.equal(Number(secondAfterPrev.reaction_available), 0);
  assert.equal(Number(secondAfterPrev.reaction_auto_readied), 0);
});

test("revoke turn keeps manual reaction state when auto-ready marker was cleared", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { scenarioId } = await createScenario(admin, "ReactionManual");

  const first = await addEnemy(admin, scenarioId, { name: "First", initiative: 20, hp: 10 });
  const second = await addEnemy(admin, scenarioId, { name: "Second", initiative: 10, hp: 10 });

  await admin.request("POST", `/api/combatants/${second.id}/reaction`, { available: false });
  await admin.request("POST", `/api/scenarios/${scenarioId}/combat/next-turn`);

  const manualReady = await admin.request("POST", `/api/combatants/${second.id}/reaction`, {
    available: true
  });
  assert.equal(manualReady.status, 200);
  assert.equal(Number(manualReady.json.reaction_available), 1);
  assert.equal(Number(manualReady.json.reaction_auto_readied), 0);

  const prev = await admin.request("POST", `/api/scenarios/${scenarioId}/combat/prev-turn`);
  assert.equal(prev.status, 200);
  assert.equal(prev.json.activeCombatantId, first.id);

  const secondAfterPrev = prev.json.combatants.find((entry) => entry.id === second.id);
  assert.equal(Number(secondAfterPrev.reaction_available), 1);
  assert.equal(Number(secondAfterPrev.reaction_auto_readied), 0);
});

test("legendary actions can be spent and auto-reset on own turn", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { scenarioId } = await createScenario(admin, "Legendary");

  const legendary = await addEnemy(admin, scenarioId, {
    name: "Legendary",
    initiative: 20,
    hp: 30,
    enemyRole: "ally",
    isLegendary: true,
    legendaryActionsCount: 3
  });
  await addEnemy(admin, scenarioId, { name: "Normal", initiative: 10, hp: 12 });

  const spend = await admin.request("POST", `/api/combatants/${legendary.id}/legendary-actions`, {
    remaining: 1
  });
  assert.equal(spend.status, 200);
  assert.equal(Number(spend.json.legendary_actions_remaining), 1);

  const advance = await admin.request("POST", `/api/scenarios/${scenarioId}/combat/next-turn`);
  assert.equal(advance.status, 200);

  const wrap = await admin.request("POST", `/api/scenarios/${scenarioId}/combat/next-turn`);
  assert.equal(wrap.status, 200);
  assert.equal(wrap.json.round, 2);
  assert.equal(wrap.json.activeCombatantId, legendary.id);

  const legendaryAfterWrap = wrap.json.combatants.find((entry) => entry.id === legendary.id);
  assert.equal(Number(legendaryAfterWrap.legendary_actions_remaining), 3);

  const invalidSpend = await admin.request(
    "POST",
    `/api/combatants/${legendary.id}/legendary-actions`,
    { remaining: 9 }
  );
  assert.equal(invalidSpend.status, 400);
  assert.match(invalidSpend.json.error, /between 0 and 3/i);
});

test("combat reset restores round, turn index, reactions, and legendary counts", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { scenarioId } = await createScenario(admin, "Reset");

  const legendary = await addEnemy(admin, scenarioId, {
    name: "Legendary",
    initiative: 18,
    hp: 25,
    enemyRole: "ally",
    isLegendary: true,
    legendaryActionsCount: 4
  });
  const other = await addEnemy(admin, scenarioId, { name: "Other", initiative: 12, hp: 10 });

  await admin.request("POST", `/api/combatants/${legendary.id}/reaction`, { available: false });
  await admin.request("POST", `/api/combatants/${other.id}/reaction`, { available: false });
  await admin.request("POST", `/api/combatants/${legendary.id}/legendary-actions`, { remaining: 1 });
  await admin.request("POST", `/api/scenarios/${scenarioId}/combat/next-turn`);

  const reset = await admin.request("POST", `/api/scenarios/${scenarioId}/combat/reset`);
  assert.equal(reset.status, 200);
  assert.equal(reset.json.round, 1);
  assert.equal(reset.json.turnIndex, 0);

  const firstByInit = reset.json.combatants[0];
  assert.equal(reset.json.activeCombatantId, firstByInit.id);

  const resetLegendary = reset.json.combatants.find((entry) => entry.id === legendary.id);
  const resetOther = reset.json.combatants.find((entry) => entry.id === other.id);
  assert.equal(Number(resetLegendary.reaction_available), 1);
  assert.equal(Number(resetOther.reaction_available), 1);
  assert.equal(Number(resetLegendary.legendary_actions_remaining), 4);
});

test.after(() => {
  delete process.env.WDT_ADMIN_USERNAME;
  delete process.env.WDT_ADMIN_PASSWORD;
  delete process.env.FWDT_DB_PATH;
  fs.rmSync(tempDir, { recursive: true, force: true });
});
