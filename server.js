const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let waitingPlayer = null;

io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);

  if (!waitingPlayer) {
    waitingPlayer = socket;
    socket.emit('waiting');
  } else {
    waitingPlayer.emit('match_found', { host: true });
    socket.emit('match_found', { host: false });
    waitingPlayer = null;
  }

  socket.on('disconnect', () => {
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }
    console.log('Player disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`);
});
