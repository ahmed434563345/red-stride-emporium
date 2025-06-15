import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProductSection from '@/components/ProductSection';
import VisitorTracker from '@/components/VisitorTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

// Updated Product interface to match Supabase data structure
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
        .limit(4);
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
        .limit(4);
      if (error) throw error;
      return data as Product[];
    }
  });

  const { data: athleticWear = [] } = useQuery({
    queryKey: ['athletic-wear'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'Athletic Wear')
        .limit(4);
      if (error) throw error;
      return data as Product[];
    }
  });

  const { data: outerwear = [] } = useQuery({
    queryKey: ['outerwear'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'Outerwear')
        .limit(4);
      if (error) throw error;
      return data as Product[];
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VisitorTracker />

      {/* --- Men/Women Small Hero Section --- */}
      <section className="py-10 bg-white border-b">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center md:justify-between gap-6">
          <div className="text-center md:text-left flex-1">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">Looking for something specific?</h2>
            <p className="text-muted-foreground text-lg md:text-xl mb-4">
              Start by browsing top picks for <span className="font-semibold text-primary">Men</span> or <span className="font-semibold text-primary">Women</span>.
            </p>
            <div className="flex flex-col md:flex-row gap-3 justify-center md:justify-start">
              <Link to="/men/t-shirts">
                <Button size="lg" className="w-48">Shop for Men</Button>
              </Link>
              <Link to="/women/t-shirts">
                <Button size="lg" variant="secondary" className="w-48">Shop for Women</Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block flex-1">
            {/* Illustrative icons for visual cue */}
            <div className="flex items-center justify-center gap-8">
              <span className="text-5xl">👔</span>
              <span className="text-5xl">🧢</span>
              <span className="text-5xl">👖</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="athletic-gradient text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Premium Athletic Gear</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover the latest collection of authentic sportswear, sneakers, and equipment 
            from the world's top athletic brands.
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <ProductSection
        title="Featured Products"
        description="Check out our hand-picked selection of the hottest athletic gear"
        products={featuredProducts}
        viewAllLink="/products"
      />

      {/* Shop by Category */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Link to="/shoes" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="athletic-gradient h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">👟</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Shoes</h3>
                    <p className="text-muted-foreground">Sneakers, Running, Basketball</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/athletic-wear" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="athletic-gradient h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">👕</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Athletic Wear</h3>
                    <p className="text-muted-foreground">Jerseys, T-shirts, Shorts, Pants</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/outerwear" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="athletic-gradient h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">🧥</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Outerwear</h3>
                    <p className="text-muted-foreground">Jackets, Hoodies, Vests</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <ProductSection
        title="New Arrivals"
        description="Fresh styles just dropped"
        products={newArrivals}
        viewAllLink="/products"
      />

      {/* Athletic Wear Section */}
      <div className="bg-gray-50">
        <ProductSection
          title="Athletic Wear"
          description="Performance gear for every sport"
          products={athleticWear}
          viewAllLink="/athletic-wear"
        />
      </div>

      {/* Outerwear Collection */}
      <ProductSection
        title="Outerwear Collection"
        description="Stay comfortable in any weather"
        products={outerwear}
        viewAllLink="/outerwear"
      />

      {/* Call to Action */}
      <section className="athletic-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Game?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of athletes who trust us for their gear
          </p>
          <Link to="/products">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
              Browse All Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
