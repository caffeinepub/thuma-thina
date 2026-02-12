import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Truck, ShoppingBag, MapPin } from 'lucide-react';
import { navigate } from '@/router/HashRouter';

export function JoinUsPage() {
  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Join Thuma Thina</h1>
          <p className="text-muted-foreground">
            Become part of our community-driven platform
          </p>
        </div>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            All role applications are now available! Apply to become a Personal Shopper, Delivery Driver, or Pickup Point.
          </AlertDescription>
        </Alert>

        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <Truck className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Delivery Driver</CardTitle>
              <CardDescription>
                Earn by delivering orders to customers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Flexible working hours</li>
                <li>• Earn NomaYini rewards</li>
                <li>• Serve your community</li>
              </ul>
              <Button className="w-full" onClick={() => navigate('/join-us/driver-application')}>
                Apply as Driver
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <ShoppingBag className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Personal Shopper</CardTitle>
              <CardDescription>
                Shop for customers at local stores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Work on your schedule</li>
                <li>• Earn NomaYini rewards</li>
                <li>• Help your neighbors</li>
              </ul>
              <Button className="w-full" onClick={() => navigate('/join-us/shopper-application')}>
                Apply as Shopper
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <MapPin className="h-12 w-12 text-primary mb-2" />
              <CardTitle>Pickup Point</CardTitle>
              <CardDescription>
                Host an Ama Dao-zan community hub
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• Serve your community</li>
                <li>• Generate income</li>
                <li>• Build connections</li>
              </ul>
              <Button className="w-full" onClick={() => navigate('/join-us/pickup-point-application')}>
                Apply as Pickup Point
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
            <CardDescription>
              Check the status of your applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/my-applications')} variant="outline">
              View My Applications
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
