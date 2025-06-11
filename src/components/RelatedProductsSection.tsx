
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface RelatedProductsSectionProps {
  currentProductId: string;
  category: string;
}

const RelatedProductsSection = ({ currentProductId, category }: RelatedProductsSectionProps) => {
  const { data: relatedProducts = [] } = useQuery({
    queryKey: ['related-products', category, currentProductId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', currentProductId)
        .limit(4);
      
      if (error) throw error;
      return data;
    }
  });

  if (relatedProducts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Related Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatedProductsSection;
