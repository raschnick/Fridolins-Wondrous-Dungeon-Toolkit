const state = {
  authUser: null,
  page: "welcome",
  lastScenarioPage: "scenario-edit",
  campaignActionMode: null,
  monsters: [],
  monsterSearchQuery: "",
  scenarioSearchQuery: "",
  monsterEditorReadOnly: true,
  draftLibraryEntryImageData: "",
  selectedMonsterId: null,
  draftMonsterImageData: "",
  runPreviewEnemyId: null,
  campaigns: [],
  campaignSummaries: {},
  adminUsers: [],
  adminMemberCampaignId: null,
  adminCampaignMembers: [],
  adminUserSearchQuery: "",
  adminMemberSearchQuery: "",
  campaignLiveScenarioId: null,
  playerLiveData: null,
  playerLivePollTimer: null,
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
  topNav: document.getElementById("topNav"),
  pageLogin: document.getElementById("pageLogin"),
  pageWelcome: document.getElementById("pageWelcome"),
  pagePlayerHome: document.getElementById("pagePlayerHome"),
  pageMonsters: document.getElementById("pageMonsters"),
  pageAnalytics: document.getElementById("pageAnalytics"),
  pageAdmin: document.getElementById("pageAdmin"),
  pageCampaign: document.getElementById("pageCampaign"),
  pageCampaignCompleted: document.getElementById("pageCampaignCompleted"),
  pageScenarioEdit: document.getElementById("pageScenarioEdit"),
  pageScenarioCompletedEdit: document.getElementById("pageScenarioCompletedEdit"),
  pageScenarioRun: document.getElementById("pageScenarioRun"),
  mainHomeBtn: document.getElementById("mainHomeBtn"),
  mainMonstersBtn: document.getElementById("mainMonstersBtn"),
  mainAnalyticsBtn: document.getElementById("mainAnalyticsBtn"),
  userMenu: document.getElementById("userMenu"),
  userMenuName: document.getElementById("userMenuName"),
  userMenuAdminBtn: document.getElementById("userMenuAdminBtn"),
  userMenuLogoutBtn: document.getElementById("userMenuLogoutBtn"),
  playerWaitingWrap: document.getElementById("playerWaitingWrap"),
  playerWaitingTitle: document.getElementById("playerWaitingTitle"),
  playerWaitingImage: document.getElementById("playerWaitingImage"),
  playerRefreshBtn: document.getElementById("playerRefreshBtn"),
  playerLiveWrap: document.getElementById("playerLiveWrap"),
  playerLiveEncounterName: document.getElementById("playerLiveEncounterName"),
  playerLiveRound: document.getElementById("playerLiveRound"),
  playerLiveCombatantList: document.getElementById("playerLiveCombatantList"),
  loginForm: document.getElementById("loginForm"),
  loginUsername: document.getElementById("loginUsername"),
  loginPassword: document.getElementById("loginPassword"),
  loginStatus: document.getElementById("loginStatus"),
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
  libraryEntryImageFile: document.getElementById("libraryEntryImageFile"),
  libraryEntryImagePreview: document.getElementById("libraryEntryImagePreview"),
  createCampaignModalForm: document.getElementById("createCampaignModalForm"),
  newCampaignName: document.getElementById("newCampaignName"),
  campaignPageTitle: document.getElementById("campaignPageTitle"),
  completedScenarioPageTitle: document.getElementById("completedScenarioPageTitle"),
  adminCreateUserForm: document.getElementById("adminCreateUserForm"),
  adminNewUsername: document.getElementById("adminNewUsername"),
  adminNewPassword: document.getElementById("adminNewPassword"),
  adminNewRole: document.getElementById("adminNewRole"),
  adminStatus: document.getElementById("adminStatus"),
  adminUserSearch: document.getElementById("adminUserSearch"),
  adminUserList: document.getElementById("adminUserList"),
  adminOpenCreateUserModalBtn: document.getElementById("adminOpenCreateUserModalBtn"),
  adminOpenMembershipModalBtn: document.getElementById("adminOpenMembershipModalBtn"),
  adminMembershipForm: document.getElementById("adminMembershipForm"),
  adminMembershipCampaignHint: document.getElementById("adminMembershipCampaignHint"),
  adminCampaignList: document.getElementById("adminCampaignList"),
  adminMemberUserSelect: document.getElementById("adminMemberUserSelect"),
  adminMemberSearch: document.getElementById("adminMemberSearch"),
  adminMemberList: document.getElementById("adminMemberList"),
  adminActionModal: document.getElementById("adminActionModal"),
  adminActionTitle: document.getElementById("adminActionTitle"),
  adminActionCloseBtn: document.getElementById("adminActionCloseBtn"),
  viewCompletedScenariosBtn: document.getElementById("viewCompletedScenariosBtn"),
  backToCampaignBtn: document.getElementById("backToCampaignBtn"),
  deleteCampaignBtn: document.getElementById("deleteCampaignBtn"),
  characterList: document.getElementById("characterList"),
  createCharacterForm: document.getElementById("createCharacterForm"),
  addCharacterBtn: document.getElementById("addCharacterBtn"),
  charName: document.getElementById("charName"),
  charClass: document.getElementById("charClass"),
  scenarioList: document.getElementById("scenarioList"),
  completedScenarioList: document.getElementById("completedScenarioList"),
  scenarioSearchInput: document.getElementById("scenarioSearchInput"),
  createScenarioForm: document.getElementById("createScenarioForm"),
  addScenarioBtn: document.getElementById("addScenarioBtn"),
  scenarioName: document.getElementById("scenarioName"),
  scenarioNotes: document.getElementById("scenarioNotes"),
  completeScenarioFromEditBtn: document.getElementById("completeScenarioFromEditBtn"),
  goRunFromEditBtn: document.getElementById("goRunFromEditBtn"),
  reopenScenarioBtn: document.getElementById("reopenScenarioBtn"),
  completedEditScenarioName: document.getElementById("completedEditScenarioName"),
  completedEditScenarioNotes: document.getElementById("completedEditScenarioNotes"),
  completedCombatantList: document.getElementById("completedCombatantList"),
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
  shareScenarioStatus: document.getElementById("shareScenarioStatus"),
  shareScenarioBtn: document.getElementById("shareScenarioBtn"),
  completeScenarioBtn: document.getElementById("completeScenarioBtn"),
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

function openAdminActionModal(mode) {
  setAdminStatus("");
  if (mode === "create-user") {
    els.adminActionTitle.textContent = "Add User";
    els.adminCreateUserForm.classList.remove("hidden");
    els.adminMembershipForm.classList.add("hidden");
    els.adminNewUsername.focus();
  } else {
    const campaign = state.campaigns.find((c) => c.id === state.adminMemberCampaignId);
    if (!campaign) {
      setStatus("Select a campaign first.");
      return;
    }
    els.adminActionTitle.textContent = "Add User to Campaign";
    els.adminCreateUserForm.classList.add("hidden");
    els.adminMembershipForm.classList.remove("hidden");
    els.adminMembershipCampaignHint.textContent = `Campaign: ${campaign.name}`;
    els.adminMemberUserSelect.focus();
  }
  els.adminActionModal.classList.remove("hidden");
}

function closeAdminActionModal() {
  els.adminActionModal.classList.add("hidden");
}

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
    const error = new Error(err.error || "Request failed.");
    error.status = res.status;
    if (res.status === 401) error.code = "AUTH_REQUIRED";
    if (res.status === 401 && path !== "/api/auth/login") {
      state.authUser = null;
      setLoginStatus("Please sign in.");
      showPage("login");
    }
    throw error;
  }
  if (res.status === 204) return null;
  return res.json();
}

