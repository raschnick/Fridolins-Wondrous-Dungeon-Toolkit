const state = {
  page: "welcome",
  lastScenarioPage: "scenario-edit",
  monsters: [],
  monsterSearchQuery: "",
  monsterEditorReadOnly: true,
  selectedMonsterId: null,
  draftMonsterImageData: "",
  runPreviewEnemyId: null,
  campaigns: [],
  campaignSummaries: {},
  selectedCampaignId: null,
  characters: [],
  scenarios: [],
  selectedScenarioId: null,
  combat: {
    round: 1,
    turnIndex: 0,
    activeCombatantId: null,
    combatants: []
  }
};

const els = {
  status: document.getElementById("status"),
  pageWelcome: document.getElementById("pageWelcome"),
  pageMonsters: document.getElementById("pageMonsters"),
  pageAnalytics: document.getElementById("pageAnalytics"),
  pageCampaign: document.getElementById("pageCampaign"),
  pageScenarioEdit: document.getElementById("pageScenarioEdit"),
  pageScenarioRun: document.getElementById("pageScenarioRun"),
  mainHomeBtn: document.getElementById("mainHomeBtn"),
  mainMonstersBtn: document.getElementById("mainMonstersBtn"),
  mainAnalyticsBtn: document.getElementById("mainAnalyticsBtn"),
  addCampaignBtn: document.getElementById("addCampaignBtn"),
  welcomeCampaignList: document.getElementById("welcomeCampaignList"),
  navMonsterBtn: document.getElementById("navMonsterBtn"),
  navSepMonster: document.getElementById("navSepMonster"),
  navHomeBtn: document.getElementById("navHomeBtn"),
  navCampaignBtn: document.getElementById("navCampaignBtn"),
  navScenarioBtn: document.getElementById("navScenarioBtn"),
  navSepCampaign: document.getElementById("navSepCampaign"),
  navSepScenario: document.getElementById("navSepScenario"),
  monsterList: document.getElementById("monsterList"),
  monsterSearchInput: document.getElementById("monsterSearchInput"),
  monsterForm: document.getElementById("monsterForm"),
  monsterName: document.getElementById("monsterName"),
  monsterIsLegendary: document.getElementById("monsterIsLegendary"),
  monsterLegendaryActionsWrap: document.getElementById("monsterLegendaryActionsWrap"),
  monsterReadonlyView: document.getElementById("monsterReadonlyView"),
  monsterImageFile: document.getElementById("monsterImageFile"),
  monsterImagePreview: document.getElementById("monsterImagePreview"),
  editMonsterBtn: document.getElementById("editMonsterBtn"),
  saveMonsterBtn: document.getElementById("saveMonsterBtn"),
  newMonsterBtn: document.getElementById("newMonsterBtn"),
  deleteMonsterBtn: document.getElementById("deleteMonsterBtn"),
  createLibraryEntryForm: document.getElementById("createLibraryEntryForm"),
  libraryEntryName: document.getElementById("libraryEntryName"),
  libraryEntryLegendary: document.getElementById("libraryEntryLegendary"),
  libraryEntryLegendaryWrap: document.getElementById("libraryEntryLegendaryWrap"),
  createCampaignModalForm: document.getElementById("createCampaignModalForm"),
  newCampaignName: document.getElementById("newCampaignName"),
  campaignPageTitle: document.getElementById("campaignPageTitle"),
  deleteCampaignBtn: document.getElementById("deleteCampaignBtn"),
  characterList: document.getElementById("characterList"),
  createCharacterForm: document.getElementById("createCharacterForm"),
  addCharacterBtn: document.getElementById("addCharacterBtn"),
  charName: document.getElementById("charName"),
  charClass: document.getElementById("charClass"),
  scenarioList: document.getElementById("scenarioList"),
  createScenarioForm: document.getElementById("createScenarioForm"),
  addScenarioBtn: document.getElementById("addScenarioBtn"),
  scenarioName: document.getElementById("scenarioName"),
  scenarioNotes: document.getElementById("scenarioNotes"),
  goRunFromEditBtn: document.getElementById("goRunFromEditBtn"),
  editScenarioForm: document.getElementById("editScenarioForm"),
  editScenarioName: document.getElementById("editScenarioName"),
  editScenarioNotes: document.getElementById("editScenarioNotes"),
  addEnemyForm: document.getElementById("addEnemyForm"),
  enemyName: document.getElementById("enemyName"),
  enemyMonsterSelect: document.getElementById("enemyMonsterSelect"),
  enemyRole: document.getElementById("enemyRole"),
  enemyInitiative: document.getElementById("enemyInitiative"),
  rollEnemyInitiativeBtn: document.getElementById("rollEnemyInitiativeBtn"),
  enemyHp: document.getElementById("enemyHp"),
  enemyMonsterPreview: document.getElementById("enemyMonsterPreview"),
  combatantEditList: document.getElementById("combatantEditList"),
  runScenarioName: document.getElementById("runScenarioName"),
  runScenarioNotes: document.getElementById("runScenarioNotes"),
  runRound: document.getElementById("runRound"),
  runCurrentTurn: document.getElementById("runCurrentTurn"),
  goEditFromRunBtn: document.getElementById("goEditFromRunBtn"),
  activeMonsterImageWrap: document.getElementById("activeMonsterImageWrap"),
  activeMonsterImageHint: document.getElementById("activeMonsterImageHint"),
  activeMonsterImage: document.getElementById("activeMonsterImage"),
  imageModal: document.getElementById("imageModal"),
  imageModalImg: document.getElementById("imageModalImg"),
  imageModalCloseBtn: document.getElementById("imageModalCloseBtn"),
  campaignActionModal: document.getElementById("campaignActionModal"),
  campaignActionTitle: document.getElementById("campaignActionTitle"),
  campaignActionCloseBtn: document.getElementById("campaignActionCloseBtn"),
  revokeTurnBtn: document.getElementById("revokeTurnBtn"),
  nextTurnBtn: document.getElementById("nextTurnBtn"),
  resetCombatBtn: document.getElementById("resetCombatBtn"),
  runOrderList: document.getElementById("runOrderList")
};

