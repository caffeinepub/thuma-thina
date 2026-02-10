import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from 'next-themes';
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
import AdminDashboardPage from './pages/shop/AdminDashboardPage';
import { AdminRetailersPage } from './pages/admin/AdminRetailersPage';
import AdminManageListingsPage from './pages/admin/AdminManageListingsPage';
import { ShopperDashboardPage } from './pages/shop/ShopperDashboardPage';
import { DriverDashboardPage } from './pages/shop/DriverDashboardPage';
import { AdminOnly } from './components/auth/AdminOnly';
import { GlobalErrorBoundary } from './components/errors/GlobalErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const rootRoute = createRootRoute({
  component: () => (
    <ShopLayout>
      <Outlet />
    </ShopLayout>
  )
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: ProvinceListPage
});

const provinceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/province/$provinceName/$townSuburb',
  component: TownSuburbListPage
});

const retailersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/retailers/$townSuburb',
  component: RetailerListPage
});

const retailerCatalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/retailer/$retailerId',
  component: RetailerCatalogPage
});

const productDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/product/$productId',
  component: ProductDetailPage
});

const requestProductRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/request-product',
  component: RequestNewProductPage
});

const joinUsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/join-us',
  component: JoinUsPage
});

const roleApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/my-applications',
  component: RoleApplicationsStatusPage
});

const adminRoleApplicationsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/role-applications',
  component: () => (
    <AdminOnly>
      <MasterAdminRoleApplicationsPage />
    </AdminOnly>
  )
});

const adminDashboardRoute = createRoute({
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

const adminListingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/listings',
  component: () => (
    <AdminOnly>
      <AdminManageListingsPage />
    </AdminOnly>
  )
});

const shopperDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shopper',
  component: ShopperDashboardPage
});

const driverDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/driver',
  component: DriverDashboardPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  provinceRoute,
  retailersRoute,
  retailerCatalogRoute,
  productDetailRoute,
  requestProductRoute,
  joinUsRoute,
  roleApplicationsRoute,
  adminRoleApplicationsRoute,
  adminDashboardRoute,
  adminRetailersRoute,
  adminListingsRoute,
  shopperDashboardRoute,
  driverDashboardRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <GlobalErrorBoundary>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <Toaster />
        </QueryClientProvider>
      </ThemeProvider>
    </GlobalErrorBoundary>
  );
}
