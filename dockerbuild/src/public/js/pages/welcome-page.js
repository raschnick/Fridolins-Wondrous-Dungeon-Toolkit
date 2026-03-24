(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTWelcomePage = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createWelcomePageController({ state, els, slugifyClassName, navigateToPage }) {
    function renderWelcomeCampaigns() {
      els.welcomeCampaignList.innerHTML = "";
      if (state.campaigns.length === 0) {
        els.welcomeCampaignList.innerHTML = "<li>No campaigns yet.</li>";
        return;
      }

      for (const campaign of state.campaigns) {
        const li = document.createElement("li");
        li.className = "campaign-overview-row";
        li.tabIndex = 0;

        const row = document.createElement("div");
        row.className = "campaign-overview-grid";

        const name = document.createElement("strong");
        name.textContent = campaign.name;
        row.appendChild(name);

        const playersWrap = document.createElement("div");
        playersWrap.className = "campaign-overview-players";
        const summary = state.campaignSummaries[campaign.id] || {
          players: [],
          scenarioCount: 0,
          totalEncounters: 0,
          totalFinishedEncounters: 0,
          totalEnemyDamage: 0,
          totalEnemyDefeats: 0
        };
        if (summary.players.length === 0) {
          const noPlayers = document.createElement("span");
          noPlayers.className = "hint";
          noPlayers.textContent = "No players";
          playersWrap.appendChild(noPlayers);
        } else {
          for (const player of summary.players) {
            const badge = document.createElement("span");
            badge.className = "campaign-player-badge";

            const icon = document.createElement("img");
            icon.className = "campaign-player-icon";
            icon.alt = player.class_name || "PC";
            icon.src = `/icons/classes/${slugifyClassName(player.class_name)}.png`;
            icon.addEventListener("error", () => {
              if (!icon.src.endsWith("/icons/pc.svg")) icon.src = "/icons/pc.svg";
            });
            badge.appendChild(icon);

            const label = document.createElement("span");
            label.textContent = player.name;
            badge.appendChild(label);
            playersWrap.appendChild(badge);
          }
        }
        row.appendChild(playersWrap);

        const scenarioCount = document.createElement("span");
        scenarioCount.className = "campaign-scenario-count";
        scenarioCount.textContent = `${summary.scenarioCount} encounter${summary.scenarioCount === 1 ? "" : "s"}`;
        row.appendChild(scenarioCount);

        li.appendChild(row);

        const openCampaign = async () => {
          state.lastHomeCampaignId = campaign.id;
          await navigateToPage("campaign", { campaignId: campaign.id });
        };
        li.addEventListener("click", openCampaign);
        li.addEventListener("keydown", async (event) => {
          if (event.key !== "Enter" && event.key !== " ") return;
          event.preventDefault();
          await openCampaign();
        });

        els.welcomeCampaignList.appendChild(li);
      }
    }

    return { renderWelcomeCampaigns };
  }

  return { createWelcomePageController };
});
