# Portal Creation Sync Plan

## Goal
Ensure that when a user creates a portal in the client, it is correctly:
1.  Sent to the server via Socket.IO (`create_portal`).
2.  Persisted in the server-side SQLite database.
3.  Broadcast to all other connected clients in the same room (`portal_added`).
4.  Received and rendered by those clients.

## Diagnosis Steps
1.  **Add Logging:** Instrument both Client (`SocketManager.ts`) and Server (`server.js`) with debug logs to trace the event flow.
2.  **Verify Room Logic:** Ensure clients and server agree on the room name ("hub").
3.  **Check Data Format:** Ensure payload matches expected schema.

## Implementation Steps
1.  **Server-side:** Update `server.js` (if needed) to ensure robust broadcasting and error handling.
2.  **Client-side:** Verify `SocketManager.ts` listens correctly and updates `WorldSlice`.
3.  **UI:** Verify `PortalUI.tsx` sends the correct data.

## Verification
- Connect two clients.
- Create portal on Client A.
- Verify Client B receives it.
- Verify Client A receives it (via broadcast) and replaces its local temp portal.
