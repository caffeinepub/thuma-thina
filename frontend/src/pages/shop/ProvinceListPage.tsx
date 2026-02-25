import React from 'react';
import { MapPin, ShoppingBag, Truck, Users, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SA_PROVINCES = [
  'Eastern Cape',
  'Free State',
  'Gauteng',
  'KwaZulu-Natal',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
  'North West',
  'Western Cape',
];

const features = [
  {
    icon: <ShoppingBag className="h-6 w-6" />,
    title: 'Shop Local',
    description: 'Browse products from local retailers in your community',
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: 'Fast Delivery',
    description: 'Get your orders delivered by community drivers',
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: 'Community First',
    description: 'Support local businesses and create jobs in your area',
  },
  {
    icon: <Star className="h-6 w-6" />,
    title: 'Nomayini Rewards',
    description: 'Earn up to 20% rewards on every purchase',
  },
];

export function ProvinceListPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-display font-bold text-foreground mb-4">
          Thuma Thina
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          "Send Us" — Community Commerce Platform
        </p>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Shop from local retailers, earn Nomayini token rewards, and support your community.
        </p>
      </div>

      {/* Development Alert */}
      <Alert className="mb-8">
        <AlertDescription>
          🚧 Platform under development. Browse provinces to explore available retailers and products.
        </AlertDescription>
      </Alert>

      {/* Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {features.map((feature) => (
          <Card key={feature.title} className="text-center">
            <CardContent className="pt-6">
              <div className="flex justify-center mb-3 text-primary">{feature.icon}</div>
              <h3 className="font-semibold mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Provinces */}
      <div className="mb-6">
        <h2 className="text-2xl font-display font-bold text-foreground mb-2 flex items-center gap-2">
          <MapPin className="h-6 w-6 text-primary" />
          Browse by Province
        </h2>
        <p className="text-muted-foreground">Select your province to find local retailers</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SA_PROVINCES.map((province) => (
          <a
            key={province}
            href={`#/shop/${encodeURIComponent(province)}`}
            className="group block"
          >
            <Card className="h-full transition-all duration-200 hover:shadow-warm-lg hover:border-primary/30 group-hover:-translate-y-0.5">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {province}
                  </CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <CardDescription>Browse retailers in {province}</CardDescription>
              </CardHeader>
            </Card>
          </a>
        ))}
      </div>

      {/* Nomayini Rewards Section */}
      <div className="mt-16 p-8 rounded-2xl bg-primary/5 border border-primary/20">
        <h2 className="text-2xl font-display font-bold text-foreground mb-4 flex items-center gap-2">
          <Star className="h-6 w-6 text-primary" />
          Nomayini Token Rewards
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Earn Up to 20% Rewards</h3>
            <p className="text-sm text-muted-foreground">
              Get rewarded on every purchase with Nomayini tokens — split 50/50 between immediate and vested rewards.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Flexible Vesting</h3>
            <p className="text-sm text-muted-foreground">
              50% unlocks after 3 months, 50% vests over 4 years — building long-term community wealth.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Multiple Uses</h3>
            <p className="text-sm text-muted-foreground">
              Use tokens for shopping, send to family, or trade for crypto on supported exchanges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProvinceListPage;
