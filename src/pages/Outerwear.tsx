
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Filter } from 'lucide-react';

const Outerwear = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState('all');

  const defaultProducts = [
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

  useEffect(() => {
    // Load products from admin storage or use defaults
    const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const outerwearProducts = adminProducts.filter(p => p.category === 'Outerwear');
    
    const allProducts = outerwearProducts.length > 0 
      ? [...defaultProducts, ...outerwearProducts]
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
        case 'under-25':
          filtered = filtered.filter(product => product.price < 25);
          break;
        case '25-50':
          filtered = filtered.filter(product => product.price >= 25 && product.price <= 50);
          break;
        case 'over-50':
          filtered = filtered.filter(product => product.price > 50);
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
          <h1 className="text-4xl font-bold mb-4">Outerwear Collection</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stylish casual wear and comfortable everyday essentials
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
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
                  <SelectItem value="under-25">Under 25 L.E</SelectItem>
                  <SelectItem value="25-50">25-50 L.E</SelectItem>
                  <SelectItem value="over-50">Over 50 L.E</SelectItem>
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
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
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

export default Outerwear;
