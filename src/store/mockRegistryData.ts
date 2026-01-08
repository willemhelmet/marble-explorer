import { Vector3 } from "three";
import { type Registry } from "./worldSlice";

export const mockRegistry: Registry = {
  hub: {
    id: "hub",
    portals: [
      {
        id: "portal-1",
        position: new Vector3(3, 1, -5),
        url: "https://marble.worldlabs.ai/world/22734c94-a209-41e6-950a-144a6d34b217", // Mock World A
        status: "idle",
      },
      {
        id: "portal-2",
        position: new Vector3(-3, 1, -5),
        url: "https://marble.worldlabs.ai/world/1e5bd02f-ab11-4aad-b975-b3f2e3961d24", // Mock World B
        status: "idle",
      },
    ],
  },
  "world-a": {
    id: "world-a",
    portals: [
      {
        id: "portal-back-hub",
        position: new Vector3(0, 1, 4),
        url: "https://marble.worldlabs.ai/world/34db2e21-4ee7-495c-a485-7b7d61ef8c75", // Hub
        status: "idle",
      },
    ],
  },
  "world-b": {
    id: "world-b",
    portals: [
      {
        id: "portal-back-hub",
        position: new Vector3(0, 1, 4),
        url: "https://marble.worldlabs.ai/world/34db2e21-4ee7-495c-a485-7b7d61ef8c75", // Hub
        status: "idle",
      },
    ],
  },
};
