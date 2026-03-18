import DiceBox from "/vendor/dice-box/dice-box.es.min.js"

const DEFAULT_THEME = "default"
const DEFAULT_THEME_COLOR = "#8f1d2c"
const HIDE_DELAY_MS = 1500
const HIDE_TRANSITION_MS = 260

const stage = document.getElementById("diceStage")
let host = null
if (stage) {
  host = document.createElement("div")
  host.id = "diceCanvasHost"
  host.className = "dice-canvas-host"
  stage.appendChild(host)
}

let diceBoxPromise = null
let hideTimer = null

function setStageVisible(visible) {
  if (!stage) return
  stage.classList.toggle("hidden", !visible)
  stage.setAttribute("aria-hidden", visible ? "false" : "true")
}

function clearHideTimer() {
  if (!hideTimer) return
  window.clearTimeout(hideTimer)
  hideTimer = null
}

async function ensureDiceBox() {
  if (!stage || !host) return null
  if (diceBoxPromise) return diceBoxPromise
  diceBoxPromise = (async () => {
    const box = new DiceBox({
      container: "#diceCanvasHost",
      assetPath: "/vendor/dice-box/assets/",
      theme: DEFAULT_THEME,
      themeColor: DEFAULT_THEME_COLOR,
      scale: 5,
      delay: 12,
      enableShadows: true,
      shadowTransparency: 0.78,
      lightIntensity: 1.15
    })
    await box.init()
    return box
  })().catch((error) => {
    console.error("Failed to initialize Dice Box.", error)
    diceBoxPromise = null
    setStageVisible(false)
    throw error
  })
  return diceBoxPromise
}

function normalizeDiceResults(results, notation) {
  const rolls = Array.isArray(results)
    ? results
        .map((result) => Number(result?.value))
        .filter((value) => Number.isFinite(value))
    : []
  const modifierMatch = `${notation || ""}`.match(/([+-]\d+)$/)
  const modifier = modifierMatch ? Number(modifierMatch[1]) : 0
  const total = rolls.reduce((sum, value) => sum + value, 0) + modifier
  return { rolls, modifier, total, raw: results }
}

function normalizeMultipleDiceResults(collections, notations) {
  const normalizedCollections = (Array.isArray(collections) ? collections : []).map((results, index) =>
    normalizeDiceResults(results, Array.isArray(notations) ? notations[index] : "")
  )
  return {
    rolls: normalizedCollections.flatMap((entry) => entry.rolls),
    modifier: normalizedCollections.reduce((sum, entry) => sum + entry.modifier, 0),
    total: normalizedCollections.reduce((sum, entry) => sum + entry.total, 0),
    raw: collections,
    collections: normalizedCollections
  }
}

function scheduleHide(box) {
  clearHideTimer()
  const holdDelay = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 300 : HIDE_DELAY_MS
  hideTimer = window.setTimeout(() => {
    box.hide("dice-box-canvas--hide")
    window.setTimeout(() => {
      setStageVisible(false)
    }, HIDE_TRANSITION_MS)
  }, holdDelay)
}

window.diceRenderer = {
  async roll({ notation, theme = DEFAULT_THEME, themeColor = DEFAULT_THEME_COLOR } = {}) {
    if (!notation) {
      throw new Error("Missing dice notation.")
    }
    setStageVisible(true)
    const box = await ensureDiceBox()
    clearHideTimer()
    box.show()
    if (box.canvas) {
      box.canvas.classList.remove("dice-box-canvas--hide")
    }
    const results = await box.roll(notation, { theme, themeColor })
    scheduleHide(box)
    return normalizeDiceResults(results, notation)
  },
  async rollMany({ notations, theme = DEFAULT_THEME, themeColor = DEFAULT_THEME_COLOR } = {}) {
    const notationList = Array.isArray(notations)
      ? notations.map((notation) => `${notation || ""}`.trim()).filter(Boolean)
      : []
    if (notationList.length === 0) {
      throw new Error("Missing dice notations.")
    }
    if (notationList.length === 1) {
      return this.roll({ notation: notationList[0], theme, themeColor })
    }
    setStageVisible(true)
    const box = await ensureDiceBox()
    clearHideTimer()
    box.show()
    box.clear()
    if (box.canvas) {
      box.canvas.classList.remove("dice-box-canvas--hide")
    }
    const collections = await Promise.all(
      notationList.map((notation, index) =>
        box.add(notation, {
          theme,
          themeColor,
          newStartPoint: index === 0
        })
      )
    )
    scheduleHide(box)
    return normalizeMultipleDiceResults(collections, notationList)
  },
  async ready() {
    setStageVisible(true)
    const box = await ensureDiceBox()
    box.hide("dice-box-canvas--hide")
    setStageVisible(false)
    return box
  },
  clear() {
    clearHideTimer()
    if (!diceBoxPromise) {
      setStageVisible(false)
      return
    }
    diceBoxPromise
      .then((box) => {
        box.clear()
        box.hide("dice-box-canvas--hide")
        window.setTimeout(() => {
          setStageVisible(false)
        }, HIDE_TRANSITION_MS)
      })
      .catch((_error) => {
        setStageVisible(false)
      })
  }
}
