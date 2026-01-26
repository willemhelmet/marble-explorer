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

  const revealRef = useRef({ progress: 0 });
  const [animationStarted, setAnimationStarted] = useState(false);

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
      if (!splat || animationStarted || !contextSafe) return;

      const startReveal = contextSafe(() => {
        console.log("Splat initialized, starting reveal...");

        // Calculate max radius from bounding box
        const box = splat.getBoundingBox();
        const sphere = new THREE.Sphere();
        box.getBoundingSphere(sphere);
        // Add a bit of padding to ensure full coverage
        const maxRadius = sphere.radius * 1.2;
        console.log(`Calculated splat max radius: ${maxRadius}`);
        maxRadiusUniform.value = maxRadius;

        // Log the final locked origin for debugging
        console.log(
          `Locking splat reveal origin at: x=${originUniform.value.x}, y=${originUniform.value.y}, z=${originUniform.value.z}`,
        );

        setAnimationStarted(true);
        revealRef.current.progress = 0;

        gsap.to(revealRef.current, {
          progress: 1,
          duration: 2.0,
          ease: "power2.out",
          onUpdate: () => {
            revealProgressUniform.value = revealRef.current.progress;
          },
        });
      });

      const checkInitialized = setInterval(() => {
        if ((splat as SplatMesh).isInitialized) {
          clearInterval(checkInitialized);
          startReveal();
        }
      }, 100);

      return () => clearInterval(checkInitialized);
    },
    {
      dependencies: [
        splat,
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
            originUniform.value.copy(worldAnchorPosition);
          }
        }
      }

      // Force update to ensure uniforms are applied if needed
      if ((splat as SplatMesh).updateVersion) {
        (splat as SplatMesh).updateVersion();
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
