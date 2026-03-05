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
  draftLibraryEntryTokenImageData: "",
  libraryEntryPasteTarget: "statblock",
  selectedMonsterId: null,
  draftMonsterImageData: "",
  draftMonsterTokenImageData: "",
  monsterPasteTarget: "statblock",
  draftScenarioMapImageData: "",
  draftSettingsProfileImageData: "",
  addCombatantSelectedMonsterId: null,
  scenarioEditAutoSaveTimer: null,
  scenarioEditSaveInFlight: false,
  scenarioEditSavePending: false,
  analyticsSelectedCampaignId: null,
  analyticsStatsByCampaign: {},
  runMap: {
    scenarioId: null,
    zoom: 1,
    minZoom: 1,
    maxZoom: 4,
    panX: 0,
    panY: 0,
    dragging: false,
    dragMode: "map",
    dragCombatantId: null,
    hoverCombatantId: null,
    pointerId: null,
    lastClientX: 0,
    lastClientY: 0,
    dragLocked: false,
    tokensByScenario: {},
    pendingRemoteSync: null,
    saveTimer: null,
    saveSizeTimer: null,
    saveFogTimer: null,
    fogMode: "navigate",
    fogBrushSize: 56,
    fogBrushShape: "round",
    fogPainting: false,
    fogPointerId: null,
    fogDataByScenario: {},
    fogCanvasLoadedScenarioId: null,
    fogCanvasLoadedKey: null
  },
  playerMap: {
    scenarioId: null,
    mapKey: "",
    zoom: 1,
    minZoom: 1,
    maxZoom: 4,
    panX: 0,
    panY: 0,
    dragging: false,
    dragMode: "map",
    dragCombatantId: null,
    hoverCombatantId: null,
    pointerId: null,
    lastClientX: 0,
    lastClientY: 0,
    dragLocked: false,
    saveTimer: null,
    pendingTokenUpdate: null,
    fogMaskByFogData: {},
    fogMaskRequestId: 0
  },
  runPreviewEnemyId: null,
  campaigns: [],
  campaignSummaries: {},
  adminUsers: [],
  adminMemberCampaignId: null,
  adminCampaignMembers: [],
  adminCampaignClaims: [],
  adminUserSearchQuery: "",
  adminMemberSearchQuery: "",
  campaignLiveScenarioId: null,
  playerLiveData: null,
  userSettings: null,
  playerLivePollTimer: null,
  playerLiveEventSource: null,
  playerLiveReconnectTimer: null,
  runMapSyncPollTimer: null,
  runMapSyncEventSource: null,
  runMapSyncReconnectTimer: null,
  runMapSyncScenarioId: null,
  playerLiveViewMode: "initiative",
  loginAweTimer: null,
  scenarioVictoryById: {},
  pendingVictorySoundById: {},
  victoryAudioContext: null,
  victoryAudioElement: null,
  victoryAudioUnlocked: false,
  revealMomentCombatantId: null,
  revealMomentUntilMs: 0,
  revealMomentTimer: null,
  playerRevealMomentsByCombatant: {},
  playerVisibleCombatantIdsByScenario: {},
  playerRevealMomentTimer: null,
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

const RUN_MAP_FOG_BRUSH_SESSION_KEY = "runMapFogBrushSize";
const RUN_MAP_FOG_BRUSH_SHAPE_SESSION_KEY = "runMapFogBrushShape";

