import React from 'react';
import { ShopLayout } from '@/components/shop/ShopLayout';
import { RequireAuth } from '@/components/auth/RequireAuth';
import RequireAdmin from '@/components/auth/RequireAdmin';

// Pages
import { ProvinceListPage } from '@/pages/shop/ProvinceListPage';
import { TownSuburbListPage } from '@/pages/shop/TownSuburbListPage';
import RetailerListPage from '@/pages/shop/RetailerListPage';
import RetailerCatalogPage from '@/pages/shop/RetailerCatalogPage';
import ProductDetailPage from '@/pages/shop/ProductDetailPage';
import CataloguePage from '@/pages/shop/CataloguePage';
import CartPage from '@/pages/shop/CartPage';
import CheckoutPage from '@/pages/shop/CheckoutPage';
import MyOrdersPage from '@/pages/shop/MyOrdersPage';
import OrderDetailPage from '@/pages/shop/OrderDetailPage';
import { JoinUsPage } from '@/pages/shop/JoinUsPage';
import RoleApplicationsStatusPage from '@/pages/shop/RoleApplicationsStatusPage';
import ShopperApplicationPage from '@/pages/shop/ShopperApplicationPage';
import DriverApplicationPage from '@/pages/shop/DriverApplicationPage';
import PickupPointApplicationPage from '@/pages/shop/PickupPointApplicationPage';
import { RequestNewProductPage } from '@/pages/shop/RequestNewProductPage';
import MyTownsPage from '@/pages/shop/MyTownsPage';
import RetailerDashboardPage from '@/pages/shop/RetailerDashboardPage';
import RetailerOrderTrackingPage from '@/pages/shop/RetailerOrderTrackingPage';
import { MasterAdminRoleApplicationsPage } from '@/pages/shop/MasterAdminRoleApplicationsPage';

// Shopper dashboard
import ShopperDashboardPage from '@/pages/shop/ShopperDashboardPage';
import { RequireApprovedShopper } from '@/components/auth/RequireApprovedShopper';

// Driver dashboard
import DriverDashboardPage from '@/pages/shop/DriverDashboardPage';
import { RequireApprovedDriver } from '@/components/auth/RequireApprovedDriver';

// Pickup point dashboard
import PickupPointDashboardPage from '@/pages/shop/PickupPointDashboardPage';
import { RequireApprovedPickupPoint } from '@/components/auth/RequireApprovedPickupPoint';
import { PickupPointShopCataloguePage } from '@/pages/shop/PickupPointShopCataloguePage';
import { PickupPointShopCartPage } from '@/pages/shop/PickupPointShopCartPage';
import { PickupPointShopCheckoutPage } from '@/pages/shop/PickupPointShopCheckoutPage';

// Admin pages
import AdminDashboardPage from '@/pages/shop/AdminDashboardPage';
import AdminProductsPage from '@/pages/admin/AdminProductsPage';
import AdminManageListingsPage from '@/pages/admin/AdminManageListingsPage';
import AdminRetailersPage from '@/pages/admin/AdminRetailersPage';
import AdminOrdersPage from '@/pages/admin/AdminOrdersPage';
import AdminTownsPage from '@/pages/admin/AdminTownsPage';
import AdminShoppersPage from '@/pages/admin/AdminShoppersPage';
import AdminDriversPage from '@/pages/admin/AdminDriversPage';
import AdminPickupPointsPage from '@/pages/admin/AdminPickupPointsPage';
import AdminSettingsPage from '@/pages/admin/AdminSettingsPage';
import { AdminTownApplicationsPage } from '@/pages/admin/AdminTownApplicationsPage';

export function navigate(path: string) {
  window.location.hash = '#' + path;
}

