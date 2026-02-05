import { useRetailersByTownSuburb } from '../../hooks/useQueries';
import { useNavigate, useParams } from '@tanstack/react-router';
import { Store, ChevronRight, ChevronLeft, Loader2, Package } from 'lucide-react';

export function RetailerListPage() {
  const { provinceName, townSuburb } = useParams({ strict: false });
  const { data: retailers, isLoading, error } = useRetailersByTownSuburb(townSuburb || '');
  const navigate = useNavigate();

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate({ 
            to: '/province/$provinceName', 
            params: { provinceName: provinceName || '' } 
          })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Towns
        </button>

        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Retailers in {townSuburb}
          </h2>
          <p className="text-muted-foreground">
            Browse products from local retailers
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Error loading retailers</p>
            <p className="text-sm mt-1">Please try again later</p>
          </div>
        )}

        {!isLoading && retailers && retailers.length === 0 && (
          <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
            <Store className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No retailers available in this area yet</p>
            <button
              onClick={() => navigate({ to: '/request' })}
              className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Request a Retailer
            </button>
          </div>
        )}

        {retailers && retailers.length > 0 && (
          <div className="grid gap-4 sm:gap-6">
            {retailers.map((retailer) => (
              <button
                key={retailer.id.toString()}
                onClick={() => navigate({ 
                  to: '/retailer/$retailerId', 
                  params: { retailerId: retailer.id.toString() } 
                })}
                className="group flex items-center justify-between p-5 sm:p-6 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 shadow-xs hover:shadow-warm"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent/20 text-accent-foreground group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                    <Store className="h-7 w-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground mb-1">
                      {retailer.name}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Package className="h-4 w-4 mr-1.5" />
                      {retailer.products.length} {retailer.products.length === 1 ? 'product' : 'products'}
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
