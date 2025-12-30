import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProductSection from '@/components/ProductSection';
import VisitorTracker from '@/components/VisitorTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Truck, Shield, RefreshCw, Star, Footprints, Shirt, Watch, Sparkles, Zap, Crown } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  images?: string[];
  category: string;
  stock: number;
  is_new?: boolean;
  brand?: string;
}

const Index = () => {
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_archived', false)
        .limit(8);
      if (error) throw error;
      return data as Product[];
    }
  });

  const { data: newArrivals = [] } = useQuery({
    queryKey: ['new-arrivals'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_new', true)
        .eq('is_archived', false)
        .limit(8);
      if (error) throw error;
      return data as Product[];
    }
  });

  const brands = [
    { name: 'Nike', icon: '✓' },
    { name: 'Adidas', icon: '⫿' },
    { name: 'Puma', icon: '◆' },
    { name: 'New Balance', icon: 'NB' },
  ];

  const categories = [
    { name: 'Footwear', icon: Footprints, link: '/shoes', count: '200+' },
    { name: 'Men\'s Collection', icon: Shirt, link: '/men-t-shirts', count: '150+' },
    { name: 'Women\'s Collection', icon: Sparkles, link: '/women-t-shirts', count: '180+' },
    { name: 'Athletic Wear', icon: Zap, link: '/athletic-wear', count: '120+' },
    { name: 'Accessories', icon: Watch, link: '/men-caps-accessories', count: '80+' },
    { name: 'Premium', icon: Crown, link: '/outerwear', count: '90+' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VisitorTracker />

      {/* Hero Section */}
      <section className="relative bg-foreground text-background overflow-hidden min-h-[90vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-primary/10 rounded-full blur-2xl" />
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 glass-button px-4 py-2 rounded-full">
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium text-foreground">New Collection 2024</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold leading-[1.1] tracking-tight">
                <span className="text-primary">ATHLETIC</span>
                <br />
                <span className="text-background">Performance</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Premium athletic footwear and apparel from the world's leading brands. 
                Elevate your performance with Nike, Adidas, Puma & New Balance.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/shoes">
                  <Button size="lg" className="glass-button-primary w-full sm:w-auto text-lg px-8 py-6 rounded-xl">
                    <Footprints className="mr-2 h-5 w-5" />
                    Shop Footwear
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 rounded-xl border-muted text-muted hover:bg-muted/10">
                    Explore All
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-72 h-72 md:w-96 md:h-96 lg:w-[450px] lg:h-[450px]">
                <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl animate-pulse" />
                <div className="absolute inset-8 glass-card rounded-full flex items-center justify-center">
                  <Footprints className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 text-primary floating-animation" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Bar */}
      <section className="bg-muted/30 border-y py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                to="/products"
                className="flex items-center gap-3 group"
              >
                <span className="text-2xl md:text-3xl font-black text-primary group-hover:scale-110 transition-transform">
                  {brand.icon}
                </span>
                <span className="font-bold text-foreground text-lg hidden sm:block">{brand.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover premium athletic gear curated for champions</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category) => (
              <Link key={category.name} to={category.link}>
                <Card className="glass-card hover-lift group h-full border-0">
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 glass-button rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all">
                      <category.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm md:text-base mb-1 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-xs md:text-sm text-muted-foreground">{category.count} items</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/90 to-primary" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent)]" />
        
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 bg-primary-foreground/20 px-4 py-1.5 rounded-full">
                <Zap className="h-4 w-4 text-primary-foreground" />
                <span className="text-sm font-semibold text-primary-foreground">Limited Time</span>
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground">
                UP TO 50% OFF
              </h3>
              <p className="text-primary-foreground/80 text-lg">
                Premium athletic gear at unbeatable prices
              </p>
            </div>
            <Link to="/products">
              <Button size="lg" className="glass-button text-foreground px-10 py-6 text-lg rounded-xl">
                Shop Sale
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <ProductSection
          title="Featured Products"
          description="Handpicked essentials for peak performance"
          products={featuredProducts}
          viewAllLink="/products"
        />
      </section>

      {/* Men & Women Split Section */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Men Section */}
            <Link to="/men-t-shirts" className="group relative overflow-hidden rounded-3xl aspect-[4/3]">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground via-foreground/95 to-foreground/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-background p-8">
                <div className="glass-button w-24 h-24 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shirt className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">Men's Collection</h3>
                <p className="text-muted mb-6 text-center">Performance wear engineered for excellence</p>
                <Button variant="outline" className="glass-button-outline border-background/50 text-background hover:bg-background/10 rounded-xl">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>

            {/* Women Section */}
            <Link to="/women-t-shirts" className="group relative overflow-hidden rounded-3xl aspect-[4/3]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground p-8">
                <div className="glass-button w-24 h-24 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-12 h-12 text-primary" />
                </div>
                <h3 className="text-3xl md:text-4xl font-bold mb-3">Women's Collection</h3>
                <p className="text-primary-foreground/80 mb-6 text-center">Where style meets athletic performance</p>
                <Button variant="outline" className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 rounded-xl">
                  Explore <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-24">
        <ProductSection
          title="New Arrivals"
          description="Fresh drops you don't want to miss"
          products={newArrivals}
          viewAllLink="/products"
        />
      </section>

      {/* Features */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'Orders over $100' },
              { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30 days policy' },
              { icon: Star, title: 'Authentic Brands', desc: 'Verified quality' },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-6">
                <div className="glass-button w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center">
                  <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                </div>
                <h4 className="font-semibold text-base md:text-lg mb-1">{feature.title}</h4>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground text-background py-20 md:py-28">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="inline-flex items-center gap-2 glass-button px-4 py-2 rounded-full">
              <Crown className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Join the Elite</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight">
              Ready to <span className="text-primary">Elevate</span> Your Game?
            </h2>
            <p className="text-muted text-lg md:text-xl max-w-2xl mx-auto">
              Join thousands of athletes who trust Athletic for premium performance gear
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/shoes">
                <Button size="lg" className="glass-button-primary w-full sm:w-auto text-lg px-10 py-6 rounded-xl">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-6 rounded-xl border-muted text-muted hover:bg-muted/10">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="glass-button w-10 h-10 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <span className="text-xl font-bold text-primary">ATHLETIC</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Premium athletic gear from Nike, Adidas, Puma & New Balance. Elevate your performance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/shoes" className="hover:text-primary transition-colors">Footwear</Link></li>
                <li><Link to="/men-t-shirts" className="hover:text-primary transition-colors">Men's Wear</Link></li>
                <li><Link to="/women-t-shirts" className="hover:text-primary transition-colors">Women's Wear</Link></li>
                <li><Link to="/athletic-wear" className="hover:text-primary transition-colors">Athletic Wear</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/signin" className="hover:text-primary transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
                <li><Link to="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
                <li><Link to="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li><Link to="/stores" className="hover:text-primary transition-colors">Our Stores</Link></li>
                <li><Link to="/chat" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Athletic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
