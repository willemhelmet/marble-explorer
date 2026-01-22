import { dyno } from "@sparkjsdev/spark";

/**
 * Creates an object modifier block for the Portal's procedural SplatMesh.
 * Multiplies the splat's base color by the provided status color uniform.
 */
export const createPortalDyno = (statusColor: ReturnType<typeof dyno.dynoColor>) => {
  return dyno.dynoBlock(
    { gsplat: dyno.Gsplat }, // input
    { gsplat: dyno.Gsplat }, // output
    ({ gsplat }) => {
      const modifier = new dyno.Dyno({
        inTypes: { gsplat: dyno.Gsplat, color: "vec3" },
        outTypes: { gsplat: dyno.Gsplat },
        globals: () => [dyno.defineGsplat],
        statements: ({ inputs, outputs }) =>
          dyno.unindentLines(`
            ${outputs.gsplat} = ${inputs.gsplat};
            ${outputs.gsplat}.rgba.rgb *= ${inputs.color};
          `),
      });
      gsplat = modifier.apply({ gsplat, color: statusColor }).gsplat;
      return { gsplat };
    },
  );
};
