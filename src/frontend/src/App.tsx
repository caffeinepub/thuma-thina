import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { InternetIdentityProvider } from './hooks/useInternetIdentity';
import { AdminBootstrapper } from './components/auth/AdminBootstrapper';
import { AdminOnly } from './components/auth/AdminOnly';
import { GlobalErrorBoundary } from './components/errors/GlobalErrorBoundary';
import { ShopLayout } from './components/shop/ShopLayout';
import { ProvinceListPage } from './pages/shop/ProvinceListPage';
import { TownSuburbListPage } from './pages/shop/TownSuburbListPage';
import { RetailerListPage } from './pages/shop/RetailerListPage';
import { RetailerCatalogPage } from './pages/shop/RetailerCatalogPage';
import { ProductDetailPage } from './pages/shop/ProductDetailPage';
import { RequestNewProductPage } from './pages/shop/RequestNewProductPage';
import { JoinUsPage } from './pages/shop/JoinUsPage';
import { RoleApplicationsStatusPage } from './pages/shop/RoleApplicationsStatusPage';
import { MasterAdminRoleApplicationsPage } from './pages/shop/MasterAdminRoleApplicationsPage';
import { AdminDashboardPage } from './pages/shop/AdminDashboardPage';
import { AdminRetailersPage } from './pages/admin/AdminRetailersPage';
import { ShopperDashboardPage } from './pages/shop/ShopperDashboardPage';
import { DriverDashboardPage } from './pages/shop/DriverDashboardPage';

const queryClient = new QueryClient();

const rootRoute = createRootRoute({
  component: () => (
    <ShopLayout>
      <AdminBootstrapper />
      <Outlet />
    </ShopLayout>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ProvinceListPage
});

const townSuburbRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/province/$provinceName',
  component: TownSuburbListPage
});

const retailerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/province/$provinceName/$townSuburb',
  component: RetailerListPage
});

const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/retailer/$retailerId',
  component: RetailerCatalogPage
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$retailerId/$productId',
  component: ProductDetailPage
});

const requestRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request',
  component: RequestNewProductPage
});

const joinRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join',
  component: JoinUsPage
});

const joinStatusRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join/status',
  component: RoleApplicationsStatusPage
});

const joinAdminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join/admin/applications',
  component: MasterAdminRoleApplicationsPage
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: () => (
    <AdminOnly>
      <AdminDashboardPage />
    </AdminOnly>
  )
});

const adminRetailersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/retailers',
  component: () => (
    <AdminOnly>
      <AdminRetailersPage />
    </AdminOnly>
  )
});

const shopperRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shopper',
  component: ShopperDashboardPage
});

const driverRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/driver',
  component: DriverDashboardPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  townSuburbRoute,
  retailerRoute,
  catalogRoute,
  productDetailRoute,
  requestRoute,
  joinRoute,
  joinStatusRoute,
  joinAdminRoute,
  adminRoute,
  adminRetailersRoute,
  shopperRoute,
  driverRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <GlobalErrorBoundary>
      <InternetIdentityProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </InternetIdentityProvider>
    </GlobalErrorBoundary>
  );
}

export default App;
