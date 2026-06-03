const initialState = {
  inventory: [],
  inspected: new Set(),
  safeOpen: false,
  laptopUnlocked: false,
  doorUnlocked: false,
  escaped: false,
  hintsUsed: 0,
  secondsLeft: 15 * 60
};

let state = cloneState(initialState);
let timerId;

const chatLog = document.querySelector("#chatLog");
const inventoryEl = document.querySelector("#inventory");
const commandForm = document.querySelector("#commandForm");
const commandInput = document.querySelector("#commandInput");
const timerEl = document.querySelector("#timer");
const resetButton = document.querySelector("#resetButton");

const objectResponses = {
  poster: "The poster says: 'Great discoveries happen when bright minds read between the lines.' One word is oddly bright: READ.",
  bookshelf: "Most books are dusty, but one programming book sticks out. Behind it you find a small brass key.",
  desk: "The desk drawer is locked. The brass key might open it.",
  laptop: "The laptop asks for a four-digit access code. A sticky note says: 'Order matters: poster, drawer, screen, door.'",
  safe: "The safe has a keypad and a note: 'The lab's first rule is curiosity.' It expects a four-digit code.",
  door: "The exit door has an electronic lock. It needs the final passphrase from the laptop."
};

function cloneState(source) {
  return {
    ...source,
    inventory: [...source.inventory],
    inspected: new Set(source.inspected)
  };
}

