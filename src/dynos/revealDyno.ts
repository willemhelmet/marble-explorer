import { dyno } from "@sparkjsdev/spark";

export const RevealDyno = new dyno.Dyno({
  inTypes: {
    gsplat: dyno.Gsplat,
    origin: "vec3",
    revealProgress: "float",
    maxRadius: "float",
  },
  outTypes: { gsplat: dyno.Gsplat },
  globals: () => [
    dyno.defineGsplat,
    dyno.unindent(`
        float getSphericalGlow(float dist, float radius, float thickness) {
          float halfThickness = thickness / 2.0;
          float band = smoothstep(radius - halfThickness, radius, dist) -
                      smoothstep(radius, radius + halfThickness, dist);
          return band;
        }

        vec4 calculateColor(
          vec4 initialColor,
          vec3 pos,
          vec3 origin,
          float revealProgress,
          float radius
        ) {
          // If fully revealed, just return the original color
          if (revealProgress >= 1.0) {
            return initialColor;
          }

          float dist = distance(pos, origin);
          float glowThickness = 0.5;
          float glow = getSphericalGlow(dist, radius, glowThickness);
          vec3 glowColor = vec3(0.0, 1.0, 1.0); // Cyan

          vec3 finalRgb = initialColor.rgb + (glowColor * glow);

          // Visibility: 1.0 if inside radius, 0.0 if outside
          float visibility = step(dist, radius);

          return vec4(
            finalRgb,
            initialColor.a * visibility
          );
        }

      vec3 calculateTranslation(
        vec3 pos,
        vec3 origin,
        float radius
      ) {
        float displacementStrength = 0.2;
        vec3 displacementDirection = normalize(pos - origin);
        float dist = distance(pos, origin);
        float glowThickness = 0.4;
        float glow = getSphericalGlow(dist, radius, glowThickness);
        return pos + (displacementDirection * glow * displacementStrength);
      }

      vec3 calculateScale(
        vec3 pos,
        vec3 scale,
        vec3 origin,
        float radius
      ) {
        float scaleStrength = 0.02;
        vec3 displacementDirection = normalize(pos - origin);
        float dist = distance(pos, origin);
        float glowThickness = 0.4;
        float glow = getSphericalGlow(dist, radius, glowThickness);
        return scale + (displacementDirection * glow * scaleStrength);
      }
    `),
  ],
  statements: ({ inputs, outputs }) =>
    dyno.unindentLines(`

      ${outputs.gsplat} = ${inputs.gsplat};

      float radius = ${inputs.revealProgress} * ${inputs.maxRadius} * 2.5;

      ${outputs.gsplat}.rgba = calculateColor(
        ${inputs.gsplat}.rgba,
        ${inputs.gsplat}.center,
        ${inputs.origin},
        ${inputs.revealProgress},
        radius
       );

      ${outputs.gsplat}.center = calculateTranslation(
        ${inputs.gsplat}.center,
        ${inputs.origin},
        radius
      );

      ${outputs.gsplat}.scales = calculateScale(
        ${inputs.gsplat}.center,
        ${inputs.gsplat}.scales,
        ${inputs.origin},
        radius
      );

    `),
});
