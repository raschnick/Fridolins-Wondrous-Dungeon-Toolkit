(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTScenePage = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createScenePageController({ state, els, api, setSceneDraftImagePreview }) {
    function selectedSceneImage() {
      if (!Number.isInteger(state.selectedSceneId)) return null;
      return state.sceneImages.find((scene) => scene.id === state.selectedSceneId) || null;
    }

    function preferredSceneCampaignId() {
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
      if (!Number.isInteger(campaignId)) {
        state.sceneImages = [];
        state.selectedSceneId = null;
        return;
      }
      const scenes = await api(`/api/campaigns/${campaignId}/scenes`);
      state.sceneImages = Array.isArray(scenes) ? scenes : [];
      if (!state.sceneImages.some((scene) => scene.id === state.selectedSceneId)) {
        state.selectedSceneId = state.sceneImages[0]?.id ?? null;
      }
    }

    function renderScenePage() {
      const campaign = state.campaigns.find((entry) => entry.id === state.selectedCampaignId) || null;
      els.scenePageTitle.textContent = campaign ? campaign.name : "Scene View";
      if (els.sceneCampaignSelect) {
        const campaigns = Array.isArray(state.campaigns) ? state.campaigns : [];
        const previousValue = els.sceneCampaignSelect.value;
        els.sceneCampaignSelect.innerHTML = "";
        if (campaigns.length === 0) {
          const option = document.createElement("option");
          option.value = "";
          option.textContent = "No campaigns";
          els.sceneCampaignSelect.appendChild(option);
          els.sceneCampaignSelect.disabled = true;
        } else {
          for (const entry of campaigns) {
            const option = document.createElement("option");
            option.value = String(entry.id);
            option.textContent = entry.name;
            els.sceneCampaignSelect.appendChild(option);
          }
          const selectedValue = Number.isInteger(state.selectedCampaignId)
            ? String(state.selectedCampaignId)
            : previousValue;
          if (selectedValue && campaigns.some((entry) => String(entry.id) === selectedValue)) {
            els.sceneCampaignSelect.value = selectedValue;
          } else {
            els.sceneCampaignSelect.value = String(campaigns[0].id);
          }
          els.sceneCampaignSelect.disabled = false;
        }
      }
      setSceneDraftImagePreview(state.draftSceneImageData || "");
      if (els.sceneSearchInput && els.sceneSearchInput.value !== state.sceneSearchQuery) {
        els.sceneSearchInput.value = state.sceneSearchQuery;
      }

      const query = state.sceneSearchQuery.trim().toLowerCase();
      const filtered = query
        ? state.sceneImages.filter((scene) => `${scene.name || ""}`.toLowerCase().includes(query))
        : [...state.sceneImages];

      if (!filtered.some((scene) => scene.id === state.selectedSceneId)) {
        state.selectedSceneId = filtered[0]?.id ?? null;
      }

      els.sceneList.innerHTML = "";
      if (filtered.length === 0) {
        els.sceneList.innerHTML = "<li>No scenes yet.</li>";
      } else {
        for (const scene of filtered) {
          const li = document.createElement("li");
          li.className = "list-row";
          li.dataset.sceneId = String(scene.id);
          const label = document.createElement("span");
          label.textContent = scene.name || "Unnamed Scene";
          li.appendChild(label);
          if (scene.id === state.campaignLiveSceneImageId) {
            const dot = document.createElement("span");
            dot.className = "scenario-shared-dot";
            dot.title = "Shared with players";
            li.appendChild(dot);
          }
          if (scene.id === state.selectedSceneId) {
            li.classList.add("active");
          }
          li.tabIndex = 0;
          els.sceneList.appendChild(li);
        }
      }

      const selected = selectedSceneImage();
      const hasSelected = Boolean(selected);
      els.scenePreviewTitle.textContent = hasSelected ? selected.name : "Preview";
      els.scenePreviewHint.classList.toggle("hidden", hasSelected);
      if (hasSelected && selected.image_data) {
        els.scenePreviewImage.src = selected.image_data;
        els.scenePreviewImage.classList.remove("hidden");
      } else {
        els.scenePreviewImage.src = "";
        els.scenePreviewImage.classList.add("hidden");
      }
      els.deleteSceneBtn.classList.toggle("hidden", !hasSelected);

      const isSelectedShared = hasSelected && selected.id === state.campaignLiveSceneImageId;
      els.shareSceneBtn.disabled = !hasSelected;
      els.shareSceneBtn.textContent = isSelectedShared ? "Stop Sharing" : "Share with Players";
    }

    return {
      loadSceneImages,
      preferredSceneCampaignId,
      renderScenePage,
      selectedSceneImage
    };
  }

  return { createScenePageController };
});
