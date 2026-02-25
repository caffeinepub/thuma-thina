import React, { useState } from 'react';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useIsCallerAdmin } from '@/hooks/useQueries';
import { LoginButton } from '@/components/auth/LoginButton';
import { Menu, X, ShoppingCart, User, Shield, Home, Info, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/components/shop/cart/CartProvider';

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
  badge?: string;
}

export default function ShopHeader() {
  const { identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCart();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const publicLinks: NavLink[] = [
    { label: 'Home', href: '#/', icon: <Home className="h-4 w-4" /> },
    { label: 'Shop', href: '#/shop', icon: <ShoppingCart className="h-4 w-4" /> },
  ];

  const authLinks: NavLink[] = identity
    ? [
        { label: 'My Orders', href: '#/my-orders', icon: <User className="h-4 w-4" /> },
        { label: 'Join Us', href: '#/join-us', icon: <Users className="h-4 w-4" /> },
        { label: 'My Applications', href: '#/my-applications', icon: <Info className="h-4 w-4" /> },
      ]
    : [];

  const adminLinks: NavLink[] = isAdmin
    ? [{ label: 'Admin', href: '#/admin', icon: <Shield className="h-4 w-4" />, badge: 'Admin' }]
    : [];

  const allLinks = [...publicLinks, ...authLinks, ...adminLinks];

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-warm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#/" className="flex items-center gap-2 group">
            <img
              src="/assets/generated/thuma-thina-logo.dim_512x512.png"
              alt="Thuma Thina"
              className="h-9 w-9 rounded-lg object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <span className="font-display font-bold text-xl text-foreground group-hover:text-primary transition-colors">
              Thuma Thina
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {allLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                {link.icon}
                {link.label}
                {link.badge && (
                  <Badge variant="secondary" className="text-xs py-0 px-1.5 ml-1">
                    {link.badge}
                  </Badge>
                )}
              </a>
            ))}
          </nav>

          {/* Right side actions */}
          <div className="flex items-center gap-2">
            {/* Cart */}
            <a href="#/cart" className="relative">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </Button>
            </a>

            <LoginButton />

            {/* Mobile menu toggle */}
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border py-3 space-y-1">
            {allLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon}
                {link.label}
                {link.badge && (
                  <Badge variant="secondary" className="text-xs py-0 px-1.5">
                    {link.badge}
                  </Badge>
                )}
              </a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
