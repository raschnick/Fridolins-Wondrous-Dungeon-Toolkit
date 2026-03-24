(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTAdminPage = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createAdminPageController({
    state,
    els,
    api,
    setStatus,
    openAdminActionModal,
    windowRef = typeof window !== "undefined" ? window : null
  }) {
    async function loadAdminData() {
      if (state.authUser?.role !== "admin") return;
      const [users, campaigns] = await Promise.all([
        api("/api/admin/users"),
        api("/api/campaigns")
      ]);
      state.adminUsers = users;
      state.campaigns = campaigns;

      if (
        !Number.isInteger(state.adminMemberCampaignId) ||
        !state.campaigns.some((campaign) => campaign.id === state.adminMemberCampaignId)
      ) {
        state.adminMemberCampaignId = state.campaigns[0]?.id ?? null;
      }

      if (Number.isInteger(state.adminMemberCampaignId)) {
        const [members, claims] = await Promise.all([
          api(`/api/campaigns/${state.adminMemberCampaignId}/members`),
          api(`/api/admin/campaigns/${state.adminMemberCampaignId}/character-claims`)
        ]);
        state.adminCampaignMembers = members;
        state.adminCampaignClaims = claims;
      } else {
        state.adminCampaignMembers = [];
        state.adminCampaignClaims = [];
      }
    }

    function renderAdminPage() {
      if (els.adminUserSearch.value !== state.adminUserSearchQuery) {
        els.adminUserSearch.value = state.adminUserSearchQuery;
      }
      if (els.adminMemberSearch.value !== state.adminMemberSearchQuery) {
        els.adminMemberSearch.value = state.adminMemberSearchQuery;
      }

      const userQuery = state.adminUserSearchQuery.trim().toLowerCase();
      const memberQuery = state.adminMemberSearchQuery.trim().toLowerCase();
      const filteredUsers = userQuery
        ? state.adminUsers.filter((user) => {
            const statusLabel = Number(user.active) === 1 ? "active" : "inactive";
            return `${user.username} ${user.role} ${statusLabel}`.toLowerCase().includes(userQuery);
          })
        : state.adminUsers;

      els.adminUserList.innerHTML = "";
      if (filteredUsers.length === 0) {
        els.adminUserList.innerHTML = "<li>No users yet.</li>";
      } else {
        for (const user of filteredUsers) {
          const li = document.createElement("li");
          li.className = "admin-user-item";
          const row = document.createElement("div");
          row.className = "list-row admin-row";

          const label = document.createElement("span");
          label.className = "admin-row-main";
          label.textContent = user.username;
          row.appendChild(label);

          const meta = document.createElement("div");
          meta.className = "admin-meta";
          const roleBadge = document.createElement("span");
          roleBadge.className = "admin-badge";
          roleBadge.textContent = user.role === "admin" ? "Admin" : "Player";
          meta.appendChild(roleBadge);
          const statusBadge = document.createElement("span");
          statusBadge.className = `admin-badge ${Number(user.active) === 1 ? "admin-badge-active" : "admin-badge-inactive"}`;
          statusBadge.textContent = Number(user.active) === 1 ? "Active" : "Inactive";
          meta.appendChild(statusBadge);
          row.appendChild(meta);

          const actions = document.createElement("div");
          actions.className = "row-actions";

          const resetButton = document.createElement("button");
          resetButton.type = "button";
          resetButton.textContent = "Reset PW";
          resetButton.addEventListener("click", async () => {
            const password = windowRef?.prompt?.(`New password for ${user.username}:`);
            if (!password) return;
            try {
              await api(`/api/admin/users/${user.id}/reset-password`, {
                method: "POST",
                body: JSON.stringify({ password })
              });
              setStatus(`Reset password for ${user.username}.`, "success");
            } catch (error) {
              setStatus(error.message, "error");
            }
          });
          actions.appendChild(resetButton);

          const toggleButton = document.createElement("button");
          toggleButton.type = "button";
          toggleButton.textContent = Number(user.active) === 1 ? "Deactivate" : "Activate";
          if (Number(user.active) !== 1) toggleButton.classList.add("npc-heal-btn");
          toggleButton.addEventListener("click", async () => {
            try {
              await api(`/api/admin/users/${user.id}/active`, {
                method: "POST",
                body: JSON.stringify({ active: Number(user.active) !== 1 })
              });
              await loadAdminData();
              renderAdminPage();
              setStatus(
                `${Number(user.active) === 1 ? "Deactivated" : "Activated"} ${user.username}.`,
                "success"
              );
            } catch (error) {
              setStatus(error.message, "error");
            }
          });
          actions.appendChild(toggleButton);

          if (user.role !== "admin") {
            const diceButton = document.createElement("button");
            diceButton.type = "button";
            diceButton.textContent = "Dice";
            diceButton.title = `Manage dice access for ${user.username}`;
            diceButton.addEventListener("click", () => {
              openAdminActionModal("dice-skins", { user });
            });
            actions.appendChild(diceButton);
          }

          row.appendChild(actions);
          li.appendChild(row);
          els.adminUserList.appendChild(li);
        }
      }

      els.adminCampaignList.innerHTML = "";
      if (state.campaigns.length === 0) {
        els.adminCampaignList.innerHTML = "<li>No campaigns yet.</li>";
      } else {
        for (const campaign of state.campaigns) {
          const li = document.createElement("li");
          li.textContent = campaign.name;
          li.dataset.campaignId = String(campaign.id);
          if (campaign.id === state.adminMemberCampaignId) li.classList.add("active");
          li.tabIndex = 0;
          els.adminCampaignList.appendChild(li);
        }
      }

      els.adminMemberUserSelect.innerHTML = "";
      for (const user of state.adminUsers) {
        if (Number(user.active) !== 1) continue;
        if (user.role !== "player") continue;
        const option = document.createElement("option");
        option.value = String(user.id);
        option.textContent = user.username;
        els.adminMemberUserSelect.appendChild(option);
      }
      if (els.adminMemberUserSelect.options.length === 0) {
        const option = document.createElement("option");
        option.value = "";
        option.textContent = "No active players available";
        option.disabled = true;
        option.selected = true;
        els.adminMemberUserSelect.appendChild(option);
      }

      els.adminMemberList.innerHTML = "";
      const filteredMembers = memberQuery
        ? state.adminCampaignMembers.filter((member) =>
            `${member.username} ${member.campaign_role}`.toLowerCase().includes(memberQuery)
          )
        : state.adminCampaignMembers;

      if (!Number.isInteger(state.adminMemberCampaignId)) {
        els.adminMemberList.innerHTML = "<li>Select a campaign.</li>";
      } else if (filteredMembers.length === 0) {
        els.adminMemberList.innerHTML = "<li>No members for this campaign yet.</li>";
      } else {
        for (const member of filteredMembers) {
          const li = document.createElement("li");
          const row = document.createElement("div");
          row.className = "list-row admin-row";

          const label = document.createElement("span");
          label.className = "admin-row-main";
          label.textContent = member.username;
          row.appendChild(label);

          const meta = document.createElement("div");
          meta.className = "admin-meta";
          const roleBadge = document.createElement("span");
          roleBadge.className = "admin-badge";
          roleBadge.textContent = "Player Access";
          meta.appendChild(roleBadge);
          row.appendChild(meta);

          const removeButton = document.createElement("button");
          removeButton.type = "button";
          removeButton.className = "delete-btn";
          removeButton.textContent = "X";
          removeButton.addEventListener("click", async () => {
            if (!Number.isInteger(state.adminMemberCampaignId)) return;
            try {
              await api(`/api/campaigns/${state.adminMemberCampaignId}/members/${member.user_id}`, {
                method: "DELETE"
              });
              await loadAdminData();
              renderAdminPage();
              setStatus(`Removed ${member.username} from campaign.`, "success");
            } catch (error) {
              setStatus(error.message, "error");
            }
          });
          row.appendChild(removeButton);

          li.appendChild(row);
          els.adminMemberList.appendChild(li);
        }
      }

      els.adminClaimList.innerHTML = "";
      if (!Number.isInteger(state.adminMemberCampaignId)) {
        els.adminClaimList.innerHTML = "<li>Select a campaign.</li>";
      } else if (!Array.isArray(state.adminCampaignClaims) || state.adminCampaignClaims.length === 0) {
        els.adminClaimList.innerHTML = "<li>No claimed characters in this campaign.</li>";
      } else {
        for (const claim of state.adminCampaignClaims) {
          const li = document.createElement("li");
          const row = document.createElement("div");
          row.className = "list-row admin-row";

          const label = document.createElement("span");
          label.className = "admin-row-main";
          label.textContent = `${claim.character_name} (${claim.class_name})`;
          row.appendChild(label);

          const meta = document.createElement("div");
          meta.className = "admin-meta";
          const userBadge = document.createElement("span");
          userBadge.className = "admin-badge";
          userBadge.textContent = claim.username;
          meta.appendChild(userBadge);
          row.appendChild(meta);

          const unclaimButton = document.createElement("button");
          unclaimButton.type = "button";
          unclaimButton.className = "delete-btn";
          unclaimButton.textContent = "Unclaim";
          unclaimButton.addEventListener("click", async () => {
            if (!Number.isInteger(state.adminMemberCampaignId)) return;
            try {
              await api(
                `/api/admin/campaigns/${state.adminMemberCampaignId}/character-claims/${claim.character_id}`,
                { method: "DELETE" }
              );
              await loadAdminData();
              renderAdminPage();
              setStatus(`Unclaimed ${claim.character_name}.`, "success");
            } catch (error) {
              setStatus(error.message, "error");
            }
          });
          row.appendChild(unclaimButton);

          li.appendChild(row);
          els.adminClaimList.appendChild(li);
        }
      }

      const hasSelectedCampaign = Number.isInteger(state.adminMemberCampaignId);
      els.adminOpenMembershipModalBtn.disabled = !hasSelectedCampaign;
    }

    return {
      loadAdminData,
      renderAdminPage
    };
  }

  return { createAdminPageController };
});
