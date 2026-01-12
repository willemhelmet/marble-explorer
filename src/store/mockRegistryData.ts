import { Vector3 } from "three";
import { type Registry } from "./worldSlice";

export const mockRegistry: Registry = {
  hub: {
    id: "hub",
    portals: [
      {
        id: "portal-1",
        position: new Vector3(3, 0.5, -5),
        rotationY: 0,
        url: "https://marble.worldlabs.ai/world/22734c94-a209-41e6-950a-144a6d34b217", // Mock World A
        status: "ready",
      },
      {
        id: "portal-2",
        position: new Vector3(-3, 0.5, -5),
        rotationY: 0,
        url: "https://marble.worldlabs.ai/world/1e5bd02f-ab11-4aad-b975-b3f2e3961d24", // Mock World B
        status: "ready",
      },
      {
        id: "portal-3",
        position: new Vector3(0, 0.5, -48),
        rotationY: 0,
        url: "https://marble.worldlabs.ai/world/2d11d885-4737-42e8-bcf2-dce92f5421f6", // Mock World B
        status: "ready",
      },
    ],
  },
  "world-a": {
    id: "world-a",
    portals: [
      {
        id: "portal-back-hub",
        position: new Vector3(0, 0, -1),
        rotationY: 0,
        url: "hub",
        status: "ready",
      },
    ],
  },
  "world-b": {
    id: "world-b",
    portals: [
      {
        id: "portal-back-hub",
        position: new Vector3(0, 1, 4),
        rotationY: 0,
        url: "hub",
        status: "ready",
      },
    ],
  },
};
