/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { HubTitle } from './HubTitle';

// Spy on textSplats
const textSplatsSpy = vi.fn();

vi.mock('@sparkjsdev/spark', async () => {
  return {
    SplatMesh: class {
      constructor(options: unknown) {
        (this as any).options = options;
      }
      dispose = vi.fn();
    },
    textSplats: (args: unknown) => {
        textSplatsSpy(args);
        return { dispose: vi.fn() };
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

describe('HubTitle Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call textSplats with "Marble Explorer"', () => {
    render(<HubTitle />);
    expect(textSplatsSpy).toHaveBeenCalledWith(expect.objectContaining({
      text: 'Marble Explorer',
    }));
  });
});
