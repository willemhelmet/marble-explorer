import { type WorldAssets } from "../store/worldSlice";

const API_BASE_URL = "https://api.worldlabs.ai/marble/v1";

/**
 * Extracts the UUID world_id from a Marble URL.
 * Supports standard format: https://marble.worldlabs.ai/world/{uuid}
 */
export const extractWorldIdFromUrl = (url: string): string | null => {
  // If the user pastes a raw UUID, return it
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (uuidRegex.test(url.trim())) {
    return url.trim();
  }

  // Check for the URL pattern
  const match = url.match(/world\/([a-f0-9-]{36})/i);
  return match ? match[1] : null;
};

export const fetchWorldAssets = async (
  urlOrId: string,
  providedApiKey?: string | null,
): Promise<WorldAssets> => {
  const apiKey = providedApiKey || import.meta.env.VITE_MARBLE_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Marble API Key.");
  }

  const worldId = extractWorldIdFromUrl(urlOrId);
  if (!worldId) {
    throw new Error("Invalid Marble URL or World ID.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/worlds/${worldId}`, {
      method: "GET",
      headers: {
        "WLT-Api-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401)
        throw new Error("Unauthorized: Invalid API Key");
      if (response.status === 404) throw new Error("World not found");
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.assets || !data.assets.splats || !data.assets.splats.spz_urls) {
      throw new Error("Invalid API Response: Missing assets");
    }

    // Prefer full_res, fallback to 500k, then 100k
    const splatUrl =
      data.assets.splats.spz_urls.full_res ||
      data.assets.splats.spz_urls["500k"] ||
      data.assets.splats.spz_urls["100k"];

    if (!splatUrl) {
      throw new Error("No Gaussian Splat URL found in response");
    }

    return {
      splatUrl,
      meshUrl: data.assets.mesh?.collider_mesh_url || "",
      panoUrl: data.assets.imagery?.pano_url || "",
    };
  } catch (err) {
    console.error("Fetch World Assets Error:", err);
    throw err;
  }
};
