(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTScenarioRunPage = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createScenarioRunPageController({
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
    windowRef = typeof window !== "undefined" ? window : null
  }) {
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
      const active = state.combat.combatants.find((combatant) => combatant.id === state.combat.activeCombatantId);
      if (active && active.kind === "enemy") {
        state.runPreviewEnemyId = active.id;
      }
    }

    function scrollRunInitiativeToActive({ smooth = true } = {}) {
      if (!els.runOrderList) return;
      const activeRow = els.runOrderList.querySelector("li.turn-active");
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
      const activeIndex = combatants.findIndex((combatant) => combatant.id === state.combat.activeCombatantId);
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

    function activeCombatant() {
      return state.combat.combatants.find((combatant) => combatant.id === state.combat.activeCombatantId) || null;
    }

    function rememberScenarioRunView() {
      state.lastScenarioPage = state.page === "scenario-map" ? "scenario-map" : "scenario-run";
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

    async function advanceTurn() {
      if (!state.selectedScenarioId) return;
      state.combat = await api(`/api/scenarios/${state.selectedScenarioId}/combat/next-turn`, {
        method: "POST"
      });
      focusPreviewOnActiveNonPc();
      rememberScenarioRunView();
      renderScenarioRunPage();
      scrollRunInitiativeToActive({ smooth: true });
    }

    async function revokeTurn() {
      if (!state.selectedScenarioId) return;
      state.combat = await api(`/api/scenarios/${state.selectedScenarioId}/combat/prev-turn`, {
        method: "POST"
      });
      focusPreviewOnActiveNonPc();
      rememberScenarioRunView();
      renderScenarioRunPage();
    }

    async function resetCombat() {
      if (!state.selectedScenarioId) return;
      if (windowRef?.confirm && !windowRef.confirm("Reset combat to Round 1 and first turn?")) return;
      state.combat = await api(`/api/scenarios/${state.selectedScenarioId}/combat/reset`, {
        method: "POST"
      });
      focusPreviewOnActiveNonPc();
      rememberScenarioRunView();
      renderScenarioRunPage();
    }

    function handleKeyboardShortcut(event) {
      const key = `${event?.key || ""}`.toLowerCase();

      if (key === "e") {
        if (!state.selectedScenarioId) return false;
        if (state.page === "scenario-run" || state.page === "scenario-map") {
          event.preventDefault();
          const scenario = selectedScenario();
          const targetPage = Number(scenario?.is_completed) === 1
            ? "scenario-completed-edit"
            : "scenario-edit";
          navigateToPage(targetPage, {
            campaignId: state.selectedCampaignId,
            scenarioId: state.selectedScenarioId
          }).catch((error) => {
            setStatus(error.message, "error");
          });
          return true;
        }
        if (state.page === "scenario-edit") {
          event.preventDefault();
          navigateToPage("scenario-map", {
            campaignId: state.selectedCampaignId,
            scenarioId: state.selectedScenarioId
          }).catch((error) => {
            setStatus(error.message, "error");
          });
          return true;
        }
        return false;
      }

      if (key === "s" && state.page === "scenario-map" && state.authUser?.role === "admin") {
        event.preventDefault();
        hideMapStatblockHover();
        const combatant = pickMapShortcutPreviewCombatant();
        if (!combatant) {
          setStatus("No NPC/Enemy available to preview.");
          return true;
        }
        inspectCombatantStatblock(combatant);
        return true;
      }

      if (state.page === "scenario-map" && state.authUser?.role === "admin") {
        if (key === "f") {
          event.preventDefault();
          setRunMapFogMode(state.runMap.fogMode === "paint" ? "navigate" : "paint");
          return true;
        }
        if (key === "d") {
          event.preventDefault();
          setRunMapFogMode(state.runMap.fogMode === "erase" ? "navigate" : "erase");
          return true;
        }
        if (key === "g") {
          event.preventDefault();
          setRunMapPingModeUi(!state.runMap.pingMode);
          return true;
        }
      }

      if (state.page !== "scenario-run" && state.page !== "scenario-map") {
        return false;
      }

      if (!["n", "b", "r", "l"].includes(key)) {
        return false;
      }

      if (key === "n" && els.nextTurnBtn?.disabled) return false;
      if (key === "b" && els.revokeTurnBtn?.disabled) return false;

      event.preventDefault();
      if (key === "n") {
        advanceTurn().catch((error) => {
          setStatus(error.message, "error");
        });
        return true;
      }
      if (key === "b") {
        revokeTurn().catch((error) => {
          setStatus(error.message, "error");
        });
        return true;
      }
      if (key === "r") {
        toggleActiveCombatantReaction().catch((error) => {
          setStatus(error.message, "error");
        });
        return true;
      }
      cycleActiveCombatantLegendaryAction().catch((error) => {
        setStatus(error.message, "error");
      });
      return true;
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
            if (state.runMap.pingMode) return;
            if (state.runMap.fogMode !== "navigate") return;
            if (state.runMap.dragLocked) return;
            if (event.button !== 0) return;
            focusRunMapViewportForShortcuts();
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

        token.classList.add("run-map-token");
        const isPcToken = combatant.kind === "character";
        const isNpcToken = !isPcToken && isAllyCombatant(combatant);
        const isEnemyToken = !isPcToken && !isNpcToken;
        token.classList.toggle("token-pc", isPcToken);
        token.classList.toggle("token-npc", isNpcToken);
        token.classList.toggle("token-enemy", isEnemyToken);

        token.title = combatant.kind === "enemy"
          ? `${combatant.name} (double-click: statblock)`
          : combatant.name;
        token.dataset.combatantId = String(combatant.id);
        token.style.left = `${clamp(pos.x, 20, width - 20)}px`;
        token.style.top = `${clamp(pos.y, 20, height - 20)}px`;
        token.style.setProperty("--token-scale", String(combatantTokenSizeScale(combatant)));
        token.classList.toggle("is-active", isSameCombatantId(combatant.id, state.combat.activeCombatantId));
        token.classList.toggle("reveal-moment-token", hasRevealMoment(combatant.id));

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
        maybeShowRunMapPing(scenario.map_last_ping_json || "");
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
        if (els.runMapPings) els.runMapPings.innerHTML = "";
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
        if (els.runMapPings) els.runMapPings.innerHTML = "";
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

      const active = state.combat.combatants.find((combatant) => combatant.id === state.combat.activeCombatantId);
      if (
        !state.runPreviewEnemyId ||
        !state.combat.combatants.some((combatant) => combatant.id === state.runPreviewEnemyId && combatant.kind === "enemy")
      ) {
        state.runPreviewEnemyId =
          (active && active.kind === "enemy"
            ? active.id
            : state.combat.combatants.find((combatant) => combatant.kind === "enemy")?.id) || null;
      }

      const previewEnemy = state.combat.combatants.find((combatant) => combatant.id === state.runPreviewEnemyId);
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

    return {
      advanceTurn,
      cycleActiveCombatantLegendaryAction,
      focusPreviewOnActiveNonPc,
      handleKeyboardShortcut,
      inspectCombatantStatblock,
      pickMapShortcutPreviewCombatant,
      resetCombat,
      renderRunMapTokens,
      renderScenarioRunPage,
      revokeTurn,
      scrollRunInitiativeToActive,
      setMapHoverCombatantRow,
      toggleActiveCombatantReaction
    };
  }

  return { createScenarioRunPageController };
});
