import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

const port = 1234; // Port for Yjs collaboration
const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Yjs client connected');

  ws.on('message', (message) => {
    // Broadcast Yjs messages to all connected clients
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message); // Forward Yjs messages as-is
      }
    });
  });

  ws.on('close', () => {
    console.log('Yjs client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Yjs WebSocket server running at ws://localhost:${port}`);
});