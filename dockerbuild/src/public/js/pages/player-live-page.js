(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTPlayerLivePage = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createPlayerLivePageController({
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
    playerTurnResourceTips,
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
    maybeShowPlayerMapPing,
    clamp,
    stopPlayerLivePolling
  }) {
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
      setPlayerMapPingModeUi(false);
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
      mapLastPingJson,
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
        if (els.playerMapPings) els.playerMapPings.innerHTML = "";
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
            if (state.playerMap.pingMode) return;
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
            state.playerMap.hoverCombatantId = combatantId;
            const row = els.playerLiveCombatantList?.querySelector(`li[data-combatant-id="${combatantId}"]`);
            if (row instanceof HTMLElement) {
              row.classList.add("map-token-hover-linked");
            }
          });
          token.addEventListener("pointerenter", () => {
            const combatantId = Number(token.dataset.combatantId);
            if (!Number.isInteger(combatantId)) return;
            state.playerMap.hoverCombatantId = combatantId;
            const row = els.playerLiveCombatantList?.querySelector(`li[data-combatant-id="${combatantId}"]`);
            if (row instanceof HTMLElement) {
              row.classList.add("map-token-hover-linked");
            }
          });
          token.addEventListener("mouseleave", () => {
            const combatantId = Number(token.dataset.combatantId);
            if (!Number.isInteger(combatantId)) return;
            state.playerMap.hoverCombatantId = null;
            const row = els.playerLiveCombatantList?.querySelector(`li[data-combatant-id="${combatantId}"]`);
            if (row instanceof HTMLElement) {
              row.classList.remove("map-token-hover-linked");
            }
          });
          token.addEventListener("pointerleave", () => {
            const combatantId = Number(token.dataset.combatantId);
            if (!Number.isInteger(combatantId)) return;
            state.playerMap.hoverCombatantId = null;
            const row = els.playerLiveCombatantList?.querySelector(`li[data-combatant-id="${combatantId}"]`);
            if (row instanceof HTMLElement) {
              row.classList.remove("map-token-hover-linked");
            }
          });
        }

        if (token.__fadeOutTimer) {
          clearTimeout(token.__fadeOutTimer);
          token.__fadeOutTimer = null;
        }
        token.classList.remove("token-fade-out");

        token.classList.add("player-map-token");
        const isPcToken = combatant.kind === "character";
        const isNpcToken = !isPcToken && isAllyCombatant(combatant);
        const isEnemyToken = !isPcToken && !isNpcToken;
        token.classList.toggle("token-pc", isPcToken);
        token.classList.toggle("token-npc", isNpcToken);
        token.classList.toggle("token-enemy", isEnemyToken);

        token.title = combatant.name;
        token.dataset.combatantId = String(combatant.id);
        token.style.left = `${pos.x}px`;
        token.style.top = `${pos.y}px`;
        token.style.setProperty("--token-scale", String(combatantTokenSizeScale(combatant)));
        token.classList.toggle("is-active", isSameCombatantId(combatant.id, activeCombatantId));
        token.classList.toggle("reveal-moment-token", hasPlayerRevealMoment(combatant.id));

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
      maybeShowPlayerMapPing(mapLastPingJson);
      applyPlayerMapTransform();
    }

    function renderPlayerHome() {
      const shared = state.playerLiveData?.shared || null;
      const sharedScene = state.playerLiveData?.scene || null;
      const isMapMode = state.playerLiveViewMode === "map";
      const isSceneMode = state.playerLiveViewMode === "scene";
      const hasEncounter = Boolean(shared);
      const hasScene = Boolean(sharedScene && sharedScene.imageData);
      const hasContentForMode = isSceneMode ? hasScene : hasEncounter;
      if (els.playerWaitingTitle) {
        els.playerWaitingTitle.textContent = isSceneMode
          ? "Waiting for your genius DM to show a magical scene!"
          : "Waiting for your genius DM to fire up an awesome encounter!";
      }

      els.playerWaitingWrap.classList.toggle("hidden", hasContentForMode);
      els.playerLiveWrap.classList.toggle("hidden", !hasContentForMode);
      if (!hasContentForMode) {
        state.playerLiveLastActiveCombatantId = null;
        state.playerVisibleCombatantIdsByScenario = {};
        return;
      }

      if (hasEncounter) {
        updatePlayerRevealMomentsFromShared(shared);
      } else {
        state.playerVisibleCombatantIdsByScenario = {};
      }

      if (!isMapMode) {
        state.playerMap.hoverCombatantId = null;
      }
      els.playerLiveWrap.classList.toggle("player-map-mode", isMapMode);
      els.playerLiveInitiativeWrap.classList.toggle("hidden", isSceneMode);
      els.playerLiveMapWrap.classList.toggle("hidden", !isMapMode);
      els.playerLiveSceneWrap.classList.toggle("hidden", !isSceneMode);

      if (isSceneMode) {
        els.playerLiveEncounterName.textContent = sharedScene?.name || "Scene View";
        els.playerLiveRound.textContent = "";
        if (sharedScene?.imageData) {
          els.playerLiveSceneImage.src = sharedScene.imageData;
          els.playerLiveSceneImage.classList.remove("hidden");
          els.playerLiveSceneHint.classList.add("hidden");
        } else {
          els.playerLiveSceneImage.src = "";
          els.playerLiveSceneImage.classList.add("hidden");
          els.playerLiveSceneHint.classList.remove("hidden");
        }
        return;
      }

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

        const isActivePlayerTurn = combatant.kind === "character" && combatant.id === shared.activeCombatantId;
        if (isActivePlayerTurn) {
          const turnResourceKey = `${shared.scenarioId}:${shared.round}:${shared.activeCombatantId}`;
          if (!state.playerTurnResourcesByKey[turnResourceKey]) {
            state.playerTurnResourcesByKey[turnResourceKey] = {
              actionUsed: false,
              bonusUsed: false,
              movementUsed: false
            };
          }
          const resources = state.playerTurnResourcesByKey[turnResourceKey];
          const controls = document.createElement("div");
          controls.className = "player-turn-resources";
          const options = [
            { key: "actionUsed", label: "Action" },
            { key: "bonusUsed", label: "Bonus Action" },
            { key: "movementUsed", label: "Movement" }
          ];
          for (const option of options) {
            const button = document.createElement("button");
            button.type = "button";
            button.className = "player-turn-resource-btn";
            const tipKey = option.key === "actionUsed" ? "action" : option.key === "bonusUsed" ? "bonus" : "movement";
            button.setAttribute("data-tip", playerTurnResourceTips[tipKey]);
            button.setAttribute("data-tip-style", tipKey === "action" ? "action-list" : "plain");
            const isUsed = Boolean(resources[option.key]);
            button.classList.toggle("used", isUsed);
            button.setAttribute("aria-pressed", isUsed ? "true" : "false");
            button.textContent = option.label;
            button.addEventListener("click", () => {
              resources[option.key] = !resources[option.key];
              const nextUsed = Boolean(resources[option.key]);
              button.classList.toggle("used", nextUsed);
              button.setAttribute("aria-pressed", nextUsed ? "true" : "false");
              button.textContent = option.label;
            });
            controls.appendChild(button);
          }
          row.appendChild(controls);
        }

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
        const activeChanged =
          Number(shared.activeCombatantId) !== Number(state.playerLiveLastActiveCombatantId);
        scrollPlayerInitiativeToActive({ smooth: activeChanged });
        state.playerLiveLastActiveCombatantId = shared.activeCombatantId ?? null;
      } else {
        state.playerLiveLastActiveCombatantId = shared.activeCombatantId ?? null;
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
          `${shared.mapLastPingJson || ""}`,
          mapTokensJson,
          combatants,
          shared.activeCombatantId
        );
      }

      if (state.authUser?.role !== "admin" && state.page === "player-home") {
        maybeCelebrateEncounterWin(shared.scenarioId, combatants, { visibleOnly: true });
      }
    }

    async function loadPlayerLive() {
      if (!state.authUser || state.authUser.role === "admin") return;
      state.playerLiveData = await api("/api/player/live");
      renderPlayerHome();
    }

    return {
      applyPlayerMapTransform,
      loadPlayerLive,
      parseMapTokensJson,
      persistPlayerMapTokenPosition,
      renderPlayerHome,
      renderPlayerLiveMap,
      resetPlayerMapViewForScenario,
      schedulePlayerMapTokenSave
    };
  }

  return { createPlayerLivePageController };
});
