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
  status: string;
  pending_operation_id: string | null;
}

interface ServerToClientEvents {
  players: (players: RawPlayer[]) => void;
  portals: (portals: ServerPortal[]) => void;
  portal_added: (portal: ServerPortal) => void;
  portal_updated: (data: { id: number; updates: Partial<ServerPortal> }) => void;
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
    status: string;
    pending_operation_id?: string | null;
  }) => void;
  update_portal: (data: {
    id: number;
    updates: Partial<ServerPortal>;
    room_name: string;
  }) => void;
  remove_portal: (data: { id: number; room_name: string }) => void;
}

class SocketManager {
  private socket: Socket<ServerToClientEvents, ClientToServerEvents> | null =
    null;

  public connect() {
    if (this.socket?.connected) return;

    this.socket = io("https://marble-explorer.rcdis.co");

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
        status: (p.status as any) || "ready", // Default to "ready" if missing
        pendingOperationId: p.pending_operation_id || undefined,
      }));
      useMyStore.getState().setPortalsForWorld(currentWorld, portals);
    });

    this.socket.on("portal_added", (p) => {
      console.log("Socket received portal_added:", p);
      const currentWorld = useMyStore.getState().currentWorldId;
      if (p.from_scene !== currentWorld) {
        console.warn(
          `Ignoring portal for world ${p.from_scene} (current: ${currentWorld})`,
        );
        return;
      }

      const newPortal: Portal = {
        id: String(p.id),
        position: new Vector3(p.x, p.y, p.z),
        rotationY: p.rotation_y,
        url: p.target_url,
        status: (p.status as any) || "ready", // Default to "ready" if missing
        pendingOperationId: p.pending_operation_id || undefined,
      };
      useMyStore.getState().addPortal(currentWorld, newPortal);
    });

    this.socket.on("portal_updated", ({ id, updates }) => {
      console.log("Socket received portal_updated:", id, updates);
      const currentWorld = useMyStore.getState().currentWorldId;

      // Map snake_case server fields to camelCase client fields
      const clientUpdates: Partial<Portal> = {};
      if (updates.status) clientUpdates.status = updates.status as any;
      if (updates.target_url !== undefined) clientUpdates.url = updates.target_url;
      if (updates.pending_operation_id !== undefined)
        clientUpdates.pendingOperationId = updates.pending_operation_id || undefined;

      useMyStore.getState().updatePortal(currentWorld, String(id), clientUpdates);
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

  public getSocketId(): string | null {
    return this.socket?.id || null;
  }

  public sendMovement(position: Vector3, rotation: Euler) {
    if (!this.socket) return;
    this.socket.emit("move", position.toArray(), [
      rotation.x,
      rotation.y,
      rotation.z,
    ]);
  }

  public createPortal(
    position: Vector3,
    rotationY: number,
    targetUrl: string,
    status: string = "ready",
    pendingOperationId?: string,
  ) {
    if (!this.socket) return;
    const currentWorld = useMyStore.getState().currentWorldId;

    this.socket.emit("create_portal", {
      x: position.x,
      y: position.y,
      z: position.z,
      rotation_y: rotationY,
      from_scene: currentWorld,
      target_url: targetUrl,
      status: status,
      pending_operation_id: pendingOperationId,
    });
  }

  public updatePortal(
    worldId: string,
    portalId: string,
    updates: Partial<Portal>,
  ) {
    if (!this.socket) return;

    // Map camelCase client fields to snake_case server fields
    const serverUpdates: any = {};
    if (updates.status) serverUpdates.status = updates.status;
    if (updates.url !== undefined) serverUpdates.target_url = updates.url;
    if (updates.pendingOperationId !== undefined)
      serverUpdates.pending_operation_id = updates.pendingOperationId;

    this.socket.emit("update_portal", {
      id: Number(portalId),
      updates: serverUpdates,
      room_name: worldId,
    });
  }

  public removePortal(worldId: string, portalId: string) {
    if (!this.socket) return;
    this.socket.emit("remove_portal", {
      id: Number(portalId),
      room_name: worldId,
    });
  }
}

export const socketManager = new SocketManager();
