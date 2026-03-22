const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const http = require("node:http");
const { Readable, Duplex } = require("node:stream");

const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), "fwdt-auth-share-test-"));
process.env.FWDT_DB_PATH = path.join(tempDir, "auth-share.integration.sqlite");
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

async function createPlayer(adminClient, suffix) {
  const username = `player_auth_share_${suffix}`;
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

async function createCampaignAndScenarios(admin, scenarioCount = 1) {
  const campaign = await admin.request("POST", "/api/campaigns", {
    name: uniqueName("ShareCampaign")
  });
  assert.equal(campaign.status, 201);

  const scenarios = [];
  for (let i = 0; i < scenarioCount; i += 1) {
    const scenario = await admin.request(
      "POST",
      `/api/campaigns/${campaign.json.id}/scenarios`,
      { name: uniqueName(`Encounter${i + 1}`), notes: "" }
    );
    assert.equal(scenario.status, 201);
    scenarios.push(scenario.json);
  }

  return { campaign: campaign.json, scenarios };
}

test("player is blocked from admin and DM-only share-control endpoints", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const playerIdentity = await createPlayer(admin, Date.now());
  const player = await login(playerIdentity.username, playerIdentity.password);

  const { campaign, scenarios } = await createCampaignAndScenarios(admin, 1);
  const scenario = scenarios[0];

  const memberAdd = await admin.request("POST", `/api/campaigns/${campaign.id}/members`, {
    userId: playerIdentity.id,
    role: "player"
  });
  assert.equal(memberAdd.status, 204);

  const adminUsers = await player.request("GET", "/api/admin/users");
  assert.equal(adminUsers.status, 403);
  assert.match(adminUsers.json.error, /player access restricted/i);

  const share = await player.request("POST", `/api/scenarios/${scenario.id}/share`);
  assert.equal(share.status, 403);
  assert.match(share.json.error, /player access restricted/i);

  const clearLive = await player.request("POST", `/api/campaigns/${campaign.id}/live/clear`);
  assert.equal(clearLive.status, 403);
  assert.match(clearLive.json.error, /player access restricted/i);
});

test("sharing second scenario replaces previously shared one for a campaign", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { campaign, scenarios } = await createCampaignAndScenarios(admin, 2);

  const firstShare = await admin.request("POST", `/api/scenarios/${scenarios[0].id}/share`);
  assert.equal(firstShare.status, 200);
  assert.equal(firstShare.json.shared_scenario_id, scenarios[0].id);

  const secondShare = await admin.request("POST", `/api/scenarios/${scenarios[1].id}/share`);
  assert.equal(secondShare.status, 200);
  assert.equal(secondShare.json.shared_scenario_id, scenarios[1].id);

  const live = await admin.request("GET", `/api/campaigns/${campaign.id}/live`);
  assert.equal(live.status, 200);
  assert.equal(live.json.shared_scenario_id, scenarios[1].id);
});

test("live clear endpoint unshares an active encounter", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { campaign, scenarios } = await createCampaignAndScenarios(admin, 1);

  const share = await admin.request("POST", `/api/scenarios/${scenarios[0].id}/share`);
  assert.equal(share.status, 200);
  assert.equal(share.json.shared_scenario_id, scenarios[0].id);

  const clear = await admin.request("POST", `/api/campaigns/${campaign.id}/live/clear`);
  assert.equal(clear.status, 200);
  assert.equal(clear.json.shared_scenario_id, null);

  const liveAfter = await admin.request("GET", `/api/campaigns/${campaign.id}/live`);
  assert.equal(liveAfter.status, 200);
  assert.equal(liveAfter.json.shared_scenario_id, null);
});

test("completing non-shared scenario does not clear another shared scenario", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const { campaign, scenarios } = await createCampaignAndScenarios(admin, 2);

  const share = await admin.request("POST", `/api/scenarios/${scenarios[0].id}/share`);
  assert.equal(share.status, 200);
  assert.equal(share.json.shared_scenario_id, scenarios[0].id);

  const completeOther = await admin.request("POST", `/api/scenarios/${scenarios[1].id}/completed`, {
    completed: true
  });
  assert.equal(completeOther.status, 200);
  assert.equal(Number(completeOther.json.is_completed), 1);

  const live = await admin.request("GET", `/api/campaigns/${campaign.id}/live`);
  assert.equal(live.status, 200);
  assert.equal(live.json.shared_scenario_id, scenarios[0].id);
});

