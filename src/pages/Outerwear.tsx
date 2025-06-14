
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import VisitorTracker from '@/components/VisitorTracker';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Outerwear = () => {
  const [sortBy, setSortBy] = useState('newest');
  const [subcategoryFilter, setSubcategoryFilter] = useState('all');

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['outerwear-products', sortBy, subcategoryFilter],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .eq('category', 'Outerwear');
      
      if (subcategoryFilter !== 'all') {
        query = query.eq('subcategory', subcategoryFilter);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data.sort((a, b) => {
        switch (sortBy) {
          case 'price-low':
            return a.price - b.price;
          case 'price-high':
            return b.price - a.price;
          case 'newest':
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case 'name':
            return a.name.localeCompare(b.name);
          default:
            return 0;
        }
      });
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <VisitorTracker />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading products...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VisitorTracker />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Outerwear Collection</h1>
          <p className="text-muted-foreground mb-6">
            Stay warm and stylish with our premium outerwear collection
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Items</SelectItem>
                <SelectItem value="Jackets">Jackets</SelectItem>
                <SelectItem value="Hoodies">Hoodies</SelectItem>
                <SelectItem value="T-shirts">T-shirts</SelectItem>
                <SelectItem value="Vests">Vests</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 mb-6">
            <Badge variant="secondary">{products.length} products found</Badge>
            {subcategoryFilter !== 'all' && (
              <Badge variant="outline">Type: {subcategoryFilter}</Badge>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No outerwear found matching your criteria
              </p>
              <Button onClick={() => {
                setSubcategoryFilter('all');
                setSortBy('newest');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Outerwear;
