import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
import { GlobalErrorBoundary } from './components/errors/GlobalErrorBoundary';
import { CartProvider } from './components/shop/cart/CartProvider';
import { HashRouter } from './router/HashRouter';

export default function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <CartProvider>
          <HashRouter />
          <Toaster />
        </CartProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}
