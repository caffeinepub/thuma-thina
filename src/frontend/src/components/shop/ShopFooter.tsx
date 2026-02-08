import { Heart } from 'lucide-react';

export function ShopFooter() {
  return (
    <footer className="border-t border-border/60 bg-gradient-to-b from-card to-muted/30 mt-auto">
      <div className="container-custom py-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>© 2026. Built with</span>
            <Heart className="h-4 w-4 text-accent fill-accent animate-pulse" />
            <span>using</span>
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-primary hover:text-primary/80 transition-colors underline decoration-primary/30 hover:decoration-primary/60"
            >
              caffeine.ai
            </a>
          </div>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            Part of <span className="font-medium text-foreground">Mthandeni umuntu Association (MUA)</span>
          </p>
          <p className="text-xs text-muted-foreground/70 max-w-lg leading-relaxed">
            Platform fees support humanitarian aid and community development
          </p>
        </div>
      </div>
    </footer>
  );
}
