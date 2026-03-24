(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTScenarioEditPage = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createScenarioEditPageController({
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
    windowRef = typeof window !== "undefined" ? window : null
  }) {
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
          if (!windowRef?.confirm?.(`Remove ${label} "${combatant.name}" from this scenario?`)) return;
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

    return {
      completeSelectedScenario,
      renderScenarioCompletedEditPage,
      renderScenarioEditPage
    };
  }

  return { createScenarioEditPageController };
});