const els = {
  status: document.getElementById("status"),
  toastContainer: document.getElementById("toastContainer"),
  topNav: document.getElementById("topNav"),
  pageLogin: document.getElementById("pageLogin"),
  loginPageLogo: document.getElementById("loginPageLogo"),
  pageWelcome: document.getElementById("pageWelcome"),
  pagePlayerHome: document.getElementById("pagePlayerHome"),
  pageSettings: document.getElementById("pageSettings"),
  pageMonsters: document.getElementById("pageMonsters"),
  pageAnalytics: document.getElementById("pageAnalytics"),
  analyticsCampaignSelect: document.getElementById("analyticsCampaignSelect"),
  analyticsEncounterCounters: document.getElementById("analyticsEncounterCounters"),
  analyticsStatus: document.getElementById("analyticsStatus"),
  analyticsMetrics: document.getElementById("analyticsMetrics"),
  analyticsEnemyConditionList: document.getElementById("analyticsEnemyConditionList"),
  analyticsPcInitiativeList: document.getElementById("analyticsPcInitiativeList"),
  pageAdmin: document.getElementById("pageAdmin"),
  pageCampaign: document.getElementById("pageCampaign"),
  pageCampaignCompleted: document.getElementById("pageCampaignCompleted"),
  pageScenarioEdit: document.getElementById("pageScenarioEdit"),
  pageScenarioCompletedEdit: document.getElementById("pageScenarioCompletedEdit"),
  pageScenarioRun: document.getElementById("pageScenarioRun"),
  mainHomeBtn: document.getElementById("mainHomeBtn"),
  mainPlayerInitiativeBtn: document.getElementById("mainPlayerInitiativeBtn"),
  mainPlayerMapBtn: document.getElementById("mainPlayerMapBtn"),
  mainMonstersBtn: document.getElementById("mainMonstersBtn"),
  mainAnalyticsBtn: document.getElementById("mainAnalyticsBtn"),
  userMenu: document.getElementById("userMenu"),
  userMenuName: document.getElementById("userMenuName"),
  userMenuNameText: document.getElementById("userMenuNameText"),
  userMenuAvatar: document.getElementById("userMenuAvatar"),
  userMenuSettingsBtn: document.getElementById("userMenuSettingsBtn"),
  userMenuAdminBtn: document.getElementById("userMenuAdminBtn"),
  userMenuLogoutBtn: document.getElementById("userMenuLogoutBtn"),
  playerWaitingWrap: document.getElementById("playerWaitingWrap"),
  playerWaitingTitle: document.getElementById("playerWaitingTitle"),
  playerWaitingImage: document.getElementById("playerWaitingImage"),
  playerRefreshBtn: document.getElementById("playerRefreshBtn"),
  playerLiveWrap: document.getElementById("playerLiveWrap"),
  playerLiveEncounterName: document.getElementById("playerLiveEncounterName"),
  playerLiveRound: document.getElementById("playerLiveRound"),
  playerLiveInitiativeWrap: document.getElementById("playerLiveInitiativeWrap"),
  playerLiveMapWrap: document.getElementById("playerLiveMapWrap"),
  playerLiveMapHint: document.getElementById("playerLiveMapHint"),
  playerMapViewport: document.getElementById("playerMapViewport"),
  playerMapControls: document.getElementById("playerMapControls"),
  playerMapZoomOutBtn: document.getElementById("playerMapZoomOutBtn"),
  playerMapZoomInBtn: document.getElementById("playerMapZoomInBtn"),
  playerMapResetBtn: document.getElementById("playerMapResetBtn"),
  playerMapDragLockBtn: document.getElementById("playerMapDragLockBtn"),
  playerMapScene: document.getElementById("playerMapScene"),
  playerMapImage: document.getElementById("playerMapImage"),
  playerMapFogImage: document.getElementById("playerMapFogImage"),
  playerMapTokens: document.getElementById("playerMapTokens"),
  playerLiveCombatantList: document.getElementById("playerLiveCombatantList"),
  settingsProfileImagePreview: document.getElementById("settingsProfileImagePreview"),
  settingsProfileImageFile: document.getElementById("settingsProfileImageFile"),
  settingsUsernameInput: document.getElementById("settingsUsernameInput"),
  saveSettingsUsernameBtn: document.getElementById("saveSettingsUsernameBtn"),
  settingsNewPasswordInput: document.getElementById("settingsNewPasswordInput"),
  settingsConfirmPasswordInput: document.getElementById("settingsConfirmPasswordInput"),
  saveSettingsPasswordBtn: document.getElementById("saveSettingsPasswordBtn"),
  saveSettingsProfileImageBtn: document.getElementById("saveSettingsProfileImageBtn"),
  clearSettingsProfileImageBtn: document.getElementById("clearSettingsProfileImageBtn"),
  settingsClaimSection: document.getElementById("settingsClaimSection"),
  settingsClaimList: document.getElementById("settingsClaimList"),
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
  monsterSize: document.getElementById("monsterSize"),
  monsterIsLegendary: document.getElementById("monsterIsLegendary"),
  monsterLegendaryActionsWrap: document.getElementById("monsterLegendaryActionsWrap"),
  monsterReadonlyView: document.getElementById("monsterReadonlyView"),
  monsterImageFile: document.getElementById("monsterImageFile"),
  monsterImagePreview: document.getElementById("monsterImagePreview"),
  monsterTokenImageFile: document.getElementById("monsterTokenImageFile"),
  monsterTokenImagePreview: document.getElementById("monsterTokenImagePreview"),
  monsterStatblockImageGroup: document.getElementById("monsterStatblockImageGroup"),
  monsterTokenImageGroup: document.getElementById("monsterTokenImageGroup"),
  editMonsterBtn: document.getElementById("editMonsterBtn"),
  saveMonsterBtn: document.getElementById("saveMonsterBtn"),
  newMonsterBtn: document.getElementById("newMonsterBtn"),
  deleteMonsterBtn: document.getElementById("deleteMonsterBtn"),
  createLibraryEntryForm: document.getElementById("createLibraryEntryForm"),
  libraryEntryName: document.getElementById("libraryEntryName"),
  libraryEntrySize: document.getElementById("libraryEntrySize"),
  libraryEntryLegendary: document.getElementById("libraryEntryLegendary"),
  libraryEntryLegendaryWrap: document.getElementById("libraryEntryLegendaryWrap"),
  libraryEntryImageFile: document.getElementById("libraryEntryImageFile"),
  libraryEntryImagePreview: document.getElementById("libraryEntryImagePreview"),
  libraryEntryTokenImageFile: document.getElementById("libraryEntryTokenImageFile"),
  libraryEntryTokenImagePreview: document.getElementById("libraryEntryTokenImagePreview"),
  libraryEntryStatblockImageGroup: document.getElementById("libraryEntryStatblockImageGroup"),
  libraryEntryTokenImageGroup: document.getElementById("libraryEntryTokenImageGroup"),
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
  adminClaimList: document.getElementById("adminClaimList"),
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
  editScenarioMapFile: document.getElementById("editScenarioMapFile"),
  clearScenarioMapBtn: document.getElementById("clearScenarioMapBtn"),
  editScenarioMapPreview: document.getElementById("editScenarioMapPreview"),
  addEnemyForm: document.getElementById("addEnemyForm"),
  enemyName: document.getElementById("enemyName"),
  enemyMonsterResults: document.getElementById("enemyMonsterResults"),
  enemyRole: document.getElementById("enemyRole"),
  enemyInitiative: document.getElementById("enemyInitiative"),
  rollEnemyInitiativeBtn: document.getElementById("rollEnemyInitiativeBtn"),
  enemyHp: document.getElementById("enemyHp"),
  enemyMonsterPreview: document.getElementById("enemyMonsterPreview"),
  openAddCombatantModalBtn: document.getElementById("openAddCombatantModalBtn"),
  addCombatantModal: document.getElementById("addCombatantModal"),
  addCombatantCloseBtn: document.getElementById("addCombatantCloseBtn"),
  enemyMonsterSearchInput: document.getElementById("enemyMonsterSearchInput"),
  combatantEditList: document.getElementById("combatantEditList"),
  runScenarioName: document.getElementById("runScenarioName"),
  runScenarioSharedDot: document.getElementById("runScenarioSharedDot"),
  runScenarioNotes: document.getElementById("runScenarioNotes"),
  runRound: document.getElementById("runRound"),
  runMapViewToggleBtn: document.getElementById("runMapViewToggleBtn"),
  runCombatLayout: document.getElementById("runCombatLayout"),
  runMapWrap: document.getElementById("runMapWrap"),
  runMapHint: document.getElementById("runMapHint"),
  runMapTokenSizeControls: document.getElementById("runMapTokenSizeControls"),
  runMapControls: document.getElementById("runMapControls"),
  runMapDmControls: document.getElementById("runMapDmControls"),
  runMapZoomOutBtn: document.getElementById("runMapZoomOutBtn"),
  runMapZoomInBtn: document.getElementById("runMapZoomInBtn"),
  runMapResetBtn: document.getElementById("runMapResetBtn"),
  runMapFogPaintBtn: document.getElementById("runMapFogPaintBtn"),
  runMapFogEraseBtn: document.getElementById("runMapFogEraseBtn"),
  runMapFogClearBtn: document.getElementById("runMapFogClearBtn"),
  runMapFogBrushControls: document.getElementById("runMapFogBrushControls"),
  runMapFogBrushSizeInput: document.getElementById("runMapFogBrushSizeInput"),
  runMapFogBrushSizeNumber: document.getElementById("runMapFogBrushSizeNumber"),
  runMapFogBrushShapeRound: document.getElementById("runMapFogBrushShapeRound"),
  runMapFogBrushShapeSquare: document.getElementById("runMapFogBrushShapeSquare"),
  runMapFogCursorPreview: document.getElementById("runMapFogCursorPreview"),
  runMapDragLockBtn: document.getElementById("runMapDragLockBtn"),
  runMapTokenSizeInput: document.getElementById("runMapTokenSizeInput"),
  runMapTokenSizeNumber: document.getElementById("runMapTokenSizeNumber"),
  runMapViewport: document.getElementById("runMapViewport"),
  runMapScene: document.getElementById("runMapScene"),
  runMapFogCanvas: document.getElementById("runMapFogCanvas"),
  runMapTokens: document.getElementById("runMapTokens"),
  runMapImage: document.getElementById("runMapImage"),
  runInitiativeWrap: document.getElementById("runInitiativeWrap"),
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
      "Can't See. You can't see and automatically fail any ability check that requires sight.\n\nAttacks Affected. Attack rolls against you have Advantage, and your attack rolls have Disadvantage."
  },
  {
    key: "charmed",
    label: "Charmed",
    color: "#b2648d",
    tip:
      "Can't Harm the Charmer. You can't attack the charmer or target the charmer with damaging abilities or magical effects.\n\nSocial Advantage. The charmer has Advantage on any ability check to interact with you socially."
  },
  {
    key: "deafened",
    label: "Deafened",
    color: "#5b6d7a",
    tip:
      "Can't Hear. You can't hear and automatically fail any ability check that requires hearing."
  },
  {
    key: "exhaustion",
    label: "Exhaustion",
    color: "#9b6a3c",
    tip:
      "Exhaustion Levels. This condition is cumulative; each time you receive it, you gain 1 level, and you die if your level is 6.\n\nD20 Tests Affected. When you make a D20 Test, the roll is reduced by 2 times your Exhaustion level.\n\nSpeed Reduced. Your Speed is reduced by 5 times your Exhaustion level.\n\nRemoving Exhaustion Levels. Finishing a Long Rest removes 1 level; when your level reaches 0, the condition ends."
  },
  {
    key: "frightened",
    label: "Frightened",
    color: "#83624a",
    tip:
      "Ability Checks and Attacks Affected. You have Disadvantage on ability checks and attack rolls while the source of fear is within line of sight.\n\nCan't Approach. You can't willingly move closer to the source of fear."
  },
  {
    key: "grappled",
    label: "Grappled",
    color: "#6f5443",
    tip:
      "Speed 0. Your Speed is 0 and can't increase.\n\nAttacks Affected. You have Disadvantage on attack rolls against any target other than the grappler.\n\nMovable. The grappler can drag or carry you when it moves, but every foot of movement costs it 1 extra foot unless you are Tiny or two or more sizes smaller than it."
  },
  {
    key: "incapacitated",
    label: "Incapacitated",
    color: "#56706f",
    tip:
      "Inactive. You can't take any action, Bonus Action, or Reaction.\n\nNo Concentration. Your Concentration is broken.\n\nSpeechless. You can't speak.\n\nSurprised. If you're Incapacitated when you roll Initiative, you have Disadvantage on the roll."
  },
  {
    key: "concentrated",
    label: "Concentrated",
    color: "#4d6d7f",
    tip:
      "If you take damage, you must succeed on a Constitution saving throw to maintain Concentration.\n\nThe DC equals 10 or half the damage taken (round down), whichever number is higher, up to a maximum DC of 30."
  },
  {
    key: "invisible",
    label: "Invisible",
    color: "#6f6f8f",
    tip:
      "Surprise. If you're Invisible when you roll Initiative, you have Advantage on the roll.\n\nConcealed. You aren't affected by any effect that requires its target to be seen unless the effect's creator can somehow see you; any equipment you are wearing or carrying is also concealed.\n\nAttacks Affected. Attack rolls against you have Disadvantage, and your attack rolls have Advantage; if a creature can somehow see you, you don't gain this benefit against that creature."
  },
  {
    key: "paralyzed",
    label: "Paralyzed",
    color: "#6c5a90",
    tip:
      "Incapacitated. You have the Incapacitated condition.\n\nSpeed 0. Your Speed is 0 and can't increase.\n\nSaving Throws Affected. You automatically fail Strength and Dexterity saving throws.\n\nAttacks Affected. Attack rolls against you have Advantage.\n\nAutomatic Critical Hits. Any attack roll that hits you is a Critical Hit if the attacker is within 5 feet of you."
  },
  {
    key: "petrified",
    label: "Petrified",
    color: "#6f6f6f",
    tip:
      "Turned to Inanimate Substance. You and nonmagical worn/carried objects are transformed into a solid inanimate substance (usually stone); your weight increases tenfold, and you cease aging.\n\nIncapacitated. You have the Incapacitated condition.\n\nSpeed 0. Your Speed is 0 and can't increase.\n\nAttacks Affected. Attack rolls against you have Advantage.\n\nSaving Throws Affected. You automatically fail Strength and Dexterity saving throws.\n\nResist Damage. You have Resistance to all damage.\n\nPoison Immunity. You have Immunity to the Poisoned condition."
  },
  {
    key: "poisoned",
    label: "Poisoned",
    color: "#4a7d4f",
    tip:
      "Ability Checks and Attacks Affected. You have Disadvantage on attack rolls and ability checks."
  },
  {
    key: "prone",
    label: "Prone",
    color: "#8c6c52",
    tip:
      "Restricted Movement. Your only movement options are to crawl or to spend movement equal to half your Speed (round down) to right yourself and end the condition; if your Speed is 0, you can't right yourself.\n\nAttacks Affected. You have Disadvantage on attack rolls.\n\nAn attack roll against you has Advantage if the attacker is within 5 feet of you; otherwise that attack roll has Disadvantage."
  },
  {
    key: "restrained",
    label: "Restrained",
    color: "#826944",
    tip:
      "Speed 0. Your Speed is 0 and can't increase.\n\nAttacks Affected. Attack rolls against you have Advantage, and your attack rolls have Disadvantage.\n\nSaving Throws Affected. You have Disadvantage on Dexterity saving throws."
  },
  {
    key: "stunned",
    label: "Stunned",
    color: "#7c6a85",
    tip:
      "Incapacitated. You have the Incapacitated condition.\n\nSaving Throws Affected. You automatically fail Strength and Dexterity saving throws.\n\nAttacks Affected. Attack rolls against you have Advantage."
  },
  {
    key: "unconscious",
    label: "Unconscious",
    color: "#4f5b7a",
    tip:
      "Inert. You have the Incapacitated and Prone conditions, and you drop whatever you're holding; when this condition ends, you remain Prone.\n\nSpeed 0. Your Speed is 0 and can't increase.\n\nAttacks Affected. Attack rolls against you have Advantage.\n\nSaving Throws Affected. You automatically fail Strength and Dexterity saving throws.\n\nAutomatic Critical Hits. Any attack roll that hits you is a Critical Hit if the attacker is within 5 feet of you.\n\nUnaware. You're unaware of your surroundings."
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

function inferStatusType(message = "") {
  const text = `${message || ""}`.trim().toLowerCase();
  if (!text) return "info";
  if (
    text.includes("error") ||
    text.includes("failed") ||
    text.includes("denied") ||
    text.includes("invalid") ||
    text.includes("required") ||
    text.includes("not found") ||
    text.includes("could not") ||
    text.includes("can't")
  ) {
    return "error";
  }
  return "info";
}

function showToast(message, type = "info") {
  const text = `${message || ""}`.trim();
  if (!text || !els.toastContainer) return;
  const level = ["info", "success", "error"].includes(type) ? type : "info";

  const toast = document.createElement("div");
  toast.className = `toast toast-${level}`;
  toast.setAttribute("role", "status");

  const msg = document.createElement("div");
  msg.className = "toast-message";
  msg.textContent = text;
  toast.appendChild(msg);

  const close = document.createElement("button");
  close.type = "button";
  close.className = "toast-close";
  close.textContent = "X";
  close.setAttribute("aria-label", "Dismiss notification");
  toast.appendChild(close);

  let removed = false;
  const removeToast = () => {
    if (removed) return;
    removed = true;
    toast.classList.add("is-exiting");
    window.setTimeout(() => {
      toast.remove();
    }, 170);
  };

  const ttl = level === "error" ? 5200 : 3400;
  const timer = window.setTimeout(removeToast, ttl);
  close.addEventListener("click", () => {
    window.clearTimeout(timer);
    removeToast();
  });

  els.toastContainer.appendChild(toast);
  while (els.toastContainer.childElementCount > 5) {
    const first = els.toastContainer.firstElementChild;
    if (!first) break;
    first.remove();
  }
}

function setStatus(message = "", type = null) {
  const text = `${message || ""}`.trim();
  els.status.textContent = text;
  if (!text) return;
  const toastType = type || inferStatusType(text);
  showToast(text, toastType);
}

function setLoginStatus(message = "") {
  els.loginStatus.textContent = message;
}

function triggerLoginAweEffect() {
  if (state.loginAweTimer) {
    clearTimeout(state.loginAweTimer);
    state.loginAweTimer = null;
  }
  document.body.classList.remove("login-awe-active");
  // Force reflow so repeated logins can retrigger the effect cleanly.
  void document.body.offsetWidth;
  document.body.classList.add("login-awe-active");
  state.loginAweTimer = setTimeout(() => {
    document.body.classList.remove("login-awe-active");
    state.loginAweTimer = null;
  }, 1800);
}

function setAdminStatus(message = "") {
  if (!els.adminStatus) return;
  els.adminStatus.textContent = message;
}

function closeUserMenuPopover() {
  els.userMenu?.classList.add("force-closed");
  if (document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

let conditionTooltipEl = null;
let conditionTooltipChip = null;
const CONDITION_TOOLTIP_NO_LEAD_STYLE = new Set(["down", "concentrated"]);
let mapStatblockHoverEl = null;

function ensureConditionTooltipEl() {
  if (conditionTooltipEl) return conditionTooltipEl;
  conditionTooltipEl = document.createElement("div");
  conditionTooltipEl.className = "condition-tooltip-floating hidden";
  document.body.appendChild(conditionTooltipEl);
  return conditionTooltipEl;
}

function hideConditionTooltip() {
  if (!conditionTooltipEl) return;
  conditionTooltipEl.classList.add("hidden");
  conditionTooltipChip = null;
}

function ensureMapStatblockHoverEl() {
  if (mapStatblockHoverEl) return mapStatblockHoverEl;
  mapStatblockHoverEl = document.createElement("div");
  mapStatblockHoverEl.className = "map-statblock-hover hidden";
  const image = document.createElement("img");
  image.alt = "Statblock preview";
  mapStatblockHoverEl.appendChild(image);
  document.body.appendChild(mapStatblockHoverEl);
  return mapStatblockHoverEl;
}

function hideMapStatblockHover() {
  if (!mapStatblockHoverEl) return;
  mapStatblockHoverEl.classList.add("hidden");
  const image = mapStatblockHoverEl.querySelector("img");
  if (image) image.src = "";
}

function showMapStatblockHover(src, anchorEl) {
  if (!src || !anchorEl) return;
  const popup = ensureMapStatblockHoverEl();
  const image = popup.querySelector("img");
  if (!image) return;
  image.src = src;
  popup.classList.remove("hidden");

  const anchorRect = anchorEl.getBoundingClientRect();
  const margin = 10;
  const desiredWidth = 1040;
  const maxWidth = Math.min(desiredWidth, window.innerWidth - margin * 2);
  popup.style.width = `${maxWidth}px`;

  const popupRect = popup.getBoundingClientRect();
  let left = anchorRect.right + margin;
  if (left + popupRect.width > window.innerWidth - margin) {
    left = anchorRect.left - popupRect.width - margin;
  }
  if (left < margin) left = margin;

  let top = anchorRect.top;
  if (top + popupRect.height > window.innerHeight - margin) {
    top = window.innerHeight - popupRect.height - margin;
  }
  if (top < margin) top = margin;

  popup.style.left = `${Math.round(left)}px`;
  popup.style.top = `${Math.round(top)}px`;
}

function positionConditionTooltip(chip) {
  if (!conditionTooltipEl || conditionTooltipEl.classList.contains("hidden")) return;
  const chipRect = chip.getBoundingClientRect();
  const tooltipRect = conditionTooltipEl.getBoundingClientRect();
  const gap = 8;
  const margin = 8;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let left = chipRect.left;
  if (left + tooltipRect.width > viewportWidth - margin) {
    left = viewportWidth - tooltipRect.width - margin;
  }
  if (left < margin) left = margin;

  let top = chipRect.bottom + gap;
  if (top + tooltipRect.height > viewportHeight - margin) {
    top = chipRect.top - tooltipRect.height - gap;
  }
  if (top < margin) top = margin;

  conditionTooltipEl.style.left = `${Math.round(left)}px`;
  conditionTooltipEl.style.top = `${Math.round(top)}px`;
}

function renderConditionTooltipContent(tooltip, tip, options = {}) {
  const emphasizeLead = options.emphasizeLead !== false;
  tooltip.replaceChildren();
  const paragraphs = `${tip || ""}`
    .split(/\n{2,}/)
    .map((part) => part.trim())
    .filter(Boolean);

  for (const paragraph of paragraphs) {
    const line = document.createElement("p");
    line.className = "condition-tooltip-paragraph";

    const firstDot = paragraph.indexOf(".");
    if (firstDot > 0 && emphasizeLead) {
      const lead = paragraph.slice(0, firstDot + 1).trim();
      const rest = paragraph.slice(firstDot + 1).trim();
      const leadEl = document.createElement("span");
      leadEl.className = "condition-tooltip-lead";
      leadEl.textContent = lead;
      line.appendChild(leadEl);
      if (rest) {
        line.appendChild(document.createTextNode(` ${rest}`));
      }
    } else {
      line.textContent = paragraph;
    }

    tooltip.appendChild(line);
  }
}

function showConditionTooltip(chip) {
  const tip = `${chip.getAttribute("data-tip") || ""}`.trim();
  if (!tip) {
    hideConditionTooltip();
    return;
  }
  const conditionKey = `${chip.getAttribute("data-condition-key") || ""}`.trim().toLowerCase();
  const emphasizeLead = !CONDITION_TOOLTIP_NO_LEAD_STYLE.has(conditionKey);
  const tooltip = ensureConditionTooltipEl();
  renderConditionTooltipContent(tooltip, tip, { emphasizeLead });
  tooltip.classList.remove("hidden");
  conditionTooltipChip = chip;
  positionConditionTooltip(chip);
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

function setMonsterTokenImagePreview(dataUrl) {
  if (dataUrl) {
    els.monsterTokenImagePreview.src = dataUrl;
    els.monsterTokenImagePreview.classList.remove("hidden");
  } else {
    els.monsterTokenImagePreview.src = "";
    els.monsterTokenImagePreview.classList.add("hidden");
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

function setLibraryEntryTokenImagePreview(dataUrl) {
  if (dataUrl) {
    els.libraryEntryTokenImagePreview.src = dataUrl;
    els.libraryEntryTokenImagePreview.classList.remove("hidden");
  } else {
    els.libraryEntryTokenImagePreview.src = "";
    els.libraryEntryTokenImagePreview.classList.add("hidden");
  }
}

function setSettingsProfileImagePreview(dataUrl) {
  if (dataUrl) {
    els.settingsProfileImagePreview.src = dataUrl;
    els.settingsProfileImagePreview.classList.remove("hidden");
  } else {
    els.settingsProfileImagePreview.src = "";
    els.settingsProfileImagePreview.classList.add("hidden");
  }
}

function setScenarioMapPreview(dataUrl) {
  if (dataUrl) {
    els.editScenarioMapPreview.src = dataUrl;
    els.editScenarioMapPreview.classList.remove("hidden");
  } else {
    els.editScenarioMapPreview.src = "";
    els.editScenarioMapPreview.classList.add("hidden");
  }
}

function scenarioEditPayloadFromForm() {
  return {
    name: `${els.editScenarioName.value || ""}`.trim(),
    notes: `${els.editScenarioNotes.value || ""}`,
    mapImageData: state.draftScenarioMapImageData || ""
  };
}

function scenarioEditHasChanges(scenario, payload) {
  if (!scenario) return false;
  return (
    payload.name !== `${scenario.name || ""}` ||
    payload.notes !== `${scenario.notes || ""}` ||
    payload.mapImageData !== `${scenario.map_image_data || ""}`
  );
}

async function persistScenarioEditAutoSave({ showStatus = false } = {}) {
  if (!state.selectedScenarioId) return;
  const scenario = selectedScenario();
  if (!scenario) return;

  const payload = scenarioEditPayloadFromForm();
  if (!payload.name) return;
  if (!scenarioEditHasChanges(scenario, payload)) return;

  if (state.scenarioEditSaveInFlight) {
    state.scenarioEditSavePending = true;
    return;
  }

  state.scenarioEditSaveInFlight = true;
  try {
    const updated = await api(`/api/scenarios/${state.selectedScenarioId}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    });
    state.scenarios = state.scenarios.map((s) => (s.id === updated.id ? updated : s));
    if (showStatus) setStatus("Scenario updated.", "success");
  } catch (error) {
    setStatus(error.message, "error");
  } finally {
    state.scenarioEditSaveInFlight = false;
    if (state.scenarioEditSavePending) {
      state.scenarioEditSavePending = false;
      persistScenarioEditAutoSave({ showStatus: false });
    }
  }
}

function scheduleScenarioEditAutoSave(delayMs = 450) {
  if (state.scenarioEditAutoSaveTimer) clearTimeout(state.scenarioEditAutoSaveTimer);
  state.scenarioEditAutoSaveTimer = setTimeout(() => {
    state.scenarioEditAutoSaveTimer = null;
    persistScenarioEditAutoSave({ showStatus: false });
  }, delayMs);
}

function hasPlayersWonEncounter(combatants, { visibleOnly = false } = {}) {
  const enemies = (Array.isArray(combatants) ? combatants : []).filter((combatant) => {
    if (combatant.kind !== "enemy" || isAllyCombatant(combatant)) return false;
    if (!visibleOnly) return true;
    if (combatant.player_visible == null) return true;
    return Number(combatant.player_visible) !== 0;
  });
  if (enemies.length === 0) return false;
  return enemies.every((enemy) => {
    if (Number(enemy.is_defeated) === 1) return true;
    const hp = Number(enemy.hp);
    return Number.isFinite(hp) && hp <= 0;
  });
}

async function playVictorySound() {
  if (!state.victoryAudioUnlocked) return false;
  if (!state.victoryAudioElement) {
    state.victoryAudioElement = new Audio("/sounds/victory_sound.mp3");
    state.victoryAudioElement.preload = "auto";
  }
  state.victoryAudioElement.currentTime = 0;
  try {
    await state.victoryAudioElement.play();
    return true;
  } catch (_error) {
    return false;
  }
}

function launchVictoryConfetti() {
  const layer = document.createElement("div");
  layer.className = "victory-confetti-layer";
  const colors = ["#ff6b6b", "#ffd166", "#06d6a0", "#4cc9f0", "#f72585", "#90be6d"];
  const waves = 4;
  const countPerWave = 55;

  for (let wave = 0; wave < waves; wave += 1) {
    const waveDelay = wave * 520;
    for (let i = 0; i < countPerWave; i += 1) {
      const piece = document.createElement("span");
      piece.className = "victory-confetti-piece";
      const angle = Math.random() * Math.PI * 2;
      const distance = 180 + Math.random() * 380;
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 140;
      piece.style.setProperty("--dx", `${dx}px`);
      piece.style.setProperty("--dy", `${dy}px`);
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.width = `${5 + Math.random() * 6}px`;
      piece.style.height = `${7 + Math.random() * 10}px`;
      piece.style.animationDelay = `${waveDelay + Math.random() * 120}ms`;
      piece.style.animationDuration = `${2500 + Math.random() * 700}ms`;
      layer.appendChild(piece);
    }
  }

  document.body.appendChild(layer);
  window.setTimeout(() => {
    layer.remove();
  }, 5200);
}

function unlockVictoryAudio() {
  if (state.victoryAudioUnlocked) {
    for (const key of Object.keys(state.pendingVictorySoundById)) {
      if (!state.pendingVictorySoundById[key]) continue;
      playVictorySound().then((ok) => {
        if (ok) {
          delete state.pendingVictorySoundById[key];
        }
      }).catch(() => {});
    }
    return;
  }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    state.victoryAudioUnlocked = true;
    for (const key of Object.keys(state.pendingVictorySoundById)) {
      if (!state.pendingVictorySoundById[key]) continue;
      playVictorySound().then((ok) => {
        if (ok) {
          delete state.pendingVictorySoundById[key];
        }
      }).catch(() => {});
    }
    return;
  }
  if (!state.victoryAudioContext) {
    state.victoryAudioContext = new AudioCtx();
  }
  state.victoryAudioContext.resume().then(() => {
    state.victoryAudioUnlocked = state.victoryAudioContext?.state === "running";
    if (!state.victoryAudioUnlocked) return;
    for (const key of Object.keys(state.pendingVictorySoundById)) {
      if (!state.pendingVictorySoundById[key]) continue;
      playVictorySound().then((ok) => {
        if (ok) {
          delete state.pendingVictorySoundById[key];
        }
      }).catch(() => {});
    }
  }).catch(() => {
    state.victoryAudioUnlocked = false;
  });
}

function maybeCelebrateEncounterWin(scenarioId, combatants, options = {}) {
  if (!Number.isInteger(scenarioId)) return;
  const key = `${state.authUser?.role || "user"}:${scenarioId}`;
  const wonNow = hasPlayersWonEncounter(combatants, options);
  const hasSeenScenario = Object.prototype.hasOwnProperty.call(state.scenarioVictoryById, key);
  if (!hasSeenScenario) {
    state.scenarioVictoryById[key] = wonNow;
    if (!wonNow) {
      delete state.pendingVictorySoundById[key];
    }
    return;
  }
  const wonBefore = Boolean(state.scenarioVictoryById[key]);

  if (wonNow && !wonBefore) {
    state.scenarioVictoryById[key] = true;
    launchVictoryConfetti();
    if (state.victoryAudioUnlocked) {
      playVictorySound().then((ok) => {
        if (!ok) {
          state.pendingVictorySoundById[key] = true;
        }
      }).catch(() => {
        state.pendingVictorySoundById[key] = true;
      });
    } else {
      state.pendingVictorySoundById[key] = true;
    }
    setStatus("Players won the encounter.", "success");
    return;
  }

  state.scenarioVictoryById[key] = wonNow;
  if (!wonNow) {
    delete state.pendingVictorySoundById[key];
  }
}

function hasRevealMoment(combatantId) {
  if (!Number.isInteger(combatantId)) return false;
  return (
    state.revealMomentCombatantId === combatantId &&
    Date.now() < Number(state.revealMomentUntilMs || 0)
  );
}

function playRevealSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  if (!state.victoryAudioContext) {
    state.victoryAudioContext = new AudioCtx();
  }
  const audioCtx = state.victoryAudioContext;
  const scheduleReveal = () => {
    const now = audioCtx.currentTime;
    const master = audioCtx.createGain();
    master.gain.setValueAtTime(0.0001, now);
    master.gain.linearRampToValueAtTime(0.1, now + 0.03);
    master.gain.exponentialRampToValueAtTime(0.0001, now + 0.36);
    master.connect(audioCtx.destination);

    const oscA = audioCtx.createOscillator();
    oscA.type = "triangle";
    oscA.frequency.setValueAtTime(523.25, now);
    oscA.frequency.exponentialRampToValueAtTime(880, now + 0.2);
    oscA.connect(master);
    oscA.start(now);
    oscA.stop(now + 0.36);

    const oscB = audioCtx.createOscillator();
    oscB.type = "sine";
    oscB.frequency.setValueAtTime(659.25, now + 0.02);
    oscB.frequency.exponentialRampToValueAtTime(1174.66, now + 0.26);
    oscB.connect(master);
    oscB.start(now + 0.02);
    oscB.stop(now + 0.36);
  };
  if (audioCtx.state === "running") {
    scheduleReveal();
    return;
  }
  audioCtx.resume().then(scheduleReveal).catch(() => {});
}

function triggerRevealMoment(combatantId) {
  if (!Number.isInteger(combatantId)) return;
  state.revealMomentCombatantId = combatantId;
  state.revealMomentUntilMs = Date.now() + 1800;
  if (state.revealMomentTimer) clearTimeout(state.revealMomentTimer);
  state.revealMomentTimer = setTimeout(() => {
    state.revealMomentTimer = null;
    if (Date.now() >= Number(state.revealMomentUntilMs || 0)) {
      state.revealMomentCombatantId = null;
      state.revealMomentUntilMs = 0;
    }
  }, 1900);
}

function hasPlayerRevealMoment(combatantId) {
  if (!Number.isInteger(combatantId)) return false;
  return Date.now() < Number(state.playerRevealMomentsByCombatant[combatantId] || 0);
}

function schedulePlayerRevealMomentCleanup() {
  if (state.playerRevealMomentTimer) {
    clearTimeout(state.playerRevealMomentTimer);
    state.playerRevealMomentTimer = null;
  }
  const now = Date.now();
  const activeUntil = Object.values(state.playerRevealMomentsByCombatant)
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value) && value > now);
  if (activeUntil.length === 0) return;
  const nextUntil = Math.min(...activeUntil);
  const waitMs = Math.max(20, nextUntil - now + 30);
  state.playerRevealMomentTimer = setTimeout(() => {
    state.playerRevealMomentTimer = null;
    if (state.page === "player-home" && state.playerLiveViewMode === "map") {
      renderPlayerHome();
    }
  }, waitMs);
}

function triggerPlayerRevealMoments(combatantIds) {
  const now = Date.now();
  let added = false;
  for (const id of combatantIds) {
    const combatantId = Number(id);
    if (!Number.isInteger(combatantId)) continue;
    state.playerRevealMomentsByCombatant[combatantId] = now + 2200;
    added = true;
  }
  if (!added) return;
  schedulePlayerRevealMomentCleanup();
}

function updatePlayerRevealMomentsFromShared(shared) {
  const scenarioId = Number(shared?.scenarioId);
  if (!Number.isInteger(scenarioId)) return;
  const combatants = Array.isArray(shared?.combatants) ? shared.combatants : [];
  const visibleNonPcIds = combatants
    .filter((combatant) => combatant.kind !== "character" && Number(combatant.player_visible) !== 0)
    .map((combatant) => Number(combatant.id))
    .filter((id) => Number.isInteger(id));

  const previous = state.playerVisibleCombatantIdsByScenario[scenarioId];
  if (previous instanceof Set) {
    const newlyVisible = visibleNonPcIds.filter((id) => !previous.has(id));
    if (newlyVisible.length > 0) {
      triggerPlayerRevealMoments(newlyVisible);
    }
  }

  state.playerVisibleCombatantIdsByScenario[scenarioId] = new Set(visibleNonPcIds);
}

function updateMonsterLegendaryFieldsVisibility() {
  const isLegendary = els.monsterIsLegendary.value === "true";
  els.monsterLegendaryActionsWrap.classList.toggle("hidden", !isLegendary);
}

function updateLibraryEntryLegendaryFieldsVisibility() {
  const isLegendary = els.libraryEntryLegendary.value === "true";
  els.libraryEntryLegendaryWrap.classList.toggle("hidden", !isLegendary);
}

function setMonsterPasteTarget(target) {
  state.monsterPasteTarget = target === "token" ? "token" : "statblock";
  els.monsterStatblockImageGroup?.classList.toggle("active", state.monsterPasteTarget === "statblock");
  els.monsterTokenImageGroup?.classList.toggle("active", state.monsterPasteTarget === "token");
}

function setLibraryEntryPasteTarget(target) {
  state.libraryEntryPasteTarget = target === "token" ? "token" : "statblock";
  els.libraryEntryStatblockImageGroup?.classList.toggle(
    "active",
    state.libraryEntryPasteTarget === "statblock"
  );
  els.libraryEntryTokenImageGroup?.classList.toggle("active", state.libraryEntryPasteTarget === "token");
}

function setMonsterEditorReadOnly(readOnly) {
  state.monsterEditorReadOnly = readOnly;
  els.monsterForm.classList.toggle("monster-form-readonly", readOnly);
  els.monsterName.readOnly = readOnly;
  els.monsterSize.disabled = readOnly;
  els.monsterIsLegendary.disabled = readOnly;
  els.monsterImageFile.disabled = readOnly;
  els.monsterTokenImageFile.disabled = readOnly;
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

function appendReadonlyRow(parent, labelText, valueText) {
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
  parent.appendChild(row);
}

function formatMonsterSizeLabel(size) {
  const raw = `${size || "normal"}`.trim().toLowerCase();
  if (raw === "normal") return "Normal";
  if (raw === "large") return "Large";
  if (raw === "huge") return "Huge";
  if (raw === "gargantuan") return "Gargantuan";
  return "Normal";
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

  const top = document.createElement("div");
  top.className = "monster-readonly-top";

  const meta = document.createElement("div");
  meta.className = "monster-readonly-meta";
  appendReadonlyRow(meta, "Name", monster.name || "-");
  appendReadonlyRow(meta, "Size", formatMonsterSizeLabel(monster.size));
  if (monster.is_legendary) {
    const count = Number(monster.legendary_actions_count);
    const suffix = Number.isInteger(count) ? ` (${count})` : "";
    appendReadonlyRow(meta, "Legendary", `Yes${suffix}`);
  } else {
    appendReadonlyRow(meta, "Legendary", "No");
  }
  top.appendChild(meta);

  const token = document.createElement("img");
  token.className = "monster-readonly-token";
  token.alt = `${monster.name || "Monster"} token`;
  const fallbackSrc = "/icons/enemy.svg";
  token.src = monster.token_image_data || "/icons/enemy.png";
  token.style.cursor = "zoom-in";
  token.addEventListener("error", () => {
    if (!token.src.endsWith(fallbackSrc)) token.src = fallbackSrc;
  });
  token.addEventListener("click", () => {
    if (!token.src) return;
    openImageModal(token.src);
  });
  top.appendChild(token);

  els.monsterReadonlyView.appendChild(top);
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
    els.libraryEntrySize.value = "normal";
    els.libraryEntryLegendary.value = "false";
    state.draftLibraryEntryImageData = "";
    state.draftLibraryEntryTokenImageData = "";
    setLibraryEntryPasteTarget("statblock");
    setLibraryEntryImagePreview("");
    setLibraryEntryTokenImagePreview("");
    els.libraryEntryImageFile.value = "";
    els.libraryEntryTokenImageFile.value = "";
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

function openAddCombatantModal() {
  if (!state.selectedScenarioId) return;
  state.addCombatantSelectedMonsterId = null;
  els.enemyName.value = "";
  els.enemyRole.value = "enemy";
  els.enemyInitiative.value = "";
  els.enemyHp.value = "";
  els.enemyMonsterSearchInput.value = "";
  renderEnemyMonsterOptions("");
  els.addCombatantModal.classList.remove("hidden");
  els.enemyMonsterSearchInput.focus();
}

function closeAddCombatantModal() {
  els.addCombatantModal.classList.add("hidden");
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

function isAllyEnemyRole(enemyRole) {
  return enemyRole === "ally" || enemyRole === "npc";
}

function isAllyCombatant(combatant) {
  return combatant?.kind === "enemy" && isAllyEnemyRole(combatant.enemy_role);
}

function combatantKindLabel(combatant) {
  if (combatant.kind === "character") return "PC";
  return isAllyCombatant(combatant) ? "Ally" : "Enemy";
}

function slugifyClassName(name) {
  return `${name || ""}`.trim().toLowerCase().replace(/\s+/g, "-");
}

function combatantIconSrc(combatant) {
  if (combatant.kind === "character") {
    return `/icons/classes/${slugifyClassName(combatant.character_class)}.png`;
  }
  return isAllyCombatant(combatant)
    ? "/icons/npc.png"
    : "/icons/enemy.png";
}

function combatantIconFallbackSrc(combatant) {
  if (combatant.kind === "character") return "/icons/pc.svg";
  return isAllyCombatant(combatant)
    ? "/icons/npc.svg"
    : "/icons/enemy.svg";
}

function combatantTokenIconSrc(combatant) {
  if (combatant.kind === "character" && combatant.claimed_profile_image_data) {
    return combatant.claimed_profile_image_data;
  }
  if (combatant.kind === "enemy" && combatant.monster_token_image_data) {
    return combatant.monster_token_image_data;
  }
  return combatantIconSrc(combatant);
}

function combatantUsesPortraitToken(combatant) {
  if (combatant.kind === "character" && combatant.claimed_profile_image_data) return true;
  if (combatant.kind === "enemy" && combatant.monster_token_image_data) return true;
  return false;
}

function createCombatantNameElement(combatant) {
  const wrapper = document.createElement("span");
  wrapper.className = "combatant-name";

  const icon = document.createElement("img");
  icon.className = "combatant-icon";
  icon.alt = combatantKindLabel(combatant);
  if (combatantUsesPortraitToken(combatant)) {
    icon.classList.add("token-portrait");
  }
  const fallbackSrc = combatantIconFallbackSrc(combatant);
  icon.src = combatantTokenIconSrc(combatant);
  icon.addEventListener("error", () => {
    if (!icon.src.endsWith(fallbackSrc)) {
      icon.src = fallbackSrc;
    }
  });
  wrapper.appendChild(icon);

  const text = document.createElement("span");
  const isHiddenForPlayers = combatant.kind !== "character" && Number(combatant.player_visible) === 0;
  text.textContent = isHiddenForPlayers ? `(${combatant.name})` : combatant.name;
  wrapper.appendChild(text);

  return wrapper;
}

function normalizePathname(pathname) {
  if (!pathname) return "/";
  const cleaned = pathname.replace(/\/+$/, "");
  return cleaned === "" ? "/" : cleaned;
}

function playerAvatarFallbackSrc(username = "") {
  const classSlugs = [
    "artificer",
    "barbarian",
    "bard",
    "cleric",
    "druid",
    "fighter",
    "monk",
    "paladin",
    "rogue",
    "sorcerer",
    "warlock",
    "wizard"
  ];
  let hash = 0;
  for (let i = 0; i < username.length; i += 1) {
    hash = (hash * 31 + username.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % classSlugs.length;
  return `/icons/classes/${classSlugs[index]}.png`;
}

function parseRoute(pathname) {
  const path = normalizePathname(pathname);
  if (path === "/login") return { page: "login" };
  if (path === "/settings") return { page: "settings" };
  if (path === "/player" || path === "/player/initiative") {
    return { page: "player-home", playerMode: "initiative" };
  }
  if (path === "/player/map") return { page: "player-home", playerMode: "map" };
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

  match = path.match(/^\/campaigns\/(\d+)\/scenarios\/(\d+)\/(edit|initiative|map|run)$/);
  if (match) {
    const mode = match[3];
    return {
      page:
        mode === "initiative" || mode === "run"
          ? "scenario-run"
          : mode === "map"
            ? "scenario-map"
            : "scenario-edit",
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

function routePathFor(page, campaignId = null, scenarioId = null, playerMode = null) {
  if (page === "login") return "/login";
  if (page === "player-home") {
    return playerMode === "map" ? "/player/map" : "/player/initiative";
  }
  if (page === "settings") return "/settings";
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
    (
      page === "scenario-edit" ||
      page === "scenario-run" ||
      page === "scenario-map" ||
      page === "scenario-completed-edit"
    ) &&
    Number.isInteger(campaignId) &&
    Number.isInteger(scenarioId)
  ) {
    if (page === "scenario-completed-edit") {
      return `/campaigns/${campaignId}/scenarios/${scenarioId}/completed/edit`;
    }
    const mode = page === "scenario-run" ? "initiative" : page === "scenario-map" ? "map" : "edit";
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
      setStatus(error.message, "error");
    }
    if (!isCurrent()) return;
    showPage("monsters");
    await syncHistory("/library", { replace });
    return;
  }

  if (route.page === "settings") {
    try {
      await loadUserSettings();
      renderSettingsPage();
    } catch (error) {
      setStatus(error.message, "error");
    }
    if (!isCurrent()) return;
    showPage("settings");
    await syncHistory("/settings", { replace });
    return;
  }

  if (route.page === "player-home") {
    state.playerLiveViewMode = route.playerMode === "map" ? "map" : "initiative";
    try {
      await loadPlayerLive();
    } catch (error) {
      setStatus(error.message, "error");
    }
    if (!isCurrent()) return;
    startPlayerLivePolling();
    showPage("player-home");
    await syncHistory(routePathFor("player-home", null, null, state.playerLiveViewMode), { replace });
    return;
  }

  if (route.page === "analytics") {
    if (state.authUser?.role !== "admin") {
      await safeNavigate("/", "Analytics access denied.");
      return;
    }
    try {
      await loadCampaigns();
      if (
        !Number.isInteger(state.analyticsSelectedCampaignId) ||
        !state.campaigns.some((campaign) => campaign.id === state.analyticsSelectedCampaignId)
      ) {
        state.analyticsSelectedCampaignId = state.campaigns[0]?.id ?? null;
      }
      if (Number.isInteger(state.analyticsSelectedCampaignId)) {
        await setAnalyticsCampaign(state.analyticsSelectedCampaignId);
      } else {
        renderAnalyticsPage();
      }
    } catch (error) {
      setStatus(error.message, "error");
    }
    if (!isCurrent()) return;
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
      setStatus(error.message, "error");
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
        setStatus(error.message, "error");
      }
      if (!isCurrent()) return;
      startPlayerLivePolling();
      showPage("player-home");
      state.playerLiveViewMode = "initiative";
      await syncHistory("/player/initiative", { replace });
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
      setStatus(error.message, "error");
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
    setStatus(error.message, "error");
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
  if (route.page === "scenario-run" || route.page === "scenario-map") {
    showPage(route.page);
    focusPreviewOnActiveNonPc();
    renderScenarioRunPage();
  } else if (route.page === "scenario-completed-edit") {
    showPage("scenario-completed-edit");
    renderScenarioCompletedEditPage();
  } else {
    showPage("scenario-edit");
    renderScenarioEditPage();
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
  if (page !== "scenario-map") {
    stopRunMapSyncPolling();
  }
  document.body.classList.toggle("page-login", page === "login");
  document.body.classList.toggle("page-player", page === "player-home");
  document.body.classList.toggle("page-run", page === "scenario-run" || page === "scenario-map");
  els.pageLogin.classList.toggle("hidden", page !== "login");
  els.loginPageLogo.classList.toggle("hidden", page !== "login");
  const hideTopNav = page === "login" || (state.authUser?.role !== "admin");
  els.topNav.classList.toggle("hidden", hideTopNav);
  els.pageWelcome.classList.toggle("hidden", page !== "welcome");
  els.pagePlayerHome.classList.toggle("hidden", page !== "player-home");
  els.pageSettings.classList.toggle("hidden", page !== "settings");
  els.pageMonsters.classList.toggle("hidden", page !== "monsters");
  els.pageAnalytics.classList.toggle("hidden", page !== "analytics");
  els.pageAdmin.classList.toggle("hidden", page !== "admin");
  els.pageCampaign.classList.toggle("hidden", page !== "campaign");
  els.pageCampaignCompleted.classList.toggle("hidden", page !== "campaign-completed");
  els.pageScenarioEdit.classList.toggle("hidden", page !== "scenario-edit");
  els.pageScenarioCompletedEdit.classList.toggle("hidden", page !== "scenario-completed-edit");
  els.pageScenarioRun.classList.toggle("hidden", !(page === "scenario-run" || page === "scenario-map"));
  renderMainSections();
  renderNav();
}

function renderMainSections() {
  const isAuthed = Boolean(state.authUser);
  const isPlayer = isAuthed && state.authUser?.role !== "admin";
  els.mainHomeBtn.classList.toggle("hidden", !isAuthed || isPlayer);
  els.mainPlayerInitiativeBtn.classList.toggle("hidden", !isPlayer);
  els.mainPlayerMapBtn.classList.toggle("hidden", !isPlayer);
  els.userMenu.classList.toggle("hidden", !isAuthed);
  const showLibrary = isAuthed && state.authUser?.role === "admin";
  const showAnalytics = isAuthed && state.authUser?.role === "admin";
  els.mainMonstersBtn.classList.toggle("hidden", !showLibrary);
  els.mainAnalyticsBtn.classList.toggle("hidden", !showAnalytics);
  if (!isAuthed) return;

  els.userMenuNameText.textContent = state.authUser?.username || "";
  els.userMenuAvatar.classList.remove("hidden");
  const avatarSrc = state.authUser?.profileImageData
    ? state.authUser.profileImageData
    : playerAvatarFallbackSrc(state.authUser?.username || "");
  els.userMenuAvatar.src = avatarSrc;
  els.userMenuAdminBtn.classList.toggle("hidden", state.authUser?.role !== "admin");

  const inHome =
    state.page === "welcome" ||
    state.page === "player-home" ||
    state.page === "campaign" ||
    state.page === "campaign-completed" ||
    state.page === "scenario-edit" ||
    state.page === "scenario-completed-edit" ||
    state.page === "scenario-run" ||
    state.page === "scenario-map";
  els.mainHomeBtn.classList.toggle("active", inHome);
  const inPlayerHome = state.page === "player-home";
  els.mainPlayerInitiativeBtn.classList.toggle(
    "active",
    inPlayerHome && state.playerLiveViewMode !== "map"
  );
  els.mainPlayerMapBtn.classList.toggle(
    "active",
    inPlayerHome && state.playerLiveViewMode === "map"
  );
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
    state.page === "scenario-run" ||
    state.page === "scenario-map";

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
      state.page === "scenario-run" ||
      state.page === "scenario-map"
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
    (state.page === "scenario-edit" || state.page === "scenario-run" || state.page === "scenario-map");
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
      state.page === "scenario-map" ||
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
    const summary = state.campaignSummaries[campaign.id] || {
      players: [],
      scenarioCount: 0,
      totalEncounters: 0,
      totalFinishedEncounters: 0,
      totalEnemyDamage: 0,
      totalEnemyDefeats: 0
    };
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
  state.draftMonsterTokenImageData = "";
  setMonsterPasteTarget("statblock");
  els.monsterForm.reset();
  els.monsterSize.value = "normal";
  els.monsterIsLegendary.value = "false";
  const defaultLegendary = document.querySelector(
    'input[name="monsterLegendaryActionsCount"][value="3"]'
  );
  if (defaultLegendary) defaultLegendary.checked = true;
  updateMonsterLegendaryFieldsVisibility();
  setMonsterImagePreview("");
  setMonsterTokenImagePreview("");
  els.monsterImageFile.value = "";
  els.monsterTokenImageFile.value = "";
  renderMonsterReadonlyView();
  renderMonsterList();
}

function fillMonsterForm(monster) {
  els.monsterName.value = monster.name;
  const sizeValue = `${monster.size || "normal"}`.trim().toLowerCase();
  els.monsterSize.value = ["normal", "large", "huge", "gargantuan"].includes(sizeValue)
    ? sizeValue
    : "normal";
  els.monsterIsLegendary.value = monster.is_legendary ? "true" : "false";
  const currentLegendary = document.querySelector(
    `input[name="monsterLegendaryActionsCount"][value="${monster.legendary_actions_count || 3}"]`
  );
  if (currentLegendary) currentLegendary.checked = true;
  updateMonsterLegendaryFieldsVisibility();
  state.draftMonsterImageData = monster.monster_image_data || "";
  state.draftMonsterTokenImageData = monster.token_image_data || "";
  setMonsterPasteTarget("statblock");
  setMonsterImagePreview(state.draftMonsterImageData);
  setMonsterTokenImagePreview(state.draftMonsterTokenImageData);
  els.monsterImageFile.value = "";
  els.monsterTokenImageFile.value = "";
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
    size: els.monsterSize.value,
    isLegendary,
    legendaryActionsCount,
    monsterImageData: state.draftMonsterImageData || "",
    tokenImageData: state.draftMonsterTokenImageData || ""
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
    const avatar = document.createElement("img");
    avatar.className = "monster-list-avatar";
    const fallbackSrc = "/icons/enemy.svg";
    avatar.src = monster.token_image_data || "/icons/enemy.png";
    avatar.alt = `${monster.name} token`;
    avatar.addEventListener("error", () => {
      if (!avatar.src.endsWith(fallbackSrc)) avatar.src = fallbackSrc;
    });
    label.appendChild(avatar);

    const nameText = document.createElement("span");
    nameText.textContent = monster.name;
    label.appendChild(nameText);

    const isLegendary = Boolean(monster.is_legendary);
    const legendaryCount = Number(monster.legendary_actions_count);
    if (isLegendary) {
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

function renderEnemyMonsterOptions(searchQuery = "") {
  const query = (searchQuery || "").trim().toLowerCase();
  const filtered = query
    ? state.monsters.filter((monster) => monster.name.toLowerCase().includes(query))
    : state.monsters;
  const limited = filtered.slice(0, 5);
  els.enemyMonsterResults.innerHTML = "";

  if (limited.length === 0) {
    state.addCombatantSelectedMonsterId = null;
    setEnemyMonsterPreview("");
    const empty = document.createElement("li");
    empty.className = "hint";
    empty.textContent = "No library matches.";
    els.enemyMonsterResults.appendChild(empty);
    return;
  }

  if (limited.length === 1) {
    state.addCombatantSelectedMonsterId = limited[0].id;
    setEnemyMonsterPreview(limited[0].monster_image_data || "");
    els.enemyName.value = limited[0].name;
    if (!els.enemyHp.value.trim()) {
      const hpMatch = /\d+/.exec(limited[0].hit_points || "");
      if (hpMatch) els.enemyHp.value = hpMatch[0];
    }
  } else if (
    state.addCombatantSelectedMonsterId
    && !limited.some((monster) => monster.id === state.addCombatantSelectedMonsterId)
  ) {
    state.addCombatantSelectedMonsterId = null;
    setEnemyMonsterPreview("");
  }

  for (const monster of limited) {
    const li = document.createElement("li");
    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-combatant-library-item";
    if (state.addCombatantSelectedMonsterId === monster.id) {
      button.classList.add("active");
    }
    button.textContent = monster.name;
    button.addEventListener("click", () => {
      state.addCombatantSelectedMonsterId = monster.id;
      setEnemyMonsterPreview(monster.monster_image_data || "");
      els.enemyName.value = monster.name;
      if (!els.enemyHp.value.trim()) {
        const hpMatch = /\d+/.exec(monster.hit_points || "");
        if (hpMatch) els.enemyHp.value = hpMatch[0];
      }
      renderEnemyMonsterOptions(els.enemyMonsterSearchInput.value);
    });
    li.appendChild(button);
    els.enemyMonsterResults.appendChild(li);
  }
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
        setStatus(`Deleted character: ${character.name}`, "success");
      } catch (error) {
        setStatus(error.message, "error");
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
    label.className = "scenario-label";
    const nameText = document.createElement("span");
    nameText.textContent = scenario.name;
    if (state.campaignLiveScenarioId === scenario.id) {
      const sharedDot = document.createElement("span");
      sharedDot.className = "scenario-shared-dot";
      sharedDot.title = "Shared with players";
      label.appendChild(sharedDot);
    }
    label.appendChild(nameText);
    row.appendChild(label);

    const actions = document.createElement("div");
    actions.className = "row-actions";

    const mapButton = document.createElement("button");
    mapButton.type = "button";
    mapButton.className = "encounter-action-btn";
    mapButton.title = "Map";
    mapButton.setAttribute("aria-label", "Map");
    mapButton.innerHTML = '<span class="encounter-action-icon encounter-action-icon-map" aria-hidden="true"></span>';
    mapButton.addEventListener("click", async () => {
      await navigateToPage("scenario-map", {
        campaignId: state.selectedCampaignId,
        scenarioId: scenario.id
      });
    });
    actions.appendChild(mapButton);

    const runButton = document.createElement("button");
    runButton.type = "button";
    runButton.className = "encounter-action-btn";
    runButton.title = "Initiative";
    runButton.setAttribute("aria-label", "Initiative");
    runButton.innerHTML = '<span class="encounter-action-icon encounter-action-icon-initiative" aria-hidden="true"></span>';
    runButton.addEventListener("click", async () => {
      await navigateToPage("scenario-run", {
        campaignId: state.selectedCampaignId,
        scenarioId: scenario.id
      });
    });
    actions.appendChild(runButton);

    const editButton = document.createElement("button");
    editButton.type = "button";
    editButton.className = "encounter-action-btn";
    editButton.title = "Edit";
    editButton.setAttribute("aria-label", "Edit");
    editButton.innerHTML = '<span class="encounter-action-icon encounter-action-icon-edit" aria-hidden="true"></span>';
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
        setStatus(`Deleted scenario: ${scenario.name}`, "success");
      } catch (error) {
        setStatus(error.message, "error");
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
        setStatus(`Reopened scenario: ${scenario.name}`, "success");
      } catch (error) {
        setStatus(error.message, "error");
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
        setStatus(`Deleted scenario: ${scenario.name}`, "success");
      } catch (error) {
        setStatus(error.message, "error");
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
      if (state.page === "scenario-run" || state.page === "scenario-map") renderScenarioRunPage();
    } catch (error) {
      setStatus(error.message, "error");
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
      if (state.page === "scenario-run" || state.page === "scenario-map") renderScenarioRunPage();
    } catch (error) {
      setStatus(error.message, "error");
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
  if (state.page === "scenario-run" || state.page === "scenario-map") renderScenarioRunPage();
}

function setMapHoverCombatantRow(combatantId, isPlayerView, on) {
  if (isPlayerView) {
    state.playerMap.hoverCombatantId = on && Number.isInteger(combatantId) ? combatantId : null;
  } else {
    state.runMap.hoverCombatantId = on && Number.isInteger(combatantId) ? combatantId : null;
  }
  const list = isPlayerView ? els.playerLiveCombatantList : els.runOrderList;
  if (!(list instanceof HTMLElement) || !Number.isInteger(combatantId)) return;
  const row = list.querySelector(`li[data-combatant-id="${combatantId}"]`);
  if (!(row instanceof HTMLElement)) return;
  row.classList.toggle("map-token-hover-linked", Boolean(on));
}

function focusPreviewOnActiveNonPc() {
  const active = state.combat.combatants.find((c) => c.id === state.combat.activeCombatantId);
  if (active && active.kind === "enemy") {
    state.runPreviewEnemyId = active.id;
  }
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function combatantTokenSizeScale(combatant) {
  const size = `${combatant?.monster_size || "normal"}`.trim().toLowerCase();
  if (size === "large") return 2;
  if (size === "huge") return 3;
  if (size === "gargantuan") return 4;
  return 1;
}

function mapNaturalSize() {
  const image = els.runMapImage;
  if (!image || !image.naturalWidth || !image.naturalHeight) {
    return { width: 1200, height: 800 };
  }
  return { width: image.naturalWidth, height: image.naturalHeight };
}

function getScenarioTokenPositions(scenarioId) {
  if (!state.runMap.tokensByScenario[scenarioId]) {
    state.runMap.tokensByScenario[scenarioId] = {};
  }
  return state.runMap.tokensByScenario[scenarioId];
}

function scenarioMapTokenSize(scenario) {
  const raw = Number(scenario?.map_token_size);
  if (!Number.isFinite(raw)) return 44;
  return clamp(Math.round(raw), 24, 128);
}

function setRunMapTokenSizeUI(size) {
  const finalSize = clamp(Math.round(Number(size) || 44), 24, 128);
  if (els.runMapTokenSizeInput) els.runMapTokenSizeInput.value = String(finalSize);
  if (els.runMapTokenSizeNumber) els.runMapTokenSizeNumber.value = String(finalSize);
  if (els.runMapViewport) els.runMapViewport.style.setProperty("--map-token-size", `${finalSize}px`);
}

function setPlayerMapTokenSize(size) {
  const finalSize = clamp(Math.round(Number(size) || 44), 24, 128);
  if (els.playerMapViewport) els.playerMapViewport.style.setProperty("--map-token-size", `${finalSize}px`);
}

function scenarioMapFogData(scenario) {
  return `${scenario?.map_fog_data || ""}`.trim();
}

function loadRunMapFogBrushSizeFromSession() {
  try {
    const raw = window.sessionStorage.getItem(RUN_MAP_FOG_BRUSH_SESSION_KEY);
    if (raw == null) return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    return clamp(Math.round(parsed), 12, 220);
  } catch (_error) {
    return null;
  }
}

function saveRunMapFogBrushSizeToSession(size) {
  try {
    window.sessionStorage.setItem(RUN_MAP_FOG_BRUSH_SESSION_KEY, String(size));
  } catch (_error) {
    // Ignore storage failures (private mode, quota, blocked storage).
  }
}

function loadRunMapFogBrushShapeFromSession() {
  try {
    const raw = window.sessionStorage.getItem(RUN_MAP_FOG_BRUSH_SHAPE_SESSION_KEY);
    if (raw === "square") return "square";
    if (raw === "round") return "round";
    return null;
  } catch (_error) {
    return null;
  }
}

function saveRunMapFogBrushShapeToSession(shape) {
  try {
    window.sessionStorage.setItem(
      RUN_MAP_FOG_BRUSH_SHAPE_SESSION_KEY,
      shape === "square" ? "square" : "round"
    );
  } catch (_error) {
    // Ignore storage failures (private mode, quota, blocked storage).
  }
}

function setRunMapFogBrushSizeUi(size) {
  const finalSize = clamp(Math.round(Number(size) || 56), 12, 220);
  state.runMap.fogBrushSize = finalSize;
  if (els.runMapFogBrushSizeInput) {
    els.runMapFogBrushSizeInput.value = String(finalSize);
  }
  if (els.runMapFogBrushSizeNumber) {
    els.runMapFogBrushSizeNumber.value = String(finalSize);
  }
}

function setRunMapFogBrushShapeUi(shape) {
  const finalShape = shape === "square" ? "square" : "round";
  state.runMap.fogBrushShape = finalShape;
  if (els.runMapFogBrushShapeRound) {
    els.runMapFogBrushShapeRound.checked = finalShape === "round";
  }
  if (els.runMapFogBrushShapeSquare) {
    els.runMapFogBrushShapeSquare.checked = finalShape === "square";
  }
  if (els.runMapFogCursorPreview) {
    els.runMapFogCursorPreview.classList.toggle("is-square", finalShape === "square");
  }
}

function parseRoundedNumberOrNull(value) {
  const raw = `${value ?? ""}`.trim();
  if (!raw) return null;
  const parsed = Number(raw);
  if (!Number.isFinite(parsed)) return null;
  return Math.round(parsed);
}

function runMapCurrentTotalScale() {
  if (!els.runMapViewport || !els.runMapImage) return null;
  if (!els.runMapImage.naturalWidth || !els.runMapImage.naturalHeight) return null;
  const viewportWidth = els.runMapViewport.clientWidth;
  const viewportHeight = els.runMapViewport.clientHeight;
  if (viewportWidth <= 0 || viewportHeight <= 0) return null;
  const baseScale = Math.min(
    viewportWidth / els.runMapImage.naturalWidth,
    viewportHeight / els.runMapImage.naturalHeight
  );
  const totalScale = baseScale * state.runMap.zoom;
  if (!Number.isFinite(totalScale) || totalScale <= 0) return null;
  return totalScale;
}

function hideRunMapFogCursorPreview() {
  if (!els.runMapFogCursorPreview) return;
  els.runMapFogCursorPreview.classList.add("hidden");
}

function updateRunMapFogCursorPreview(clientX, clientY, eventTarget = null) {
  if (!els.runMapViewport || !els.runMapFogCursorPreview) return;
  if (state.page !== "scenario-map" || state.runMap.fogMode === "navigate") {
    hideRunMapFogCursorPreview();
    return;
  }
  if (els.runMapImage.classList.contains("hidden")) {
    hideRunMapFogCursorPreview();
    return;
  }
  if (
    eventTarget instanceof Element &&
    eventTarget.closest(".map-touch-controls, .map-fog-brush-controls")
  ) {
    hideRunMapFogCursorPreview();
    return;
  }
  const rect = els.runMapViewport.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
    hideRunMapFogCursorPreview();
    return;
  }
  const totalScale = runMapCurrentTotalScale();
  if (!totalScale) {
    hideRunMapFogCursorPreview();
    return;
  }
  const radius = clamp((Number(state.runMap.fogBrushSize) || 56) * totalScale, 6, 520);
  const diameter = radius * 2;
  const preview = els.runMapFogCursorPreview;
  preview.classList.toggle("is-square", state.runMap.fogBrushShape === "square");
  preview.style.left = `${x}px`;
  preview.style.top = `${y}px`;
  preview.style.width = `${diameter}px`;
  preview.style.height = `${diameter}px`;
  preview.dataset.clientX = String(clientX);
  preview.dataset.clientY = String(clientY);
  preview.classList.remove("hidden");
}

function setRunMapFogMode(mode) {
  const nextMode = mode === "paint" || mode === "erase" ? mode : "navigate";
  state.runMap.fogMode = nextMode;
  if (els.runMapFogPaintBtn) {
    const active = nextMode === "paint";
    els.runMapFogPaintBtn.setAttribute("aria-pressed", active ? "true" : "false");
  }
  if (els.runMapFogEraseBtn) {
    const active = nextMode === "erase";
    els.runMapFogEraseBtn.setAttribute("aria-pressed", active ? "true" : "false");
  }
  if (els.runMapViewport) {
    els.runMapViewport.classList.toggle("fog-paint-mode", nextMode !== "navigate");
  }
  if (els.runMapFogBrushControls) {
    els.runMapFogBrushControls.classList.toggle("hidden", nextMode === "navigate");
  }
  if (nextMode === "navigate") {
    hideRunMapFogCursorPreview();
  }
}

function setPlayerMapFogOverlay(fogData) {
  if (!els.playerMapFogImage || !els.playerMapScene) return;
  const scene = els.playerMapScene;
  const applyMask = (maskDataUrl) => {
    const maskUrl = maskDataUrl ? `url("${maskDataUrl}")` : "";
    scene.style.webkitMaskImage = maskUrl;
    scene.style.maskImage = maskUrl;
    scene.style.webkitMaskRepeat = "no-repeat";
    scene.style.maskRepeat = "no-repeat";
    scene.style.webkitMaskPosition = "top left";
    scene.style.maskPosition = "top left";
    scene.style.webkitMaskSize = "auto";
    scene.style.maskSize = "auto";
  };

  const buildVisibilityMask = (fogImageData) =>
    new Promise((resolve) => {
      const source = new Image();
      source.onload = () => {
        const width = Math.max(1, source.naturalWidth || source.width || 1);
        const height = Math.max(1, source.naturalHeight || source.height || 1);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) {
          resolve("");
          return;
        }
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(source, 0, 0, width, height);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const fogAlpha = data[i + 3];
          data[i] = 255;
          data[i + 1] = 255;
          data[i + 2] = 255;
          data[i + 3] = 255 - fogAlpha;
        }
        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      source.onerror = () => resolve("");
      source.src = fogImageData;
    });

  const raw = `${fogData || ""}`.trim();
  els.playerMapFogImage.classList.remove("hidden");
  els.playerMapFogImage.src = "";
  els.playerMapFogImage.classList.add("hidden");
  const requestId = (state.playerMap.fogMaskRequestId || 0) + 1;
  state.playerMap.fogMaskRequestId = requestId;
  if (!raw) {
    applyMask("");
    return;
  }
  const cached = state.playerMap.fogMaskByFogData[raw];
  if (cached) {
    applyMask(cached);
    return;
  }
  buildVisibilityMask(raw).then((maskDataUrl) => {
    if (state.playerMap.fogMaskRequestId !== requestId) return;
    if (!maskDataUrl) {
      applyMask("");
      return;
    }
    state.playerMap.fogMaskByFogData[raw] = maskDataUrl;
    applyMask(maskDataUrl);
  });
}

function ensureRunMapFogCanvasSize() {
  const canvas = els.runMapFogCanvas;
  const image = els.runMapImage;
  if (!(canvas instanceof HTMLCanvasElement) || !image) return false;
  if (!image.naturalWidth || !image.naturalHeight) return false;
  if (canvas.width !== image.naturalWidth || canvas.height !== image.naturalHeight) {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
  }
  return true;
}

function clearRunMapFogCanvas() {
  const canvas = els.runMapFogCanvas;
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawFogDataToRunMapCanvas(fogData) {
  if (!ensureRunMapFogCanvasSize()) return;
  clearRunMapFogCanvas();
  const raw = `${fogData || ""}`.trim();
  if (!raw) return;
  const image = new Image();
  image.onload = () => {
    const canvas = els.runMapFogCanvas;
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
  image.src = raw;
}

function ensureRunMapFogCanvasFromScenario(scenario) {
  if (!scenario || !Number.isInteger(scenario.id)) return;
  if (!ensureRunMapFogCanvasSize()) return;
  const fogData = scenarioMapFogData(scenario);
  state.runMap.fogDataByScenario[scenario.id] = fogData;
  const key = `${scenario.id}:${fogData}`;
  if (
    state.runMap.fogCanvasLoadedScenarioId === scenario.id &&
    state.runMap.fogCanvasLoadedKey === key
  ) {
    return;
  }
  state.runMap.fogCanvasLoadedScenarioId = scenario.id;
  state.runMap.fogCanvasLoadedKey = key;
  drawFogDataToRunMapCanvas(fogData);
}

function runMapPointerToImageCoords(event) {
  if (!els.runMapViewport || !els.runMapImage) return null;
  if (!els.runMapImage.naturalWidth || !els.runMapImage.naturalHeight) return null;
  const rect = els.runMapViewport.getBoundingClientRect();
  const pointerX = event.clientX - rect.left;
  const pointerY = event.clientY - rect.top;
  const totalScale = runMapCurrentTotalScale();
  if (!totalScale) return null;
  const imageX = (pointerX - state.runMap.panX) / totalScale;
  const imageY = (pointerY - state.runMap.panY) / totalScale;
  return {
    x: clamp(imageX, 0, els.runMapImage.naturalWidth),
    y: clamp(imageY, 0, els.runMapImage.naturalHeight)
  };
}

function paintRunMapFogAt(x, y, mode = "paint") {
  const canvas = els.runMapFogCanvas;
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const radius = Math.max(12, Math.min(220, Number(state.runMap.fogBrushSize) || 56));
  const square = state.runMap.fogBrushShape === "square";
  ctx.save();
  ctx.beginPath();
  if (square) {
    const size = radius * 2;
    ctx.rect(x - radius, y - radius, size, size);
  } else {
    ctx.arc(x, y, radius, 0, Math.PI * 2);
  }
  if (mode === "erase") {
    ctx.globalCompositeOperation = "destination-out";
    ctx.fill();
  } else {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "rgba(10, 14, 20, 0.92)";
    ctx.fill();
  }
  ctx.restore();
}

function serializeRunMapFogCanvas() {
  const canvas = els.runMapFogCanvas;
  if (!(canvas instanceof HTMLCanvasElement) || canvas.width <= 0 || canvas.height <= 0) return "";
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  let hasFog = false;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 8) {
      hasFog = true;
      break;
    }
  }
  if (!hasFog) return "";
  return canvas.toDataURL("image/png");
}

function setRunMapDragLockUi(locked) {
  state.runMap.dragLocked = Boolean(locked);
  if (els.runMapViewport) {
    els.runMapViewport.classList.toggle("drag-locked", state.runMap.dragLocked);
  }
  if (els.runMapDragLockBtn) {
    els.runMapDragLockBtn.setAttribute("aria-pressed", state.runMap.dragLocked ? "true" : "false");
    els.runMapDragLockBtn.setAttribute(
      "aria-label",
      state.runMap.dragLocked ? "Unlock map dragging" : "Lock map dragging"
    );
    els.runMapDragLockBtn.title = state.runMap.dragLocked ? "Unlock Dragging" : "Lock Dragging";
  }
}

function setPlayerMapDragLockUi(locked) {
  state.playerMap.dragLocked = Boolean(locked);
  if (els.playerMapViewport) {
    els.playerMapViewport.classList.toggle("drag-locked", state.playerMap.dragLocked);
  }
  if (els.playerMapDragLockBtn) {
    els.playerMapDragLockBtn.setAttribute("aria-pressed", state.playerMap.dragLocked ? "true" : "false");
    els.playerMapDragLockBtn.setAttribute(
      "aria-label",
      state.playerMap.dragLocked ? "Unlock map dragging" : "Lock map dragging"
    );
    els.playerMapDragLockBtn.title = state.playerMap.dragLocked ? "Unlock Dragging" : "Lock Dragging";
  }
}

function clearMapViewSelectionsOnEsc() {
  let changed = false;

  const onDmMapView = state.page === "scenario-map";
  const onPlayerMapView = state.page === "player-home" && state.playerLiveViewMode === "map";
  if (!onDmMapView && !onPlayerMapView) return false;

  hideConditionTooltip();
  hideMapStatblockHover();

  if (onDmMapView) {
    if (Number.isInteger(state.runMap.hoverCombatantId)) {
      setMapHoverCombatantRow(state.runMap.hoverCombatantId, false, false);
      changed = true;
    }
    if (state.runMap.fogMode !== "navigate") {
      setRunMapFogMode("navigate");
      changed = true;
    }
    if (state.runMap.dragLocked) {
      setRunMapDragLockUi(false);
      changed = true;
    }
    if (state.runMap.dragging || state.runMap.fogPainting) {
      changed = true;
    }
    if (els.runMapViewport && Number.isInteger(state.runMap.pointerId)) {
      try {
        if (els.runMapViewport.hasPointerCapture(state.runMap.pointerId)) {
          els.runMapViewport.releasePointerCapture(state.runMap.pointerId);
        }
      } catch (_error) {}
    }
    if (els.runMapViewport && Number.isInteger(state.runMap.fogPointerId)) {
      try {
        if (els.runMapViewport.hasPointerCapture(state.runMap.fogPointerId)) {
          els.runMapViewport.releasePointerCapture(state.runMap.fogPointerId);
        }
      } catch (_error) {}
    }
    state.runMap.dragging = false;
    state.runMap.dragMode = "map";
    state.runMap.dragCombatantId = null;
    state.runMap.pointerId = null;
    state.runMap.fogPainting = false;
    state.runMap.fogPointerId = null;
    els.runMapViewport?.classList.remove("is-dragging");
    els.runMapTokens?.querySelectorAll(".run-map-token.is-dragging").forEach((token) => {
      token.classList.remove("is-dragging");
    });
  }

  if (onPlayerMapView) {
    if (Number.isInteger(state.playerMap.hoverCombatantId)) {
      setMapHoverCombatantRow(state.playerMap.hoverCombatantId, true, false);
      changed = true;
    }
    if (state.playerMap.dragLocked) {
      setPlayerMapDragLockUi(false);
      changed = true;
    }
    if (state.playerMap.dragging) {
      changed = true;
    }
    if (els.playerMapViewport && Number.isInteger(state.playerMap.pointerId)) {
      try {
        if (els.playerMapViewport.hasPointerCapture(state.playerMap.pointerId)) {
          els.playerMapViewport.releasePointerCapture(state.playerMap.pointerId);
        }
      } catch (_error) {}
    }
    state.playerMap.dragging = false;
    state.playerMap.dragMode = "map";
    state.playerMap.dragCombatantId = null;
    state.playerMap.pointerId = null;
    els.playerMapViewport?.classList.remove("is-dragging");
    els.playerMapTokens?.querySelectorAll(".player-map-token.is-dragging").forEach((token) => {
      token.classList.remove("is-dragging");
    });
  }

  return changed;
}

function zoomRunMapAtPointer(factor, pointerX = null, pointerY = null) {
  if (!els.runMapViewport || !els.runMapImage || els.runMapImage.classList.contains("hidden")) return;
  if (!els.runMapImage.naturalWidth || !els.runMapImage.naturalHeight) return;
  const viewportWidth = els.runMapViewport.clientWidth;
  const viewportHeight = els.runMapViewport.clientHeight;
  if (viewportWidth <= 0 || viewportHeight <= 0) return;
  const focusX = Number.isFinite(pointerX) ? pointerX : viewportWidth / 2;
  const focusY = Number.isFinite(pointerY) ? pointerY : viewportHeight / 2;
  const baseScale = Math.min(
    viewportWidth / els.runMapImage.naturalWidth,
    viewportHeight / els.runMapImage.naturalHeight
  );
  const prevZoom = state.runMap.zoom;
  const nextZoom = clamp(prevZoom * factor, state.runMap.minZoom, state.runMap.maxZoom);
  if (Math.abs(nextZoom - prevZoom) < 0.001) return;
  const prevTotalScale = baseScale * prevZoom;
  const nextTotalScale = baseScale * nextZoom;
  const imageX = (focusX - state.runMap.panX) / prevTotalScale;
  const imageY = (focusY - state.runMap.panY) / prevTotalScale;
  state.runMap.zoom = nextZoom;
  state.runMap.panX = focusX - imageX * nextTotalScale;
  state.runMap.panY = focusY - imageY * nextTotalScale;
  applyRunMapTransform();
}

function zoomPlayerMapAtPointer(factor, pointerX = null, pointerY = null) {
  if (!els.playerMapViewport || !els.playerMapImage || els.playerMapImage.classList.contains("hidden")) return;
  if (!els.playerMapImage.naturalWidth || !els.playerMapImage.naturalHeight) return;
  const viewportWidth = els.playerMapViewport.clientWidth;
  const viewportHeight = els.playerMapViewport.clientHeight;
  if (viewportWidth <= 0 || viewportHeight <= 0) return;
  const focusX = Number.isFinite(pointerX) ? pointerX : viewportWidth / 2;
  const focusY = Number.isFinite(pointerY) ? pointerY : viewportHeight / 2;
  const baseScale = Math.min(
    viewportWidth / els.playerMapImage.naturalWidth,
    viewportHeight / els.playerMapImage.naturalHeight
  );
  const prevZoom = state.playerMap.zoom;
  const nextZoom = clamp(prevZoom * factor, state.playerMap.minZoom, state.playerMap.maxZoom);
  if (Math.abs(nextZoom - prevZoom) < 0.001) return;
  const prevTotalScale = baseScale * prevZoom;
  const nextTotalScale = baseScale * nextZoom;
  const imageX = (focusX - state.playerMap.panX) / prevTotalScale;
  const imageY = (focusY - state.playerMap.panY) / prevTotalScale;
  state.playerMap.zoom = nextZoom;
  state.playerMap.panX = focusX - imageX * nextTotalScale;
  state.playerMap.panY = focusY - imageY * nextTotalScale;
  applyPlayerMapTransform();
}

async function persistRunMapTokenSize(scenarioId, tokenSize) {
  try {
    const result = await api(`/api/scenarios/${scenarioId}/map-token-size`, {
      method: "POST",
      body: JSON.stringify({ tokenSize })
    });
    const saved = clamp(Math.round(Number(result?.mapTokenSize) || tokenSize), 24, 128);
    state.scenarios = state.scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? { ...scenario, map_token_size: saved }
        : scenario
    );
    setRunMapTokenSizeUI(saved);
  } catch (error) {
    setStatus(error.message, "error");
  }
}

function scheduleRunMapTokenSizeSave(scenarioId, tokenSize) {
  if (!Number.isInteger(scenarioId)) return;
  if (state.runMap.saveSizeTimer) clearTimeout(state.runMap.saveSizeTimer);
  state.runMap.saveSizeTimer = setTimeout(() => {
    state.runMap.saveSizeTimer = null;
    persistRunMapTokenSize(scenarioId, tokenSize);
  }, 180);
}

async function persistRunMapFog(scenarioId, fogData) {
  try {
    const result = await api(`/api/scenarios/${scenarioId}/map-fog`, {
      method: "POST",
      body: JSON.stringify({ fogData })
    });
    const saved = `${result?.mapFogData || ""}`;
    state.scenarios = state.scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? { ...scenario, map_fog_data: saved }
        : scenario
    );
    state.runMap.fogDataByScenario[scenarioId] = saved;
    if (state.selectedScenarioId === scenarioId) {
      const refreshed = selectedScenario();
      if (refreshed) {
        state.runMap.fogCanvasLoadedScenarioId = null;
        state.runMap.fogCanvasLoadedKey = null;
        ensureRunMapFogCanvasFromScenario(refreshed);
      }
    }
  } catch (error) {
    setStatus(error.message, "error");
  }
}

function scheduleRunMapFogSave(scenarioId, fogData) {
  if (!Number.isInteger(scenarioId)) return;
  if (state.runMap.saveFogTimer) clearTimeout(state.runMap.saveFogTimer);
  state.runMap.saveFogTimer = setTimeout(() => {
    state.runMap.saveFogTimer = null;
    persistRunMapFog(scenarioId, fogData);
  }, 220);
}

function hydrateRunMapTokensFromScenario(scenario) {
  if (!scenario || !Number.isInteger(scenario.id)) return;
  if (state.runMap.tokensByScenario[scenario.id]) return;

  const raw = `${scenario.map_tokens_json || ""}`.trim();
  if (!raw) {
    state.runMap.tokensByScenario[scenario.id] = {};
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      state.runMap.tokensByScenario[scenario.id] = {};
      return;
    }
    const normalized = {};
    for (const [key, value] of Object.entries(parsed)) {
      const combatantId = Number(key);
      const x = Number(value?.x);
      const y = Number(value?.y);
      if (!Number.isInteger(combatantId) || !Number.isFinite(x) || !Number.isFinite(y)) continue;
      normalized[combatantId] = { x, y };
    }
    state.runMap.tokensByScenario[scenario.id] = normalized;
  } catch (_error) {
    state.runMap.tokensByScenario[scenario.id] = {};
  }
}

async function persistRunMapTokens(scenarioId) {
  const positions = getScenarioTokenPositions(scenarioId);
  try {
    const result = await api(`/api/scenarios/${scenarioId}/map-tokens`, {
      method: "POST",
      body: JSON.stringify({ tokens: positions })
    });
    const mapTokensJson = `${result?.mapTokensJson || ""}`;
    state.scenarios = state.scenarios.map((scenario) =>
      scenario.id === scenarioId
        ? { ...scenario, map_tokens_json: mapTokensJson }
        : scenario
    );
  } catch (error) {
    setStatus(error.message, "error");
  }
}

function scheduleRunMapTokensSave(scenarioId) {
  if (!Number.isInteger(scenarioId)) return;
  if (state.runMap.saveTimer) clearTimeout(state.runMap.saveTimer);
  state.runMap.saveTimer = setTimeout(() => {
    state.runMap.saveTimer = null;
    persistRunMapTokens(scenarioId);
  }, 220);
}

function ensureMapTokensForCombatants(scenarioId, combatants) {
  const positions = getScenarioTokenPositions(scenarioId);
  const { width, height } = mapNaturalSize();
  let index = 0;
  for (const combatant of combatants) {
    const isHidden = combatant.kind !== "character" && Number(combatant.player_visible) === 0;
    if (isHidden) continue;
    const isEnemyDefeated =
      combatant.kind === "enemy" &&
      !isAllyCombatant(combatant) &&
      Number.isFinite(Number(combatant.hp)) &&
      Number(combatant.hp) <= 0;
    if (isEnemyDefeated) continue;
    if (!positions[combatant.id]) {
      const col = index % 8;
      const row = Math.floor(index / 8);
      positions[combatant.id] = {
        x: 72 + col * 78,
        y: 72 + row * 78
      };
    }
    positions[combatant.id].x = clamp(positions[combatant.id].x, 20, width - 20);
    positions[combatant.id].y = clamp(positions[combatant.id].y, 20, height - 20);
    index += 1;
  }
}

function fadeOutAndRemoveToken(token, container, durationMs = 240) {
  if (!(token instanceof HTMLElement)) return;
  if (!(container instanceof HTMLElement)) return;
  if (token.__fadeOutTimer) return;
  token.classList.add("token-fade-out");
  token.setAttribute("aria-hidden", "true");
  token.__fadeOutTimer = setTimeout(() => {
    token.__fadeOutTimer = null;
    if (token.parentElement === container) {
      token.remove();
    }
  }, durationMs);
}

function renderRunMapTokens(scenarioId, combatants) {
  if (!els.runMapTokens) return;
  const positions = getScenarioTokenPositions(scenarioId);
  const { width, height } = mapNaturalSize();
  ensureMapTokensForCombatants(scenarioId, combatants);
  const visibleCombatants = [];
  for (const combatant of combatants) {
    const isHidden = combatant.kind !== "character" && Number(combatant.player_visible) === 0;
    if (isHidden) continue;
    const isEnemyDefeated =
      combatant.kind === "enemy" &&
      !isAllyCombatant(combatant) &&
      Number.isFinite(Number(combatant.hp)) &&
      Number(combatant.hp) <= 0;
    if (isEnemyDefeated) continue;
    visibleCombatants.push(combatant);
  }

  const nextIds = new Set(visibleCombatants.map((combatant) => combatant.id));
  const existingTokens = new Map();
  els.runMapTokens
    .querySelectorAll(".run-map-token[data-combatant-id]")
    .forEach((token) => {
      const id = Number(token.dataset.combatantId);
      if (Number.isInteger(id)) existingTokens.set(id, token);
    });

  for (const [id, token] of existingTokens.entries()) {
    if (nextIds.has(id)) continue;
    fadeOutAndRemoveToken(token, els.runMapTokens, 240);
  }

  for (const combatant of visibleCombatants) {
    const pos = positions[combatant.id];
    if (!pos) continue;

    let token = existingTokens.get(combatant.id) || null;
    if (!token) {
      token = document.createElement("button");
      token.type = "button";
      token.dataset.combatantId = String(combatant.id);
      const icon = document.createElement("img");
      icon.className = "run-map-token-icon";
      token.appendChild(icon);
      const label = document.createElement("span");
      label.className = "run-map-token-name";
      token.appendChild(label);

      token.addEventListener("pointerdown", (event) => {
        if (state.page !== "scenario-map") return;
        if (state.runMap.fogMode !== "navigate") return;
        if (state.runMap.dragLocked) return;
        if (event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        const combatantId = Number(token.dataset.combatantId);
        if (!Number.isInteger(combatantId)) return;
        state.runMap.dragging = true;
        state.runMap.dragMode = "token";
        state.runMap.dragCombatantId = combatantId;
        state.runMap.pointerId = event.pointerId;
        state.runMap.lastClientX = event.clientX;
        state.runMap.lastClientY = event.clientY;
        if (els.runMapViewport) els.runMapViewport.setPointerCapture(event.pointerId);
        token.classList.add("is-dragging");
        if (els.runMapViewport) els.runMapViewport.classList.add("is-dragging");
      });

      token.addEventListener("mouseenter", () => {
        const combatantId = Number(token.dataset.combatantId);
        if (!Number.isInteger(combatantId)) return;
        setMapHoverCombatantRow(combatantId, false, true);
      });
      token.addEventListener("pointerenter", () => {
        const combatantId = Number(token.dataset.combatantId);
        if (!Number.isInteger(combatantId)) return;
        setMapHoverCombatantRow(combatantId, false, true);
      });
      token.addEventListener("mouseleave", () => {
        const combatantId = Number(token.dataset.combatantId);
        if (!Number.isInteger(combatantId)) return;
        setMapHoverCombatantRow(combatantId, false, false);
      });
      token.addEventListener("pointerleave", () => {
        const combatantId = Number(token.dataset.combatantId);
        if (!Number.isInteger(combatantId)) return;
        setMapHoverCombatantRow(combatantId, false, false);
      });

      token.addEventListener("dblclick", (event) => {
        const combatantId = Number(token.dataset.combatantId);
        if (!Number.isInteger(combatantId)) return;
        const current = state.combat.combatants.find((entry) => entry.id === combatantId);
        if (!current || current.kind !== "enemy") return;
        event.preventDefault();
        event.stopPropagation();
        inspectCombatantStatblock(current);
      });
    }

    if (token.__fadeOutTimer) {
      clearTimeout(token.__fadeOutTimer);
      token.__fadeOutTimer = null;
    }
    token.classList.remove("token-fade-out");

    const wasDragging = token.classList.contains("is-dragging");
    token.className = "run-map-token";
    if (wasDragging) token.classList.add("is-dragging");
    if (combatant.kind === "character") token.classList.add("token-pc");
    else if (isAllyCombatant(combatant)) token.classList.add("token-npc");
    else token.classList.add("token-enemy");

    token.title = combatant.name;
    if (combatant.kind === "enemy") {
      token.title = `${combatant.name} (double-click: statblock)`;
    }
    token.dataset.combatantId = String(combatant.id);
    token.style.left = `${clamp(pos.x, 20, width - 20)}px`;
    token.style.top = `${clamp(pos.y, 20, height - 20)}px`;
    token.style.setProperty("--token-scale", String(combatantTokenSizeScale(combatant)));
    if (combatant.id === state.combat.activeCombatantId) {
      token.classList.add("is-active");
    }
    if (hasRevealMoment(combatant.id)) {
      token.classList.add("reveal-moment-token");
    }

    const icon = token.querySelector(".run-map-token-icon");
    if (!(icon instanceof HTMLImageElement)) continue;
    icon.alt = combatant.name;
    if (combatantUsesPortraitToken(combatant)) {
      icon.classList.add("token-portrait");
    } else {
      icon.classList.remove("token-portrait");
    }
    const fallbackSrc = combatantIconFallbackSrc(combatant);
    icon.src = combatantTokenIconSrc(combatant);
    icon.onerror = () => {
      if (!icon.src.endsWith(fallbackSrc)) {
        icon.src = fallbackSrc;
      }
    };

    const label = token.querySelector(".run-map-token-name");
    if (!(label instanceof HTMLElement)) continue;
    label.textContent = combatant.name;

    els.runMapTokens.appendChild(token);
  }
}

function applyRunMapTransform() {
  const viewport = els.runMapViewport;
  const image = els.runMapImage;
  const scene = els.runMapScene;
  if (!viewport || !image || !scene || image.classList.contains("hidden")) return;
  if (!image.naturalWidth || !image.naturalHeight) return;

  const viewportWidth = viewport.clientWidth;
  const viewportHeight = viewport.clientHeight;
  if (viewportWidth <= 0 || viewportHeight <= 0) return;

  const baseScale = Math.min(viewportWidth / image.naturalWidth, viewportHeight / image.naturalHeight);
  const totalScale = baseScale * state.runMap.zoom;
  const scaledWidth = image.naturalWidth * totalScale;
  const scaledHeight = image.naturalHeight * totalScale;

  if (scaledWidth <= viewportWidth) {
    state.runMap.panX = (viewportWidth - scaledWidth) / 2;
  } else {
    const minX = viewportWidth - scaledWidth;
    state.runMap.panX = clamp(state.runMap.panX, minX, 0);
  }

  if (scaledHeight <= viewportHeight) {
    state.runMap.panY = (viewportHeight - scaledHeight) / 2;
  } else {
    const minY = viewportHeight - scaledHeight;
    state.runMap.panY = clamp(state.runMap.panY, minY, 0);
  }

  scene.style.width = `${image.naturalWidth}px`;
  scene.style.height = `${image.naturalHeight}px`;
  scene.style.transformOrigin = "top left";
  scene.style.transform = `translate(${state.runMap.panX}px, ${state.runMap.panY}px) scale(${totalScale})`;
  if (els.runMapFogCursorPreview && !els.runMapFogCursorPreview.classList.contains("hidden")) {
    const clientX = Number(els.runMapFogCursorPreview.dataset.clientX);
    const clientY = Number(els.runMapFogCursorPreview.dataset.clientY);
    if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
      updateRunMapFogCursorPreview(clientX, clientY);
    }
  }
}

function resetRunMapViewForScenario(scenarioId) {
  state.runMap.scenarioId = scenarioId;
  state.runMap.zoom = 1;
  state.runMap.panX = 0;
  state.runMap.panY = 0;
  state.runMap.dragging = false;
  state.runMap.dragMode = "map";
  state.runMap.dragCombatantId = null;
  state.runMap.pointerId = null;
  state.runMap.fogPainting = false;
  state.runMap.fogPointerId = null;
  state.runMap.pendingRemoteSync = null;
  applyRunMapTransform();
}

function activeCombatant() {
  return state.combat.combatants.find((c) => c.id === state.combat.activeCombatantId) || null;
}

function inspectCombatantStatblock(combatant) {
  if (!combatant || combatant.kind !== "enemy") return;
  state.runPreviewEnemyId = combatant.id;
  if (combatant.monster_image_data) {
    openImageModal(combatant.monster_image_data);
    return;
  }
  setStatus(`${combatant.name} has no statblock image.`);
}

function pickMapShortcutPreviewCombatant() {
  const combatants = Array.isArray(state.combat.combatants) ? state.combat.combatants : [];
  if (combatants.length === 0) return null;
  const activeIndex = combatants.findIndex((c) => c.id === state.combat.activeCombatantId);
  const startIndex = activeIndex >= 0 ? activeIndex : 0;

  const isCandidate = (combatant) => combatant.kind === "enemy";

  const active = combatants[startIndex];
  if (active && isCandidate(active)) return active;

  for (let i = 1; i <= combatants.length; i += 1) {
    const candidate = combatants[(startIndex + i) % combatants.length];
    if (isCandidate(candidate)) return candidate;
  }
  return null;
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
  button.classList.toggle("reveal-moment-btn", hasRevealMoment(combatant.id));
  button.textContent = visibleToPlayers ? "Visible" : "Hidden";
  button.title = visibleToPlayers ? "Visible in player view" : "Hidden from player view";
  button.addEventListener("click", async () => {
    const nextVisible = !visibleToPlayers;
    try {
      await api(`/api/combatants/${combatant.id}/player-visible`, {
        method: "POST",
        body: JSON.stringify({ visible: nextVisible })
      });
      await safeLoadCombatState();
      if (nextVisible) {
        triggerRevealMoment(combatant.id);
      }
      rerender();
    } catch (error) {
      setStatus(error.message, "error");
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
      setStatus(error.message, "error");
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
    chip.setAttribute("data-condition-key", condition.key);
    chip.addEventListener("click", async (event) => {
      event.preventDefault();
      event.stopPropagation();
      hideConditionTooltip();
      try {
        await api(`/api/combatants/${combatant.id}/conditions/${condition.key}`, {
          method: "DELETE"
        });
        await safeLoadCombatState();
        rerenderCurrentScenarioPage();
      } catch (error) {
        setStatus(error.message, "error");
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
  state.draftScenarioMapImageData = scenario.map_image_data || "";
  setScenarioMapPreview(state.draftScenarioMapImageData);
  if (els.editScenarioMapFile) els.editScenarioMapFile.value = "";
  els.combatantEditList.innerHTML = "";

  if (state.combat.combatants.length === 0) {
    els.combatantEditList.innerHTML = "<li>No combatants yet.</li>";
    return;
  }

  for (const combatant of state.combat.combatants) {
    const li = document.createElement("li");
    li.dataset.combatantId = String(combatant.id);
    if (state.runMap.hoverCombatantId === combatant.id) {
      li.classList.add("map-token-hover-linked");
    }
    if (hasRevealMoment(combatant.id)) {
      li.classList.add("reveal-moment-row");
    }
    if (combatant.kind !== "character" && Number(combatant.player_visible) === 0) {
      li.classList.add("combatant-hidden-for-players");
    }
    const row = document.createElement("div");
    row.className = "combatant-row";
    const right = document.createElement("div");
    right.className = "edit-combatant-right";

    const initiative = document.createElement("input");
    initiative.type = "text";
    initiative.className = "edit-order-init";
    initiative.value = String(combatant.initiative);
    initiative.required = true;
    initiative.placeholder = "00";
    initiative.maxLength = 2;
    row.appendChild(initiative);
    attachInitiativeBlurUpdate(initiative, combatant);

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
    if (combatant.kind !== "character") {
      right.appendChild(createPlayerVisibilityToggle(combatant, renderScenarioEditPage));
    }

    const conditionSelect = createConditionSelect(combatant);
    right.appendChild(conditionSelect);

    if (combatant.kind === "enemy") {
      const hpPrefix = document.createElement("span");
      hpPrefix.className = "field-prefix";
      hpPrefix.textContent = "HP";
      right.appendChild(hpPrefix);
      const hp = document.createElement("input");
      hp.type = "number";
      hp.value = combatant.hp == null ? "" : String(combatant.hp);
      hp.placeholder = "HP";
      right.appendChild(hp);
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
        setStatus(`Removed ${combatant.name} from scenario.`, "success");
      } catch (error) {
        setStatus(error.message, "error");
      }
    });
    right.appendChild(remove);
    row.appendChild(right);

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
    chip.setAttribute("data-condition-key", condition.key);
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

  const isMapView = state.page === "scenario-map";
  if (!isMapView) {
    hideMapStatblockHover();
    state.runMap.hoverCombatantId = null;
  }
  const hasMap = Boolean(scenario.map_image_data);
  const mapTokenSize = scenarioMapTokenSize(scenario);
  hydrateRunMapTokensFromScenario(scenario);
  els.runMapViewToggleBtn.classList.toggle("hidden", state.authUser?.role !== "admin");
  els.runMapViewToggleBtn.textContent = isMapView ? "Initiative View" : "Map View";
  els.runMapWrap.classList.toggle("hidden", !isMapView);
  els.runCombatLayout.classList.toggle("run-map-mode", isMapView);
  els.pageScenarioRun.classList.toggle("scenario-map-layout", isMapView);
  els.activeMonsterImageWrap.classList.toggle("hidden", isMapView);
  if (isMapView) {
    startRunMapSyncPolling();
  } else {
    stopRunMapSyncPolling();
  }
  if (isMapView && hasMap) {
    const shouldResetMap =
      state.runMap.scenarioId !== scenario.id || els.runMapImage.src !== scenario.map_image_data;
    els.runMapImage.src = scenario.map_image_data;
    els.runMapImage.classList.remove("hidden");
    els.runMapHint.classList.add("hidden");
    els.runMapTokenSizeControls.classList.remove("hidden");
    els.runMapControls.classList.remove("hidden");
    els.runMapDmControls.classList.remove("hidden");
    els.runMapFogBrushControls?.classList.toggle("hidden", state.runMap.fogMode === "navigate");
    setRunMapTokenSizeUI(mapTokenSize);
    setRunMapDragLockUi(state.runMap.dragLocked);
    ensureRunMapFogCanvasFromScenario(scenario);
    if (shouldResetMap) resetRunMapViewForScenario(scenario.id);
    renderRunMapTokens(scenario.id, state.combat.combatants);
    applyRunMapTransform();
  } else if (isMapView && !hasMap) {
    els.runMapImage.src = "";
    els.runMapImage.classList.add("hidden");
    els.runMapHint.classList.remove("hidden");
    els.runMapTokenSizeControls.classList.add("hidden");
    els.runMapControls.classList.add("hidden");
    els.runMapDmControls.classList.add("hidden");
    els.runMapFogBrushControls?.classList.add("hidden");
    hideRunMapFogCursorPreview();
    if (els.runMapTokens) els.runMapTokens.innerHTML = "";
    clearRunMapFogCanvas();
    state.runMap.scenarioId = null;
    state.runMap.dragging = false;
    state.runMap.pointerId = null;
  } else {
    els.runMapImage.src = "";
    els.runMapImage.classList.add("hidden");
    els.runMapHint.classList.add("hidden");
    els.runMapTokenSizeControls.classList.add("hidden");
    els.runMapControls.classList.add("hidden");
    els.runMapDmControls.classList.add("hidden");
    els.runMapFogBrushControls?.classList.add("hidden");
    hideRunMapFogCursorPreview();
    if (els.runMapTokens) els.runMapTokens.innerHTML = "";
    clearRunMapFogCanvas();
    state.runMap.dragging = false;
    state.runMap.pointerId = null;
  }

  els.runScenarioName.textContent = scenario.name;
  els.runScenarioNotes.textContent = scenario.notes || "No notes yet.";
  if (state.authUser?.role === "admin") {
    const isSharedCurrent = state.campaignLiveScenarioId === scenario.id;
    els.runScenarioSharedDot.classList.toggle("hidden", !isSharedCurrent);
    els.shareScenarioBtn.classList.remove("hidden");
    els.shareScenarioBtn.textContent = isSharedCurrent ? "Stop Sharing" : "Share";
  } else {
    els.runScenarioSharedDot.classList.add("hidden");
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
    els.activeMonsterImageHint.textContent = "No combatant statblock selected.";
  }

  for (const combatant of state.combat.combatants) {
    const li = document.createElement("li");
    li.dataset.combatantId = String(combatant.id);
    if (state.runMap.hoverCombatantId === combatant.id) {
      li.classList.add("map-token-hover-linked");
    }
    if (hasRevealMoment(combatant.id)) {
      li.classList.add("reveal-moment-row");
    }
    if (combatant.kind !== "character" && Number(combatant.player_visible) === 0) {
      li.classList.add("combatant-hidden-for-players");
    }
    if (combatant.kind === "character") {
      li.classList.add("run-tone-pc");
    } else if (isAllyCombatant(combatant)) {
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
    const mainLine = document.createElement("div");
    mainLine.className = "combatant-line-main";
    const right = document.createElement("div");
    right.className = "combatant-right";

    const name = createCombatantNameElement(combatant);
    if (combatant.kind === "enemy") {
      name.style.cursor = "pointer";
      if (isMapView) {
        name.title = "Open statblock";
        name.addEventListener("click", () => {
          inspectCombatantStatblock(combatant);
        });
        if (state.authUser?.role === "admin" && combatant.monster_image_data) {
          name.addEventListener("mouseenter", () => {
            showMapStatblockHover(combatant.monster_image_data, name);
          });
          name.addEventListener("mousemove", () => {
            showMapStatblockHover(combatant.monster_image_data, name);
          });
          name.addEventListener("mouseleave", () => {
            hideMapStatblockHover();
          });
        }
      } else {
        name.title = "Show this statblock";
        name.addEventListener("click", () => {
          state.runPreviewEnemyId = combatant.id;
          renderScenarioRunPage();
        });
      }
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
    mainLine.appendChild(initiative);
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
        setStatus(error.message, "error");
      }
    });
    mainLine.appendChild(reactionButton);

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
            setStatus(error.message, "error");
          }
        });
        legendaryWrap.appendChild(pip);
      }
    }
    mainLine.appendChild(name);
    if (legendaryWrap) mainLine.appendChild(legendaryWrap);
    row.appendChild(mainLine);

    let visibilityToggle = null;
    if (combatant.kind !== "character") {
      visibilityToggle = createPlayerVisibilityToggle(combatant, renderScenarioRunPage);
    }
    const conditionSelect = createConditionSelect(combatant);

    if (isMapView && visibilityToggle) {
      visibilityToggle.classList.add("combatant-visibility-inline");
      row.appendChild(visibilityToggle);
    } else if (visibilityToggle) {
      right.appendChild(visibilityToggle);
    }

    if (combatant.kind === "enemy") {
      right.appendChild(conditionSelect);

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
      if (isAllyCombatant(combatant)) heal.classList.add("npc-heal-btn");
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
          setStatus(error.message, "error");
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
      if (isAllyCombatant(combatant)) damage.classList.add("npc-damage-btn");
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
          setStatus(error.message, "error");
        }
      });
      right.appendChild(damage);
    } else if (isMapView) {
      conditionSelect.classList.add("map-character-condition-inline");
      mainLine.appendChild(conditionSelect);
    } else {
      right.appendChild(conditionSelect);
    }

    if (!(isMapView && combatant.kind === "character")) {
      row.appendChild(right);
    }

    if (combatant.id === state.combat.activeCombatantId) {
      li.classList.add("turn-active");
    }

    li.appendChild(row);
    applyConditionStyle(li, combatant);
    els.runOrderList.appendChild(li);
  }

  if (state.authUser?.role === "admin" && (state.page === "scenario-run" || state.page === "scenario-map")) {
    maybeCelebrateEncounterWin(state.selectedScenarioId, state.combat.combatants);
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
  setStatus(`Completed scenario: ${scenario.name}`, "success");
}

function renderCampaignPage() {
  const campaign = selectedCampaign();
  els.campaignPageTitle.textContent = campaign ? `Campaign: ${campaign.name}` : "Campaign";
  renderCharacters();
  renderScenarios();
  renderNav();
}

function formatConditionLabel(conditionKey) {
  const raw = `${conditionKey || ""}`.trim();
  if (!raw) return "";
  return raw
    .split(/[_\s-]+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

async function loadCampaignStats(campaignId) {
  if (!Number.isInteger(campaignId)) return null;
  const stats = await api(`/api/campaigns/${campaignId}/stats`);
  state.analyticsStatsByCampaign[campaignId] = stats;
  return stats;
}

function renderAnalyticsPage() {
  const campaigns = Array.isArray(state.campaigns) ? state.campaigns : [];
  els.analyticsCampaignSelect.innerHTML = "";
  if (campaigns.length === 0) {
    els.analyticsStatus.textContent = "No campaigns available yet.";
    els.analyticsMetrics.innerHTML = "";
    els.analyticsEnemyConditionList.innerHTML = "<li>No enemy condition data yet.</li>";
    els.analyticsPcInitiativeList.innerHTML = "<li>No PC initiative data yet.</li>";
    return;
  }

  for (const campaign of campaigns) {
    const option = document.createElement("option");
    option.value = String(campaign.id);
    option.textContent = campaign.name;
    if (campaign.id === state.analyticsSelectedCampaignId) {
      option.selected = true;
    }
    els.analyticsCampaignSelect.appendChild(option);
  }

  const selectedId = state.analyticsSelectedCampaignId;
  if (!Number.isInteger(selectedId)) {
    els.analyticsStatus.textContent = "Select a campaign.";
    return;
  }

  const stats = state.analyticsStatsByCampaign[selectedId];
  if (!stats) {
    els.analyticsStatus.textContent = "Loading stats...";
    els.analyticsMetrics.innerHTML = "";
    els.analyticsEnemyConditionList.innerHTML = "<li>No enemy condition data yet.</li>";
    els.analyticsPcInitiativeList.innerHTML = "<li>No PC initiative data yet.</li>";
    return;
  }

  els.analyticsStatus.textContent = "";
  const metricItems = [
    { label: "Total Enemy Damage", value: stats.totalEnemyDamage ?? 0 },
    { label: "Total Enemy Defeats", value: stats.totalEnemyDefeats ?? 0 },
    { label: "PC Down Events", value: stats.pcDownCount ?? 0 }
  ];
  els.analyticsEncounterCounters.innerHTML = "";
  const topCounterItems = [
    { label: "Total Encounters", value: stats.totalEncounters ?? 0 },
    { label: "Finished Encounters", value: stats.totalFinishedEncounters ?? 0 }
  ];
  for (const item of topCounterItems) {
    const box = document.createElement("article");
    box.className = "analytics-encounter-counter";
    const title = document.createElement("h4");
    title.textContent = item.label;
    const value = document.createElement("strong");
    value.textContent = String(item.value);
    box.appendChild(title);
    box.appendChild(value);
    els.analyticsEncounterCounters.appendChild(box);
  }
  els.analyticsMetrics.innerHTML = "";
  for (const item of metricItems) {
    const metric = document.createElement("article");
    metric.className = "analytics-metric";
    const title = document.createElement("h4");
    title.textContent = item.label;
    const value = document.createElement("strong");
    value.textContent = String(item.value);
    metric.appendChild(title);
    metric.appendChild(value);
    els.analyticsMetrics.appendChild(metric);
  }

  els.analyticsEnemyConditionList.innerHTML = "";
  const enemyEntries = Object.entries(stats.enemyConditionApplies || {});
  if (enemyEntries.length === 0) {
    els.analyticsEnemyConditionList.innerHTML = "<li>No enemy condition data yet.</li>";
  } else {
    enemyEntries.sort((a, b) => Number(b[1]) - Number(a[1]) || String(a[0]).localeCompare(String(b[0])));
    const podiumClasses = ["analytics-podium-gold", "analytics-podium-silver", "analytics-podium-bronze"];
    for (const [index, [conditionKey, count]] of enemyEntries.slice(0, 3).entries()) {
      const li = document.createElement("li");
      li.className = `list-row analytics-podium-item ${podiumClasses[index]}`;
      const left = document.createElement("span");
      left.className = "analytics-podium-left";
      const medal = document.createElement("span");
      medal.className = "analytics-podium-medal";
      medal.textContent = String(index + 1);
      left.appendChild(medal);
      const label = document.createElement("span");
      label.textContent = formatConditionLabel(conditionKey);
      left.appendChild(label);
      const value = document.createElement("strong");
      value.textContent = String(Number(count) || 0);
      li.appendChild(left);
      li.appendChild(value);
      els.analyticsEnemyConditionList.appendChild(li);
    }
  }

  els.analyticsPcInitiativeList.innerHTML = "";
  const pcRows = Array.isArray(stats.pcInitiativeAverages) ? stats.pcInitiativeAverages : [];
  if (pcRows.length === 0) {
    els.analyticsPcInitiativeList.innerHTML = "<li>No PC initiative data yet.</li>";
  } else {
    const rankedRows = [...pcRows].sort((a, b) => {
      const avgA = Number.isFinite(Number(a.averageInitiative)) ? Number(a.averageInitiative) : -Infinity;
      const avgB = Number.isFinite(Number(b.averageInitiative)) ? Number(b.averageInitiative) : -Infinity;
      if (avgA !== avgB) return avgB - avgA;
      const encountersA = Number(a.encounterCount) || 0;
      const encountersB = Number(b.encounterCount) || 0;
      if (encountersA !== encountersB) return encountersB - encountersA;
      return String(a.characterName || "").localeCompare(String(b.characterName || ""));
    });
    for (const [index, row] of rankedRows.entries()) {
      const li = document.createElement("li");
      li.className = "list-row";
      const left = document.createElement("span");
      left.className = "analytics-pc-row";
      const rank = document.createElement("span");
      rank.className = "analytics-pc-rank";
      rank.textContent = `#${index + 1}`;
      left.appendChild(rank);
      const icon = document.createElement("img");
      icon.className = "analytics-pc-token";
      icon.alt = row.characterName || "PC";
      const fallbackSrc = `/icons/classes/${slugifyClassName(row.characterClass || "")}.png`;
      icon.src = row.claimedProfileImageData || fallbackSrc;
      icon.addEventListener("error", () => {
        if (!icon.src.endsWith(fallbackSrc)) {
          icon.src = fallbackSrc;
          return;
        }
        if (!icon.src.endsWith("/icons/pc.svg")) {
          icon.src = "/icons/pc.svg";
        }
      });
      if (row.claimedProfileImageData) {
        icon.classList.add("token-portrait");
      }
      left.appendChild(icon);
      const name = document.createElement("span");
      name.textContent = row.characterName || "Unknown";
      left.appendChild(name);
      const right = document.createElement("span");
      const avg = row.averageInitiative == null ? "-" : row.averageInitiative;
      const encounters = Number(row.encounterCount) || 0;
      right.textContent = `${avg} avg (${encounters} encounters)`;
      li.appendChild(left);
      li.appendChild(right);
      els.analyticsPcInitiativeList.appendChild(li);
    }
  }
}

async function setAnalyticsCampaign(campaignId) {
  if (!Number.isInteger(campaignId)) return;
  state.analyticsSelectedCampaignId = campaignId;
  renderAnalyticsPage();
  try {
    await loadCampaignStats(campaignId);
    renderAnalyticsPage();
  } catch (error) {
    setStatus(error.message, "error");
  }
}

async function loadCampaigns() {
  state.campaigns = await api("/api/campaigns");
  const summaryEntries = await Promise.all(
    state.campaigns.map(async (campaign) => {
      const players = await api(`/api/campaigns/${campaign.id}/characters`);
      const totalEncounters = Number.isFinite(Number(campaign.total_encounters))
        ? Number(campaign.total_encounters)
        : 0;
      const totalFinishedEncounters = Number.isFinite(Number(campaign.total_finished_encounters))
        ? Number(campaign.total_finished_encounters)
        : 0;
      const scenarioCount = Math.max(0, totalEncounters - totalFinishedEncounters);
      return [
        campaign.id,
        {
          players,
          scenarioCount,
          totalEncounters,
          totalFinishedEncounters,
          totalEnemyDamage: Number(campaign.total_enemy_damage) || 0,
          totalEnemyDefeats: Number(campaign.total_enemy_defeats) || 0
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
  if (!hasShared) {
    state.playerVisibleCombatantIdsByScenario = {};
    return;
  }

  updatePlayerRevealMomentsFromShared(shared);

  const isMapMode = state.playerLiveViewMode === "map";
  if (!isMapMode) {
    state.playerMap.hoverCombatantId = null;
  }
  els.playerLiveWrap.classList.toggle("player-map-mode", isMapMode);
  els.playerLiveInitiativeWrap.classList.remove("hidden");
  els.playerLiveMapWrap.classList.toggle("hidden", !isMapMode);

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
    li.dataset.combatantId = String(combatant.id);
    if (state.playerMap.hoverCombatantId === combatant.id) {
      li.classList.add("map-token-hover-linked");
    }
    if (combatant.kind === "character") {
      li.classList.add("run-tone-pc");
    } else if (isAllyCombatant(combatant)) {
      li.classList.add("run-tone-npc");
    } else {
      li.classList.add("run-tone-enemy");
    }
    const keys = Array.isArray(combatant.condition_keys) ? combatant.condition_keys : [];
    if (keys.includes("down")) {
      li.classList.add("run-down");
    }
    if (combatant.kind === "enemy" && Number(combatant.is_defeated) === 1) {
      li.classList.add("run-defeated");
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

  if (isMapMode) {
    const mapImageData = `${shared.mapImageData || ""}`;
    const mapTokensJson = `${shared.mapTokensJson || ""}`;
    const mapFogData = `${shared.mapFogData || ""}`;
    setPlayerMapTokenSize(shared.mapTokenSize);
    renderPlayerLiveMap(
      shared.scenarioId,
      mapImageData,
      mapFogData,
      mapTokensJson,
      combatants,
      shared.activeCombatantId
    );
  }

  if (state.authUser?.role !== "admin" && state.page === "player-home") {
    maybeCelebrateEncounterWin(shared.scenarioId, combatants, { visibleOnly: true });
  }
}

async function loadUserSettings() {
  state.userSettings = await api("/api/users/me/settings");
  state.draftSettingsProfileImageData = state.userSettings?.user?.profileImageData || "";
  if (state.authUser) {
    state.authUser.profileImageData = state.userSettings?.user?.profileImageData || "";
  }
}

function renderSettingsPage() {
  if (els.settingsUsernameInput) {
    els.settingsUsernameInput.value = state.userSettings?.user?.username || "";
  }
  if (els.settingsNewPasswordInput) els.settingsNewPasswordInput.value = "";
  if (els.settingsConfirmPasswordInput) els.settingsConfirmPasswordInput.value = "";
  setSettingsProfileImagePreview(state.draftSettingsProfileImageData || "");
  if (els.settingsProfileImageFile) els.settingsProfileImageFile.value = "";
  els.settingsClaimList.innerHTML = "";
  const isAdmin = state.authUser?.role === "admin";
  els.settingsClaimSection.classList.toggle("hidden", isAdmin);

  if (!state.userSettings || !Array.isArray(state.userSettings.characters)) {
    els.settingsClaimList.innerHTML = "<li>No claimable characters found.</li>";
    return;
  }
  if (isAdmin) return;
  if (state.userSettings.characters.length === 0) {
    els.settingsClaimList.innerHTML = "<li>No claimable characters found.</li>";
    return;
  }

  for (const character of state.userSettings.characters) {
    const li = document.createElement("li");
    const row = document.createElement("div");
    row.className = "list-row";

    const label = document.createElement("span");
    const campaignName = character.campaign_name || "Campaign";
    label.textContent = `${campaignName}: ${character.name} (${character.class_name})`;
    row.appendChild(label);

    const claimedByIdRaw = character.claimed_user_id;
    const claimedById = claimedByIdRaw == null ? null : Number(claimedByIdRaw);
    const isClaimed = Number.isInteger(claimedById) && claimedById > 0;
    const claimedByMe = isClaimed && claimedById === state.authUser?.id;

    const actionBtn = document.createElement("button");
    actionBtn.type = "button";
    actionBtn.textContent = claimedByMe ? "Unclaim" : "Claim";
    if (isClaimed && !claimedByMe) {
      actionBtn.disabled = true;
      actionBtn.textContent = `Claimed by ${character.claimed_by_username || "another player"}`;
    }
    actionBtn.addEventListener("click", async () => {
      try {
        if (claimedByMe) {
          await api("/api/users/me/unclaim-character", {
            method: "POST",
            body: JSON.stringify({ characterId: character.id })
          });
        } else {
          await api("/api/users/me/claim-character", {
            method: "POST",
            body: JSON.stringify({ characterId: character.id })
          });
        }
        await loadUserSettings();
        renderSettingsPage();
      } catch (error) {
        setStatus(error.message, "error");
      }
    });
    row.appendChild(actionBtn);

    li.appendChild(row);
    els.settingsClaimList.appendChild(li);
  }
}

function parseMapTokensJson(raw) {
  const text = `${raw || ""}`.trim();
  if (!text) return {};
  try {
    const parsed = JSON.parse(text);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const normalized = {};
    for (const [key, value] of Object.entries(parsed)) {
      const combatantId = Number(key);
      const x = Number(value?.x);
      const y = Number(value?.y);
      if (!Number.isInteger(combatantId) || !Number.isFinite(x) || !Number.isFinite(y)) continue;
      normalized[combatantId] = { x, y };
    }
    return normalized;
  } catch (_error) {
    return {};
  }
}

function resetPlayerMapViewForScenario(scenarioId, mapKey) {
  state.playerMap.scenarioId = Number.isInteger(scenarioId) ? scenarioId : null;
  state.playerMap.mapKey = `${mapKey || ""}`;
  state.playerMap.zoom = 1;
  state.playerMap.panX = 0;
  state.playerMap.panY = 0;
  state.playerMap.dragging = false;
  state.playerMap.dragMode = "map";
  state.playerMap.dragCombatantId = null;
  state.playerMap.pointerId = null;
  if (state.playerMap.saveTimer) {
    clearTimeout(state.playerMap.saveTimer);
    state.playerMap.saveTimer = null;
  }
  state.playerMap.pendingTokenUpdate = null;
  if (els.playerMapViewport) {
    els.playerMapViewport.classList.remove("is-dragging");
  }
  applyPlayerMapTransform();
}

async function persistPlayerMapTokenPosition(scenarioId, combatantId, x, y) {
  if (!Number.isInteger(scenarioId) || !Number.isInteger(combatantId)) return;
  try {
    await api("/api/player/live/map-token", {
      method: "POST",
      body: JSON.stringify({ scenarioId, combatantId, x, y })
    });
  } catch (_error) {
    // Keep local drag smooth even on transient network/API failures.
  }
}

function schedulePlayerMapTokenSave(scenarioId, combatantId, x, y) {
  if (!Number.isInteger(scenarioId) || !Number.isInteger(combatantId)) return;
  state.playerMap.pendingTokenUpdate = { scenarioId, combatantId, x, y };
  if (state.playerMap.saveTimer) clearTimeout(state.playerMap.saveTimer);
  state.playerMap.saveTimer = setTimeout(() => {
    state.playerMap.saveTimer = null;
    const pending = state.playerMap.pendingTokenUpdate;
    state.playerMap.pendingTokenUpdate = null;
    if (!pending) return;
    persistPlayerMapTokenPosition(
      pending.scenarioId,
      pending.combatantId,
      pending.x,
      pending.y
    );
  }, 120);
}

function renderPlayerLiveMap(
  scenarioId,
  mapImageData,
  mapFogData,
  mapTokensJson,
  combatants,
  activeCombatantId
) {
  const hasMap = Boolean(mapImageData);
  els.playerLiveMapHint.classList.toggle("hidden", hasMap);
  els.playerMapControls.classList.toggle("hidden", !hasMap);
  els.playerMapViewport.classList.toggle("hidden", !hasMap);
  if (!hasMap) {
    state.playerMap.dragging = false;
    state.playerMap.dragMode = "map";
    state.playerMap.dragCombatantId = null;
    state.playerMap.pointerId = null;
    state.playerMap.scenarioId = null;
    state.playerMap.mapKey = "";
    if (state.playerMap.saveTimer) {
      clearTimeout(state.playerMap.saveTimer);
      state.playerMap.saveTimer = null;
    }
    state.playerMap.pendingTokenUpdate = null;
    if (els.playerMapViewport) {
      els.playerMapViewport.classList.remove("is-dragging");
    }
    els.playerMapImage.src = "";
    els.playerMapImage.classList.add("hidden");
    setPlayerMapFogOverlay("");
    els.playerMapTokens.innerHTML = "";
    return;
  }
  setPlayerMapDragLockUi(state.playerMap.dragLocked);

  const nextScenarioId = Number.isInteger(Number(scenarioId)) ? Number(scenarioId) : null;
  const nextMapKey = `${mapImageData || ""}`;
  if (state.playerMap.scenarioId !== nextScenarioId || state.playerMap.mapKey !== nextMapKey) {
    resetPlayerMapViewForScenario(nextScenarioId, nextMapKey);
  }

  els.playerMapImage.src = mapImageData;
  els.playerMapImage.classList.remove("hidden");
  setPlayerMapFogOverlay(mapFogData);

  const positions = parseMapTokensJson(mapTokensJson);
  const visibleCombatants = [];
  for (const combatant of combatants) {
    const isEnemyDefeated =
      combatant.kind === "enemy" &&
      !isAllyCombatant(combatant) &&
      Number(combatant.is_defeated) === 1;
    if (isEnemyDefeated) continue;
    visibleCombatants.push(combatant);
  }

  const nextIds = new Set(visibleCombatants.map((combatant) => combatant.id));
  const existingTokens = new Map();
  els.playerMapTokens
    .querySelectorAll(".player-map-token[data-combatant-id]")
    .forEach((token) => {
      const id = Number(token.dataset.combatantId);
      if (Number.isInteger(id)) existingTokens.set(id, token);
    });

  for (const [id, token] of existingTokens.entries()) {
    if (nextIds.has(id)) continue;
    fadeOutAndRemoveToken(token, els.playerMapTokens, 240);
  }

  for (const combatant of visibleCombatants) {
    const pos = positions[combatant.id];
    if (!pos) continue;

    let token = existingTokens.get(combatant.id) || null;
    if (!token) {
      token = document.createElement("span");
      token.dataset.combatantId = String(combatant.id);
      const icon = document.createElement("img");
      icon.className = "player-map-token-icon";
      token.appendChild(icon);
      const label = document.createElement("span");
      label.className = "player-map-token-name";
      token.appendChild(label);

      token.addEventListener("pointerdown", (event) => {
        if (state.page !== "player-home" || state.playerLiveViewMode !== "map") return;
        if (state.playerMap.dragLocked) return;
        if (event.button !== 0) return;
        const combatantId = Number(token.dataset.combatantId);
        if (!Number.isInteger(combatantId)) return;
        event.preventDefault();
        event.stopPropagation();
        stopPlayerLivePolling();
        state.playerMap.dragging = true;
        state.playerMap.dragMode = "token";
        state.playerMap.dragCombatantId = combatantId;
        state.playerMap.pointerId = event.pointerId;
        state.playerMap.lastClientX = event.clientX;
        state.playerMap.lastClientY = event.clientY;
        if (els.playerMapViewport) {
          els.playerMapViewport.classList.add("is-dragging");
          els.playerMapViewport.setPointerCapture(event.pointerId);
        }
        token.classList.add("is-dragging");
      });

      token.addEventListener("mouseenter", () => {
        const combatantId = Number(token.dataset.combatantId);
        if (!Number.isInteger(combatantId)) return;
        setMapHoverCombatantRow(combatantId, true, true);
      });
      token.addEventListener("pointerenter", () => {
        const combatantId = Number(token.dataset.combatantId);
        if (!Number.isInteger(combatantId)) return;
        setMapHoverCombatantRow(combatantId, true, true);
      });
      token.addEventListener("mouseleave", () => {
        const combatantId = Number(token.dataset.combatantId);
        if (!Number.isInteger(combatantId)) return;
        setMapHoverCombatantRow(combatantId, true, false);
      });
      token.addEventListener("pointerleave", () => {
        const combatantId = Number(token.dataset.combatantId);
        if (!Number.isInteger(combatantId)) return;
        setMapHoverCombatantRow(combatantId, true, false);
      });
    }

    if (token.__fadeOutTimer) {
      clearTimeout(token.__fadeOutTimer);
      token.__fadeOutTimer = null;
    }
    token.classList.remove("token-fade-out");

    const wasDragging = token.classList.contains("is-dragging");
    token.className = "player-map-token";
    if (wasDragging) token.classList.add("is-dragging");
    if (combatant.kind === "character") token.classList.add("token-pc");
    else if (isAllyCombatant(combatant)) token.classList.add("token-npc");
    else token.classList.add("token-enemy");

    token.title = combatant.name;
    token.dataset.combatantId = String(combatant.id);
    token.style.left = `${pos.x}px`;
    token.style.top = `${pos.y}px`;
    token.style.setProperty("--token-scale", String(combatantTokenSizeScale(combatant)));
    if (combatant.id === activeCombatantId) {
      token.classList.add("is-active");
    }
    if (hasPlayerRevealMoment(combatant.id)) {
      token.classList.add("reveal-moment-token");
    }

    const icon = token.querySelector(".player-map-token-icon");
    if (!(icon instanceof HTMLImageElement)) continue;
    icon.alt = combatant.name;
    if (combatantUsesPortraitToken(combatant)) {
      icon.classList.add("token-portrait");
    } else {
      icon.classList.remove("token-portrait");
    }
    const fallbackSrc = combatantIconFallbackSrc(combatant);
    icon.src = combatantTokenIconSrc(combatant);
    icon.onerror = () => {
      if (!icon.src.endsWith(fallbackSrc)) {
        icon.src = fallbackSrc;
      }
    };

    const label = token.querySelector(".player-map-token-name");
    if (!(label instanceof HTMLElement)) continue;
    label.textContent = combatant.name;

    els.playerMapTokens.appendChild(token);
  }
  applyPlayerMapTransform();
}

function applyPlayerMapTransform() {
  if (!els.playerMapViewport || !els.playerMapScene || !els.playerMapImage) return;
  if (els.playerMapImage.classList.contains("hidden")) return;
  const viewportWidth = els.playerMapViewport.clientWidth;
  const viewportHeight = els.playerMapViewport.clientHeight;
  const naturalWidth = els.playerMapImage.naturalWidth;
  const naturalHeight = els.playerMapImage.naturalHeight;
  if (!viewportWidth || !viewportHeight || !naturalWidth || !naturalHeight) return;

  const baseScale = Math.min(viewportWidth / naturalWidth, viewportHeight / naturalHeight);
  const totalScale = baseScale * state.playerMap.zoom;
  const scaledWidth = naturalWidth * totalScale;
  const scaledHeight = naturalHeight * totalScale;

  if (scaledWidth <= viewportWidth) {
    state.playerMap.panX = (viewportWidth - scaledWidth) / 2;
  } else {
    const minX = viewportWidth - scaledWidth;
    state.playerMap.panX = clamp(state.playerMap.panX, minX, 0);
  }

  if (scaledHeight <= viewportHeight) {
    state.playerMap.panY = (viewportHeight - scaledHeight) / 2;
  } else {
    const minY = viewportHeight - scaledHeight;
    state.playerMap.panY = clamp(state.playerMap.panY, minY, 0);
  }

  els.playerMapScene.style.transformOrigin = "top left";
  els.playerMapScene.style.transform = `translate(${state.playerMap.panX}px, ${state.playerMap.panY}px) scale(${totalScale})`;
}

async function loadPlayerLive() {
  if (!state.authUser || state.authUser.role === "admin") return;
  state.playerLiveData = await api("/api/player/live");
  renderPlayerHome();
}

function supportsEventStream() {
  return typeof window.EventSource === "function";
}

function clearPlayerLiveReconnectTimer() {
  if (state.playerLiveReconnectTimer) {
    clearTimeout(state.playerLiveReconnectTimer);
    state.playerLiveReconnectTimer = null;
  }
}

function clearRunMapSyncReconnectTimer() {
  if (state.runMapSyncReconnectTimer) {
    clearTimeout(state.runMapSyncReconnectTimer);
    state.runMapSyncReconnectTimer = null;
  }
}

function applyRunMapSyncSnapshot(snapshot, { force = false } = {}) {
  const scenarioId = Number(snapshot?.scenarioId ?? snapshot?.id);
  if (!Number.isInteger(scenarioId)) return;
  const current = state.scenarios.find((scenario) => scenario.id === scenarioId);
  if (!current) return;
  const nextMapTokensJson = `${snapshot?.mapTokensJson ?? snapshot?.map_tokens_json ?? ""}`;
  const nextTokenSizeRaw = Number(snapshot?.mapTokenSize ?? snapshot?.map_token_size);
  const nextMapFogRaw =
    snapshot?.mapFogData ??
    snapshot?.map_fog_data ??
    current.map_fog_data ??
    "";
  const nextMapFogData = `${nextMapFogRaw || ""}`;
  const nextTokenSize = Number.isFinite(nextTokenSizeRaw)
    ? clamp(Math.round(nextTokenSizeRaw), 24, 128)
    : scenarioMapTokenSize(current);
  const changed =
    `${current.map_tokens_json || ""}` !== nextMapTokensJson ||
    scenarioMapTokenSize(current) !== nextTokenSize ||
    `${current.map_fog_data || ""}` !== nextMapFogData;
  if (!changed && !force) return;

  state.scenarios = state.scenarios.map((scenario) =>
    scenario.id === scenarioId
      ? {
        ...scenario,
        map_tokens_json: nextMapTokensJson,
        map_token_size: nextTokenSize,
        map_fog_data: nextMapFogData
      }
      : scenario
  );
  state.runMap.fogDataByScenario[scenarioId] = nextMapFogData;
  delete state.runMap.tokensByScenario[scenarioId];
  const refreshed = selectedScenario();
  if (!refreshed || state.page !== "scenario-map") return;
  hydrateRunMapTokensFromScenario(refreshed);
  setRunMapTokenSizeUI(scenarioMapTokenSize(refreshed));
  state.runMap.fogCanvasLoadedScenarioId = null;
  state.runMap.fogCanvasLoadedKey = null;
  ensureRunMapFogCanvasFromScenario(refreshed);
  renderRunMapTokens(scenarioId, state.combat.combatants);
  applyRunMapTransform();
}

function stopPlayerLivePolling() {
  clearPlayerLiveReconnectTimer();
  if (state.playerLiveEventSource) {
    state.playerLiveEventSource.close();
    state.playerLiveEventSource = null;
  }
  if (state.playerLivePollTimer) {
    clearInterval(state.playerLivePollTimer);
    state.playerLivePollTimer = null;
  }
}

function stopRunMapSyncPolling() {
  clearRunMapSyncReconnectTimer();
  if (state.runMapSyncEventSource) {
    state.runMapSyncEventSource.close();
    state.runMapSyncEventSource = null;
  }
  state.runMapSyncScenarioId = null;
  state.runMap.pendingRemoteSync = null;
  if (state.runMapSyncPollTimer) {
    clearInterval(state.runMapSyncPollTimer);
    state.runMapSyncPollTimer = null;
  }
}

function startRunMapSyncPolling() {
  if (state.page !== "scenario-map" || !state.selectedScenarioId) {
    stopRunMapSyncPolling();
    return;
  }
  const scenarioId = state.selectedScenarioId;
  const canUseStream = supportsEventStream();
  if (
    canUseStream &&
    state.runMapSyncEventSource &&
    state.runMapSyncScenarioId === scenarioId
  ) {
    return;
  }
  if (
    !canUseStream &&
    state.runMapSyncPollTimer &&
    state.runMapSyncScenarioId === scenarioId
  ) {
    return;
  }

  stopRunMapSyncPolling();
  state.runMapSyncScenarioId = scenarioId;

  if (!canUseStream) {
    state.runMapSyncPollTimer = setInterval(async () => {
      if (state.page !== "scenario-map") return;
      if (!state.selectedScenarioId) return;
      if (state.runMap.dragging || state.runMap.fogPainting) return;
      try {
        const latest = await api(`/api/scenarios/${state.selectedScenarioId}`);
        if (state.page !== "scenario-map" || state.selectedScenarioId !== latest.id) return;
        applyRunMapSyncSnapshot(latest);
      } catch (_error) {
        // Ignore transient polling errors.
      }
    }, 1000);
    return;
  }

  const source = new EventSource(`/api/scenarios/${scenarioId}/stream`);
  state.runMapSyncEventSource = source;

  source.addEventListener("scenario-map", (event) => {
    if (state.runMapSyncEventSource !== source) return;
    let payload;
    try {
      payload = JSON.parse(event.data);
    } catch (_error) {
      return;
    }
    if (!payload || Number(payload.scenarioId) !== scenarioId) return;
    if (payload.deleted) {
      setStatus("This encounter was deleted.");
      stopRunMapSyncPolling();
      return;
    }
    if (state.page !== "scenario-map" || state.selectedScenarioId !== scenarioId) return;
    if (state.runMap.dragging || state.runMap.fogPainting) {
      state.runMap.pendingRemoteSync = payload;
      return;
    }
    applyRunMapSyncSnapshot(payload);
  });

  source.onopen = () => {
    if (state.runMapSyncEventSource !== source) return;
    clearRunMapSyncReconnectTimer();
  };

  source.onerror = () => {
    if (state.runMapSyncEventSource !== source) return;
    source.close();
    state.runMapSyncEventSource = null;
    if (state.page !== "scenario-map" || state.selectedScenarioId !== scenarioId) return;
    clearRunMapSyncReconnectTimer();
    state.runMapSyncReconnectTimer = setTimeout(() => {
      state.runMapSyncReconnectTimer = null;
      if (state.page !== "scenario-map" || state.selectedScenarioId !== scenarioId) return;
      startRunMapSyncPolling();
    }, 1200);
  };
}

function startPlayerLivePolling() {
  stopPlayerLivePolling();
  if (!state.authUser || state.authUser.role === "admin") return;

  if (!supportsEventStream()) {
    state.playerLivePollTimer = setInterval(() => {
      loadPlayerLive().catch(() => {
        // keep prior state on transient failures
      });
    }, 2000);
    return;
  }

  const source = new EventSource("/api/player/live/stream");
  state.playerLiveEventSource = source;

  source.addEventListener("player-live", (event) => {
    if (state.playerLiveEventSource !== source) return;
    let payload;
    try {
      payload = JSON.parse(event.data);
    } catch (_error) {
      return;
    }
    if (!payload || typeof payload !== "object") return;
    state.playerLiveData = payload;
    renderPlayerHome();
  });

  source.onopen = () => {
    if (state.playerLiveEventSource !== source) return;
    clearPlayerLiveReconnectTimer();
  };

  source.onerror = () => {
    if (state.playerLiveEventSource !== source) return;
    source.close();
    state.playerLiveEventSource = null;
    if (state.page !== "player-home" || !state.authUser || state.authUser.role === "admin") return;
    clearPlayerLiveReconnectTimer();
    state.playerLiveReconnectTimer = setTimeout(() => {
      state.playerLiveReconnectTimer = null;
      if (state.page !== "player-home" || !state.authUser || state.authUser.role === "admin") return;
      startPlayerLivePolling();
    }, 1200);
  };
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
    const [members, claims] = await Promise.all([
      api(`/api/campaigns/${state.adminMemberCampaignId}/members`),
      api(`/api/admin/campaigns/${state.adminMemberCampaignId}/character-claims`)
    ]);
    state.adminCampaignMembers = members;
    state.adminCampaignClaims = claims;
  } else {
    state.adminCampaignMembers = [];
    state.adminCampaignClaims = [];
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
          setStatus(`Reset password for ${user.username}.`, "success");
        } catch (error) {
          setStatus(error.message, "error");
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
          setStatus(`${Number(user.active) === 1 ? "Deactivated" : "Activated"} ${user.username}.`, "success");
        } catch (error) {
          setStatus(error.message, "error");
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
          setStatus(`Removed ${member.username} from campaign.`, "success");
        } catch (error) {
          setStatus(error.message, "error");
        }
      });
      row.appendChild(removeButton);

      li.appendChild(row);
      els.adminMemberList.appendChild(li);
    }
  }

  els.adminClaimList.innerHTML = "";
  if (!Number.isInteger(state.adminMemberCampaignId)) {
    els.adminClaimList.innerHTML = "<li>Select a campaign.</li>";
  } else if (!Array.isArray(state.adminCampaignClaims) || state.adminCampaignClaims.length === 0) {
    els.adminClaimList.innerHTML = "<li>No claimed characters in this campaign.</li>";
  } else {
    for (const claim of state.adminCampaignClaims) {
      const li = document.createElement("li");
      const row = document.createElement("div");
      row.className = "list-row admin-row";

      const label = document.createElement("span");
      label.className = "admin-row-main";
      label.textContent = `${claim.character_name} (${claim.class_name})`;
      row.appendChild(label);

      const meta = document.createElement("div");
      meta.className = "admin-meta";
      const userBadge = document.createElement("span");
      userBadge.className = "admin-badge";
      userBadge.textContent = claim.username;
      meta.appendChild(userBadge);
      row.appendChild(meta);

      const unclaimButton = document.createElement("button");
      unclaimButton.type = "button";
      unclaimButton.className = "delete-btn";
      unclaimButton.textContent = "Unclaim";
      unclaimButton.addEventListener("click", async () => {
        if (!Number.isInteger(state.adminMemberCampaignId)) return;
        try {
          await api(
            `/api/admin/campaigns/${state.adminMemberCampaignId}/character-claims/${claim.character_id}`,
            { method: "DELETE" }
          );
          await loadAdminData();
          renderAdminPage();
          setStatus(`Unclaimed ${claim.character_name}.`, "success");
        } catch (error) {
          setStatus(error.message, "error");
        }
      });
      row.appendChild(unclaimButton);

      li.appendChild(row);
      els.adminClaimList.appendChild(li);
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
  const unlockAudio = () => {
    unlockVictoryAudio();
  };
  window.addEventListener("pointerdown", unlockAudio, { once: true });
  window.addEventListener("keydown", unlockAudio, { once: true });

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
    if (event.key === "Escape" && !els.addCombatantModal.classList.contains("hidden")) {
      closeAddCombatantModal();
      return;
    }
    if (event.key === "Escape" && clearMapViewSelectionsOnEsc()) {
      event.preventDefault();
      return;
    }
    if (!els.imageModal.classList.contains("hidden")) {
      const key = event.key.toLowerCase();
      if (key === "s" && state.page === "scenario-map" && state.authUser?.role === "admin") {
        event.preventDefault();
        closeImageModal();
      }
      return;
    }
    if (!els.campaignActionModal.classList.contains("hidden")) return;
    if (!els.addCombatantModal.classList.contains("hidden")) return;

    const key = event.key.toLowerCase();
    const target = event.target;
    // Keep browser/system shortcuts like Cmd+R / Cmd+Shift+R working.
    if (event.metaKey || event.ctrlKey) {
      return;
    }
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
      if (state.page === "scenario-run" || state.page === "scenario-map") {
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
        navigateToPage("scenario-map", {
          campaignId: state.selectedCampaignId,
          scenarioId: state.selectedScenarioId
        });
      }
      return;
    }

    if (key === "s" && state.page === "monsters" && !state.monsterEditorReadOnly) {
      event.preventDefault();
      els.monsterForm.requestSubmit();
      return;
    }

    if (key === "s" && state.page === "scenario-map" && state.authUser?.role === "admin") {
      event.preventDefault();
      hideMapStatblockHover();
      const combatant = pickMapShortcutPreviewCombatant();
      if (!combatant) {
        setStatus("No NPC/Enemy available to preview.");
        return;
      }
      inspectCombatantStatblock(combatant);
      return;
    }

    if (state.page === "scenario-map" && state.authUser?.role === "admin") {
      if (key === "f") {
        event.preventDefault();
        setRunMapFogMode(state.runMap.fogMode === "paint" ? "navigate" : "paint");
        return;
      }
      if (key === "d") {
        event.preventDefault();
        setRunMapFogMode(state.runMap.fogMode === "erase" ? "navigate" : "erase");
        return;
      }
    }

    if (state.page !== "scenario-run" && state.page !== "scenario-map") return;
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
        setStatus(error.message, "error");
      });
      return;
    }
    cycleActiveCombatantLegendaryAction().catch((error) => {
      setStatus(error.message, "error");
    });
  });
  els.activeMonsterImage.addEventListener("click", () => {
    if (!els.activeMonsterImage.src) return;
    openImageModal(els.activeMonsterImage.src);
  });
  els.monsterImagePreview.addEventListener("click", () => {
    if (!els.monsterImagePreview.src) return;
    openImageModal(els.monsterImagePreview.src);
  });
  els.enemyMonsterPreview.addEventListener("click", () => {
    if (!els.enemyMonsterPreview.src) return;
    openImageModal(els.enemyMonsterPreview.src);
  });
  els.editScenarioMapPreview.addEventListener("click", () => {
    if (!els.editScenarioMapPreview.src) return;
    openImageModal(els.editScenarioMapPreview.src);
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
      navigateToPath("/player/initiative");
    }
  });
  els.mainPlayerInitiativeBtn.addEventListener("click", async () => {
    await navigateToPath("/player/initiative");
  });
  els.mainPlayerMapBtn.addEventListener("click", async () => {
    await navigateToPath("/player/map");
  });

  els.playerRefreshBtn.addEventListener("click", () => {
    window.location.reload();
  });

  els.playerMapImage.addEventListener("load", () => {
    if (!els.playerMapScene || !els.playerMapImage.naturalWidth || !els.playerMapImage.naturalHeight) return;
    els.playerMapScene.style.width = `${els.playerMapImage.naturalWidth}px`;
    els.playerMapScene.style.height = `${els.playerMapImage.naturalHeight}px`;
    applyPlayerMapTransform();
  });

  window.addEventListener("resize", () => {
    if (state.page === "player-home" && state.playerLiveViewMode === "map") {
      applyPlayerMapTransform();
    }
  });

  els.mainMonstersBtn.addEventListener("click", async () => {
    await navigateToPage("monsters");
  });

  els.mainAnalyticsBtn.addEventListener("click", () => {
    navigateToPage("analytics");
  });
  els.analyticsCampaignSelect?.addEventListener("change", async () => {
    const campaignId = Number(els.analyticsCampaignSelect.value);
    if (!Number.isInteger(campaignId)) return;
    await setAnalyticsCampaign(campaignId);
  });

  els.userMenuSettingsBtn.addEventListener("click", async () => {
    closeUserMenuPopover();
    await navigateToPage("settings");
  });

  els.userMenuAdminBtn.addEventListener("click", async () => {
    closeUserMenuPopover();
    await navigateToPage("admin");
  });

  els.userMenuLogoutBtn.addEventListener("click", async () => {
    closeUserMenuPopover();
    hideMapStatblockHover();
    try {
      await api("/api/auth/logout", { method: "POST" });
    } catch (_error) {
      // logout should still proceed client-side
    }
    state.authUser = null;
    setLoginStatus("");
    showPage("login");
  });

  els.userMenu?.addEventListener("mouseleave", () => {
    els.userMenu.classList.remove("force-closed");
  });

  els.saveSettingsUsernameBtn.addEventListener("click", async () => {
    const nextUsername = `${els.settingsUsernameInput.value || ""}`.trim();
    if (!nextUsername) {
      setStatus("Username is required.");
      return;
    }
    try {
      await api("/api/users/me/username", {
        method: "POST",
        body: JSON.stringify({ username: nextUsername })
      });
      state.authUser = null;
      setLoginStatus("Name changed. Please sign in again.");
      await navigateToPath("/login", { replace: true });
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.saveSettingsPasswordBtn.addEventListener("click", async () => {
    const newPassword = `${els.settingsNewPasswordInput.value || ""}`;
    const confirmPassword = `${els.settingsConfirmPasswordInput.value || ""}`;
    if (!newPassword) {
      setStatus("New password is required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus("New password and confirmation do not match.");
      return;
    }
    try {
      await api("/api/users/me/change-password", {
        method: "POST",
        body: JSON.stringify({ newPassword })
      });
      state.authUser = null;
      setLoginStatus("Password changed. Please sign in again.");
      await navigateToPath("/login", { replace: true });
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.settingsProfileImageFile.addEventListener("change", async () => {
    const file = els.settingsProfileImageFile.files?.[0];
    if (!file) return;
    try {
      state.draftSettingsProfileImageData = await readFileAsDataUrl(file);
      setSettingsProfileImagePreview(state.draftSettingsProfileImageData);
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.saveSettingsProfileImageBtn.addEventListener("click", async () => {
    try {
      await api("/api/users/me/profile-image", {
        method: "POST",
        body: JSON.stringify({
          profileImageData: state.draftSettingsProfileImageData || ""
        })
      });
      await loadUserSettings();
      renderSettingsPage();
      renderMainSections();
      setStatus("Profile image saved.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.clearSettingsProfileImageBtn.addEventListener("click", async () => {
    try {
      state.draftSettingsProfileImageData = "";
      await api("/api/users/me/profile-image", {
        method: "POST",
        body: JSON.stringify({ profileImageData: "" })
      });
      await loadUserSettings();
      renderSettingsPage();
      renderMainSections();
      setStatus("Profile image removed.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
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
      triggerLoginAweEffect();
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
      setStatus(error.message, "error");
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
      setStatus(error.message, "error");
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
      setStatus(error.message, "error");
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
      setStatus("Membership updated.", "success");
      closeAdminActionModal();
    } catch (error) {
      setStatus(error.message, "error");
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
    if (state.lastScenarioPage === "scenario-run" || state.lastScenarioPage === "scenario-map") {
      await navigateToPage(state.lastScenarioPage, {
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
    setMonsterPasteTarget("statblock");
    const file = els.monsterImageFile.files?.[0];
    if (!file) return;
    try {
      state.draftMonsterImageData = await readFileAsDataUrl(file);
      setMonsterImagePreview(state.draftMonsterImageData);
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.monsterTokenImageFile.addEventListener("change", async () => {
    if (state.monsterEditorReadOnly) return;
    setMonsterPasteTarget("token");
    const file = els.monsterTokenImageFile.files?.[0];
    if (!file) return;
    try {
      state.draftMonsterTokenImageData = await readFileAsDataUrl(file);
      setMonsterTokenImagePreview(state.draftMonsterTokenImageData);
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.libraryEntryImageFile.addEventListener("change", async () => {
    setLibraryEntryPasteTarget("statblock");
    const file = els.libraryEntryImageFile.files?.[0];
    if (!file) return;
    try {
      state.draftLibraryEntryImageData = await readFileAsDataUrl(file);
      setLibraryEntryImagePreview(state.draftLibraryEntryImageData);
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.libraryEntryTokenImageFile.addEventListener("change", async () => {
    setLibraryEntryPasteTarget("token");
    const file = els.libraryEntryTokenImageFile.files?.[0];
    if (!file) return;
    try {
      state.draftLibraryEntryTokenImageData = await readFileAsDataUrl(file);
      setLibraryEntryTokenImagePreview(state.draftLibraryEntryTokenImageData);
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.monsterSearchInput.addEventListener("input", () => {
    state.monsterSearchQuery = els.monsterSearchInput.value || "";
    renderMonsterList();
  });
  els.monsterStatblockImageGroup.addEventListener("click", () => {
    setMonsterPasteTarget("statblock");
  });
  els.monsterTokenImageGroup.addEventListener("click", () => {
    setMonsterPasteTarget("token");
  });
  els.libraryEntryStatblockImageGroup.addEventListener("click", () => {
    setLibraryEntryPasteTarget("statblock");
  });
  els.libraryEntryTokenImageGroup.addEventListener("click", () => {
    setLibraryEntryPasteTarget("token");
  });
  els.openAddCombatantModalBtn.addEventListener("click", openAddCombatantModal);
  els.addCombatantCloseBtn.addEventListener("click", closeAddCombatantModal);
  els.addCombatantModal.addEventListener("click", (event) => {
    if (event.target === els.addCombatantModal) closeAddCombatantModal();
  });
  document.querySelectorAll(".add-combatant-cancel").forEach((button) => {
    button.addEventListener("click", closeAddCombatantModal);
  });
  els.enemyMonsterSearchInput.addEventListener("input", () => {
    renderEnemyMonsterOptions(els.enemyMonsterSearchInput.value);
  });

  els.scenarioSearchInput.addEventListener("input", () => {
    state.scenarioSearchQuery = els.scenarioSearchInput.value || "";
    renderScenarios();
  });

  document.addEventListener("paste", async (event) => {
    if (state.page !== "monsters" && state.page !== "scenario-edit" && state.page !== "settings") {
      return;
    }
    if (state.page === "settings") {
      const items = event.clipboardData?.items || [];
      const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));
      if (!imageItem) return;
      const file = imageItem.getAsFile();
      if (!file) return;
      event.preventDefault();
      try {
        state.draftSettingsProfileImageData = await readFileAsDataUrl(file);
        setSettingsProfileImagePreview(state.draftSettingsProfileImageData);
        setStatus("Pasted profile image.", "success");
      } catch (error) {
        setStatus(error.message, "error");
      }
      return;
    }
    if (state.page === "scenario-edit") {
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
      const items = event.clipboardData?.items || [];
      const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));
      if (!imageItem) return;
      const file = imageItem.getAsFile();
      if (!file) return;
      event.preventDefault();
      try {
        state.draftScenarioMapImageData = await readFileAsDataUrl(file);
        setScenarioMapPreview(state.draftScenarioMapImageData);
        scheduleScenarioEditAutoSave(80);
        setStatus("Pasted encounter map.", "success");
      } catch (error) {
        setStatus(error.message, "error");
      }
      return;
    }
    if (
      !els.campaignActionModal.classList.contains("hidden") &&
      state.campaignActionMode === "library-entry"
    ) {
      const target = event.target;
      const targetId = target instanceof HTMLElement ? target.id : "";
      const items = event.clipboardData?.items || [];
      const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));
      if (!imageItem) return;
      const file = imageItem.getAsFile();
      if (!file) return;
      event.preventDefault();
      try {
        const dataUrl = await readFileAsDataUrl(file);
        const pasteTarget =
          targetId === "libraryEntryTokenImageFile"
            ? "token"
            : targetId === "libraryEntryImageFile"
              ? "statblock"
              : state.libraryEntryPasteTarget;
        if (pasteTarget === "token") {
          setLibraryEntryPasteTarget("token");
          state.draftLibraryEntryTokenImageData = dataUrl;
          setLibraryEntryTokenImagePreview(state.draftLibraryEntryTokenImageData);
          setStatus("Pasted token image.", "success");
        } else {
          setLibraryEntryPasteTarget("statblock");
          state.draftLibraryEntryImageData = dataUrl;
          setLibraryEntryImagePreview(state.draftLibraryEntryImageData);
          setStatus("Pasted statblock screenshot.", "success");
        }
      } catch (error) {
        setStatus(error.message, "error");
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
      const dataUrl = await readFileAsDataUrl(file);
      const target = event.target;
      const targetId = target instanceof HTMLElement ? target.id : "";
      const pasteTarget =
        targetId === "monsterTokenImageFile"
          ? "token"
          : targetId === "monsterImageFile"
            ? "statblock"
            : state.monsterPasteTarget;
      if (pasteTarget === "token") {
        setMonsterPasteTarget("token");
        state.draftMonsterTokenImageData = dataUrl;
        setMonsterTokenImagePreview(state.draftMonsterTokenImageData);
        setStatus("Pasted token image.", "success");
      } else {
        setMonsterPasteTarget("statblock");
        state.draftMonsterImageData = dataUrl;
        setMonsterImagePreview(state.draftMonsterImageData);
        setStatus("Pasted statblock screenshot.", "success");
      }
    } catch (error) {
      setStatus(error.message, "error");
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
        setStatus(`Saved monster: ${updated.name}`, "success");
      } else {
        const created = await api("/api/monsters", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        state.selectedMonsterId = created.id;
        setStatus(`Created monster: ${created.name}`, "success");
      }
      await loadMonsters();
      setMonsterEditorReadOnly(true);
    } catch (error) {
      setStatus(error.message, "error");
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
          size: els.libraryEntrySize.value,
          isLegendary,
          legendaryActionsCount,
          monsterImageData: state.draftLibraryEntryImageData || "",
          tokenImageData: state.draftLibraryEntryTokenImageData || ""
        })
      });
      closeCampaignActionModal();
      await loadMonsters();
      state.selectedMonsterId = created.id;
      const current = selectedMonster();
      if (current) fillMonsterForm(current);
      renderMonsterList();
      setMonsterEditorReadOnly(true);
      setStatus(`Created entry: ${created.name}`, "success");
    } catch (error) {
      setStatus(error.message, "error");
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
      setStatus(`Deleted monster: ${monster.name}`, "success");
    } catch (error) {
      setStatus(error.message, "error");
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
      setStatus(`Created campaign: ${campaign.name}`, "success");
    } catch (error) {
      setStatus(error.message, "error");
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
      setStatus(`Deleted campaign: ${campaign.name}`, "success");
    } catch (error) {
      setStatus(error.message, "error");
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
      setStatus("Character added.", "success");
    } catch (error) {
      setStatus(error.message, "error");
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
      setStatus("Scenario added.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.editScenarioForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    await persistScenarioEditAutoSave({ showStatus: true });
  });

  els.editScenarioName.addEventListener("input", () => {
    scheduleScenarioEditAutoSave(420);
  });
  els.editScenarioNotes.addEventListener("input", () => {
    scheduleScenarioEditAutoSave(420);
  });
  els.editScenarioName.addEventListener("blur", () => {
    scheduleScenarioEditAutoSave(0);
  });
  els.editScenarioNotes.addEventListener("blur", () => {
    scheduleScenarioEditAutoSave(0);
  });

  els.editScenarioMapFile.addEventListener("change", async () => {
    const file = els.editScenarioMapFile.files?.[0];
    if (!file) return;
    try {
      state.draftScenarioMapImageData = await readFileAsDataUrl(file);
      setScenarioMapPreview(state.draftScenarioMapImageData);
      scheduleScenarioEditAutoSave(80);
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.clearScenarioMapBtn.addEventListener("click", () => {
    state.draftScenarioMapImageData = "";
    setScenarioMapPreview("");
    if (els.editScenarioMapFile) els.editScenarioMapFile.value = "";
    scheduleScenarioEditAutoSave(80);
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
      setStatus(`Reopened scenario: ${scenario.name}`, "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.completeScenarioFromEditBtn.addEventListener("click", async () => {
    try {
      await completeSelectedScenario();
    } catch (error) {
      setStatus(error.message, "error");
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
          enemyRole: els.enemyRole.value === "ally" ? "ally" : "enemy",
          monsterId: state.addCombatantSelectedMonsterId,
          name: els.enemyName.value,
          initiative: Number(els.enemyInitiative.value),
          hp: els.enemyHp.value === "" ? null : Number(els.enemyHp.value)
        })
      });
      els.enemyName.value = "";
      state.addCombatantSelectedMonsterId = null;
      els.enemyRole.value = "enemy";
      els.enemyInitiative.value = "";
      els.enemyHp.value = "";
      els.enemyMonsterSearchInput.value = "";
      setEnemyMonsterPreview("");
      closeAddCombatantModal();
      await safeLoadCombatState();
      renderScenarioEditPage();
      setStatus("Combatant added.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.nextTurnBtn.addEventListener("click", async () => {
    if (!state.selectedScenarioId) return;
    try {
      state.combat = await api(`/api/scenarios/${state.selectedScenarioId}/combat/next-turn`, {
        method: "POST"
      });
      focusPreviewOnActiveNonPc();
      state.lastScenarioPage = state.page === "scenario-map" ? "scenario-map" : "scenario-run";
      renderScenarioRunPage();
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.revokeTurnBtn.addEventListener("click", async () => {
    if (!state.selectedScenarioId) return;
    try {
      state.combat = await api(`/api/scenarios/${state.selectedScenarioId}/combat/prev-turn`, {
        method: "POST"
      });
      focusPreviewOnActiveNonPc();
      state.lastScenarioPage = state.page === "scenario-map" ? "scenario-map" : "scenario-run";
      renderScenarioRunPage();
    } catch (error) {
      setStatus(error.message, "error");
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
      state.lastScenarioPage = state.page === "scenario-map" ? "scenario-map" : "scenario-run";
      renderScenarioRunPage();
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.completeScenarioBtn.addEventListener("click", async () => {
    try {
      await completeSelectedScenario();
    } catch (error) {
      setStatus(error.message, "error");
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
          : `Shared encounter with players: ${scenario.name}`,
        "success"
      );
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.runMapViewToggleBtn.addEventListener("click", async () => {
    const scenario = selectedScenario();
    if (!scenario) return;
    if (state.page !== "scenario-map" && !scenario.map_image_data) {
      setStatus("Save a map in Edit View first.");
      return;
    }
    const targetPage = state.page === "scenario-map" ? "scenario-run" : "scenario-map";
    await navigateToPage(targetPage, {
      campaignId: state.selectedCampaignId,
      scenarioId: state.selectedScenarioId
    });
  });

  const onRunMapTokenSizeChange = () => {
    const scenario = selectedScenario();
    if (!scenario || state.page !== "scenario-map") return;
    const nextSize = clamp(Math.round(Number(els.runMapTokenSizeInput.value) || 44), 24, 128);
    setRunMapTokenSizeUI(nextSize);
    scheduleRunMapTokenSizeSave(scenario.id, nextSize);
  };
  const onRunMapTokenSizeNumberCommit = () => {
    const scenario = selectedScenario();
    if (!scenario || state.page !== "scenario-map") return;
    const parsed = parseRoundedNumberOrNull(els.runMapTokenSizeNumber?.value);
    if (parsed == null) {
      setRunMapTokenSizeUI(Number(els.runMapTokenSizeInput?.value) || 44);
      return;
    }
    const nextSize = clamp(parsed, 24, 128);
    setRunMapTokenSizeUI(nextSize);
    scheduleRunMapTokenSizeSave(scenario.id, nextSize);
  };
  const onRunMapTokenSizeNumberKeydown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    onRunMapTokenSizeNumberCommit();
    els.runMapTokenSizeNumber?.blur();
  };
  els.runMapTokenSizeInput.addEventListener("input", onRunMapTokenSizeChange);
  els.runMapTokenSizeInput.addEventListener("change", onRunMapTokenSizeChange);
  els.runMapTokenSizeNumber?.addEventListener("change", onRunMapTokenSizeNumberCommit);
  els.runMapTokenSizeNumber?.addEventListener("blur", onRunMapTokenSizeNumberCommit);
  els.runMapTokenSizeNumber?.addEventListener("keydown", onRunMapTokenSizeNumberKeydown);
  setRunMapDragLockUi(false);
  setRunMapFogMode("navigate");
  const fogBrushSizeFromSession = loadRunMapFogBrushSizeFromSession();
  setRunMapFogBrushSizeUi(fogBrushSizeFromSession ?? state.runMap.fogBrushSize);
  const fogBrushShapeFromSession = loadRunMapFogBrushShapeFromSession();
  setRunMapFogBrushShapeUi(fogBrushShapeFromSession ?? state.runMap.fogBrushShape);
  setPlayerMapDragLockUi(false);

  els.runMapZoomOutBtn?.addEventListener("click", () => {
    zoomRunMapAtPointer(1 / 1.12);
  });
  els.runMapZoomInBtn?.addEventListener("click", () => {
    zoomRunMapAtPointer(1.12);
  });
  els.runMapResetBtn?.addEventListener("click", () => {
    const scenario = selectedScenario();
    if (!scenario) return;
    resetRunMapViewForScenario(scenario.id);
  });
  els.runMapFogPaintBtn?.addEventListener("click", () => {
    setRunMapFogMode(state.runMap.fogMode === "paint" ? "navigate" : "paint");
  });
  els.runMapFogEraseBtn?.addEventListener("click", () => {
    setRunMapFogMode(state.runMap.fogMode === "erase" ? "navigate" : "erase");
  });
  els.runMapFogClearBtn?.addEventListener("click", () => {
    const scenario = selectedScenario();
    if (!scenario || state.page !== "scenario-map") return;
    const confirmed = window.confirm(
      "Clear all fog of war for this encounter map?"
    );
    if (!confirmed) return;
    clearRunMapFogCanvas();
    state.runMap.fogDataByScenario[scenario.id] = "";
    state.runMap.fogCanvasLoadedScenarioId = scenario.id;
    state.runMap.fogCanvasLoadedKey = `${scenario.id}:`;
    scheduleRunMapFogSave(scenario.id, "");
  });
  const onRunMapFogBrushSizeChange = () => {
    const nextSize = clamp(Math.round(Number(els.runMapFogBrushSizeInput?.value) || 56), 12, 220);
    setRunMapFogBrushSizeUi(nextSize);
    saveRunMapFogBrushSizeToSession(nextSize);
    if (els.runMapFogCursorPreview && !els.runMapFogCursorPreview.classList.contains("hidden")) {
      const clientX = Number(els.runMapFogCursorPreview.dataset.clientX);
      const clientY = Number(els.runMapFogCursorPreview.dataset.clientY);
      if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
        updateRunMapFogCursorPreview(clientX, clientY);
      }
    }
  };
  const onRunMapFogBrushSizeNumberApply = () => {
    const parsed = parseRoundedNumberOrNull(els.runMapFogBrushSizeNumber?.value);
    if (parsed == null) return;
    const nextSize = clamp(parsed, 12, 220);
    setRunMapFogBrushSizeUi(nextSize);
    saveRunMapFogBrushSizeToSession(nextSize);
    if (els.runMapFogCursorPreview && !els.runMapFogCursorPreview.classList.contains("hidden")) {
      const clientX = Number(els.runMapFogCursorPreview.dataset.clientX);
      const clientY = Number(els.runMapFogCursorPreview.dataset.clientY);
      if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
        updateRunMapFogCursorPreview(clientX, clientY);
      }
    }
  };
  const onRunMapFogBrushSizeNumberCommit = () => {
    const parsed = parseRoundedNumberOrNull(els.runMapFogBrushSizeNumber?.value);
    if (parsed == null) {
      setRunMapFogBrushSizeUi(Number(els.runMapFogBrushSizeInput?.value) || 56);
      return;
    }
    onRunMapFogBrushSizeNumberApply();
  };
  const onRunMapFogBrushSizeNumberKeydown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    onRunMapFogBrushSizeNumberCommit();
    els.runMapFogBrushSizeNumber?.blur();
  };
  els.runMapFogBrushSizeInput?.addEventListener("input", onRunMapFogBrushSizeChange);
  els.runMapFogBrushSizeInput?.addEventListener("change", onRunMapFogBrushSizeChange);
  els.runMapFogBrushSizeNumber?.addEventListener("change", onRunMapFogBrushSizeNumberCommit);
  els.runMapFogBrushSizeNumber?.addEventListener("blur", onRunMapFogBrushSizeNumberCommit);
  els.runMapFogBrushSizeNumber?.addEventListener("keydown", onRunMapFogBrushSizeNumberKeydown);
  const onRunMapFogBrushShapeChange = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.checked) return;
    const shape = target.value === "square" ? "square" : "round";
    setRunMapFogBrushShapeUi(shape);
    saveRunMapFogBrushShapeToSession(shape);
  };
  els.runMapFogBrushShapeRound?.addEventListener("change", onRunMapFogBrushShapeChange);
  els.runMapFogBrushShapeSquare?.addEventListener("change", onRunMapFogBrushShapeChange);
  els.runMapDragLockBtn?.addEventListener("click", () => {
    setRunMapDragLockUi(!state.runMap.dragLocked);
  });

  els.playerMapZoomOutBtn?.addEventListener("click", () => {
    zoomPlayerMapAtPointer(1 / 1.12);
  });
  els.playerMapZoomInBtn?.addEventListener("click", () => {
    zoomPlayerMapAtPointer(1.12);
  });
  els.playerMapResetBtn?.addEventListener("click", () => {
    resetPlayerMapViewForScenario(state.playerMap.scenarioId, state.playerMap.mapKey);
  });
  els.playerMapDragLockBtn?.addEventListener("click", () => {
    setPlayerMapDragLockUi(!state.playerMap.dragLocked);
  });

  if (els.runMapImage) {
    els.runMapImage.addEventListener("load", () => {
      if (state.page !== "scenario-map") return;
      const scenario = selectedScenario();
      if (scenario) ensureRunMapFogCanvasFromScenario(scenario);
      if (state.selectedScenarioId) {
        renderRunMapTokens(state.selectedScenarioId, state.combat.combatants);
      }
      applyRunMapTransform();
    });
  }

  if (els.runMapViewport) {
    els.runMapViewport.addEventListener(
      "wheel",
      (event) => {
        if (state.page !== "scenario-map" || els.runMapImage.classList.contains("hidden")) return;
        event.preventDefault();
        const rect = els.runMapViewport.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;
        zoomRunMapAtPointer(event.deltaY < 0 ? 1.12 : 1 / 1.12, pointerX, pointerY);
        updateRunMapFogCursorPreview(event.clientX, event.clientY, event.target);
      },
      { passive: false }
    );

    els.runMapViewport.addEventListener("pointerdown", (event) => {
      if (state.page !== "scenario-map" || els.runMapImage.classList.contains("hidden")) return;
      updateRunMapFogCursorPreview(event.clientX, event.clientY, event.target);
      if (
        event.target instanceof Element &&
        event.target.closest(".map-touch-controls, .map-fog-brush-controls")
      ) {
        return;
      }
      if (event.button !== 0) return;
      if (state.runMap.fogMode !== "navigate") {
        const scenario = selectedScenario();
        if (!scenario) return;
        const point = runMapPointerToImageCoords(event);
        if (!point) return;
        state.runMap.fogPainting = true;
        state.runMap.fogPointerId = event.pointerId;
        els.runMapViewport.setPointerCapture(event.pointerId);
        paintRunMapFogAt(point.x, point.y, state.runMap.fogMode);
        event.preventDefault();
        return;
      }
      if (state.runMap.dragLocked) return;
      state.runMap.dragging = true;
      state.runMap.dragMode = "map";
      state.runMap.dragCombatantId = null;
      state.runMap.pointerId = event.pointerId;
      state.runMap.lastClientX = event.clientX;
      state.runMap.lastClientY = event.clientY;
      els.runMapViewport.classList.add("is-dragging");
      els.runMapViewport.setPointerCapture(event.pointerId);
    });

    els.runMapViewport.addEventListener("pointermove", (event) => {
      updateRunMapFogCursorPreview(event.clientX, event.clientY, event.target);
      if (state.runMap.fogPainting && state.runMap.fogPointerId === event.pointerId) {
        const point = runMapPointerToImageCoords(event);
        if (!point) return;
        paintRunMapFogAt(point.x, point.y, state.runMap.fogMode);
        return;
      }
      if (!state.runMap.dragging || state.runMap.pointerId !== event.pointerId) return;
      const dx = event.clientX - state.runMap.lastClientX;
      const dy = event.clientY - state.runMap.lastClientY;
      state.runMap.lastClientX = event.clientX;
      state.runMap.lastClientY = event.clientY;
      if (state.runMap.dragMode === "token" && state.runMap.scenarioId != null) {
        const scenarioId = state.runMap.scenarioId;
        const combatantId = state.runMap.dragCombatantId;
        if (combatantId != null) {
          const positions = getScenarioTokenPositions(scenarioId);
          const current = positions[combatantId];
          if (current) {
            const image = els.runMapImage;
            const viewportWidth = els.runMapViewport.clientWidth;
            const viewportHeight = els.runMapViewport.clientHeight;
            if (image.naturalWidth && image.naturalHeight && viewportWidth > 0 && viewportHeight > 0) {
              const baseScale = Math.min(
                viewportWidth / image.naturalWidth,
                viewportHeight / image.naturalHeight
              );
              const totalScale = baseScale * state.runMap.zoom;
              const deltaImageX = dx / totalScale;
              const deltaImageY = dy / totalScale;
              current.x += deltaImageX;
              current.y += deltaImageY;
              current.x = clamp(current.x, 20, image.naturalWidth - 20);
              current.y = clamp(current.y, 20, image.naturalHeight - 20);
              const tokenEl = els.runMapTokens?.querySelector(
                `.run-map-token[data-combatant-id="${combatantId}"]`
              );
              if (tokenEl instanceof HTMLElement) {
                tokenEl.style.left = `${current.x}px`;
                tokenEl.style.top = `${current.y}px`;
              }
              scheduleRunMapTokensSave(scenarioId);
            }
          }
        }
        return;
      }
      state.runMap.panX += dx;
      state.runMap.panY += dy;
      applyRunMapTransform();
    });

    const endMapDrag = (event) => {
      if (state.runMap.fogPainting && state.runMap.fogPointerId === event.pointerId) {
        state.runMap.fogPainting = false;
        state.runMap.fogPointerId = null;
        const scenario = selectedScenario();
        if (scenario && Number.isInteger(scenario.id)) {
          const fogData = serializeRunMapFogCanvas();
          state.runMap.fogDataByScenario[scenario.id] = fogData;
          state.runMap.fogCanvasLoadedScenarioId = scenario.id;
          state.runMap.fogCanvasLoadedKey = `${scenario.id}:${fogData}`;
          scheduleRunMapFogSave(scenario.id, fogData);
        }
        if (state.runMap.pendingRemoteSync) {
          const pending = state.runMap.pendingRemoteSync;
          state.runMap.pendingRemoteSync = null;
          applyRunMapSyncSnapshot(pending, { force: true });
        }
        return;
      }
      if (!state.runMap.dragging || state.runMap.pointerId !== event.pointerId) return;
      state.runMap.dragging = false;
      state.runMap.dragMode = "map";
      state.runMap.dragCombatantId = null;
      state.runMap.pointerId = null;
      els.runMapViewport.classList.remove("is-dragging");
      els.runMapTokens?.querySelectorAll(".run-map-token.is-dragging").forEach((token) => {
        token.classList.remove("is-dragging");
      });
      if (state.runMap.scenarioId != null) {
        scheduleRunMapTokensSave(state.runMap.scenarioId);
      }
      if (state.runMap.pendingRemoteSync) {
        const pending = state.runMap.pendingRemoteSync;
        state.runMap.pendingRemoteSync = null;
        applyRunMapSyncSnapshot(pending, { force: true });
      }
    };

    els.runMapViewport.addEventListener("pointerleave", () => {
      hideRunMapFogCursorPreview();
    });
    els.runMapViewport.addEventListener("pointerup", endMapDrag);
    els.runMapViewport.addEventListener("pointercancel", endMapDrag);
  }

  if (els.playerMapViewport) {
    els.playerMapViewport.addEventListener(
      "wheel",
      (event) => {
        if (state.page !== "player-home" || state.playerLiveViewMode !== "map") return;
        if (els.playerMapImage.classList.contains("hidden")) return;
        event.preventDefault();
        const rect = els.playerMapViewport.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;
        zoomPlayerMapAtPointer(event.deltaY < 0 ? 1.12 : 1 / 1.12, pointerX, pointerY);
      },
      { passive: false }
    );

    els.playerMapViewport.addEventListener("pointerdown", (event) => {
      if (state.page !== "player-home" || state.playerLiveViewMode !== "map") return;
      if (els.playerMapImage.classList.contains("hidden")) return;
      if (event.target instanceof Element && event.target.closest(".map-touch-controls")) return;
      if (state.playerMap.dragLocked) return;
      if (event.button !== 0) return;
      stopPlayerLivePolling();
      state.playerMap.dragging = true;
      state.playerMap.dragMode = "map";
      state.playerMap.dragCombatantId = null;
      state.playerMap.pointerId = event.pointerId;
      state.playerMap.lastClientX = event.clientX;
      state.playerMap.lastClientY = event.clientY;
      els.playerMapViewport.classList.add("is-dragging");
      els.playerMapViewport.setPointerCapture(event.pointerId);
    });

    els.playerMapViewport.addEventListener("pointermove", (event) => {
      if (!state.playerMap.dragging || state.playerMap.pointerId !== event.pointerId) return;
      const dx = event.clientX - state.playerMap.lastClientX;
      const dy = event.clientY - state.playerMap.lastClientY;
      state.playerMap.lastClientX = event.clientX;
      state.playerMap.lastClientY = event.clientY;
      if (
        state.playerMap.dragMode === "token" &&
        Number.isInteger(state.playerMap.dragCombatantId) &&
        state.playerMap.scenarioId != null
      ) {
        const tokenEl = els.playerMapTokens?.querySelector(
          `.player-map-token[data-combatant-id="${state.playerMap.dragCombatantId}"]`
        );
        if (tokenEl instanceof HTMLElement) {
          const currentX = Number.parseFloat(tokenEl.style.left || "0");
          const currentY = Number.parseFloat(tokenEl.style.top || "0");
          const viewportWidth = els.playerMapViewport.clientWidth;
          const viewportHeight = els.playerMapViewport.clientHeight;
          const naturalWidth = els.playerMapImage.naturalWidth;
          const naturalHeight = els.playerMapImage.naturalHeight;
          if (viewportWidth > 0 && viewportHeight > 0 && naturalWidth > 0 && naturalHeight > 0) {
            const baseScale = Math.min(viewportWidth / naturalWidth, viewportHeight / naturalHeight);
            const totalScale = baseScale * state.playerMap.zoom;
            const nextX = clamp(currentX + dx / totalScale, 20, naturalWidth - 20);
            const nextY = clamp(currentY + dy / totalScale, 20, naturalHeight - 20);
            tokenEl.style.left = `${nextX}px`;
            tokenEl.style.top = `${nextY}px`;
            schedulePlayerMapTokenSave(
              state.playerMap.scenarioId,
              state.playerMap.dragCombatantId,
              nextX,
              nextY
            );
          }
        }
        return;
      }
      state.playerMap.panX += dx;
      state.playerMap.panY += dy;
      applyPlayerMapTransform();
    });

    const endPlayerMapDrag = (event) => {
      if (!state.playerMap.dragging || state.playerMap.pointerId !== event.pointerId) return;
      state.playerMap.dragging = false;
      state.playerMap.dragMode = "map";
      state.playerMap.dragCombatantId = null;
      state.playerMap.pointerId = null;
      els.playerMapViewport.classList.remove("is-dragging");
      els.playerMapTokens?.querySelectorAll(".player-map-token.is-dragging").forEach((token) => {
        token.classList.remove("is-dragging");
      });
      const pending = state.playerMap.pendingTokenUpdate;
      if (pending) {
        state.playerMap.pendingTokenUpdate = null;
        if (state.playerMap.saveTimer) {
          clearTimeout(state.playerMap.saveTimer);
          state.playerMap.saveTimer = null;
        }
        persistPlayerMapTokenPosition(
          pending.scenarioId,
          pending.combatantId,
          pending.x,
          pending.y
        );
      }
      if (state.page === "player-home" && state.authUser?.role !== "admin") {
        startPlayerLivePolling();
      }
    };
    els.playerMapViewport.addEventListener("pointerup", endPlayerMapDrag);
    els.playerMapViewport.addEventListener("pointercancel", endPlayerMapDrag);
  }

  document.addEventListener("mouseover", (event) => {
    const chip = event.target instanceof Element ? event.target.closest(".condition-chip") : null;
    if (!(chip instanceof HTMLElement)) return;
    showConditionTooltip(chip);
  });

  document.addEventListener("mouseout", (event) => {
    if (!conditionTooltipChip) return;
    const targetChip =
      event.target instanceof Element ? event.target.closest(".condition-chip") : null;
    if (targetChip !== conditionTooltipChip) return;
    const relatedChip =
      event.relatedTarget instanceof Element
        ? event.relatedTarget.closest(".condition-chip")
        : null;
    if (relatedChip === conditionTooltipChip) return;
    hideConditionTooltip();
  });

  document.addEventListener("focusin", (event) => {
    const chip = event.target instanceof Element ? event.target.closest(".condition-chip") : null;
    if (!(chip instanceof HTMLElement)) return;
    showConditionTooltip(chip);
  });

  document.addEventListener("focusout", (event) => {
    if (!conditionTooltipChip) return;
    const targetChip =
      event.target instanceof Element ? event.target.closest(".condition-chip") : null;
    if (targetChip !== conditionTooltipChip) return;
    const relatedChip =
      event.relatedTarget instanceof Element
        ? event.relatedTarget.closest(".condition-chip")
        : null;
    if (relatedChip === conditionTooltipChip) return;
    hideConditionTooltip();
  });

  window.addEventListener(
    "scroll",
    () => {
      if (!conditionTooltipChip) return;
      positionConditionTooltip(conditionTooltipChip);
    },
    true
  );

  window.addEventListener("resize", () => {
    if (conditionTooltipChip) positionConditionTooltip(conditionTooltipChip);
    hideMapStatblockHover();
    if (state.page === "scenario-map") applyRunMapTransform();
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
    setStatus(error.message, "error");
  }
  await navigateToPath(window.location.pathname, { replace: true });
}

init();