const CONDITIONS = [
  {
    key: "blinded",
    label: "Blinded",
    color: "#7b4f4f",
    tip:
      "While you have the Blinded condition: Can't See. You can't see and automatically fail any ability check that requires sight. Attacks Affected. Attack rolls against you have Advantage, and your attack rolls have Disadvantage."
  },
  {
    key: "charmed",
    label: "Charmed",
    color: "#b2648d",
    tip:
      "While you have the Charmed condition: Can't Harm the Charmer. You can't attack the charmer or target the charmer with damaging abilities or magical effects. Social Advantage. The charmer has Advantage on any ability check to interact with you socially."
  },
  {
    key: "deafened",
    label: "Deafened",
    color: "#5b6d7a",
    tip:
      "While you have the Deafened condition: Can't Hear. You can't hear and automatically fail any ability check that requires hearing."
  },
  {
    key: "exhaustion",
    label: "Exhaustion",
    color: "#9b6a3c",
    tip:
      "While you have the Exhaustion condition: Exhaustion Levels. This condition is cumulative; each time you receive it, you gain 1 level, and you die if your level is 6. D20 Tests Affected. When you make a D20 Test, the roll is reduced by 2 times your Exhaustion level. Speed Reduced. Your Speed is reduced by 5 times your Exhaustion level. Removing Exhaustion Levels. Finishing a Long Rest removes 1 level; when your level reaches 0, the condition ends."
  },
  {
    key: "frightened",
    label: "Frightened",
    color: "#83624a",
    tip:
      "While you have the Frightened condition: Ability Checks and Attacks Affected. You have Disadvantage on ability checks and attack rolls while the source of fear is within line of sight. Can't Approach. You can't willingly move closer to the source of fear."
  },
  {
    key: "grappled",
    label: "Grappled",
    color: "#6f5443",
    tip:
      "While you have the Grappled condition: Speed 0. Your Speed is 0 and can't increase. Attacks Affected. You have Disadvantage on attack rolls against any target other than the grappler. Movable. The grappler can drag or carry you when it moves, but every foot of movement costs it 1 extra foot unless you are Tiny or two or more sizes smaller than it."
  },
  {
    key: "incapacitated",
    label: "Incapacitated",
    color: "#56706f",
    tip:
      "While you have the Incapacitated condition: Inactive. You can't take any action, Bonus Action, or Reaction. No Concentration. Your Concentration is broken. Speechless. You can't speak. Surprised. If you're Incapacitated when you roll Initiative, you have Disadvantage on the roll."
  },
  {
    key: "concentrated",
    label: "Concentrated",
    color: "#4d6d7f",
    tip:
      "If you take damage, you must succeed on a Constitution saving throw to maintain Concentration. The DC equals 10 or half the damage taken (round down), whichever number is higher, up to a maximum DC of 30."
  },
  {
    key: "invisible",
    label: "Invisible",
    color: "#6f6f8f",
    tip:
      "While you have the Invisible condition: Surprise. If you're Invisible when you roll Initiative, you have Advantage on the roll. Concealed. You aren't affected by any effect that requires its target to be seen unless the effect's creator can somehow see you; any equipment you are wearing or carrying is also concealed. Attacks Affected. Attack rolls against you have Disadvantage, and your attack rolls have Advantage; if a creature can somehow see you, you don't gain this benefit against that creature."
  },
  {
    key: "paralyzed",
    label: "Paralyzed",
    color: "#6c5a90",
    tip:
      "While you have the Paralyzed condition: Incapacitated. You have the Incapacitated condition. Speed 0. Your Speed is 0 and can't increase. Saving Throws Affected. You automatically fail Strength and Dexterity saving throws. Attacks Affected. Attack rolls against you have Advantage. Automatic Critical Hits. Any attack roll that hits you is a Critical Hit if the attacker is within 5 feet of you."
  },
  {
    key: "petrified",
    label: "Petrified",
    color: "#6f6f6f",
    tip:
      "While you have the Petrified condition: Turned to Inanimate Substance. You and nonmagical worn/carried objects are transformed into a solid inanimate substance (usually stone); your weight increases tenfold, and you cease aging. Incapacitated. You have the Incapacitated condition. Speed 0. Your Speed is 0 and can't increase. Attacks Affected. Attack rolls against you have Advantage. Saving Throws Affected. You automatically fail Strength and Dexterity saving throws. Resist Damage. You have Resistance to all damage. Poison Immunity. You have Immunity to the Poisoned condition."
  },
  {
    key: "poisoned",
    label: "Poisoned",
    color: "#4a7d4f",
    tip:
      "While you have the Poisoned condition: Ability Checks and Attacks Affected. You have Disadvantage on attack rolls and ability checks."
  },
  {
    key: "prone",
    label: "Prone",
    color: "#8c6c52",
    tip:
      "While you have the Prone condition: Restricted Movement. Your only movement options are to crawl or to spend movement equal to half your Speed (round down) to right yourself and end the condition; if your Speed is 0, you can't right yourself. Attacks Affected. You have Disadvantage on attack rolls. An attack roll against you has Advantage if the attacker is within 5 feet of you; otherwise that attack roll has Disadvantage."
  },
  {
    key: "restrained",
    label: "Restrained",
    color: "#826944",
    tip:
      "While you have the Restrained condition: Speed 0. Your Speed is 0 and can't increase. Attacks Affected. Attack rolls against you have Advantage, and your attack rolls have Disadvantage. Saving Throws Affected. You have Disadvantage on Dexterity saving throws."
  },
  {
    key: "stunned",
    label: "Stunned",
    color: "#7c6a85",
    tip:
      "While you have the Stunned condition: Incapacitated. You have the Incapacitated condition. Saving Throws Affected. You automatically fail Strength and Dexterity saving throws. Attacks Affected. Attack rolls against you have Advantage."
  },
  {
    key: "unconscious",
    label: "Unconscious",
    color: "#4f5b7a",
    tip:
      "While you have the Unconscious condition: Inert. You have the Incapacitated and Prone conditions, and you drop whatever you're holding; when this condition ends, you remain Prone. Speed 0. Your Speed is 0 and can't increase. Attacks Affected. Attack rolls against you have Advantage. Saving Throws Affected. You automatically fail Strength and Dexterity saving throws. Automatic Critical Hits. Any attack roll that hits you is a Critical Hit if the attacker is within 5 feet of you. Unaware. You're unaware of your surroundings."
  },
  {
    key: "down",
    label: "Down",
    color: "#7a5f4f",
    tip:
      "You are at 0 hitpoints. But don't you dare to die now."
  }
];

const CONDITION_BY_KEY = Object.fromEntries(CONDITIONS.map((c) => [c.key, c]));

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed." }));
    throw new Error(err.error || "Request failed.");
  }
  if (res.status === 204) return null;
  return res.json();
}

function setStatus(message = "") {
  els.status.textContent = message;
}

function setMonsterImagePreview(dataUrl) {
  if (dataUrl) {
    els.monsterImagePreview.src = dataUrl;
    els.monsterImagePreview.classList.remove("hidden");
  } else {
    els.monsterImagePreview.src = "";
    els.monsterImagePreview.classList.add("hidden");
  }
}

function setEnemyMonsterPreview(dataUrl) {
  if (dataUrl) {
    els.enemyMonsterPreview.src = dataUrl;
    els.enemyMonsterPreview.classList.remove("hidden");
  } else {
    els.enemyMonsterPreview.src = "";
    els.enemyMonsterPreview.classList.add("hidden");
  }
}

function updateMonsterLegendaryFieldsVisibility() {
  const isLegendary = els.monsterIsLegendary.value === "true";
  els.monsterLegendaryActionsWrap.classList.toggle("hidden", !isLegendary);
}

function updateLibraryEntryLegendaryFieldsVisibility() {
  const isLegendary = els.libraryEntryLegendary.value === "true";
  els.libraryEntryLegendaryWrap.classList.toggle("hidden", !isLegendary);
}

function setMonsterEditorReadOnly(readOnly) {
  state.monsterEditorReadOnly = readOnly;
  els.monsterForm.classList.toggle("monster-form-readonly", readOnly);
  els.monsterName.readOnly = readOnly;
  els.monsterIsLegendary.disabled = readOnly;
  els.monsterImageFile.disabled = readOnly;
  document
    .querySelectorAll('input[name="monsterLegendaryActionsCount"]')
    .forEach((input) => {
      input.disabled = readOnly;
    });
  els.editMonsterBtn.textContent = readOnly ? "Edit" : "Cancel";
  els.editMonsterBtn.disabled = !selectedMonster();
  els.saveMonsterBtn.disabled = readOnly;
  renderMonsterReadonlyView();
}

function cancelMonsterEditorChanges() {
  const monster = selectedMonster();
  if (monster) {
    fillMonsterForm(monster);
  } else {
    clearMonsterForm();
  }
  setMonsterEditorReadOnly(true);
}

function appendReadonlyRow(labelText, valueText) {
  const row = document.createElement("div");
  row.className = "monster-readonly-row";
  const label = document.createElement("span");
  label.className = "monster-readonly-label";
  label.textContent = labelText;
  row.appendChild(label);
  const value = document.createElement("span");
  value.className = "monster-readonly-value";
  value.textContent = valueText;
  row.appendChild(value);
  els.monsterReadonlyView.appendChild(row);
}

function renderMonsterReadonlyView() {
  if (!els.monsterReadonlyView) return;
  els.monsterReadonlyView.innerHTML = "";
  if (!state.monsterEditorReadOnly) return;

  const monster = selectedMonster();
  if (!monster) {
    const empty = document.createElement("p");
    empty.className = "hint";
    empty.textContent = "Select an entry or create one with New Entry.";
    els.monsterReadonlyView.appendChild(empty);
    return;
  }

  appendReadonlyRow("Name", monster.name || "-");
  if (monster.is_legendary) {
    const count = Number(monster.legendary_actions_count);
    const suffix = Number.isInteger(count) ? ` (${count})` : "";
    appendReadonlyRow("Legendary", `Yes${suffix}`);
  } else {
    appendReadonlyRow("Legendary", "No");
  }
}

function toggleMonsterEditorMode() {
  if (!selectedMonster()) {
    setStatus("Select a library entry first.");
    return;
  }
  if (state.monsterEditorReadOnly) {
    setMonsterEditorReadOnly(false);
  } else {
    cancelMonsterEditorChanges();
  }
}

function openImageModal(src) {
  if (!src) return;
  els.imageModalImg.src = src;
  els.imageModal.classList.remove("hidden");
}

function closeImageModal() {
  els.imageModal.classList.add("hidden");
  els.imageModalImg.src = "";
}

function openCampaignActionModal(mode) {
  if ((mode === "character" || mode === "scenario") && !state.selectedCampaignId) return;
  const isCampaign = mode === "campaign";
  const isLibraryEntry = mode === "library-entry";
  const isCharacter = mode === "character";
  els.createCampaignModalForm.classList.toggle("hidden", !isCampaign);
  els.createLibraryEntryForm.classList.toggle("hidden", !isLibraryEntry);
  els.createCharacterForm.classList.toggle("hidden", !isCharacter);
  els.createScenarioForm.classList.toggle(
    "hidden",
    isCharacter || isCampaign || isLibraryEntry
  );
  if (isCampaign) {
    els.campaignActionTitle.textContent = "Create Campaign";
  } else if (isLibraryEntry) {
    els.campaignActionTitle.textContent = "New Library Entry";
  } else {
    els.campaignActionTitle.textContent = isCharacter ? "Add Character" : "Add Scenario";
  }
  els.campaignActionModal.classList.remove("hidden");
  if (isCampaign) {
    els.newCampaignName.value = "";
    els.newCampaignName.focus();
  } else if (isLibraryEntry) {
    els.libraryEntryName.value = "";
    els.libraryEntryLegendary.value = "false";
    const defaultLegendary = document.querySelector(
      'input[name="libraryLegendaryActionsCount"][value="3"]'
    );
    if (defaultLegendary) defaultLegendary.checked = true;
    updateLibraryEntryLegendaryFieldsVisibility();
    els.libraryEntryName.focus();
  } else if (isCharacter) {
    els.charName.value = "";
    els.charClass.value = "";
    els.charName.focus();
  } else {
    els.scenarioName.value = "";
    els.scenarioNotes.value = "";
    els.scenarioName.focus();
  }
}

