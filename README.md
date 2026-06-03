# Escape Room AI Agent

This is a college-project friendly AI agent game. The player is trapped in a locked lab and must escape by inspecting objects, collecting items, solving a code puzzle, and entering a final passphrase.

## Project Idea

The AI agent acts as the game master. It understands player commands, tracks game state, gives adaptive hints, updates inventory, and decides what happens after each action.

## Game Flow

1. Player starts inside a locked research lab.
2. Player inspects the poster and finds a clue pointing toward reading.
3. Player inspects the bookshelf and finds a brass key.
4. Player uses the key on the desk drawer.
5. Drawer reveals the code `3142`.
6. Player enters the code on the safe.
7. Safe opens and gives a USB drive.
8. Player uses the USB drive on the laptop.
9. Laptop reveals the final passphrase `OPEN-SESAME`.
10. Player enters the passphrase at the door and escapes.

## Agent Features

- Natural command handling for actions like `inspect desk`, `use key`, `code 3142`, `hint`, and `open door`.
- Memory of inspected objects.
- Inventory tracking.
- Puzzle progression.
- Adaptive hints based on the player's current state.
- Timer and final score.
- Clickable room objects plus typed commands.

## Files

- `index.html`: Page structure and game UI.
- `styles.css`: Layout, room scene, responsive design, and visual styling.
- `script.js`: AI agent logic, game state, command parser, hints, timer, and win condition.

## How To Run

Open `index.html` in a browser.

If your browser blocks local scripts, run a local server from this folder:

```bash
python -m http.server 8765
```

Then open:

```text
http://127.0.0.1:8765
```

## Demo Commands

Use this path during presentation:

```text
inspect poster
inspect bookshelf
use key
code 3142
use USB drive
OPEN-SESAME
```

You can also click the room objects instead of typing every command.

## How This Qualifies As An AI Agent

The project has the main parts of an agent:

- Perception: reads player commands and object clicks.
- Memory: stores inventory, inspected objects, puzzle status, and remaining time.
- Reasoning: decides the next result based on the current state.
- Action: updates the room, gives hints, opens locks, and ends the game.
- Goal: guide the player toward escaping the room.

## Optional LLM Upgrade

The current version uses a rule-based agent so it works without an API key. To upgrade it with a real LLM:

1. Keep the current game state object.
2. Send the player's command and current state to the LLM.
3. Ask the LLM to return a structured action such as:

```json
{
  "reply": "The drawer opens and you find a number card.",
  "addItem": "number card",
  "stateChange": "desk_opened"
}
```

4. Validate the returned action in JavaScript before changing the game state.

For a college demo, explain that the rule-based version is the reliable local agent, and the LLM version can make the conversation more flexible.
