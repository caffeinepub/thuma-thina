/**
 * Constructs deployment-safe URLs for static assets in the public folder.
 * Uses Vite's BASE_URL to ensure assets load correctly in both dev and production (ICP canister) environments.
 */
export function publicAssetUrl(path: string): string {
  // Remove leading slash if present to avoid absolute root paths
  const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
  
  // Get the base URL from Vite's environment (e.g., "/" in dev, "/canister-id/" in production)
  const base = import.meta.env.BASE_URL || '/';
  
  // Ensure base ends with slash
  const baseWithSlash = base.endsWith('/') ? base : `${base}/`;
  
  return `${baseWithSlash}${normalizedPath}`;
}
