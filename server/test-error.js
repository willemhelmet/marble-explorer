import { io } from "socket.io-client";

const URL = "http://localhost:3000";

const socket = io(URL);

socket.on("connect", () => {
  console.log("Connected to server. Sending invalid portal data...");
  // Sending missing fields
  socket.emit("create_portal", { x: 0, y: 0 });
});

socket.on("portal_error", (message) => {
  console.log("Received expected portal_error:", message);
  socket.disconnect();
  process.exit(0);
});

// Timeout after 5 seconds
setTimeout(() => {
  console.error("Error handling test TIMED OUT");
  process.exit(1);
}, 5000);
