import { io, Socket } from "socket.io-client";
import { useMyStore } from "../store/store";
import { Vector3, Euler } from "three";
import { type RemotePlayer } from "../store/playerSlice";
import { type Portal } from "../store/worldSlice";

// Raw types from server
interface RawPlayer {
  id: string;
  position: [number, number, number];
  rotation: [number, number, number];
  room: string;
}

interface ServerPortal {
  id: number;
  x: number;
  y: number;
  z: number;
  rotation_y: number;
  from_scene: string;
  target_url: string;
}

interface ServerToClientEvents {
  players: (players: RawPlayer[]) => void;
  portals: (portals: ServerPortal[]) => void;
  portal_added: (portal: ServerPortal) => void;
  portal_removed: (id: number) => void;
  portal_error: (msg: string) => void;
}

interface ClientToServerEvents {
  join_scene: (sceneName: string) => void;
  move: (
    position: [number, number, number],
    rotation: [number, number, number],
  ) => void;
  create_portal: (portal: {
    x: number;
    y: number;
    z: number;
    rotation_y: number;
    from_scene: string;
    target_url: string;
  }) => void;
  remove_portal: (data: { id: number; room_name: string }) => void;
}

class SocketManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;

  public connect() {
    if (this.socket?.connected) return;

    this.socket = io("http://localhost:3000");

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket?.id);
      const currentWorld = useMyStore.getState().currentWorldId;
      this.joinRoom(currentWorld);
    });

    this.socket.on("players", (rawPlayers) => {
      const myId = this.socket?.id;
      const formattedOthers: RemotePlayer[] = rawPlayers
        .filter((p) => p.id !== myId)
        .map((p) => ({
          id: p.id,
          position: new Vector3(...p.position),
          rotation: new Euler(...p.rotation),
          room: p.room,
        }));

      useMyStore.getState().syncPlayers(formattedOthers);
    });

    this.socket.on("portals", (serverPortals) => {
      const currentWorld = useMyStore.getState().currentWorldId;
      const portals: Portal[] = serverPortals.map((p) => ({
        id: String(p.id),
        position: new Vector3(p.x, p.y, p.z),
        rotationY: p.rotation_y,
        url: p.target_url,
        status: "ready",
      }));
      useMyStore.getState().setPortalsForWorld(currentWorld, portals);
    });

    this.socket.on("portal_added", (p) => {
      console.log("Socket received portal_added:", p);
      const currentWorld = useMyStore.getState().currentWorldId;
      if (p.from_scene !== currentWorld) {
        console.warn(`Ignoring portal for world ${p.from_scene} (current: ${currentWorld})`);
        return;
      }

      const newPortal: Portal = {
        id: String(p.id),
        position: new Vector3(p.x, p.y, p.z),
        rotationY: p.rotation_y,
        url: p.target_url,
        status: "ready",
      };
      useMyStore.getState().addPortal(currentWorld, newPortal);
    });

    this.socket.on("portal_removed", (id) => {
      const currentWorld = useMyStore.getState().currentWorldId;
      useMyStore.getState().removePortal(currentWorld, String(id));
    });

    this.socket.on("portal_error", (msg) => {
      console.error("Server Portal Error:", msg);
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public joinRoom(sceneName: string) {
    if (!this.socket) return;
    this.socket.emit("join_scene", sceneName);
  }

  public sendMovement(position: Vector3, rotation: Euler) {
    if (!this.socket) return;
    this.socket.emit("move", position.toArray(), [
      rotation.x,
      rotation.y,
      rotation.z,
    ]);
  }

  public createPortal(position: Vector3, rotationY: number, targetUrl: string) {
    if (!this.socket) return;
    const currentWorld = useMyStore.getState().currentWorldId;

    this.socket.emit("create_portal", {
      x: position.x,
      y: position.y,
      z: position.z,
      rotation_y: rotationY,
      from_scene: currentWorld,
      target_url: targetUrl,
    });
  }
}

export const socketManager = new SocketManager();

