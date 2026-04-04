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
    pingMode: false,
    lastPingId: null,
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
    pingMode: false,
    drawMode: "navigate",
    drawBrushSize: 8,
    drawColor: "#ff6363",
    drawPainting: false,
    drawPointerId: null,
    lastDrawX: null,
    lastDrawY: null,
    lastPingId: null,
    saveTimer: null,
    saveDrawTimer: null,
    pendingTokenUpdate: null,
    fogMaskByFogData: {},
    fogMaskRequestId: 0,
    drawCanvasLoadedKey: null
  },
  campaignMapData: null,
  campaignMap: {
    campaignId: null,
    mapKey: "",
    zoom: 1,
    minZoom: 1,
    maxZoom: 4,
    panX: 0,
    panY: 0,
    dragging: false,
    pointerId: null,
    lastClientX: 0,
    lastClientY: 0,
    dragLocked: false,
    pingMode: false,
    drawMode: "navigate",
    drawBrushSize: 8,
    drawColor: "#ff6363",
    drawPainting: false,
    drawPointerId: null,
    lastDrawX: null,
    lastDrawY: null,
    lastPingId: null,
    fogMode: "navigate",
    fogBrushSize: 56,
    fogBrushShape: "round",
    fogPainting: false,
    fogPointerId: null,
    fogCanvasLoadedCampaignId: null,
    fogCanvasLoadedKey: null,
    drawCanvasLoadedCampaignId: null,
    drawCanvasLoadedKey: null,
    pendingRemoteSync: null,
    saveFogTimer: null,
    saveDrawTimer: null
  },
  playerTurnResourcesByKey: {},
  runPreviewEnemyId: null,
  sceneImages: [],
  sceneSearchQuery: "",
  selectedSceneId: null,
  draftSceneImageData: "",
  diceOverlayOpen: false,
  dicePool: {},
  diceRollHistory: [],
  diceResultToastEntry: null,
  diceResultToastTimer: null,
  campaigns: [],
  campaignSummaries: {},
  adminUsers: [],
  adminMemberCampaignId: null,
  adminCampaignMembers: [],
  adminCampaignClaims: [],
  adminUserSearchQuery: "",
  adminMemberSearchQuery: "",
  campaignLiveScenarioId: null,
  campaignLiveSceneImageId: null,
  lastHomeCampaignId: null,
  playerLiveData: null,
  playerLiveLastActiveCombatantId: null,
  userSettings: null,
  playerLivePollTimer: null,
  playerLiveEventSource: null,
  playerLiveReconnectTimer: null,
  runMapSyncPollTimer: null,
  runMapSyncEventSource: null,
  runMapSyncReconnectTimer: null,
  runMapSyncScenarioId: null,
  campaignMapSyncPollTimer: null,
  campaignMapSyncEventSource: null,
  campaignMapSyncReconnectTimer: null,
  campaignMapSyncCampaignId: null,
  playerLiveViewMode: "initiative",
  diceShopOfferTimer: null,
  loginAweTimer: null,
  scenarioVictoryById: {},
  pendingVictorySoundById: {},
  victoryAudioContext: null,
  victoryAudioElement: null,
  victoryAudioUnlocked: false,
  pingAudioElement: null,
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
const CAMPAIGN_MAP_DRAW_BRUSH_SIZE_SESSION_KEY = "campaignMapDrawBrushSize";
const CAMPAIGN_MAP_DRAW_COLOR_SESSION_KEY = "campaignMapDrawColor";
const DEFAULT_CAMPAIGN_MAP_DRAW_BRUSH_SIZE = 8;
const DEFAULT_CAMPAIGN_MAP_DRAW_COLOR = "#ff6363";
const DICE_SKIN_OPTIONS = [
  {
    key: "default",
    label: "Crimson Default",
    theme: "default",
    themeColor: "#8f1d2c",
    previewImageUrl: "/images/crimson_preview.png",
    descriptionLead: "Classic. Reliable.",
    descriptionParagraphs: [
      'Forged in the imaginary fires of "yeah, this works," the Crimson Default is the go-to choice for adventurers who appreciate tradition, stability, and the color red being very red.',
      "Each die is meticulously coated in a rich crimson hue, scientifically calibrated to increase confidence by at least 0% while giving your rolls a bold, heroic aesthetic. Whether you're slaying dragons or failing a stealth check in an empty hallway, these dice will be there... quietly glowing with understated competence."
    ],
    descriptionListTitle: "Perfect for:",
    descriptionListItems: [
      "New heroes",
      "Veteran minimalists",
      "People who don’t trust flashy nonsense (wise)"
    ]
  },
  {
    key: "emerald",
    label: "Emerald Excess",
    theme: "default",
    themeColor: "#1f7a4c",
    previewImageUrl: "/images/emerald_preview.png",
    priceLabel: "CHF 9.90",
    lockedOffer: {
      bannerLabel: "⚠️ Time limited offer:",
      countdownDurationMs: 2 * 60 * 60 * 1000,
      originalPriceLabel: "CHF 14.90",
      salePriceLabel: "CHF 9.90"
    },
    descriptionLead: "Because red was holding you back.",
    descriptionParagraphs: [
      "Each facet gleams with a refined, luxurious brilliance that leaves the standard crimson looking... outdated. Where the default simply rolls, these arrive. Unverified, but trustworthy experts report a clear surge in confidence and the distinct feeling that the odds will be on your side.",
      "Each facet gleams with polished, luxurious brilliance, quietly suggesting that every roll is about to be your moment. Unverified, but trustworthy experts claim a noticeable boost in confidence and an undeniable sense that things are finally going your way."
    ],
    descriptionListTitle: "Perfect for:",
    descriptionListItems: [
      "Players who want their dice to look richer than they are",
      "Aspiring nobles, merchants, and morally flexible paladins",
      "Anyone ready to emotionally commit to the bit"
    ]
  },
  {
    key: "obsidian",
    label: "Obsidian Cataclysm",
    theme: "default",
    themeColor: "#2b2f39",
    previewImageUrl: "/images/obsidian_preview.png",
    priceLabel: "CHF 49.90",
    promoBannerText: "🔥 Includes a +10% chance to roll a Natural 20 🔥",
    descriptionLead: "The abyss looked back. You equipped it.",
    descriptionParagraphs: [
      "Carved from the cooled remains of a mountain that had a very bad day, the Obsidian Cataclysm dice are less a cosmetic choice and more a legally questionable pact.",
      "Their surface doesn’t just show darkness, it refines it, drawing in light to create a smooth, commanding void. Hold them long enough and you may glimpse flashes of perfect turns, like a preview of your peak performance. Every edge feels impossibly precise, giving each roll a crisp, deliberate sense of power."
    ],
    descriptionListTitle: "Perfect for:",
    descriptionListItems: [
      "Warlocks who didn’t read the fine print",
      "Rogues who think shadows are a personality",
      "Anyone ready to blame destiny with confidence"
    ]
  }
];
const DICE_SKIN_CONFIG_BY_KEY = Object.fromEntries(
  DICE_SKIN_OPTIONS.map((skin) => [skin.key, skin])
);
const DICE_SHOP_REDIRECT_URL =
  "https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ";
const DICE_SHOP_OFFER_STORAGE_PREFIX = "diceShopOfferEndsAt:";
const {
  DICE_POOL_ORDER,
  MAX_DICE_POOL_COUNT,
  getDicePoolSegments: getDicePoolSegmentsBase,
  getDicePoolTotalCount: getDicePoolTotalCountBase,
  buildDicePoolNotation: buildDicePoolNotationBase,
  formatDiceNotation: formatDiceNotationBase,
  buildDiceEntry: buildDiceEntryBase,
  addDieToPoolState: addDieToPoolStateBase,
  resetDicePoolState: resetDicePoolStateBase,
  getDiceSkinKey: getDiceSkinKeyBase,
  resolveCurrentDiceSkinConfig: resolveCurrentDiceSkinConfigBase,
  parseRoute: parseRouteBase,
  routePathFor: routePathForBase,
  deriveRunMapSyncSnapshot: deriveRunMapSyncSnapshotBase,
  fogAlphaToPlayerVisibilityAlpha: fogAlphaToPlayerVisibilityAlphaBase
} = window.FWDTAppLogic;

