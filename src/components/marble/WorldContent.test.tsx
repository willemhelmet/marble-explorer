/**
 * @vitest-environment happy-dom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, cleanup } from '@testing-library/react';
import { WorldContent } from './WorldContent';
import { Vector3, Euler } from 'three';

// Mock components
vi.mock('./Hub', () => ({
  Hub: () => <div data-testid="hub-component" />
}));

vi.mock('./Splat', () => ({
  Splat: () => <div data-testid="splat-component" />
}));

vi.mock('./SparkRenderer', () => ({
  SparkRenderer: ({ children }: { children: React.ReactNode }) => <div data-testid="spark-renderer">{children}</div>
}));

vi.mock('../Portal', () => ({
  Portal: () => <div data-testid="portal-component" />
}));

vi.mock('@react-three/fiber', () => ({
  useThree: vi.fn(() => ({ gl: {} })),
}));

describe('WorldContent Component', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const defaultProps = {
    currentWorldId: 'hub',
    assets: null,
    worldAnchorPos: new Vector3(),
    worldAnchorRot: new Euler(),
    currentWorld: { id: 'hub', portals: [] },
  };

  it('should render Hub component when currentWorldId is hub', () => {
    const { getByTestId, queryByTestId } = render(<WorldContent {...defaultProps} />);
    expect(getByTestId('hub-component')).toBeDefined();
    expect(queryByTestId('splat-component')).toBeNull();
  });

  it('should render Splat component when currentWorldId is not hub', () => {
    const props = {
      ...defaultProps,
      currentWorldId: 'some-other-id',
      assets: { splatUrl: 'test.splat', meshUrl: '', panoUrl: '' },
    };
    const { getByTestId, queryByTestId } = render(<WorldContent {...props} />);
    expect(getByTestId('splat-component')).toBeDefined();
    expect(queryByTestId('hub-component')).toBeNull();
  });
});
