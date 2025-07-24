import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProductSection from '@/components/ProductSection';
import ProductSuggestions from '@/components/ProductSuggestions';
import ThreeDAnimation from '@/components/ThreeDAnimation';
import HelloIntro from '@/components/HelloIntro';
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
      <HelloIntro />
      <Navigation />
      <VisitorTracker />

      {/* Hero Section with 3D Animation */}
      <section className="souq-gradient text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 arabic-pattern opacity-20" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl font-bold mb-6 slide-in-left">
                أهلاً بك في سوق مصر
              </h1>
              <h2 className="text-4xl font-bold mb-6 slide-in-left">
                Welcome to Souq Masr
              </h2>
              <p className="text-xl mb-8 max-w-2xl slide-in-right">
                Your authentic Egyptian marketplace - Discover traditional crafts, 
                modern products, and everything in between.
              </p>
              <Link to="/products">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4 fade-in-up">
                  🛍️ Start Shopping
                </Button>
              </Link>
            </div>
            <div className="flex justify-center">
              <ThreeDAnimation className="floating-animation" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="featured-products">
        <ProductSection
          title="Featured Products"
          description="Handpicked treasures from our Egyptian marketplace"
          products={featuredProducts}
          viewAllLink="/products"
        />
      </section>

      {/* Shop by Category */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Explore our diverse marketplace</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link to="/electronics" className="group">
              <Card className="hover:shadow-lg transition-shadow hover:scale-105">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="souq-gradient h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">📱</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Electronics</h3>
                    <p className="text-muted-foreground">Latest gadgets & tech</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/home-garden" className="group">
              <Card className="hover:shadow-lg transition-shadow hover:scale-105">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="souq-gradient h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">🏠</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Home & Garden</h3>
                    <p className="text-muted-foreground">Beautiful home essentials</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/books" className="group">
              <Card className="hover:shadow-lg transition-shadow hover:scale-105">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="souq-gradient h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">📚</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Books</h3>
                    <p className="text-muted-foreground">Knowledge & literature</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/beauty" className="group">
              <Card className="hover:shadow-lg transition-shadow hover:scale-105">
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="souq-gradient h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-white text-2xl">💄</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">Beauty</h3>
                    <p className="text-muted-foreground">Premium cosmetics</p>
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
        description="Fresh additions to our marketplace"
        products={newArrivals}
        viewAllLink="/products"
      />

      {/* Product Suggestions */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <ProductSuggestions limit={8} />
        </div>
      </div>

      {/* Call to Action */}
      <section className="souq-gradient text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Explore Souq Masr?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands who trust us for authentic Egyptian products
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
