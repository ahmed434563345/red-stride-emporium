import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import VisitorTracker from '@/components/VisitorTracker';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

const Index = () => {
  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .limit(4);
      if (error) throw error;
      return data;
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
      return data;
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
      return data;
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
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VisitorTracker />
      
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
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Check out our hand-picked selection of the hottest athletic gear
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Shop by Category - Made Smaller */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-3">Shop by Category</h2>
            <p className="text-muted-foreground">Find exactly what you're looking for</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <Link to="/shoes" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="athletic-gradient h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">👟</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Shoes</h3>
                    <p className="text-sm text-muted-foreground">Sneakers, Running, Basketball</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/athletic-wear" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="athletic-gradient h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">👕</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Athletic Wear</h3>
                    <p className="text-sm text-muted-foreground">Jerseys, T-shirts, Shorts</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to="/outerwear" className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-center">
                    <div className="athletic-gradient h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold">🧥</span>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Outerwear</h3>
                    <p className="text-sm text-muted-foreground">Jackets, Hoodies, Vests</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">New Arrivals</h2>
            <p className="text-muted-foreground">Fresh styles just dropped</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Athletic Wear Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Athletic Wear</h2>
            <p className="text-muted-foreground">Performance gear for every sport</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {athleticWear.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Outerwear Collection */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Outerwear Collection</h2>
            <p className="text-muted-foreground">Stay comfortable in any weather</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {outerwear.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

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
