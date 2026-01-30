import { type WorldAssets } from "../store/worldSlice";

const SERVER_API_BASE = "https://marble-explorer.rcdis.co/api";

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
}

interface MediaAssetPrepareUploadResponse {
  media_asset: MediaAsset;
  upload_info: UploadInfo;
}

/**
 * Uploads a media asset to the Marble API in two steps:
 * 1. Prepare upload (get signed URL) via server proxy.
 * 2. Upload file content to signed URL (direct to storage).
 */
export async function uploadMediaAsset(
  file: File | Blob,
  fileName: string,
  kind: MediaAssetKind,
): Promise<string> {
  const extension = fileName.split(".").pop() || "jpg";

  // 1. Prepare Upload via Server Proxy
  const prepareUrl = `${SERVER_API_BASE}/media-assets/prepare_upload`;
  const preparePayload: MediaAssetPrepareUploadRequest = {
    file_name: fileName,
    extension: extension,
    kind: kind,
  };

  const prepareRes = await fetch(prepareUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preparePayload),
  });

  if (!prepareRes.ok) {
    throw new Error(`Failed to prepare upload: ${prepareRes.statusText}`);
  }

  const prepareData: MediaAssetPrepareUploadResponse = await prepareRes.json();
  const { media_asset, upload_info } = prepareData;

  // 2. Upload to Signed URL (Direct to storage, bypasses server)
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
): Promise<GetOperationResponse<World>> => {
  let mediaAssetId: string | undefined;

  if (options.image) {
    mediaAssetId = await uploadMediaAsset(
      options.image,
      options.image.name,
      "image",
    );
  }

  const generateUrl = `${SERVER_API_BASE}/worlds/generate`;
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
    generatePayload.world_prompt.text_prompt =
      options.prompt || "A beautiful landscape";
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
