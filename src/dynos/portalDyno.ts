import { dyno } from "@sparkjsdev/spark";

/**
 * Procedural Splat Portal Dyno.
 * Multiplies the splat's base color by the provided status color (dynoVec3) uniform.
 */
export const PortalDyno = new dyno.Dyno({
  inTypes: { gsplat: dyno.Gsplat, color: "vec3" },
  outTypes: { gsplat: dyno.Gsplat },
  globals: () => [dyno.defineGsplat],
  statements: ({ inputs, outputs }) =>
    dyno.unindentLines(`
      ${outputs.gsplat} = ${inputs.gsplat};
      ${outputs.gsplat}.rgba.rgb *= ${inputs.color};
    `),
});