import { useProvinces } from '../../hooks/useQueries';
import { ShopLandingHero } from '../../components/shop/ShopLandingHero';
import { useNavigate } from '@tanstack/react-router';
import { MapPin, ChevronRight, Loader2 } from 'lucide-react';

export function ProvinceListPage() {
  const { data: provinces, isLoading, error } = useProvinces();
  const navigate = useNavigate();

  return (
    <div>
      <ShopLandingHero />
      
      <div className="container-custom py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Select Your Province
            </h2>
            <p className="text-muted-foreground">
              Choose your province to browse local retailers
            </p>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
              <p className="font-medium">Error loading provinces</p>
              <p className="text-sm mt-1">Please try again later</p>
            </div>
          )}

          {provinces && provinces.length === 0 && (
            <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
              <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">No provinces available yet</p>
            </div>
          )}

          {provinces && provinces.length > 0 && (
            <div className="grid gap-3 sm:gap-4">
              {provinces.map((province) => (
                <button
                  key={province.name}
                  onClick={() => navigate({ 
                    to: '/province/$provinceName', 
                    params: { provinceName: province.name } 
                  })}
                  className="group flex items-center justify-between p-4 sm:p-6 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 shadow-xs hover:shadow-warm"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground">
                        {province.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {province.towns.length} {province.towns.length === 1 ? 'location' : 'locations'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
