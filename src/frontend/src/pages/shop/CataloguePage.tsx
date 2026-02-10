import { useState } from 'react';
import { useGlobalCatalogue } from '@/hooks/useCatalog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, Info } from 'lucide-react';
import { navigate } from '@/router/HashRouter';
import { Skeleton } from '@/components/ui/skeleton';

export function CataloguePage() {
  const { data: catalogue, isLoading, error } = useGlobalCatalogue();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCatalogue = catalogue?.filter((item: any) => {
    const matchesSearch =
      item.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories: string[] = catalogue
    ? ['all', ...Array.from(new Set(catalogue.map((item: any) => item.product.category)))]
    : ['all'];

  if (error) {
    return (
      <div className="container-custom py-8">
        <Alert variant="destructive">
          <AlertDescription>Failed to load catalogue. Please try again later.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-accent/5 to-background py-12">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Shop Local</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Browse products from your favorite local retailers. Compare prices and choose the best deal.
          </p>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((category: string) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category)}
                className="capitalize"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCatalogue && filteredCatalogue.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Catalogue functionality will be available once the backend is fully implemented.
              </AlertDescription>
            </Alert>
          </div>
        ) : (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              The product catalogue is being set up. Check back soon to start shopping!
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-8 text-center">
          <Button onClick={() => navigate('/')}>Back to Home</Button>
        </div>
      </section>
    </div>
  );
}
