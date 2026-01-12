import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Group, Mesh, Quaternion, Euler } from "three";
import { type RemotePlayer as RemotePlayerType } from "../store/playerSlice";

export const RemotePlayer = ({ player }: { player: RemotePlayerType }) => {
  const groupRef = useRef<Group>(null);
  const bodyRef = useRef<Mesh>(null);
  const headRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    const smoothing = 15;

    // 1. Interpolate Position (Root Group)
    if (groupRef.current) {
      groupRef.current.position.lerp(player.position, smoothing * delta);
    }

    // 2. Interpolate Body Yaw (Y-axis only)
    if (bodyRef.current) {
      // Extract Yaw from player rotation
      const targetYaw = new Quaternion().setFromEuler(
        new Euler(0, player.rotation.y, 0),
      );
      bodyRef.current.quaternion.slerp(targetYaw, smoothing * delta);
    }

    // 3. Interpolate Head Pitch (X-axis only)
    if (headRef.current) {
      // Extract Pitch from player rotation
      // Note: Head is child of Body, so it inherits Yaw. We only apply local Pitch.
      const targetPitch = new Quaternion().setFromEuler(
        new Euler(player.rotation.x, 0, 0),
      );
      headRef.current.quaternion.slerp(targetPitch, smoothing * delta);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Body Group (Rotates Yaw) */}
      <mesh ref={bodyRef}>
        {/* Body Capsule: Radius 0.25, Length 0.9 (Total ~1.4m) */}
        <capsuleGeometry args={[0.25, 0.9, 4, 8]} />
        <meshStandardMaterial color="#2a2a2a" roughness={0.7} />

        {/* Head Mesh (Rotates Pitch) - Parented to Body */}
        {/* Positioned on top of the body capsule */}
        <mesh ref={headRef} position={[0, 0.85, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#e5e5e5" roughness={0.3} />

          {/* Face/Visor indicator to see rotation */}
          <mesh position={[0, 0, -0.25]} scale={[0.15, 0.1, 0.05]}>
            <boxGeometry />
            <meshStandardMaterial
              color="#00ff00"
              emissive="#00ff00"
              emissiveIntensity={0.5}
            />
          </mesh>
        </mesh>
      </mesh>
    </group>
  );
};
