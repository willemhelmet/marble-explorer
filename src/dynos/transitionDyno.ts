import { dyno } from "@sparkjsdev/spark";

export const TransitionDyno = new dyno.Dyno({
  inTypes: {
    gsplat: dyno.Gsplat,
    origin: "vec3",
    transitionProgress: "float",
    myIndex: "float",
    hidingIndex: "float",
    showingIndex: "float",
    transitionActive: "float",
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
          float transitionProgress,
          float myIndex,
          float showingIndex,
          float hidingIndex,
          float transitionActive
        ) {
          if (transitionActive < 0.5) {
            return initialColor;
          }

          float dist = distance(pos, origin);
          float radius = transitionProgress * 15.0;
          float glowThickness = 0.5;
          float glow = getSphericalGlow(dist, radius, glowThickness);
          vec3 glowColor = vec3(0.0, 1.0, 1.0); // Cyan

          vec3 finalRgb = initialColor.rgb + (glowColor * glow);

          float visibility = step(dist, radius);

          // Use epsilon for float comparison safety
          float isShowing = step(showingIndex - 0.1, myIndex) * step(myIndex, showingIndex + 0.1);
          float isHiding = step(hidingIndex - 0.1, myIndex) * step(myIndex, hidingIndex + 0.1);

          float finalOpacity = (isShowing * visibility) + (isHiding * (1.0 - visibility));

          return vec4(
            finalRgb,
            initialColor.a * finalOpacity
          );
        }
      vec3 calculateTranslation(
        vec3 pos,
        vec3 origin,
        float transitionProgress
      ) {
        float displacementStrength = 0.2;
        vec3 displacementDirection = normalize(pos - origin + 0.0001);
        float dist = distance(pos, origin);
        float glowThickness = 0.4;
        float radius = transitionProgress * 15.0;
        float glow = getSphericalGlow(dist, radius, glowThickness);
        return pos + (displacementDirection * glow * displacementStrength);
      }

      vec3 calculateScale(
        vec3 pos,
        vec3 scale,
        vec3 origin,
        float transitionProgress
      ) {
        float scaleStrength = 0.02;
        vec3 displacementDirection = normalize(pos - origin + 0.0001);
        float dist = distance(pos, origin);
        float glowThickness = 0.4;
        float radius = transitionProgress * 15.0;
        float glow = getSphericalGlow(dist, radius, glowThickness);
        return scale + (displacementDirection * glow * scaleStrength);
      }
    `),
  ],
  statements: ({ inputs, outputs }) =>
    dyno.unindentLines(`

      ${outputs.gsplat} = ${inputs.gsplat};

      ${outputs.gsplat}.rgba = calculateColor(
        ${inputs.gsplat}.rgba,
        ${inputs.gsplat}.center,
        ${inputs.origin},
        ${inputs.transitionProgress},
        ${inputs.myIndex},
        ${inputs.showingIndex},
        ${inputs.hidingIndex},
        ${inputs.transitionActive}
       );

      ${outputs.gsplat}.center = calculateTranslation(
        ${inputs.gsplat}.center,
        ${inputs.origin},
        ${inputs.transitionProgress}
      );

      ${outputs.gsplat}.scales = calculateScale(
        ${inputs.gsplat}.center,
        ${inputs.gsplat}.scales,
        ${inputs.origin},
        ${inputs.transitionProgress}
      );

    `),
});
