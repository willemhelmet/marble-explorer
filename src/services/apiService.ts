import { type WorldAssets } from "../store/worldSlice";

const SERVER_API_BASE = (import.meta.env.VITE_SERVER_URL || "https://marble-explorer.rcdis.co") + "/api";

// --- Rate Limiting / Retry ---
async function requestWithRetry<T>(
  requestFn: () => Promise<T>,
  maxRetries = 3,
): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn();
    } catch (err: unknown) {
      lastError = err;
      const status = (err as { status?: number }).status;
      if (status === 429 && i < maxRetries - 1) {
        const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
        console.warn(
          `[apiService] Rate limited (429). Retrying in ${delay.toFixed(0)}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

// --- Metadata Cache (immutable world data, safe to cache indefinitely) ---
const metadataCache = new Map<string, unknown>();
const metadataInflight = new Map<string, Promise<unknown>>();

export const fetchWorldMetadata = async (worldId: string): Promise<unknown> => {
  const cached = metadataCache.get(worldId);
  if (cached) return cached;

  const inflight = metadataInflight.get(worldId);
  if (inflight) return inflight;

  const promise = requestWithRetry(async () => {
    const response = await fetch(`${SERVER_API_BASE}/worlds/${worldId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const error = new Error(
        `API Error: ${response.status} ${response.statusText}`,
      );
      (error as unknown as { status: number }).status = response.status;
      throw error;
    }

    return await response.json();
  })
    .then((data) => {
      metadataCache.set(worldId, data);
      metadataInflight.delete(worldId);
      return data;
    })
    .catch((err) => {
      metadataInflight.delete(worldId);
      throw err;
    });

  metadataInflight.set(worldId, promise);
  return promise;
};

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

const proxyUrl = (url: string): string => {
  if (url.includes("cdn.marble.worldlabs.ai")) {
    return url.replace(/^https?:\/\/cdn\.marble\.worldlabs\.ai/, "/cdn-proxy");
  }
  return url;
};

export interface FetchWorldResponse {
  assets: WorldAssets;
  displayName: string;
}

export const fetchWorldAssets = async (
  urlOrId: string,
): Promise<FetchWorldResponse> => {
  const worldId = extractWorldIdFromUrl(urlOrId);
  if (!worldId) {
    throw new Error("Invalid Marble URL or World ID.");
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await fetchWorldMetadata(worldId);

    if (!data.assets || !data.assets.splats || !data.assets.splats.spz_urls) {
      throw new Error("Invalid API Response: Missing assets");
    }

    const splatUrl =
      data.assets.splats.spz_urls["500k"] ||
      data.assets.splats.spz_urls["100k"];

    if (!splatUrl) {
      throw new Error("No Gaussian Splat URL found in response");
    }

    return {
      assets: {
        splatUrl: proxyUrl(splatUrl),
        meshUrl: proxyUrl(data.assets.mesh?.collider_mesh_url || ""),
        panoUrl: proxyUrl(data.assets.imagery?.pano_url || ""),
      },
      displayName: data.display_name || "Untitled World",
    };
  } catch (err) {
    console.error("Fetch World Assets Error:", err);
    throw err;
  }
};

/**
 * Fetches thumbnail URL for a world from cached metadata.
 */
export const fetchWorldThumbnail = async (
  worldId: string,
): Promise<string | null> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await fetchWorldMetadata(worldId);
    return data.assets?.thumbnail_url || data.assets?.imagery?.pano_url || null;
  } catch {
    return null;
  }
};

// --- Base64 Image Helper ---
const MAX_IMAGE_DIMENSION = 1024;
const JPEG_QUALITY = 0.8;

function compressAndEncodeImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > MAX_IMAGE_DIMENSION || height > MAX_IMAGE_DIMENSION) {
        const scale = MAX_IMAGE_DIMENSION / Math.max(width, height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL("image/jpeg", JPEG_QUALITY);
      // Strip the data:image/jpeg;base64, prefix
      resolve(dataUrl.split(",")[1]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };
    img.src = url;
  });
}

