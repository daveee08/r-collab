import WebSocket, { WebSocketServer } from 'ws';
import http from 'http';

const port = 5678; // Port for custom cursor updates
const server = http.createServer();
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Cursor client connected');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message); // Parse incoming cursor data
      console.log('Received cursor data:', data);

      // Broadcast cursor updates to all connected clients
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data)); // Send structured JSON
        }
      });
    } catch (error) {
      console.error('Error parsing cursor message:', error);
    }
  });

  ws.on('close', () => {
    console.log('Cursor client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Cursor WebSocket server running at ws://localhost:${port}`);
});