import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import ProductSection from '@/components/ProductSection';
import { ArrowRight, Truck, Shield, RotateCcw } from 'lucide-react';

const Index = () => {
  const hotTrendyShoes = [
    {
      id: '1',
      name: 'Air Jordan 4 Retro "Bred"',
      price: 200,
      original_price: 250,
      image: '/lovable-uploads/9b98bff4-8569-4533-8eb7-e7a12673afc3.png',
      category: 'Shoes',
      stock: 15,
      is_new: true,
      brand: 'Jordan'
    },
    {
      id: '3',
      name: 'Air Jordan 1 "University Blue"',
      price: 170,
      image: '/lovable-uploads/89e48b84-0586-4e14-b4e5-d11b38b4962c.png',
      category: 'Shoes',
      stock: 12,
      brand: 'Jordan'
    },
    {
      id: '4',
      name: 'Yeezy Boost 350 V2 "Cream"',
      price: 220,
      image: '/lovable-uploads/70691133-4b92-4f11-ae0e-8c73f1267caa.png',
      category: 'Shoes',
      stock: 8,
      brand: 'Adidas'
    },
    {
      id: '5',
      name: 'Air Jordan 4 "White Cement"',
      price: 210,
      image: '/lovable-uploads/1ca03270-8496-4b5d-aa10-394359a7f5f5.png',
      category: 'Shoes',
      stock: 20,
      brand: 'Jordan'
    }
  ];

  const athleticWear = [
    {
      id: '2',
      name: 'Barcelona Home Jersey 2024',
      price: 90,
      image: '/lovable-uploads/0e229d93-8ed2-4475-9fa4-c9dc86c63f76.png',
      category: 'Athletic Wear',
      stock: 25,
      is_new: true,
      brand: 'Nike'
    },
    {
      id: '6',
      name: 'Nike Dri-FIT Training Shirt',
      price: 45,
      image: '/lovable-uploads/0e229d93-8ed2-4475-9fa4-c9dc86c63f76.png',
      category: 'Athletic Wear',
      stock: 30,
      brand: 'Nike'
    },
    {
      id: '10',
      name: 'Adidas Performance Tank',
      price: 35,
      image: '/lovable-uploads/0e229d93-8ed2-4475-9fa4-c9dc86c63f76.png',
      category: 'Athletic Wear',
      stock: 18,
      brand: 'Adidas'
    },
    {
      id: '11',
      name: 'Under Armour Training Shorts',
      price: 55,
      image: '/lovable-uploads/0e229d93-8ed2-4475-9fa4-c9dc86c63f76.png',
      category: 'Athletic Wear',
      stock: 22,
      brand: 'Under Armour'
    }
  ];

  const outerwear = [
    {
      id: '7',
      name: 'American Eagle Olive Graphic Tee',
      price: 28,
      image: '/lovable-uploads/775ffd32-b47b-4081-b560-24e17fb8664a.png',
      category: 'Outerwear',
      stock: 35,
      brand: 'American Eagle'
    },
    {
      id: '9',
      name: 'American Eagle Teal Eagle Tee',
      price: 26,
      image: '/lovable-uploads/d7239c31-30da-4311-9456-7f8cdcb03b81.png',
      category: 'Outerwear',
      stock: 28,
      brand: 'American Eagle'
    },
    {
      id: '12',
      name: 'Nike Tech Fleece Hoodie',
      price: 85,
      image: '/lovable-uploads/775ffd32-b47b-4081-b560-24e17fb8664a.png',
      category: 'Outerwear',
      stock: 16,
      brand: 'Nike'
    },
    {
      id: '13',
      name: 'Adidas Wind Jacket',
      price: 75,
      image: '/lovable-uploads/775ffd32-b47b-4081-b560-24e17fb8664a.png',
      category: 'Outerwear',
      stock: 14,
      brand: 'Adidas'
    }
  ];

  const categories = [
    {
      name: 'Shoes',
      description: 'Premium sneakers and athletic footwear',
      image: '/lovable-uploads/89e48b84-0586-4e14-b4e5-d11b38b4962c.png',
      link: '/shoes'
    },
    {
      name: 'Athletic Wear',
      description: 'Performance jerseys and sportswear',
      image: '/lovable-uploads/0e229d93-8ed2-4475-9fa4-c9dc86c63f76.png',
      link: '/athletic-wear'
    },
    {
      name: 'Outerwear',
      description: 'Stylish jackets and casual wear',
      image: '/lovable-uploads/775ffd32-b47b-4081-b560-24e17fb8664a.png',
      link: '/outerwear'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="athletic-gradient">
          <div className="container mx-auto px-4 py-20 lg:py-32">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-white space-y-6">
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  New Collection 2024
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Elevate Your
                  <span className="block">Athletic Style</span>
                </h1>
                <p className="text-xl text-white/90 max-w-lg">
                  Discover premium athletic wear, exclusive sneakers, and performance gear from top brands. 
                  Built for athletes, designed for champions.
                </p>
                <div className="flex gap-4">
                  <Link to="/products">
                    <Button size="lg" className="bg-white text-red-600 hover:bg-white/90">
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/shoes">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      View Shoes
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <img 
                    src="/lovable-uploads/9b98bff4-8569-4533-8eb7-e7a12673afc3.png" 
                    alt="Featured Shoe" 
                    className="rounded-lg shadow-2xl transform rotate-12 hover:rotate-6 transition-transform duration-300"
                  />
                  <img 
                    src="/lovable-uploads/89e48b84-0586-4e14-b4e5-d11b38b4962c.png" 
                    alt="Featured Shoe" 
                    className="rounded-lg shadow-2xl transform -rotate-12 hover:-rotate-6 transition-transform duration-300 mt-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore our curated collections of premium athletic wear, footwear, and accessories
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link key={category.name} to={category.link}>
                <div className="group relative overflow-hidden rounded-xl bg-gray-100 aspect-[4/5] hover:shadow-xl transition-all duration-300">
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                    <p className="text-white/90">{category.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Hot Trendy Shoes Section */}
      <ProductSection
        title="Hot Trendy Shoes"
        description="The hottest and most trending sneakers of the season"
        products={hotTrendyShoes}
        viewAllLink="/shoes"
      />

      {/* Athletic Wear Section */}
      <div className="bg-gray-50">
        <ProductSection
          title="Athletic Wear"
          description="Performance gear for athletes and fitness enthusiasts"
          products={athleticWear}
          viewAllLink="/athletic-wear"
        />
      </div>

      {/* Outerwear Section */}
      <ProductSection
        title="Outerwear"
        description="Stylish jackets and casual wear for every occasion"
        products={outerwear}
        viewAllLink="/outerwear"
      />

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="athletic-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Free Shipping</h3>
              <p className="text-muted-foreground">Free shipping on orders over 1700 L.E</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="athletic-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Authentic Products</h3>
              <p className="text-muted-foreground">100% authentic products guaranteed</p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="athletic-gradient w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <RotateCcw className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold">Easy Returns</h3>
              <p className="text-muted-foreground">30-day hassle-free returns</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="athletic-gradient h-8 w-8 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold">Athletic</span>
              </div>
              <p className="text-gray-400">
                Premium athletic wear and footwear for champions.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <div className="space-y-2">
                <Link to="/products" className="block text-gray-400 hover:text-white transition-colors">All Products</Link>
                <Link to="/shoes" className="block text-gray-400 hover:text-white transition-colors">Shoes</Link>
                <Link to="/athletic-wear" className="block text-gray-400 hover:text-white transition-colors">Athletic Wear</Link>
                <Link to="/outerwear" className="block text-gray-400 hover:text-white transition-colors">Outerwear</Link>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Customer Service</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Contact Us</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Size Guide</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Shipping Info</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Returns</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <div className="space-y-2">
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Instagram</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">Facebook</a>
                <a href="#" className="block text-gray-400 hover:text-white transition-colors">YouTube</a>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 Athletic. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