const els = {
  status: document.getElementById("status"),
  toastContainer: document.getElementById("toastContainer"),
  topNav: document.getElementById("topNav"),
  pageLogin: document.getElementById("pageLogin"),
  loginPageLogo: document.getElementById("loginPageLogo"),
  pageWelcome: document.getElementById("pageWelcome"),
  pagePlayerHome: document.getElementById("pagePlayerHome"),
  pageScene: document.getElementById("pageScene"),
  pageCampaignMap: document.getElementById("pageCampaignMap"),
  pageSettings: document.getElementById("pageSettings"),
  pageDiceShop: document.getElementById("pageDiceShop"),
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
  mainSceneBtn: document.getElementById("mainSceneBtn"),
  mainCampaignMapBtn: document.getElementById("mainCampaignMapBtn"),
  mainPlayerInitiativeBtn: document.getElementById("mainPlayerInitiativeBtn"),
  mainPlayerMapBtn: document.getElementById("mainPlayerMapBtn"),
  mainPlayerCampaignMapBtn: document.getElementById("mainPlayerCampaignMapBtn"),
  mainPlayerSceneBtn: document.getElementById("mainPlayerSceneBtn"),
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
  diceOverlay: document.getElementById("diceOverlay"),
  dicePanel: document.getElementById("dicePanel"),
  dicePanelCloseBtn: document.getElementById("dicePanelCloseBtn"),
  diceToggleBtn: document.getElementById("diceToggleBtn"),
  diceOverlayShopBtn: document.getElementById("diceOverlayShopBtn"),
  diceRollPoolBtn: document.getElementById("diceRollPoolBtn"),
  diceResetPoolBtn: document.getElementById("diceResetPoolBtn"),
  dicePoolBadge: document.getElementById("dicePoolBadge"),
  dicePresetButtons: document.getElementById("dicePresetButtons"),
  diceStage: document.getElementById("diceStage"),
  diceResultToast: document.getElementById("diceResultToast"),
  diceResultToastExpression: document.getElementById("diceResultToastExpression"),
  diceResultToastTotal: document.getElementById("diceResultToastTotal"),
  diceResultToastBreakdown: document.getElementById("diceResultToastBreakdown"),
  playerLiveWrap: document.getElementById("playerLiveWrap"),
  playerLiveEncounterName: document.getElementById("playerLiveEncounterName"),
  playerLiveRound: document.getElementById("playerLiveRound"),
  playerLiveInitiativeWrap: document.getElementById("playerLiveInitiativeWrap"),
  playerLiveMapWrap: document.getElementById("playerLiveMapWrap"),
  playerLiveSceneWrap: document.getElementById("playerLiveSceneWrap"),
  playerLiveSceneHint: document.getElementById("playerLiveSceneHint"),
  playerLiveSceneImage: document.getElementById("playerLiveSceneImage"),
  playerLiveMapHint: document.getElementById("playerLiveMapHint"),
  playerMapViewport: document.getElementById("playerMapViewport"),
  playerMapControls: document.getElementById("playerMapControls"),
  playerMapZoomOutBtn: document.getElementById("playerMapZoomOutBtn"),
  playerMapZoomInBtn: document.getElementById("playerMapZoomInBtn"),
  playerMapResetBtn: document.getElementById("playerMapResetBtn"),
  playerMapDragLockBtn: document.getElementById("playerMapDragLockBtn"),
  playerMapPingBtn: document.getElementById("playerMapPingBtn"),
  playerMapDrawBtn: document.getElementById("playerMapDrawBtn"),
  playerMapEraseBtn: document.getElementById("playerMapEraseBtn"),
  playerMapDrawControls: document.getElementById("playerMapDrawControls"),
  playerMapDrawSizeInput: document.getElementById("playerMapDrawSizeInput"),
  playerMapDrawSizeNumber: document.getElementById("playerMapDrawSizeNumber"),
  playerMapDrawColorInput: document.getElementById("playerMapDrawColorInput"),
  playerMapScene: document.getElementById("playerMapScene"),
  playerMapImage: document.getElementById("playerMapImage"),
  playerMapDrawCanvas: document.getElementById("playerMapDrawCanvas"),
  playerMapFogImage: document.getElementById("playerMapFogImage"),
  playerMapTokens: document.getElementById("playerMapTokens"),
  playerMapPings: document.getElementById("playerMapPings"),
  playerLiveCombatantList: document.getElementById("playerLiveCombatantList"),
  settingsProfileImagePreview: document.getElementById("settingsProfileImagePreview"),
  settingsProfileImageFile: document.getElementById("settingsProfileImageFile"),
  settingsUsernameInput: document.getElementById("settingsUsernameInput"),
  saveSettingsUsernameBtn: document.getElementById("saveSettingsUsernameBtn"),
  settingsCampaignSection: document.getElementById("settingsCampaignSection"),
  settingsActiveCampaignSelect: document.getElementById("settingsActiveCampaignSelect"),
  saveSettingsActiveCampaignBtn: document.getElementById("saveSettingsActiveCampaignBtn"),
  settingsDiceSkinSelect: document.getElementById("settingsDiceSkinSelect"),
  settingsDiceSkinHint: document.getElementById("settingsDiceSkinHint"),
  settingsDiceSkinPreview: document.getElementById("settingsDiceSkinPreview"),
  settingsDiceShopBtn: document.getElementById("settingsDiceShopBtn"),
  saveSettingsDiceSkinBtn: document.getElementById("saveSettingsDiceSkinBtn"),
  settingsNewPasswordInput: document.getElementById("settingsNewPasswordInput"),
  settingsConfirmPasswordInput: document.getElementById("settingsConfirmPasswordInput"),
  saveSettingsPasswordBtn: document.getElementById("saveSettingsPasswordBtn"),
  saveSettingsProfileImageBtn: document.getElementById("saveSettingsProfileImageBtn"),
  clearSettingsProfileImageBtn: document.getElementById("clearSettingsProfileImageBtn"),
  settingsClaimSection: document.getElementById("settingsClaimSection"),
  settingsClaimList: document.getElementById("settingsClaimList"),
  diceShopList: document.getElementById("diceShopList"),
  backToSettingsFromDiceShopBtn: document.getElementById("backToSettingsFromDiceShopBtn"),
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
  scenePageTitle: document.getElementById("scenePageTitle"),
  campaignMapPageTitle: document.getElementById("campaignMapPageTitle"),
  uploadCampaignMapBtn: document.getElementById("uploadCampaignMapBtn"),
  clearCampaignMapBtn: document.getElementById("clearCampaignMapBtn"),
  backToCampaignFromMapBtn: document.getElementById("backToCampaignFromMapBtn"),
  campaignMapFile: document.getElementById("campaignMapFile"),
  campaignMapHint: document.getElementById("campaignMapHint"),
  campaignMapControls: document.getElementById("campaignMapControls"),
  campaignMapDmControls: document.getElementById("campaignMapDmControls"),
  campaignMapZoomOutBtn: document.getElementById("campaignMapZoomOutBtn"),
  campaignMapZoomInBtn: document.getElementById("campaignMapZoomInBtn"),
  campaignMapResetBtn: document.getElementById("campaignMapResetBtn"),
  campaignMapDragLockBtn: document.getElementById("campaignMapDragLockBtn"),
  campaignMapPingBtn: document.getElementById("campaignMapPingBtn"),
  campaignMapDrawBtn: document.getElementById("campaignMapDrawBtn"),
  campaignMapEraseBtn: document.getElementById("campaignMapEraseBtn"),
  campaignMapDrawControls: document.getElementById("campaignMapDrawControls"),
  campaignMapDrawSizeInput: document.getElementById("campaignMapDrawSizeInput"),
  campaignMapDrawSizeNumber: document.getElementById("campaignMapDrawSizeNumber"),
  campaignMapDrawColorInput: document.getElementById("campaignMapDrawColorInput"),
  campaignMapFogPaintBtn: document.getElementById("campaignMapFogPaintBtn"),
  campaignMapFogEraseBtn: document.getElementById("campaignMapFogEraseBtn"),
  campaignMapFogClearBtn: document.getElementById("campaignMapFogClearBtn"),
  campaignMapFogBrushControls: document.getElementById("campaignMapFogBrushControls"),
  campaignMapFogBrushSizeInput: document.getElementById("campaignMapFogBrushSizeInput"),
  campaignMapFogBrushSizeNumber: document.getElementById("campaignMapFogBrushSizeNumber"),
  campaignMapFogBrushShapeRound: document.getElementById("campaignMapFogBrushShapeRound"),
  campaignMapFogBrushShapeSquare: document.getElementById("campaignMapFogBrushShapeSquare"),
  campaignMapViewport: document.getElementById("campaignMapViewport"),
  campaignMapScene: document.getElementById("campaignMapScene"),
  campaignMapImage: document.getElementById("campaignMapImage"),
  campaignMapDrawCanvas: document.getElementById("campaignMapDrawCanvas"),
  campaignMapFogCanvas: document.getElementById("campaignMapFogCanvas"),
  campaignMapPings: document.getElementById("campaignMapPings"),
  campaignMapFogCursorPreview: document.getElementById("campaignMapFogCursorPreview"),
  sceneCampaignSelect: document.getElementById("sceneCampaignSelect"),
  openSceneModalBtn: document.getElementById("openSceneModalBtn"),
  goCampaignMapBtn: document.getElementById("goCampaignMapBtn"),
  goSceneViewBtn: document.getElementById("goSceneViewBtn"),
  backToCampaignFromSceneBtn: document.getElementById("backToCampaignFromSceneBtn"),
  sceneSearchInput: document.getElementById("sceneSearchInput"),
  shareSceneBtn: document.getElementById("shareSceneBtn"),
  createSceneForm: document.getElementById("createSceneForm"),
  sceneNameInput: document.getElementById("sceneNameInput"),
  sceneImageFile: document.getElementById("sceneImageFile"),
  sceneDraftImagePreview: document.getElementById("sceneDraftImagePreview"),
  addSceneBtn: document.getElementById("addSceneBtn"),
  sceneList: document.getElementById("sceneList"),
  scenePreviewTitle: document.getElementById("scenePreviewTitle"),
  scenePreviewHint: document.getElementById("scenePreviewHint"),
  scenePreviewImage: document.getElementById("scenePreviewImage"),
  deleteSceneBtn: document.getElementById("deleteSceneBtn"),
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
  adminDiceSkinForm: document.getElementById("adminDiceSkinForm"),
  adminDiceSkinUserHint: document.getElementById("adminDiceSkinUserHint"),
  adminDiceSkinOptions: document.getElementById("adminDiceSkinOptions"),
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
  runMapPingBtn: document.getElementById("runMapPingBtn"),
  runMapTokenSizeInput: document.getElementById("runMapTokenSizeInput"),
  runMapTokenSizeNumber: document.getElementById("runMapTokenSizeNumber"),
  runMapViewport: document.getElementById("runMapViewport"),
  runMapScene: document.getElementById("runMapScene"),
  runMapFogCanvas: document.getElementById("runMapFogCanvas"),
  runMapTokens: document.getElementById("runMapTokens"),
  runMapPings: document.getElementById("runMapPings"),
  runMapImage: document.getElementById("runMapImage"),
  runInitiativeWrap: document.getElementById("runInitiativeWrap"),
  shareScenarioBtn: document.getElementById("shareScenarioBtn"),
  completeScenarioBtn: document.getElementById("completeScenarioBtn"),
  goEditFromRunBtn: document.getElementById("goEditFromRunBtn"),
  goCampaignMapFromRunBtn: document.getElementById("goCampaignMapFromRunBtn"),
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

function openAdminActionModal(mode, options = {}) {
  setAdminStatus("");
  els.adminCreateUserForm.classList.add("hidden");
  els.adminMembershipForm.classList.add("hidden");
  els.adminDiceSkinForm.classList.add("hidden");
  if (mode === "create-user") {
    els.adminActionTitle.textContent = "Add User";
    els.adminCreateUserForm.classList.remove("hidden");
    els.adminNewUsername.focus();
  } else if (mode === "membership") {
    const campaign = state.campaigns.find((c) => c.id === state.adminMemberCampaignId);
    if (!campaign) {
      setStatus("Select a campaign first.");
      return;
    }
    els.adminActionTitle.textContent = "Add User to Campaign";
    els.adminMembershipForm.classList.remove("hidden");
    els.adminMembershipCampaignHint.textContent = `Campaign: ${campaign.name}`;
    els.adminMemberUserSelect.focus();
  } else if (mode === "dice-skins") {
    const user = options.user;
    if (!user || user.role === "admin") {
      setStatus("Select a player account for dice access.");
      return;
    }
    els.adminActionTitle.textContent = "Dice Access";
    els.adminDiceSkinForm.classList.remove("hidden");
    els.adminDiceSkinForm.dataset.userId = String(user.id);
    els.adminDiceSkinUserHint.textContent = `Player: ${user.username}`;
    els.adminDiceSkinOptions.innerHTML = "";
    const allowedDiceSkins = Array.isArray(user.allowedDiceSkins)
      ? user.allowedDiceSkins.filter((skin) => DICE_SKIN_CONFIG_BY_KEY[skin])
      : ["default"];
    for (const skin of DICE_SKIN_OPTIONS) {
      const label = document.createElement("label");
      label.className = "admin-dice-skin-option";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.value = skin.key;
      checkbox.checked = allowedDiceSkins.includes(skin.key);
      if (skin.key === "default") {
        checkbox.disabled = true;
      }
      label.appendChild(checkbox);

      const text = document.createElement("span");
      text.textContent = skin.label;
      label.appendChild(text);

      els.adminDiceSkinOptions.appendChild(label);
    }
    const firstEnabled = els.adminDiceSkinOptions.querySelector("input:not(:disabled)");
    firstEnabled?.focus();
  }
  els.adminActionModal.classList.remove("hidden");
}

function closeAdminActionModal() {
  els.adminActionModal.classList.add("hidden");
  if (els.adminDiceSkinForm) {
    delete els.adminDiceSkinForm.dataset.userId;
  }
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

function setSceneDraftImagePreview(dataUrl) {
  if (!els.sceneDraftImagePreview) return;
  if (dataUrl) {
    els.sceneDraftImagePreview.src = dataUrl;
    els.sceneDraftImagePreview.classList.remove("hidden");
  } else {
    els.sceneDraftImagePreview.src = "";
    els.sceneDraftImagePreview.classList.add("hidden");
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
  return libraryPageController.cancelMonsterEditorChanges();
}

function renderMonsterReadonlyView() {
  return libraryPageController.renderMonsterReadonlyView();
}

function toggleMonsterEditorMode() {
  return libraryPageController.toggleMonsterEditorMode();
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
  const isScene = mode === "scene";
  els.createCampaignModalForm.classList.toggle("hidden", !isCampaign);
  els.createLibraryEntryForm.classList.toggle("hidden", !isLibraryEntry);
  els.createCharacterForm.classList.toggle("hidden", !isCharacter);
  els.createSceneForm.classList.toggle("hidden", !isScene);
  els.createScenarioForm.classList.toggle(
    "hidden",
    isCharacter || isCampaign || isLibraryEntry || isScene
  );
  if (isCampaign) {
    els.campaignActionTitle.textContent = "Create Campaign";
  } else if (isLibraryEntry) {
    els.campaignActionTitle.textContent = "New Library Entry";
  } else if (isScene) {
    els.campaignActionTitle.textContent = "Add Scene";
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
  } else if (isScene) {
    els.sceneNameInput.value = "";
    els.sceneImageFile.value = "";
    state.draftSceneImageData = "";
    setSceneDraftImagePreview("");
    els.sceneNameInput.focus();
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
  return combatUiController.combatantKindLabel(combatant);
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
  return combatUiController.createCombatantNameElement(combatant);
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

function showPage(page) {
  state.page = page;
  if (page !== "player-home") {
    stopPlayerLivePolling();
  }
  if (page !== "scenario-map") {
    stopRunMapSyncPolling();
  }
  if (page !== "campaign-map") {
    stopCampaignMapSyncPolling();
  }
  if (page !== "dice-shop") {
    stopDiceShopOfferTimer();
  }
  document.body.classList.toggle("page-login", page === "login");
  document.body.classList.toggle("page-player", page === "player-home");
  document.body.classList.toggle(
    "page-run",
    page === "scenario-run" || page === "scenario-map" || page === "campaign-map"
  );
  els.pageLogin.classList.toggle("hidden", page !== "login");
  els.loginPageLogo.classList.toggle("hidden", page !== "login");
  const hideTopNav = page === "login" || (state.authUser?.role !== "admin");
  els.topNav.classList.toggle("hidden", hideTopNav);
  els.pageWelcome.classList.toggle("hidden", page !== "welcome");
  els.pagePlayerHome.classList.toggle("hidden", page !== "player-home");
  els.pageCampaignMap.classList.toggle("hidden", page !== "campaign-map");
  els.pageSettings.classList.toggle("hidden", page !== "settings");
  els.pageDiceShop.classList.toggle("hidden", page !== "dice-shop");
  els.pageMonsters.classList.toggle("hidden", page !== "monsters");
  els.pageAnalytics.classList.toggle("hidden", page !== "analytics");
  els.pageAdmin.classList.toggle("hidden", page !== "admin");
  els.pageCampaign.classList.toggle("hidden", page !== "campaign");
  els.pageScene.classList.toggle("hidden", page !== "campaign-scene");
  els.pageCampaignCompleted.classList.toggle("hidden", page !== "campaign-completed");
  els.pageScenarioEdit.classList.toggle("hidden", page !== "scenario-edit");
  els.pageScenarioCompletedEdit.classList.toggle("hidden", page !== "scenario-completed-edit");
  els.pageScenarioRun.classList.toggle("hidden", !(page === "scenario-run" || page === "scenario-map"));
  renderMainSections();
  renderDiceOverlay();
  renderNav();
}

function renderMainSections() {
  const isAuthed = Boolean(state.authUser);
  const isPlayer = isAuthed && state.authUser?.role !== "admin";
  els.mainHomeBtn.classList.toggle("hidden", !isAuthed || isPlayer);
  els.mainSceneBtn.classList.toggle("hidden", !isAuthed || isPlayer);
  els.mainCampaignMapBtn.classList.toggle("hidden", !isAuthed || isPlayer);
  els.mainPlayerInitiativeBtn.classList.toggle("hidden", !isPlayer);
  els.mainPlayerMapBtn.classList.toggle("hidden", !isPlayer);
  els.mainPlayerCampaignMapBtn.classList.toggle("hidden", !isPlayer);
  els.mainPlayerSceneBtn.classList.toggle("hidden", !isPlayer);
  els.userMenu.classList.toggle("hidden", !isAuthed);
  const showLibrary = isAuthed && state.authUser?.role === "admin";
  const showAnalytics = isAuthed;
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
    state.page === "campaign-map" ||
    state.page === "campaign-scene" ||
    state.page === "campaign-completed" ||
    state.page === "scenario-edit" ||
    state.page === "scenario-completed-edit" ||
    state.page === "scenario-run" ||
    state.page === "scenario-map";
  els.mainHomeBtn.classList.toggle("active", inHome);
  const inPlayerHome = state.page === "player-home";
  els.mainPlayerInitiativeBtn.classList.toggle(
    "active",
    inPlayerHome && state.playerLiveViewMode === "initiative"
  );
  els.mainPlayerMapBtn.classList.toggle(
    "active",
    inPlayerHome && state.playerLiveViewMode === "map"
  );
  els.mainPlayerCampaignMapBtn.classList.toggle(
    "active",
    inPlayerHome && state.playerLiveViewMode === "campaign-map"
  );
  els.mainPlayerSceneBtn.classList.toggle(
    "active",
    inPlayerHome && state.playerLiveViewMode === "scene"
  );
  els.mainSceneBtn.classList.toggle("active", state.page === "campaign-scene");
  els.mainCampaignMapBtn.classList.toggle("active", state.page === "campaign-map");
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
    state.page === "campaign-map" ||
    state.page === "campaign-scene" ||
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
      state.page === "campaign-map" ||
      state.page === "campaign-scene" ||
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
  const showSceneCrumb = inHomePath && Boolean(campaign) && state.page === "campaign-scene";
  const showCampaignMapCrumb = inHomePath && Boolean(campaign) && state.page === "campaign-map";
  const showCompletedScenarioCrumb =
    inHomePath &&
    Boolean(scenario) &&
    state.page === "scenario-completed-edit";
  els.navScenarioBtn.classList.toggle(
    "hidden",
    !(showScenarioCrumb || showCompletedScenarioCrumb || showSceneCrumb || showCampaignMapCrumb)
  );
  els.navSepScenario.classList.toggle(
    "hidden",
    !(showScenarioCrumb || showCompletedScenarioCrumb || showSceneCrumb || showCampaignMapCrumb)
  );
  if (showCampaignMapCrumb) {
    els.navScenarioBtn.textContent = "Campaign Map";
    els.navScenarioBtn.disabled = true;
  } else if (showSceneCrumb) {
    els.navScenarioBtn.textContent = "Scene View";
    els.navScenarioBtn.disabled = true;
  } else if ((showScenarioCrumb || showCompletedScenarioCrumb) && scenario) {
    els.navScenarioBtn.textContent = scenario.name;
    els.navScenarioBtn.disabled =
      state.page === "scenario-edit" ||
      state.page === "scenario-run" ||
      state.page === "scenario-map" ||
      state.page === "scenario-completed-edit";
  }
}

function renderWelcomeCampaigns() {
  return welcomePageController.renderWelcomeCampaigns();
}

function clearMonsterForm() {
  return libraryPageController.clearMonsterForm();
}

function fillMonsterForm(monster) {
  return libraryPageController.fillMonsterForm(monster);
}

function monsterFormPayload() {
  return libraryPageController.monsterFormPayload();
}

function renderMonsterList() {
  return libraryPageController.renderMonsterList();
}

function renderEnemyMonsterOptions(searchQuery = "") {
  return libraryPageController.renderEnemyMonsterOptions(searchQuery);
}

async function loadMonsters() {
  return libraryPageController.loadMonsters();
}

function renderCharacters() {
  return campaignPageController.renderCharacters();
}

function renderScenarios() {
  return campaignPageController.renderScenarios();
}

function renderCompletedScenariosPage() {
  return campaignPageController.renderCompletedScenariosPage();
}

function attachInitiativeBlurUpdate(input, combatant) {
  return combatUiController.attachInitiativeBlurUpdate(input, combatant);
}

function attachEnemyHpBlurUpdate(input, combatant) {
  return combatUiController.attachEnemyHpBlurUpdate(input, combatant);
}

function setupRunQuickEditInput(input) {
  return combatUiController.setupRunQuickEditInput(input);
}

function rerenderCurrentScenarioPage() {
  if (state.page === "scenario-edit") renderScenarioEditPage();
  if (state.page === "scenario-run" || state.page === "scenario-map") renderScenarioRunPage();
}

function setMapHoverCombatantRow(combatantId, isPlayerView, on) {
  return scenarioRunPageController.setMapHoverCombatantRow(combatantId, isPlayerView, on);
}

function focusPreviewOnActiveNonPc() {
  return scenarioRunPageController.focusPreviewOnActiveNonPc();
}

function scrollRunInitiativeToActive({ smooth = true } = {}) {
  return scenarioRunPageController.scrollRunInitiativeToActive({ smooth });
}

function scrollPlayerInitiativeToActive({ smooth = true } = {}) {
  if (!els.playerLiveCombatantList) return;
  const activeRow = els.playerLiveCombatantList.querySelector("li.turn-active");
  if (!(activeRow instanceof HTMLElement)) return;
  const behavior = smooth ? "smooth" : "auto";
  window.requestAnimationFrame(() => {
    activeRow.scrollIntoView({
      block: "nearest",
      inline: "nearest",
      behavior
    });
  });
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

function loadCampaignMapDrawBrushSizeFromSession() {
  try {
    const raw = window.sessionStorage.getItem(CAMPAIGN_MAP_DRAW_BRUSH_SIZE_SESSION_KEY);
    if (raw == null) return null;
    const parsed = Number(raw);
    if (!Number.isFinite(parsed)) return null;
    return clamp(Math.round(parsed), 2, 32);
  } catch (_error) {
    return null;
  }
}

function saveCampaignMapDrawBrushSizeToSession(size) {
  try {
    window.sessionStorage.setItem(CAMPAIGN_MAP_DRAW_BRUSH_SIZE_SESSION_KEY, String(size));
  } catch (_error) {
    // Ignore storage failures.
  }
}

function normalizeHexColor(value, fallback = DEFAULT_CAMPAIGN_MAP_DRAW_COLOR) {
  const raw = `${value || ""}`.trim();
  if (/^#[0-9a-f]{6}$/i.test(raw)) return raw.toLowerCase();
  return fallback;
}

function loadCampaignMapDrawColorFromSession() {
  try {
    return normalizeHexColor(
      window.sessionStorage.getItem(CAMPAIGN_MAP_DRAW_COLOR_SESSION_KEY),
      DEFAULT_CAMPAIGN_MAP_DRAW_COLOR
    );
  } catch (_error) {
    return DEFAULT_CAMPAIGN_MAP_DRAW_COLOR;
  }
}

function saveCampaignMapDrawColorToSession(color) {
  try {
    window.sessionStorage.setItem(
      CAMPAIGN_MAP_DRAW_COLOR_SESSION_KEY,
      normalizeHexColor(color, DEFAULT_CAMPAIGN_MAP_DRAW_COLOR)
    );
  } catch (_error) {
    // Ignore storage failures.
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

function focusRunMapViewportForShortcuts() {
  const viewport = els.runMapViewport;
  if (!(viewport instanceof HTMLElement)) return;
  if (!viewport.hasAttribute("tabindex")) {
    viewport.setAttribute("tabindex", "-1");
  }
  const active = document.activeElement;
  if (
    active instanceof HTMLElement &&
    active !== viewport &&
    (
      active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.tagName === "SELECT" ||
      active.isContentEditable
    )
  ) {
    active.blur();
  }
  viewport.focus({ preventScroll: true });
}

function focusCampaignMapViewportForShortcuts() {
  const viewport = els.campaignMapViewport;
  if (!(viewport instanceof HTMLElement)) return;
  if (!viewport.hasAttribute("tabindex")) {
    viewport.setAttribute("tabindex", "-1");
  }
  const active = document.activeElement;
  if (
    active instanceof HTMLElement &&
    active !== viewport &&
    (
      active.tagName === "INPUT" ||
      active.tagName === "TEXTAREA" ||
      active.tagName === "SELECT" ||
      active.isContentEditable
    )
  ) {
    active.blur();
  }
  viewport.focus({ preventScroll: true });
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
  if (nextMode !== "navigate" && state.runMap.pingMode) {
    setRunMapPingModeUi(false);
  }
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
          data[i + 3] = fogAlphaToPlayerVisibilityAlphaBase(fogAlpha);
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

function playerMapPointerToImageCoords(event) {
  if (!els.playerMapViewport || !els.playerMapImage) return null;
  if (!els.playerMapImage.naturalWidth || !els.playerMapImage.naturalHeight) return null;
  const rect = els.playerMapViewport.getBoundingClientRect();
  const pointerX = event.clientX - rect.left;
  const pointerY = event.clientY - rect.top;
  const viewportWidth = els.playerMapViewport.clientWidth;
  const viewportHeight = els.playerMapViewport.clientHeight;
  if (viewportWidth <= 0 || viewportHeight <= 0) return null;
  const baseScale = Math.min(
    viewportWidth / els.playerMapImage.naturalWidth,
    viewportHeight / els.playerMapImage.naturalHeight
  );
  const totalScale = baseScale * state.playerMap.zoom;
  if (!Number.isFinite(totalScale) || totalScale <= 0) return null;
  const imageX = (pointerX - state.playerMap.panX) / totalScale;
  const imageY = (pointerY - state.playerMap.panY) / totalScale;
  return {
    x: clamp(imageX, 0, els.playerMapImage.naturalWidth),
    y: clamp(imageY, 0, els.playerMapImage.naturalHeight)
  };
}

function parseMapPingJson(raw) {
  const text = `${raw || ""}`.trim();
  if (!text) return null;
  try {
    const parsed = JSON.parse(text);
    const x = Number(parsed?.x);
    const y = Number(parsed?.y);
    const id = `${parsed?.id || ""}`.trim();
    if (!Number.isFinite(x) || !Number.isFinite(y) || !id) return null;
    return {
      id,
      x,
      y,
      source: `${parsed?.source || ""}`.trim() || "dm",
      sentAt: `${parsed?.sentAt || ""}`.trim() || null
    };
  } catch (_error) {
    return null;
  }
}

function renderMapPing(container, ping) {
  if (!(container instanceof HTMLElement) || !ping) return;
  playPingSound();
  const marker = document.createElement("div");
  marker.className = "map-ping-marker";
  marker.style.left = `${ping.x}px`;
  marker.style.top = `${ping.y}px`;
  const core = document.createElement("span");
  core.className = "map-ping-core";
  core.textContent = "?";
  marker.appendChild(core);
  const waveOne = document.createElement("span");
  waveOne.className = "map-ping-wave";
  marker.appendChild(waveOne);
  const waveTwo = document.createElement("span");
  waveTwo.className = "map-ping-wave";
  waveTwo.style.animationDelay = "190ms";
  marker.appendChild(waveTwo);
  container.appendChild(marker);
  setTimeout(() => {
    marker.remove();
  }, 1600);
}

async function playPingSound() {
  if (!state.pingAudioElement) {
    state.pingAudioElement = new Audio("/sounds/ping.mp3");
    state.pingAudioElement.preload = "auto";
    state.pingAudioElement.volume = 0.9;
  }
  state.pingAudioElement.currentTime = 0;
  try {
    await state.pingAudioElement.play();
  } catch (_error) {
    // Ignore autoplay/device restrictions.
  }
}

function maybeShowRunMapPing(pingRaw) {
  const ping = parseMapPingJson(pingRaw);
  if (!ping) return;
  if (state.runMap.lastPingId === ping.id) return;
  state.runMap.lastPingId = ping.id;
  const sentAtMs = ping.sentAt ? Date.parse(ping.sentAt) : NaN;
  if (Number.isFinite(sentAtMs) && Date.now() - sentAtMs > 8000) return;
  renderMapPing(els.runMapPings, ping);
}

function maybeShowPlayerMapPing(pingRaw) {
  const ping = parseMapPingJson(pingRaw);
  if (!ping) return;
  if (state.playerMap.lastPingId === ping.id) return;
  state.playerMap.lastPingId = ping.id;
  const sentAtMs = ping.sentAt ? Date.parse(ping.sentAt) : NaN;
  if (Number.isFinite(sentAtMs) && Date.now() - sentAtMs > 8000) return;
  renderMapPing(els.playerMapPings, ping);
}

async function sendRunMapPing(scenarioId, x, y) {
  if (!Number.isInteger(scenarioId)) return;
  try {
    await api(`/api/scenarios/${scenarioId}/map-ping`, {
      method: "POST",
      body: JSON.stringify({ x, y })
    });
  } catch (error) {
    setStatus(error.message, "error");
  }
}

async function sendPlayerMapPing(scenarioId, x, y) {
  if (!Number.isInteger(scenarioId)) return;
  try {
    await api("/api/player/live/map-ping", {
      method: "POST",
      body: JSON.stringify({ scenarioId, x, y })
    });
  } catch (_error) {
    // Ignore transient ping errors for players.
  }
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

function setRunMapPingModeUi(enabled) {
  state.runMap.pingMode = Boolean(enabled);
  if (els.runMapPingBtn) {
    els.runMapPingBtn.setAttribute("aria-pressed", state.runMap.pingMode ? "true" : "false");
  }
  if (state.runMap.pingMode && state.runMap.fogMode !== "navigate") {
    setRunMapFogMode("navigate");
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

function setPlayerMapPingModeUi(enabled) {
  state.playerMap.pingMode = Boolean(enabled);
  if (els.playerMapPingBtn) {
    els.playerMapPingBtn.setAttribute("aria-pressed", state.playerMap.pingMode ? "true" : "false");
  }
  if (state.playerMap.pingMode && state.playerMap.drawMode !== "navigate") {
    setPlayerMapDrawModeUi("navigate");
  }
}

function setPlayerMapDrawModeUi(mode) {
  const nextMode = mode === "draw" || mode === "erase" ? mode : "navigate";
  state.playerMap.drawMode = nextMode;
  if (els.playerMapDrawBtn) {
    els.playerMapDrawBtn.setAttribute("aria-pressed", nextMode === "draw" ? "true" : "false");
  }
  if (els.playerMapEraseBtn) {
    els.playerMapEraseBtn.setAttribute("aria-pressed", nextMode === "erase" ? "true" : "false");
  }
  if (els.playerMapViewport) {
    els.playerMapViewport.classList.toggle("map-draw-mode", nextMode !== "navigate");
  }
  if (els.playerMapDrawControls) {
    els.playerMapDrawControls.classList.toggle("hidden", nextMode === "navigate");
  }
  if (nextMode !== "navigate" && state.playerMap.pingMode) {
    setPlayerMapPingModeUi(false);
  }
}

function setPlayerMapDrawBrushSizeUi(size) {
  const finalSize = clamp(Math.round(Number(size) || DEFAULT_CAMPAIGN_MAP_DRAW_BRUSH_SIZE), 2, 32);
  state.playerMap.drawBrushSize = finalSize;
  if (els.playerMapDrawSizeInput) {
    els.playerMapDrawSizeInput.value = String(finalSize);
  }
  if (els.playerMapDrawSizeNumber) {
    els.playerMapDrawSizeNumber.value = String(finalSize);
  }
}

function setPlayerMapDrawColorUi(color) {
  const finalColor = normalizeHexColor(color, DEFAULT_CAMPAIGN_MAP_DRAW_COLOR);
  state.playerMap.drawColor = finalColor;
  if (els.playerMapDrawColorInput) {
    els.playerMapDrawColorInput.value = finalColor;
  }
}

function drawStrokeOnSharedMapCanvas(canvas, fromX, fromY, toX, toY, mode, brushSize, color) {
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const startX = Number.isFinite(fromX) ? fromX : toX;
  const startY = Number.isFinite(fromY) ? fromY : toY;
  const endX = Number.isFinite(toX) ? toX : startX;
  const endY = Number.isFinite(toY) ? toY : startY;
  const finalBrushSize = clamp(Math.round(Number(brushSize) || DEFAULT_CAMPAIGN_MAP_DRAW_BRUSH_SIZE), 2, 32);
  const finalColor = normalizeHexColor(color, DEFAULT_CAMPAIGN_MAP_DRAW_COLOR);
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.lineWidth = finalBrushSize * 2;
  ctx.globalCompositeOperation = mode === "erase" ? "destination-out" : "source-over";
  ctx.strokeStyle = finalColor;
  ctx.fillStyle = finalColor;
  if (startX === endX && startY === endY) {
    ctx.beginPath();
    ctx.arc(endX, endY, finalBrushSize, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  ctx.restore();
}

function serializeSharedMapCanvas(canvas) {
  if (!(canvas instanceof HTMLCanvasElement) || canvas.width <= 0 || canvas.height <= 0) return "";
  const ctx = canvas.getContext("2d");
  if (!ctx) return "";
  const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] > 8) {
      return canvas.toDataURL("image/png");
    }
  }
  return "";
}

function loadDataUrlIntoCanvas(canvas, raw) {
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (!raw) return;
  const image = new Image();
  image.onload = () => {
    const nextCtx = canvas.getContext("2d");
    if (!nextCtx) return;
    nextCtx.clearRect(0, 0, canvas.width, canvas.height);
    nextCtx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
  image.src = raw;
}

function ensurePlayerMapDrawCanvasSize() {
  const canvas = els.playerMapDrawCanvas;
  const image = els.playerMapImage;
  if (!(canvas instanceof HTMLCanvasElement) || !image) return false;
  if (!image.naturalWidth || !image.naturalHeight) return false;
  if (canvas.width !== image.naturalWidth || canvas.height !== image.naturalHeight) {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
  }
  return true;
}

function clearPlayerMapDrawCanvas() {
  const canvas = els.playerMapDrawCanvas;
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function ensurePlayerMapDrawCanvasFromData(drawData) {
  if (!Number.isInteger(state.playerMap.scenarioId)) return;
  if (!ensurePlayerMapDrawCanvasSize()) return;
  const normalizedDrawData = `${drawData || ""}`.trim();
  const key = `${state.playerMap.scenarioId}:${normalizedDrawData}`;
  if (state.playerMap.drawCanvasLoadedKey === key) return;
  state.playerMap.drawCanvasLoadedKey = key;
  loadDataUrlIntoCanvas(els.playerMapDrawCanvas, normalizedDrawData);
}

function paintPlayerMapDrawAt(x, y, mode = "draw") {
  if (!ensurePlayerMapDrawCanvasSize()) return;
  drawStrokeOnSharedMapCanvas(
    els.playerMapDrawCanvas,
    state.playerMap.lastDrawX,
    state.playerMap.lastDrawY,
    x,
    y,
    mode,
    state.playerMap.drawBrushSize,
    state.playerMap.drawColor
  );
  state.playerMap.lastDrawX = x;
  state.playerMap.lastDrawY = y;
}

function serializePlayerMapDrawCanvas() {
  return serializeSharedMapCanvas(els.playerMapDrawCanvas);
}

async function persistPlayerCampaignMapDraw(campaignId, drawData) {
  if (!Number.isInteger(campaignId)) return;
  try {
    const result = await api("/api/player/live/campaign-map-draw", {
      method: "POST",
      body: JSON.stringify({ campaignId, drawData })
    });
    const normalized = `${result?.mapDrawData || ""}`;
    state.playerMap.drawCanvasLoadedKey = `${campaignId}:${normalized}`;
    if (
      state.playerLiveData?.campaignMap &&
      Number(state.playerLiveData.campaignMap.campaignId) === campaignId
    ) {
      state.playerLiveData = {
        ...state.playerLiveData,
        campaignMap: {
          ...state.playerLiveData.campaignMap,
          mapDrawData: normalized,
          updatedAt: result?.updatedAt ?? state.playerLiveData.campaignMap.updatedAt ?? null
        }
      };
    }
  } catch (_error) {
    // Keep local drawing smooth even on transient network/API failures.
  }
}

function campaignMapCurrentTotalScale() {
  if (!els.campaignMapViewport || !els.campaignMapImage) return null;
  if (!els.campaignMapImage.naturalWidth || !els.campaignMapImage.naturalHeight) return null;
  const viewportWidth = els.campaignMapViewport.clientWidth;
  const viewportHeight = els.campaignMapViewport.clientHeight;
  if (viewportWidth <= 0 || viewportHeight <= 0) return null;
  const baseScale = Math.min(
    viewportWidth / els.campaignMapImage.naturalWidth,
    viewportHeight / els.campaignMapImage.naturalHeight
  );
  const totalScale = baseScale * state.campaignMap.zoom;
  if (!Number.isFinite(totalScale) || totalScale <= 0) return null;
  return totalScale;
}

function hideCampaignMapFogCursorPreview() {
  if (!els.campaignMapFogCursorPreview) return;
  els.campaignMapFogCursorPreview.classList.add("hidden");
}

function updateCampaignMapFogCursorPreview(clientX, clientY, eventTarget = null) {
  if (!els.campaignMapViewport || !els.campaignMapFogCursorPreview) return;
  if (state.page !== "campaign-map" || state.campaignMap.fogMode === "navigate") {
    hideCampaignMapFogCursorPreview();
    return;
  }
  if (els.campaignMapImage.classList.contains("hidden")) {
    hideCampaignMapFogCursorPreview();
    return;
  }
  if (
    eventTarget instanceof Element &&
    eventTarget.closest(".map-touch-controls, .map-fog-brush-controls, .map-draw-controls")
  ) {
    hideCampaignMapFogCursorPreview();
    return;
  }
  const rect = els.campaignMapViewport.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;
  if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
    hideCampaignMapFogCursorPreview();
    return;
  }
  const totalScale = campaignMapCurrentTotalScale();
  if (!totalScale) {
    hideCampaignMapFogCursorPreview();
    return;
  }
  const radius = clamp((Number(state.campaignMap.fogBrushSize) || 56) * totalScale, 6, 520);
  const diameter = radius * 2;
  const preview = els.campaignMapFogCursorPreview;
  preview.classList.toggle("is-square", state.campaignMap.fogBrushShape === "square");
  preview.style.left = `${x}px`;
  preview.style.top = `${y}px`;
  preview.style.width = `${diameter}px`;
  preview.style.height = `${diameter}px`;
  preview.dataset.clientX = String(clientX);
  preview.dataset.clientY = String(clientY);
  preview.classList.remove("hidden");
}

function setCampaignMapFogMode(mode) {
  const nextMode = mode === "paint" || mode === "erase" ? mode : "navigate";
  state.campaignMap.fogMode = nextMode;
  if (nextMode !== "navigate" && state.campaignMap.pingMode) {
    setCampaignMapPingModeUi(false);
  }
  if (nextMode !== "navigate" && state.campaignMap.drawMode !== "navigate") {
    setCampaignMapDrawMode("navigate");
  }
  if (els.campaignMapFogPaintBtn) {
    els.campaignMapFogPaintBtn.setAttribute("aria-pressed", nextMode === "paint" ? "true" : "false");
  }
  if (els.campaignMapFogEraseBtn) {
    els.campaignMapFogEraseBtn.setAttribute("aria-pressed", nextMode === "erase" ? "true" : "false");
  }
  if (els.campaignMapViewport) {
    els.campaignMapViewport.classList.toggle("fog-paint-mode", nextMode !== "navigate");
  }
  if (els.campaignMapFogBrushControls) {
    els.campaignMapFogBrushControls.classList.toggle("hidden", nextMode === "navigate");
  }
  if (nextMode === "navigate") {
    hideCampaignMapFogCursorPreview();
  }
}

function setCampaignMapDragLockUi(locked) {
  state.campaignMap.dragLocked = Boolean(locked);
  if (els.campaignMapViewport) {
    els.campaignMapViewport.classList.toggle("drag-locked", state.campaignMap.dragLocked);
  }
  if (els.campaignMapDragLockBtn) {
    els.campaignMapDragLockBtn.setAttribute(
      "aria-pressed",
      state.campaignMap.dragLocked ? "true" : "false"
    );
    els.campaignMapDragLockBtn.setAttribute(
      "aria-label",
      state.campaignMap.dragLocked ? "Unlock map dragging" : "Lock map dragging"
    );
    els.campaignMapDragLockBtn.title = state.campaignMap.dragLocked
      ? "Unlock Dragging"
      : "Lock Dragging";
  }
}

function setCampaignMapPingModeUi(enabled) {
  state.campaignMap.pingMode = Boolean(enabled);
  if (els.campaignMapPingBtn) {
    els.campaignMapPingBtn.setAttribute(
      "aria-pressed",
      state.campaignMap.pingMode ? "true" : "false"
    );
  }
  if (state.campaignMap.pingMode && state.campaignMap.fogMode !== "navigate") {
    setCampaignMapFogMode("navigate");
  }
  if (state.campaignMap.pingMode && state.campaignMap.drawMode !== "navigate") {
    setCampaignMapDrawMode("navigate");
  }
}

function setCampaignMapDrawMode(mode) {
  const nextMode = mode === "draw" || mode === "erase" ? mode : "navigate";
  state.campaignMap.drawMode = nextMode;
  if (els.campaignMapDrawBtn) {
    els.campaignMapDrawBtn.setAttribute("aria-pressed", nextMode === "draw" ? "true" : "false");
  }
  if (els.campaignMapEraseBtn) {
    els.campaignMapEraseBtn.setAttribute("aria-pressed", nextMode === "erase" ? "true" : "false");
  }
  if (els.campaignMapViewport) {
    els.campaignMapViewport.classList.toggle("map-draw-mode", nextMode !== "navigate");
  }
  if (els.campaignMapDrawControls) {
    els.campaignMapDrawControls.classList.toggle("hidden", nextMode === "navigate");
  }
  if (nextMode !== "navigate" && state.campaignMap.pingMode) {
    setCampaignMapPingModeUi(false);
  }
  if (nextMode !== "navigate" && state.campaignMap.fogMode !== "navigate") {
    setCampaignMapFogMode("navigate");
  }
}

function setCampaignMapDrawBrushSizeUi(size) {
  const finalSize = clamp(Math.round(Number(size) || DEFAULT_CAMPAIGN_MAP_DRAW_BRUSH_SIZE), 2, 32);
  state.campaignMap.drawBrushSize = finalSize;
  if (els.campaignMapDrawSizeInput) {
    els.campaignMapDrawSizeInput.value = String(finalSize);
  }
  if (els.campaignMapDrawSizeNumber) {
    els.campaignMapDrawSizeNumber.value = String(finalSize);
  }
}

function setCampaignMapDrawColorUi(color) {
  const finalColor = normalizeHexColor(color, DEFAULT_CAMPAIGN_MAP_DRAW_COLOR);
  state.campaignMap.drawColor = finalColor;
  if (els.campaignMapDrawColorInput) {
    els.campaignMapDrawColorInput.value = finalColor;
  }
}

function setCampaignMapFogBrushSizeUi(size) {
  const finalSize = clamp(Math.round(Number(size) || 56), 12, 220);
  state.campaignMap.fogBrushSize = finalSize;
  if (els.campaignMapFogBrushSizeInput) {
    els.campaignMapFogBrushSizeInput.value = String(finalSize);
  }
  if (els.campaignMapFogBrushSizeNumber) {
    els.campaignMapFogBrushSizeNumber.value = String(finalSize);
  }
}

function setCampaignMapFogBrushShapeUi(shape) {
  const finalShape = shape === "square" ? "square" : "round";
  state.campaignMap.fogBrushShape = finalShape;
  if (els.campaignMapFogBrushShapeRound) {
    els.campaignMapFogBrushShapeRound.checked = finalShape === "round";
  }
  if (els.campaignMapFogBrushShapeSquare) {
    els.campaignMapFogBrushShapeSquare.checked = finalShape === "square";
  }
  if (els.campaignMapFogCursorPreview) {
    els.campaignMapFogCursorPreview.classList.toggle("is-square", finalShape === "square");
  }
}

function applyCampaignMapTransform() {
  const viewport = els.campaignMapViewport;
  const image = els.campaignMapImage;
  const scene = els.campaignMapScene;
  if (!viewport || !image || !scene || image.classList.contains("hidden")) return;
  if (!image.naturalWidth || !image.naturalHeight) return;

  const viewportWidth = viewport.clientWidth;
  const viewportHeight = viewport.clientHeight;
  if (viewportWidth <= 0 || viewportHeight <= 0) return;

  const baseScale = Math.min(viewportWidth / image.naturalWidth, viewportHeight / image.naturalHeight);
  const totalScale = baseScale * state.campaignMap.zoom;
  const scaledWidth = image.naturalWidth * totalScale;
  const scaledHeight = image.naturalHeight * totalScale;

  if (scaledWidth <= viewportWidth) {
    state.campaignMap.panX = (viewportWidth - scaledWidth) / 2;
  } else {
    const minX = viewportWidth - scaledWidth;
    state.campaignMap.panX = clamp(state.campaignMap.panX, minX, 0);
  }

  if (scaledHeight <= viewportHeight) {
    state.campaignMap.panY = (viewportHeight - scaledHeight) / 2;
  } else {
    const minY = viewportHeight - scaledHeight;
    state.campaignMap.panY = clamp(state.campaignMap.panY, minY, 0);
  }

  scene.style.width = `${image.naturalWidth}px`;
  scene.style.height = `${image.naturalHeight}px`;
  scene.style.transformOrigin = "top left";
  scene.style.transform = `translate(${state.campaignMap.panX}px, ${state.campaignMap.panY}px) scale(${totalScale})`;
  if (els.campaignMapFogCursorPreview && !els.campaignMapFogCursorPreview.classList.contains("hidden")) {
    const clientX = Number(els.campaignMapFogCursorPreview.dataset.clientX);
    const clientY = Number(els.campaignMapFogCursorPreview.dataset.clientY);
    if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
      updateCampaignMapFogCursorPreview(clientX, clientY);
    }
  }
}

function resetCampaignMapView(campaignId, mapKey) {
  state.campaignMap.campaignId = Number.isInteger(campaignId) ? campaignId : null;
  state.campaignMap.mapKey = `${mapKey || ""}`;
  state.campaignMap.zoom = 1;
  state.campaignMap.panX = 0;
  state.campaignMap.panY = 0;
  state.campaignMap.dragging = false;
  state.campaignMap.pointerId = null;
  state.campaignMap.drawPainting = false;
  state.campaignMap.drawPointerId = null;
  state.campaignMap.lastDrawX = null;
  state.campaignMap.lastDrawY = null;
  state.campaignMap.fogPainting = false;
  state.campaignMap.fogPointerId = null;
  state.campaignMap.pendingRemoteSync = null;
  if (state.campaignMap.saveDrawTimer) {
    clearTimeout(state.campaignMap.saveDrawTimer);
    state.campaignMap.saveDrawTimer = null;
  }
  state.campaignMap.drawCanvasLoadedCampaignId = null;
  state.campaignMap.drawCanvasLoadedKey = null;
  setCampaignMapPingModeUi(false);
  setCampaignMapDrawMode("navigate");
  applyCampaignMapTransform();
}

function ensureCampaignMapFogCanvasSize() {
  const canvas = els.campaignMapFogCanvas;
  const image = els.campaignMapImage;
  if (!(canvas instanceof HTMLCanvasElement) || !image) return false;
  if (!image.naturalWidth || !image.naturalHeight) return false;
  if (canvas.width !== image.naturalWidth || canvas.height !== image.naturalHeight) {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
  }
  return true;
}

function ensureCampaignMapDrawCanvasSize() {
  const canvas = els.campaignMapDrawCanvas;
  const image = els.campaignMapImage;
  if (!(canvas instanceof HTMLCanvasElement) || !image) return false;
  if (!image.naturalWidth || !image.naturalHeight) return false;
  if (canvas.width !== image.naturalWidth || canvas.height !== image.naturalHeight) {
    canvas.width = image.naturalWidth;
    canvas.height = image.naturalHeight;
  }
  return true;
}

function clearCampaignMapFogCanvas() {
  const canvas = els.campaignMapFogCanvas;
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function clearCampaignMapDrawCanvas() {
  const canvas = els.campaignMapDrawCanvas;
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawFogDataToCampaignMapCanvas(fogData) {
  if (!ensureCampaignMapFogCanvasSize()) return;
  clearCampaignMapFogCanvas();
  const raw = `${fogData || ""}`.trim();
  if (!raw) return;
  const image = new Image();
  image.onload = () => {
    const canvas = els.campaignMapFogCanvas;
    if (!(canvas instanceof HTMLCanvasElement)) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  };
  image.src = raw;
}

function ensureCampaignMapFogCanvasFromData(fogData) {
  if (!Number.isInteger(state.campaignMap.campaignId)) return;
  if (!ensureCampaignMapFogCanvasSize()) return;
  const normalizedFogData = `${fogData || ""}`.trim();
  const key = `${state.campaignMap.campaignId}:${normalizedFogData}`;
  if (
    state.campaignMap.fogCanvasLoadedCampaignId === state.campaignMap.campaignId &&
    state.campaignMap.fogCanvasLoadedKey === key
  ) {
    return;
  }
  state.campaignMap.fogCanvasLoadedCampaignId = state.campaignMap.campaignId;
  state.campaignMap.fogCanvasLoadedKey = key;
  drawFogDataToCampaignMapCanvas(normalizedFogData);
}

function ensureCampaignMapDrawCanvasFromData(drawData) {
  if (!Number.isInteger(state.campaignMap.campaignId)) return;
  if (!ensureCampaignMapDrawCanvasSize()) return;
  const normalizedDrawData = `${drawData || ""}`.trim();
  const key = `${state.campaignMap.campaignId}:${normalizedDrawData}`;
  if (
    state.campaignMap.drawCanvasLoadedCampaignId === state.campaignMap.campaignId &&
    state.campaignMap.drawCanvasLoadedKey === key
  ) {
    return;
  }
  state.campaignMap.drawCanvasLoadedCampaignId = state.campaignMap.campaignId;
  state.campaignMap.drawCanvasLoadedKey = key;
  loadDataUrlIntoCanvas(els.campaignMapDrawCanvas, normalizedDrawData);
}

function campaignMapPointerToImageCoords(event) {
  if (!els.campaignMapViewport || !els.campaignMapImage) return null;
  if (!els.campaignMapImage.naturalWidth || !els.campaignMapImage.naturalHeight) return null;
  const rect = els.campaignMapViewport.getBoundingClientRect();
  const pointerX = event.clientX - rect.left;
  const pointerY = event.clientY - rect.top;
  const totalScale = campaignMapCurrentTotalScale();
  if (!totalScale) return null;
  const imageX = (pointerX - state.campaignMap.panX) / totalScale;
  const imageY = (pointerY - state.campaignMap.panY) / totalScale;
  return {
    x: clamp(imageX, 0, els.campaignMapImage.naturalWidth),
    y: clamp(imageY, 0, els.campaignMapImage.naturalHeight)
  };
}

function paintCampaignMapFogAt(x, y, mode = "paint") {
  const canvas = els.campaignMapFogCanvas;
  if (!(canvas instanceof HTMLCanvasElement)) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const radius = Math.max(12, Math.min(220, Number(state.campaignMap.fogBrushSize) || 56));
  const square = state.campaignMap.fogBrushShape === "square";
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

function paintCampaignMapDrawAt(x, y, mode = "draw") {
  if (!ensureCampaignMapDrawCanvasSize()) return;
  drawStrokeOnSharedMapCanvas(
    els.campaignMapDrawCanvas,
    state.campaignMap.lastDrawX,
    state.campaignMap.lastDrawY,
    x,
    y,
    mode,
    state.campaignMap.drawBrushSize,
    state.campaignMap.drawColor
  );
  state.campaignMap.lastDrawX = x;
  state.campaignMap.lastDrawY = y;
}

function serializeCampaignMapFogCanvas() {
  const canvas = els.campaignMapFogCanvas;
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

function serializeCampaignMapDrawCanvas() {
  return serializeSharedMapCanvas(els.campaignMapDrawCanvas);
}

async function persistCampaignMapDraw(campaignId, drawData) {
  try {
    const result = await api(`/api/campaigns/${campaignId}/map-draw`, {
      method: "POST",
      body: JSON.stringify({ drawData })
    });
    if (state.campaignMapData && state.campaignMapData.campaignId === campaignId) {
      state.campaignMapData = {
        ...state.campaignMapData,
        mapDrawData: `${result?.mapDrawData || ""}`,
        updatedAt: result?.updatedAt ?? state.campaignMapData.updatedAt ?? null
      };
    }
    state.campaignMap.drawCanvasLoadedCampaignId = campaignId;
    state.campaignMap.drawCanvasLoadedKey = `${campaignId}:${result?.mapDrawData || ""}`;
  } catch (error) {
    setStatus(error.message, "error");
  }
}

async function persistCampaignMapFog(campaignId, fogData) {
  try {
    const result = await api(`/api/campaigns/${campaignId}/map-fog`, {
      method: "POST",
      body: JSON.stringify({ fogData })
    });
    if (state.campaignMapData && state.campaignMapData.campaignId === campaignId) {
      state.campaignMapData = {
        ...state.campaignMapData,
        mapFogData: `${result?.mapFogData || ""}`
      };
    }
  } catch (error) {
    setStatus(error.message, "error");
  }
}

function scheduleCampaignMapFogSave(campaignId, fogData) {
  if (!Number.isInteger(campaignId)) return;
  if (state.campaignMap.saveFogTimer) clearTimeout(state.campaignMap.saveFogTimer);
  state.campaignMap.saveFogTimer = setTimeout(() => {
    state.campaignMap.saveFogTimer = null;
    persistCampaignMapFog(campaignId, fogData);
  }, 220);
}

function maybeShowCampaignMapPing(pingRaw) {
  const ping = parseMapPingJson(pingRaw);
  if (!ping) return;
  if (state.campaignMap.lastPingId === ping.id) return;
  state.campaignMap.lastPingId = ping.id;
  const sentAtMs = ping.sentAt ? Date.parse(ping.sentAt) : NaN;
  if (Number.isFinite(sentAtMs) && Date.now() - sentAtMs > 8000) return;
  renderMapPing(els.campaignMapPings, ping);
}

async function sendCampaignMapPing(campaignId, x, y) {
  if (!Number.isInteger(campaignId)) return;
  try {
    await api(`/api/campaigns/${campaignId}/map-ping`, {
      method: "POST",
      body: JSON.stringify({ x, y })
    });
  } catch (error) {
    setStatus(error.message, "error");
  }
}

async function sendPlayerCampaignMapPing(campaignId, x, y) {
  if (!Number.isInteger(campaignId)) return;
  try {
    await api("/api/player/live/campaign-map-ping", {
      method: "POST",
      body: JSON.stringify({ campaignId, x, y })
    });
  } catch (_error) {
    // Ignore transient ping errors for players.
  }
}

function clearMapViewSelectionsOnEsc() {
  let changed = false;

  const onDmMapView = state.page === "scenario-map";
  const onCampaignMapView = state.page === "campaign-map";
  const onPlayerMapView =
    state.page === "player-home" &&
    (state.playerLiveViewMode === "map" || state.playerLiveViewMode === "campaign-map");
  if (!onDmMapView && !onCampaignMapView && !onPlayerMapView) return false;

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
    if (state.runMap.pingMode) {
      setRunMapPingModeUi(false);
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

  if (onCampaignMapView) {
    if (state.campaignMap.fogMode !== "navigate") {
      setCampaignMapFogMode("navigate");
      changed = true;
    }
    if (state.campaignMap.drawMode !== "navigate") {
      setCampaignMapDrawMode("navigate");
      changed = true;
    }
    if (state.campaignMap.pingMode) {
      setCampaignMapPingModeUi(false);
      changed = true;
    }
    if (state.campaignMap.dragLocked) {
      setCampaignMapDragLockUi(false);
      changed = true;
    }
    if (state.campaignMap.dragging || state.campaignMap.fogPainting || state.campaignMap.drawPainting) {
      changed = true;
    }
    if (els.campaignMapViewport && Number.isInteger(state.campaignMap.pointerId)) {
      try {
        if (els.campaignMapViewport.hasPointerCapture(state.campaignMap.pointerId)) {
          els.campaignMapViewport.releasePointerCapture(state.campaignMap.pointerId);
        }
      } catch (_error) {}
    }
    if (els.campaignMapViewport && Number.isInteger(state.campaignMap.fogPointerId)) {
      try {
        if (els.campaignMapViewport.hasPointerCapture(state.campaignMap.fogPointerId)) {
          els.campaignMapViewport.releasePointerCapture(state.campaignMap.fogPointerId);
        }
      } catch (_error) {}
    }
    if (els.campaignMapViewport && Number.isInteger(state.campaignMap.drawPointerId)) {
      try {
        if (els.campaignMapViewport.hasPointerCapture(state.campaignMap.drawPointerId)) {
          els.campaignMapViewport.releasePointerCapture(state.campaignMap.drawPointerId);
        }
      } catch (_error) {}
    }
    state.campaignMap.dragging = false;
    state.campaignMap.pointerId = null;
    state.campaignMap.fogPainting = false;
    state.campaignMap.fogPointerId = null;
    state.campaignMap.drawPainting = false;
    state.campaignMap.drawPointerId = null;
    state.campaignMap.lastDrawX = null;
    state.campaignMap.lastDrawY = null;
    els.campaignMapViewport?.classList.remove("is-dragging");
    hideCampaignMapFogCursorPreview();
  }

  if (onPlayerMapView) {
    const wasPlayerMapInteracting = state.playerMap.dragging || state.playerMap.drawPainting;
    if (Number.isInteger(state.playerMap.hoverCombatantId)) {
      setMapHoverCombatantRow(state.playerMap.hoverCombatantId, true, false);
      changed = true;
    }
    if (state.playerMap.dragLocked) {
      setPlayerMapDragLockUi(false);
      changed = true;
    }
    if (state.playerMap.pingMode) {
      setPlayerMapPingModeUi(false);
      changed = true;
    }
    if (state.playerMap.drawMode !== "navigate") {
      setPlayerMapDrawModeUi("navigate");
      changed = true;
    }
    if (state.playerMap.dragging || state.playerMap.drawPainting) {
      changed = true;
    }
    if (els.playerMapViewport && Number.isInteger(state.playerMap.pointerId)) {
      try {
        if (els.playerMapViewport.hasPointerCapture(state.playerMap.pointerId)) {
          els.playerMapViewport.releasePointerCapture(state.playerMap.pointerId);
        }
      } catch (_error) {}
    }
    if (els.playerMapViewport && Number.isInteger(state.playerMap.drawPointerId)) {
      try {
        if (els.playerMapViewport.hasPointerCapture(state.playerMap.drawPointerId)) {
          els.playerMapViewport.releasePointerCapture(state.playerMap.drawPointerId);
        }
      } catch (_error) {}
    }
    state.playerMap.dragging = false;
    state.playerMap.dragMode = "map";
    state.playerMap.dragCombatantId = null;
    state.playerMap.pointerId = null;
    state.playerMap.drawPainting = false;
    state.playerMap.drawPointerId = null;
    state.playerMap.lastDrawX = null;
    state.playerMap.lastDrawY = null;
    els.playerMapViewport?.classList.remove("is-dragging");
    els.playerMapTokens?.querySelectorAll(".player-map-token.is-dragging").forEach((token) => {
      token.classList.remove("is-dragging");
    });
    if (wasPlayerMapInteracting && state.page === "player-home" && state.authUser?.role !== "admin") {
      startPlayerLivePolling();
    }
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

function zoomCampaignMapAtPointer(factor, pointerX = null, pointerY = null) {
  if (!els.campaignMapViewport || !els.campaignMapImage || els.campaignMapImage.classList.contains("hidden")) return;
  if (!els.campaignMapImage.naturalWidth || !els.campaignMapImage.naturalHeight) return;
  const viewportWidth = els.campaignMapViewport.clientWidth;
  const viewportHeight = els.campaignMapViewport.clientHeight;
  if (viewportWidth <= 0 || viewportHeight <= 0) return;
  const focusX = Number.isFinite(pointerX) ? pointerX : viewportWidth / 2;
  const focusY = Number.isFinite(pointerY) ? pointerY : viewportHeight / 2;
  const baseScale = Math.min(
    viewportWidth / els.campaignMapImage.naturalWidth,
    viewportHeight / els.campaignMapImage.naturalHeight
  );
  const prevZoom = state.campaignMap.zoom;
  const nextZoom = clamp(prevZoom * factor, state.campaignMap.minZoom, state.campaignMap.maxZoom);
  if (Math.abs(nextZoom - prevZoom) < 0.001) return;
  const prevTotalScale = baseScale * prevZoom;
  const nextTotalScale = baseScale * nextZoom;
  const imageX = (focusX - state.campaignMap.panX) / prevTotalScale;
  const imageY = (focusY - state.campaignMap.panY) / prevTotalScale;
  state.campaignMap.zoom = nextZoom;
  state.campaignMap.panX = focusX - imageX * nextTotalScale;
  state.campaignMap.panY = focusY - imageY * nextTotalScale;
  applyCampaignMapTransform();
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
  return scenarioRunPageController.renderRunMapTokens(scenarioId, combatants);
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
  setRunMapPingModeUi(false);
  applyRunMapTransform();
}

function isSameCombatantId(leftId, rightId) {
  return Number(leftId) === Number(rightId);
}

function createPlayerVisibilityToggle(combatant, rerender) {
  return combatUiController.createPlayerVisibilityToggle(combatant, rerender);
}

function createConditionSelect(combatant) {
  return combatUiController.createConditionSelect(combatant);
}

function applyConditionStyle(li, combatant) {
  return combatUiController.applyConditionStyle(li, combatant);
}

function renderScenarioEditPage() {
  return scenarioEditPageController.renderScenarioEditPage();
}

function applyConditionStyleReadonly(li, combatant) {
  return combatUiController.applyConditionStyleReadonly(li, combatant);
}

function renderScenarioCompletedEditPage() {
  return scenarioEditPageController.renderScenarioCompletedEditPage();
}

function renderScenarioRunPage() {
  return scenarioRunPageController.renderScenarioRunPage();
}

async function completeSelectedScenario() {
  return scenarioEditPageController.completeSelectedScenario();
}

function renderCampaignPage() {
  return campaignPageController.renderCampaignPage();
}

function selectedSceneImage() {
  return scenePageController.selectedSceneImage();
}

function preferredSceneCampaignId() {
  return scenePageController.preferredSceneCampaignId();
}

function preferredCampaignMapCampaignId() {
  const validCampaignIds = new Set(
    (Array.isArray(state.campaigns) ? state.campaigns : [])
      .map((campaign) => campaign.id)
      .filter((id) => Number.isInteger(id))
  );
  if (Number.isInteger(state.selectedCampaignId) && validCampaignIds.has(state.selectedCampaignId)) {
    return state.selectedCampaignId;
  }
  if (Number.isInteger(state.lastHomeCampaignId) && validCampaignIds.has(state.lastHomeCampaignId)) {
    return state.lastHomeCampaignId;
  }
  const firstCampaignId = state.campaigns?.[0]?.id;
  return Number.isInteger(firstCampaignId) ? firstCampaignId : null;
}

async function loadSceneImages(campaignId) {
  return scenePageController.loadSceneImages(campaignId);
}

function renderScenePage() {
  return scenePageController.renderScenePage();
}

async function loadCampaignMapData(campaignId) {
  if (!Number.isInteger(campaignId)) {
    state.campaignMapData = null;
    return;
  }
  state.campaignMapData = await api(`/api/campaigns/${campaignId}/map`);
}

function renderCampaignMapPage() {
  return campaignMapPageController.renderCampaignMapPage();
}

async function loadCampaignStats(campaignId) {
  return analyticsPageController.loadCampaignStats(campaignId);
}

function renderAnalyticsPage() {
  return analyticsPageController.renderAnalyticsPage();
}

async function setAnalyticsCampaign(campaignId) {
  return analyticsPageController.setAnalyticsCampaign(campaignId);
}

async function loadCampaigns() {
  state.campaigns = await api("/api/campaigns");
  if (state.authUser?.role !== "admin") {
    const summaryEntries = state.campaigns.map((campaign) => {
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
          players: [],
          scenarioCount,
          totalEncounters,
          totalFinishedEncounters,
          totalEnemyDamage: Number(campaign.total_enemy_damage) || 0,
          totalEnemyDefeats: Number(campaign.total_enemy_defeats) || 0
        }
      ];
    });
    state.campaignSummaries = Object.fromEntries(summaryEntries);
    renderWelcomeCampaigns();
    renderNav();
    return;
  }
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
    state.campaignLiveSceneImageId = null;
    return;
  }
  try {
    const live = await api(`/api/campaigns/${campaignId}/live`);
    state.campaignLiveScenarioId = Number.isInteger(live?.shared_scenario_id)
      ? live.shared_scenario_id
      : null;
    state.campaignLiveSceneImageId = Number.isInteger(live?.shared_scene_image_id)
      ? live.shared_scene_image_id
      : null;
  } catch (_error) {
    state.campaignLiveScenarioId = null;
    state.campaignLiveSceneImageId = null;
  }
}

function renderPlayerHome() {
  return playerLivePageController.renderPlayerHome();
}

async function loadUserSettings() {
  return userPagesController.loadUserSettings();
}

function renderSettingsPage() {
  return userPagesController.renderSettingsPage();
}

function renderDiceShopPage() {
  return userPagesController.renderDiceShopPage();
}

function stopDiceShopOfferTimer() {
  return userPagesController.stopDiceShopOfferTimer();
}

function parseMapTokensJson(raw) {
  return playerLivePageController.parseMapTokensJson(raw);
}

function resetPlayerMapViewForScenario(scenarioId, mapKey) {
  return playerLivePageController.resetPlayerMapViewForScenario(scenarioId, mapKey);
}

async function persistPlayerMapTokenPosition(scenarioId, combatantId, x, y) {
  return playerLivePageController.persistPlayerMapTokenPosition(scenarioId, combatantId, x, y);
}

function schedulePlayerMapTokenSave(scenarioId, combatantId, x, y) {
  return playerLivePageController.schedulePlayerMapTokenSave(scenarioId, combatantId, x, y);
}

function renderPlayerLiveMap(
  scenarioId,
  mapImageData,
  mapDrawData,
  mapFogData,
  mapLastPingJson,
  mapTokensJson,
  combatants,
  activeCombatantId
) {
  return playerLivePageController.renderPlayerLiveMap(
    scenarioId,
    mapImageData,
    mapDrawData,
    mapFogData,
    mapLastPingJson,
    mapTokensJson,
    combatants,
    activeCombatantId
  );
}

function applyPlayerMapTransform() {
  return playerLivePageController.applyPlayerMapTransform();
}

async function loadPlayerLive() {
  return playerLivePageController.loadPlayerLive();
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

function clearCampaignMapSyncReconnectTimer() {
  if (state.campaignMapSyncReconnectTimer) {
    clearTimeout(state.campaignMapSyncReconnectTimer);
    state.campaignMapSyncReconnectTimer = null;
  }
}

function applyRunMapSyncSnapshot(snapshot, { force = false } = {}) {
  const scenarioId = Number(snapshot?.scenarioId ?? snapshot?.id);
  if (!Number.isInteger(scenarioId)) return;
  const current = state.scenarios.find((scenario) => scenario.id === scenarioId);
  if (!current) return;
  const next = deriveRunMapSyncSnapshotBase(current, snapshot);
  if (!next) return;
  const {
    nextMapTokensJson,
    nextTokenSize,
    nextMapFogData,
    nextMapLastPingJson,
    tokensChanged,
    tokenSizeChanged,
    fogChanged,
    pingChanged
  } = next;
  if (!next.changed && !force) return;

  state.scenarios = state.scenarios.map((scenario) =>
    scenario.id === scenarioId
      ? {
        ...scenario,
        map_tokens_json: nextMapTokensJson,
        map_token_size: nextTokenSize,
        map_fog_data: nextMapFogData,
        map_last_ping_json: nextMapLastPingJson
      }
      : scenario
  );
  const refreshed = selectedScenario();
  if (!refreshed || state.page !== "scenario-map") return;

  if (tokensChanged) {
    delete state.runMap.tokensByScenario[scenarioId];
    hydrateRunMapTokensFromScenario(refreshed);
  }

  if (tokenSizeChanged) {
    setRunMapTokenSizeUI(scenarioMapTokenSize(refreshed));
  }

  if (fogChanged) {
    state.runMap.fogDataByScenario[scenarioId] = nextMapFogData;
    state.runMap.fogCanvasLoadedScenarioId = null;
    state.runMap.fogCanvasLoadedKey = null;
    ensureRunMapFogCanvasFromScenario(refreshed);
  }

  if (tokensChanged || tokenSizeChanged || force) {
    renderRunMapTokens(scenarioId, state.combat.combatants);
  }

  if (pingChanged || force) {
    maybeShowRunMapPing(nextMapLastPingJson);
  }

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

function applyCampaignMapSyncSnapshot(snapshot, { force = false } = {}) {
  const campaignId = Number(snapshot?.campaignId ?? snapshot?.id);
  if (!Number.isInteger(campaignId)) return;

  const current = state.campaignMapData && state.campaignMapData.campaignId === campaignId
    ? state.campaignMapData
    : {
        campaignId,
        name: selectedCampaign()?.name || "",
        mapImageData: "",
        mapDrawData: "",
        mapFogData: "",
        mapLastPingJson: "",
        updatedAt: null
      };

  const nextState = {
    campaignId,
    name: `${snapshot?.name ?? current.name ?? ""}`,
    mapImageData: `${snapshot?.mapImageData ?? current.mapImageData ?? ""}`,
    mapDrawData: `${snapshot?.mapDrawData ?? current.mapDrawData ?? ""}`,
    mapFogData: `${snapshot?.mapFogData ?? current.mapFogData ?? ""}`,
    mapLastPingJson: `${snapshot?.mapLastPingJson ?? current.mapLastPingJson ?? ""}`,
    updatedAt: snapshot?.updatedAt ?? current.updatedAt ?? null
  };

  const changed =
    nextState.name !== current.name ||
    nextState.mapImageData !== current.mapImageData ||
    nextState.mapDrawData !== current.mapDrawData ||
    nextState.mapFogData !== current.mapFogData ||
    nextState.mapLastPingJson !== current.mapLastPingJson ||
    nextState.updatedAt !== current.updatedAt;
  if (!changed && !force) return;

  state.campaignMapData = nextState;
  if (state.page !== "campaign-map" || state.selectedCampaignId !== campaignId) return;
  renderCampaignMapPage();
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

function stopCampaignMapSyncPolling() {
  clearCampaignMapSyncReconnectTimer();
  if (state.campaignMapSyncEventSource) {
    state.campaignMapSyncEventSource.close();
    state.campaignMapSyncEventSource = null;
  }
  state.campaignMapSyncCampaignId = null;
  state.campaignMap.pendingRemoteSync = null;
  if (state.campaignMapSyncPollTimer) {
    clearInterval(state.campaignMapSyncPollTimer);
    state.campaignMapSyncPollTimer = null;
  }
}

function startCampaignMapSyncPolling() {
  if (state.page !== "campaign-map" || !state.selectedCampaignId) {
    stopCampaignMapSyncPolling();
    return;
  }
  const campaignId = state.selectedCampaignId;
  const canUseStream = supportsEventStream();
  if (
    canUseStream &&
    state.campaignMapSyncEventSource &&
    state.campaignMapSyncCampaignId === campaignId
  ) {
    return;
  }
  if (
    !canUseStream &&
    state.campaignMapSyncPollTimer &&
    state.campaignMapSyncCampaignId === campaignId
  ) {
    return;
  }

  stopCampaignMapSyncPolling();
  state.campaignMapSyncCampaignId = campaignId;

  if (!canUseStream) {
    state.campaignMapSyncPollTimer = setInterval(async () => {
      if (state.page !== "campaign-map" || state.selectedCampaignId !== campaignId) return;
      if (state.campaignMap.dragging || state.campaignMap.fogPainting || state.campaignMap.drawPainting) return;
      try {
        const latest = await api(`/api/campaigns/${campaignId}/map`);
        applyCampaignMapSyncSnapshot(latest);
      } catch (_error) {
        // Ignore transient polling errors.
      }
    }, 1000);
    return;
  }

  const source = new EventSource(`/api/campaigns/${campaignId}/map/stream`);
  state.campaignMapSyncEventSource = source;

  source.addEventListener("campaign-map", (event) => {
    if (state.campaignMapSyncEventSource !== source) return;
    let payload;
    try {
      payload = JSON.parse(event.data);
    } catch (_error) {
      return;
    }
    if (!payload || Number(payload.campaignId) !== campaignId) return;
    if (payload.deleted) {
      setStatus("This campaign map is no longer available.");
      stopCampaignMapSyncPolling();
      return;
    }
    if (state.page !== "campaign-map" || state.selectedCampaignId !== campaignId) return;
    if (state.campaignMap.dragging || state.campaignMap.fogPainting || state.campaignMap.drawPainting) {
      state.campaignMap.pendingRemoteSync = payload;
      return;
    }
    applyCampaignMapSyncSnapshot(payload);
  });

  source.onopen = () => {
    if (state.campaignMapSyncEventSource !== source) return;
    clearCampaignMapSyncReconnectTimer();
  };

  source.onerror = () => {
    if (state.campaignMapSyncEventSource !== source) return;
    source.close();
    state.campaignMapSyncEventSource = null;
    if (state.page !== "campaign-map" || state.selectedCampaignId !== campaignId) return;
    clearCampaignMapSyncReconnectTimer();
    state.campaignMapSyncReconnectTimer = setTimeout(() => {
      state.campaignMapSyncReconnectTimer = null;
      if (state.page !== "campaign-map" || state.selectedCampaignId !== campaignId) return;
      startCampaignMapSyncPolling();
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
  return adminPageController.loadAdminData();
}

function renderAdminPage() {
  return adminPageController.renderAdminPage();
}

async function ensureAuthenticated() {
  const me = await api("/api/auth/me");
  state.authUser = me.user;
}

async function loadCampaignData() {
  if (!state.selectedCampaignId) {
    state.characters = [];
    state.scenarios = [];
    state.sceneImages = [];
    state.selectedSceneId = null;
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
    if (event.key === "Escape" && state.diceOverlayOpen) {
      setDiceOverlayOpen(false);
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

    if (key === "e" && state.page === "monsters") {
      event.preventDefault();
      toggleMonsterEditorMode();
      return;
    }

    if (key === "s" && state.page === "monsters" && !state.monsterEditorReadOnly) {
      event.preventDefault();
      els.monsterForm.requestSubmit();
      return;
    }

    if (scenarioRunPageController.handleKeyboardShortcut(event)) {
      return;
    }

    if (state.page === "campaign-map" && state.authUser?.role === "admin") {
      if (key === "f") {
        event.preventDefault();
        setCampaignMapFogMode(state.campaignMap.fogMode === "paint" ? "navigate" : "paint");
        return;
      }
      if (key === "d") {
        event.preventDefault();
        setCampaignMapFogMode(state.campaignMap.fogMode === "erase" ? "navigate" : "erase");
        return;
      }
      if (key === "g") {
        event.preventDefault();
        setCampaignMapPingModeUi(!state.campaignMap.pingMode);
        return;
      }
    }

    if (
      state.page === "player-home" &&
      (state.playerLiveViewMode === "map" || state.playerLiveViewMode === "campaign-map") &&
      key === "g"
    ) {
      event.preventDefault();
      setPlayerMapPingModeUi(!state.playerMap.pingMode);
      return;
    }
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
  els.scenePreviewImage?.addEventListener("click", () => {
    if (!els.scenePreviewImage.src) return;
    openImageModal(els.scenePreviewImage.src);
  });
  els.diceToggleBtn?.addEventListener("click", () => {
    setDiceOverlayOpen(!state.diceOverlayOpen);
  });
  els.dicePanelCloseBtn?.addEventListener("click", () => {
    setDiceOverlayOpen(false);
  });
  els.diceOverlayShopBtn?.addEventListener("click", async () => {
    setDiceOverlayOpen(false);
    await navigateToPage("dice-shop");
  });
  els.diceRollPoolBtn?.addEventListener("click", () => {
    rollDicePool();
  });
  els.diceResetPoolBtn?.addEventListener("click", () => {
    resetDicePool();
  });
  els.dicePresetButtons?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("button[data-sides]");
    if (!(button instanceof HTMLButtonElement)) return;
    const sides = Number(button.dataset.sides);
    addDieToPool(sides);
  });
  document.addEventListener("pointerdown", (event) => {
    if (!state.diceOverlayOpen) return;
    const target = event.target;
    if (!(target instanceof Node)) return;
    if (els.diceOverlay?.contains(target)) return;
    setDiceOverlayOpen(false);
  });
  els.sceneDraftImagePreview?.addEventListener("click", () => {
    if (!els.sceneDraftImagePreview.src) return;
    openImageModal(els.sceneDraftImagePreview.src);
  });
  els.playerLiveSceneImage?.addEventListener("click", () => {
    if (!els.playerLiveSceneImage.src) return;
    openImageModal(els.playerLiveSceneImage.src);
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

  els.openSceneModalBtn?.addEventListener("click", () => {
    if (!state.selectedCampaignId) return;
    openCampaignActionModal("scene");
  });

  els.goSceneViewBtn.addEventListener("click", async () => {
    if (!state.selectedCampaignId) return;
    await navigateToPage("campaign-scene", {
      campaignId: state.selectedCampaignId
    });
  });

  els.goCampaignMapBtn?.addEventListener("click", async () => {
    if (!state.selectedCampaignId) return;
    await navigateToPage("campaign-map", {
      campaignId: state.selectedCampaignId
    });
  });

  els.backToCampaignFromSceneBtn.addEventListener("click", async () => {
    if (!state.selectedCampaignId) return;
    await navigateToPage("campaign", {
      campaignId: state.selectedCampaignId
    });
  });

  els.backToCampaignFromMapBtn?.addEventListener("click", async () => {
    if (!state.selectedCampaignId) return;
    await navigateToPage("campaign", {
      campaignId: state.selectedCampaignId
    });
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

  els.sceneSearchInput?.addEventListener("input", () => {
    state.sceneSearchQuery = `${els.sceneSearchInput.value || ""}`;
    renderScenePage();
  });

  els.sceneCampaignSelect?.addEventListener("change", async () => {
    const campaignId = Number(els.sceneCampaignSelect.value);
    if (!Number.isInteger(campaignId)) return;
    if (campaignId === state.selectedCampaignId) return;
    await navigateToPage("campaign-scene", { campaignId });
  });

  els.sceneList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const row = target.closest("li[data-scene-id]");
    if (!(row instanceof HTMLElement)) return;
    const sceneId = Number(row.dataset.sceneId);
    if (!Number.isInteger(sceneId)) return;
    state.selectedSceneId = sceneId;
    renderScenePage();
  });

  els.sceneList?.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const row = target.closest("li[data-scene-id]");
    if (!(row instanceof HTMLElement)) return;
    event.preventDefault();
    const sceneId = Number(row.dataset.sceneId);
    if (!Number.isInteger(sceneId)) return;
    state.selectedSceneId = sceneId;
    renderScenePage();
  });

  els.sceneImageFile?.addEventListener("change", async () => {
    const file = els.sceneImageFile.files?.[0];
    if (!file) {
      state.draftSceneImageData = "";
      setSceneDraftImagePreview("");
      return;
    }
    try {
      state.draftSceneImageData = await readFileAsDataUrl(file);
      setSceneDraftImagePreview(state.draftSceneImageData);
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.createSceneForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!state.selectedCampaignId) return;
    const name = `${els.sceneNameInput.value || ""}`.trim();
    if (!name) {
      setStatus("Scene name is required.");
      return;
    }
    try {
      let imageData = `${state.draftSceneImageData || ""}`.trim();
      if (!imageData) {
        const file = els.sceneImageFile.files?.[0];
        if (file) {
          imageData = await readFileAsDataUrl(file);
        }
      }
      if (!imageData) {
        setStatus("Scene image is required.");
        return;
      }
      const created = await api(`/api/campaigns/${state.selectedCampaignId}/scenes`, {
        method: "POST",
        body: JSON.stringify({ name, imageData })
      });
      els.sceneNameInput.value = "";
      els.sceneImageFile.value = "";
      state.draftSceneImageData = "";
      setSceneDraftImagePreview("");
      closeCampaignActionModal();
      await loadSceneImages(state.selectedCampaignId);
      state.selectedSceneId = created?.id ?? state.selectedSceneId;
      renderScenePage();
      setStatus("Scene added.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.shareSceneBtn?.addEventListener("click", async () => {
    if (!state.selectedCampaignId) return;
    const selected = selectedSceneImage();
    if (!selected) return;
    const isSharedCurrent = selected.id === state.campaignLiveSceneImageId;
    try {
      await api(`/api/campaigns/${state.selectedCampaignId}/scene/share`, {
        method: "POST",
        body: JSON.stringify({ sceneId: isSharedCurrent ? null : selected.id })
      });
      await loadCampaignLiveState(state.selectedCampaignId);
      renderScenePage();
      setStatus(isSharedCurrent ? "Stopped sharing scene." : "Scene shared with players.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.deleteSceneBtn?.addEventListener("click", async () => {
    if (!state.selectedCampaignId) return;
    const selected = selectedSceneImage();
    if (!selected) return;
    if (!window.confirm(`Delete scene "${selected.name}"?`)) return;
    try {
      await api(`/api/campaigns/${state.selectedCampaignId}/scenes/${selected.id}`, {
        method: "DELETE"
      });
      await loadCampaignLiveState(state.selectedCampaignId);
      await loadSceneImages(state.selectedCampaignId);
      renderScenePage();
      setStatus("Scene deleted.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
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
  els.mainSceneBtn.addEventListener("click", async () => {
    if (state.authUser?.role !== "admin") return;
    try {
      if (!Array.isArray(state.campaigns) || state.campaigns.length === 0) {
        await loadCampaigns();
      }
      const campaignId = preferredSceneCampaignId();
      if (!Number.isInteger(campaignId)) {
        setStatus("No campaigns available yet.");
        await navigateToPage("welcome");
        return;
      }
      await navigateToPage("campaign-scene", { campaignId });
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
  els.mainCampaignMapBtn.addEventListener("click", async () => {
    if (state.authUser?.role !== "admin") return;
    try {
      if (!Array.isArray(state.campaigns) || state.campaigns.length === 0) {
        await loadCampaigns();
      }
      const campaignId = preferredCampaignMapCampaignId();
      if (!Number.isInteger(campaignId)) {
        setStatus("No campaigns available yet.");
        await navigateToPage("welcome");
        return;
      }
      await navigateToPage("campaign-map", { campaignId });
    } catch (error) {
      setStatus(error.message, "error");
    }
  });
  els.mainPlayerInitiativeBtn.addEventListener("click", async () => {
    await navigateToPath("/player/initiative");
  });
  els.mainPlayerMapBtn.addEventListener("click", async () => {
    await navigateToPath("/player/map");
  });
  els.mainPlayerCampaignMapBtn?.addEventListener("click", async () => {
    await navigateToPath("/player/campaign-map");
  });
  els.mainPlayerSceneBtn.addEventListener("click", async () => {
    await navigateToPath("/player/scene");
  });

  els.playerRefreshBtn.addEventListener("click", () => {
    window.location.reload();
  });

  els.uploadCampaignMapBtn?.addEventListener("click", () => {
    els.campaignMapFile?.click();
  });

  els.campaignMapFile?.addEventListener("change", async () => {
    if (!state.selectedCampaignId) return;
    const file = els.campaignMapFile.files?.[0];
    if (!file) return;
    try {
      const mapImageData = await readFileAsDataUrl(file);
      const updated = await api(`/api/campaigns/${state.selectedCampaignId}/map`, {
        method: "PUT",
        body: JSON.stringify({ mapImageData })
      });
      state.campaignMapData = updated;
      renderCampaignMapPage();
      setStatus("Campaign map updated.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    } finally {
      els.campaignMapFile.value = "";
    }
  });

  els.clearCampaignMapBtn?.addEventListener("click", async () => {
    if (!state.selectedCampaignId) return;
    try {
      const updated = await api(`/api/campaigns/${state.selectedCampaignId}/map`, {
        method: "PUT",
        body: JSON.stringify({ mapImageData: "" })
      });
      state.campaignMapData = updated;
      renderCampaignMapPage();
      setStatus("Campaign map cleared.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.playerMapImage.addEventListener("load", () => {
    if (!els.playerMapScene || !els.playerMapImage.naturalWidth || !els.playerMapImage.naturalHeight) return;
    els.playerMapScene.style.width = `${els.playerMapImage.naturalWidth}px`;
    els.playerMapScene.style.height = `${els.playerMapImage.naturalHeight}px`;
    if (state.playerLiveViewMode === "campaign-map") {
      ensurePlayerMapDrawCanvasFromData(`${state.playerLiveData?.campaignMap?.mapDrawData || ""}`);
    }
    applyPlayerMapTransform();
  });

  els.campaignMapImage?.addEventListener("load", () => {
    if (state.page !== "campaign-map") return;
    if (!els.campaignMapScene || !els.campaignMapImage.naturalWidth || !els.campaignMapImage.naturalHeight) return;
    els.campaignMapScene.style.width = `${els.campaignMapImage.naturalWidth}px`;
    els.campaignMapScene.style.height = `${els.campaignMapImage.naturalHeight}px`;
    ensureCampaignMapDrawCanvasFromData(`${state.campaignMapData?.mapDrawData || ""}`);
    ensureCampaignMapFogCanvasFromData(`${state.campaignMapData?.mapFogData || ""}`);
    applyCampaignMapTransform();
  });

  window.addEventListener("resize", () => {
    if (
      state.page === "player-home" &&
      (state.playerLiveViewMode === "map" || state.playerLiveViewMode === "campaign-map")
    ) {
      applyPlayerMapTransform();
    }
    if (state.page === "campaign-map") {
      applyCampaignMapTransform();
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
    state.lastHomeCampaignId = null;
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

  els.saveSettingsActiveCampaignBtn?.addEventListener("click", async () => {
    if (state.authUser?.role === "admin") return;
    const campaignId = Number(els.settingsActiveCampaignSelect?.value);
    if (!Number.isInteger(campaignId)) {
      setStatus("Select a valid campaign.");
      return;
    }
    try {
      await api("/api/users/me/active-campaign", {
        method: "POST",
        body: JSON.stringify({ campaignId })
      });
      await loadUserSettings();
      await loadPlayerLive();
      renderSettingsPage();
      if (state.page === "player-home") {
        renderPlayerHome();
      }
      setStatus("Active campaign updated.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.saveSettingsDiceSkinBtn?.addEventListener("click", async () => {
    const diceSkin = getDiceSkinKey(els.settingsDiceSkinSelect?.value);
    try {
      await saveDiceSkinPreference(diceSkin);
      renderSettingsPage();
      setStatus("Dice skin updated.", "success");
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.settingsDiceShopBtn?.addEventListener("click", async () => {
    await navigateToPage("dice-shop");
  });

  els.backToSettingsFromDiceShopBtn?.addEventListener("click", async () => {
    await navigateToPage("settings");
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

  els.adminDiceSkinForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const userId = Number(els.adminDiceSkinForm.dataset.userId);
    if (!Number.isInteger(userId)) {
      setStatus("Select a valid player.");
      return;
    }
    const allowedDiceSkins = Array.from(
      els.adminDiceSkinOptions.querySelectorAll("input[type='checkbox']:checked")
    )
      .map((input) => input.value)
      .filter((value) => DICE_SKIN_CONFIG_BY_KEY[value]);
    try {
      await api(`/api/admin/users/${userId}/dice-skins`, {
        method: "POST",
        body: JSON.stringify({ allowedDiceSkins })
      });
      await loadAdminData();
      renderAdminPage();
      closeAdminActionModal();
      const user = state.adminUsers.find((entry) => entry.id === userId);
      setStatus(`Updated dice access for ${user?.username || "player"}.`, "success");
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
    if (
      state.page !== "monsters" &&
      state.page !== "scenario-edit" &&
      state.page !== "settings" &&
      state.page !== "campaign-scene"
    ) {
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
    if (state.page === "campaign-scene") {
      const target = event.target;
      if (target instanceof HTMLTextAreaElement || target instanceof HTMLSelectElement) {
        return;
      }
      if (target instanceof HTMLInputElement && target.type !== "file") {
        return;
      }
      if (target instanceof HTMLElement && target.isContentEditable) {
        return;
      }
      const items = event.clipboardData?.items || [];
      const imageItem = Array.from(items).find((item) => item.type.startsWith("image/"));
      if (!imageItem) return;
      const file = imageItem.getAsFile();
      if (!file) return;
      event.preventDefault();
      try {
        state.draftSceneImageData = await readFileAsDataUrl(file);
        if (els.sceneImageFile) {
          els.sceneImageFile.value = "";
        }
        setSceneDraftImagePreview(state.draftSceneImageData);
        setStatus("Pasted scene image.", "success");
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
    try {
      await scenarioRunPageController.advanceTurn();
    } catch (error) {
      setStatus(error.message, "error");
    }
  });

  els.revokeTurnBtn.addEventListener("click", async () => {
    try {
      await scenarioRunPageController.revokeTurn();
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
    try {
      await scenarioRunPageController.resetCombat();
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
  els.goCampaignMapFromRunBtn?.addEventListener("click", async () => {
    if (!state.selectedCampaignId) return;
    await navigateToPage("campaign-map", {
      campaignId: state.selectedCampaignId
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
  const drawBrushSizeFromSession = loadCampaignMapDrawBrushSizeFromSession();
  const drawColorFromSession = loadCampaignMapDrawColorFromSession();
  setPlayerMapDragLockUi(false);
  setPlayerMapDrawBrushSizeUi(drawBrushSizeFromSession ?? state.playerMap.drawBrushSize);
  setPlayerMapDrawColorUi(drawColorFromSession ?? state.playerMap.drawColor);
  setCampaignMapDragLockUi(false);
  setCampaignMapFogMode("navigate");
  setCampaignMapFogBrushSizeUi(fogBrushSizeFromSession ?? state.campaignMap.fogBrushSize);
  setCampaignMapFogBrushShapeUi(fogBrushShapeFromSession ?? state.campaignMap.fogBrushShape);
  setCampaignMapDrawBrushSizeUi(drawBrushSizeFromSession ?? state.campaignMap.drawBrushSize);
  setCampaignMapDrawColorUi(drawColorFromSession ?? state.campaignMap.drawColor);
  setRunMapPingModeUi(false);
  setPlayerMapPingModeUi(false);
  setPlayerMapDrawModeUi("navigate");
  setCampaignMapPingModeUi(false);
  setCampaignMapDrawMode("navigate");

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
  els.runMapPingBtn?.addEventListener("click", () => {
    setRunMapPingModeUi(!state.runMap.pingMode);
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
  els.playerMapPingBtn?.addEventListener("click", () => {
    setPlayerMapPingModeUi(!state.playerMap.pingMode);
  });
  els.playerMapDrawBtn?.addEventListener("click", () => {
    setPlayerMapDrawModeUi(state.playerMap.drawMode === "draw" ? "navigate" : "draw");
  });
  els.playerMapEraseBtn?.addEventListener("click", () => {
    setPlayerMapDrawModeUi(state.playerMap.drawMode === "erase" ? "navigate" : "erase");
  });
  const onPlayerMapDrawSizeChange = () => {
    const nextSize = clamp(
      Math.round(Number(els.playerMapDrawSizeInput?.value) || DEFAULT_CAMPAIGN_MAP_DRAW_BRUSH_SIZE),
      2,
      32
    );
    setPlayerMapDrawBrushSizeUi(nextSize);
    saveCampaignMapDrawBrushSizeToSession(nextSize);
  };
  const onPlayerMapDrawSizeNumberCommit = () => {
    const parsed = parseRoundedNumberOrNull(els.playerMapDrawSizeNumber?.value);
    if (parsed == null) {
      setPlayerMapDrawBrushSizeUi(Number(els.playerMapDrawSizeInput?.value) || DEFAULT_CAMPAIGN_MAP_DRAW_BRUSH_SIZE);
      return;
    }
    const nextSize = clamp(parsed, 2, 32);
    setPlayerMapDrawBrushSizeUi(nextSize);
    saveCampaignMapDrawBrushSizeToSession(nextSize);
  };
  const onPlayerMapDrawSizeNumberKeydown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    onPlayerMapDrawSizeNumberCommit();
    els.playerMapDrawSizeNumber?.blur();
  };
  els.playerMapDrawSizeInput?.addEventListener("input", onPlayerMapDrawSizeChange);
  els.playerMapDrawSizeInput?.addEventListener("change", onPlayerMapDrawSizeChange);
  els.playerMapDrawSizeNumber?.addEventListener("change", onPlayerMapDrawSizeNumberCommit);
  els.playerMapDrawSizeNumber?.addEventListener("blur", onPlayerMapDrawSizeNumberCommit);
  els.playerMapDrawSizeNumber?.addEventListener("keydown", onPlayerMapDrawSizeNumberKeydown);
  const onPlayerMapDrawColorChange = () => {
    const nextColor = normalizeHexColor(els.playerMapDrawColorInput?.value, state.playerMap.drawColor);
    setPlayerMapDrawColorUi(nextColor);
    saveCampaignMapDrawColorToSession(nextColor);
  };
  els.playerMapDrawColorInput?.addEventListener("input", onPlayerMapDrawColorChange);
  els.playerMapDrawColorInput?.addEventListener("change", onPlayerMapDrawColorChange);

  els.campaignMapZoomOutBtn?.addEventListener("click", () => {
    zoomCampaignMapAtPointer(1 / 1.12);
  });
  els.campaignMapZoomInBtn?.addEventListener("click", () => {
    zoomCampaignMapAtPointer(1.12);
  });
  els.campaignMapResetBtn?.addEventListener("click", () => {
    resetCampaignMapView(state.campaignMap.campaignId, state.campaignMap.mapKey);
  });
  els.campaignMapFogPaintBtn?.addEventListener("click", () => {
    setCampaignMapFogMode(state.campaignMap.fogMode === "paint" ? "navigate" : "paint");
  });
  els.campaignMapFogEraseBtn?.addEventListener("click", () => {
    setCampaignMapFogMode(state.campaignMap.fogMode === "erase" ? "navigate" : "erase");
  });
  els.campaignMapFogClearBtn?.addEventListener("click", () => {
    if (!state.selectedCampaignId || state.page !== "campaign-map") return;
    const confirmed = window.confirm(
      "Clear all fog of war for this campaign map?"
    );
    if (!confirmed) return;
    clearCampaignMapFogCanvas();
    state.campaignMap.fogCanvasLoadedCampaignId = state.selectedCampaignId;
    state.campaignMap.fogCanvasLoadedKey = `${state.selectedCampaignId}:`;
    scheduleCampaignMapFogSave(state.selectedCampaignId, "");
  });
  const onCampaignMapFogBrushSizeChange = () => {
    const nextSize = clamp(Math.round(Number(els.campaignMapFogBrushSizeInput?.value) || 56), 12, 220);
    setCampaignMapFogBrushSizeUi(nextSize);
    saveRunMapFogBrushSizeToSession(nextSize);
    if (els.campaignMapFogCursorPreview && !els.campaignMapFogCursorPreview.classList.contains("hidden")) {
      const clientX = Number(els.campaignMapFogCursorPreview.dataset.clientX);
      const clientY = Number(els.campaignMapFogCursorPreview.dataset.clientY);
      if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
        updateCampaignMapFogCursorPreview(clientX, clientY);
      }
    }
  };
  const onCampaignMapFogBrushSizeNumberApply = () => {
    const parsed = parseRoundedNumberOrNull(els.campaignMapFogBrushSizeNumber?.value);
    if (parsed == null) return;
    const nextSize = clamp(parsed, 12, 220);
    setCampaignMapFogBrushSizeUi(nextSize);
    saveRunMapFogBrushSizeToSession(nextSize);
    if (els.campaignMapFogCursorPreview && !els.campaignMapFogCursorPreview.classList.contains("hidden")) {
      const clientX = Number(els.campaignMapFogCursorPreview.dataset.clientX);
      const clientY = Number(els.campaignMapFogCursorPreview.dataset.clientY);
      if (Number.isFinite(clientX) && Number.isFinite(clientY)) {
        updateCampaignMapFogCursorPreview(clientX, clientY);
      }
    }
  };
  const onCampaignMapFogBrushSizeNumberCommit = () => {
    const parsed = parseRoundedNumberOrNull(els.campaignMapFogBrushSizeNumber?.value);
    if (parsed == null) {
      setCampaignMapFogBrushSizeUi(Number(els.campaignMapFogBrushSizeInput?.value) || 56);
      return;
    }
    onCampaignMapFogBrushSizeNumberApply();
  };
  const onCampaignMapFogBrushSizeNumberKeydown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    onCampaignMapFogBrushSizeNumberCommit();
    els.campaignMapFogBrushSizeNumber?.blur();
  };
  els.campaignMapFogBrushSizeInput?.addEventListener("input", onCampaignMapFogBrushSizeChange);
  els.campaignMapFogBrushSizeInput?.addEventListener("change", onCampaignMapFogBrushSizeChange);
  els.campaignMapFogBrushSizeNumber?.addEventListener("change", onCampaignMapFogBrushSizeNumberCommit);
  els.campaignMapFogBrushSizeNumber?.addEventListener("blur", onCampaignMapFogBrushSizeNumberCommit);
  els.campaignMapFogBrushSizeNumber?.addEventListener("keydown", onCampaignMapFogBrushSizeNumberKeydown);
  const onCampaignMapFogBrushShapeChange = (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.checked) return;
    const shape = target.value === "square" ? "square" : "round";
    setCampaignMapFogBrushShapeUi(shape);
    saveRunMapFogBrushShapeToSession(shape);
  };
  els.campaignMapFogBrushShapeRound?.addEventListener("change", onCampaignMapFogBrushShapeChange);
  els.campaignMapFogBrushShapeSquare?.addEventListener("change", onCampaignMapFogBrushShapeChange);
  els.campaignMapDragLockBtn?.addEventListener("click", () => {
    setCampaignMapDragLockUi(!state.campaignMap.dragLocked);
  });
  els.campaignMapPingBtn?.addEventListener("click", () => {
    setCampaignMapPingModeUi(!state.campaignMap.pingMode);
  });
  els.campaignMapDrawBtn?.addEventListener("click", () => {
    setCampaignMapDrawMode(state.campaignMap.drawMode === "draw" ? "navigate" : "draw");
  });
  els.campaignMapEraseBtn?.addEventListener("click", () => {
    setCampaignMapDrawMode(state.campaignMap.drawMode === "erase" ? "navigate" : "erase");
  });
  const onCampaignMapDrawSizeChange = () => {
    const nextSize = clamp(
      Math.round(Number(els.campaignMapDrawSizeInput?.value) || DEFAULT_CAMPAIGN_MAP_DRAW_BRUSH_SIZE),
      2,
      32
    );
    setCampaignMapDrawBrushSizeUi(nextSize);
    saveCampaignMapDrawBrushSizeToSession(nextSize);
  };
  const onCampaignMapDrawSizeNumberCommit = () => {
    const parsed = parseRoundedNumberOrNull(els.campaignMapDrawSizeNumber?.value);
    if (parsed == null) {
      setCampaignMapDrawBrushSizeUi(
        Number(els.campaignMapDrawSizeInput?.value) || DEFAULT_CAMPAIGN_MAP_DRAW_BRUSH_SIZE
      );
      return;
    }
    const nextSize = clamp(parsed, 2, 32);
    setCampaignMapDrawBrushSizeUi(nextSize);
    saveCampaignMapDrawBrushSizeToSession(nextSize);
  };
  const onCampaignMapDrawSizeNumberKeydown = (event) => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    onCampaignMapDrawSizeNumberCommit();
    els.campaignMapDrawSizeNumber?.blur();
  };
  els.campaignMapDrawSizeInput?.addEventListener("input", onCampaignMapDrawSizeChange);
  els.campaignMapDrawSizeInput?.addEventListener("change", onCampaignMapDrawSizeChange);
  els.campaignMapDrawSizeNumber?.addEventListener("change", onCampaignMapDrawSizeNumberCommit);
  els.campaignMapDrawSizeNumber?.addEventListener("blur", onCampaignMapDrawSizeNumberCommit);
  els.campaignMapDrawSizeNumber?.addEventListener("keydown", onCampaignMapDrawSizeNumberKeydown);
  const onCampaignMapDrawColorChange = () => {
    const nextColor = normalizeHexColor(els.campaignMapDrawColorInput?.value, state.campaignMap.drawColor);
    setCampaignMapDrawColorUi(nextColor);
    saveCampaignMapDrawColorToSession(nextColor);
  };
  els.campaignMapDrawColorInput?.addEventListener("input", onCampaignMapDrawColorChange);
  els.campaignMapDrawColorInput?.addEventListener("change", onCampaignMapDrawColorChange);

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
    els.runMapViewport.addEventListener("selectstart", (event) => {
      event.preventDefault();
    });
    els.runMapViewport.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
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
      focusRunMapViewportForShortcuts();
      if (state.runMap.pingMode) {
        const scenario = selectedScenario();
        if (!scenario) return;
        const point = runMapPointerToImageCoords(event);
        if (!point) return;
        sendRunMapPing(scenario.id, point.x, point.y);
        event.preventDefault();
        return;
      }
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
    els.playerMapViewport.addEventListener("selectstart", (event) => {
      event.preventDefault();
    });
    els.playerMapViewport.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
    els.playerMapViewport.addEventListener(
      "wheel",
      (event) => {
        if (
          state.page !== "player-home" ||
          (state.playerLiveViewMode !== "map" && state.playerLiveViewMode !== "campaign-map")
        ) {
          return;
        }
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
      if (
        state.page !== "player-home" ||
        (state.playerLiveViewMode !== "map" && state.playerLiveViewMode !== "campaign-map")
      ) {
        return;
      }
      if (els.playerMapImage.classList.contains("hidden")) return;
      if (event.target instanceof Element && event.target.closest(".map-touch-controls, .map-draw-controls")) return;
      if (event.button !== 0) return;
      if (state.playerLiveViewMode === "campaign-map" && state.playerMap.drawMode !== "navigate") {
        const point = playerMapPointerToImageCoords(event);
        if (!point || !Number.isInteger(state.playerMap.scenarioId)) return;
        event.preventDefault();
        stopPlayerLivePolling();
        state.playerMap.drawPainting = true;
        state.playerMap.drawPointerId = event.pointerId;
        state.playerMap.lastDrawX = null;
        state.playerMap.lastDrawY = null;
        els.playerMapViewport.setPointerCapture(event.pointerId);
        paintPlayerMapDrawAt(point.x, point.y, state.playerMap.drawMode);
        return;
      }
      if (state.playerMap.pingMode) {
        const point = playerMapPointerToImageCoords(event);
        if (!point || !Number.isInteger(state.playerMap.scenarioId)) return;
        if (state.playerLiveViewMode === "campaign-map") {
          sendPlayerCampaignMapPing(state.playerMap.scenarioId, point.x, point.y);
        } else {
          sendPlayerMapPing(state.playerMap.scenarioId, point.x, point.y);
        }
        event.preventDefault();
        return;
      }
      if (state.playerMap.dragLocked) return;
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
      if (state.playerMap.drawPainting && state.playerMap.drawPointerId === event.pointerId) {
        const point = playerMapPointerToImageCoords(event);
        if (!point) return;
        paintPlayerMapDrawAt(point.x, point.y, state.playerMap.drawMode);
        return;
      }
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
      if (state.playerMap.drawPainting && state.playerMap.drawPointerId === event.pointerId) {
        state.playerMap.drawPainting = false;
        state.playerMap.drawPointerId = null;
        state.playerMap.lastDrawX = null;
        state.playerMap.lastDrawY = null;
        const campaignId = state.playerLiveViewMode === "campaign-map" ? state.playerMap.scenarioId : null;
        if (Number.isInteger(campaignId)) {
          const drawData = serializePlayerMapDrawCanvas();
          state.playerMap.drawCanvasLoadedKey = `${campaignId}:${drawData}`;
          persistPlayerCampaignMapDraw(campaignId, drawData);
        }
        if (state.page === "player-home" && state.authUser?.role !== "admin") {
          startPlayerLivePolling();
        }
        return;
      }
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

  if (els.campaignMapViewport) {
    els.campaignMapViewport.addEventListener("selectstart", (event) => {
      event.preventDefault();
    });
    els.campaignMapViewport.addEventListener("dragstart", (event) => {
      event.preventDefault();
    });
    els.campaignMapViewport.addEventListener(
      "wheel",
      (event) => {
        if (state.page !== "campaign-map" || els.campaignMapImage.classList.contains("hidden")) return;
        event.preventDefault();
        const rect = els.campaignMapViewport.getBoundingClientRect();
        const pointerX = event.clientX - rect.left;
        const pointerY = event.clientY - rect.top;
        zoomCampaignMapAtPointer(event.deltaY < 0 ? 1.12 : 1 / 1.12, pointerX, pointerY);
        updateCampaignMapFogCursorPreview(event.clientX, event.clientY, event.target);
      },
      { passive: false }
    );

    els.campaignMapViewport.addEventListener("pointerdown", (event) => {
      if (state.page !== "campaign-map" || els.campaignMapImage.classList.contains("hidden")) return;
      updateCampaignMapFogCursorPreview(event.clientX, event.clientY, event.target);
      if (
        event.target instanceof Element &&
        event.target.closest(".map-touch-controls, .map-fog-brush-controls, .map-draw-controls")
      ) {
        return;
      }
      if (event.button !== 0) return;
      focusCampaignMapViewportForShortcuts();
      if (state.campaignMap.drawMode !== "navigate") {
        if (!Number.isInteger(state.selectedCampaignId)) return;
        const point = campaignMapPointerToImageCoords(event);
        if (!point) return;
        state.campaignMap.drawPainting = true;
        state.campaignMap.drawPointerId = event.pointerId;
        state.campaignMap.lastDrawX = null;
        state.campaignMap.lastDrawY = null;
        els.campaignMapViewport.setPointerCapture(event.pointerId);
        paintCampaignMapDrawAt(point.x, point.y, state.campaignMap.drawMode);
        event.preventDefault();
        return;
      }
      if (state.campaignMap.pingMode) {
        if (!Number.isInteger(state.selectedCampaignId)) return;
        const point = campaignMapPointerToImageCoords(event);
        if (!point) return;
        sendCampaignMapPing(state.selectedCampaignId, point.x, point.y);
        event.preventDefault();
        return;
      }
      if (state.campaignMap.fogMode !== "navigate") {
        if (!Number.isInteger(state.selectedCampaignId)) return;
        const point = campaignMapPointerToImageCoords(event);
        if (!point) return;
        state.campaignMap.fogPainting = true;
        state.campaignMap.fogPointerId = event.pointerId;
        els.campaignMapViewport.setPointerCapture(event.pointerId);
        paintCampaignMapFogAt(point.x, point.y, state.campaignMap.fogMode);
        event.preventDefault();
        return;
      }
      if (state.campaignMap.dragLocked) return;
      state.campaignMap.dragging = true;
      state.campaignMap.pointerId = event.pointerId;
      state.campaignMap.lastClientX = event.clientX;
      state.campaignMap.lastClientY = event.clientY;
      els.campaignMapViewport.classList.add("is-dragging");
      els.campaignMapViewport.setPointerCapture(event.pointerId);
    });

    els.campaignMapViewport.addEventListener("pointermove", (event) => {
      updateCampaignMapFogCursorPreview(event.clientX, event.clientY, event.target);
      if (state.campaignMap.drawPainting && state.campaignMap.drawPointerId === event.pointerId) {
        const point = campaignMapPointerToImageCoords(event);
        if (!point) return;
        paintCampaignMapDrawAt(point.x, point.y, state.campaignMap.drawMode);
        return;
      }
      if (state.campaignMap.fogPainting && state.campaignMap.fogPointerId === event.pointerId) {
        const point = campaignMapPointerToImageCoords(event);
        if (!point) return;
        paintCampaignMapFogAt(point.x, point.y, state.campaignMap.fogMode);
        return;
      }
      if (!state.campaignMap.dragging || state.campaignMap.pointerId !== event.pointerId) return;
      const dx = event.clientX - state.campaignMap.lastClientX;
      const dy = event.clientY - state.campaignMap.lastClientY;
      state.campaignMap.lastClientX = event.clientX;
      state.campaignMap.lastClientY = event.clientY;
      state.campaignMap.panX += dx;
      state.campaignMap.panY += dy;
      applyCampaignMapTransform();
    });

    const endCampaignMapDrag = (event) => {
      if (state.campaignMap.drawPainting && state.campaignMap.drawPointerId === event.pointerId) {
        state.campaignMap.drawPainting = false;
        state.campaignMap.drawPointerId = null;
        state.campaignMap.lastDrawX = null;
        state.campaignMap.lastDrawY = null;
        if (Number.isInteger(state.selectedCampaignId)) {
          const drawData = serializeCampaignMapDrawCanvas();
          state.campaignMap.drawCanvasLoadedCampaignId = state.selectedCampaignId;
          state.campaignMap.drawCanvasLoadedKey = `${state.selectedCampaignId}:${drawData}`;
          persistCampaignMapDraw(state.selectedCampaignId, drawData);
        }
        if (state.campaignMap.pendingRemoteSync) {
          const pending = state.campaignMap.pendingRemoteSync;
          state.campaignMap.pendingRemoteSync = null;
          applyCampaignMapSyncSnapshot(pending, { force: true });
        }
        return;
      }
      if (state.campaignMap.fogPainting && state.campaignMap.fogPointerId === event.pointerId) {
        state.campaignMap.fogPainting = false;
        state.campaignMap.fogPointerId = null;
        if (Number.isInteger(state.selectedCampaignId)) {
          const fogData = serializeCampaignMapFogCanvas();
          state.campaignMap.fogCanvasLoadedCampaignId = state.selectedCampaignId;
          state.campaignMap.fogCanvasLoadedKey = `${state.selectedCampaignId}:${fogData}`;
          scheduleCampaignMapFogSave(state.selectedCampaignId, fogData);
        }
        if (state.campaignMap.pendingRemoteSync) {
          const pending = state.campaignMap.pendingRemoteSync;
          state.campaignMap.pendingRemoteSync = null;
          applyCampaignMapSyncSnapshot(pending, { force: true });
        }
        return;
      }
      if (!state.campaignMap.dragging || state.campaignMap.pointerId !== event.pointerId) return;
      state.campaignMap.dragging = false;
      state.campaignMap.pointerId = null;
      els.campaignMapViewport.classList.remove("is-dragging");
      if (state.campaignMap.pendingRemoteSync) {
        const pending = state.campaignMap.pendingRemoteSync;
        state.campaignMap.pendingRemoteSync = null;
        applyCampaignMapSyncSnapshot(pending, { force: true });
      }
    };

    els.campaignMapViewport.addEventListener("pointerleave", () => {
      hideCampaignMapFogCursorPreview();
    });
    els.campaignMapViewport.addEventListener("pointerup", endCampaignMapDrag);
    els.campaignMapViewport.addEventListener("pointercancel", endCampaignMapDrag);
  }

  document.addEventListener("mouseover", (event) => {
    const chip =
      event.target instanceof Element
        ? event.target.closest(".condition-chip, .player-turn-resource-btn[data-tip]")
        : null;
    if (!(chip instanceof HTMLElement)) return;
    showTooltipForElement(chip);
  });

  document.addEventListener("mouseout", (event) => {
    const activeChip = getActiveConditionTooltipChip();
    if (!activeChip) return;
    const targetChip =
      event.target instanceof Element
        ? event.target.closest(".condition-chip, .player-turn-resource-btn[data-tip]")
        : null;
    if (targetChip !== activeChip) return;
    const relatedChip =
      event.relatedTarget instanceof Element
        ? event.relatedTarget.closest(".condition-chip, .player-turn-resource-btn[data-tip]")
        : null;
    if (relatedChip === activeChip) return;
    hideConditionTooltip();
  });

  document.addEventListener("focusin", (event) => {
    const chip =
      event.target instanceof Element
        ? event.target.closest(".condition-chip, .player-turn-resource-btn[data-tip]")
        : null;
    if (!(chip instanceof HTMLElement)) return;
    showTooltipForElement(chip);
  });

  document.addEventListener("focusout", (event) => {
    const activeChip = getActiveConditionTooltipChip();
    if (!activeChip) return;
    const targetChip =
      event.target instanceof Element
        ? event.target.closest(".condition-chip, .player-turn-resource-btn[data-tip]")
        : null;
    if (targetChip !== activeChip) return;
    const relatedChip =
      event.relatedTarget instanceof Element
        ? event.relatedTarget.closest(".condition-chip, .player-turn-resource-btn[data-tip]")
        : null;
    if (relatedChip === activeChip) return;
    hideConditionTooltip();
  });

  window.addEventListener(
    "scroll",
    () => {
      const activeChip = getActiveConditionTooltipChip();
      if (!activeChip) return;
      positionConditionTooltip(activeChip);
    },
    true
  );

  window.addEventListener("resize", () => {
    const activeChip = getActiveConditionTooltipChip();
    if (activeChip) positionConditionTooltip(activeChip);
    hideMapStatblockHover();
    if (state.page === "scenario-map") applyRunMapTransform();
    if (state.page === "campaign-map") applyCampaignMapTransform();
  });
}

const { api } = window.FWDTApi.createApiClient({
  state,
  onAuthRequired: () => {
    setLoginStatus("Please sign in.");
    showPage("login");
  },
  isLoginPath: (path) => path === "/api/auth/login"
});

const tooltipController = window.FWDTTooltips.createTooltipController();
const {
  PLAYER_TURN_RESOURCE_TIPS,
  getActiveConditionTooltipChip,
  hideConditionTooltip,
  hideMapStatblockHover,
  positionConditionTooltip,
  showConditionTooltip,
  showMapStatblockHover,
  showTooltipForElement
} = tooltipController;

const diceController = window.FWDTDice.createDiceController({
  state,
  els,
  api,
  setStatus,
  diceSkinOptions: DICE_SKIN_OPTIONS,
  diceSkinConfigByKey: DICE_SKIN_CONFIG_BY_KEY,
  maxDicePoolCount: MAX_DICE_POOL_COUNT,
  getDicePoolSegments: getDicePoolSegmentsBase,
  getDicePoolTotalCount: getDicePoolTotalCountBase,
  buildDicePoolNotation: buildDicePoolNotationBase,
  formatDiceNotation: formatDiceNotationBase,
  buildDiceEntry: buildDiceEntryBase,
  addDieToPoolState: addDieToPoolStateBase,
  resetDicePoolState: resetDicePoolStateBase,
  resolveCurrentDiceSkinConfig: resolveCurrentDiceSkinConfigBase,
  getDiceSkinKey: getDiceSkinKeyBase,
  windowRef: window
});
const {
  addDieToPool,
  getAvailableDiceSkinKeysForCurrentUser,
  getCurrentDiceSkinConfig,
  renderDiceOverlay,
  resetDicePool,
  rollDicePool,
  saveDiceSkinPreference,
  setDiceOverlayOpen
} = diceController;
const getDiceSkinKey = (value) => getDiceSkinKeyBase(value, DICE_SKIN_CONFIG_BY_KEY);

const routingController = window.FWDTRouting.createRoutingController({
  state,
  parseRouteBase,
  routePathForBase,
  historyRef: history,
  locationRef: window.location,
  setStatus,
  showPage,
  loadMonsters,
  loadUserSettings,
  renderSettingsPage,
  renderDiceShopPage,
  loadPlayerLive,
  startPlayerLivePolling,
  loadCampaigns,
  setAnalyticsCampaign,
  renderAnalyticsPage,
  loadAdminData,
  renderAdminPage,
  stopPlayerLivePolling,
  safeLoadCombatState,
  loadCampaignData,
  loadCampaignMapData,
  renderCompletedScenariosPage,
  renderCampaignMapPage,
  loadSceneImages,
  renderScenePage,
  selectedScenario,
  focusPreviewOnActiveNonPc,
  renderScenarioRunPage,
  renderScenarioCompletedEditPage,
  renderScenarioEditPage
});
const { navigateToPath, navigateToPage, routePathFor } = routingController;

const welcomePageController = window.FWDTWelcomePage.createWelcomePageController({
  state,
  els,
  slugifyClassName,
  navigateToPage
});

const libraryPageController = window.FWDTLibraryPage.createLibraryPageController({
  state,
  els,
  api,
  setStatus,
  selectedMonster,
  setMonsterPasteTarget,
  updateMonsterLegendaryFieldsVisibility,
  setMonsterImagePreview,
  setMonsterTokenImagePreview,
  setEnemyMonsterPreview,
  setMonsterEditorReadOnly,
  openImageModal
});

const campaignPageController = window.FWDTCampaignPage.createCampaignPageController({
  state,
  els,
  api,
  setStatus,
  loadCampaignData,
  navigateToPage,
  selectedCampaign,
  renderNav,
  windowRef: window
});

const campaignMapPageController = window.FWDTCampaignMapPage.createCampaignMapPageController({
  state,
  els,
  selectedCampaign,
  ensureCampaignMapDrawCanvasFromData,
  ensureCampaignMapFogCanvasFromData,
  maybeShowCampaignMapPing,
  applyCampaignMapTransform,
  resetCampaignMapView,
  startCampaignMapSyncPolling,
  stopCampaignMapSyncPolling
});

const combatUiController = window.FWDTCombatUI.createCombatUiController({
  api,
  setStatus,
  safeLoadCombatState,
  rerenderCurrentScenarioPage,
  isAllyCombatant,
  hasRevealMoment,
  triggerRevealMoment,
  hideConditionTooltip,
  CONDITIONS,
  CONDITION_BY_KEY,
  combatantUsesPortraitToken,
  combatantIconFallbackSrc,
  combatantTokenIconSrc,
  documentRef: document
});

const scenarioEditPageController = window.FWDTScenarioEditPage.createScenarioEditPageController({
  state,
  els,
  api,
  setStatus,
  selectedScenario,
  setScenarioMapPreview,
  createCombatantNameElement,
  hasRevealMoment,
  createPlayerVisibilityToggle,
  createConditionSelect,
  attachInitiativeBlurUpdate,
  attachEnemyHpBlurUpdate,
  applyConditionStyle,
  applyConditionStyleReadonly,
  renderScenarioRunPage,
  combatantKindLabel,
  safeLoadCombatState,
  loadCampaignData,
  navigateToPage,
  windowRef: window
});

const playerLivePageController = window.FWDTPlayerLivePage.createPlayerLivePageController({
  state,
  els,
  api,
  createCombatantNameElement,
  applyConditionStyleReadonly,
  isAllyCombatant,
  setPlayerMapTokenSize,
  scrollPlayerInitiativeToActive,
  updatePlayerRevealMomentsFromShared,
  maybeCelebrateEncounterWin,
  playerTurnResourceTips: PLAYER_TURN_RESOURCE_TIPS,
  combatantTokenSizeScale,
  isSameCombatantId,
  hasPlayerRevealMoment,
  combatantUsesPortraitToken,
  combatantIconFallbackSrc,
  combatantTokenIconSrc,
  fadeOutAndRemoveToken,
  setPlayerMapFogOverlay,
  setPlayerMapDragLockUi,
  setPlayerMapPingModeUi,
  setPlayerMapDrawModeUi,
  ensurePlayerMapDrawCanvasFromData,
  clearPlayerMapDrawCanvas,
  maybeShowPlayerMapPing,
  clamp,
  stopPlayerLivePolling
});

const scenarioRunPageController = window.FWDTScenarioRunPage.createScenarioRunPageController({
  state,
  els,
  api,
  setStatus,
  selectedScenario,
  isAllyCombatant,
  scenarioMapTokenSize,
  hydrateRunMapTokensFromScenario,
  startRunMapSyncPolling,
  stopRunMapSyncPolling,
  setRunMapTokenSizeUI,
  setRunMapDragLockUi,
  ensureRunMapFogCanvasFromScenario,
  resetRunMapViewForScenario,
  maybeShowRunMapPing,
  applyRunMapTransform,
  hideRunMapFogCursorPreview,
  clearRunMapFogCanvas,
  navigateToPage,
  createCombatantNameElement,
  hasRevealMoment,
  createPlayerVisibilityToggle,
  createConditionSelect,
  setupRunQuickEditInput,
  attachInitiativeBlurUpdate,
  attachEnemyHpBlurUpdate,
  applyConditionStyle,
  safeLoadCombatState,
  getScenarioTokenPositions,
  mapNaturalSize,
  ensureMapTokensForCombatants,
  fadeOutAndRemoveToken,
  clamp,
  combatantTokenSizeScale,
  isSameCombatantId,
  combatantUsesPortraitToken,
  combatantIconFallbackSrc,
  combatantTokenIconSrc,
  hideMapStatblockHover,
  showMapStatblockHover,
  openImageModal,
  maybeCelebrateEncounterWin,
  setRunMapFogMode,
  setRunMapPingModeUi,
  focusRunMapViewportForShortcuts,
  windowRef: window
});

const userPagesController = window.FWDTUserPages.createUserPagesController({
  state,
  els,
  api,
  setStatus,
  setSettingsProfileImagePreview,
  getAvailableDiceSkinKeysForCurrentUser,
  getCurrentDiceSkinConfig,
  getDiceSkinKey,
  saveDiceSkinPreference,
  diceSkinOptions: DICE_SKIN_OPTIONS,
  diceSkinConfigByKey: DICE_SKIN_CONFIG_BY_KEY,
  diceShopRedirectUrl: DICE_SHOP_REDIRECT_URL,
  diceShopOfferStoragePrefix: DICE_SHOP_OFFER_STORAGE_PREFIX,
  windowRef: window
});

const scenePageController = window.FWDTScenePage.createScenePageController({
  state,
  els,
  api,
  setSceneDraftImagePreview
});

const analyticsPageController = window.FWDTAnalyticsPage.createAnalyticsPageController({
  state,
  els,
  api,
  setStatus,
  slugifyClassName
});

const adminPageController = window.FWDTAdminPage.createAdminPageController({
  state,
  els,
  api,
  setStatus,
  openAdminActionModal,
  windowRef: window
});

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
