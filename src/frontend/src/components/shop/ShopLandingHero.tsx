export function ShopLandingHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border-b border-border">
      <div className="container-custom py-12 sm:py-16 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="space-y-6 animate-fade-in">
            <div className="space-y-3">
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground">
                Thuma Thina
              </h1>
              <p className="text-xl sm:text-2xl text-muted-foreground font-medium">
                Yonke into, yonke indawo, ngaso sonke isikhathi
              </p>
              <p className="text-base sm:text-lg text-muted-foreground">
                Everything, everywhere, all the time
              </p>
            </div>
            <p className="text-base sm:text-lg text-foreground/80 max-w-xl">
              Shop from your favorite local retailers with personal shoppers and delivery drivers ready to serve you.
            </p>
          </div>
          
          <div className="relative aspect-[2/1] lg:aspect-square rounded-2xl overflow-hidden shadow-warm">
            <img 
              src="/assets/generated/thuma-thina-hero.dim_1200x600.png" 
              alt="Thuma Thina Shopping" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
