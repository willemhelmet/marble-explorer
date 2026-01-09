import { useMemo, useRef } from "react";
import { ScreenSpace, Plane } from "@react-three/drei";
import { Mesh, ShaderMaterial, Color } from "three";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useMyStore } from "../../store/store";

export const Crosshair = () => {
  const meshRef = useRef<Mesh>(null);
  const materialRef = useRef<ShaderMaterial>(null);

  const status = useMyStore((state) => state.status);
  const isHovered = useMyStore((state) => state.isHovered);
  const visible = status === "playing" && isHovered;

  const uniforms = useMemo(
    () => ({
      u_color: { value: new Color(1, 1, 1) },
      u_radius: { value: 0.15 },
      u_stroke: { value: 0.05 },
    }),
    [],
  );

  useGSAP(() => {
    if (!meshRef.current) return;

    if (visible) {
      gsap.to(meshRef.current.scale, {
        x: 1,
        y: 1,
        duration: 0.1,
        ease: "back.out(1.7)",
      });
    } else {
      gsap.to(meshRef.current.scale, {
        x: 0,
        y: 0,
        duration: 0.1,
        ease: "power2.in",
      });
    }
  }, [visible]);

  const vertexShader = `
    varying vec2 v_uv;
    void main() {
      v_uv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
    }
  `;

  const fragmentShader = `
    uniform vec3 u_color;
    uniform float u_radius;
    uniform float u_stroke;
    varying vec2 v_uv;
    void main() {
      float dist = distance(v_uv, vec2(0.5));
      // Calculate signed distance for a ring
      float d = abs(dist - u_radius);
      // Smooth anti-aliased edge
      float ring = smoothstep(u_stroke, u_stroke - 0.01, d);
      
      gl_FragColor = vec4(u_color, ring);
    }
  `;

  return (
    <ScreenSpace depth={1}>
      <Plane
        ref={meshRef}
        args={[0.05, 0.05]}
        scale={[0, 0, 0]}
        raycast={() => null} // Prevent blocking raycasts for portals
      >
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent={true}
          depthTest={false}
          depthWrite={false}
        />
      </Plane>
    </ScreenSpace>
  );
};
