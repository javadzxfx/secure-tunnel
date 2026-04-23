// WebSocket Reverse Proxy Worker for V2Ray
// Runs on GitHub Pages (client-side)
// Connections open to free WebSocket echo server as relay

const WS_RELAY = "wss://echo.websocket.events";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    if (url.pathname === "/ws") {
      const [client, server] = new WebSocketPair();
      
      server.addEventListener("message", async (event) => {
        const relay = new WebSocket(WS_RELAY);
        relay.addEventListener("open", () => {
          relay.send(event.data);
        });
        relay.addEventListener("message", (msg) => {
          server.send(msg.data);
        });
      });
      
      return new Response(null, {
        status: 101,
        webSocket: client,
      });
    }
    
    return new Response("V2Ray Tunnel Active", {
      headers: { "content-type": "text/plain" },
    });
  },
};
