/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { Hub } from './Hub';

// Spy on constructor
const splatMeshConstructorSpy = vi.fn();

vi.mock('@sparkjsdev/spark', async () => {
  return {
    SplatMesh: class {
      constructor(options: unknown) {
        splatMeshConstructorSpy(options);
      }
      dispose = vi.fn();
    },
    dyno: {
        Dyno: class {},
        defineGsplat: 'defineGsplat',
        unindent: (s: string) => s,
        unindentLines: (s: string) => s,
        Gsplat: 'Gsplat'
    }
  };
});

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(() => ({ camera: {}, gl: {} })),
  extend: vi.fn(),
}));

describe('Hub Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize SplatMesh with the lobby splat URL', () => {
    render(<Hub />);
    expect(splatMeshConstructorSpy).toHaveBeenCalledWith(expect.objectContaining({
      url: '/marble-explorer-lobby.spz',
    }));
  });
});