// --- World Generation Interfaces ---
export interface World {
  id: string;
  display_name: string;
  world_marble_url: string;
  created_at?: string | null;
  updated_at?: string | null;
}

interface ImagePrompt {
  source: "data_base64";
  data_base64: string;
  extension?: string;
}

interface WorldPrompt {
  type: "text" | "image";
  text_prompt?: string;
  image_prompt?: ImagePrompt;
  is_pano?: boolean;
}

interface GenerateWorldRequest {
  display_name?: string;
  model: string;
  world_prompt: WorldPrompt;
}

export interface GenerateWorldOptions {
  prompt?: string;
  image?: File;
  displayName?: string;
}

export const generateWorld = async (
  options: GenerateWorldOptions,
): Promise<GetOperationResponse<World>> => {
  const generateUrl = `${SERVER_API_BASE}/worlds/generate`;
  const generatePayload: GenerateWorldRequest = {
    display_name: options.displayName || options.image?.name || "New World",
    model: "Marble 0.1-plus",
    world_prompt: {
      type: "text",
      text_prompt: options.prompt || "A beautiful landscape",
    },
  };

  if (options.image) {
    const base64 = await compressAndEncodeImage(options.image);
    generatePayload.world_prompt = {
      type: "image",
      image_prompt: {
        source: "data_base64",
        data_base64: base64,
        extension: "jpg",
      },
      text_prompt: options.prompt || undefined,
      is_pano: false,
    };
  }

  const res = await requestWithRetry(async () => {
    const response = await fetch(generateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(generatePayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const error = new Error(
        `Generation failed: ${response.status} ${errorBody}`,
      );
      (error as unknown as { status: number }).status = response.status;
      throw error;
    }

    return response;
  });

  return await res.json();
};

// --- Operation Interfaces ---
export interface OperationError {
  code?: number | null;
  message?: string | null;
}

export interface GetOperationResponse<T = unknown> {
  operation_id: string;
  done: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  expires_at?: string | null;
  metadata?: Record<string, unknown> | null;
  response?: T | null;
  error?: OperationError | null;
}

/**
 * Fetches the status and result of a long-running operation via server proxy.
 *
 * @param operationId - The operation ID
 * @returns Operation object with status, result, or error
 * @throws Error if the operation is not found or API request fails
 */
export const getOperation = async <T = unknown>(
  operationId: string,
): Promise<GetOperationResponse<T>> => {
  const res = await requestWithRetry(async () => {
    const response = await fetch(
      `${SERVER_API_BASE}/operations/${operationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      const error = new Error(
        `API Error: ${response.status} ${response.statusText}`,
      );
      (error as unknown as { status: number }).status = response.status;
      throw error;
    }

    return response;
  });

  return await res.json();
};

// --- Generate World from Base64 Image (for remix) ---
export interface GenerateWorldFromImageOptions {
  prompt: string;
  imageBase64: string; // raw base64 data (no data URI prefix)
  displayName?: string;
  isPano?: boolean;
}

export const generateWorldFromImage = async (
  options: GenerateWorldFromImageOptions,
): Promise<GetOperationResponse<World>> => {
  const generateUrl = `${SERVER_API_BASE}/worlds/generate`;
  const generatePayload = {
    display_name: options.displayName || "Remixed World",
    model: "Marble 0.1-plus",
    world_prompt: {
      type: "image" as const,
      text_prompt: options.prompt || undefined,
      image_prompt: {
        source: "data_base64" as const,
        data_base64: options.imageBase64,
        extension: "png",
      },
      is_pano: options.isPano ?? true,
    },
  };

  const res = await requestWithRetry(async () => {
    const response = await fetch(generateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(generatePayload),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const error = new Error(
        `Generation failed: ${response.status} ${errorBody}`,
      );
      (error as unknown as { status: number }).status = response.status;
      throw error;
    }

    return response;
  });

  return await res.json();
};
