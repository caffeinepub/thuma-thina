import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Plus } from 'lucide-react';

export function ShopHeader() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <img 
              src="/assets/generated/thuma-thina-logo.dim_512x512.png" 
              alt="Thuma Thina" 
              className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-foreground">
                Thuma Thina
              </span>
              <span className="text-xs text-muted-foreground hidden sm:block">
                Everything, everywhere, all the time
              </span>
            </div>
          </Link>

          <nav className="flex items-center space-x-2">
            <button
              onClick={() => navigate({ to: '/request' })}
              className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Request Product</span>
              <span className="sm:hidden">Request</span>
            </button>
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <ShoppingBag className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Shop</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
