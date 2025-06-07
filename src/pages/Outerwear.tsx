
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';

const Outerwear = () => {
  const outerwearProducts = [
    {
      id: '6',
      name: 'American Eagle Black Graphic Tee',
      price: 25,
      originalPrice: 35,
      image: '/lovable-uploads/ecebd1a4-2de5-4911-bf69-38697a269054.png',
      category: 'Outerwear',
      inStock: true
    },
    {
      id: '7',
      name: 'American Eagle Olive Graphic Tee',
      price: 28,
      image: '/lovable-uploads/775ffd32-b47b-4081-b560-24e17fb8664a.png',
      category: 'Outerwear',
      inStock: true
    },
    {
      id: '8',
      name: 'American Eagle Black Logo Tee',
      price: 30,
      image: '/lovable-uploads/de24c74b-91b1-4393-8192-fe7522fa99be.png',
      category: 'Outerwear',
      inStock: true
    },
    {
      id: '9',
      name: 'American Eagle Teal Eagle Tee',
      price: 26,
      image: '/lovable-uploads/d7239c31-30da-4311-9456-7f8cdcb03b81.png',
      category: 'Outerwear',
      inStock: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Outerwear Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stylish casual wear and comfortable everyday essentials
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {outerwearProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Outerwear;
