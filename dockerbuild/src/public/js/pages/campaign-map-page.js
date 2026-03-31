(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTCampaignMapPage = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createCampaignMapPageController({
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
  }) {
    function renderCampaignMapPage() {
      const campaign = selectedCampaign();
      const campaignMap = state.campaignMapData || null;
      const mapImageData = `${campaignMap?.mapImageData || ""}`;
      const mapDrawData = `${campaignMap?.mapDrawData || ""}`;
      const mapFogData = `${campaignMap?.mapFogData || ""}`;
      const mapLastPingJson = `${campaignMap?.mapLastPingJson || ""}`;
      const hasMap = Boolean(mapImageData);

      els.campaignMapPageTitle.textContent = campaign
        ? `${campaign.name}`
        : "Campaign Map";
      if (hasMap) {
        if (els.campaignMapImage.src !== mapImageData) {
          els.campaignMapImage.src = mapImageData;
        }
      } else if (els.campaignMapImage.src) {
        els.campaignMapImage.src = "";
      }
      els.campaignMapImage.classList.toggle("hidden", !hasMap);
      els.campaignMapDrawCanvas?.classList.toggle("hidden", !hasMap);
      els.campaignMapViewport.classList.toggle("hidden", !hasMap);
      els.campaignMapHint.classList.toggle("hidden", hasMap);
      els.clearCampaignMapBtn.disabled = !hasMap;
      els.campaignMapControls.classList.toggle("hidden", !hasMap);
      els.campaignMapDmControls.classList.toggle("hidden", !hasMap);
      els.campaignMapFogBrushControls.classList.toggle(
        "hidden",
        !hasMap || state.campaignMap.fogMode === "navigate"
      );

      if (!hasMap) {
        stopCampaignMapSyncPolling();
        resetCampaignMapView(null, "");
        if (els.campaignMapPings) els.campaignMapPings.innerHTML = "";
        if (els.campaignMapDrawCanvas instanceof HTMLCanvasElement) {
          const ctx = els.campaignMapDrawCanvas.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, els.campaignMapDrawCanvas.width, els.campaignMapDrawCanvas.height);
        }
        if (els.campaignMapFogCanvas instanceof HTMLCanvasElement) {
          const ctx = els.campaignMapFogCanvas.getContext("2d");
          if (ctx) ctx.clearRect(0, 0, els.campaignMapFogCanvas.width, els.campaignMapFogCanvas.height);
        }
        return;
      }

      const shouldResetMap =
        state.campaignMap.campaignId !== campaignMap?.campaignId ||
        state.campaignMap.mapKey !== mapImageData;
      if (shouldResetMap) {
        resetCampaignMapView(campaignMap?.campaignId || null, mapImageData);
      }
      ensureCampaignMapDrawCanvasFromData(mapDrawData);
      ensureCampaignMapFogCanvasFromData(mapFogData);
      maybeShowCampaignMapPing(mapLastPingJson);
      applyCampaignMapTransform();
      startCampaignMapSyncPolling();
    }

    return { renderCampaignMapPage };
  }

  return { createCampaignMapPageController };
});
