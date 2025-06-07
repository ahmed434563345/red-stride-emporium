
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';

const Shoes = () => {
  const shoeProducts = [
    {
      id: '1',
      name: 'Air Jordan 4 Retro "Bred"',
      price: 200,
      originalPrice: 250,
      image: '/lovable-uploads/9b98bff4-8569-4533-8eb7-e7a12673afc3.png',
      category: 'Shoes',
      isNew: true,
      inStock: true
    },
    {
      id: '3',
      name: 'Air Jordan 1 "University Blue"',
      price: 170,
      image: '/lovable-uploads/89e48b84-0586-4e14-b4e5-d11b38b4962c.png',
      category: 'Shoes',
      inStock: true
    },
    {
      id: '4',
      name: 'Yeezy Boost 350 V2 "Cream"',
      price: 220,
      image: '/lovable-uploads/70691133-4b92-4f11-ae0e-8c73f1267caa.png',
      category: 'Shoes',
      inStock: true
    },
    {
      id: '5',
      name: 'Air Jordan 4 "White Cement"',
      price: 210,
      image: '/lovable-uploads/1ca03270-8496-4b5d-aa10-394359a7f5f5.png',
      category: 'Shoes',
      inStock: true
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Premium Shoes</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Step up your game with our exclusive collection of premium sneakers and athletic footwear
          </p>
        </div>

        {/* Hero Banner */}
        <div className="athletic-gradient rounded-xl p-8 mb-12 text-white">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4">Latest Drops</h2>
              <p className="text-lg mb-6">Discover the newest releases from Jordan, Adidas, Nike and more</p>
              <div className="flex gap-4">
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Free Shipping</span>
                <span className="bg-white/20 px-3 py-1 rounded-full text-sm">Authentic Guarantee</span>
              </div>
            </div>
            <div className="text-right">
              <img 
                src="/lovable-uploads/135a03be-032e-4e44-8519-3a802d0192a0.png" 
                alt="Nike Logo" 
                className="w-32 h-16 object-contain ml-auto"
              />
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {shoeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shoes;
