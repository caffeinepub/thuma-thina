import { BrandImage } from '../brand/BrandImage';
import { publicAssetUrl } from '../../utils/publicAssetUrl';

export function ShopLandingHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-secondary/8 to-accent/8 border-b border-border/60">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(139,92,46,0.05),transparent_50%)]" />
      <div className="container-custom py-12 sm:py-16 lg:py-20 relative">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                Thuma Thina
              </h1>
              <p className="text-xl sm:text-2xl text-primary font-semibold italic">
                Yonke into, yonke indawo, ngaso sonke isikhathi
              </p>
              <p className="text-base sm:text-lg text-muted-foreground font-medium">
                Everything, everywhere, all the time
              </p>
            </div>
            <p className="text-base sm:text-lg text-foreground/80 max-w-xl leading-relaxed">
              Shop from your favorite local retailers with personal shoppers and delivery drivers ready to serve you. Building community, one delivery at a time.
            </p>
          </div>
          
          <div className="relative aspect-[2/1] lg:aspect-square rounded-2xl overflow-hidden shadow-warm ring-1 ring-border/50">
            <BrandImage
              src={publicAssetUrl('assets/generated/thuma-thina-hero.dim_1200x600.png')}
              alt="Thuma Thina Shopping"
              className="w-full h-full object-cover"
              fallbackType="hero"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
