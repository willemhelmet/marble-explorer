import { type WorldAssets } from "../store/worldSlice";

const SERVER_API_BASE = (import.meta.env.VITE_SERVER_URL || "https://marble-explorer.rcdis.co") + "/api";

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
    const response = await fetch(`${SERVER_API_BASE}/worlds/${worldId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 401)
        throw new Error("Unauthorized: Invalid API Key on server");
      if (response.status === 404) throw new Error("World not found");
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

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

  const res = await fetch(generateUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(generatePayload),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Generation failed: ${res.status} ${errorBody}`);
  }

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
  const response = await fetch(`${SERVER_API_BASE}/operations/${operationId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Operation not found");
    }
    if (response.status === 401) {
      throw new Error("Unauthorized: Invalid API Key on server");
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};
