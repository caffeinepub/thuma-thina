import { useProvinces } from '../../hooks/useQueries';
import { useNavigate, useParams } from '@tanstack/react-router';
import { MapPin, ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

export function TownSuburbListPage() {
  const { provinceName } = useParams({ strict: false });
  const { data: provinces, isLoading } = useProvinces();
  const navigate = useNavigate();

  const province = provinces?.find(p => p.name === provinceName);
  const towns = province?.towns || [];

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate({ to: '/' })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Provinces
        </button>

        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {provinceName}
          </h2>
          <p className="text-muted-foreground">
            Select your town or suburb
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && towns.length === 0 && (
          <div className="rounded-lg border border-border bg-muted/50 p-8 text-center">
            <MapPin className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
            <p className="text-muted-foreground">No towns available in this province</p>
          </div>
        )}

        {towns.length > 0 && (
          <div className="grid gap-3 sm:gap-4">
            {towns.map((town) => (
              <button
                key={town}
                onClick={() => navigate({ 
                  to: '/province/$provinceName/$townSuburb', 
                  params: { provinceName: provinceName || '', townSuburb: town } 
                })}
                className="group flex items-center justify-between p-4 sm:p-6 rounded-xl border border-border bg-card hover:bg-accent/50 hover:border-primary/50 transition-all duration-200 shadow-xs hover:shadow-warm"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/20 text-secondary-foreground group-hover:bg-secondary group-hover:text-secondary-foreground transition-colors">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground">
                      {town}
                    </h3>
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
