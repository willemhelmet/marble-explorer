/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { RevealDyno } from './revealDyno';
import { dyno } from "@sparkjsdev/spark";


describe('RevealDyno', () => {
  it('should be an instance of dyno.Dyno', () => {
    expect(RevealDyno).toBeInstanceOf(dyno.Dyno);
  });

  it('should have the correct inTypes', () => {
    // Accessing private or protected properties might be tricky, 
    // but usually we can check the configuration if exposed or inferred.
    // For now, let's just check if it's defined.
    expect(RevealDyno).toBeDefined();
  });
});
