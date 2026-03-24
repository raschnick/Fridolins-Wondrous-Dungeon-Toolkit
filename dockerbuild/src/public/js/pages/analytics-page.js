(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTAnalyticsPage = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createAnalyticsPageController({
    state,
    els,
    api,
    setStatus,
    slugifyClassName
  }) {
    function formatConditionLabel(conditionKey) {
      const raw = `${conditionKey || ""}`.trim();
      if (!raw) return "";
      return raw
        .split(/[_\s-]+/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");
    }

    async function loadCampaignStats(campaignId) {
      if (!Number.isInteger(campaignId)) return null;
      const stats = await api(`/api/campaigns/${campaignId}/stats`);
      state.analyticsStatsByCampaign[campaignId] = stats;
      return stats;
    }

    function renderAnalyticsPage() {
      const campaigns = Array.isArray(state.campaigns) ? state.campaigns : [];
      els.analyticsCampaignSelect.innerHTML = "";
      if (campaigns.length === 0) {
        els.analyticsStatus.textContent = "No campaigns available yet.";
        els.analyticsMetrics.innerHTML = "";
        els.analyticsEnemyConditionList.innerHTML = "<li>No enemy condition data yet.</li>";
        els.analyticsPcInitiativeList.innerHTML = "<li>No PC initiative data yet.</li>";
        return;
      }

      for (const campaign of campaigns) {
        const option = document.createElement("option");
        option.value = String(campaign.id);
        option.textContent = campaign.name;
        if (campaign.id === state.analyticsSelectedCampaignId) {
          option.selected = true;
        }
        els.analyticsCampaignSelect.appendChild(option);
      }

      const selectedId = state.analyticsSelectedCampaignId;
      if (!Number.isInteger(selectedId)) {
        els.analyticsStatus.textContent = "Select a campaign.";
        return;
      }

      const stats = state.analyticsStatsByCampaign[selectedId];
      if (!stats) {
        els.analyticsStatus.textContent = "Loading stats...";
        els.analyticsMetrics.innerHTML = "";
        els.analyticsEnemyConditionList.innerHTML = "<li>No enemy condition data yet.</li>";
        els.analyticsPcInitiativeList.innerHTML = "<li>No PC initiative data yet.</li>";
        return;
      }

      els.analyticsStatus.textContent = "";
      const metricItems = [
        { label: "Total Damage dealt to enemies", value: stats.totalEnemyDamage ?? 0 },
        { label: "Total Enemies killed", value: stats.totalEnemyDefeats ?? 0 },
        { label: "Total PCs downed", value: stats.pcDownCount ?? 0 }
      ];
      els.analyticsEncounterCounters.innerHTML = "";
      const topCounterItems = [
        { label: "Total Encounters", value: stats.totalEncounters ?? 0 },
        { label: "Finished Encounters", value: stats.totalFinishedEncounters ?? 0 }
      ];
      for (const item of topCounterItems) {
        const box = document.createElement("article");
        box.className = "analytics-encounter-counter";
        const title = document.createElement("h4");
        title.textContent = item.label;
        const value = document.createElement("strong");
        value.textContent = String(item.value);
        box.appendChild(title);
        box.appendChild(value);
        els.analyticsEncounterCounters.appendChild(box);
      }
      els.analyticsMetrics.innerHTML = "";
      for (const item of metricItems) {
        const metric = document.createElement("article");
        metric.className = "analytics-metric";
        const title = document.createElement("h4");
        title.textContent = item.label;
        const value = document.createElement("strong");
        value.textContent = String(item.value);
        metric.appendChild(title);
        metric.appendChild(value);
        els.analyticsMetrics.appendChild(metric);
      }

      els.analyticsEnemyConditionList.innerHTML = "";
      const enemyEntries = Object.entries(stats.enemyConditionApplies || {});
      if (enemyEntries.length === 0) {
        els.analyticsEnemyConditionList.innerHTML = "<li>No enemy condition data yet.</li>";
      } else {
        enemyEntries.sort(
          (a, b) => Number(b[1]) - Number(a[1]) || String(a[0]).localeCompare(String(b[0]))
        );
        const podiumClasses = [
          "analytics-podium-gold",
          "analytics-podium-silver",
          "analytics-podium-bronze"
        ];
        for (const [index, [conditionKey, count]] of enemyEntries.slice(0, 3).entries()) {
          const li = document.createElement("li");
          li.className = `list-row analytics-podium-item ${podiumClasses[index]}`;
          const left = document.createElement("span");
          left.className = "analytics-podium-left";
          const medal = document.createElement("span");
          medal.className = "analytics-podium-medal";
          medal.textContent = String(index + 1);
          left.appendChild(medal);
          const label = document.createElement("span");
          label.textContent = formatConditionLabel(conditionKey);
          left.appendChild(label);
          const value = document.createElement("strong");
          value.textContent = String(Number(count) || 0);
          li.appendChild(left);
          li.appendChild(value);
          els.analyticsEnemyConditionList.appendChild(li);
        }
      }

      els.analyticsPcInitiativeList.innerHTML = "";
      const pcRows = Array.isArray(stats.pcInitiativeAverages) ? stats.pcInitiativeAverages : [];
      if (pcRows.length === 0) {
        els.analyticsPcInitiativeList.innerHTML = "<li>No PC initiative data yet.</li>";
      } else {
        const rankedRows = [...pcRows].sort((a, b) => {
          const avgA = Number.isFinite(Number(a.averageInitiative))
            ? Number(a.averageInitiative)
            : -Infinity;
          const avgB = Number.isFinite(Number(b.averageInitiative))
            ? Number(b.averageInitiative)
            : -Infinity;
          if (avgA !== avgB) return avgB - avgA;
          const encountersA = Number(a.encounterCount) || 0;
          const encountersB = Number(b.encounterCount) || 0;
          if (encountersA !== encountersB) return encountersB - encountersA;
          return String(a.characterName || "").localeCompare(String(b.characterName || ""));
        });
        for (const [index, row] of rankedRows.entries()) {
          const li = document.createElement("li");
          li.className = "list-row";
          const left = document.createElement("span");
          left.className = "analytics-pc-row";
          const rank = document.createElement("span");
          rank.className = "analytics-pc-rank";
          rank.textContent = `#${index + 1}`;
          left.appendChild(rank);
          const icon = document.createElement("img");
          icon.className = "analytics-pc-token";
          icon.alt = row.characterName || "PC";
          const fallbackSrc = `/icons/classes/${slugifyClassName(row.characterClass || "")}.png`;
          icon.src = row.claimedProfileImageData || fallbackSrc;
          icon.addEventListener("error", () => {
            if (!icon.src.endsWith(fallbackSrc)) {
              icon.src = fallbackSrc;
              return;
            }
            if (!icon.src.endsWith("/icons/pc.svg")) {
              icon.src = "/icons/pc.svg";
            }
          });
          if (row.claimedProfileImageData) {
            icon.classList.add("token-portrait");
          }
          left.appendChild(icon);
          const name = document.createElement("span");
          name.textContent = row.characterName || "Unknown";
          left.appendChild(name);
          const right = document.createElement("span");
          const avg = row.averageInitiative == null ? "-" : row.averageInitiative;
          const encounters = Number(row.encounterCount) || 0;
          right.textContent = `${avg} avg (${encounters} encounters)`;
          li.appendChild(left);
          li.appendChild(right);
          els.analyticsPcInitiativeList.appendChild(li);
        }
      }
    }

    async function setAnalyticsCampaign(campaignId) {
      if (!Number.isInteger(campaignId)) return;
      state.analyticsSelectedCampaignId = campaignId;
      renderAnalyticsPage();
      try {
        await loadCampaignStats(campaignId);
        renderAnalyticsPage();
      } catch (error) {
        setStatus(error.message, "error");
      }
    }

    return {
      loadCampaignStats,
      renderAnalyticsPage,
      setAnalyticsCampaign
    };
  }

  return { createAnalyticsPageController };
});