function parseHash(): { path: string; params: Record<string, string> } {
  const hash = window.location.hash.slice(1) || '/';
  const [pathPart, queryPart] = hash.split('?');
  const params: Record<string, string> = {};
  if (queryPart) {
    queryPart.split('&').forEach((pair) => {
      const [key, value] = pair.split('=');
      if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }
  return { path: pathPart || '/', params };
}

function matchRoute(
  pattern: string,
  path: string
): Record<string, string> | null {
  const patternParts = pattern.split('/');
  const pathParts = path.split('/');
  if (patternParts.length !== pathParts.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < patternParts.length; i++) {
    if (patternParts[i].startsWith(':')) {
      params[patternParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patternParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

export default function HashRouter() {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);

  React.useEffect(() => {
    window.addEventListener('hashchange', forceUpdate);
    return () => window.removeEventListener('hashchange', forceUpdate);
  }, []);

  const { path, params: queryParams } = parseHash();

  const routes: Array<{ pattern: string; render: (params: Record<string, string>) => React.ReactNode }> = [
    { pattern: '/', render: () => <ProvinceListPage /> },
    { pattern: '/shop', render: () => <CataloguePage /> },
    { pattern: '/shop/:province', render: (p) => <TownSuburbListPage province={p.province} /> },
    { pattern: '/shop/:province/:town', render: (p) => <RetailerListPage province={p.province} town={p.town} /> },
    { pattern: '/retailer/:retailerId', render: (p) => <RetailerCatalogPage retailerId={p.retailerId} /> },
    { pattern: '/product/:productId', render: (p) => <ProductDetailPage productId={p.productId} /> },
    { pattern: '/catalogue', render: () => <CataloguePage /> },
    { pattern: '/cart', render: () => <CartPage /> },
    {
      pattern: '/checkout',
      render: () => (
        <RequireAuth>
          <CheckoutPage />
        </RequireAuth>
      ),
    },
    {
      pattern: '/my-orders',
      render: () => (
        <RequireAuth>
          <MyOrdersPage />
        </RequireAuth>
      ),
    },
    {
      pattern: '/orders/:orderId',
      render: (p) => (
        <RequireAuth>
          <OrderDetailPage orderId={p.orderId} />
        </RequireAuth>
      ),
    },
    {
      pattern: '/join-us',
      render: () => (
        <RequireAuth>
          <JoinUsPage />
        </RequireAuth>
      ),
    },
    {
      pattern: '/my-applications',
      render: () => (
        <RequireAuth>
          <RoleApplicationsStatusPage />
        </RequireAuth>
      ),
    },
    {
      pattern: '/apply/shopper',
      render: () => (
        <RequireAuth>
          <ShopperApplicationPage />
        </RequireAuth>
      ),
    },
    {
      pattern: '/apply/driver',
      render: () => (
        <RequireAuth>
          <DriverApplicationPage />
        </RequireAuth>
      ),
    },
    {
      pattern: '/apply/pickup-point',
      render: () => (
        <RequireAuth>
          <PickupPointApplicationPage />
        </RequireAuth>
      ),
    },
    {
      pattern: '/request-product',
      render: () => (
        <RequireAuth>
          <RequestNewProductPage />
        </RequireAuth>
      ),
    },
    {
      pattern: '/my-towns',
      render: () => (
        <RequireAuth>
          <MyTownsPage />
        </RequireAuth>
      ),
    },
    {
      pattern: '/retailer-dashboard',
      render: () => (
        <RequireAuth>
          <RetailerDashboardPage />
        </RequireAuth>
      ),
    },
    {
      pattern: '/retailer-orders',
      render: () => (
        <RequireAuth>
          <RetailerOrderTrackingPage />
        </RequireAuth>
      ),
    },
    {
      pattern: '/shopper-dashboard',
      render: () => (
        <RequireAuth>
          <RequireApprovedShopper>
            <ShopperDashboardPage />
          </RequireApprovedShopper>
        </RequireAuth>
      ),
    },
    {
      pattern: '/driver-dashboard',
      render: () => (
        <RequireAuth>
          <RequireApprovedDriver>
            <DriverDashboardPage />
          </RequireApprovedDriver>
        </RequireAuth>
      ),
    },
    {
      pattern: '/pickup-point-dashboard',
      render: () => (
        <RequireAuth>
          <RequireApprovedPickupPoint>
            <PickupPointDashboardPage />
          </RequireApprovedPickupPoint>
        </RequireAuth>
      ),
    },
    {
      pattern: '/pickup-point/shop',
      render: () => (
        <RequireAuth>
          <RequireApprovedPickupPoint>
            <PickupPointShopCataloguePage />
          </RequireApprovedPickupPoint>
        </RequireAuth>
      ),
    },
    {
      pattern: '/pickup-point/cart',
      render: () => (
        <RequireAuth>
          <RequireApprovedPickupPoint>
            <PickupPointShopCartPage />
          </RequireApprovedPickupPoint>
        </RequireAuth>
      ),
    },
    {
      pattern: '/pickup-point/checkout',
      render: () => (
        <RequireAuth>
          <RequireApprovedPickupPoint>
            <PickupPointShopCheckoutPage />
          </RequireApprovedPickupPoint>
        </RequireAuth>
      ),
    },
    {
      pattern: '/master-admin/applications',
      render: () => (
        <RequireAuth>
          <RequireAdmin>
            <MasterAdminRoleApplicationsPage />
          </RequireAdmin>
        </RequireAuth>
      ),
    },
    // Admin routes
    { pattern: '/admin', render: () => <AdminDashboardPage /> },
    {
      pattern: '/admin/products',
      render: () => (
        <RequireAdmin>
          <AdminProductsPage />
        </RequireAdmin>
      ),
    },
    {
      pattern: '/admin/listings',
      render: () => (
        <RequireAdmin>
          <AdminManageListingsPage />
        </RequireAdmin>
      ),
    },
    {
      pattern: '/admin/retailers',
      render: () => (
        <RequireAdmin>
          <AdminRetailersPage />
        </RequireAdmin>
      ),
    },
    {
      pattern: '/admin/orders',
      render: () => (
        <RequireAdmin>
          <AdminOrdersPage />
        </RequireAdmin>
      ),
    },
    {
      pattern: '/admin/towns',
      render: () => (
        <RequireAdmin>
          <AdminTownsPage />
        </RequireAdmin>
      ),
    },
    {
      pattern: '/admin/shoppers',
      render: () => (
        <RequireAdmin>
          <AdminShoppersPage />
        </RequireAdmin>
      ),
    },
    {
      pattern: '/admin/drivers',
      render: () => (
        <RequireAdmin>
          <AdminDriversPage />
        </RequireAdmin>
      ),
    },
    {
      pattern: '/admin/pickup-points',
      render: () => (
        <RequireAdmin>
          <AdminPickupPointsPage />
        </RequireAdmin>
      ),
    },
    {
      pattern: '/admin/settings',
      render: () => (
        <RequireAdmin>
          <AdminSettingsPage />
        </RequireAdmin>
      ),
    },
    {
      pattern: '/admin/town-applications',
      render: () => (
        <RequireAdmin>
          <AdminTownApplicationsPage />
        </RequireAdmin>
      ),
    },
  ];

  let renderedContent: React.ReactNode = null;

  for (const route of routes) {
    const routeParams = matchRoute(route.pattern, path);
    if (routeParams !== null) {
      renderedContent = route.render({ ...routeParams, ...queryParams });
      break;
    }
  }

  if (renderedContent === null) {
    renderedContent = <ProvinceListPage />;
  }

  return <ShopLayout>{renderedContent}</ShopLayout>;
}
