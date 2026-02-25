import React from 'react';
import { ThemeProvider } from 'next-themes';
import { GlobalErrorBoundary } from '@/components/errors/GlobalErrorBoundary';
import HashRouter from '@/router/HashRouter';
import { CartProvider } from '@/components/shop/cart/CartProvider';
import { Toaster } from '@/components/ui/sonner';

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <GlobalErrorBoundary>
        <CartProvider>
          <HashRouter />
          <Toaster richColors position="top-right" />
        </CartProvider>
      </GlobalErrorBoundary>
    </ThemeProvider>
  );
}
