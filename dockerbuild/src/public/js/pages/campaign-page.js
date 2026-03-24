(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTCampaignPage = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createCampaignPageController({
    state,
    els,
    api,
    setStatus,
    loadCampaignData,
    navigateToPage,
    selectedCampaign,
    renderNav,
    windowRef = typeof window !== "undefined" ? window : null
  }) {
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
          if (!windowRef?.confirm?.(`Delete character "${character.name}" from this campaign?`)) return;
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
          if (!windowRef?.confirm?.(`Delete scenario "${scenario.name}"?`)) return;
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
          if (!windowRef?.confirm?.(`Delete scenario "${scenario.name}"?`)) return;
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

    function renderCampaignPage() {
      const campaign = selectedCampaign();
      els.campaignPageTitle.textContent = campaign ? `Campaign: ${campaign.name}` : "Campaign";
      renderCharacters();
      renderScenarios();
      renderNav();
    }

    return {
      renderCampaignPage,
      renderCharacters,
      renderCompletedScenariosPage,
      renderScenarios
    };
  }

  return { createCampaignPageController };
});
