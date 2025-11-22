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

      {/* Deals Banner Section */}
      <section className="bg-gray-900 text-white py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h3 className="text-xl font-bold">NEW DEALS <span className="text-yellow-400">EVERY DAY</span></h3>
              <div className="hidden md:flex items-center gap-2">
                {[20, 21, 22, 23, 24, 25, 26, 27, 28].map((day) => (
                  <div key={day} className="flex flex-col items-center bg-gray-700 px-3 py-1 rounded text-xs">
                    <span className="text-gray-400 text-[10px]">Nov</span>
                    <span className="font-bold">{day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promotional Banner */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-3xl font-bold">SOUQ*</div>
              <div>
                <div className="text-xl font-bold">INSTALLMENTS UP TO 6 MONTHS</div>
                <div className="text-sm opacity-90">When paying with Souq Card</div>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold">0%</div>
                <div className="text-xs">Interest</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">0%</div>
                <div className="text-xs">Purchase Fees</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold">0%</div>
                <div className="text-xs">Down payment</div>
              </div>
              <div className="text-xs">*T&Cs apply</div>
            </div>
          </div>
        </div>
      </section>

      {/* Special Deals Hero Banner */}
      <section className="bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 text-white py-16 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center space-y-6">
              <h2 className="text-6xl md:text-7xl font-bold animate-pulse">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300">
                  SPECIAL FRIDAY
                </span>
              </h2>
              <h3 className="text-4xl md:text-5xl font-bold text-cyan-400">MEGA DEALS</h3>
              <p className="text-2xl md:text-3xl font-semibold">
                UP TO <span className="text-5xl text-yellow-300 font-bold">-50%</span>
              </p>
              <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white text-xl px-12 py-6 rounded-xl border-2 border-white/30">
                SHOP NOW
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4">
          {[...Array(7)].map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all ${
                i === 1 ? 'w-8 bg-yellow-400' : 'w-1 bg-white/50'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Quick Category Links */}
      <section className="bg-background py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <button className="flex-shrink-0">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {[
              { label: 'Top-Selling Deals', emoji: '🏷️', color: 'from-yellow-400 to-yellow-500' },
              { label: "Don't Miss Out", emoji: '⚡', color: 'from-red-500 to-pink-500' },
              { label: 'Deals', emoji: '🎯', color: 'from-red-600 to-red-700' },
              { label: 'Bundles', emoji: '🎁', color: 'from-gray-600 to-gray-700' },
              { label: 'Coupon Zone', emoji: '🎫', color: 'from-pink-500 to-red-500' },
              { label: 'Installments', emoji: '👕', color: 'from-purple-500 to-purple-600' },
              { label: 'Supermarket', emoji: '🛒', color: 'from-pink-400 to-pink-500' },
              { label: 'Home & Kitchen', emoji: '🏠', color: 'from-yellow-500 to-orange-500' },
              { label: 'Baby', emoji: '👶', color: 'from-blue-400 to-blue-500' },
              { label: 'Beauty', emoji: '💄', color: 'from-pink-300 to-pink-400' },
              { label: "Women's Fashion", emoji: '👗', color: 'from-purple-400 to-purple-500' },
              { label: "Men's Fashion", emoji: '👔', color: 'from-gray-700 to-gray-800' },
            ].map((category, index) => (
              <Link
                key={index}
                to="/products"
                className="flex-shrink-0 flex flex-col items-center gap-2 group"
              >
                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-200 shadow-lg`}>
                  {category.emoji}
                </div>
                <span className="text-xs text-center font-medium max-w-[80px] leading-tight">
                  {category.label}
                </span>
              </Link>
            ))}

            <button className="flex-shrink-0">
              <svg className="w-8 h-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
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
