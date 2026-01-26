/**
 * @vitest-environment happy-dom
 */
import { describe, it } from "vitest";

import { dyno } from "@sparkjsdev/spark";

describe('Inspect dyno', () => {
  it('should list keys', () => {
    console.log('Keys in dyno:', Object.keys(dyno));
  });
});
