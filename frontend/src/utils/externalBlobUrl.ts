import type { ExternalBlob } from '@/backend';

/**
 * Safely extract a displayable URL from an ExternalBlob
 * @param blob - ExternalBlob instance or null/undefined
 * @returns URL string or empty string if invalid
 */
export function getExternalBlobUrl(blob: ExternalBlob | null | undefined): string {
  if (!blob) return '';
  
  try {
    return blob.getDirectURL();
  } catch (error) {
    console.error('Failed to get blob URL:', error);
    return '';
  }
}
