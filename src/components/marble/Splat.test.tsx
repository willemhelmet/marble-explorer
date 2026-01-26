/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { Splat } from './Splat';
import { useMyStore } from '../../store/store';
import { RevealDyno } from '../../dynos/revealDyno';
import { useFrame } from '@react-three/fiber';

// Spy on constructor
const splatMeshConstructorSpy = vi.fn();

// Spy on setUniform
const setUniformSpy = vi.fn();
vi.mock('../../dynos/revealDyno', () => ({
  RevealDyno: {
    setUniform: (name: string, val: any) => setUniformSpy(name, val)
  }
}));

// Mock bvhecctrl
vi.mock('bvhecctrl', () => ({
  characterStatus: {
    position: { x: 10, y: 20, z: 30 }
  }
}));

vi.mock('@sparkjsdev/spark', async () => {
  return {
    SplatMesh: class {
      constructor(options: any) {
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

vi.mock('../../store/store', () => ({
  useMyStore: vi.fn()
}));

vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
  useThree: vi.fn(() => ({ camera: {} })),
  extend: vi.fn(),
}));

vi.mock('react', async () => {
    const actual = await vi.importActual('react');
    return {
        ...actual,
    };
});

describe('Splat Component', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize SplatMesh with RevealDyno', () => {
    (useMyStore as any).mockReturnValue({ splatUrl: 'test.splat' });
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Splat />);
    expect(splatMeshConstructorSpy).toHaveBeenCalledWith(expect.objectContaining({
      url: 'test.splat',
      dynos: expect.arrayContaining([expect.anything()]) 
    }));
    consoleErrorSpy.mockRestore();
  });

  it('should sync RevealDyno uniforms on frame update', () => {
    (useMyStore as any).mockReturnValue({ splatUrl: 'test.splat' });
    
    // Capture useFrame callback
    let frameCallback: (state: any) => void = () => {};
    (useFrame as any).mockImplementation((cb: any) => {
        frameCallback = cb;
    });

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<Splat />);

    // Simulate frame
    frameCallback({ clock: { getElapsedTime: () => 1 } });

    // Expect origin to be synced with characterStatus (10, 20, 30)
    expect(setUniformSpy).toHaveBeenCalledWith('origin', expect.any(Object)); 
    
    const lastCall = setUniformSpy.mock.calls.find(c => c[0] === 'origin');
    expect(lastCall).toBeDefined();
    const val = lastCall[1];
    
    if (Array.isArray(val)) {
        expect(val).toEqual([10, 20, 30]);
    } else {
        expect(val.x).toBe(10);
        expect(val.y).toBe(20);
        expect(val.z).toBe(30);
    }
    
    consoleErrorSpy.mockRestore();
  });
});
