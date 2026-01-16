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

const proxyUrl = (url: string): string => {
  if (url.includes("cdn.marble.worldlabs.ai")) {
    return url.replace(/^https?:\/\/cdn\.marble\.worldlabs\.ai/, "/cdn-proxy");
  }
  return url;
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

    if (
      !data.world.assets ||
      !data.world.assets.splats ||
      !data.world.assets.splats.spz_urls
    ) {
      throw new Error("Invalid API Response: Missing assets");
    }

    // Removed full_res, default to 500k, then 100k
    const splatUrl =
      // data.world.assets.splats.spz_urls.full_res ||
      data.world.assets.splats.spz_urls["500k"] ||
      data.world.assets.splats.spz_urls["100k"];

    if (!splatUrl) {
      throw new Error("No Gaussian Splat URL found in response");
    }

    return {
      splatUrl: proxyUrl(splatUrl),
      meshUrl: proxyUrl(data.world.assets.mesh?.collider_mesh_url || ""),
      panoUrl: proxyUrl(data.world.assets.imagery?.pano_url || ""),
    };
  } catch (err) {
    console.error("Fetch World Assets Error:", err);
    throw err;
  }
};

// --- Media Asset Upload Interfaces ---
export type MediaAssetKind = "image" | "video";

interface MediaAssetPrepareUploadRequest {
  file_name: string;
  extension: string;
  kind: MediaAssetKind;
}

interface UploadInfo {
  upload_url: string;
  upload_method: string;
  required_headers: Record<string, string>;
}

interface MediaAsset {
  id: string;
  // ... other media asset properties if known
}

interface MediaAssetPrepareUploadResponse {
  media_asset: MediaAsset;
  upload_info: UploadInfo;
}

/**
 * Uploads a media asset to the Marble API in two steps:
 * 1. Prepare upload (get signed URL).
 * 2. Upload file content to signed URL.
 */
export async function uploadMediaAsset(
  file: File | Blob,
  fileName: string,
  kind: MediaAssetKind,
  providedApiKey?: string | null,
): Promise<string> {
  const apiKey = providedApiKey || import.meta.env.VITE_MARBLE_API_KEY;
  const extension = fileName.split(".").pop() || "jpg";

  // 1. Prepare Upload
  const prepareUrl = `${API_BASE_URL}/media-assets:prepare_upload`;
  const preparePayload: MediaAssetPrepareUploadRequest = {
    file_name: fileName,
    extension: extension,
    kind: kind,
  };

  const prepareRes = await fetch(prepareUrl, {
    method: "POST",
    headers: {
      "WLT-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preparePayload),
  });

  if (!prepareRes.ok) {
    throw new Error(`Failed to prepare upload: ${prepareRes.statusText}`);
  }

  const prepareData: MediaAssetPrepareUploadResponse = await prepareRes.json();
  const { media_asset, upload_info } = prepareData;

  // 2. Upload to Signed URL
  const uploadRes = await fetch(upload_info.upload_url, {
    method: upload_info.upload_method,
    headers: {
      ...upload_info.required_headers,
    },
    body: file,
  });

  if (!uploadRes.ok) {
    throw new Error(
      `Failed to upload media asset to storage: ${uploadRes.statusText}`,
    );
  }

  return media_asset.id;
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
  source: "media_asset";
  media_asset_id: string;
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
  providedApiKey?: string | null,
): Promise<GetOperationResponse<World>> => {
  const apiKey = providedApiKey || import.meta.env.VITE_MARBLE_API_KEY;
  let mediaAssetId: string | undefined;

  if (!apiKey) {
    throw new Error("Missing Marble API Key.");
  }

  if (options.image) {
    mediaAssetId = await uploadMediaAsset(
      options.image,
      options.image.name,
      "image",
      apiKey,
    );
  }

  const generateUrl = `${API_BASE_URL}/worlds:generate`;
  const generatePayload: GenerateWorldRequest = {
    display_name: options.displayName || options.image?.name || "New World",
    model: "Marble 0.1-plus",
    world_prompt: {
      type: "text", // Default to text
      text_prompt: options.prompt || "A beautiful landscape",
    },
  };

  if (mediaAssetId) {
    generatePayload.world_prompt = {
      type: "image",
      image_prompt: {
        source: "media_asset",
        media_asset_id: mediaAssetId,
      },
      text_prompt: options.prompt || undefined,
      is_pano: false,
    };
  } else {
    // Already set as text type, just ensure prompt is there
    generatePayload.world_prompt.text_prompt =
      options.prompt || "A beautiful landscape";
  }

  const res = await fetch(generateUrl, {
    method: "POST",
    headers: {
      "WLT-Api-Key": apiKey,
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

export interface GetOperationResponse<T = any> {
  operation_id: string;
  done: boolean;
  created_at?: string | null;
  updated_at?: string | null;
  expires_at?: string | null;
  metadata?: Record<string, any> | null;
  response?: T | null;
  error?: OperationError | null;
}

/**
 * Fetches the status and result of a long-running operation (e.g., world generation, media asset processing).
 * Poll this endpoint to check the status of a long-running operation.
 *
 * @param operationId - The operation ID
 * @returns Operation object with status, result, or error
 * @throws Error if the operation is not found or API request fails
 */
export const getOperation = async <T = any>(
  operationId: string,
  providedApiKey?: string | null,
): Promise<GetOperationResponse<T>> => {
  const apiKey = providedApiKey || import.meta.env.VITE_MARBLE_API_KEY;

  if (!apiKey) {
    throw new Error("Missing Marble API Key.");
  }

  const response = await fetch(`${API_BASE_URL}/operations/${operationId}`, {
    method: "GET",
    headers: {
      "WLT-Api-Key": apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("Operation not found");
    }
    if (response.status === 401) {
      throw new Error("Unauthorized: Invalid API Key");
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return await response.json();
};
