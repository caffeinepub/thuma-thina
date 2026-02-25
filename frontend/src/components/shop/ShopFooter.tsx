import React from 'react';
import { Heart } from 'lucide-react';

export function ShopFooter() {
  const year = new Date().getFullYear();
  const appId = encodeURIComponent(window.location.hostname || 'thuma-thina');

  return (
    <footer className="border-t border-border bg-muted/30 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/thuma-thina-logo.dim_512x512.png"
              alt="Thuma Thina"
              className="h-6 w-6 rounded object-cover"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
            <span className="font-display font-semibold text-foreground">Thuma Thina</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Community Commerce Platform — Connecting communities across South Africa
          </p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            © {year} Thuma Thina. Built with{' '}
            <Heart className="h-3 w-3 text-red-500 fill-red-500" />{' '}
            using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

export default ShopFooter;
