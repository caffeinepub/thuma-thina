import { ShopHeader } from './ShopHeader';
import { ShopFooter } from './ShopFooter';

interface ShopLayoutProps {
  children: React.ReactNode;
}

export function ShopLayout({ children }: ShopLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ShopHeader />
      <main className="flex-1">
        {children}
      </main>
      <ShopFooter />
    </div>
  );
}