function closeCampaignActionModal() {
  els.campaignActionModal.classList.add("hidden");
}

function dataUrlBytes(dataUrl) {
  const base64 = dataUrl.split(",")[1] || "";
  return Math.floor((base64.length * 3) / 4);
}

function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to read image file."));
    };
    image.src = url;
  });
}

async function readFileAsDataUrl(file) {
  const image = await loadImageFromFile(file);
  const maxWidth = 1800;
  const targetBytes = 850 * 1024;

  let width = image.naturalWidth;
  let height = image.naturalHeight;
  if (width > maxWidth) {
    const scale = maxWidth / width;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process image.");

  let quality = 0.92;
  let dataUrl = "";

  for (let i = 0; i < 8; i += 1) {
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(image, 0, 0, width, height);

    dataUrl = canvas.toDataURL("image/jpeg", quality);
    if (dataUrlBytes(dataUrl) <= targetBytes) return dataUrl;

    if (quality > 0.6) {
      quality -= 0.08;
    } else {
      width = Math.max(300, Math.round(width * 0.9));
      height = Math.max(300, Math.round(height * 0.9));
    }
  }

  return dataUrl;
}

function selectedScenario() {
  return state.scenarios.find((s) => s.id === state.selectedScenarioId) || null;
}

function selectedCampaign() {
  return state.campaigns.find((c) => c.id === state.selectedCampaignId) || null;
}

function selectedMonster() {
  return state.monsters.find((m) => m.id === state.selectedMonsterId) || null;
}

function combatantKindLabel(combatant) {
  if (combatant.kind === "character") return "PC";
  return combatant.enemy_role === "npc" ? "NPC" : "Enemy";
}

function slugifyClassName(name) {
  return `${name || ""}`.trim().toLowerCase().replace(/\s+/g, "-");
}

function combatantIconSrc(combatant) {
  if (combatant.kind === "character") {
    return `/icons/classes/${slugifyClassName(combatant.character_class)}.png`;
  }
  return combatant.enemy_role === "npc"
    ? "/icons/npc.png"
    : "/icons/enemy.png";
}

function combatantIconFallbackSrc(combatant) {
  if (combatant.kind === "character") return "/icons/pc.svg";
  return combatant.enemy_role === "npc"
    ? "/icons/npc.svg"
    : "/icons/enemy.svg";
}

function createCombatantNameElement(combatant) {
  const wrapper = document.createElement("span");
  wrapper.className = "combatant-name";

  const icon = document.createElement("img");
  icon.className = "combatant-icon";
  icon.alt = combatantKindLabel(combatant);
  const fallbackSrc = combatantIconFallbackSrc(combatant);
  icon.src = combatantIconSrc(combatant);
  icon.addEventListener("error", () => {
    if (!icon.src.endsWith(fallbackSrc)) {
      icon.src = fallbackSrc;
    }
  });
  wrapper.appendChild(icon);

  const text = document.createElement("span");
  text.textContent = combatant.name;
  wrapper.appendChild(text);

  return wrapper;
}

function normalizePathname(pathname) {
  if (!pathname) return "/";
  const cleaned = pathname.replace(/\/+$/, "");
  return cleaned === "" ? "/" : cleaned;
}

function parseRoute(pathname) {
  const path = normalizePathname(pathname);
  if (path === "/") return { page: "welcome" };
  if (path === "/library") return { page: "monsters" };
  if (path === "/monsters") return { page: "monsters" };
  if (path === "/analytics") return { page: "analytics" };

  let match = path.match(/^\/campaigns\/(\d+)$/);
  if (match) {
    return { page: "campaign", campaignId: Number(match[1]) };
  }

  match = path.match(/^\/campaigns\/(\d+)\/scenarios\/(\d+)\/(edit|run)$/);
  if (match) {
    return {
      page: match[3] === "run" ? "scenario-run" : "scenario-edit",
      campaignId: Number(match[1]),
      scenarioId: Number(match[2])
    };
  }
  return null;
}

function routePathFor(page, campaignId = null, scenarioId = null) {
  if (page === "welcome") return "/";
  if (page === "monsters") return "/library";
  if (page === "analytics") return "/analytics";
  if (page === "campaign" && Number.isInteger(campaignId)) {
    return `/campaigns/${campaignId}`;
  }
  if (
    (page === "scenario-edit" || page === "scenario-run") &&
    Number.isInteger(campaignId) &&
    Number.isInteger(scenarioId)
  ) {
    const mode = page === "scenario-run" ? "run" : "edit";
    return `/campaigns/${campaignId}/scenarios/${scenarioId}/${mode}`;
  }
  return "/";
}

async function syncHistory(path, { replace = false } = {}) {
  if (replace) {
    history.replaceState({}, "", path);
    return;
  }
  if (window.location.pathname !== path) {
    history.pushState({}, "", path);
  }
}

let routeRequestId = 0;

async function applyRoute(route, { replace = false } = {}) {
  const requestId = ++routeRequestId;
  const isCurrent = () => requestId === routeRequestId;

  const safeNavigate = async (path, message) => {
    if (message) setStatus(message);
    await navigateToPath(path, { replace: true });
  };

  if (route.page === "monsters") {
    try {
      await loadMonsters();
    } catch (error) {
      setStatus(error.message);
    }
    if (!isCurrent()) return;
    showPage("monsters");
    await syncHistory("/library", { replace });
    return;
  }

  if (route.page === "analytics") {
    showPage("analytics");
    await syncHistory("/analytics", { replace });
    return;
  }

  if (route.page === "welcome") {
    state.selectedCampaignId = null;
    state.selectedScenarioId = null;
    state.characters = [];
    state.scenarios = [];
    await safeLoadCombatState();
    try {
      await loadCampaigns();
    } catch (error) {
      setStatus(error.message);
    }
    if (!isCurrent()) return;
    showPage("welcome");
    await syncHistory("/", { replace });
    return;
  }

  if (!Number.isInteger(route.campaignId)) {
    await safeNavigate("/", "Invalid campaign route.");
    return;
  }

  try {
    await loadCampaigns();
  } catch (error) {
    setStatus(error.message);
  }
  if (!isCurrent()) return;

  const campaignExists = state.campaigns.some((c) => c.id === route.campaignId);
  if (!campaignExists) {
    await safeNavigate("/", "Campaign not found.");
    return;
  }

  state.selectedCampaignId = route.campaignId;
  await loadCampaignData();
  if (!isCurrent()) return;

  if (route.page === "campaign") {
    showPage("campaign");
    await syncHistory(routePathFor("campaign", route.campaignId), { replace });
    return;
  }

  if (!Number.isInteger(route.scenarioId)) {
    await safeNavigate(routePathFor("campaign", route.campaignId), "Invalid scenario route.");
    return;
  }

  const scenarioExists = state.scenarios.some((s) => s.id === route.scenarioId);
  if (!scenarioExists) {
    await safeNavigate(routePathFor("campaign", route.campaignId), "Scenario not found in campaign.");
    return;
  }

  state.selectedScenarioId = route.scenarioId;
  await safeLoadCombatState();
  if (!isCurrent()) return;

  state.lastScenarioPage = route.page;
  if (route.page === "scenario-run") {
    focusPreviewOnActiveNonPc();
    renderScenarioRunPage();
    showPage("scenario-run");
  } else {
    renderScenarioEditPage();
    showPage("scenario-edit");
  }
  await syncHistory(routePathFor(route.page, route.campaignId, route.scenarioId), { replace });
}

async function navigateToPath(path, { replace = false } = {}) {
  const route = parseRoute(path);
  if (!route) {
    setStatus("Unknown route. Redirected to home.");
    await applyRoute({ page: "welcome" }, { replace: true });
    return;
  }
  await applyRoute(route, { replace });
}

async function navigateToPage(page, { campaignId = null, scenarioId = null, replace = false } = {}) {
  const path = routePathFor(page, campaignId, scenarioId);
  await navigateToPath(path, { replace });
}

function showPage(page) {
  state.page = page;
  document.body.classList.toggle("page-run", page === "scenario-run");
  els.pageWelcome.classList.toggle("hidden", page !== "welcome");
  els.pageMonsters.classList.toggle("hidden", page !== "monsters");
  els.pageAnalytics.classList.toggle("hidden", page !== "analytics");
  els.pageCampaign.classList.toggle("hidden", page !== "campaign");
  els.pageScenarioEdit.classList.toggle("hidden", page !== "scenario-edit");
  els.pageScenarioRun.classList.toggle("hidden", page !== "scenario-run");
  renderMainSections();
  renderNav();
}

function renderMainSections() {
  const inHome =
    state.page === "welcome" ||
    state.page === "campaign" ||
    state.page === "scenario-edit" ||
    state.page === "scenario-run";
  els.mainHomeBtn.classList.toggle("active", inHome);
  els.mainMonstersBtn.classList.toggle("active", state.page === "monsters");
  els.mainAnalyticsBtn.classList.toggle("active", state.page === "analytics");
}

function renderNav() {
  const campaign = selectedCampaign();
  const scenario = selectedScenario();

  const inHomePath =
    state.page === "welcome" ||
    state.page === "campaign" ||
    state.page === "scenario-edit" ||
    state.page === "scenario-run";

  const inMonsters = state.page === "monsters";
  const inAnalytics = state.page === "analytics";

  if (inMonsters) {
    els.navHomeBtn.textContent = "Library";
    els.navHomeBtn.disabled = true;
  } else if (inAnalytics) {
    els.navHomeBtn.textContent = "Analytics";
    els.navHomeBtn.disabled = true;
  } else {
    els.navHomeBtn.textContent = "Home";
    els.navHomeBtn.disabled = state.page === "welcome";
  }

  els.navMonsterBtn.classList.add("hidden");
  els.navSepMonster.classList.add("hidden");

  const showCampaignCrumb =
    inHomePath &&
    Boolean(campaign) &&
    (state.page === "campaign" || state.page === "scenario-edit" || state.page === "scenario-run");
  els.navCampaignBtn.classList.toggle("hidden", !showCampaignCrumb);
  els.navSepCampaign.classList.toggle("hidden", !showCampaignCrumb);
  if (showCampaignCrumb && campaign) {
    els.navCampaignBtn.textContent = campaign.name;
    els.navCampaignBtn.disabled = state.page === "campaign";
  }

  const showScenarioCrumb =
    inHomePath &&
    Boolean(scenario) &&
    (state.page === "scenario-edit" || state.page === "scenario-run");
  els.navScenarioBtn.classList.toggle("hidden", !showScenarioCrumb);
  els.navSepScenario.classList.toggle("hidden", !showScenarioCrumb);
  if (showScenarioCrumb && scenario) {
    els.navScenarioBtn.textContent = scenario.name;
    els.navScenarioBtn.disabled =
      state.page === "scenario-edit" || state.page === "scenario-run";
  }
}

function renderWelcomeCampaigns() {
  els.welcomeCampaignList.innerHTML = "";
  if (state.campaigns.length === 0) {
    els.welcomeCampaignList.innerHTML = "<li>No campaigns yet.</li>";
    return;
  }

  for (const campaign of state.campaigns) {
    const li = document.createElement("li");
    li.className = "campaign-overview-row";
    li.tabIndex = 0;

    const row = document.createElement("div");
    row.className = "campaign-overview-grid";

    const name = document.createElement("strong");
    name.textContent = campaign.name;
    row.appendChild(name);

    const playersWrap = document.createElement("div");
    playersWrap.className = "campaign-overview-players";
    const summary = state.campaignSummaries[campaign.id] || { players: [], scenarioCount: 0 };
    if (summary.players.length === 0) {
      const noPlayers = document.createElement("span");
      noPlayers.className = "hint";
      noPlayers.textContent = "No players";
      playersWrap.appendChild(noPlayers);
    } else {
      for (const player of summary.players) {
        const badge = document.createElement("span");
        badge.className = "campaign-player-badge";

        const icon = document.createElement("img");
        icon.className = "campaign-player-icon";
        icon.alt = player.class_name || "PC";
        icon.src = `/icons/classes/${slugifyClassName(player.class_name)}.png`;
        icon.addEventListener("error", () => {
          if (!icon.src.endsWith("/icons/pc.svg")) icon.src = "/icons/pc.svg";
        });
        badge.appendChild(icon);

        const label = document.createElement("span");
        label.textContent = player.name;
        badge.appendChild(label);
        playersWrap.appendChild(badge);
      }
    }
    row.appendChild(playersWrap);

    const scenarioCount = document.createElement("span");
    scenarioCount.className = "campaign-scenario-count";
    scenarioCount.textContent = `${summary.scenarioCount} scenario${summary.scenarioCount === 1 ? "" : "s"}`;
    row.appendChild(scenarioCount);

    li.appendChild(row);

    const openCampaign = async () => {
      await navigateToPage("campaign", { campaignId: campaign.id });
    };
    li.addEventListener("click", openCampaign);
    li.addEventListener("keydown", async (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      await openCampaign();
    });

    els.welcomeCampaignList.appendChild(li);
  }
}

function clearMonsterForm() {
  state.selectedMonsterId = null;
  state.draftMonsterImageData = "";
  els.monsterForm.reset();
  els.monsterIsLegendary.value = "false";
  const defaultLegendary = document.querySelector(
    'input[name="monsterLegendaryActionsCount"][value="3"]'
  );
  if (defaultLegendary) defaultLegendary.checked = true;
  updateMonsterLegendaryFieldsVisibility();
  setMonsterImagePreview("");
  els.monsterImageFile.value = "";
  renderMonsterReadonlyView();
  renderMonsterList();
}

function fillMonsterForm(monster) {
  els.monsterName.value = monster.name;
  els.monsterIsLegendary.value = monster.is_legendary ? "true" : "false";
  const currentLegendary = document.querySelector(
    `input[name="monsterLegendaryActionsCount"][value="${monster.legendary_actions_count || 3}"]`
  );
  if (currentLegendary) currentLegendary.checked = true;
  updateMonsterLegendaryFieldsVisibility();
  state.draftMonsterImageData = monster.monster_image_data || "";
  setMonsterImagePreview(state.draftMonsterImageData);
  els.monsterImageFile.value = "";
  renderMonsterReadonlyView();
}

function monsterFormPayload() {
  const isLegendary = els.monsterIsLegendary.value === "true";
  const legendarySelection = document.querySelector(
    'input[name="monsterLegendaryActionsCount"]:checked'
  );
  const legendaryActionsCount = isLegendary
    ? Number(legendarySelection?.value)
    : null;
  return {
    name: els.monsterName.value,
    isLegendary,
    legendaryActionsCount,
    monsterImageData: state.draftMonsterImageData || ""
  };
}

function renderMonsterList() {
  const query = state.monsterSearchQuery.trim().toLowerCase();
  const filtered = query
    ? state.monsters.filter((monster) => monster.name.toLowerCase().includes(query))
    : state.monsters;

  els.monsterList.innerHTML = "";
  if (filtered.length === 0) {
    els.monsterList.innerHTML = query ? "<li>No matches found.</li>" : "<li>No monsters yet.</li>";
    return;
  }

  for (const monster of filtered) {
    const li = document.createElement("li");
    if (monster.id === state.selectedMonsterId) li.classList.add("active");
    const row = document.createElement("div");
    row.className = "list-row";

    const label = document.createElement("span");
    label.className = "monster-label";
    const isLegendary = Boolean(monster.is_legendary);
    const legendaryCount = Number(monster.legendary_actions_count);
    if (isLegendary) {
      label.textContent = monster.name;
      const badge = document.createElement("span");
      badge.className = "legendary-badge";
      badge.textContent = "L";
      badge.title = Number.isInteger(legendaryCount)
        ? `Legendary (${legendaryCount} actions)`
        : "Legendary";
      label.appendChild(badge);
      if (Number.isInteger(legendaryCount)) {
        badge.title = `Legendary (${legendaryCount} actions)`;
      }
    } else {
      label.textContent = monster.name;
    }
    row.appendChild(label);

    li.addEventListener("click", () => {
      if (!state.monsterEditorReadOnly && monster.id !== state.selectedMonsterId) {
        setMonsterEditorReadOnly(true);
      }
      state.selectedMonsterId = monster.id;
      fillMonsterForm(monster);
      setMonsterEditorReadOnly(true);
      renderMonsterList();
    });

    row.appendChild(document.createElement("span"));
    li.appendChild(row);
    els.monsterList.appendChild(li);
  }
}

function renderEnemyMonsterOptions() {
  els.enemyMonsterSelect.innerHTML = '<option value="">From Library (optional)</option>';
  for (const monster of state.monsters) {
    const option = document.createElement("option");
    option.value = String(monster.id);
    option.textContent = monster.name;
    els.enemyMonsterSelect.appendChild(option);
  }
  setEnemyMonsterPreview("");
}

async function loadMonsters() {
  state.monsters = await api("/api/monsters");
  if (!state.monsters.some((m) => m.id === state.selectedMonsterId)) {
    state.selectedMonsterId = state.monsters[0]?.id ?? null;
  }
  renderMonsterList();
  const current = selectedMonster();
  if (current) fillMonsterForm(current);
  else clearMonsterForm();
  renderEnemyMonsterOptions();
}

function renderCharacters() {
  els.characterList.innerHTML = "";
  if (state.characters.length === 0) {
    els.characterList.innerHTML = "<li>No characters yet.</li>";
    return;
  }

  for (const character of state.characters) {
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "list-row";

    const label = document.createElement("span");
    label.textContent = `${character.name} (${character.class_name})`;
    row.appendChild(label);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "delete-btn";
    removeButton.textContent = "X";
    removeButton.addEventListener("click", async () => {
      if (!window.confirm(`Delete character "${character.name}" from this campaign?`)) return;
      try {
        await api(`/api/characters/${character.id}`, { method: "DELETE" });
        await loadCampaignData();
        setStatus(`Deleted character: ${character.name}`);
      } catch (error) {
        setStatus(error.message);
      }
    });
    row.appendChild(removeButton);

    li.appendChild(row);
    els.characterList.appendChild(li);
  }
}

function renderScenarios() {
  els.scenarioList.innerHTML = "";
  if (state.scenarios.length === 0) {
    els.scenarioList.innerHTML = "<li>No scenarios yet.</li>";
    return;
  }

  for (const scenario of state.scenarios) {
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "list-row";

    const label = document.createElement("span");
    label.textContent = scenario.name;
    row.appendChild(label);

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.textContent = "Edit";
    editButton.addEventListener("click", async () => {
      await navigateToPage("scenario-edit", {
        campaignId: state.selectedCampaignId,
        scenarioId: scenario.id
      });
    });
    actions.appendChild(editButton);

    const runButton = document.createElement("button");
    runButton.type = "button";
    runButton.textContent = "Run";
    runButton.addEventListener("click", async () => {
      await navigateToPage("scenario-run", {
        campaignId: state.selectedCampaignId,
        scenarioId: scenario.id
      });
    });
    actions.appendChild(runButton);

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "delete-btn";
    removeButton.textContent = "X";
    removeButton.addEventListener("click", async () => {
      if (!window.confirm(`Delete scenario "${scenario.name}"?`)) return;
      try {
        await api(`/api/scenarios/${scenario.id}`, { method: "DELETE" });
        const wasSelected = state.selectedScenarioId === scenario.id;
        if (state.selectedScenarioId === scenario.id) {
          state.selectedScenarioId = null;
        }
        await loadCampaignData();
        if (wasSelected && state.selectedCampaignId) {
          await navigateToPage("campaign", {
            campaignId: state.selectedCampaignId,
            replace: true
          });
        }
        setStatus(`Deleted scenario: ${scenario.name}`);
      } catch (error) {
        setStatus(error.message);
      }
    });
    actions.appendChild(removeButton);

    row.appendChild(actions);
    li.appendChild(row);
    els.scenarioList.appendChild(li);
  }
}

function attachInitiativeBlurUpdate(input, combatant) {
  const onBlur = async () => {
    const next = Number(input.value);
    if (!Number.isFinite(next)) return;
    try {
      await api(`/api/combatants/${combatant.id}`, {
        method: "PUT",
        body: JSON.stringify({
          initiative: next,
          name: combatant.name
        })
      });
      await safeLoadCombatState();
      if (state.page === "scenario-edit") renderScenarioEditPage();
      if (state.page === "scenario-run") renderScenarioRunPage();
    } catch (error) {
      setStatus(error.message);
    }
  };
  input.addEventListener("blur", onBlur);
}

function attachEnemyHpBlurUpdate(input, combatant) {
  const onBlur = async () => {
    const raw = input.value.trim();
    const hp = raw === "" ? null : Number(raw);
    if (hp !== null && !Number.isFinite(hp)) return;
    try {
      await api(`/api/combatants/${combatant.id}`, {
        method: "PUT",
        body: JSON.stringify({
          initiative: combatant.initiative,
          name: combatant.name,
          hp
        })
      });
      await safeLoadCombatState();
      if (state.page === "scenario-edit") renderScenarioEditPage();
      if (state.page === "scenario-run") renderScenarioRunPage();
    } catch (error) {
      setStatus(error.message);
    }
  };
  input.addEventListener("blur", onBlur);
}

function setupRunQuickEditInput(input) {
  input.type = "text";
  input.inputMode = "numeric";
  input.autocomplete = "off";
  input.spellcheck = false;
  input.readOnly = true;
  input.classList.add("run-input-locked");

  const activate = () => {
    if (!input.readOnly) return;
    input.readOnly = false;
    input.classList.remove("run-input-locked");
    input.focus();
    input.select();
  };

  input.addEventListener("mousedown", (event) => {
    if (!input.readOnly) return;
    event.preventDefault();
    activate();
  });

  input.addEventListener("focus", () => {
    if (input.readOnly) return;
    input.select();
  });

  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      input.blur();
    }
  });

  input.addEventListener("blur", () => {
    input.readOnly = true;
    input.classList.add("run-input-locked");
  });
}

