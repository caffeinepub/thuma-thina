import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Store, MapPin, Phone, ArrowLeft } from 'lucide-react';
import { useRetailers } from '@/hooks/useRetailers';
import { navigate } from '@/router/HashRouter';

interface RetailerListPageProps {
  province: string;
  town: string;
}

export function RetailerListPage({ province, town }: RetailerListPageProps) {
  const { data: retailers = [], isLoading } = useRetailers();

  const filtered = retailers.filter(r => {
    const matchProvince = !province || r.province.toLowerCase() === province.toLowerCase();
    const matchTown = !town || r.townSuburb.toLowerCase().includes(town.toLowerCase());
    return matchProvince && matchTown;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>

      <div>
        <h1 className="text-2xl font-bold">Retailers</h1>
        <p className="text-muted-foreground">
          {town ? `${town}, ` : ''}{province || 'All areas'}
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Store className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>No retailers found in this area yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(retailer => (
            <div
              key={retailer.id.toString()}
              className="rounded-lg border bg-card p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/retailer/${retailer.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="font-semibold text-lg">{retailer.name}</h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {retailer.address || retailer.townSuburb}
                  </div>
                  {retailer.phone && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {retailer.phone}
                    </div>
                  )}
                </div>
                <Badge variant="outline">{retailer.province}</Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={e => {
                  e.stopPropagation();
                  navigate(`/retailer/${retailer.id}`);
                }}
              >
                View Products
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RetailerListPage;
