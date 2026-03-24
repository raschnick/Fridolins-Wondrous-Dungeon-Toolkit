(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTLibraryPage = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  function createLibraryPageController({
    state,
    els,
    api,
    setStatus,
    selectedMonster,
    setMonsterPasteTarget,
    updateMonsterLegendaryFieldsVisibility,
    setMonsterImagePreview,
    setMonsterTokenImagePreview,
    setEnemyMonsterPreview,
    setMonsterEditorReadOnly,
    openImageModal
  }) {
    function clearMonsterForm() {
      state.selectedMonsterId = null;
      state.draftMonsterImageData = "";
      state.draftMonsterTokenImageData = "";
      setMonsterPasteTarget("statblock");
      els.monsterForm.reset();
      els.monsterSize.value = "normal";
      els.monsterIsLegendary.value = "false";
      const defaultLegendary = document.querySelector(
        'input[name="monsterLegendaryActionsCount"][value="3"]'
      );
      if (defaultLegendary) defaultLegendary.checked = true;
      updateMonsterLegendaryFieldsVisibility();
      setMonsterImagePreview("");
      setMonsterTokenImagePreview("");
      els.monsterImageFile.value = "";
      els.monsterTokenImageFile.value = "";
      renderMonsterReadonlyView();
      renderMonsterList();
    }

    function fillMonsterForm(monster) {
      els.monsterName.value = monster.name;
      const sizeValue = `${monster.size || "normal"}`.trim().toLowerCase();
      els.monsterSize.value = ["normal", "large", "huge", "gargantuan"].includes(sizeValue)
        ? sizeValue
        : "normal";
      els.monsterIsLegendary.value = monster.is_legendary ? "true" : "false";
      const currentLegendary = document.querySelector(
        `input[name="monsterLegendaryActionsCount"][value="${monster.legendary_actions_count || 3}"]`
      );
      if (currentLegendary) currentLegendary.checked = true;
      updateMonsterLegendaryFieldsVisibility();
      state.draftMonsterImageData = monster.monster_image_data || "";
      state.draftMonsterTokenImageData = monster.token_image_data || "";
      setMonsterPasteTarget("statblock");
      setMonsterImagePreview(state.draftMonsterImageData);
      setMonsterTokenImagePreview(state.draftMonsterTokenImageData);
      els.monsterImageFile.value = "";
      els.monsterTokenImageFile.value = "";
      renderMonsterReadonlyView();
    }

    function monsterFormPayload() {
      const isLegendary = els.monsterIsLegendary.value === "true";
      const legendarySelection = document.querySelector(
        'input[name="monsterLegendaryActionsCount"]:checked'
      );
      const legendaryActionsCount = isLegendary
        ? Number(legendarySelection?.value)
        : null;
      return {
        name: els.monsterName.value,
        size: els.monsterSize.value,
        isLegendary,
        legendaryActionsCount,
        monsterImageData: state.draftMonsterImageData || "",
        tokenImageData: state.draftMonsterTokenImageData || ""
      };
    }

    function renderMonsterList() {
      const query = state.monsterSearchQuery.trim().toLowerCase();
      const filtered = query
        ? state.monsters.filter((monster) => monster.name.toLowerCase().includes(query))
        : state.monsters;

      els.monsterList.innerHTML = "";
      if (filtered.length === 0) {
        els.monsterList.innerHTML = query ? "<li>No matches found.</li>" : "<li>No monsters yet.</li>";
        return;
      }

      for (const monster of filtered) {
        const li = document.createElement("li");
        if (monster.id === state.selectedMonsterId) li.classList.add("active");
        const row = document.createElement("div");
        row.className = "list-row";

        const label = document.createElement("span");
        label.className = "monster-label";
        const avatar = document.createElement("img");
        avatar.className = "monster-list-avatar";
        const fallbackSrc = "/icons/enemy.svg";
        avatar.src = monster.token_image_data || "/icons/enemy.png";
        avatar.alt = `${monster.name} token`;
        avatar.addEventListener("error", () => {
          if (!avatar.src.endsWith(fallbackSrc)) avatar.src = fallbackSrc;
        });
        label.appendChild(avatar);

        const nameText = document.createElement("span");
        nameText.textContent = monster.name;
        label.appendChild(nameText);

        const isLegendary = Boolean(monster.is_legendary);
        const legendaryCount = Number(monster.legendary_actions_count);
        if (isLegendary) {
          const badge = document.createElement("span");
          badge.className = "legendary-badge";
          badge.textContent = "L";
          badge.title = Number.isInteger(legendaryCount)
            ? `Legendary (${legendaryCount} actions)`
            : "Legendary";
          label.appendChild(badge);
          if (Number.isInteger(legendaryCount)) {
            badge.title = `Legendary (${legendaryCount} actions)`;
          }
        }
        row.appendChild(label);

        li.addEventListener("click", () => {
          if (!state.monsterEditorReadOnly && monster.id !== state.selectedMonsterId) {
            setMonsterEditorReadOnly(true);
          }
          state.selectedMonsterId = monster.id;
          fillMonsterForm(monster);
          setMonsterEditorReadOnly(true);
          renderMonsterList();
        });

        row.appendChild(document.createElement("span"));
        li.appendChild(row);
        els.monsterList.appendChild(li);
      }
    }

    function renderEnemyMonsterOptions(searchQuery = "") {
      const query = (searchQuery || "").trim().toLowerCase();
      const filtered = query
        ? state.monsters.filter((monster) => monster.name.toLowerCase().includes(query))
        : state.monsters;
      const limited = filtered.slice(0, 5);
      els.enemyMonsterResults.innerHTML = "";

      if (limited.length === 0) {
        state.addCombatantSelectedMonsterId = null;
        setEnemyMonsterPreview("");
        const empty = document.createElement("li");
        empty.className = "hint";
        empty.textContent = "No library matches.";
        els.enemyMonsterResults.appendChild(empty);
        return;
      }

      if (limited.length === 1) {
        state.addCombatantSelectedMonsterId = limited[0].id;
        setEnemyMonsterPreview(limited[0].monster_image_data || "");
        els.enemyName.value = limited[0].name;
        if (!els.enemyHp.value.trim()) {
          const hpMatch = /\d+/.exec(limited[0].hit_points || "");
          if (hpMatch) els.enemyHp.value = hpMatch[0];
        }
      } else if (
        state.addCombatantSelectedMonsterId &&
        !limited.some((monster) => monster.id === state.addCombatantSelectedMonsterId)
      ) {
        state.addCombatantSelectedMonsterId = null;
        setEnemyMonsterPreview("");
      }

      for (const monster of limited) {
        const li = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "add-combatant-library-item";
        if (state.addCombatantSelectedMonsterId === monster.id) {
          button.classList.add("active");
        }
        button.textContent = monster.name;
        button.addEventListener("click", () => {
          state.addCombatantSelectedMonsterId = monster.id;
          setEnemyMonsterPreview(monster.monster_image_data || "");
          els.enemyName.value = monster.name;
          if (!els.enemyHp.value.trim()) {
            const hpMatch = /\d+/.exec(monster.hit_points || "");
            if (hpMatch) els.enemyHp.value = hpMatch[0];
          }
          renderEnemyMonsterOptions(els.enemyMonsterSearchInput.value);
        });
        li.appendChild(button);
        els.enemyMonsterResults.appendChild(li);
      }
    }

    async function loadMonsters() {
      state.monsters = await api("/api/monsters");
      if (!state.monsters.some((monster) => monster.id === state.selectedMonsterId)) {
        state.selectedMonsterId = state.monsters[0]?.id ?? null;
      }
      renderMonsterList();
      const current = selectedMonster();
      if (current) fillMonsterForm(current);
      else clearMonsterForm();
      renderEnemyMonsterOptions();
    }

    function cancelMonsterEditorChanges() {
      const monster = selectedMonster();
      if (monster) {
        fillMonsterForm(monster);
      } else {
        clearMonsterForm();
      }
      setMonsterEditorReadOnly(true);
    }

    function appendReadonlyRow(parent, labelText, valueText) {
      const row = document.createElement("div");
      row.className = "monster-readonly-row";
      const label = document.createElement("span");
      label.className = "monster-readonly-label";
      label.textContent = labelText;
      row.appendChild(label);
      const value = document.createElement("span");
      value.className = "monster-readonly-value";
      value.textContent = valueText;
      row.appendChild(value);
      parent.appendChild(row);
    }

    function formatMonsterSizeLabel(size) {
      const raw = `${size || "normal"}`.trim().toLowerCase();
      if (raw === "normal") return "Normal";
      if (raw === "large") return "Large";
      if (raw === "huge") return "Huge";
      if (raw === "gargantuan") return "Gargantuan";
      return "Normal";
    }

    function renderMonsterReadonlyView() {
      if (!els.monsterReadonlyView) return;
      els.monsterReadonlyView.innerHTML = "";
      if (!state.monsterEditorReadOnly) return;

      const monster = selectedMonster();
      if (!monster) {
        const empty = document.createElement("p");
        empty.className = "hint";
        empty.textContent = "Select an entry or create one with New Entry.";
        els.monsterReadonlyView.appendChild(empty);
        return;
      }

      const top = document.createElement("div");
      top.className = "monster-readonly-top";

      const meta = document.createElement("div");
      meta.className = "monster-readonly-meta";
      appendReadonlyRow(meta, "Name", monster.name || "-");
      appendReadonlyRow(meta, "Size", formatMonsterSizeLabel(monster.size));
      if (monster.is_legendary) {
        const count = Number(monster.legendary_actions_count);
        const suffix = Number.isInteger(count) ? ` (${count})` : "";
        appendReadonlyRow(meta, "Legendary", `Yes${suffix}`);
      } else {
        appendReadonlyRow(meta, "Legendary", "No");
      }
      top.appendChild(meta);

      const token = document.createElement("img");
      token.className = "monster-readonly-token";
      token.alt = `${monster.name || "Monster"} token`;
      const fallbackSrc = "/icons/enemy.svg";
      token.src = monster.token_image_data || "/icons/enemy.png";
      token.style.cursor = "zoom-in";
      token.addEventListener("error", () => {
        if (!token.src.endsWith(fallbackSrc)) token.src = fallbackSrc;
      });
      token.addEventListener("click", () => {
        if (!token.src) return;
        openImageModal(token.src);
      });
      top.appendChild(token);

      els.monsterReadonlyView.appendChild(top);
    }

    function toggleMonsterEditorMode() {
      if (!selectedMonster()) {
        setStatus("Select a library entry first.");
        return;
      }
      if (state.monsterEditorReadOnly) {
        setMonsterEditorReadOnly(false);
      } else {
        cancelMonsterEditorChanges();
      }
    }

    return {
      cancelMonsterEditorChanges,
      clearMonsterForm,
      fillMonsterForm,
      loadMonsters,
      monsterFormPayload,
      renderEnemyMonsterOptions,
      renderMonsterList,
      renderMonsterReadonlyView,
      toggleMonsterEditorMode
    };
  }

  return { createLibraryPageController };
});
