# Fridolins Wondrous Dungeon Toolkit

Local D&D 5e (2024) campaign and combat tracker with offline-friendly SQLite storage.

## Stack

- Node.js + Express API/server
- SQLite (`better-sqlite3`) local database
- Vanilla HTML/CSS/JS frontend

## Run

1. Install dependencies:

```bash
npm install
```

2. Start the app:

```bash
npm start
```

3. Open in browser:

`http://localhost:3000`

Default SQLite database path:

`/Users/rani/dev/Fridolins Wondrous Dungeon Toolkit/data/itracker.sqlite`

## Docker

### Build
```bash
docker build -t wdt:0.1.0 .
```

### Run
```bash
docker run \
  -p 3000:3000 \
  -v $(pwd)/data:/app/data \
  -e WDT_ADMIN_USERNAME=administrator \
  -e WDT_ADMIN_PASSWORD=supersecret \
  wdt:0.1.0
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `WDT_ADMIN_USERNAME` | `admin` | Initial admin database username |
| `WDT_ADMIN_PASSWORD` | `admin` | Initial admin database password |

## URL routes

- `/` -> Home
- `/library` -> Library
- `/analytics` -> Analytics (placeholder)
- `/campaigns/:campaignId` -> Campaign
- `/campaigns/:campaignId/scenarios/:scenarioId/edit` -> Scenario Edit
- `/campaigns/:campaignId/scenarios/:scenarioId/run` -> Scenario Run

Legacy `/monsters` routes are accepted and normalized to `/library`.

## Current functionality

### Home

- Campaign overview list with:
  - campaign name
  - player chips with mini class icons
  - scenario count
- Entire campaign rows are clickable (and keyboard accessible) to open campaign pages
- Create Campaign uses themed modal popup

### Campaign

- Character management:
  - add via modal
  - class-restricted dropdown (Artificer, Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Rogue, Sorcerer, Warlock, Wizard)
  - delete
- Scenario management:
  - add via modal (name + optional quick notes)
  - delete
  - open in Edit or Run mode
- Delete campaign with exact-name confirmation

### Library

- Search/filter library entries by name
- Create `New Entry` via themed popup modal
- Supports image-only entries (name + statblock screenshot)
- Legendary metadata on entries:
  - `Is Legendary` true/false
  - legendary action count (2-4)
- Read-only by default:
  - `Edit` button (or `E`) enters edit mode
  - `E` again cancels unsaved changes
  - `S` saves while editing
  - Save/Delete controls only visible in edit mode
- Clipboard paste (`Cmd+V`) and file upload for statblock images with client-side compression
- Legendary entries show `L` badge in list

### Scenario Edit

- Edit scenario name/notes
- Add custom non-PC combatants (Enemy or NPC)
- Optional source from Library when adding combatants
- Remove combatants from scenario
- PCs auto-included in scenarios (unless removed from that scenario)
- Initiative and HP edits save on blur
- Right-side statblock preview panel with zoom modal
- Condition system:
  - multi-condition support per combatant
  - add from fixed dropdown
  - remove by clicking chips

### Scenario Run

- Turn order sorted by initiative
- Current-turn highlight
- Revoke Turn (step backward), Next Turn (step forward), Reset Combat
- HP quick editing + damage/heal delta actions for non-PCs
- Reaction tracker per combatant
- Legendary action trackers for legendary non-PCs
- NPC statblock panel remains visible while scrolling (sticky)
- Click non-PC names to preview statblocks; click statblock to zoom

## Keyboard shortcuts

When not typing in a field:

- Global scenario mode switching:
  - `E` in Run -> switch to Edit
  - `E` in Edit -> switch to Run
- Scenario Run:
  - `N` -> Next Turn
  - `B` -> Revoke Turn
  - `R` -> Toggle reaction for active combatant
  - `L` -> Spend one legendary action for active combatant; when 0, next `L` refills to max
- Library:
  - `E` -> toggle edit/cancel
  - `S` -> save current entry (only in edit mode)

## Notes

- API endpoints remain under `/api/*`.
- Non-API routes are served via SPA fallback to support direct URL loads and browser history navigation.
