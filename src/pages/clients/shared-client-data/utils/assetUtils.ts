// Asset utilities for client management in the Web app
import { ClientAsset } from "../types";

// Type for file validation
type File = {
  size: number;
  type: string;
};

// Asset path utilities
export const getClientAssetPath = (
  clientId: string,
  asset: ClientAsset
): string => {
  return `/clients/${clientId}/assets/${asset.path}`;
};

export const getClientAssetUrl = (
  clientId: string,
  asset: ClientAsset,
  baseUrl?: string
): string => {
  const path = getClientAssetPath(clientId, asset);
  return baseUrl ? `${baseUrl}${path}` : path;
};

// Asset type helpers
export const isImageAsset = (asset: ClientAsset): boolean => {
  return (
    asset.type === "logo" || asset.type === "icon" || asset.type === "image"
  );
};

export const isDocumentAsset = (asset: ClientAsset): boolean => {
  return asset.type === "document";
};

// Asset validation
export const validateAssetFile = (
  file: File
): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/svg+xml",
    "image/webp",
    "application/pdf",
    "text/plain",
  ];

  if (file.size > maxSize) {
    return { valid: false, error: "File size must be less than 5MB" };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "File type not supported" };
  }

  return { valid: true };
};

// Asset optimization helpers
export const getOptimizedImageUrl = (
  clientId: string,
  asset: ClientAsset,
  width?: number,
  height?: number,
  quality?: number
): string => {
  let url = getClientAssetPath(clientId, asset);

  if (width || height || quality) {
    const params = new URLSearchParams();
    if (width) params.set("w", width.toString());
    if (height) params.set("h", height.toString());
    if (quality) params.set("q", quality.toString());

    url += `?${params.toString()}`;
  }

  return url;
};
