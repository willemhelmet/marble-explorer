/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect } from 'vitest';
import { PortalNoiseDyno } from './portalNoiseDyno';
import { dyno } from "@sparkjsdev/spark";

describe('PortalNoiseDyno', () => {
  it('should be an instance of dyno.Dyno', () => {
    expect(PortalNoiseDyno).toBeInstanceOf(dyno.Dyno);
  });

  it('should have the correct inTypes', () => {
    expect(PortalNoiseDyno).toBeDefined();
  });
});
