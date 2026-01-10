import { useMyStore } from "../store/store";
import { RemotePlayer } from "./RemotePlayer";

export const RemotePlayerManager = () => {
  const remotePlayers = useMyStore((state) => state.remotePlayers);
  
  return (
    <>
      {Array.from(remotePlayers.values()).map((player) => (
        <RemotePlayer key={player.id} player={player} />
      ))}
    </>
  );
};
