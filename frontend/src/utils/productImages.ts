import { ExternalBlob } from '../backend';

/**
 * Get the primary image for a product.
 * Priority: preferredImage > first imageRef > null
 */
export function getPrimaryImage(product: {
  preferredImage?: ExternalBlob;
  imageRefs: ExternalBlob[];
}): ExternalBlob | null {
  if (product.preferredImage) {
    return product.preferredImage;
  }
  if (product.imageRefs.length > 0) {
    return product.imageRefs[0];
  }
  return null;
}

/**
 * Get all images for a product (up to 3).
 * Returns preferredImage first if set, then remaining imageRefs.
 */
export function getAllImages(product: {
  preferredImage?: ExternalBlob;
  imageRefs: ExternalBlob[];
}): ExternalBlob[] {
  const images: ExternalBlob[] = [];
  
  if (product.preferredImage) {
    images.push(product.preferredImage);
  }
  
  // Add imageRefs that aren't the preferred image
  for (const imageRef of product.imageRefs) {
    if (images.length >= 3) break;
    // Simple check: if we already have a preferred image, add all imageRefs
    // (backend ensures no duplicates)
    if (!product.preferredImage || imageRef !== product.preferredImage) {
      images.push(imageRef);
    }
  }
  
  return images;
}

/**
 * Get a safe image URL from an ExternalBlob.
 */
export function getImageUrl(blob: ExternalBlob | null): string {
  if (!blob) return '';
  try {
    return blob.getDirectURL();
  } catch (error) {
    console.error('Error getting image URL:', error);
    return '';
  }
}

/**
 * Check if a product can accept more images (max 3).
 */
export function canAddMoreImages(product: {
  imageRefs: ExternalBlob[];
}): boolean {
  return product.imageRefs.length < 3;
}

/**
 * Get the number of remaining image slots.
 */
export function getRemainingImageSlots(product: {
  imageRefs: ExternalBlob[];
}): number {
  return Math.max(0, 3 - product.imageRefs.length);
}
