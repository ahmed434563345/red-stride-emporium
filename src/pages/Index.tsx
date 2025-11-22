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
        .eq('is_archived', false)
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
        .eq('is_archived', false)
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
        .eq('is_archived', false)
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
        .eq('is_archived', false)
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

      {/* Enhanced Hero Section */}
      <section className="souq-hero-gradient text-white py-24 lg:py-32 relative overflow-hidden">
        <div className="absolute inset-0 geometric-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center min-h-[60vh]">
            <div className="text-center lg:text-left space-y-8">
              <div className="space-y-4">
                <h1 className="font-display text-hero font-bold mb-4 slide-in-left text-reveal">
                  أهلاً بك في سوق مصر
                </h1>
                <h2 className="text-display font-bold mb-6 slide-in-left bg-gradient-to-r from-souq-gold to-souq-gold-light bg-clip-text text-transparent">
                  Welcome to Souq Masr
                </h2>
              </div>
              
              <p className="text-xl lg:text-2xl mb-8 max-w-2xl slide-in-right leading-relaxed text-white/90 font-light">
                Your premium Egyptian marketplace - Discover authentic treasures, 
                modern innovation, and everything that makes Egypt extraordinary.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 fade-in-up">
                <Link to="/products">
                  <Button size="xl" variant="luxury" className="text-lg px-12 py-6 glow-effect">
                    🛍️ Start Shopping
                  </Button>
                </Link>
                <Link to="/products">
                  <Button size="xl" variant="elegant" className="text-lg px-12 py-6">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 souq-gradient rounded-full blur-xl opacity-30 animate-pulse"></div>
                <ThreeDAnimation className="floating-animation relative z-10" />
              </div>
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

      {/* Enhanced Shop by Category */}
      <section className="py-20 bg-gradient-to-br from-souq-cream to-souq-sand">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-display font-bold mb-6 souq-text-gradient">Shop by Category</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Explore our curated collections of authentic and modern treasures</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link to="/electronics" className="group">
              <Card className="hover-lift bg-white/60 backdrop-blur-sm border-0 h-full">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="souq-gradient h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-gold">
                      <span className="text-white text-3xl">📱</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:souq-text-gradient transition-all duration-300">Electronics</h3>
                    <p className="text-muted-foreground leading-relaxed">Latest gadgets & innovative technology</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/home-garden" className="group">
              <Card className="hover-lift bg-white/60 backdrop-blur-sm border-0 h-full">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="souq-emerald-gradient h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-white text-3xl">🏠</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:souq-text-gradient transition-all duration-300">Home & Garden</h3>
                    <p className="text-muted-foreground leading-relaxed">Beautiful home essentials & décor</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/books" className="group">
              <Card className="hover-lift bg-white/60 backdrop-blur-sm border-0 h-full">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-br from-souq-navy to-souq-navy-light h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-white text-3xl">📚</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:souq-text-gradient transition-all duration-300">Books</h3>
                    <p className="text-muted-foreground leading-relaxed">Knowledge, wisdom & literature</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/beauty" className="group">
              <Card className="hover-lift bg-white/60 backdrop-blur-sm border-0 h-full">
                <CardContent className="p-8">
                  <div className="text-center space-y-4">
                    <div className="bg-gradient-to-br from-pink-500 to-rose-500 h-20 w-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                      <span className="text-white text-3xl">💄</span>
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:souq-text-gradient transition-all duration-300">Beauty</h3>
                    <p className="text-muted-foreground leading-relaxed">Premium cosmetics & wellness</p>
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

      {/* Enhanced Call to Action */}
      <section className="souq-gradient-luxury text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 arabic-pattern opacity-10" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="font-display text-display font-bold mb-6">Ready to Explore Souq Masr?</h2>
            <p className="text-xl lg:text-2xl mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              Join thousands of satisfied customers who trust us for authentic Egyptian products and modern innovation
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/products">
                <Button size="xl" variant="elegant" className="text-lg px-12 py-6 glow-effect">
                  Browse All Products
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="xl" variant="outline" className="text-lg px-12 py-6 border-white/30 text-white hover:bg-white/10">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