function rerenderCurrentScenarioPage() {
  if (state.page === "scenario-edit") renderScenarioEditPage();
  if (state.page === "scenario-run") renderScenarioRunPage();
}

function focusPreviewOnActiveNonPc() {
  const active = state.combat.combatants.find((c) => c.id === state.combat.activeCombatantId);
  if (active && active.kind === "enemy") {
    state.runPreviewEnemyId = active.id;
  }
}

function activeCombatant() {
  return state.combat.combatants.find((c) => c.id === state.combat.activeCombatantId) || null;
}

async function toggleActiveCombatantReaction() {
  const combatant = activeCombatant();
  if (!combatant || !state.selectedScenarioId) return;
  const reactionReady = Number(combatant.reaction_available) !== 0;
  await api(`/api/combatants/${combatant.id}/reaction`, {
    method: "POST",
    body: JSON.stringify({ available: !reactionReady })
  });
  await safeLoadCombatState();
  renderScenarioRunPage();
}

async function cycleActiveCombatantLegendaryAction() {
  const combatant = activeCombatant();
  if (!combatant || !state.selectedScenarioId) return;
  const isLegendary =
    combatant.kind === "enemy" &&
    Number(combatant.is_legendary) === 1 &&
    Number.isInteger(Number(combatant.legendary_actions_count));
  if (!isLegendary) return;

  const legendaryMax = Number(combatant.legendary_actions_count);
  const currentRemainingRaw = Number(combatant.legendary_actions_remaining);
  const currentRemaining = Number.isInteger(currentRemainingRaw)
    ? Math.max(0, Math.min(legendaryMax, currentRemainingRaw))
    : legendaryMax;
  const nextRemaining = currentRemaining > 0 ? currentRemaining - 1 : legendaryMax;

  await api(`/api/combatants/${combatant.id}/legendary-actions`, {
    method: "POST",
    body: JSON.stringify({ remaining: nextRemaining })
  });
  await safeLoadCombatState();
  renderScenarioRunPage();
}

