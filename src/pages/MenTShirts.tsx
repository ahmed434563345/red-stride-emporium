
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import VisitorTracker from '@/components/VisitorTracker';

const MenTShirts = () => {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'Men / T-Shirts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'Men / T-Shirts');
      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VisitorTracker />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Men's T-Shirts</h1>
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : products.length === 0 ? (
          <div className="text-center text-muted-foreground">No T-Shirts found for men.</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default MenTShirts;
