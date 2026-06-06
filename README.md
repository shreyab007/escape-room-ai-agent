# Escape Room AI Agent

This is a AI agent game. The player is trapped in a locked lab and must escape by inspecting objects, collecting items, solving a code puzzle, and entering a final passphrase.

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