function attachConditionAdd(select, combatant) {
  select.addEventListener("change", async () => {
    const conditionKey = select.value || "";
    if (!conditionKey) return;
    try {
      await api(`/api/combatants/${combatant.id}/conditions`, {
        method: "POST",
        body: JSON.stringify({ conditionKey })
      });
      select.value = "";
      await safeLoadCombatState();
      rerenderCurrentScenarioPage();
    } catch (error) {
      setStatus(error.message);
    }
  });
}

function createConditionSelect(combatant) {
  const select = document.createElement("select");
  select.className = "condition-select";

  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "Conditions";
  placeholder.selected = true;
  select.appendChild(placeholder);

  for (const condition of CONDITIONS) {
    const option = document.createElement("option");
    option.value = condition.key;
    option.textContent = condition.label;
    if (Array.isArray(combatant.condition_keys) && combatant.condition_keys.includes(condition.key)) {
      option.disabled = true;
      option.textContent = `${condition.label} (active)`;
    }
    select.appendChild(option);
  }

  attachConditionAdd(select, combatant);
  return select;
}

function applyConditionStyle(li, combatant) {
  const keys = Array.isArray(combatant.condition_keys) ? combatant.condition_keys : [];
  if (keys.length === 0) return;

  for (const key of keys) {
    const condition = CONDITION_BY_KEY[key];
    if (!condition) continue;
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "condition-chip";
    chip.textContent = condition.label;
    chip.setAttribute("data-tip", condition.tip);
    chip.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      try {
        await api(`/api/combatants/${combatant.id}/conditions/${condition.key}`, {
          method: "DELETE"
        });
        await safeLoadCombatState();
        rerenderCurrentScenarioPage();
      } catch (error) {
        setStatus(error.message);
      }
    });
    li.appendChild(chip);
  }
}

