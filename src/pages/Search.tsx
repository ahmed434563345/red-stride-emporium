
import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search as SearchIcon, Filter, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image: string;
  category: string;
  stock: number;
  is_new?: boolean;
  brand?: string;
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Mock products data
  const allProducts: Product[] = [
    {
      id: '1',
      name: 'Air Jordan 4 Retro "Bred"',
      price: 3400,
      original_price: 4000,
      image: '/lovable-uploads/9b98bff4-8569-4533-8eb7-e7a12673afc3.png',
      category: 'Shoes',
      stock: 15,
      is_new: true,
      brand: 'Jordan'
    },
    {
      id: '2',
      name: 'Barcelona Home Jersey 2024',
      price: 1530,
      image: '/lovable-uploads/0e229d93-8ed2-4475-9fa4-c9dc86c63f76.png',
      category: 'Athletic Wear',
      stock: 25,
      brand: 'Nike'
    },
    {
      id: '3',
      name: 'American Eagle Black Graphic Tee',
      price: 425,
      image: '/lovable-uploads/ecebd1a4-2de5-4911-bf69-38697a269054.png',
      category: 'Athletic Wear',
      stock: 30,
      brand: 'American Eagle'
    },
    {
      id: '4',
      name: 'Air Jordan 1 "University Blue"',
      price: 2890,
      image: '/lovable-uploads/70691133-4b92-4f11-ae0e-8c73f1267caa.png',
      category: 'Shoes',
      stock: 0,
      brand: 'Jordan'
    }
  ];

  // Mock suggestions based on search query
  const generateSuggestions = (query: string) => {
    const popularSearches = ['jordan', 'nike', 'barcelona', 'athletic wear', 'sneakers', 'jersey'];
    const pastSearches = JSON.parse(localStorage.getItem('pastSearches') || '[]');
    
    const allSuggestions = [...popularSearches, ...pastSearches];
    return allSuggestions.filter(suggestion => 
      suggestion.toLowerCase().includes(query.toLowerCase()) && suggestion !== query
    ).slice(0, 5);
  };

  useEffect(() => {
    if (searchQuery.length > 0) {
      setSuggestions(generateSuggestions(searchQuery));
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    let results = allProducts;

    // Filter by search query
    if (searchQuery) {
      results = results.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory);
    }

    // Filter by price range
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      results = results.filter(product => {
        if (max) {
          return product.price >= min && product.price <= max;
        } else {
          return product.price >= min;
        }
      });
    }

    // Sort results
    switch (sortBy) {
      case 'price-low':
        results.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        results.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // relevance
        break;
    }

    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, priceRange, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(false);
    
    // Save to past searches
    const pastSearches = JSON.parse(localStorage.getItem('pastSearches') || '[]');
    if (!pastSearches.includes(query) && query.trim()) {
      pastSearches.unshift(query);
      localStorage.setItem('pastSearches', JSON.stringify(pastSearches.slice(0, 10)));
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setSortBy('relevance');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Search Products</h1>
          
          {/* Search Input */}
          <div className="relative max-w-2xl">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for shoes, athletic wear, or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
                className="pl-10 pr-4 py-3 text-lg"
              />
            </div>
            
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-1 z-50">
                <CardContent className="p-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full text-left px-3 py-2 hover:bg-muted rounded-md transition-colors"
                      onClick={() => handleSearch(suggestion)}
                    >
                      <SearchIcon className="inline-block mr-2 h-3 w-3 text-muted-foreground" />
                      {suggestion}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap gap-4 mb-6 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Shoes">Shoes</SelectItem>
              <SelectItem value="Athletic Wear">Athletic Wear</SelectItem>
              <SelectItem value="Outerwear">Outerwear</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Price Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              <SelectItem value="0-500">Under 500 L.E</SelectItem>
              <SelectItem value="500-1500">500 - 1,500 L.E</SelectItem>
              <SelectItem value="1500-3000">1,500 - 3,000 L.E</SelectItem>
              <SelectItem value="3000">Above 3,000 L.E</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>

          {(selectedCategory !== 'all' || priceRange !== 'all' || sortBy !== 'relevance') && (
            <Button variant="outline" onClick={clearFilters} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Clear Filters
            </Button>
          )}
        </div>

        {/* Active Filters */}
        {(selectedCategory !== 'all' || priceRange !== 'all') && (
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedCategory !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Category: {selectedCategory}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setSelectedCategory('all')}
                />
              </Badge>
            )}
            {priceRange !== 'all' && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Price: {priceRange === '3000' ? 'Above 3,000 L.E' : `${priceRange} L.E`}
                <X 
                  className="h-3 w-3 cursor-pointer" 
                  onClick={() => setPriceRange('all')}
                />
              </Badge>
            )}
          </div>
        )}

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <SearchIcon className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={clearFilters}>Clear all filters</Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
