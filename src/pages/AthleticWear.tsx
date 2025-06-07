
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';

const AthleticWear = () => {
  const athleticProducts = [
    {
      id: '2',
      name: 'Barcelona Home Jersey 2024',
      price: 90,
      image: '/lovable-uploads/0e229d93-8ed2-4475-9fa4-c9dc86c63f76.png',
      category: 'Athletic Wear',
      isNew: true,
      inStock: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Athletic Wear</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Performance jerseys and sportswear for champions
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {athleticProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AthleticWear;
