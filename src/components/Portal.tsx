import { useRef, useEffect } from "react";
import { Sphere, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMyStore } from "../store/store";
import { characterStatus } from "bvhecctrl";
import { Vector3, Mesh, Matrix4, Sphere as ThreeSphere } from "three";
import type { ThreeElements } from "@react-three/fiber";
import * as THREE from "three";
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from "three-mesh-bvh";

// Patch BufferGeometry and Mesh prototypes
// It's safe to do this multiple times as it just reassigns the functions
// We cast to any to avoid TypeScript conflicts if multiple versions of three-mesh-bvh are present (e.g. via drei)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(THREE.BufferGeometry.prototype as any).computeBoundsTree = computeBoundsTree;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(THREE.BufferGeometry.prototype as any).disposeBoundsTree = disposeBoundsTree;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(THREE.Mesh.prototype as any).raycast = acceleratedRaycast;

export const Portal = (props: ThreeElements['group']) => {
  const portalStatus = useMyStore((state) => state.portalStatus);
  const isInsideRef = useRef(false);
  const meshRef = useRef<Mesh>(null);

  // Create reusable objects for the player to avoid allocation every frame.
  // We use useRef instead of useMemo to explicitly indicate these are mutable objects.
  const playerSphereRef = useRef(new ThreeSphere(new Vector3(), 0.5));
  const inverseMatrixRef = useRef(new Matrix4());
  const localPlayerPosRef = useRef(new Vector3());

  // Determine color based on status
  let color = "gray";
  switch (portalStatus) {
    case "idle":
      color = "blue";
      break;
    case "fetching":
    case "initializing":
      color = "orange";
      break;
    case "ready":
      color = "green";
      break;
    case "error":
      color = "red";
      break;
  }

  useEffect(() => {
    const mesh = meshRef.current;
    if (mesh) {
      // Compute BVH for the geometry
      mesh.geometry.computeBoundsTree();
    }

    return () => {
      // Clean up BVH when component unmounts
      if (mesh && mesh.geometry.boundsTree) {
         mesh.geometry.disposeBoundsTree();
      }
    }
  }, []);

  useFrame(() => {
    if (meshRef.current && meshRef.current.geometry.boundsTree) {

      // Transform player position to local space of the mesh
      const inverseMatrix = inverseMatrixRef.current;
      const localPlayerPos = localPlayerPosRef.current;
      const playerSphere = playerSphereRef.current;

      inverseMatrix.copy(meshRef.current.matrixWorld).invert();
      localPlayerPos.copy(characterStatus.position).applyMatrix4(inverseMatrix);

      // Scale factor:
      const scale = meshRef.current.getWorldScale(new Vector3()).x;
      playerSphere.radius = 0.5 / scale;
      playerSphere.center.copy(localPlayerPos);

      let isIntersecting = false;

      meshRef.current.geometry.boundsTree.shapecast({
        intersectsBounds: (box) => {
          return box.intersectsSphere(playerSphere);
        },
        intersectsTriangle: (triangle) => {
          if (triangle.intersectsSphere(playerSphere)) {
            isIntersecting = true;
            return true; // Stop traversal
          }
          return false;
        }
      });

      if (isIntersecting) {
        if (!isInsideRef.current) {
          console.log("Player entered portal");
          isInsideRef.current = true;
        }
      } else {
        isInsideRef.current = false;
      }
    }
  });

  return (
    <group {...props}>
      <Sphere ref={meshRef}>
        <meshBasicMaterial color={color} />
      </Sphere>
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {portalStatus}
      </Text>
    </group>
  );
};
