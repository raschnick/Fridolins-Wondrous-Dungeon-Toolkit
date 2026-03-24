(function (root, factory) {
  const exported = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = exported;
  }
  root.FWDTTooltips = exported;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const CONDITION_TOOLTIP_NO_LEAD_STYLE = new Set(["down", "concentrated"]);
  const PLAYER_TURN_RESOURCE_TIPS = {
    action: `Possible Actions include:

Attack: Attack with a weapon or an Unarmed Strike.

Dash: For the rest of the turn, give yourself extra movement equal to your Speed.

Disengage: Your movement doesn't provoke Opportunity Attack for the rest of the turn.

Dodge: Until the start of your next turn, attack rolls against you have Disadvantage, and you make Dexterity saving throws with Advantage. You lose this benefit if you have the Incapacitated condition or if your Speed is 0.

Help: Help another creature's ability check or attack roll, or administer first aid.

Hide: Make a Dexterity (Stealth) check.

Magic: Cast a spell, use a magic item, or use a magical feature.

Ready Action: Prepare to take an action in response to a trigger you define.

Player characters and monsters can also do things not covered by these actions. Many class features and other abilities provide additional action options, and you can improvise other actions.`,
    bonus: `Various class features, spells, and other abilities let you take an additional action on your turn called a Bonus Action. You can take a Bonus Action only when a special ability, a spell, or another feature of the game states that you can do something as a Bonus Action. You otherwise don't have a Bonus Action to take.

You can take only one Bonus Action on your turn, so you must choose which Bonus Action to use if you have more than one available.`,
    movement: `On your turn, you can move a distance up to your speed. You can use as much or as little of your speed as you like on your turn or also break up your movement between actions or bonus actions.`
  };

  function createTooltipController({
    documentRef = typeof document !== "undefined" ? document : null,
    windowRef = typeof window !== "undefined" ? window : null
  } = {}) {
    let conditionTooltipEl = null;
    let conditionTooltipChip = null;
    let mapStatblockHoverEl = null;

    function ensureConditionTooltipEl() {
      if (!documentRef) return null;
      if (conditionTooltipEl) return conditionTooltipEl;
      conditionTooltipEl = documentRef.createElement("div");
      conditionTooltipEl.className = "condition-tooltip-floating hidden";
      documentRef.body.appendChild(conditionTooltipEl);
      return conditionTooltipEl;
    }

    function hideConditionTooltip() {
      if (!conditionTooltipEl) return;
      conditionTooltipEl.classList.add("hidden");
      conditionTooltipChip = null;
    }

    function ensureMapStatblockHoverEl() {
      if (!documentRef) return null;
      if (mapStatblockHoverEl) return mapStatblockHoverEl;
      mapStatblockHoverEl = documentRef.createElement("div");
      mapStatblockHoverEl.className = "map-statblock-hover hidden";
      const image = documentRef.createElement("img");
      image.alt = "Statblock preview";
      mapStatblockHoverEl.appendChild(image);
      documentRef.body.appendChild(mapStatblockHoverEl);
      return mapStatblockHoverEl;
    }

    function hideMapStatblockHover() {
      if (!mapStatblockHoverEl) return;
      mapStatblockHoverEl.classList.add("hidden");
      const image = mapStatblockHoverEl.querySelector("img");
      if (image) image.src = "";
    }

    function showMapStatblockHover(src, anchorEl) {
      if (!src || !anchorEl || !windowRef) return;
      const popup = ensureMapStatblockHoverEl();
      const image = popup?.querySelector("img");
      if (!popup || !image) return;
      image.src = src;
      popup.classList.remove("hidden");

      const anchorRect = anchorEl.getBoundingClientRect();
      const margin = 10;
      const desiredWidth = 1040;
      const maxWidth = Math.min(desiredWidth, windowRef.innerWidth - margin * 2);
      popup.style.width = `${maxWidth}px`;

      const popupRect = popup.getBoundingClientRect();
      let left = anchorRect.right + margin;
      if (left + popupRect.width > windowRef.innerWidth - margin) {
        left = anchorRect.left - popupRect.width - margin;
      }
      if (left < margin) left = margin;

      let top = anchorRect.top;
      if (top + popupRect.height > windowRef.innerHeight - margin) {
        top = windowRef.innerHeight - popupRect.height - margin;
      }
      if (top < margin) top = margin;

      popup.style.left = `${Math.round(left)}px`;
      popup.style.top = `${Math.round(top)}px`;
    }

    function positionConditionTooltip(chip) {
      if (!windowRef || !conditionTooltipEl || conditionTooltipEl.classList.contains("hidden")) return;
      const chipRect = chip.getBoundingClientRect();
      const tooltipRect = conditionTooltipEl.getBoundingClientRect();
      const gap = 8;
      const margin = 8;
      const viewportWidth = windowRef.innerWidth;
      const viewportHeight = windowRef.innerHeight;

      let left = chipRect.left;
      if (left + tooltipRect.width > viewportWidth - margin) {
        left = viewportWidth - tooltipRect.width - margin;
      }
      if (left < margin) left = margin;

      let top = chipRect.bottom + gap;
      if (top + tooltipRect.height > viewportHeight - margin) {
        top = chipRect.top - tooltipRect.height - gap;
      }
      if (top < margin) top = margin;

      conditionTooltipEl.style.left = `${Math.round(left)}px`;
      conditionTooltipEl.style.top = `${Math.round(top)}px`;
    }

    function renderConditionTooltipContent(tooltip, tip, options = {}) {
      const emphasizeLead = options.emphasizeLead !== false;
      const tipStyle = `${options.tipStyle || ""}`.trim().toLowerCase();
      tooltip.replaceChildren();
      const paragraphs = `${tip || ""}`
        .split(/\n{2,}/)
        .map((part) => part.trim())
        .filter(Boolean);

      for (const paragraph of paragraphs) {
        const line = documentRef.createElement("p");
        line.className = "condition-tooltip-paragraph";

        if (tipStyle === "action-list") {
          const firstColon = paragraph.indexOf(":");
          if (firstColon > 0) {
            const lead = paragraph.slice(0, firstColon + 1).trim();
            const rest = paragraph.slice(firstColon + 1).trim();
            const leadEl = documentRef.createElement("span");
            leadEl.className = "condition-tooltip-action-label";
            leadEl.textContent = lead;
            line.appendChild(leadEl);
            if (rest) {
              line.appendChild(documentRef.createTextNode(` ${rest}`));
            }
          } else {
            line.textContent = paragraph;
          }
        } else {
          const firstDot = paragraph.indexOf(".");
          if (firstDot > 0 && emphasizeLead) {
            const lead = paragraph.slice(0, firstDot + 1).trim();
            const rest = paragraph.slice(firstDot + 1).trim();
            const leadEl = documentRef.createElement("span");
            leadEl.className = "condition-tooltip-lead";
            leadEl.textContent = lead;
            line.appendChild(leadEl);
            if (rest) {
              line.appendChild(documentRef.createTextNode(` ${rest}`));
            }
          } else {
            line.textContent = paragraph;
          }
        }

        tooltip.appendChild(line);
      }
    }

    function showTooltipForElement(chip) {
      const tip = `${chip.getAttribute("data-tip") || ""}`.trim();
      if (!tip) {
        hideConditionTooltip();
        return;
      }
      const tooltipStyle = `${chip.getAttribute("data-tip-style") || ""}`.trim().toLowerCase();
      const conditionKey = `${chip.getAttribute("data-condition-key") || ""}`.trim().toLowerCase();
      const emphasizeLead =
        tooltipStyle === "plain" ? false : !CONDITION_TOOLTIP_NO_LEAD_STYLE.has(conditionKey);
      const tooltip = ensureConditionTooltipEl();
      if (!tooltip) return;
      renderConditionTooltipContent(tooltip, tip, { emphasizeLead, tipStyle: tooltipStyle });
      tooltip.classList.remove("hidden");
      conditionTooltipChip = chip;
      positionConditionTooltip(chip);
    }

    function showConditionTooltip(chip) {
      showTooltipForElement(chip);
    }

    function getActiveConditionTooltipChip() {
      return conditionTooltipChip;
    }

    function repositionActiveConditionTooltip() {
      if (!conditionTooltipChip) return;
      positionConditionTooltip(conditionTooltipChip);
    }

    return {
      PLAYER_TURN_RESOURCE_TIPS,
      hideConditionTooltip,
      hideMapStatblockHover,
      positionConditionTooltip,
      repositionActiveConditionTooltip,
      showConditionTooltip,
      showMapStatblockHover,
      showTooltipForElement,
      getActiveConditionTooltipChip
    };
  }

  return { createTooltipController, PLAYER_TURN_RESOURCE_TIPS };
});