test("player live only returns shared encounters from assigned campaigns", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const playerIdentity = await createPlayer(admin, `assigned_${Date.now()}`);
  const player = await login(playerIdentity.username, playerIdentity.password);

  const assigned = await createCampaignAndScenarios(admin, 1);
  const unassigned = await createCampaignAndScenarios(admin, 1);

  const memberAdd = await admin.request("POST", `/api/campaigns/${assigned.campaign.id}/members`, {
    userId: playerIdentity.id,
    role: "player"
  });
  assert.equal(memberAdd.status, 204);

  await admin.request("POST", `/api/scenarios/${unassigned.scenarios[0].id}/share`);
  const liveWithoutAssignedShare = await player.request("GET", "/api/player/live");
  assert.equal(liveWithoutAssignedShare.status, 200);
  assert.equal(liveWithoutAssignedShare.json.shared, null);

  await admin.request("POST", `/api/scenarios/${assigned.scenarios[0].id}/share`);
  const liveWithAssignedShare = await player.request("GET", "/api/player/live");
  assert.equal(liveWithAssignedShare.status, 200);
  assert.ok(liveWithAssignedShare.json.shared);
  assert.equal(liveWithAssignedShare.json.shared.scenarioId, assigned.scenarios[0].id);
});

test("player live scene payload appears on share and clears on unshare", async () => {
  const admin = await login("fridolin", "eeZ8Z2n7EkLe8OP0mN43");
  const playerIdentity = await createPlayer(admin, `scene_${Date.now()}`);
  const player = await login(playerIdentity.username, playerIdentity.password);

  const { campaign } = await createCampaignAndScenarios(admin, 1);
  const addMember = await admin.request("POST", `/api/campaigns/${campaign.id}/members`, {
    userId: playerIdentity.id,
    role: "player"
  });
  assert.equal(addMember.status, 204);

  let response = await player.request("POST", "/api/users/me/active-campaign", {
    campaignId: campaign.id
  });
  assert.equal(response.status, 204);

  const createScene = await admin.request("POST", `/api/campaigns/${campaign.id}/scenes`, {
    name: "Moonlit Alley",
    imageData: "data:image/png;base64,scene"
  });
  assert.equal(createScene.status, 201);

  const beforeShare = await player.request("GET", "/api/player/live");
  assert.equal(beforeShare.status, 200);
  assert.equal(beforeShare.json.scene, null);

  response = await admin.request("POST", `/api/campaigns/${campaign.id}/scene/share`, {
    sceneId: createScene.json.id
  });
  assert.equal(response.status, 200);
  assert.equal(response.json.shared_scene_image_id, createScene.json.id);

  const afterShare = await player.request("GET", "/api/player/live");
  assert.equal(afterShare.status, 200);
  assert.ok(afterShare.json.scene);
  assert.equal(afterShare.json.scene.id, createScene.json.id);
  assert.equal(afterShare.json.scene.name, "Moonlit Alley");
  assert.equal(afterShare.json.scene.imageData, "data:image/png;base64,scene");

  response = await admin.request("POST", `/api/campaigns/${campaign.id}/scene/share`, {
    sceneId: null
  });
  assert.equal(response.status, 200);
  assert.equal(response.json.shared_scene_image_id, null);

  const afterUnshare = await player.request("GET", "/api/player/live");
  assert.equal(afterUnshare.status, 200);
  assert.equal(afterUnshare.json.scene, null);
});

test.after(() => {
  delete process.env.WDT_ADMIN_USERNAME;
  delete process.env.WDT_ADMIN_PASSWORD;
  delete process.env.FWDT_DB_PATH;
  fs.rmSync(tempDir, { recursive: true, force: true });
});
