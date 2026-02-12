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
import { AdminTownsPage } from '@/pages/admin/AdminTownsPage';
import { AdminTownApplicationsPage } from '@/pages/admin/AdminTownApplicationsPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminManageListingsPage } from '@/pages/admin/AdminManageListingsPage';
import { AdminRetailersPage } from '@/pages/admin/AdminRetailersPage';
import { AdminDriversPage } from '@/pages/admin/AdminDriversPage';
import { AdminShoppersPage } from '@/pages/admin/AdminShoppersPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { JoinUsPage } from '@/pages/shop/JoinUsPage';
import { RoleApplicationsStatusPage } from '@/pages/shop/RoleApplicationsStatusPage';
import { ShopperApplicationPage } from '@/pages/shop/ShopperApplicationPage';
import { MyTownsPage } from '@/pages/shop/MyTownsPage';
import { RetailerDashboardPage } from '@/pages/shop/RetailerDashboardPage';
import { RetailerOrderTrackingPage } from '@/pages/shop/RetailerOrderTrackingPage';

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

    if (currentPath === '/admin/towns') {
      return (
        <RequireAuth>
          <RequireAdmin>
            <AdminTownsPage />
          </RequireAdmin>
        </RequireAuth>
      );
    }

    if (currentPath === '/admin/town-applications') {
      return (
        <RequireAuth>
          <RequireAdmin>
            <AdminTownApplicationsPage />
          </RequireAdmin>
        </RequireAuth>
      );
    }

    if (currentPath === '/admin/products') {
      return (
        <RequireAuth>
          <RequireAdmin>
            <AdminProductsPage />
          </RequireAdmin>
        </RequireAuth>
      );
    }

    if (currentPath === '/admin/listings') {
      return (
        <RequireAuth>
          <RequireAdmin>
            <AdminManageListingsPage />
          </RequireAdmin>
        </RequireAuth>
      );
    }

    if (currentPath === '/admin/retailers') {
      return (
        <RequireAuth>
          <RequireAdmin>
            <AdminRetailersPage />
          </RequireAdmin>
        </RequireAuth>
      );
    }

    if (currentPath === '/admin/drivers') {
      return (
        <RequireAuth>
          <RequireAdmin>
            <AdminDriversPage />
          </RequireAdmin>
        </RequireAuth>
      );
    }

    if (currentPath === '/admin/shoppers') {
      return (
        <RequireAuth>
          <RequireAdmin>
            <AdminShoppersPage />
          </RequireAdmin>
        </RequireAuth>
      );
    }

    if (currentPath === '/admin/orders') {
      return (
        <RequireAuth>
          <RequireAdmin>
            <AdminOrdersPage />
          </RequireAdmin>
        </RequireAuth>
      );
    }

    if (currentPath === '/admin/settings') {
      return (
        <RequireAuth>
          <RequireAdmin>
            <AdminSettingsPage />
          </RequireAdmin>
        </RequireAuth>
      );
    }

    // Retailer routes
    if (currentPath === '/retailer') {
      return (
        <RequireAuth>
          <RetailerDashboardPage />
        </RequireAuth>
      );
    }

    if (currentPath === '/retailer/orders') {
      return (
        <RequireAuth>
          <RetailerOrderTrackingPage />
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

    if (currentPath === '/join-us/shopper-application') {
      return (
        <RequireAuth>
          <ShopperApplicationPage />
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

    // User town management
    if (currentPath === '/my-towns') {
      return (
        <RequireAuth>
          <MyTownsPage />
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
