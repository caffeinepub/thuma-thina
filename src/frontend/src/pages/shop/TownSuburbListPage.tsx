import { useProvinces } from '../../hooks/useQueries';
import { useNavigate, useParams } from '@tanstack/react-router';
import { ChevronLeft, MapPin, ChevronRight, Loader2 } from 'lucide-react';

export function TownSuburbListPage() {
  const { provinceName } = useParams({ strict: false });
  const { data: provinces, isLoading } = useProvinces();
  const navigate = useNavigate();

  const province = provinces?.find(p => p.name === provinceName);

  return (
    <div className="container-custom py-8 sm:py-12">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate({ to: '/' })}
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6 transition-colors font-medium"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Provinces
        </button>

        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {provinceName}
          </h2>
          <p className="text-muted-foreground text-base">
            Select a town or suburb to browse retailers
          </p>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        )}

        {!isLoading && !province && (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg">Province not found</p>
          </div>
        )}

        {province && province.towns.length === 0 && (
          <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
            <MapPin className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-muted-foreground text-lg">No towns available yet</p>
          </div>
        )}

        {province && province.towns.length > 0 && (
          <div className="grid gap-4">
            {province.towns.map((town) => (
              <button
                key={town}
                onClick={() => navigate({ 
                  to: '/province/$provinceName/$townSuburb', 
                  params: { provinceName: provinceName || '', townSuburb: town } 
                })}
                className="group flex items-center justify-between p-5 sm:p-6 rounded-2xl border-2 border-border bg-card hover:bg-gradient-to-r hover:from-secondary/5 hover:to-accent/5 hover:border-secondary/40 transition-all duration-300 shadow-sm hover:shadow-warm"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-secondary/10 to-accent/10 text-secondary-foreground group-hover:from-secondary group-hover:to-secondary/90 group-hover:text-secondary-foreground transition-all duration-300 shadow-sm">
                    <MapPin className="h-7 w-7" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-foreground group-hover:text-secondary-foreground transition-colors">
                      {town}
                    </h3>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-muted-foreground group-hover:text-secondary-foreground group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
