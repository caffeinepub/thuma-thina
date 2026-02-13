import { createRouter, createRoute, createRootRoute, RouterProvider, Outlet } from '@tanstack/react-router';
import { ProvinceListPage } from '@/pages/shop/ProvinceListPage';
import { CataloguePage } from '@/pages/shop/CataloguePage';
import { CartPage } from '@/pages/shop/CartPage';
import { CheckoutPage } from '@/pages/shop/CheckoutPage';
import { MyOrdersPage } from '@/pages/shop/MyOrdersPage';
import { OrderDetailPage } from '@/pages/shop/OrderDetailPage';
import { MyTownsPage } from '@/pages/shop/MyTownsPage';
import { JoinUsPage } from '@/pages/shop/JoinUsPage';
import { RoleApplicationsStatusPage } from '@/pages/shop/RoleApplicationsStatusPage';
import { ShopperApplicationPage } from '@/pages/shop/ShopperApplicationPage';
import { PickupPointApplicationPage } from '@/pages/shop/PickupPointApplicationPage';
import { DriverApplicationPage } from '@/pages/shop/DriverApplicationPage';
import { ShopperDashboardPage } from '@/pages/shop/ShopperDashboardPage';
import { DriverDashboardPage } from '@/pages/shop/DriverDashboardPage';
import { RetailerDashboardPage } from '@/pages/shop/RetailerDashboardPage';
import { RetailerOrderTrackingPage } from '@/pages/shop/RetailerOrderTrackingPage';
import { AdminDashboardPage } from '@/pages/shop/AdminDashboardPage';
import { AdminRetailersPage } from '@/pages/admin/AdminRetailersPage';
import { AdminProductsPage } from '@/pages/admin/AdminProductsPage';
import { AdminManageListingsPage } from '@/pages/admin/AdminManageListingsPage';
import { AdminOrdersPage } from '@/pages/admin/AdminOrdersPage';
import { AdminTownsPage } from '@/pages/admin/AdminTownsPage';
import { AdminTownApplicationsPage } from '@/pages/admin/AdminTownApplicationsPage';
import { AdminShoppersPage } from '@/pages/admin/AdminShoppersPage';
import { AdminDriversPage } from '@/pages/admin/AdminDriversPage';
import { AdminPickupPointsPage } from '@/pages/admin/AdminPickupPointsPage';
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage';
import { RequireAuth } from '@/components/auth/RequireAuth';
import { RequireAdmin } from '@/components/auth/RequireAdmin';
import { RequireApprovedShopper } from '@/components/auth/RequireApprovedShopper';
import { RequireApprovedDriver } from '@/components/auth/RequireApprovedDriver';
import { ShopLayout } from '@/components/shop/ShopLayout';

const rootRoute = createRootRoute({
  component: () => (
    <ShopLayout>
      <Outlet />
    </ShopLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ProvinceListPage,
});

const catalogueRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/catalogue',
  component: CataloguePage,
});

const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPage,
});

const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: () => (
    <RequireAuth>
      <CheckoutPage />
    </RequireAuth>
  ),
});

const myOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-orders',
  component: () => (
    <RequireAuth>
      <MyOrdersPage />
    </RequireAuth>
  ),
});

const orderDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order/$orderId',
  component: function OrderDetailRouteComponent() {
    const { orderId } = orderDetailRoute.useParams();
    return (
      <RequireAuth>
        <OrderDetailPage orderId={Number(orderId)} />
      </RequireAuth>
    );
  },
});

const myTownsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-towns',
  component: () => (
    <RequireAuth>
      <MyTownsPage />
    </RequireAuth>
  ),
});

const joinUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join-us',
  component: JoinUsPage,
});

const myApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-applications',
  component: () => (
    <RequireAuth>
      <RoleApplicationsStatusPage />
    </RequireAuth>
  ),
});

const shopperApplicationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join-us/shopper-application',
  component: () => (
    <RequireAuth>
      <ShopperApplicationPage />
    </RequireAuth>
  ),
});

const pickupPointApplicationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join-us/pickup-point-application',
  component: () => (
    <RequireAuth>
      <PickupPointApplicationPage />
    </RequireAuth>
  ),
});

const driverApplicationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join-us/driver-application',
  component: () => (
    <RequireAuth>
      <DriverApplicationPage />
    </RequireAuth>
  ),
});

const shopperDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shopper-dashboard',
  component: () => (
    <RequireAuth>
      <RequireApprovedShopper>
        <ShopperDashboardPage />
      </RequireApprovedShopper>
    </RequireAuth>
  ),
});

const driverDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/driver-dashboard',
  component: () => (
    <RequireAuth>
      <RequireApprovedDriver>
        <DriverDashboardPage />
      </RequireApprovedDriver>
    </RequireAuth>
  ),
});

const retailerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/retailer-dashboard',
  component: () => (
    <RequireAuth>
      <RetailerDashboardPage />
    </RequireAuth>
  ),
});

const retailerOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/retailer-orders',
  component: () => (
    <RequireAuth>
      <RetailerOrderTrackingPage />
    </RequireAuth>
  ),
});

const adminDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminDashboardPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminRetailersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/retailers',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminRetailersPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminProductsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/products',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminProductsPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/listings',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminManageListingsPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminOrdersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/orders',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminOrdersPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminTownsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/towns',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminTownsPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminTownApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/town-applications',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminTownApplicationsPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminShoppersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/shoppers',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminShoppersPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminDriversRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/drivers',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminDriversPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminPickupPointsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/pickup-points',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminPickupPointsPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const adminSettingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/settings',
  component: () => (
    <RequireAuth>
      <RequireAdmin>
        <AdminSettingsPage />
      </RequireAdmin>
    </RequireAuth>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogueRoute,
  cartRoute,
  checkoutRoute,
  myOrdersRoute,
  orderDetailRoute,
  myTownsRoute,
  joinUsRoute,
  myApplicationsRoute,
  shopperApplicationRoute,
  pickupPointApplicationRoute,
  driverApplicationRoute,
  shopperDashboardRoute,
  driverDashboardRoute,
  retailerDashboardRoute,
  retailerOrdersRoute,
  adminDashboardRoute,
  adminRetailersRoute,
  adminProductsRoute,
  adminListingsRoute,
  adminOrdersRoute,
  adminTownsRoute,
  adminTownApplicationsRoute,
  adminShoppersRoute,
  adminDriversRoute,
  adminPickupPointsRoute,
  adminSettingsRoute,
]);

const router = createRouter({ routeTree });

export function HashRouter() {
  return <RouterProvider router={router} />;
}

export function navigate(path: string) {
  router.navigate({ to: path });
}