function addMessage(text, sender = "agent") {
  const message = document.createElement("div");
  message.className = `message ${sender}`;
  message.textContent = text;
  chatLog.append(message);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function renderInventory() {
  inventoryEl.innerHTML = "";

  if (state.inventory.length === 0) {
    const empty = document.createElement("span");
    empty.className = "item";
    empty.textContent = "Empty";
    inventoryEl.append(empty);
    return;
  }

  state.inventory.forEach((item) => {
    const pill = document.createElement("button");
    pill.className = "item";
    pill.type = "button";
    pill.textContent = getInventoryLabel(item);
    pill.addEventListener("click", () => {
      handlePlayerCommand(getInventoryCommand(item));
    });
    inventoryEl.append(pill);
  });
}

function getInventoryLabel(item) {
  if (item === "number card") {
    return "Read number card";
  }

  return `Use ${item}`;
}

function getInventoryCommand(item) {
  if (item === "number card") {
    return "read number card";
  }

  return `use ${item}`;
}

function addItem(item) {
  if (!state.inventory.includes(item)) {
    state.inventory.push(item);
    renderInventory();
    addMessage(`Added to inventory: ${item}`, "system");
  }
}

function hasItem(item) {
  return state.inventory.includes(item);
}

function inspectObject(objectName) {
  if (state.escaped) {
    return "You already escaped. Reset the room to play again.";
  }

  state.inspected.add(objectName);

  if (objectName === "bookshelf") {
    addItem("brass key");
  }

  if (objectName === "desk" && hasItem("brass key") && !hasItem("number card")) {
    addItem("number card");
    return "The brass key opens the drawer. Inside is a card with the number 3142.";
  }

  if (objectName === "safe" && state.safeOpen) {
    return "The safe is open. Inside, the hidden USB drive slot is empty now.";
  }

  if (objectName === "laptop" && state.laptopUnlocked) {
    return "The laptop screen shows the final passphrase: OPEN-SESAME.";
  }

  if (objectName === "door" && state.doorUnlocked) {
    return escapeRoom();
  }

  return objectResponses[objectName] || "The agent studies it, but nothing useful stands out.";
}

function useItem(command) {
  if (command.includes("key")) {
    if (!hasItem("brass key")) {
      return "You do not have a key yet. Search the room carefully.";
    }
    return inspectObject("desk");
  }

  if (command.includes("usb")) {
    if (!hasItem("USB drive")) {
      return "You have not found a USB drive yet.";
    }
    state.laptopUnlocked = true;
    return "You plug the USB drive into the laptop. The screen unlocks and reveals the passphrase: OPEN-SESAME.";
  }

  if (command.includes("number") || command.includes("card")) {
    if (!hasItem("number card")) {
      return "You have not found the number card yet.";
    }
    return "The number card says 3142. That looks like a safe code.";
  }

  return "Tell me what to use. Example: use key, use USB drive.";
}

function submitCode(command) {
  const codeMatch = command.match(/\b\d{4}\b/);
  if (!codeMatch) {
    return "I need a four-digit code.";
  }

  const code = codeMatch[0];
  if (code !== "3142") {
    return "The keypad rejects the code. Something in the room gives the correct order.";
  }

  if (state.safeOpen) {
    return "The safe is already open.";
  }

  state.safeOpen = true;
  addItem("USB drive");
  return "The safe clicks open. Inside is a USB drive.";
}

function unlockDoor(command) {
  const normalized = command.toUpperCase();

  if (!state.laptopUnlocked) {
    return "The door needs a final passphrase, but you have not unlocked the laptop yet.";
  }

  if (!normalized.includes("OPEN-SESAME") && !normalized.includes("OPEN SESAME")) {
    return "The lock flashes red. The final passphrase must be entered exactly.";
  }

  state.doorUnlocked = true;
  return escapeRoom();
}

function escapeRoom() {
  state.escaped = true;
  clearInterval(timerId);
  return "The door slides open. You escaped the locked lab. Final score: " + calculateScore() + "/100.";
}

function calculateScore() {
  const timeScore = Math.max(0, Math.floor(state.secondsLeft / 9));
  const hintPenalty = state.hintsUsed * 8;
  return Math.max(40, Math.min(100, 70 + timeScore - hintPenalty));
}

function getHint() {
  state.hintsUsed += 1;

  if (!state.inspected.has("poster")) {
    return "Hint: Start with the poster. It contains a clue, not just decoration.";
  }

  if (!hasItem("brass key")) {
    return "Hint: The poster points toward reading. Try the bookshelf.";
  }

  if (!hasItem("number card")) {
    return "Hint: A key usually opens something small before it opens something big.";
  }

  if (!state.safeOpen) {
    return "Hint: The four digits from the drawer belong on the safe keypad.";
  }

  if (!state.laptopUnlocked) {
    return "Hint: The safe item belongs with the laptop.";
  }

  if (!state.escaped) {
    return "Hint: The laptop gives the exact passphrase for the door.";
  }

  return "You already solved the room.";
}

function agentReply(rawCommand) {
  const command = rawCommand.trim().toLowerCase();

  if (!command) {
    return "Type an action, or click something in the room.";
  }

  if (state.escaped) {
    return "The game is complete. Press Reset to try again.";
  }

  if (command.includes("hint") || command.includes("help")) {
    return getHint();
  }

  if (command.includes("inventory")) {
    return state.inventory.length ? `You have: ${state.inventory.join(", ")}.` : "Your inventory is empty.";
  }

  if (command.includes("inspect") || command.includes("look") || command.includes("search") || command.includes("check")) {
    const target = findObjectInCommand(command);
    return target ? inspectObject(target) : "What should I inspect? Try desk, poster, laptop, safe, bookshelf, or door.";
  }

  if (command.startsWith("use")) {
    return useItem(command);
  }

  if (command.includes("read") && (command.includes("number") || command.includes("card"))) {
    return useItem(command);
  }

  if (command.includes("code") || /\b\d{4}\b/.test(command)) {
    return submitCode(command);
  }

  if (command.includes("open") || command.includes("passphrase") || command.includes("sesame")) {
    return unlockDoor(command);
  }

  const target = findObjectInCommand(command);
  if (target) {
    return inspectObject(target);
  }

  return "I understand room actions like inspect, search, use, code, hint, inventory, and open door.";
}

function findObjectInCommand(command) {
  return ["poster", "bookshelf", "desk", "laptop", "safe", "door"].find((objectName) => command.includes(objectName));
}

function handlePlayerCommand(command) {
  addMessage(command, "player");
  addMessage(agentReply(command), "agent");
}

function updateTimer() {
  if (state.escaped) {
    return;
  }

  state.secondsLeft -= 1;
  const minutes = Math.floor(state.secondsLeft / 60).toString().padStart(2, "0");
  const seconds = (state.secondsLeft % 60).toString().padStart(2, "0");
  timerEl.textContent = `${minutes}:${seconds}`;

  if (state.secondsLeft <= 0) {
    clearInterval(timerId);
    addMessage("Time is up. The lab locks down. Press Reset to try again.", "system");
    commandInput.disabled = true;
  }
}

function resetGame() {
  state = cloneState(initialState);
  clearInterval(timerId);
  chatLog.innerHTML = "";
  commandInput.disabled = false;
  timerEl.textContent = "15:00";
  renderInventory();
  addMessage("You wake inside a locked research lab. I am the room agent. Click objects or type commands to escape.");
  addMessage("Goal: discover the code, unlock the laptop, and open the exit door.");
  timerId = setInterval(updateTimer, 1000);
}

document.querySelectorAll(".hotspot").forEach((button) => {
  button.addEventListener("click", () => {
    const objectName = button.dataset.object;
    handlePlayerCommand(`inspect ${objectName}`);
  });
});

commandForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const command = commandInput.value;
  commandInput.value = "";
  handlePlayerCommand(command);
});

resetButton.addEventListener("click", resetGame);

resetGame();
