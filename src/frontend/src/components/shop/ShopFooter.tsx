import { Heart } from 'lucide-react';

export function ShopFooter() {
  return (
    <footer className="border-t border-border bg-card mt-auto">
      <div className="container-custom py-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>© 2026. Built with</span>
            <Heart className="h-4 w-4 text-accent fill-accent" />
            <span>using</span>
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium text-primary hover:underline"
            >
              caffeine.ai
            </a>
          </div>
          <p className="text-xs text-muted-foreground max-w-md">
            Part of Mthandeni umuntu Association (MUA)
          </p>
        </div>
      </div>
    </footer>
  );
}
