import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProductSection from '@/components/ProductSection';
import VisitorTracker from '@/components/VisitorTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Truck, Shield, RefreshCw, Star } from 'lucide-react';

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
    { name: 'Nike', logo: '✓', tagline: 'Just Do It' },
    { name: 'Adidas', logo: '⫿', tagline: 'Impossible Is Nothing' },
    { name: 'Puma', logo: '🐆', tagline: 'Forever Faster' },
    { name: 'New Balance', logo: 'NB', tagline: 'Fearlessly Independent' },
  ];

  const categories = [
    { name: 'Running Shoes', image: '👟', link: '/shoes', count: '200+' },
    { name: 'Men\'s Wear', image: '👕', link: '/men-t-shirts', count: '150+' },
    { name: 'Women\'s Wear', image: '👗', link: '/women-t-shirts', count: '180+' },
    { name: 'Athletic Wear', image: '🏃', link: '/athletic-wear', count: '120+' },
    { name: 'Accessories', image: '🧢', link: '/men-caps-accessories', count: '80+' },
    { name: 'Outerwear', image: '🧥', link: '/outerwear', count: '90+' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VisitorTracker />

      {/* Hero Section */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent" />
        
        <div className="container mx-auto px-4 py-12 md:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="space-y-6 md:space-y-8 text-center lg:text-left z-10">
              <div className="inline-block bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold">
                New Collection 2024
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight">
                <span className="text-primary">ATHLETIC</span>
                <br />
                <span className="text-background">Performance</span>
                <br />
                <span className="text-muted">Gear</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted max-w-lg mx-auto lg:mx-0">
                Premium athletic shoes and clothing from Nike, Adidas, Puma & New Balance. 
                Elevate your game with top brands.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/shoes">
                  <Button size="lg" className="w-full sm:w-auto text-lg px-8 py-6 bg-primary hover:bg-primary/90">
                    Shop Shoes
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-8 py-6 border-background text-background hover:bg-background hover:text-foreground">
                    All Products
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-primary rounded-full blur-3xl opacity-30 animate-pulse" />
                <div className="relative z-10 w-full h-full flex items-center justify-center text-[150px] md:text-[200px] floating-animation">
                  👟
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Bar */}
      <section className="bg-background border-b py-6 md:py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {brands.map((brand) => (
              <Link
                key={brand.name}
                to="/products"
                className="flex items-center justify-center gap-3 p-4 rounded-xl hover:bg-muted transition-colors group"
              >
                <span className="text-2xl md:text-3xl font-bold text-primary group-hover:scale-110 transition-transform">
                  {brand.logo}
                </span>
                <div className="hidden sm:block">
                  <p className="font-bold text-foreground">{brand.name}</p>
                  <p className="text-xs text-muted-foreground">{brand.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 md:py-16 lg:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">Shop by Category</h2>
            <p className="text-muted-foreground text-base md:text-lg">Find your perfect athletic gear</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 lg:gap-6">
            {categories.map((category) => (
              <Link key={category.name} to={category.link}>
                <Card className="group hover:shadow-lg hover:border-primary transition-all duration-300 h-full">
                  <CardContent className="p-4 md:p-6 text-center">
                    <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 mx-auto mb-3 md:mb-4 bg-primary/10 rounded-2xl flex items-center justify-center text-3xl md:text-4xl group-hover:scale-110 group-hover:bg-primary/20 transition-all">
                      {category.image}
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
      <section className="bg-primary text-primary-foreground py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="space-y-2">
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">
                UP TO 50% OFF
              </h3>
              <p className="text-primary-foreground/80 text-base md:text-lg">
                Limited time offer on selected athletic gear
              </p>
            </div>
            <Link to="/products">
              <Button size="lg" variant="secondary" className="px-8 py-6 text-lg bg-background text-foreground hover:bg-background/90">
                Shop Sale
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 md:py-16">
        <ProductSection
          title="Featured Products"
          description="Top picks from our collection"
          products={featuredProducts}
          viewAllLink="/products"
        />
      </section>

      {/* Men & Women Split Section */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Men Section */}
            <Link to="/men-t-shirts" className="group relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[16/9]">
              <div className="absolute inset-0 bg-gradient-to-br from-foreground to-foreground/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-background p-6">
                <span className="text-6xl md:text-8xl mb-4">👔</span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Men's Collection</h3>
                <p className="text-muted mb-4 text-center text-sm md:text-base">Performance wear for every athlete</p>
                <Button variant="outline" className="border-background text-background hover:bg-background hover:text-foreground group-hover:scale-105 transition-transform">
                  Shop Men <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>

            {/* Women Section */}
            <Link to="/women-t-shirts" className="group relative overflow-hidden rounded-2xl aspect-[4/3] md:aspect-[16/9]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-primary-foreground p-6">
                <span className="text-6xl md:text-8xl mb-4">👗</span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Women's Collection</h3>
                <p className="text-primary-foreground/80 mb-4 text-center text-sm md:text-base">Style meets performance</p>
                <Button variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary group-hover:scale-105 transition-transform">
                  Shop Women <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-12 md:py-16">
        <ProductSection
          title="New Arrivals"
          description="Fresh drops just for you"
          products={newArrivals}
          viewAllLink="/products"
        />
      </section>

      {/* Features */}
      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
              { icon: Shield, title: 'Secure Payment', desc: '100% protected' },
              { icon: RefreshCw, title: 'Easy Returns', desc: '30 days return' },
              { icon: Star, title: 'Premium Quality', desc: 'Authentic brands' },
            ].map((feature) => (
              <div key={feature.title} className="text-center p-4 md:p-6">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-primary" />
                </div>
                <h4 className="font-semibold text-sm md:text-base mb-1">{feature.title}</h4>
                <p className="text-xs md:text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-foreground text-background py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-2xl md:text-3xl lg:text-5xl font-bold">
              Ready to <span className="text-primary">Elevate</span> Your Game?
            </h2>
            <p className="text-muted text-base md:text-lg lg:text-xl">
              Join thousands of athletes who trust Athletic for premium sports gear
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/shoes">
                <Button size="lg" className="w-full sm:w-auto text-base md:text-lg px-8 py-6">
                  Shop Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base md:text-lg px-8 py-6 border-muted text-muted hover:bg-muted hover:text-foreground">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-xl md:text-2xl font-bold text-primary mb-4">ATHLETIC</h3>
              <p className="text-sm text-muted-foreground">
                Premium athletic gear for champions. Nike, Adidas, Puma & New Balance.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm md:text-base">Shop</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/shoes" className="hover:text-primary transition-colors">Shoes</Link></li>
                <li><Link to="/men-t-shirts" className="hover:text-primary transition-colors">Men's Wear</Link></li>
                <li><Link to="/women-t-shirts" className="hover:text-primary transition-colors">Women's Wear</Link></li>
                <li><Link to="/athletic-wear" className="hover:text-primary transition-colors">Athletic Wear</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm md:text-base">Account</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/signin" className="hover:text-primary transition-colors">Sign In</Link></li>
                <li><Link to="/signup" className="hover:text-primary transition-colors">Sign Up</Link></li>
                <li><Link to="/cart" className="hover:text-primary transition-colors">Cart</Link></li>
                <li><Link to="/wishlist" className="hover:text-primary transition-colors">Wishlist</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 text-sm md:text-base">Help</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/stores" className="hover:text-primary transition-colors">Our Stores</Link></li>
                <li><Link to="/chat" className="hover:text-primary transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>© 2024 Athletic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