function setStatus(message = "") {
  els.status.textContent = message;
}

function setLoginStatus(message = "") {
  els.loginStatus.textContent = message;
}

function setAdminStatus(message = "") {
  if (!els.adminStatus) return;
  els.adminStatus.textContent = message;
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

function setLibraryEntryImagePreview(dataUrl) {
  if (dataUrl) {
    els.libraryEntryImagePreview.src = dataUrl;
    els.libraryEntryImagePreview.classList.remove("hidden");
  } else {
    els.libraryEntryImagePreview.src = "";
    els.libraryEntryImagePreview.classList.add("hidden");
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
  state.campaignActionMode = mode;
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
    state.draftLibraryEntryImageData = "";
    setLibraryEntryImagePreview("");
    els.libraryEntryImageFile.value = "";
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
  state.campaignActionMode = null;
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
  const isHiddenForPlayers = Number(combatant.player_visible) === 0;
  text.textContent = isHiddenForPlayers ? `(${combatant.name})` : combatant.name;
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
  if (path === "/login") return { page: "login" };
  if (path === "/player") return { page: "player-home" };
  if (path === "/") return { page: "welcome" };
  if (path === "/library") return { page: "monsters" };
  if (path === "/monsters") return { page: "monsters" };
  if (path === "/admin") return { page: "admin" };
  if (path === "/analytics") return { page: "analytics" };

  let match = path.match(/^\/campaigns\/(\d+)$/);
  if (match) {
    return { page: "campaign", campaignId: Number(match[1]) };
  }

  match = path.match(/^\/campaigns\/(\d+)\/completed$/);
  if (match) {
    return { page: "campaign-completed", campaignId: Number(match[1]) };
  }

  match = path.match(/^\/campaigns\/(\d+)\/scenarios\/(\d+)\/(edit|run)$/);
  if (match) {
    return {
      page: match[3] === "run" ? "scenario-run" : "scenario-edit",
      campaignId: Number(match[1]),
      scenarioId: Number(match[2])
    };
  }

  match = path.match(/^\/campaigns\/(\d+)\/scenarios\/(\d+)\/completed\/edit$/);
  if (match) {
    return {
      page: "scenario-completed-edit",
      campaignId: Number(match[1]),
      scenarioId: Number(match[2])
    };
  }
  return null;
}

function routePathFor(page, campaignId = null, scenarioId = null) {
  if (page === "login") return "/login";
  if (page === "player-home") return "/player";
  if (page === "welcome") return "/";
  if (page === "monsters") return "/library";
  if (page === "admin") return "/admin";
  if (page === "analytics") return "/analytics";
  if (page === "campaign" && Number.isInteger(campaignId)) {
    return `/campaigns/${campaignId}`;
  }
  if (page === "campaign-completed" && Number.isInteger(campaignId)) {
    return `/campaigns/${campaignId}/completed`;
  }
  if (
    (page === "scenario-edit" || page === "scenario-run" || page === "scenario-completed-edit") &&
    Number.isInteger(campaignId) &&
    Number.isInteger(scenarioId)
  ) {
    if (page === "scenario-completed-edit") {
      return `/campaigns/${campaignId}/scenarios/${scenarioId}/completed/edit`;
    }
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

  if (route.page === "login") {
    showPage("login");
    await syncHistory("/login", { replace });
    return;
  }

  if (route.page === "monsters") {
    if (state.authUser?.role !== "admin") {
      await safeNavigate("/", "Library access denied.");
      return;
    }
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

  if (route.page === "player-home") {
    try {
      await loadPlayerLive();
    } catch (error) {
      setStatus(error.message);
    }
    if (!isCurrent()) return;
    startPlayerLivePolling();
    showPage("player-home");
    await syncHistory("/player", { replace });
    return;
  }

  if (route.page === "analytics") {
    showPage("analytics");
    await syncHistory("/analytics", { replace });
    return;
  }

  if (route.page === "admin") {
    if (state.authUser?.role !== "admin") {
      await safeNavigate("/", "Admin access denied.");
      return;
    }
    try {
      await loadAdminData();
      renderAdminPage();
    } catch (error) {
      setStatus(error.message);
    }
    if (!isCurrent()) return;
    showPage("admin");
    await syncHistory("/admin", { replace });
    return;
  }

  if (route.page === "welcome") {
    if (state.authUser?.role !== "admin") {
      try {
        await loadPlayerLive();
      } catch (error) {
        setStatus(error.message);
      }
      if (!isCurrent()) return;
      startPlayerLivePolling();
      showPage("player-home");
      await syncHistory("/player", { replace });
      return;
    }
    stopPlayerLivePolling();
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

  if (route.page === "campaign-completed") {
    renderCompletedScenariosPage();
    showPage("campaign-completed");
    await syncHistory(routePathFor("campaign-completed", route.campaignId), { replace });
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
  const scenario = selectedScenario();
  const isCompletedScenario = Number(scenario?.is_completed) === 1;
  if (route.page === "scenario-edit" && isCompletedScenario) {
    await safeNavigate(
      routePathFor("scenario-completed-edit", route.campaignId, route.scenarioId),
      "This encounter is completed. Opened read-only view."
    );
    return;
  }
  if (route.page === "scenario-completed-edit" && !isCompletedScenario) {
    await safeNavigate(
      routePathFor("scenario-edit", route.campaignId, route.scenarioId),
      "Encounter is active. Opened editable view."
    );
    return;
  }
  if (route.page === "scenario-run") {
    focusPreviewOnActiveNonPc();
    renderScenarioRunPage();
    showPage("scenario-run");
  } else if (route.page === "scenario-completed-edit") {
    renderScenarioCompletedEditPage();
    showPage("scenario-completed-edit");
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
  if (page !== "player-home") {
    stopPlayerLivePolling();
  }
  document.body.classList.toggle("page-run", page === "scenario-run");
  els.pageLogin.classList.toggle("hidden", page !== "login");
  const hideTopNav = page === "login" || (state.authUser?.role !== "admin");
  els.topNav.classList.toggle("hidden", hideTopNav);
  els.pageWelcome.classList.toggle("hidden", page !== "welcome");
  els.pagePlayerHome.classList.toggle("hidden", page !== "player-home");
  els.pageMonsters.classList.toggle("hidden", page !== "monsters");
  els.pageAnalytics.classList.toggle("hidden", page !== "analytics");
  els.pageAdmin.classList.toggle("hidden", page !== "admin");
  els.pageCampaign.classList.toggle("hidden", page !== "campaign");
  els.pageCampaignCompleted.classList.toggle("hidden", page !== "campaign-completed");
  els.pageScenarioEdit.classList.toggle("hidden", page !== "scenario-edit");
  els.pageScenarioCompletedEdit.classList.toggle("hidden", page !== "scenario-completed-edit");
  els.pageScenarioRun.classList.toggle("hidden", page !== "scenario-run");
  renderMainSections();
  renderNav();
}

function renderMainSections() {
  const isAuthed = Boolean(state.authUser);
  els.mainHomeBtn.classList.toggle("hidden", !isAuthed);
  els.userMenu.classList.toggle("hidden", !isAuthed);
  const showLibrary = isAuthed && state.authUser?.role === "admin";
  const showAnalytics = isAuthed && state.authUser?.role === "admin";
  els.mainMonstersBtn.classList.toggle("hidden", !showLibrary);
  els.mainAnalyticsBtn.classList.toggle("hidden", !showAnalytics);
  if (!isAuthed) return;

  els.userMenuName.textContent = state.authUser?.username || "";
  els.userMenuAdminBtn.classList.toggle("hidden", state.authUser?.role !== "admin");

  const inHome =
    state.page === "welcome" ||
    state.page === "player-home" ||
    state.page === "campaign" ||
    state.page === "campaign-completed" ||
    state.page === "scenario-edit" ||
    state.page === "scenario-completed-edit" ||
    state.page === "scenario-run";
  els.mainHomeBtn.classList.toggle("active", inHome);
  els.mainMonstersBtn.classList.toggle("active", state.page === "monsters");
  els.mainAnalyticsBtn.classList.toggle("active", state.page === "analytics");
}

function renderNav() {
  if (!state.authUser || state.page === "login" || state.authUser.role !== "admin") return;
  const campaign = selectedCampaign();
  const scenario = selectedScenario();

  const inHomePath =
    state.page === "welcome" ||
    state.page === "campaign" ||
    state.page === "campaign-completed" ||
    state.page === "scenario-edit" ||
    state.page === "scenario-completed-edit" ||
    state.page === "scenario-run";

  const inMonsters = state.page === "monsters";
  const inAnalytics = state.page === "analytics";
  const inAdmin = state.page === "admin";

  if (inMonsters) {
    els.navHomeBtn.textContent = "Library";
    els.navHomeBtn.disabled = true;
  } else if (inAdmin) {
    els.navHomeBtn.textContent = "Admin";
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
    (
      state.page === "campaign" ||
      state.page === "campaign-completed" ||
      state.page === "scenario-edit" ||
      state.page === "scenario-completed-edit" ||
      state.page === "scenario-run"
    );
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
  const showCompletedScenarioCrumb =
    inHomePath &&
    Boolean(scenario) &&
    state.page === "scenario-completed-edit";
  els.navScenarioBtn.classList.toggle("hidden", !(showScenarioCrumb || showCompletedScenarioCrumb));
  els.navSepScenario.classList.toggle("hidden", !(showScenarioCrumb || showCompletedScenarioCrumb));
  if ((showScenarioCrumb || showCompletedScenarioCrumb) && scenario) {
    els.navScenarioBtn.textContent = scenario.name;
    els.navScenarioBtn.disabled =
      state.page === "scenario-edit" ||
      state.page === "scenario-run" ||
      state.page === "scenario-completed-edit";
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
  if (els.scenarioSearchInput.value !== state.scenarioSearchQuery) {
    els.scenarioSearchInput.value = state.scenarioSearchQuery;
  }
  const query = state.scenarioSearchQuery.trim().toLowerCase();
  const filtered = query
    ? state.scenarios.filter((scenario) => scenario.name.toLowerCase().includes(query))
    : state.scenarios;
  const activeScenarios = filtered.filter((scenario) => Number(scenario.is_completed) !== 1);

  els.scenarioList.innerHTML = "";
  if (activeScenarios.length === 0) {
    els.scenarioList.innerHTML = query ? "<li>No matches found.</li>" : "<li>No scenarios yet.</li>";
    return;
  }

  for (const scenario of activeScenarios) {
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "list-row";

    const label = document.createElement("span");
    label.textContent = scenario.name;
    row.appendChild(label);

    const actions = document.createElement("div");
    actions.className = "row-actions";

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

function renderCompletedScenariosPage() {
  const campaign = selectedCampaign();
  els.completedScenarioPageTitle.textContent = campaign
    ? `Completed Scenarios: ${campaign.name}`
    : "Completed Scenarios";

  const completedScenarios = state.scenarios.filter((scenario) => Number(scenario.is_completed) === 1);
  els.completedScenarioList.innerHTML = "";
  if (completedScenarios.length === 0) {
    els.completedScenarioList.innerHTML = "<li>No completed scenarios yet.</li>";
    return;
  }

  for (const scenario of completedScenarios) {
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "list-row";

    const label = document.createElement("span");
    label.textContent = scenario.name;
    row.appendChild(label);

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const reopenButton = document.createElement("button");
    reopenButton.type = "button";
    reopenButton.textContent = "Reopen";
    reopenButton.addEventListener("click", async () => {
      try {
        await api(`/api/scenarios/${scenario.id}/completed`, {
          method: "POST",
          body: JSON.stringify({ completed: false })
        });
        await loadCampaignData();
        renderCompletedScenariosPage();
        setStatus(`Reopened scenario: ${scenario.name}`);
      } catch (error) {
        setStatus(error.message);
      }
    });
    actions.appendChild(reopenButton);

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

    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "delete-btn";
    removeButton.textContent = "X";
    removeButton.addEventListener("click", async () => {
      if (!window.confirm(`Delete scenario "${scenario.name}"?`)) return;
      try {
        await api(`/api/scenarios/${scenario.id}`, { method: "DELETE" });
        await loadCampaignData();
        renderCompletedScenariosPage();
        setStatus(`Deleted scenario: ${scenario.name}`);
      } catch (error) {
        setStatus(error.message);
      }
    });
    actions.appendChild(removeButton);

    row.appendChild(actions);
    li.appendChild(row);
    els.completedScenarioList.appendChild(li);
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

function createPlayerVisibilityToggle(combatant, rerender) {
  const visibleToPlayers = Number(combatant.player_visible) !== 0;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "visibility-toggle";
  button.classList.toggle("is-hidden", !visibleToPlayers);
  button.textContent = visibleToPlayers ? "Visible" : "Hidden";
  button.title = visibleToPlayers ? "Visible in player view" : "Hidden from player view";
  button.addEventListener("click", async () => {
    try {
      await api(`/api/combatants/${combatant.id}/player-visible`, {
        method: "POST",
        body: JSON.stringify({ visible: !visibleToPlayers })
      });
      await safeLoadCombatState();
      rerender();
    } catch (error) {
      setStatus(error.message);
    }
  });
  return button;
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
    if (Number(combatant.player_visible) === 0) {
      li.classList.add("combatant-hidden-for-players");
    }
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
    row.appendChild(createPlayerVisibilityToggle(combatant, renderScenarioEditPage));

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

function applyConditionStyleReadonly(li, combatant) {
  const keys = Array.isArray(combatant.condition_keys) ? combatant.condition_keys : [];
  if (keys.length === 0) return;

  for (const key of keys) {
    const condition = CONDITION_BY_KEY[key];
    if (!condition) continue;
    const chip = document.createElement("span");
    chip.className = "condition-chip condition-chip-readonly";
    chip.textContent = condition.label;
    chip.setAttribute("data-tip", condition.tip);
    li.appendChild(chip);
  }
}

function renderScenarioCompletedEditPage() {
  const scenario = selectedScenario();
  if (!scenario) return;

  els.completedEditScenarioName.value = scenario.name;
  els.completedEditScenarioNotes.value = scenario.notes || "";
  els.completedCombatantList.innerHTML = "";

  if (state.combat.combatants.length === 0) {
    els.completedCombatantList.innerHTML = "<li>No combatants yet.</li>";
    return;
  }

  for (const combatant of state.combat.combatants) {
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "combatant-row";

    const name = createCombatantNameElement(combatant);
    row.appendChild(name);

    const initPrefix = document.createElement("span");
    initPrefix.className = "field-prefix";
    initPrefix.textContent = "Init";
    row.appendChild(initPrefix);
    const initValue = document.createElement("span");
    initValue.textContent = String(combatant.initiative);
    row.appendChild(initValue);

    if (combatant.kind === "enemy") {
      const hpPrefix = document.createElement("span");
      hpPrefix.className = "field-prefix";
      hpPrefix.textContent = "HP";
      row.appendChild(hpPrefix);
      const hpValue = document.createElement("span");
      hpValue.textContent = combatant.hp == null ? "-" : String(combatant.hp);
      row.appendChild(hpValue);
    }

    li.appendChild(row);
    applyConditionStyleReadonly(li, combatant);
    els.completedCombatantList.appendChild(li);
  }
}

function renderScenarioRunPage() {
  const scenario = selectedScenario();
  if (!scenario) return;

  els.runScenarioName.textContent = scenario.name;
  els.runScenarioNotes.textContent = scenario.notes || "No notes yet.";
  if (state.authUser?.role === "admin") {
    const isSharedCurrent = state.campaignLiveScenarioId === scenario.id;
    els.shareScenarioBtn.classList.remove("hidden");
    els.shareScenarioStatus.classList.remove("hidden");
    els.shareScenarioStatus.textContent = isSharedCurrent ? "Sharing" : "Not shared";
    els.shareScenarioStatus.classList.toggle("share-status-live", isSharedCurrent);
    els.shareScenarioStatus.classList.toggle("share-status-idle", !isSharedCurrent);
    els.shareScenarioBtn.textContent = isSharedCurrent ? "Stop Sharing" : "Share";
  } else {
    els.shareScenarioStatus.classList.add("hidden");
    els.shareScenarioBtn.classList.add("hidden");
  }
  if (Number(scenario.is_completed) === 1) {
    els.completeScenarioBtn.textContent = "Completed";
    els.completeScenarioBtn.disabled = true;
  } else {
    els.completeScenarioBtn.textContent = "Complete";
    els.completeScenarioBtn.disabled = false;
  }
  els.runRound.textContent = String(state.combat.round);
  els.runOrderList.innerHTML = "";
  els.activeMonsterImage.classList.add("hidden");
  els.activeMonsterImage.src = "";
  els.activeMonsterImageHint.classList.remove("hidden");

  if (state.combat.combatants.length === 0) {
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
    if (Number(combatant.player_visible) === 0) {
      li.classList.add("combatant-hidden-for-players");
    }
    if (combatant.kind === "character") {
      li.classList.add("run-tone-pc");
    } else if (combatant.enemy_role === "npc") {
      li.classList.add("run-tone-npc");
    } else {
      li.classList.add("run-tone-enemy");
    }
    const keys = Array.isArray(combatant.condition_keys) ? combatant.condition_keys : [];
    if (keys.includes("down")) {
      li.classList.add("run-down");
    }
    if (combatant.kind === "enemy") {
      const hpValue = Number(combatant.hp);
      if (Number.isFinite(hpValue) && hpValue <= 0) {
        li.classList.add("run-defeated");
      }
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

    right.appendChild(createPlayerVisibilityToggle(combatant, renderScenarioRunPage));
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

async function completeSelectedScenario() {
  const scenario = selectedScenario();
  if (!scenario) return;
  await api(`/api/scenarios/${scenario.id}/completed`, {
    method: "POST",
    body: JSON.stringify({ completed: true })
  });
  await loadCampaignData();
  await navigateToPage("campaign-completed", {
    campaignId: state.selectedCampaignId
  });
  setStatus(`Completed scenario: ${scenario.name}`);
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
      return [
        campaign.id,
        {
          players,
          scenarioCount: scenarios.filter((scenario) => Number(scenario.is_completed) !== 1).length
        }
      ];
    })
  );
  state.campaignSummaries = Object.fromEntries(summaryEntries);
  renderWelcomeCampaigns();
  renderNav();
}

async function loadCampaignLiveState(campaignId) {
  if (!Number.isInteger(campaignId)) {
    state.campaignLiveScenarioId = null;
    return;
  }
  try {
    const live = await api(`/api/campaigns/${campaignId}/live`);
    state.campaignLiveScenarioId = Number.isInteger(live?.shared_scenario_id)
      ? live.shared_scenario_id
      : null;
  } catch (_error) {
    state.campaignLiveScenarioId = null;
  }
}

function renderPlayerHome() {
  const shared = state.playerLiveData?.shared || null;
  const hasShared = Boolean(shared);
  els.playerWaitingWrap.classList.toggle("hidden", hasShared);
  els.playerLiveWrap.classList.toggle("hidden", !hasShared);
  if (!hasShared) return;

  els.playerLiveEncounterName.textContent = shared.name || "Shared Encounter";
  els.playerLiveRound.textContent = `Round ${shared.round ?? 1}`;
  els.playerLiveCombatantList.innerHTML = "";

  const combatants = Array.isArray(shared.combatants) ? shared.combatants : [];
  if (combatants.length === 0) {
    els.playerLiveCombatantList.innerHTML = "<li>No combatants yet.</li>";
    return;
  }

  for (const combatant of combatants) {
    const li = document.createElement("li");
    if (combatant.kind === "character") {
      li.classList.add("run-tone-pc");
    } else if (combatant.enemy_role === "npc") {
      li.classList.add("run-tone-npc");
    } else {
      li.classList.add("run-tone-enemy");
    }
    const keys = Array.isArray(combatant.condition_keys) ? combatant.condition_keys : [];
    if (keys.includes("down")) {
      li.classList.add("run-down");
    }
    if (combatant.id === shared.activeCombatantId) {
      li.classList.add("turn-active");
    }

    const row = document.createElement("div");
    row.className = "combatant-row";

    const initiative = document.createElement("span");
    initiative.className = "run-order-init run-order-init-readonly";
    initiative.textContent = String(combatant.initiative);
    row.appendChild(initiative);

    const reactionReady = Number(combatant.reaction_available) !== 0;
    const reactionBadge = document.createElement("span");
    reactionBadge.className = "reaction-btn reaction-die readonly-control";
    reactionBadge.textContent = "R";
    reactionBadge.classList.toggle("used", !reactionReady);
    row.appendChild(reactionBadge);

    const name = createCombatantNameElement(combatant);
    row.appendChild(name);

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
      const legendaryWrap = document.createElement("div");
      legendaryWrap.className = "legendary-track";
      for (let i = 1; i <= legendaryMax; i += 1) {
        const pip = document.createElement("span");
        pip.className = "legendary-btn reaction-die readonly-control";
        pip.textContent = "L";
        const ready = i <= legendaryRemaining;
        pip.classList.toggle("used", !ready);
        legendaryWrap.appendChild(pip);
      }
      row.appendChild(legendaryWrap);
    }

    li.appendChild(row);

    applyConditionStyleReadonly(li, combatant);

    els.playerLiveCombatantList.appendChild(li);
  }
}

async function loadPlayerLive() {
  if (!state.authUser || state.authUser.role === "admin") return;
  state.playerLiveData = await api("/api/player/live");
  renderPlayerHome();
}

function stopPlayerLivePolling() {
  if (state.playerLivePollTimer) {
    clearInterval(state.playerLivePollTimer);
    state.playerLivePollTimer = null;
  }
}

function startPlayerLivePolling() {
  stopPlayerLivePolling();
  if (!state.authUser || state.authUser.role === "admin") return;
  state.playerLivePollTimer = setInterval(() => {
    loadPlayerLive().catch(() => {
      // keep prior state on transient failures
    });
  }, 2000);
}

async function loadAdminData() {
  if (state.authUser?.role !== "admin") return;
  const [users, campaigns] = await Promise.all([
    api("/api/admin/users"),
    api("/api/campaigns")
  ]);
  state.adminUsers = users;
  state.campaigns = campaigns;

  if (
    !Number.isInteger(state.adminMemberCampaignId) ||
    !state.campaigns.some((campaign) => campaign.id === state.adminMemberCampaignId)
  ) {
    state.adminMemberCampaignId = state.campaigns[0]?.id ?? null;
  }

  if (Number.isInteger(state.adminMemberCampaignId)) {
    state.adminCampaignMembers = await api(
      `/api/campaigns/${state.adminMemberCampaignId}/members`
    );
  } else {
    state.adminCampaignMembers = [];
  }
}

function renderAdminPage() {
  if (els.adminUserSearch.value !== state.adminUserSearchQuery) {
    els.adminUserSearch.value = state.adminUserSearchQuery;
  }
  if (els.adminMemberSearch.value !== state.adminMemberSearchQuery) {
    els.adminMemberSearch.value = state.adminMemberSearchQuery;
  }

  const userQuery = state.adminUserSearchQuery.trim().toLowerCase();
  const memberQuery = state.adminMemberSearchQuery.trim().toLowerCase();
  const filteredUsers = userQuery
    ? state.adminUsers.filter((user) => {
      const statusLabel = Number(user.active) === 1 ? "active" : "inactive";
      return `${user.username} ${user.role} ${statusLabel}`.toLowerCase().includes(userQuery);
    })
    : state.adminUsers;

  els.adminUserList.innerHTML = "";
  if (filteredUsers.length === 0) {
    els.adminUserList.innerHTML = "<li>No users yet.</li>";
  } else {
    for (const user of filteredUsers) {
      const li = document.createElement("li");
      const row = document.createElement("div");
      row.className = "list-row admin-row";

      const label = document.createElement("span");
      label.className = "admin-row-main";
      label.textContent = user.username;
      row.appendChild(label);

      const meta = document.createElement("div");
      meta.className = "admin-meta";
      const roleBadge = document.createElement("span");
      roleBadge.className = "admin-badge";
      roleBadge.textContent = user.role === "admin" ? "Admin" : "Player";
      meta.appendChild(roleBadge);
      const statusBadge = document.createElement("span");
      statusBadge.className = `admin-badge ${Number(user.active) === 1 ? "admin-badge-active" : "admin-badge-inactive"}`;
      statusBadge.textContent = Number(user.active) === 1 ? "Active" : "Inactive";
      meta.appendChild(statusBadge);
      row.appendChild(meta);

      const actions = document.createElement("div");
      actions.className = "row-actions";

      const resetButton = document.createElement("button");
      resetButton.type = "button";
      resetButton.textContent = "Reset PW";
      resetButton.addEventListener("click", async () => {
        const password = window.prompt(`New password for ${user.username}:`);
        if (!password) return;
        try {
          await api(`/api/admin/users/${user.id}/reset-password`, {
            method: "POST",
            body: JSON.stringify({ password })
          });
          setStatus(`Reset password for ${user.username}.`);
        } catch (error) {
          setStatus(error.message);
        }
      });
      actions.appendChild(resetButton);

      const toggleButton = document.createElement("button");
      toggleButton.type = "button";
      toggleButton.textContent = Number(user.active) === 1 ? "Deactivate" : "Activate";
      if (Number(user.active) !== 1) toggleButton.classList.add("npc-heal-btn");
      toggleButton.addEventListener("click", async () => {
        try {
          await api(`/api/admin/users/${user.id}/active`, {
            method: "POST",
            body: JSON.stringify({ active: Number(user.active) !== 1 })
          });
          await loadAdminData();
          renderAdminPage();
          setStatus(`${Number(user.active) === 1 ? "Deactivated" : "Activated"} ${user.username}.`);
        } catch (error) {
          setStatus(error.message);
        }
      });
      actions.appendChild(toggleButton);

      row.appendChild(actions);
      li.appendChild(row);
      els.adminUserList.appendChild(li);
    }
  }

  els.adminCampaignList.innerHTML = "";
  if (state.campaigns.length === 0) {
    els.adminCampaignList.innerHTML = "<li>No campaigns yet.</li>";
  } else {
    for (const campaign of state.campaigns) {
      const li = document.createElement("li");
      li.textContent = campaign.name;
      li.dataset.campaignId = String(campaign.id);
      if (campaign.id === state.adminMemberCampaignId) li.classList.add("active");
      li.tabIndex = 0;
      els.adminCampaignList.appendChild(li);
    }
  }

  els.adminMemberUserSelect.innerHTML = "";
  for (const user of state.adminUsers) {
    if (Number(user.active) !== 1) continue;
    if (user.role !== "player") continue;
    const option = document.createElement("option");
    option.value = String(user.id);
    option.textContent = user.username;
    els.adminMemberUserSelect.appendChild(option);
  }
  if (els.adminMemberUserSelect.options.length === 0) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No active players available";
    option.disabled = true;
    option.selected = true;
    els.adminMemberUserSelect.appendChild(option);
  }

  els.adminMemberList.innerHTML = "";
  const filteredMembers = memberQuery
    ? state.adminCampaignMembers.filter((member) =>
      `${member.username} ${member.campaign_role}`.toLowerCase().includes(memberQuery)
    )
    : state.adminCampaignMembers;

  if (!Number.isInteger(state.adminMemberCampaignId)) {
    els.adminMemberList.innerHTML = "<li>Select a campaign.</li>";
  } else if (filteredMembers.length === 0) {
    els.adminMemberList.innerHTML = "<li>No members for this campaign yet.</li>";
  } else {
    for (const member of filteredMembers) {
      const li = document.createElement("li");
      const row = document.createElement("div");
      row.className = "list-row admin-row";

      const label = document.createElement("span");
      label.className = "admin-row-main";
      label.textContent = member.username;
      row.appendChild(label);

      const meta = document.createElement("div");
      meta.className = "admin-meta";
      const roleBadge = document.createElement("span");
      roleBadge.className = "admin-badge";
      roleBadge.textContent = "Player Access";
      meta.appendChild(roleBadge);
      row.appendChild(meta);

      const removeButton = document.createElement("button");
      removeButton.type = "button";
      removeButton.className = "delete-btn";
      removeButton.textContent = "X";
      removeButton.addEventListener("click", async () => {
        if (!Number.isInteger(state.adminMemberCampaignId)) return;
        try {
          await api(
            `/api/campaigns/${state.adminMemberCampaignId}/members/${member.user_id}`,
            { method: "DELETE" }
          );
          await loadAdminData();
          renderAdminPage();
          setStatus(`Removed ${member.username} from campaign.`);
        } catch (error) {
          setStatus(error.message);
        }
      });
      row.appendChild(removeButton);

      li.appendChild(row);
      els.adminMemberList.appendChild(li);
    }
  }

  const hasSelectedCampaign = Number.isInteger(state.adminMemberCampaignId);
  els.adminOpenMembershipModalBtn.disabled = !hasSelectedCampaign;
}

async function ensureAuthenticated() {
  const me = await api("/api/auth/me");
  state.authUser = me.user;
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
  await loadCampaignLiveState(state.selectedCampaignId);

  if (!state.scenarios.some((s) => s.id === state.selectedScenarioId)) {
    const preferred = state.scenarios.find((scenario) => Number(scenario.is_completed) !== 1);
    state.selectedScenarioId = preferred?.id ?? state.scenarios[0]?.id ?? null;
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
        const scenario = selectedScenario();
        if (Number(scenario?.is_completed) === 1) {
          navigateToPage("scenario-completed-edit", {
            campaignId: state.selectedCampaignId,
            scenarioId: state.selectedScenarioId
          });
        } else {
          els.goEditFromRunBtn.click();
        }
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
  els.adminActionCloseBtn.addEventListener("click", closeAdminActionModal);
  els.adminActionModal.addEventListener("click", (event) => {
    if (event.target === els.adminActionModal) closeAdminActionModal();
  });
  document.querySelectorAll(".campaign-action-cancel").forEach((button) => {
    button.addEventListener("click", closeCampaignActionModal);
  });
  document.querySelectorAll(".admin-action-cancel").forEach((button) => {
    button.addEventListener("click", closeAdminActionModal);
  });

  els.addCharacterBtn.addEventListener("click", () => {
    openCampaignActionModal("character");
  });

  els.addScenarioBtn.addEventListener("click", () => {
    openCampaignActionModal("scenario");
  });

  els.viewCompletedScenariosBtn.addEventListener("click", async () => {
    if (!state.selectedCampaignId) return;
    await navigateToPage("campaign-completed", {
      campaignId: state.selectedCampaignId
    });
  });

  els.backToCampaignBtn.addEventListener("click", async () => {
    if (!state.selectedCampaignId) return;
    await navigateToPage("campaign", {
      campaignId: state.selectedCampaignId
    });
  });

  els.addCampaignBtn.addEventListener("click", () => {
    openCampaignActionModal("campaign");
  });

  els.mainHomeBtn.addEventListener("click", () => {
    if (state.authUser?.role === "admin") {
      navigateToPage("welcome");
    } else {
      navigateToPage("player-home");
    }
  });

  els.playerRefreshBtn.addEventListener("click", () => {
    window.location.reload();
  });

  els.mainMonstersBtn.addEventListener("click", async () => {
    await navigateToPage("monsters");
  });

  els.mainAnalyticsBtn.addEventListener("click", () => {
    navigateToPage("analytics");
  });

  els.userMenuAdminBtn.addEventListener("click", async () => {
    await navigateToPage("admin");
  });

  els.userMenuLogoutBtn.addEventListener("click", async () => {
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch (_error) {
      // logout should still proceed client-side
    }
    state.authUser = null;
    setLoginStatus("");
    showPage("login");
  });

  els.loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    try {
      const result = await api("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({
          username: els.loginUsername.value.trim(),
          password: els.loginPassword.value
        })
      });
      state.authUser = result.user;
      setLoginStatus("");
      els.loginPassword.value = "";
      if (state.authUser.role === "admin") {
        await loadMonsters();
      }
      const nextPath = window.location.pathname === "/login"
        ? (state.authUser.role === "admin" ? "/" : "/player")
        : window.location.pathname;
      await navigateToPath(nextPath, {
        replace: true
      });
    } catch (error) {
      setLoginStatus(error.message || "Login failed.");
    }
  });

  els.adminCampaignList.addEventListener("click", async (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest("li[data-campaign-id]");
    if (!(item instanceof HTMLElement)) return;
    const campaignId = Number(item.dataset.campaignId);
    if (!Number.isInteger(campaignId)) return;
    state.adminMemberCampaignId = campaignId;
    try {
      await loadAdminData();
      renderAdminPage();
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.adminCampaignList.addEventListener("keydown", async (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const item = target.closest("li[data-campaign-id]");
    if (!(item instanceof HTMLElement)) return;
    event.preventDefault();
    const campaignId = Number(item.dataset.campaignId);
    if (!Number.isInteger(campaignId)) return;
    state.adminMemberCampaignId = campaignId;
    try {
      await loadAdminData();
      renderAdminPage();
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.adminUserSearch.addEventListener("input", () => {
    state.adminUserSearchQuery = els.adminUserSearch.value || "";
    renderAdminPage();
  });

  els.adminMemberSearch.addEventListener("input", () => {
    state.adminMemberSearchQuery = els.adminMemberSearch.value || "";
    renderAdminPage();
  });

  els.adminOpenCreateUserModalBtn.addEventListener("click", () => {
    openAdminActionModal("create-user");
  });

  els.adminOpenMembershipModalBtn.addEventListener("click", () => {
    openAdminActionModal("membership");
  });

  els.adminCreateUserForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    setAdminStatus("");
    try {
      await api("/api/admin/users", {
        method: "POST",
        body: JSON.stringify({
          username: els.adminNewUsername.value.trim(),
          password: els.adminNewPassword.value,
          role: els.adminNewRole.value
        })
      });
      els.adminNewUsername.value = "";
      els.adminNewPassword.value = "";
      els.adminNewRole.value = "player";
      await loadAdminData();
      renderAdminPage();
      setAdminStatus("User created.");
      closeAdminActionModal();
    } catch (error) {
      setAdminStatus(error.message || "Failed to create user.");
      setStatus(error.message);
    }
  });

  els.adminMembershipForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const campaignId = Number(state.adminMemberCampaignId);
    const userId = Number(els.adminMemberUserSelect.value);
    if (!Number.isInteger(campaignId) || !Number.isInteger(userId)) return;
    try {
      await api(`/api/campaigns/${campaignId}/members`, {
        method: "POST",
        body: JSON.stringify({
          userId,
          role: "player"
        })
      });
      state.adminMemberCampaignId = campaignId;
      await loadAdminData();
      renderAdminPage();
      setStatus("Membership updated.");
      closeAdminActionModal();
    } catch (error) {
      setStatus(error.message);
    }
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

  els.libraryEntryImageFile.addEventListener("change", async () => {
    const file = els.libraryEntryImageFile.files?.[0];
    if (!file) return;
    try {
      state.draftLibraryEntryImageData = await readFileAsDataUrl(file);
      setLibraryEntryImagePreview(state.draftLibraryEntryImageData);
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.monsterSearchInput.addEventListener("input", () => {
    state.monsterSearchQuery = els.monsterSearchInput.value || "";
    renderMonsterList();
  });

  els.scenarioSearchInput.addEventListener("input", () => {
    state.scenarioSearchQuery = els.scenarioSearchInput.value || "";
    renderScenarios();
  });

  document.addEventListener("paste", async (event) => {
    if (state.page !== "monsters") return;
    if (
      !els.campaignActionModal.classList.contains("hidden") &&
      state.campaignActionMode === "library-entry"
    ) {
      const items = event.clipboardData?.items || [];
      const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));
      if (!imageItem) return;
      const file = imageItem.getAsFile();
      if (!file) return;
      event.preventDefault();
      try {
        state.draftLibraryEntryImageData = await readFileAsDataUrl(file);
        setLibraryEntryImagePreview(state.draftLibraryEntryImageData);
        setStatus("Pasted statblock screenshot.");
      } catch (error) {
        setStatus(error.message);
      }
      return;
    }
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
          monsterImageData: state.draftLibraryEntryImageData || ""
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

  els.reopenScenarioBtn.addEventListener("click", async () => {
    const scenario = selectedScenario();
    if (!scenario) return;
    try {
      await api(`/api/scenarios/${scenario.id}/completed`, {
        method: "POST",
        body: JSON.stringify({ completed: false })
      });
      await loadCampaignData();
      await navigateToPage("scenario-edit", {
        campaignId: state.selectedCampaignId,
        scenarioId: scenario.id
      });
      setStatus(`Reopened scenario: ${scenario.name}`);
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.completeScenarioFromEditBtn.addEventListener("click", async () => {
    try {
      await completeSelectedScenario();
    } catch (error) {
      setStatus(error.message);
    }
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

  els.completeScenarioBtn.addEventListener("click", async () => {
    try {
      await completeSelectedScenario();
    } catch (error) {
      setStatus(error.message);
    }
  });

  els.shareScenarioBtn.addEventListener("click", async () => {
    const scenario = selectedScenario();
    if (!scenario) return;
    try {
      const isSharedCurrent = state.campaignLiveScenarioId === scenario.id;
      if (isSharedCurrent) {
        await api(`/api/campaigns/${state.selectedCampaignId}/live/clear`, { method: "POST" });
      } else {
        await api(`/api/scenarios/${scenario.id}/share`, { method: "POST" });
      }
      await loadCampaignLiveState(state.selectedCampaignId);
      renderScenarioRunPage();
      setStatus(
        isSharedCurrent
          ? `Stopped sharing encounter: ${scenario.name}`
          : `Shared encounter with players: ${scenario.name}`
      );
    } catch (error) {
      setStatus(error.message);
    }
  });
}

async function init() {
  bindEvents();
  try {
    await ensureAuthenticated();
  } catch (error) {
    if (error.code === "AUTH_REQUIRED") {
      showPage("login");
      return;
    }
    setLoginStatus(error.message);
    showPage("login");
    return;
  }
  try {
    if (state.authUser?.role === "admin") {
      await loadMonsters();
      setMonsterEditorReadOnly(true);
    }
  } catch (error) {
    setStatus(error.message);
  }
  await navigateToPath(window.location.pathname, { replace: true });
}

init();
