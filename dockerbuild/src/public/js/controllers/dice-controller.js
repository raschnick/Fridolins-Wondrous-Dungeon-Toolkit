(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTDice = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createDiceController({
    state,
    els,
    api,
    setStatus,
    diceSkinOptions,
    diceSkinConfigByKey,
    maxDicePoolCount,
    getDicePoolSegments,
    getDicePoolTotalCount,
    buildDicePoolNotation,
    formatDiceNotation,
    buildDiceEntry,
    addDieToPoolState,
    resetDicePoolState,
    resolveCurrentDiceSkinConfig,
    getDiceSkinKey,
    windowRef = typeof window !== "undefined" ? window : null
  }) {
    function setDiceOverlayOpen(isOpen) {
      state.diceOverlayOpen = Boolean(isOpen);
      if (els.dicePanel) {
        els.dicePanel.classList.toggle("hidden", !state.diceOverlayOpen);
      }
      if (els.diceToggleBtn) {
        els.diceToggleBtn.setAttribute("aria-expanded", state.diceOverlayOpen ? "true" : "false");
      }
    }

    function fallbackDiceRolls(count, sides) {
      const rolls = [];
      for (let i = 0; i < count; i += 1) {
        rolls.push(Math.floor(Math.random() * sides) + 1);
      }
      return rolls;
    }

    function fallbackDicePoolRolls(pool = state.dicePool) {
      const rolls = [];
      for (const segment of getDicePoolSegments(pool)) {
        rolls.push(...fallbackDiceRolls(segment.count, segment.sides));
      }
      return rolls;
    }

    function renderDiceOverlay() {
      const shouldShow = Boolean(state.authUser) && state.page !== "login";
      if (els.diceOverlay) {
        els.diceOverlay.classList.toggle("hidden", !shouldShow);
      }
      if (!shouldShow) {
        setDiceOverlayOpen(false);
        if (state.diceResultToastTimer && windowRef) {
          windowRef.clearTimeout(state.diceResultToastTimer);
          state.diceResultToastTimer = null;
        }
        state.dicePool = {};
        state.diceResultToastEntry = null;
        windowRef?.diceRenderer?.clear?.();
        return;
      }
      const toastEntry = state.diceResultToastEntry;
      if (els.diceResultToast) {
        const showToast = Boolean(toastEntry);
        els.diceResultToast.classList.toggle("hidden", !showToast);
        if (showToast) {
          if (els.diceResultToastExpression) {
            els.diceResultToastExpression.textContent = toastEntry.expression;
          }
          if (els.diceResultToastTotal) {
            els.diceResultToastTotal.textContent = String(toastEntry.total);
          }
          if (els.diceResultToastBreakdown) {
            els.diceResultToastBreakdown.textContent = toastEntry.breakdown;
          }
        }
      }

      const poolCount = getDicePoolTotalCount(state.dicePool);
      const hasPool = poolCount > 0;
      if (els.dicePoolBadge) {
        els.dicePoolBadge.classList.toggle("hidden", !hasPool);
        els.dicePoolBadge.textContent = hasPool ? String(poolCount) : "";
      }
      if (els.dicePresetButtons) {
        els.dicePresetButtons.querySelectorAll("button[data-sides]").forEach((button) => {
          if (!(button instanceof HTMLButtonElement)) return;
          const sides = Number(button.dataset.sides);
          const count = Math.max(0, Number(state.dicePool?.[sides]) || 0);
          button.classList.toggle("has-pool-count", count > 0);
          if (count > 0) {
            button.setAttribute("data-pool-count", String(count));
          } else {
            button.removeAttribute("data-pool-count");
          }
        });
      }
      if (els.diceRollPoolBtn) {
        els.diceRollPoolBtn.disabled = !hasPool;
      }
      if (els.diceResetPoolBtn) {
        els.diceResetPoolBtn.disabled = !hasPool;
      }
    }

    function resetDicePool({ shouldRender = true } = {}) {
      state.dicePool = resetDicePoolState();
      if (shouldRender) renderDiceOverlay();
    }

    function addDieToPool(sides) {
      const next = addDieToPoolState(state.dicePool, sides, maxDicePoolCount);
      if (!next.added) {
        if (next.reason === "limit") {
          setStatus(`Dice pool is limited to ${maxDicePoolCount} dice.`, "error");
        }
        return;
      }
      state.dicePool = next.pool;
      renderDiceOverlay();
    }

    function getAvailableDiceSkinKeysForCurrentUser() {
      if (state.authUser?.role === "admin") {
        return diceSkinOptions.map((skin) => skin.key);
      }
      const available = Array.isArray(state.userSettings?.user?.availableDiceSkins)
        ? state.userSettings.user.availableDiceSkins
        : Array.isArray(state.authUser?.availableDiceSkins)
          ? state.authUser.availableDiceSkins
          : ["default"];
      const filtered = available.filter((skin) => diceSkinConfigByKey[skin]);
      return filtered.length > 0 ? filtered : ["default"];
    }

    function getCurrentDiceSkinConfig() {
      return resolveCurrentDiceSkinConfig({
        userSettingsUser: state.userSettings?.user || null,
        authUser: state.authUser || null,
        diceSkinOptions,
        diceSkinConfigByKey
      });
    }

    async function saveDiceSkinPreference(diceSkin) {
      const nextDiceSkin = getDiceSkinKey(diceSkin, diceSkinConfigByKey);
      await api("/api/users/me/dice-skin", {
        method: "POST",
        body: JSON.stringify({ diceSkin: nextDiceSkin })
      });
      if (!state.userSettings) state.userSettings = {};
      if (!state.userSettings.user) state.userSettings.user = {};
      state.userSettings.user.diceSkin = nextDiceSkin;
      if (state.authUser) {
        state.authUser.diceSkin = nextDiceSkin;
      }
    }

    function setDiceResultToast(entry) {
      if (state.diceResultToastTimer && windowRef) {
        windowRef.clearTimeout(state.diceResultToastTimer);
        state.diceResultToastTimer = null;
      }
      state.diceResultToastEntry = entry || null;
      if (entry && windowRef) {
        state.diceResultToastTimer = windowRef.setTimeout(() => {
          state.diceResultToastTimer = null;
          state.diceResultToastEntry = null;
          renderDiceOverlay();
        }, 4200);
      }
      renderDiceOverlay();
    }

    async function rollDicePool() {
      const pool = { ...state.dicePool };
      const notation = buildDicePoolNotation(pool);
      if (!notation) return;
      const notations = getDicePoolSegments(pool).map((segment) => `${segment.count}d${segment.sides}`);

      let rolls = [];
      let total = 0;
      try {
        const diceSkin = getCurrentDiceSkinConfig();
        const diceResult = await windowRef?.diceRenderer?.rollMany?.({
          notations,
          theme: diceSkin.theme,
          themeColor: diceSkin.themeColor
        });
        rolls =
          Array.isArray(diceResult?.rolls) && diceResult.rolls.length > 0
            ? diceResult.rolls
            : fallbackDicePoolRolls(pool);
        total = Number.isFinite(diceResult?.total)
          ? diceResult.total
          : rolls.reduce((sum, value) => sum + value, 0);
      } catch (error) {
        console.error("Dice renderer unavailable, using fallback roll.", error);
        rolls = fallbackDicePoolRolls(pool);
        total = rolls.reduce((sum, value) => sum + value, 0);
        setStatus("3D dice renderer unavailable. Used local fallback roll.", "error");
      }

      const entry = buildDiceEntry({
        pool,
        rolls,
        total
      });
      state.diceRollHistory.unshift(entry);
      state.diceRollHistory = state.diceRollHistory.slice(0, 8);
      resetDicePool({ shouldRender: false });
      setDiceResultToast(entry);
      setDiceOverlayOpen(true);
    }

    return {
      addDieToPool,
      buildDicePoolNotation,
      formatDiceNotation,
      getAvailableDiceSkinKeysForCurrentUser,
      getCurrentDiceSkinConfig,
      renderDiceOverlay,
      resetDicePool,
      rollDicePool,
      saveDiceSkinPreference,
      setDiceOverlayOpen,
      setDiceResultToast
    };
  }

  return { createDiceController };
});