function renderScenarioEditPage() {
  const scenario = selectedScenario();
  if (!scenario) return;

  els.editScenarioName.value = scenario.name;
  els.editScenarioNotes.value = scenario.notes || "";
  els.combatantEditList.innerHTML = "";

  if (state.combat.combatants.length === 0) {
    els.combatantEditList.innerHTML = "<li>No combatants yet.</li>";
    return;
  }

  for (const combatant of state.combat.combatants) {
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "combatant-row";

    const name = createCombatantNameElement(combatant);
    if (combatant.kind === "enemy") {
      name.style.cursor = "pointer";
      name.title = "Show this enemy statblock";
      name.addEventListener("click", () => {
        state.runPreviewEnemyId = combatant.id;
        renderScenarioRunPage();
      });
    }
    row.appendChild(name);

    const initiative = document.createElement("input");
    initiative.type = "text";
    initiative.value = String(combatant.initiative);
    initiative.required = true;
    initiative.placeholder = "Init";
    const initPrefix = document.createElement("span");
    initPrefix.className = "field-prefix";
    initPrefix.textContent = "Init";
    row.appendChild(initPrefix);
    row.appendChild(initiative);
    attachInitiativeBlurUpdate(initiative, combatant);

    const conditionSelect = createConditionSelect(combatant);
    row.appendChild(conditionSelect);

    if (combatant.kind === "enemy") {
      const hpPrefix = document.createElement("span");
      hpPrefix.className = "field-prefix";
      hpPrefix.textContent = "HP";
      row.appendChild(hpPrefix);
      const hp = document.createElement("input");
      hp.type = "number";
      hp.value = combatant.hp == null ? "" : String(combatant.hp);
      hp.placeholder = "HP";
      row.appendChild(hp);
      attachEnemyHpBlurUpdate(hp, combatant);
    }

    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "delete-btn";
    remove.textContent = "X";
    remove.addEventListener("click", async () => {
      const label = combatant.kind === "character" ? "PC" : combatantKindLabel(combatant);
      if (!window.confirm(`Remove ${label} "${combatant.name}" from this scenario?`)) return;
      try {
        await api(`/api/combatants/${combatant.id}`, { method: "DELETE" });
        await safeLoadCombatState();
        renderScenarioEditPage();
        setStatus(`Removed ${combatant.name} from scenario.`);
      } catch (error) {
        setStatus(error.message);
      }
    });
    row.appendChild(remove);

    li.appendChild(row);
    applyConditionStyle(li, combatant);
    els.combatantEditList.appendChild(li);
  }
}

function renderScenarioRunPage() {
  const scenario = selectedScenario();
  if (!scenario) return;

  els.runScenarioName.textContent = scenario.name;
  els.runScenarioNotes.textContent = scenario.notes || "No notes yet.";
  els.runRound.textContent = String(state.combat.round);
  els.runOrderList.innerHTML = "";
  els.activeMonsterImage.classList.add("hidden");
  els.activeMonsterImage.src = "";
  els.activeMonsterImageHint.classList.remove("hidden");

  if (state.combat.combatants.length === 0) {
    els.runCurrentTurn.textContent = "No combatants yet";
    els.revokeTurnBtn.disabled = true;
    els.nextTurnBtn.disabled = true;
    els.resetCombatBtn.disabled = true;
    els.runOrderList.innerHTML = "<li>No initiative order yet.</li>";
    return;
  }

  els.revokeTurnBtn.disabled = false;
  els.nextTurnBtn.disabled = false;
  els.resetCombatBtn.disabled = false;

  const active = state.combat.combatants.find((c) => c.id === state.combat.activeCombatantId);
  els.runCurrentTurn.textContent = active ? `${active.name} (${active.initiative})` : "Not set";
  if (
    !state.runPreviewEnemyId ||
    !state.combat.combatants.some((c) => c.id === state.runPreviewEnemyId && c.kind === "enemy")
  ) {
    state.runPreviewEnemyId =
      (active && active.kind === "enemy"
        ? active.id
        : state.combat.combatants.find((c) => c.kind === "enemy")?.id) || null;
  }

  const previewEnemy = state.combat.combatants.find((c) => c.id === state.runPreviewEnemyId);
  if (previewEnemy && previewEnemy.monster_image_data) {
    els.activeMonsterImage.src = previewEnemy.monster_image_data;
    els.activeMonsterImage.classList.remove("hidden");
    els.activeMonsterImageHint.classList.add("hidden");
  } else if (previewEnemy) {
    els.activeMonsterImageHint.textContent = `${previewEnemy.name} has no statblock image.`;
  } else {
    els.activeMonsterImageHint.textContent = "No NPC statblock selected.";
  }

  for (const combatant of state.combat.combatants) {
    const li = document.createElement("li");
    if (combatant.kind === "character") {
      li.classList.add("run-tone-pc");
    } else if (combatant.enemy_role === "npc") {
      li.classList.add("run-tone-npc");
    } else {
      li.classList.add("run-tone-enemy");
    }
    const row = document.createElement("div");
    row.className = "combatant-row";
    const right = document.createElement("div");
    right.className = "combatant-right";

    const name = createCombatantNameElement(combatant);
    if (combatant.kind === "enemy") {
      name.style.cursor = "pointer";
      name.title = "Show this statblock";
      name.addEventListener("click", () => {
        state.runPreviewEnemyId = combatant.id;
        renderScenarioRunPage();
      });
    }

    const initiative = document.createElement("input");
    initiative.type = "number";
    initiative.required = true;
    initiative.className = "run-order-init";
    initiative.min = "1";
    initiative.max = "99";
    initiative.maxLength = 2;
    initiative.value = String(combatant.initiative);
    initiative.placeholder = "Init";
    setupRunQuickEditInput(initiative);
    row.appendChild(initiative);
    attachInitiativeBlurUpdate(initiative, combatant);

    const reactionReady = Number(combatant.reaction_available) !== 0;
    const reactionButton = document.createElement("button");
    reactionButton.type = "button";
    reactionButton.className = "reaction-btn reaction-die";
    reactionButton.textContent = "R";
    reactionButton.title = reactionReady ? "Reaction ready (click to mark used)" : "Reaction used (click to ready)";
    reactionButton.setAttribute("aria-label", reactionButton.title);
    reactionButton.classList.toggle("used", !reactionReady);
    reactionButton.addEventListener("click", async () => {
      try {
        await api(`/api/combatants/${combatant.id}/reaction`, {
          method: "POST",
          body: JSON.stringify({ available: !reactionReady })
        });
        await safeLoadCombatState();
        renderScenarioRunPage();
      } catch (error) {
        setStatus(error.message);
      }
    });
    row.appendChild(reactionButton);

    let legendaryWrap = null;
    if (
      combatant.kind === "enemy" &&
      Number(combatant.is_legendary) === 1 &&
      Number.isInteger(Number(combatant.legendary_actions_count))
    ) {
      const legendaryMax = Number(combatant.legendary_actions_count);
      const currentRemainingRaw = Number(combatant.legendary_actions_remaining);
      const legendaryRemaining = Number.isInteger(currentRemainingRaw)
        ? Math.max(0, Math.min(legendaryMax, currentRemainingRaw))
        : legendaryMax;
      legendaryWrap = document.createElement("div");
      legendaryWrap.className = "legendary-track";
      for (let i = 1; i <= legendaryMax; i += 1) {
        const pip = document.createElement("button");
        pip.type = "button";
        pip.className = "legendary-btn reaction-die";
        pip.textContent = "L";
        const ready = i <= legendaryRemaining;
        pip.classList.toggle("used", !ready);
        pip.title = ready
          ? "Legendary action ready (click to spend)"
          : "Legendary action spent (click to refresh)";
        pip.setAttribute("aria-label", pip.title);
        pip.addEventListener("click", async () => {
          const nextRemaining = ready ? i - 1 : i;
          try {
            await api(`/api/combatants/${combatant.id}/legendary-actions`, {
              method: "POST",
              body: JSON.stringify({ remaining: nextRemaining })
            });
            await safeLoadCombatState();
            renderScenarioRunPage();
          } catch (error) {
            setStatus(error.message);
          }
        });
        legendaryWrap.appendChild(pip);
      }
    }
    row.appendChild(name);
    if (legendaryWrap) row.appendChild(legendaryWrap);

    const conditionSelect = createConditionSelect(combatant);
    right.appendChild(conditionSelect);

    if (combatant.kind === "enemy") {
      const hpPrefix = document.createElement("span");
      hpPrefix.className = "field-prefix";
      hpPrefix.textContent = "HP";
      right.appendChild(hpPrefix);

      const hp = document.createElement("input");
      hp.type = "text";
      hp.className = "run-order-hp";
      hp.min = "0";
      hp.max = "9999";
      hp.maxLength = 4;
      hp.value = combatant.hp == null ? "" : String(combatant.hp);
      hp.placeholder = "HP";
      setupRunQuickEditInput(hp);
      right.appendChild(hp);
      attachEnemyHpBlurUpdate(hp, combatant);

      const damage = document.createElement("button");
      damage.type = "button";
      damage.textContent = "Damage";
      damage.classList.add("enemy-damage-btn");
      if (combatant.enemy_role === "npc") damage.classList.add("npc-damage-btn");
      damage.addEventListener("click", async () => {
        const n = Number(delta.value);
        if (!Number.isFinite(n)) return;
        try {
          await api(`/api/combatants/${combatant.id}/hp-adjust`, {
            method: "POST",
            body: JSON.stringify({ delta: -Math.abs(Math.trunc(n)) })
          });
          await safeLoadCombatState();
          renderScenarioRunPage();
        } catch (error) {
          setStatus(error.message);
        }
      });
      right.appendChild(damage);

      const delta = document.createElement("input");
      delta.type = "text";
      delta.className = "run-order-delta";
      delta.min = "1";
      delta.max = "99";
      delta.maxLength = 3;
      delta.value = "0";
      delta.placeholder = "Delta";
      setupRunQuickEditInput(delta);
      right.appendChild(delta);

      const heal = document.createElement("button");
      heal.type = "button";
      heal.textContent = "Heal";
      heal.classList.add("enemy-heal-btn");
      if (combatant.enemy_role === "npc") heal.classList.add("npc-heal-btn");
      heal.addEventListener("click", async () => {
        const n = Number(delta.value);
        if (!Number.isFinite(n)) return;
        try {
          await api(`/api/combatants/${combatant.id}/hp-adjust`, {
            method: "POST",
            body: JSON.stringify({ delta: Math.abs(Math.trunc(n)) })
          });
          await safeLoadCombatState();
          renderScenarioRunPage();
        } catch (error) {
          setStatus(error.message);
        }
      });
      right.appendChild(heal);
    }

    row.appendChild(right);

    if (combatant.id === state.combat.activeCombatantId) {
      li.classList.add("turn-active");
    }

    li.appendChild(row);
    applyConditionStyle(li, combatant);
    els.runOrderList.appendChild(li);
  }
}

