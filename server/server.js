import { Server } from "socket.io";
import { initDB, getPortalsForRoom, createPortal, removePortal } from "./db.js";

// Initialize database
const dbPath = process.env.DB_PATH || 'disco.db';
initDB(dbPath);

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;
io.listen(PORT);
console.log(`Server listening on port ${PORT}`);
const rooms = new Map(); // roomName -> Set of player objects

io.on("connection", (socket) => {
  console.log("user connected:", socket.id);

  const player = {
    id: socket.id,
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    room: "hub", // default room
  };

  // Add player to default room
  if (!rooms.has("hub")) {
    rooms.set("hub", new Set());
  }
  rooms.get("hub").add(player);

  // Join the socket room
  socket.join("hub");

  // Send only players in the same room to the new player
  const roomPlayers = Array.from(rooms.get("hub"));
  socket.emit("players", roomPlayers);

  // Send portals in the hub to the new player
  const portals = getPortalsForRoom("hub");
  socket.emit("portals", portals);

  socket.on("move", (position, rotation) => {
    // Find the player in their current room
    let currentPlayer = null;
    let currentRoom = null;

    for (const [roomName, playerSet] of rooms) {
      for (const player of playerSet) {
        if (player.id === socket.id) {
          currentPlayer = player;
          currentRoom = roomName;
          break;
        }
      }
      if (currentPlayer) break;
    }

    if (currentPlayer && currentRoom) {
      currentPlayer.position = position;
      currentPlayer.rotation = rotation;

      // Broadcast only to players in the same room
      const roomPlayers = Array.from(rooms.get(currentRoom));
      io.to(currentRoom).emit("players", roomPlayers);
    }
  });

  socket.on("join_scene", (sceneName) => {
    console.log("player has entered ", sceneName);

    // Find the player in their current room
    let currentPlayer = null;
    let currentRoom = null;

    for (const [roomName, playerSet] of rooms) {
      for (const player of playerSet) {
        if (player.id === socket.id) {
          currentPlayer = player;
          currentRoom = roomName;
          break;
        }
      }
      if (currentPlayer) break;
    }

    if (currentPlayer && currentRoom !== sceneName) {
      // Remove player from current room
      rooms.get(currentRoom).delete(currentPlayer);

      // Update player's room
      currentPlayer.room = sceneName;

      // Add player to new room
      if (!rooms.has(sceneName)) {
        rooms.set(sceneName, new Set());
      }
      rooms.get(sceneName).add(currentPlayer);

      // Send updated player list to players in old room
      const oldRoomPlayers = Array.from(rooms.get(currentRoom));
      io.to(currentRoom).emit("players", oldRoomPlayers);

      // Send updated player list to players in new room
      const newRoomPlayers = Array.from(rooms.get(sceneName));
      io.to(sceneName).emit("players", newRoomPlayers);

      // Send portals in the new room to the player
      const portals = getPortalsForRoom(sceneName);
      socket.emit("portals", portals);

      // Move socket to new room
      socket.leave(currentRoom);
      socket.join(sceneName);
    } else if (currentPlayer) {
      // Player is already in the correct room, just make sure they're in the socket room
      socket.join(sceneName);
      // Still send portals just in case
      const portals = getPortalsForRoom(sceneName);
      socket.emit("portals", portals);
    }
  });

  socket.on("create_portal", (portalData) => {
    console.log(`[${socket.id}] create_portal request:`, portalData);
    try {
      const id = createPortal(portalData);
      const newPortal = { ...portalData, id };
      console.log("Portal created, broadcasting to:", portalData.from_scene);
      // Broadcast to all clients in the scene
      io.to(portalData.from_scene).emit("portal_added", newPortal);
    } catch (error) {
      console.error("Error creating portal:", error.message);
      socket.emit("portal_error", error.message);
    }
  });

  socket.on("remove_portal", ({ id, room_name }) => {
    try {
      const removed = removePortal(id);
      if (removed) {
        // Broadcast to all clients in the scene
        io.to(room_name).emit("portal_removed", id);
      }
    } catch (error) {
      console.error("Error removing portal:", error.message);
      socket.emit("portal_error", error.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    // Find and remove player from their room
    let playerRoom = null;
    for (const [roomName, playerSet] of rooms) {
      for (const player of playerSet) {
        if (player.id === socket.id) {
          playerSet.delete(player);
          playerRoom = roomName;
          break;
        }
      }
      if (playerRoom) break;
    }

    // Clean up empty rooms
    if (playerRoom && rooms.get(playerRoom).size === 0) {
      rooms.delete(playerRoom);
    }

    // Broadcast updated player list to remaining players in the room
    if (playerRoom && rooms.has(playerRoom)) {
      const roomPlayers = Array.from(rooms.get(playerRoom));
      io.to(playerRoom).emit("players", roomPlayers);
    }
  });
});
