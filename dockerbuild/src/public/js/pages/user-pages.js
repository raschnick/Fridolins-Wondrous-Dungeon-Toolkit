(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTUserPages = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createUserPagesController({
    state,
    els,
    api,
    setStatus,
    setSettingsProfileImagePreview,
    getAvailableDiceSkinKeysForCurrentUser,
    getCurrentDiceSkinConfig,
    getDiceSkinKey,
    saveDiceSkinPreference,
    diceSkinOptions,
    diceSkinConfigByKey,
    diceShopRedirectUrl,
    diceShopOfferStoragePrefix,
    windowRef = typeof window !== "undefined" ? window : null
  }) {
    function createDiceShopPreview(skin) {
      const preview = document.createElement("div");
      preview.className = "dice-shop-preview";

      const image = document.createElement("img");
      image.className = "dice-shop-preview-image";
      image.src = skin.previewImageUrl || "/images/crimson_preview.png";
      image.alt = `${skin.label} dice preview`;
      image.loading = "lazy";
      image.decoding = "async";
      preview.appendChild(image);

      return preview;
    }

    function getDiceShopOfferStorageKey(skinKey) {
      return `${diceShopOfferStoragePrefix}${skinKey}`;
    }

    function ensureDiceShopLockedOfferEndsAt(skin) {
      const offer = skin?.lockedOffer;
      if (!offer?.countdownDurationMs) return 0;
      const storageKey = getDiceShopOfferStorageKey(skin.key);
      let endsAt = 0;
      try {
        endsAt = Number(windowRef?.localStorage?.getItem(storageKey) || "0");
      } catch (_error) {
        endsAt = 0;
      }
      if (!Number.isFinite(endsAt) || endsAt <= 0) {
        endsAt = Date.now() + offer.countdownDurationMs;
        try {
          windowRef?.localStorage?.setItem(storageKey, String(endsAt));
        } catch (_error) {
          // Ignore storage write failures and keep the in-memory deadline for this render.
        }
      }
      return endsAt;
    }

    function formatDiceShopOfferCountdown(msRemaining) {
      const totalSeconds = Math.max(0, Math.ceil(msRemaining / 1000) - 1);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }

    function getDiceShopLockedOfferBannerText(skin) {
      const offer = skin?.lockedOffer;
      if (!offer) return "";
      const endsAt = ensureDiceShopLockedOfferEndsAt(skin);
      const remainingMs = Math.max(0, endsAt - Date.now());
      return `${offer.bannerLabel} ${formatDiceShopOfferCountdown(remainingMs)} ⚠️`;
    }

    function updateDiceShopOfferCountdowns() {
      if (!els.diceShopList) return false;
      const banners = els.diceShopList.querySelectorAll("[data-dice-shop-offer-key]");
      if (!banners.length) return false;
      let hasActiveCountdown = false;
      for (const banner of banners) {
        const skin = diceSkinConfigByKey[banner.dataset.diceShopOfferKey];
        if (!skin?.lockedOffer) continue;
        const endsAt = ensureDiceShopLockedOfferEndsAt(skin);
        const remainingMs = Math.max(0, endsAt - Date.now());
        banner.textContent = `${skin.lockedOffer.bannerLabel} ${formatDiceShopOfferCountdown(remainingMs)} ⚠️`;
        if (remainingMs > 0) hasActiveCountdown = true;
      }
      return hasActiveCountdown;
    }

    function startDiceShopOfferTimer() {
      stopDiceShopOfferTimer();
      if (!updateDiceShopOfferCountdowns()) return;
      state.diceShopOfferTimer = windowRef?.setInterval?.(() => {
        if (!updateDiceShopOfferCountdowns()) {
          stopDiceShopOfferTimer();
        }
      }, 1000);
    }

    function stopDiceShopOfferTimer() {
      if (!state.diceShopOfferTimer) return;
      clearInterval(state.diceShopOfferTimer);
      state.diceShopOfferTimer = null;
    }

    function setDiceShopLockedOfferActionLabel(button, offer) {
      button.textContent = "";
      button.setAttribute(
        "aria-label",
        `Buy now - ${offer.originalPriceLabel}, now ${offer.salePriceLabel}`
      );

      const prefix = document.createElement("span");
      prefix.className = "dice-shop-action-btn-label";
      prefix.textContent = "Buy now -";
      button.appendChild(prefix);

      const originalPrice = document.createElement("span");
      originalPrice.className = "dice-shop-action-btn-old-price";
      originalPrice.textContent = offer.originalPriceLabel;
      button.appendChild(originalPrice);

      const salePrice = document.createElement("span");
      salePrice.className = "dice-shop-action-btn-sale-price";
      salePrice.textContent = offer.salePriceLabel;
      button.appendChild(salePrice);
    }

    async function loadUserSettings() {
      state.userSettings = await api("/api/users/me/settings");
      state.draftSettingsProfileImageData = state.userSettings?.user?.profileImageData || "";
      if (state.authUser) {
        state.authUser.profileImageData = state.userSettings?.user?.profileImageData || "";
        state.authUser.diceSkin = getDiceSkinKey(state.userSettings?.user?.diceSkin);
        state.authUser.availableDiceSkins = Array.isArray(state.userSettings?.user?.availableDiceSkins)
          ? [...state.userSettings.user.availableDiceSkins]
          : ["default"];
      }
    }

    function renderSettingsPage() {
      if (els.settingsUsernameInput) {
        els.settingsUsernameInput.value = state.userSettings?.user?.username || "";
      }
      if (els.settingsDiceSkinSelect) {
        const availableDiceSkins = getAvailableDiceSkinKeysForCurrentUser();
        const selectedDiceSkin = getDiceSkinKey(state.userSettings?.user?.diceSkin);
        els.settingsDiceSkinSelect.innerHTML = "";
        for (const skin of diceSkinOptions.filter((option) => availableDiceSkins.includes(option.key))) {
          const option = document.createElement("option");
          option.value = skin.key;
          option.textContent = skin.label;
          els.settingsDiceSkinSelect.appendChild(option);
        }
        const nextDiceSkin = availableDiceSkins.includes(selectedDiceSkin)
          ? selectedDiceSkin
          : availableDiceSkins[0] || "default";
        els.settingsDiceSkinSelect.value = nextDiceSkin;
        const hasMultipleOptions = availableDiceSkins.length > 1;
        els.settingsDiceSkinSelect.disabled = !hasMultipleOptions;
        if (els.saveSettingsDiceSkinBtn) {
          els.saveSettingsDiceSkinBtn.disabled = !hasMultipleOptions;
        }
        if (els.settingsDiceSkinHint) {
          els.settingsDiceSkinHint.textContent = "Used for your local 3D dice rolls.";
        }
        if (els.settingsDiceShopBtn) {
          els.settingsDiceShopBtn.classList.remove("hidden");
        }
      }
      if (els.settingsDiceSkinPreview) {
        const currentSkin = getCurrentDiceSkinConfig();
        els.settingsDiceSkinPreview.innerHTML = "";
        const preview = createDiceShopPreview(currentSkin);
        preview.classList.add("settings-dice-skin-preview-card");
        els.settingsDiceSkinPreview.appendChild(preview);
      }
      if (els.settingsNewPasswordInput) els.settingsNewPasswordInput.value = "";
      if (els.settingsConfirmPasswordInput) els.settingsConfirmPasswordInput.value = "";
      setSettingsProfileImagePreview(state.draftSettingsProfileImageData || "");
      if (els.settingsProfileImageFile) els.settingsProfileImageFile.value = "";
      els.settingsClaimList.innerHTML = "";
      const isAdmin = state.authUser?.role === "admin";
      if (els.settingsCampaignSection) {
        els.settingsCampaignSection.classList.toggle("hidden", isAdmin);
      }
      els.settingsClaimSection.classList.toggle("hidden", isAdmin);

      if (els.settingsActiveCampaignSelect && els.saveSettingsActiveCampaignBtn) {
        const campaigns = Array.isArray(state.userSettings?.campaigns) ? state.userSettings.campaigns : [];
        const activeCampaignId = Number(state.userSettings?.activeCampaignId);
        els.settingsActiveCampaignSelect.innerHTML = "";
        if (!isAdmin && campaigns.length > 0) {
          for (const campaign of campaigns) {
            const option = document.createElement("option");
            option.value = String(campaign.id);
            option.textContent = campaign.name || `Campaign ${campaign.id}`;
            els.settingsActiveCampaignSelect.appendChild(option);
          }
          const selectedCampaignId = campaigns.some((campaign) => campaign.id === activeCampaignId)
            ? activeCampaignId
            : campaigns[0].id;
          els.settingsActiveCampaignSelect.value = String(selectedCampaignId);
          els.settingsActiveCampaignSelect.disabled = false;
          els.saveSettingsActiveCampaignBtn.disabled = false;
        } else {
          const option = document.createElement("option");
          option.value = "";
          option.textContent = "No campaigns";
          els.settingsActiveCampaignSelect.appendChild(option);
          els.settingsActiveCampaignSelect.disabled = true;
          els.saveSettingsActiveCampaignBtn.disabled = true;
        }
      }

      if (!state.userSettings || !Array.isArray(state.userSettings.characters)) {
        els.settingsClaimList.innerHTML = "<li>No claimable characters found.</li>";
        return;
      }
      if (isAdmin) return;
      if (state.userSettings.characters.length === 0) {
        els.settingsClaimList.innerHTML = "<li>No claimable characters found.</li>";
        return;
      }

      for (const character of state.userSettings.characters) {
        const li = document.createElement("li");
        const row = document.createElement("div");
        row.className = "list-row";

        const label = document.createElement("span");
        const campaignName = character.campaign_name || "Campaign";
        label.textContent = `${campaignName}: ${character.name} (${character.class_name})`;
        row.appendChild(label);

        const claimedByIdRaw = character.claimed_user_id;
        const claimedById = claimedByIdRaw == null ? null : Number(claimedByIdRaw);
        const isClaimed = Number.isInteger(claimedById) && claimedById > 0;
        const claimedByMe = isClaimed && claimedById === state.authUser?.id;

        const actionBtn = document.createElement("button");
        actionBtn.type = "button";
        actionBtn.textContent = claimedByMe ? "Unclaim" : "Claim";
        if (isClaimed && !claimedByMe) {
          actionBtn.disabled = true;
          actionBtn.textContent = `Claimed by ${character.claimed_by_username || "another player"}`;
        }
        actionBtn.addEventListener("click", async () => {
          try {
            if (claimedByMe) {
              await api("/api/users/me/unclaim-character", {
                method: "POST",
                body: JSON.stringify({ characterId: character.id })
              });
            } else {
              await api("/api/users/me/claim-character", {
                method: "POST",
                body: JSON.stringify({ characterId: character.id })
              });
            }
            await loadUserSettings();
            renderSettingsPage();
          } catch (error) {
            setStatus(error.message, "error");
          }
        });
        row.appendChild(actionBtn);

        li.appendChild(row);
        els.settingsClaimList.appendChild(li);
      }
    }

    function renderDiceShopPage() {
      if (!els.diceShopList) return;
      const availableDiceSkins = getAvailableDiceSkinKeysForCurrentUser();
      const currentDiceSkin = getDiceSkinKey(
        state.userSettings?.user?.diceSkin || state.authUser?.diceSkin
      );
      els.diceShopList.innerHTML = "";

      for (const skin of diceSkinOptions) {
        const card = document.createElement("article");
        card.className = "panel dice-shop-card";

        const cardTop = document.createElement("div");
        cardTop.className = "row between";

        const title = document.createElement("h3");
        title.textContent = skin.label;
        cardTop.appendChild(title);

        const status = document.createElement("span");
        const isUnlocked = availableDiceSkins.includes(skin.key);
        const isEquipped = currentDiceSkin === skin.key;
        const lockedOffer = !isUnlocked ? skin.lockedOffer : null;
        status.className = `dice-shop-status ${isEquipped ? "equipped" : isUnlocked ? "unlocked" : "locked"}`;
        status.textContent = isEquipped ? "Equipped" : isUnlocked ? "Owned" : "Locked";
        cardTop.appendChild(status);
        card.appendChild(cardTop);
        card.appendChild(createDiceShopPreview(skin));

        const description = document.createElement("div");
        description.className = "dice-shop-description";
        if (skin.descriptionLead) {
          const lead = document.createElement("p");
          lead.className = "dice-shop-description-lead";
          lead.textContent = skin.descriptionLead;
          description.appendChild(lead);
        }
        if (Array.isArray(skin.descriptionParagraphs) && skin.descriptionParagraphs.length > 0) {
          for (const paragraphText of skin.descriptionParagraphs) {
            const paragraph = document.createElement("p");
            paragraph.className = "hint dice-shop-description-paragraph";
            paragraph.textContent = paragraphText;
            description.appendChild(paragraph);
          }
        } else if (skin.description) {
          const paragraph = document.createElement("p");
          paragraph.className = "hint dice-shop-description-paragraph";
          paragraph.textContent = skin.description;
          description.appendChild(paragraph);
        }
        if (skin.descriptionListTitle) {
          const listTitle = document.createElement("p");
          listTitle.className = "dice-shop-description-list-title";
          listTitle.textContent = skin.descriptionListTitle;
          description.appendChild(listTitle);
        }
        if (Array.isArray(skin.descriptionListItems) && skin.descriptionListItems.length > 0) {
          const list = document.createElement("ul");
          list.className = "dice-shop-description-list";
          for (const itemText of skin.descriptionListItems) {
            const item = document.createElement("li");
            item.textContent = itemText;
            list.appendChild(item);
          }
          description.appendChild(list);
        }
        card.appendChild(description);

        const bannerSlot = document.createElement("div");
        bannerSlot.className = "dice-shop-banner-slot";
        if (lockedOffer || skin.promoBannerText) {
          const banner = document.createElement("div");
          banner.className = "dice-shop-special-banner";
          if (lockedOffer) {
            banner.classList.add("offer");
            banner.dataset.diceShopOfferKey = skin.key;
            banner.textContent = getDiceShopLockedOfferBannerText(skin);
          } else {
            banner.textContent = skin.promoBannerText;
          }
          bannerSlot.appendChild(banner);
        } else {
          bannerSlot.classList.add("is-empty");
          bannerSlot.setAttribute("aria-hidden", "true");
        }
        card.appendChild(bannerSlot);

        const action = document.createElement("button");
        action.type = "button";
        action.className = "dice-shop-action-btn";
        if (isEquipped) {
          action.classList.add("equipped");
          action.textContent = "Currently Equipped";
          action.disabled = true;
        } else if (isUnlocked) {
          action.classList.add("owned");
          action.textContent = "Owned - Click to equip";
          action.addEventListener("click", async () => {
            try {
              await saveDiceSkinPreference(skin.key);
              renderSettingsPage();
              renderDiceShopPage();
              setStatus(`${skin.label} equipped.`, "success");
            } catch (error) {
              setStatus(error.message, "error");
            }
          });
        } else {
          action.classList.add("locked");
          if (lockedOffer?.originalPriceLabel && lockedOffer?.salePriceLabel) {
            action.classList.add("special-offer");
            setDiceShopLockedOfferActionLabel(action, lockedOffer);
          } else {
            action.textContent = `Buy now - ${skin.priceLabel || "CHF 4.99"}`;
          }
          action.addEventListener("click", () => {
            const popup = windowRef?.open?.(diceShopRedirectUrl, "_blank", "noopener,noreferrer");
            if (popup) popup.opener = null;
          });
        }
        card.appendChild(action);

        els.diceShopList.appendChild(card);
      }

      startDiceShopOfferTimer();
    }

    return {
      createDiceShopPreview,
      loadUserSettings,
      renderDiceShopPage,
      renderSettingsPage,
      setDiceShopLockedOfferActionLabel,
      startDiceShopOfferTimer,
      stopDiceShopOfferTimer
    };
  }

  return { createUserPagesController };
});
