import { Link, useNavigate } from '@tanstack/react-router';
import { ShoppingBag, Plus, Users, LogIn, LogOut, Shield, AlertCircle } from 'lucide-react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BrandImage } from '../brand/BrandImage';
import { publicAssetUrl } from '../../utils/publicAssetUrl';

export function ShopHeader() {
  const navigate = useNavigate();
  const { identity, login, clear, isLoggingIn, isLoginError, loginError } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();

  const isAuthenticated = !!identity;

  const handleAuthClick = async () => {
    if (isAuthenticated) {
      await clear();
    } else {
      login();
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-card/95 backdrop-blur-md supports-[backdrop-filter]:bg-card/90 shadow-sm">
      <div className="container-custom">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <BrandImage
              src={publicAssetUrl('assets/generated/thuma-thina-logo.dim_512x512.png')}
              alt="Thuma Thina"
              className="h-10 w-10 object-contain transition-transform group-hover:scale-105"
              fallbackType="logo"
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
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAuthClick}
              disabled={isLoggingIn}
              className="hidden sm:inline-flex hover:bg-primary/10 hover:text-primary"
            >
              {isLoggingIn ? (
                'Logging in...'
              ) : isAuthenticated ? (
                <>
                  <LogOut className="h-4 w-4 mr-1.5" />
                  Logout
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Login
                </>
              )}
            </Button>
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate({ to: '/admin' })}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <Shield className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/join' })}
              className="hover:bg-accent/10 hover:text-accent"
            >
              <Users className="h-4 w-4 sm:mr-1.5" />
              <span className="hidden sm:inline">Join Us</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: '/request' })}
              className="hover:bg-secondary/20 hover:text-secondary-foreground"
            >
              <Plus className="h-4 w-4 mr-1.5" />
              <span className="hidden sm:inline">Request Product</span>
              <span className="sm:hidden">Request</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="hover:bg-primary/10 hover:text-primary"
            >
              <Link to="/">
                <ShoppingBag className="h-4 w-4 sm:mr-1.5" />
                <span className="hidden sm:inline">Shop</span>
              </Link>
            </Button>
          </nav>
        </div>
        {isLoginError && loginError && (
          <div className="pb-3">
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Login failed: {loginError.message}. Please try again or reload the page.
              </AlertDescription>
            </Alert>
          </div>
        )}
      </div>
    </header>
  );
}
