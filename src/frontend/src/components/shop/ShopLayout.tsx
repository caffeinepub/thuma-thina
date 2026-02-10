import { ReactNode } from 'react';
import { ShopHeader } from './ShopHeader';
import { ShopFooter } from './ShopFooter';
import { AuthInitializationOverlay } from '@/components/auth/AuthInitializationOverlay';

interface ShopLayoutProps {
  children: ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AuthInitializationOverlay />
      <ShopHeader />
      <main className="flex-1">
        {children}
      </main>
      <ShopFooter />
    </div>
  );
}
