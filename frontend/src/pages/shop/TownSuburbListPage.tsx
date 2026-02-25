import React from 'react';
import { MapPin, ArrowLeft } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface TownSuburbListPageProps {
  province: string;
}

const TOWNS_BY_PROVINCE: Record<string, string[]> = {
  'KwaZulu-Natal': ['Newcastle', 'Osizweni', 'Madadeni', 'Dundee', 'Ladysmith', 'Pietermaritzburg', 'Durban'],
  'Gauteng': ['Johannesburg', 'Pretoria', 'Soweto', 'Sandton', 'Midrand'],
  'Western Cape': ['Cape Town', 'Stellenbosch', 'George', 'Paarl'],
  'Eastern Cape': ['Port Elizabeth', 'East London', 'Mthatha', 'Grahamstown'],
  'Free State': ['Bloemfontein', 'Welkom', 'Bethlehem'],
  'Limpopo': ['Polokwane', 'Tzaneen', 'Thohoyandou'],
  'Mpumalanga': ['Nelspruit', 'Witbank', 'Secunda'],
  'Northern Cape': ['Kimberley', 'Upington', 'Springbok'],
  'North West': ['Rustenburg', 'Mahikeng', 'Klerksdorp'],
};

export function TownSuburbListPage({ province }: TownSuburbListPageProps) {
  const decodedProvince = decodeURIComponent(province);
  const towns = TOWNS_BY_PROVINCE[decodedProvince] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <a
          href="#/shop"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Provinces
        </a>
        <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          {decodedProvince}
        </h1>
        <p className="text-muted-foreground mt-1">Select a town to browse local retailers</p>
      </div>

      {towns.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No towns available</p>
          <p className="text-sm mt-1">Towns for this province are coming soon</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {towns.map((town) => (
            <a
              key={town}
              href={`#/shop/${encodeURIComponent(decodedProvince)}/${encodeURIComponent(town)}`}
              className="group block"
            >
              <Card className="h-full transition-all duration-200 hover:shadow-warm-lg hover:border-primary/30 group-hover:-translate-y-0.5">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {town}
                    </CardTitle>
                    <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <CardDescription>Browse retailers in {town}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default TownSuburbListPage;
