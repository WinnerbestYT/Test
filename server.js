// server.js - Simple Godot Matchmaker using WebSocket
const WebSocket = require("ws");
const PORT = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port: PORT });

let waitingPlayer = null;

wss.on("connection", (ws) => {
  console.log("Player connected.");

  if (waitingPlayer === null) {
    waitingPlayer = ws;
    ws.send(JSON.stringify({ type: "waiting" }));
    console.log("Player is waiting for a match...");
  } else {
    // Match found — tell both clients who is host
    try {
      waitingPlayer.send(JSON.stringify({ type: "start_game", is_host: true }));
    } catch {}
    try {
      ws.send(JSON.stringify({ type: "start_game", is_host: false }));
    } catch {}

    console.log("Matched two players.");
    waitingPlayer = null;
  }

  ws.on("close", () => {
    console.log("Player disconnected.");
    if (waitingPlayer === ws) {
      waitingPlayer = null;
    }
  });
});
