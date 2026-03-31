(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTRouting = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createRoutingController({
    state,
    parseRouteBase,
    routePathForBase,
    historyRef = typeof history !== "undefined" ? history : null,
    locationRef = typeof window !== "undefined" ? window.location : null,
    setStatus,
    showPage,
    loadMonsters,
    loadUserSettings,
    renderSettingsPage,
    renderDiceShopPage,
    loadPlayerLive,
    startPlayerLivePolling,
    loadCampaigns,
    loadCampaignMapData,
    setAnalyticsCampaign,
    renderAnalyticsPage,
    loadAdminData,
    renderAdminPage,
    stopPlayerLivePolling,
    safeLoadCombatState,
    loadCampaignData,
    renderCompletedScenariosPage,
    renderCampaignMapPage,
    loadSceneImages,
    renderScenePage,
    selectedScenario,
    focusPreviewOnActiveNonPc,
    renderScenarioRunPage,
    renderScenarioCompletedEditPage,
    renderScenarioEditPage
  }) {
    let routeRequestId = 0;

    function parseRoute(pathname) {
      return parseRouteBase(pathname);
    }

    function routePathFor(page, campaignId = null, scenarioId = null, playerMode = null) {
      return routePathForBase(page, campaignId, scenarioId, playerMode);
    }

    async function syncHistory(path, { replace = false } = {}) {
      if (!historyRef || !locationRef) return;
      if (replace) {
        historyRef.replaceState({}, "", path);
        return;
      }
      if (locationRef.pathname !== path) {
        historyRef.pushState({}, "", path);
      }
    }

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

      if (route.page === "dice-shop") {
        try {
          await loadUserSettings();
          renderDiceShopPage();
        } catch (error) {
          setStatus(error.message, "error");
        }
        if (!isCurrent()) return;
        showPage("dice-shop");
        await syncHistory("/shop", { replace });
        return;
      }

      if (route.page === "player-home") {
        state.playerLiveViewMode =
          route.playerMode === "map"
            ? "map"
            : route.playerMode === "campaign-map"
              ? "campaign-map"
            : route.playerMode === "scene"
              ? "scene"
              : "initiative";
        try {
          await loadPlayerLive();
        } catch (error) {
          setStatus(error.message, "error");
        }
        if (!isCurrent()) return;
        startPlayerLivePolling();
        showPage("player-home");
        await syncHistory(routePathFor("player-home", null, null, state.playerLiveViewMode), {
          replace
        });
        return;
      }

      if (route.page === "analytics") {
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

      const campaignExists = state.campaigns.some((campaign) => campaign.id === route.campaignId);
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

      if (route.page === "campaign-map") {
        try {
          await loadCampaignMapData(route.campaignId);
        } catch (error) {
          setStatus(error.message, "error");
        }
        if (!isCurrent()) return;
        showPage("campaign-map");
        renderCampaignMapPage();
        await syncHistory(routePathFor("campaign-map", route.campaignId), { replace });
        return;
      }

      if (route.page === "campaign-scene") {
        try {
          await loadSceneImages(route.campaignId);
        } catch (error) {
          setStatus(error.message, "error");
        }
        if (!isCurrent()) return;
        renderScenePage();
        showPage("campaign-scene");
        await syncHistory(routePathFor("campaign-scene", route.campaignId), { replace });
        return;
      }

      if (!Number.isInteger(route.scenarioId)) {
        await safeNavigate(routePathFor("campaign", route.campaignId), "Invalid scenario route.");
        return;
      }

      const scenarioExists = state.scenarios.some((scenario) => scenario.id === route.scenarioId);
      if (!scenarioExists) {
        await safeNavigate(
          routePathFor("campaign", route.campaignId),
          "Scenario not found in campaign."
        );
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

    return {
      applyRoute,
      navigateToPage,
      navigateToPath,
      parseRoute,
      routePathFor,
      syncHistory
    };
  }

  return { createRoutingController };
});
