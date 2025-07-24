import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface ProductSuggestionsProps {
  currentProductId?: string;
  category?: string;
  limit?: number;
}

const ProductSuggestions = ({ 
  currentProductId, 
  category,
  limit = 4 
}: ProductSuggestionsProps) => {
  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ['product-suggestions', currentProductId, category],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*')
        .limit(limit);

      // If we have a current product, exclude it
      if (currentProductId) {
        query = query.neq('id', currentProductId);
      }

      // If we have a category, filter by it, otherwise get random products
      if (category) {
        query = query.eq('category', category);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Shuffle the results for better variety
      return data?.sort(() => Math.random() - 0.5) || [];
    }
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Suggested for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="h-64 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (suggestions.length === 0) return null;

  return (
    <Card className="fade-in-up">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          {category ? `More from ${category}` : 'Suggested for You'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {suggestions.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductSuggestions;