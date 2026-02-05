import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ShopLayout } from './components/shop/ShopLayout';
import { ProvinceListPage } from './pages/shop/ProvinceListPage';
import { TownSuburbListPage } from './pages/shop/TownSuburbListPage';
import { RetailerListPage } from './pages/shop/RetailerListPage';
import { RetailerCatalogPage } from './pages/shop/RetailerCatalogPage';
import { ProductDetailPage } from './pages/shop/ProductDetailPage';
import { RequestNewProductPage } from './pages/shop/RequestNewProductPage';

const queryClient = new QueryClient();

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

const routeTree = rootRoute.addChildren([
  indexRoute,
  townSuburbRoute,
  retailerRoute,
  catalogRoute,
  productDetailRoute,
  requestRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
