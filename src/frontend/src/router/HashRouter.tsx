import { useEffect, useState } from 'react';
import { ShopLayout } from '@/components/shop/ShopLayout';
import { ProvinceListPage } from '@/pages/shop/ProvinceListPage';
import { CataloguePage } from '@/pages/shop/CataloguePage';
import { CartPage } from '@/pages/shop/CartPage';
import { CheckoutPage } from '@/pages/shop/CheckoutPage';
import { MyOrdersPage } from '@/pages/shop/MyOrdersPage';
import { OrderDetailPage } from '@/pages/shop/OrderDetailPage';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { RequireAdmin } from '@/components/auth/RequireAdmin';
import { AdminDashboardPage } from '@/pages/shop/AdminDashboardPage';
import { JoinUsPage } from '@/pages/shop/JoinUsPage';
import { RoleApplicationsStatusPage } from '@/pages/shop/RoleApplicationsStatusPage';

export function HashRouter() {
  const [currentPath, setCurrentPath] = useState(window.location.hash.slice(1) || '/');

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(window.location.hash.slice(1) || '/');
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderRoute = () => {
    // Admin routes
    if (currentPath === '/admin') {
      return (
        <RequireAuth>
          <RequireAdmin>
            <AdminDashboardPage />
          </RequireAdmin>
        </RequireAuth>
      );
    }

    // Application routes
    if (currentPath === '/join-us') {
      return (
        <RequireAuth>
          <JoinUsPage />
        </RequireAuth>
      );
    }

    if (currentPath === '/my-applications') {
      return (
        <RequireAuth>
          <RoleApplicationsStatusPage />
        </RequireAuth>
      );
    }

    // Shop routes
    if (currentPath === '/catalogue') {
      return <CataloguePage />;
    }

    if (currentPath === '/cart') {
      return <CartPage />;
    }

    if (currentPath === '/checkout') {
      return (
        <RequireAuth>
          <CheckoutPage />
        </RequireAuth>
      );
    }

    if (currentPath === '/my-orders') {
      return (
        <RequireAuth>
          <MyOrdersPage />
        </RequireAuth>
      );
    }

    if (currentPath.startsWith('/order/')) {
      const orderId = parseInt(currentPath.split('/order/')[1]);
      return (
        <RequireAuth>
          <OrderDetailPage orderId={orderId} />
        </RequireAuth>
      );
    }

    // Default route - home page
    return <ProvinceListPage />;
  };

  return <ShopLayout>{renderRoute()}</ShopLayout>;
}

export function navigate(path: string) {
  window.location.hash = path;
}
