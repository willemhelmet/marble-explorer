import { useEffect, useRef, useState } from "react";
import { SplatMesh, dyno } from "@sparkjsdev/spark";
import * as THREE from "three";
import { useMyStore } from "../../store/store";
import { type ThreeElements, useFrame } from "@react-three/fiber";
import { RevealDyno } from "../../dynos/revealDyno";
import { characterStatus } from "bvhecctrl";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export const Splat = (props: Partial<ThreeElements["primitive"]>) => {
  const assets = useMyStore((state) => state.assets);
  const worldAnchorPosition = useMyStore((state) => state.worldAnchorPosition);
  const splatUrl = assets?.splatUrl;

  if (!splatUrl) return null;

  // Using splatUrl as a key ensures SplatInner remounts when the URL changes,
  // allowing us to use stable initialization patterns.
  return (
    <SplatInner
      key={splatUrl}
      splatUrl={splatUrl}
      worldAnchorPosition={worldAnchorPosition}
      {...props}
    />
  );
};

const SplatInner = ({
  splatUrl,
  worldAnchorPosition,
  ...props
}: {
  splatUrl: string;
  worldAnchorPosition: THREE.Vector3 | null;
} & Partial<ThreeElements["primitive"]>) => {
  const revealRef = useRef({ progress: 0 });
  const [animationStarted, setAnimationStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize uniforms and mesh in a single stable useState block
  const [data] = useState(() => {
    const originUniform = new dyno.DynoVec3({
      value: worldAnchorPosition
        ? worldAnchorPosition.clone()
        : new THREE.Vector3(0, 0, 0),
    });
    const revealProgressUniform = new dyno.DynoFloat({ value: 0.0 });
    const maxRadiusUniform = new dyno.DynoFloat({ value: 50.0 });

    const mesh = new SplatMesh({
      url: splatUrl,
      onLoad: () => setIsLoaded(true),
      worldModifier: dyno.dynoBlock(
        { gsplat: dyno.Gsplat },
        { gsplat: dyno.Gsplat },
        ({ gsplat }) => ({
          gsplat: RevealDyno.apply({
            gsplat,
            origin: originUniform,
            revealProgress: revealProgressUniform,
            maxRadius: maxRadiusUniform,
          }).gsplat,
        }),
      ),
    });

    return { originUniform, revealProgressUniform, maxRadiusUniform, mesh };
  });

  const {
    originUniform,
    revealProgressUniform,
    maxRadiusUniform,
    mesh: splat,
  } = data;

  const originUniformRef = useRef(originUniform);

  // Update origin uniform when worldAnchorPosition changes
  useEffect(() => {
    if (worldAnchorPosition) {
      originUniformRef.current.value.copy(worldAnchorPosition);
    }
  }, [worldAnchorPosition]);

  useFrame(() => {
    if (splat) {
      // Sync origin uniform with player position
      if (characterStatus?.position) {
        // If we haven't started yet, we might want to stick closer to spawn
        // to avoid jumping to a stale position from the previous world.
        if (!animationStarted) {
          const distToSpawn = worldAnchorPosition
            ? characterStatus.position.distanceTo(worldAnchorPosition)
            : 0;

          if (distToSpawn < 20.0) {
            originUniformRef.current.value.copy(characterStatus.position);
          } else if (worldAnchorPosition) {
            originUniformRef.current.value.copy(worldAnchorPosition);
          }
        } else {
          // Once animation starts, we follow the player directly
          originUniformRef.current.value.copy(characterStatus.position);
        }
      }

      // Force update to ensure uniforms are applied if needed
      splat.updateVersion();
    }
  });

  // Handle animation lifecycle using useGSAP
  useGSAP(
    (_context, contextSafe) => {
      if (!splat || !isLoaded || animationStarted || !contextSafe) return;

      const startReveal = contextSafe(() => {
        // Ensure origin is as accurate as possible before calculating radius
        if (characterStatus?.position) {
          const distToSpawn = worldAnchorPosition
            ? characterStatus.position.distanceTo(worldAnchorPosition)
            : 0;
          if (distToSpawn < 20.0) {
            originUniform.value.copy(characterStatus.position);
          } else if (worldAnchorPosition) {
            originUniform.value.copy(worldAnchorPosition);
          }
        } else if (worldAnchorPosition) {
          originUniform.value.copy(worldAnchorPosition);
        }

        // Calculate max radius from bounding box relative to current origin
        const box = splat.getBoundingBox();

        let radius = 0;
        if (box.isEmpty()) {
          radius = 100.0;
        } else {
          // Check distance to all 8 corners of the box from our origin
          const corners = [
            new THREE.Vector3(box.min.x, box.min.y, box.min.z),
            new THREE.Vector3(box.min.x, box.min.y, box.max.z),
            new THREE.Vector3(box.min.x, box.max.y, box.min.z),
            new THREE.Vector3(box.min.x, box.max.y, box.max.z),
            new THREE.Vector3(box.max.x, box.min.y, box.min.z),
            new THREE.Vector3(box.max.x, box.min.y, box.max.z),
            new THREE.Vector3(box.max.x, box.max.y, box.min.z),
            new THREE.Vector3(box.max.x, box.max.y, box.max.z),
          ];

          for (const corner of corners) {
            radius = Math.max(radius, originUniform.value.distanceTo(corner));
          }
        }

        if (radius <= 0) {
          radius = 100.0;
        }

        // Add padding to ensure full coverage
        const maxRadius = radius * 1.2;
        maxRadiusUniform.value = maxRadius;

        setAnimationStarted(true);
        revealRef.current.progress = 0;

        // Calculate duration for constant speed reveal
        const EXPANSION_SPEED = 30.0; // meters per second
        const calculatedDuration = maxRadius / EXPANSION_SPEED;
        const duration = Math.max(calculatedDuration, 0.8);

        gsap.to(revealRef.current, {
          progress: 1,
          duration: duration,
          ease: "power2.out",
          onUpdate: () => {
            revealProgressUniform.value = revealRef.current.progress;
          },
        });
      });

      startReveal();
    },
    {
      dependencies: [splat, isLoaded, animationStarted, worldAnchorPosition],
    },
  );

  useEffect(() => {
    return () => {
      splat.dispose();
    };
  }, [splat]);

  return (
    <>
      <primitive object={splat} {...props} />
    </>
  );
};

