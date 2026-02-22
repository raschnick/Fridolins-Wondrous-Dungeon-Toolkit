# Fridolins Wondrous Dungeon Toolkit

Local web app starter for tracking D&D 5e (2024) campaigns, characters, and combat scenarios.

## Stack

- Node.js + Express for local API/server
- SQLite (`better-sqlite3`) for portable local data file
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

SQLite database file is stored at:

`/Users/rani/dev/Fridolins Wondrous Dungeon Toolkit/data/itracker.sqlite`

## Current features

- Welcome page for campaign selection/creation
- Monster Library page for storing and editing local monster statblocks
  - Includes a starter set of prebuilt 5e-style monsters
- Campaign page for managing:
  - Characters (add/delete)
  - Combat scenarios (add/delete)
  - Enter scenario `Edit` or `Run` page
- Scenario Edit page:
  - Edit scenario name/notes
  - Add custom enemies
  - View all encounter combatants
  - Remove a PC from only that scenario
  - Initiative auto-saves when input loses focus
- Scenario Run page:
  - Initiative order sorted descending
  - Current turn highlight
  - `Next Turn` progression
  - Round increments when order wraps
  - `Reset to Round 1`
  - Initiative auto-saves when input loses focus (PCs and enemies)
- Campaign PCs are included by default in every scenario unless removed from that scenario

## Next suggested step

Add enemy templates/stat blocks and quick add from a bestiary.
