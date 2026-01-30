import { describe, it, expect, vi, beforeEach, type Mock } from 'vitest';
import { extractWorldIdFromUrl, fetchWorldAssets } from './apiService';

describe('apiService', () => {
  describe('extractWorldIdFromUrl', () => {
    it('should extract UUID from a standard Marble URL', () => {
      const url = 'https://marble.worldlabs.ai/world/12345678-1234-1234-1234-123456789012';
      expect(extractWorldIdFromUrl(url)).toBe('12345678-1234-1234-1234-123456789012');
    });

    it('should return raw UUID if provided', () => {
      const uuid = '12345678-1234-1234-1234-123456789012';
      expect(extractWorldIdFromUrl(uuid)).toBe(uuid);
    });

    it('should return null for invalid URLs', () => {
      expect(extractWorldIdFromUrl('invalid')).toBe(null);
    });
  });

  describe('fetchWorldAssets', () => {
    beforeEach(() => {
      vi.stubGlobal('fetch', vi.fn());
    });

    it('should fetch world assets and return displayName', async () => {
      const mockResponse = {
        display_name: 'Test World',
        assets: {
          splats: {
            spz_urls: {
              '500k': 'https://cdn.example.com/splat.spz'
            }
          },
          mesh: {
            collider_mesh_url: 'https://cdn.example.com/mesh.glb'
          },
          imagery: {
            pano_url: 'https://cdn.example.com/pano.jpg'
          }
        }
      };

      (fetch as Mock).mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const result = await fetchWorldAssets('12345678-1234-1234-1234-123456789012', 'fake-api-key');
      
      expect(result.displayName).toBe('Test World');
      expect(result.assets.splatUrl).toBe('https://cdn.example.com/splat.spz');
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/worlds/12345678-1234-1234-1234-123456789012'),
        expect.any(Object)
      );
    });
  });
});
