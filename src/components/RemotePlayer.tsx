import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh, Quaternion } from "three";
import { type RemotePlayer as RemotePlayerType } from "../store/playerSlice";

export const RemotePlayer = ({ player }: { player: RemotePlayerType }) => {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (meshRef.current) {
      // Smoothly interpolate towards the latest network position
      const smoothing = 15; // Higher = snappier, Lower = smoother/laggier
      
      meshRef.current.position.lerp(player.position, smoothing * delta);

      const targetQuat = new Quaternion().setFromEuler(player.rotation);
      meshRef.current.quaternion.slerp(targetQuat, smoothing * delta);
    }
  });

  return (
    <mesh ref={meshRef}>
      <capsuleGeometry args={[0.3, 1, 4, 8]} />
      <meshStandardMaterial color="hotpink" />
      <axesHelper args={[1]} />
    </mesh>
  );
};
