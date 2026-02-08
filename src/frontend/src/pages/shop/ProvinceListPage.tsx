import { useProvinces } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { MapPin, Loader2, ChevronRight } from 'lucide-react';
import { ShopLandingHero } from '../../components/shop/ShopLandingHero';
import { CataloguePreviewSection } from '../../components/shop/CataloguePreviewSection';

export function ProvinceListPage() {
  const { data: provinces, isLoading, error } = useProvinces();
  const navigate = useNavigate();

  return (
    <div>
      <ShopLandingHero />
      
      <CataloguePreviewSection />

      <div className="container-custom py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-10 text-center">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-3">
              Shop by Location
            </h2>
            <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
              Select your province to discover local retailers and products in your area
            </p>
          </div>

          <div className="mb-10 rounded-2xl border-2 border-primary/30 bg-gradient-to-r from-primary/5 to-accent/5 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <h3 className="font-display text-xl font-bold text-foreground mb-2">
                  Join Our Community
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Become a retailer, delivery driver, or service provider. Help us build a stronger local economy.
                </p>
              </div>
              <button
                onClick={() => navigate({ to: '/join' })}
                className="group inline-flex items-center px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all shadow-sm hover:shadow-md whitespace-nowrap"
              >
                Join Us
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}

          {error && (
            <div className="rounded-xl border-2 border-destructive/50 bg-destructive/5 p-6 text-destructive shadow-sm">
              <p className="font-semibold text-lg">Error loading provinces</p>
              <p className="text-sm mt-1 opacity-90">Please try again later</p>
            </div>
          )}

          {!isLoading && provinces && provinces.length === 0 && (
            <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
              <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground text-lg">No provinces available yet</p>
            </div>
          )}

          {provinces && provinces.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {provinces.map((province) => (
                <div key={province.name} className="space-y-3">
                  <div className="rounded-2xl border-2 border-border bg-card p-5 shadow-sm">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary shadow-sm">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <h3 className="font-display text-lg font-bold text-foreground">
                        {province.name}
                      </h3>
                    </div>
                    <div className="space-y-1.5">
                      {province.towns.map((town) => (
                        <button
                          key={town}
                          onClick={() => navigate({ 
                            to: '/province/$provinceName/$townSuburb', 
                            params: { 
                              provinceName: province.name, 
                              townSuburb: town 
                            } 
                          })}
                          className="group w-full flex items-center justify-between px-4 py-2.5 rounded-lg bg-muted/30 hover:bg-gradient-to-r hover:from-accent/10 hover:to-primary/10 hover:border-accent/30 border border-transparent transition-all text-left"
                        >
                          <span className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                            {town}
                          </span>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
