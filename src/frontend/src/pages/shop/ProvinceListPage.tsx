import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ShoppingBag, Truck, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { navigate } from '@/router/HashRouter';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { THEME_ASSETS } from '@/utils/themeAssets';
import { BrandImage } from '@/components/brand/BrandImage';

export function ProvinceListPage() {
  const { identity } = useInternetIdentity();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/5 to-background" />
        <div className="container-custom relative py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Thuma Thina
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground font-medium">
                Yonke into, yonke indawo, ngaso sonke isikhathi
              </p>
              <p className="text-lg text-muted-foreground">
                Everything, everywhere, all the time
              </p>
              <p className="text-base text-muted-foreground max-w-lg">
                Community-driven shopping and delivery platform connecting local shoppers with drivers to deliver groceries and essentials from your favorite retailers.
              </p>
              {identity && (
                <div className="flex flex-wrap gap-3 pt-4">
                  <Button size="lg" onClick={() => navigate('/join-us')}>
                    Join Our Community
                  </Button>
                </div>
              )}
            </div>
            <div className="relative">
              <BrandImage
                src={THEME_ASSETS.hero}
                alt="Thuma Thina Community"
                className="w-full h-auto rounded-2xl shadow-2xl"
                fallbackType="hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-custom py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <ShoppingBag className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Personal Shoppers</CardTitle>
              <CardDescription>
                Local shoppers purchase items from physical stores on your behalf
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our trusted personal shoppers carefully select and purchase your items from your favorite local retailers.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <Truck className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Fast Delivery</CardTitle>
              <CardDescription>
                Reliable drivers deliver to your door or pickup point
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Choose home delivery or collect at convenient Ama Dao-zan pickup points in your community.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <MapPin className="h-12 w-12 text-primary mb-4" />
              <CardTitle>Ama Dao-zan Hubs</CardTitle>
              <CardDescription>
                Community multi-purpose pickup points
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                More than just pickup points - community hubs offering assistance, workspaces, and more.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Platform Status */}
      <section className="container-custom py-8">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            The Thuma Thina platform is currently in development. Core features including product catalog, order management, and rewards system are being implemented. {identity ? 'You can join our community as a driver or shopper to be ready when we launch!' : 'Log in to join our community and be ready for launch!'}
          </AlertDescription>
        </Alert>
      </section>
    </div>
  );
}
