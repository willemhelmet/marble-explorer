/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
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

// Mock document.fonts
if (typeof (global as any).document !== 'undefined') {
    (global as any).document.fonts = {
        load: vi.fn().mockImplementation((fontStr: string) => {
            if (fontStr.includes('Karrik')) return Promise.resolve([]);
            return Promise.resolve([]);
        }),
    };
}

describe('HubTitle Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call textSplats with "Marble Explorer" after font loads', async () => {
    render(<HubTitle />);
    
    await waitFor(() => {
        expect(textSplatsSpy).toHaveBeenCalledWith(expect.objectContaining({
          text: 'Marble Explorer',
          font: expect.stringContaining('Karrik'),
        }));
    });
  });
});
