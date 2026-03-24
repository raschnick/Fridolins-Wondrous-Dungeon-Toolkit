(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTCombatUI = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createCombatUiController({
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
    documentRef = typeof document !== "undefined" ? document : null
  }) {
    function combatantKindLabel(combatant) {
      if (combatant.kind === "character") return "PC";
      return isAllyCombatant(combatant) ? "Ally" : "Enemy";
    }

    function createCombatantNameElement(combatant) {
      if (!documentRef) return null;
      const wrapper = documentRef.createElement("span");
      wrapper.className = "combatant-name";

      const icon = documentRef.createElement("img");
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

      const text = documentRef.createElement("span");
      const isHiddenForPlayers = combatant.kind !== "character" && Number(combatant.player_visible) === 0;
      text.textContent = isHiddenForPlayers ? `(${combatant.name})` : combatant.name;
      wrapper.appendChild(text);

      return wrapper;
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
          rerenderCurrentScenarioPage();
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
          rerenderCurrentScenarioPage();
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

    function createPlayerVisibilityToggle(combatant, rerender) {
      if (!documentRef) return null;
      const visibleToPlayers = Number(combatant.player_visible) !== 0;
      const button = documentRef.createElement("button");
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
      if (!documentRef) return null;
      const select = documentRef.createElement("select");
      select.className = "condition-select";

      const placeholder = documentRef.createElement("option");
      placeholder.value = "";
      placeholder.textContent = "Conditions";
      placeholder.selected = true;
      select.appendChild(placeholder);

      for (const condition of CONDITIONS) {
        const option = documentRef.createElement("option");
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

    function applyConditionStyle(container, combatant) {
      if (!documentRef) return;
      const keys = Array.isArray(combatant.condition_keys) ? combatant.condition_keys : [];
      if (keys.length === 0) return;

      for (const key of keys) {
        const condition = CONDITION_BY_KEY[key];
        if (!condition) continue;
        const chip = documentRef.createElement("button");
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
        container.appendChild(chip);
      }
    }

    function applyConditionStyleReadonly(container, combatant) {
      if (!documentRef) return;
      const keys = Array.isArray(combatant.condition_keys) ? combatant.condition_keys : [];
      if (keys.length === 0) return;

      for (const key of keys) {
        const condition = CONDITION_BY_KEY[key];
        if (!condition) continue;
        const chip = documentRef.createElement("span");
        chip.className = "condition-chip condition-chip-readonly";
        chip.textContent = condition.label;
        chip.setAttribute("data-tip", condition.tip);
        chip.setAttribute("data-condition-key", condition.key);
        container.appendChild(chip);
      }
    }

    return {
      applyConditionStyle,
      applyConditionStyleReadonly,
      attachEnemyHpBlurUpdate,
      attachInitiativeBlurUpdate,
      combatantKindLabel,
      createCombatantNameElement,
      createConditionSelect,
      createPlayerVisibilityToggle,
      setupRunQuickEditInput
    };
  }

  return { createCombatUiController };
});
