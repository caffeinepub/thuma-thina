import { useState } from 'react';

interface BrandImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackType?: 'logo' | 'hero';
}

/**
 * Reusable image component with graceful error handling.
 * Displays styled fallback placeholders using theme tokens when image loading fails.
 * Use with deployment-safe URLs from themeAssets utility.
 */
export function BrandImage({ src, alt, className = '', fallbackType = 'logo' }: BrandImageProps) {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  if (imageError) {
    if (fallbackType === 'logo') {
      return (
        <div className={`flex items-center justify-center bg-gradient-to-br from-primary to-accent rounded-lg ${className}`}>
          <span className="font-display font-bold text-primary-foreground text-2xl">TT</span>
        </div>
      );
    } else {
      return (
        <div className={`flex items-center justify-center bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 border-2 border-dashed border-border rounded-2xl ${className}`}>
          <div className="text-center p-8">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
              <span className="font-display font-bold text-muted-foreground text-xl">TT</span>
            </div>
            <p className="text-sm text-muted-foreground">Thuma Thina</p>
          </div>
        </div>
      );
    }
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
