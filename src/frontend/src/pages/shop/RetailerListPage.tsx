import { useRetailersByTownSuburb } from '../../hooks/useQueries';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ChevronLeft, Store, ChevronRight, Loader2, Package } from 'lucide-react';

export function RetailerListPage() {
  const { townSuburb } = useParams({ strict: false });
  const { data: retailersWithListings, isLoading, error } = useRetailersByTownSuburb(townSuburb || '');
  const navigate = useNavigate();

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate({ to: '/' })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Towns
        </button>

        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Retailers in {townSuburb}
          </h2>
          <p className="text-muted-foreground text-base">
            Browse products from local retailers
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {error && (
          <div className="rounded-xl border-2 border-destructive/50 bg-destructive/5 p-6 text-destructive shadow-sm">
            <p className="font-semibold text-lg">Error loading retailers</p>
            <p className="text-sm mt-1 opacity-90">Please try again later</p>
          </div>
        )}

        {!isLoading && retailersWithListings && retailersWithListings.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
            <Store className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg">No retailers available yet</p>
          </div>
        )}

        {retailersWithListings && retailersWithListings.length > 0 && (
          <div className="grid gap-4">
            {retailersWithListings.map(({ retailer, listings }) => (
              <button
                key={retailer.id.toString()}
                onClick={() => navigate({ 
                  to: '/retailer/$retailerId', 
                  params: { retailerId: retailer.id.toString() } 
                })}
                className="group flex items-center justify-between p-5 sm:p-6 rounded-2xl border-2 border-border bg-card hover:bg-gradient-to-r hover:from-accent/5 hover:to-primary/5 hover:border-accent/40 transition-all duration-300 shadow-sm hover:shadow-warm"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-accent/10 to-primary/10 text-accent group-hover:from-accent group-hover:to-accent/90 group-hover:text-accent-foreground transition-all duration-300 shadow-sm">
                    <Store className="h-7 w-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                      {retailer.name}
                    </h3>
                    <p className="text-sm text-muted-foreground flex items-center">
                      <Package className="h-3.5 w-3.5 mr-1.5" />
                      {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-accent group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
