import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter, Heart, ShoppingBag, ChevronRight, Star, Zap } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  inStock?: boolean;
  rating?: number;
  colorway?: string;
}

const ShoeCard = ({ product }: { product: Product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  return (
    <div 
      className="group relative bg-athletic-gray-light rounded-lg overflow-hidden transition-all duration-500 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.isNew && (
          <span className="bg-athletic-red text-athletic-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            New
          </span>
        )}
        {product.originalPrice && (
          <span className="bg-athletic-black text-athletic-white text-xs font-bold px-3 py-1 rounded-full">
            -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button 
        onClick={() => setIsWishlisted(!isWishlisted)}
        className="absolute top-4 right-4 z-10 p-2 bg-athletic-white/90 backdrop-blur-sm rounded-full shadow-lg transition-all duration-300 hover:scale-110"
      >
        <Heart 
          className={`w-5 h-5 transition-colors ${isWishlisted ? 'fill-athletic-red text-athletic-red' : 'text-athletic-black'}`} 
        />
      </button>

      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-square p-6 flex items-center justify-center overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-contain transition-all duration-700 ${isHovered ? 'scale-110 -rotate-12' : 'scale-100'}`}
          />
          
          {/* Hover gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t from-athletic-black/20 to-transparent transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-5 bg-athletic-white">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-athletic-black text-lg leading-tight mb-1 line-clamp-2 hover:text-athletic-red transition-colors">
            {product.name}
          </h3>
        </Link>
        
        {product.colorway && (
          <p className="text-athletic-gray/60 text-sm mb-2">{product.colorway}</p>
        )}

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-athletic-red text-athletic-red" />
            <span className="text-sm font-medium text-athletic-black">{product.rating || '4.8'}</span>
          </div>
          <span className="text-athletic-gray/40">|</span>
          <span className={`text-sm font-medium ${product.inStock !== false ? 'text-green-600' : 'text-athletic-red'}`}>
            {product.inStock !== false ? 'In Stock' : 'Sold Out'}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-athletic-black">{product.price} L.E</span>
            {product.originalPrice && (
              <span className="text-sm text-athletic-gray/50 line-through">{product.originalPrice} L.E</span>
            )}
          </div>

          <button 
            className="p-3 bg-athletic-red text-athletic-white rounded-full shadow-lg transition-all duration-300 hover:bg-athletic-red-dark hover:scale-110 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={product.inStock === false}
          >
            <ShoppingBag className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const Shoes = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');

  const defaultProducts: Product[] = [
    {
      id: '1',
      name: 'Air Jordan 4 Retro "Bred"',
      price: 200,
      image: '/lovable-uploads/135a03be-032e-4e44-8519-3a802d0192a0.png',
      category: 'Shoes',
      isNew: true,
      inStock: true,
      rating: 4.9,
      colorway: 'Black/Fire Red/Cement Grey'
    },
    {
      id: '3',
      name: 'Air Jordan 1 "University Blue"',
      price: 170,
      image: '/lovable-uploads/70691133-4b92-4f11-ae0e-8c73f1267caa.png',
      category: 'Shoes',
      inStock: false,
      rating: 4.7,
      colorway: 'University Blue/White/Black'
    },
    {
      id: '4',
      name: 'Nike Dunk Low "Panda"',
      price: 110,
      originalPrice: 130,
      image: '/lovable-uploads/9b98bff4-8569-4533-8eb7-e7a12673afc3.png',
      category: 'Shoes',
      inStock: true,
      rating: 4.8,
      colorway: 'White/Black'
    },
    {
      id: '5',
      name: 'Air Jordan 1 Mid "Chicago"',
      price: 120,
      image: '/lovable-uploads/89e48b84-0586-4e14-b4e5-d11b38b4962c.png',
      category: 'Shoes',
      inStock: true,
      rating: 4.9,
      colorway: 'Gym Red/White/Black'
    }
  ];

  useEffect(() => {
    const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const shoeProducts = adminProducts.filter((p: Product) => p.category === 'Shoes');
    
    const allProducts = shoeProducts.length > 0 
      ? [...defaultProducts, ...shoeProducts]
      : defaultProducts;
    
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceRange !== 'all') {
      switch (priceRange) {
        case 'under-100':
          filtered = filtered.filter(product => product.price < 100);
          break;
        case '100-150':
          filtered = filtered.filter(product => product.price >= 100 && product.price <= 150);
          break;
        case '150-200':
          filtered = filtered.filter(product => product.price >= 150 && product.price <= 200);
          break;
        case 'over-200':
          filtered = filtered.filter(product => product.price > 200);
          break;
      }
    }

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy, priceRange]);

  const clearFilters = () => {
    setSearchTerm('');
    setSortBy('name');
    setPriceRange('all');
  };

  return (
    <div className="min-h-screen bg-athletic-white">
      <Navigation />
      
      {/* Hero Section - Nike/FightClub inspired */}
      <section className="relative bg-athletic-black text-athletic-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-athletic-red/20 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-athletic-black to-transparent" />
        </div>
        
        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-athletic-red" />
                <span className="text-athletic-red font-bold uppercase tracking-widest text-sm">Limited Edition</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-black uppercase leading-none">
                <span className="text-athletic-white">Athletic</span>
                <br />
                <span className="text-athletic-red">Footwear</span>
              </h1>
              
              <p className="text-athletic-white/70 text-lg md:text-xl max-w-md">
                Discover the most exclusive sneaker drops. Premium quality, iconic designs, unmatched style.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button className="bg-athletic-red hover:bg-athletic-red-dark text-athletic-white font-bold px-8 py-6 text-lg rounded-full transition-all duration-300 hover:scale-105 shadow-lg">
                  Shop Now
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
                <Button variant="outline" className="border-athletic-white/30 text-athletic-white hover:bg-athletic-white/10 font-bold px-8 py-6 text-lg rounded-full">
                  New Arrivals
                </Button>
              </div>
            </div>
            
            <div className="relative hidden md:block">
              <div className="absolute inset-0 bg-athletic-red/10 rounded-full blur-3xl scale-150" />
              <img 
                src="/lovable-uploads/135a03be-032e-4e44-8519-3a802d0192a0.png" 
                alt="Featured Shoe"
                className="relative w-full max-w-lg mx-auto transform -rotate-12 hover:rotate-0 transition-transform duration-700 floating-animation drop-shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-1/2 left-0 w-32 h-32 bg-athletic-red/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-athletic-red/20 rounded-full blur-3xl" />
      </section>

      {/* Categories Bar */}
      <section className="bg-athletic-gray-light border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex gap-8 overflow-x-auto py-4 scrollbar-hide">
            {['All', 'Jordan', 'Nike', 'Dunk', 'Air Force', 'Yeezy', 'New Balance'].map((cat) => (
              <button 
                key={cat}
                className="text-athletic-black font-bold text-sm uppercase tracking-wider whitespace-nowrap hover:text-athletic-red transition-colors pb-2 border-b-2 border-transparent hover:border-athletic-red"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Bar */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-athletic-gray/50 h-5 w-5" />
              <Input
                placeholder="Search sneakers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 py-6 bg-athletic-gray-light border-0 rounded-full text-athletic-black placeholder:text-athletic-gray/50 focus-visible:ring-athletic-red"
              />
            </div>

            <div className="flex flex-wrap gap-3 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-44 bg-athletic-gray-light border-0 rounded-full text-athletic-black">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-44 bg-athletic-gray-light border-0 rounded-full text-athletic-black">
                  <SelectValue placeholder="Price range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="under-100">Under 100 L.E</SelectItem>
                  <SelectItem value="100-150">100-150 L.E</SelectItem>
                  <SelectItem value="150-200">150-200 L.E</SelectItem>
                  <SelectItem value="over-200">Over 200 L.E</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="border-athletic-black/20 text-athletic-black hover:bg-athletic-red hover:text-athletic-white hover:border-athletic-red rounded-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-athletic-gray/70 font-medium">
              Showing <span className="text-athletic-black font-bold">{filteredProducts.length}</span> of {products.length} products
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div 
              key={product.id} 
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ShoeCard product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-athletic-gray-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-athletic-gray/50" />
            </div>
            <h3 className="text-2xl font-bold text-athletic-black mb-2">No sneakers found</h3>
            <p className="text-athletic-gray/70 mb-6">Try adjusting your search or filters</p>
            <Button 
              onClick={clearFilters} 
              className="bg-athletic-red hover:bg-athletic-red-dark text-athletic-white rounded-full px-8"
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <section className="bg-athletic-black text-athletic-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4">Never Miss a Drop</h2>
          <p className="text-athletic-white/70 mb-8 max-w-md mx-auto">
            Subscribe to get early access to exclusive releases and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input 
              placeholder="Enter your email" 
              className="bg-athletic-white/10 border-athletic-white/20 text-athletic-white placeholder:text-athletic-white/50 rounded-full py-6"
            />
            <Button className="bg-athletic-red hover:bg-athletic-red-dark text-athletic-white font-bold px-8 py-6 rounded-full whitespace-nowrap">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Shoes;
