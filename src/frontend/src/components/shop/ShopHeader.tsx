import { Button } from '@/components/ui/button';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { LoginButton } from '@/components/auth/LoginButton';
import { useCart } from '@/components/shop/cart/CartProvider';
import { navigate } from '@/router/HashRouter';
import { THEME_ASSETS } from '@/utils/themeAssets';
import { Badge } from '@/components/ui/badge';
import { BrandImage } from '@/components/brand/BrandImage';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useQueries';

export function ShopHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getItemCount } = useCart();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const cartItemCount = getItemCount();
  const { data: isAdmin } = useIsCallerAdmin();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-custom flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <BrandImage
              src={THEME_ASSETS.logo}
              alt="Thuma Thina"
              className="h-10 w-10 rounded-lg"
              fallbackType="logo"
            />
            <span className="font-bold text-xl hidden sm:inline">Thuma Thina</span>
          </button>

          <nav className="hidden md:flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate('/catalogue')}>
              Shop
            </Button>
            <Button variant="ghost" onClick={() => navigate('/join-us')}>
              Join Us
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" onClick={() => navigate('/my-towns')}>
                My Towns
              </Button>
            )}
            {isAuthenticated && (
              <Button variant="ghost" onClick={() => navigate('/retailer-dashboard')}>
                Retailer
              </Button>
            )}
            {isAdmin && (
              <Button variant="ghost" onClick={() => navigate('/admin')}>
                Admin
              </Button>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative" onClick={() => navigate('/cart')}>
            <ShoppingCart className="h-5 w-5" />
            {cartItemCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                {cartItemCount}
              </Badge>
            )}
          </Button>

          <div className="hidden md:block">
            <LoginButton />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container-custom py-4 flex flex-col gap-2">
            <Button variant="ghost" className="justify-start" onClick={() => navigate('/')}>
              Home
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => navigate('/catalogue')}>
              Shop
            </Button>
            <Button variant="ghost" className="justify-start" onClick={() => navigate('/join-us')}>
              Join Us
            </Button>
            {isAuthenticated && (
              <Button variant="ghost" className="justify-start" onClick={() => navigate('/my-towns')}>
                My Towns
              </Button>
            )}
            {isAuthenticated && (
              <Button variant="ghost" className="justify-start" onClick={() => navigate('/retailer-dashboard')}>
                Retailer
              </Button>
            )}
            {isAdmin && (
              <Button variant="ghost" className="justify-start" onClick={() => navigate('/admin')}>
                Admin
              </Button>
            )}
            <div className="pt-2 border-t">
              <LoginButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
