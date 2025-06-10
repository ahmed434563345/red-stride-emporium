
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

const Shoes = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');

  const defaultProducts = [
    {
      id: '1',
      name: 'Air Jordan 4 Retro "Bred"',
      price: 200,
      image: '/lovable-uploads/135a03be-032e-4e44-8519-3a802d0192a0.png',
      category: 'Shoes',
      isNew: true,
      inStock: true
    },
    {
      id: '3',
      name: 'Air Jordan 1 "University Blue"',
      price: 170,
      image: '/lovable-uploads/70691133-4b92-4f11-ae0e-8c73f1267caa.png',
      category: 'Shoes',
      inStock: false
    },
    {
      id: '4',
      name: 'Nike Dunk Low "Panda"',
      price: 110,
      originalPrice: 130,
      image: '/lovable-uploads/9b98bff4-8569-4533-8eb7-e7a12673afc3.png',
      category: 'Shoes',
      inStock: true
    },
    {
      id: '5',
      name: 'Air Jordan 1 Mid "Chicago"',
      price: 120,
      image: '/lovable-uploads/89e48b84-0586-4e14-b4e5-d11b38b4962c.png',
      category: 'Shoes',
      inStock: true
    }
  ];

  useEffect(() => {
    // Load products from admin storage or use defaults
    const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const shoeProducts = adminProducts.filter(p => p.category === 'Shoes');
    
    const allProducts = shoeProducts.length > 0 
      ? [...defaultProducts, ...shoeProducts]
      : defaultProducts;
    
    setProducts(allProducts);
    setFilteredProducts(allProducts);
  }, []);

  useEffect(() => {
    let filtered = [...products];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Price range filter
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

    // Sort products
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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Premium Sneakers</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover the latest and most exclusive sneaker drops
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search shoes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-4 items-center">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={priceRange} onValueChange={setPriceRange}>
                <SelectTrigger className="w-40">
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

              <Button variant="outline" onClick={clearFilters}>
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <div className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {products.length} products
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <h3 className="text-lg font-semibold mb-2">No shoes found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button onClick={clearFilters} variant="outline">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shoes;
