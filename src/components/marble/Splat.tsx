import { useEffect, useMemo, useRef, useState } from "react";
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

  console.log(
    `[Splat] Render. url: ${splatUrl}, anchor: ${worldAnchorPosition?.x}, ${worldAnchorPosition?.y}, ${worldAnchorPosition?.z}`,
  );

  const revealRef = useRef({ progress: 0 });
  const [animationStarted, setAnimationStarted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Create uniforms
  const originUniform = useMemo(
    () =>
      new dyno.DynoVec3({
        value: worldAnchorPosition
          ? worldAnchorPosition.clone()
          : new THREE.Vector3(0, 0, 0),
      }),
    [worldAnchorPosition],
  );
  const revealProgressUniform = useMemo(
    () => new dyno.DynoFloat({ value: 0.0 }),
    [],
  );
  const maxRadiusUniform = useMemo(
    () => new dyno.DynoFloat({ value: 50.0 }),
    [],
  );

  // 1. Use useMemo to create the mesh synchronously
  const splat = useMemo(() => {
    if (!splatUrl) return null;
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
    return mesh;
  }, [splatUrl, originUniform, revealProgressUniform, maxRadiusUniform]);

  // Handle animation lifecycle using useGSAP
  useGSAP(
    (_context, contextSafe) => {
      if (!splat || !isLoaded || animationStarted || !contextSafe) return;

      const startReveal = contextSafe(() => {
        console.log("Splat initialized, starting reveal...");

        // Calculate max radius from bounding box
        const box = splat.getBoundingBox();
        console.log(
          `[Splat] Bounding Box - Min: ${box.min.x},${box.min.y},${box.min.z}, Max: ${box.max.x},${box.max.y},${box.max.z}`,
        );

        const sphere = new THREE.Sphere();
        box.getBoundingSphere(sphere);

        let radius = sphere.radius;
        if (radius <= 0) {
          console.warn(
            `[Splat] Calculated invalid radius (${radius}), falling back to 100.0`,
          );
          radius = 100.0;
        }

        // Add a bit of padding to ensure full coverage
        const maxRadius = radius * 1.5;
        console.log(`Calculated splat max radius: ${maxRadius}`);
        maxRadiusUniform.value = maxRadius;

        console.log(
          `Locking splat reveal origin at: x=${originUniform.value.x}, y=${originUniform.value.y}, z=${originUniform.value.z}`,
        );

        setAnimationStarted(true);
        revealRef.current.progress = 0;

        // Calculate duration for constant speed reveal
        const EXPANSION_SPEED = 3.0; // meters per second
        const calculatedDuration = maxRadius / EXPANSION_SPEED;
        const duration = Math.max(calculatedDuration, 0.8); // At least 0.8s for visual feedback

        console.log(
          `Starting reveal animation with duration: ${duration.toFixed(2)}s (Speed: ${EXPANSION_SPEED}m/s)`,
        );

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
      dependencies: [
        splat,
        isLoaded,
        animationStarted,
        revealProgressUniform,
        originUniform,
        maxRadiusUniform,
      ],
    },
  );

  useFrame(() => {
    if (splat) {
      // Sync origin uniform until animation starts
      if (!animationStarted && characterStatus?.position) {
        // Only use character position if it is reasonably close to the spawn point
        // This filters out frames where the physics engine hasn't teleported the player yet
        const distToSpawn = worldAnchorPosition
          ? characterStatus.position.distanceTo(worldAnchorPosition)
          : 0;

        if (distToSpawn < 10.0) {
          originUniform.value.copy(characterStatus.position);
        } else {
          // Fallback to anchor position if player is too far (likely stale position)
          if (worldAnchorPosition) {
            console.log(
              "Player too far from anchor, using anchor:",
              worldAnchorPosition,
            );
            originUniform.value.copy(worldAnchorPosition);
          }
        }
      }

      // Force update to ensure uniforms are applied if needed
      if ((splat as any).updateVersion) {
        (splat as any).updateVersion();
      }
    }
  });

  // 2. Important: Cleanup memory when the component unmounts or url changes
  useEffect(() => {
    return () => {
      splat?.dispose();
    };
  }, [splat]);

  if (!splat) return null;

  return (
    <>
      <primitive object={splat} {...props} />
    </>
  );
};