function renderCampaignPage() {
  const campaign = selectedCampaign();
  els.campaignPageTitle.textContent = campaign ? `Campaign: ${campaign.name}` : "Campaign";
  renderCharacters();
  renderScenarios();
  renderNav();
}

async function loadCampaigns() {
  state.campaigns = await api("/api/campaigns");
  const summaryEntries = await Promise.all(
    state.campaigns.map(async (campaign) => {
      const [players, scenarios] = await Promise.all([
        api(`/api/campaigns/${campaign.id}/characters`),
        api(`/api/campaigns/${campaign.id}/scenarios`)
      ]);
      return [campaign.id, { players, scenarioCount: scenarios.length }];
    })
  );
  state.campaignSummaries = Object.fromEntries(summaryEntries);
  renderWelcomeCampaigns();
  renderNav();
}

async function loadCampaignData() {
  if (!state.selectedCampaignId) {
    state.characters = [];
    state.scenarios = [];
    state.selectedScenarioId = null;
    await safeLoadCombatState();
    renderCampaignPage();
    return;
  }

  const [characters, scenarios] = await Promise.all([
    api(`/api/campaigns/${state.selectedCampaignId}/characters`),
    api(`/api/campaigns/${state.selectedCampaignId}/scenarios`)
  ]);
  state.characters = characters;
  state.scenarios = scenarios;

  if (!state.scenarios.some((s) => s.id === state.selectedScenarioId)) {
    state.selectedScenarioId = state.scenarios[0]?.id ?? null;
  }

  await safeLoadCombatState();
  renderCampaignPage();
}

async function loadCombatState() {
  if (!state.selectedScenarioId) {
    state.combat = {
      round: 1,
      turnIndex: 0,
      activeCombatantId: null,
      combatants: []
    };
    return;
  }
  state.combat = await api(`/api/scenarios/${state.selectedScenarioId}/combat`);
}

async function safeLoadCombatState() {
  try {
    await loadCombatState();
  } catch (_error) {
    state.combat = {
      round: 1,
      turnIndex: 0,
      activeCombatantId: null,
      combatants: []
    };
    setStatus("Could not load combat state for this scenario.");
  }
}

