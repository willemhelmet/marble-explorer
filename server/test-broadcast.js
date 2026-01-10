import { io } from "socket.io-client";

const URL = "http://localhost:3000";

const client1 = io(URL);
const client2 = io(URL);

let portalCreated = false;
let broadcastReceived = false;

client2.on("portal_added", (portal) => {
  console.log("Client 2 received broadcast:", JSON.stringify(portal, null, 2));
  broadcastReceived = true;
  if (portalCreated && broadcastReceived) {
    console.log("Broadcast test SUCCESSFUL");
    client1.disconnect();
    client2.disconnect();
    process.exit(0);
  }
});

client1.on("connect", () => {
  console.log("Client 1 connected");
  
  const newPortal = {
    x: -5,
    y: 1,
    z: -10,
    from_scene: "hub",
    target_url: "https://marble.worldlabs.ai/world/56ae0deb-0c85-4180-9b8f-b45c9c41460e"
  };

  setTimeout(() => {
    console.log("Client 1 creating portal...");
    client1.emit("create_portal", newPortal);
    portalCreated = true;
  }, 1000);
});

client2.on("connect", () => {
  console.log("Client 2 connected");
});

// Timeout after 5 seconds
setTimeout(() => {
  console.error("Broadcast test TIMED OUT");
  process.exit(1);
}, 5000);