function bindEvents() {
  window.addEventListener("popstate", async () => {
    await navigateToPath(window.location.pathname, { replace: true });
  });

  els.imageModalCloseBtn.addEventListener("click", closeImageModal);
  els.imageModal.addEventListener("click", (event) => {
    if (event.target === els.imageModal) closeImageModal();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !els.imageModal.classList.contains("hidden")) {
      closeImageModal();
      return;
    }
    if (event.key === "Escape" && !els.campaignActionModal.classList.contains("hidden")) {
      closeCampaignActionModal();
      return;
    }
    if (!els.imageModal.classList.contains("hidden")) return;
    if (!els.campaignActionModal.classList.contains("hidden")) return;

    const key = event.key.toLowerCase();
    const target = event.target;
    if (
      target instanceof HTMLElement &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT" ||
        target.isContentEditable)
    ) {
      return;
    }

    if (key === "e") {
      if (state.page === "monsters") {
        event.preventDefault();
        toggleMonsterEditorMode();
        return;
      }
      if (!state.selectedScenarioId) return;
      if (state.page === "scenario-run") {
        event.preventDefault();
        els.goEditFromRunBtn.click();
      } else if (state.page === "scenario-edit") {
        event.preventDefault();
        els.goRunFromEditBtn.click();
      }
      return;
    }

    if (key === "s" && state.page === "monsters" && !state.monsterEditorReadOnly) {
      event.preventDefault();
      els.monsterForm.requestSubmit();
      return;
    }

    if (state.page !== "scenario-run") return;
    if (!["n", "b", "r", "l"].includes(key)) return;
    if (key === "n" && els.nextTurnBtn.disabled) return;
    if (key === "b" && els.revokeTurnBtn.disabled) return;
    event.preventDefault();
    if (key === "n") {
      els.nextTurnBtn.click();
      return;
    }
    if (key === "b") {
      els.revokeTurnBtn.click();
      return;
    }
    if (key === "r") {
      toggleActiveCombatantReaction().catch((error) => {
        setStatus(error.message);
      });
      return;
    }
    cycleActiveCombatantLegendaryAction().catch((error) => {
      setStatus(error.message);
    });
  });
  els.activeMonsterImage.addEventListener("click", () => {
    if (!els.activeMonsterImage.src) return;
    openImageModal(els.activeMonsterImage.src);
  });
  els.enemyMonsterPreview.addEventListener("click", () => {
    if (!els.enemyMonsterPreview.src) return;
    openImageModal(els.enemyMonsterPreview.src);
  });
  els.campaignActionCloseBtn.addEventListener("click", closeCampaignActionModal);
  els.campaignActionModal.addEventListener("click", (event) => {
    if (event.target === els.campaignActionModal) closeCampaignActionModal();
  });
  document.querySelectorAll(".campaign-action-cancel").forEach((button) => {
    button.addEventListener("click", closeCampaignActionModal);
  });

  els.addCharacterBtn.addEventListener("click", () => {
    openCampaignActionModal("character");
  });

  els.addScenarioBtn.addEventListener("click", () => {
    openCampaignActionModal("scenario");
  });

  els.addCampaignBtn.addEventListener("click", () => {
    openCampaignActionModal("campaign");
  });

  els.mainHomeBtn.addEventListener("click", () => {
    navigateToPage("welcome");
  });

  els.mainMonstersBtn.addEventListener("click", async () => {
    await navigateToPage("monsters");
  });

  els.mainAnalyticsBtn.addEventListener("click", () => {
    navigateToPage("analytics");
  });

  els.navHomeBtn.addEventListener("click", async () => {
    if (state.page === "monsters") {
      await navigateToPage("monsters");
      return;
    }
    if (state.page === "analytics") {
      await navigateToPage("analytics");
      return;
    }
    await navigateToPage("welcome");
  });

  els.navCampaignBtn.addEventListener("click", async () => {
    if (!state.selectedCampaignId) return;
    await navigateToPage("campaign", { campaignId: state.selectedCampaignId });
  });

  els.navScenarioBtn.addEventListener("click", async () => {
    if (!state.selectedScenarioId) return;
    if (state.lastScenarioPage === "scenario-run") {
      await navigateToPage("scenario-run", {
        campaignId: state.selectedCampaignId,
        scenarioId: state.selectedScenarioId
      });
    } else {
      await navigateToPage("scenario-edit", {
        campaignId: state.selectedCampaignId,
        scenarioId: state.selectedScenarioId
      });
    }
  });

  els.newMonsterBtn.addEventListener("click", () => {
    openCampaignActionModal("library-entry");
  });

  els.editMonsterBtn.addEventListener("click", () => {
    if (state.page !== "monsters") return;
    toggleMonsterEditorMode();
  });

  els.monsterImageFile.addEventListener("change", async () => {
    if (state.monsterEditorReadOnly) return;
    const file = els.monsterImageFile.files?.[0];
    if (!file) return;
    try {
      state.draftMonsterImageData = await readFileAsDataUrl(file);
      setMonsterImagePreview(state.draftMonsterImageData);
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.monsterSearchInput.addEventListener("input", () => {
    state.monsterSearchQuery = els.monsterSearchInput.value || "";
    renderMonsterList();
  });

  document.addEventListener("paste", async (event) => {
    if (state.page !== "monsters") return;
    if (state.monsterEditorReadOnly) return;
    const items = event.clipboardData?.items || [];
    const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));
    if (!imageItem) return;
    const file = imageItem.getAsFile();
    if (!file) return;
    event.preventDefault();
    try {
      state.draftMonsterImageData = await readFileAsDataUrl(file);
      setMonsterImagePreview(state.draftMonsterImageData);
      setStatus("Pasted statblock screenshot.");
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.enemyMonsterSelect.addEventListener("change", () => {
    const id = Number(els.enemyMonsterSelect.value);
    if (!Number.isFinite(id)) {
      setEnemyMonsterPreview("");
      return;
    }
    const monster = state.monsters.find((m) => m.id === id);
    if (!monster) return;
    setEnemyMonsterPreview(monster.monster_image_data || "");
    if (!els.enemyName.value.trim()) els.enemyName.value = monster.name;
    if (!els.enemyHp.value.trim()) {
      const hpMatch = /\d+/.exec(monster.hit_points || "");
      if (hpMatch) els.enemyHp.value = hpMatch[0];
    }
  });

  els.rollEnemyInitiativeBtn.addEventListener("click", () => {
    const roll = Math.floor(Math.random() * 20) + 1;
    els.enemyInitiative.value = String(roll);
  });

  els.monsterIsLegendary.addEventListener("change", updateMonsterLegendaryFieldsVisibility);
  updateMonsterLegendaryFieldsVisibility();
  els.libraryEntryLegendary.addEventListener("change", updateLibraryEntryLegendaryFieldsVisibility);
  updateLibraryEntryLegendaryFieldsVisibility();

  els.monsterForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const payload = monsterFormPayload();
      if (payload.isLegendary && !Number.isFinite(payload.legendaryActionsCount)) {
        setStatus("Choose a legendary actions count (2-4).");
        return;
      }
      if (state.selectedMonsterId) {
        const updated = await api(`/api/monsters/${state.selectedMonsterId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        setStatus(`Saved monster: ${updated.name}`);
      } else {
        const created = await api("/api/monsters", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        state.selectedMonsterId = created.id;
        setStatus(`Created monster: ${created.name}`);
      }
      await loadMonsters();
      setMonsterEditorReadOnly(true);
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.createLibraryEntryForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const isLegendary = els.libraryEntryLegendary.value === "true";
      const selectedLegendary = document.querySelector(
        'input[name="libraryLegendaryActionsCount"]:checked'
      );
      const legendaryActionsCount = isLegendary
        ? Number(selectedLegendary?.value || "")
        : null;
      const created = await api("/api/monsters", {
        method: "POST",
        body: JSON.stringify({
          name: els.libraryEntryName.value.trim(),
          isLegendary,
          legendaryActionsCount,
          monsterImageData: ""
        })
      });
      closeCampaignActionModal();
      await loadMonsters();
      state.selectedMonsterId = created.id;
      const current = selectedMonster();
      if (current) fillMonsterForm(current);
      renderMonsterList();
      setMonsterEditorReadOnly(true);
      setStatus(`Created entry: ${created.name}`);
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.deleteMonsterBtn.addEventListener("click", async () => {
    const monster = selectedMonster();
    if (!monster) return;
    if (!window.confirm(`Delete monster "${monster.name}"?`)) return;
    try {
      await api(`/api/monsters/${monster.id}`, { method: "DELETE" });
      state.selectedMonsterId = null;
      await loadMonsters();
      setStatus(`Deleted monster: ${monster.name}`);
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.createCampaignModalForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const campaign = await api("/api/campaigns", {
        method: "POST",
        body: JSON.stringify({ name: els.newCampaignName.value })
      });
      els.newCampaignName.value = "";
      closeCampaignActionModal();
      await navigateToPage("campaign", { campaignId: campaign.id });
      setStatus(`Created campaign: ${campaign.name}`);
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.deleteCampaignBtn.addEventListener("click", async () => {
    const campaign = selectedCampaign();
    if (!campaign) return;
    const typed = window.prompt(
      `Type the campaign name exactly to confirm deletion:\n${campaign.name}`
    );
    if (typed === null) return;
    if (typed !== campaign.name) {
      setStatus("Campaign deletion cancelled: name did not match.");
      return;
    }
    try {
      await api(`/api/campaigns/${campaign.id}`, { method: "DELETE" });
      state.selectedCampaignId = null;
      state.selectedScenarioId = null;
      state.characters = [];
      state.scenarios = [];
      await safeLoadCombatState();
      await navigateToPage("welcome");
      setStatus(`Deleted campaign: ${campaign.name}`);
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.createCharacterForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.selectedCampaignId) return;
    try {
      await api(`/api/campaigns/${state.selectedCampaignId}/characters`, {
        method: "POST",
        body: JSON.stringify({
          name: els.charName.value,
          className: els.charClass.value
        })
      });
      els.charName.value = "";
      els.charClass.value = "";
      closeCampaignActionModal();
      await loadCampaignData();
      setStatus("Character added.");
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.createScenarioForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.selectedCampaignId) return;
    try {
      await api(`/api/campaigns/${state.selectedCampaignId}/scenarios`, {
        method: "POST",
        body: JSON.stringify({
          name: els.scenarioName.value,
          notes: els.scenarioNotes.value
        })
      });
      els.scenarioName.value = "";
      els.scenarioNotes.value = "";
      closeCampaignActionModal();
      await loadCampaignData();
      setStatus("Scenario added.");
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.editScenarioForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.selectedScenarioId) return;
    try {
      const updated = await api(`/api/scenarios/${state.selectedScenarioId}`, {
        method: "PUT",
        body: JSON.stringify({
          name: els.editScenarioName.value,
          notes: els.editScenarioNotes.value
        })
      });
      state.scenarios = state.scenarios.map((s) => (s.id === updated.id ? updated : s));
      renderScenarioEditPage();
      setStatus("Scenario updated.");
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.goRunFromEditBtn.addEventListener("click", async () => {
    if (!state.selectedScenarioId) return;
    await navigateToPage("scenario-run", {
      campaignId: state.selectedCampaignId,
      scenarioId: state.selectedScenarioId
    });
  });

  els.addEnemyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.selectedScenarioId) return;
    try {
      await api(`/api/scenarios/${state.selectedScenarioId}/combatants`, {
        method: "POST",
        body: JSON.stringify({
          kind: "enemy",
          enemyRole: els.enemyRole.value === "npc" ? "npc" : "enemy",
          monsterId: els.enemyMonsterSelect.value
            ? Number(els.enemyMonsterSelect.value)
            : null,
          name: els.enemyName.value,
          initiative: Number(els.enemyInitiative.value),
          hp: els.enemyHp.value === "" ? null : Number(els.enemyHp.value)
        })
      });
      els.enemyName.value = "";
      els.enemyMonsterSelect.value = "";
      els.enemyRole.value = "enemy";
      els.enemyInitiative.value = "";
      els.enemyHp.value = "";
      setEnemyMonsterPreview("");
      await safeLoadCombatState();
      renderScenarioEditPage();
      setStatus("Combatant added.");
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.nextTurnBtn.addEventListener("click", async () => {
    if (!state.selectedScenarioId) return;
    try {
      state.combat = await api(`/api/scenarios/${state.selectedScenarioId}/combat/next-turn`, {
        method: "POST"
      });
      focusPreviewOnActiveNonPc();
      state.lastScenarioPage = "scenario-run";
      renderScenarioRunPage();
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.revokeTurnBtn.addEventListener("click", async () => {
    if (!state.selectedScenarioId) return;
    try {
      state.combat = await api(`/api/scenarios/${state.selectedScenarioId}/combat/prev-turn`, {
        method: "POST"
      });
      focusPreviewOnActiveNonPc();
      state.lastScenarioPage = "scenario-run";
      renderScenarioRunPage();
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.goEditFromRunBtn.addEventListener("click", async () => {
    if (!state.selectedScenarioId) return;
    await navigateToPage("scenario-edit", {
      campaignId: state.selectedCampaignId,
      scenarioId: state.selectedScenarioId
    });
  });

  els.resetCombatBtn.addEventListener("click", async () => {
    if (!state.selectedScenarioId) return;
    if (!window.confirm("Reset combat to Round 1 and first turn?")) return;
    try {
      state.combat = await api(`/api/scenarios/${state.selectedScenarioId}/combat/reset`, {
        method: "POST"
      });
      focusPreviewOnActiveNonPc();
      state.lastScenarioPage = "scenario-run";
      renderScenarioRunPage();
    } catch (error) {
      setStatus(error.message);
    }
  });
}

async function init() {
  bindEvents();
  try {
    await loadMonsters();
    setMonsterEditorReadOnly(true);
  } catch (error) {
    setStatus(error.message);
  }
  await navigateToPath(window.location.pathname, { replace: true });
}

init();
