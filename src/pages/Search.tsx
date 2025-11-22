
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Search as SearchIcon, Filter, X, Loader2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  images?: string[];
  category: string;
  stock: number;
  is_new?: boolean;
  brand?: string;
  colors?: string[];
  sizes?: string[];
  description?: string;
  features?: string[];
}

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);

  // Fetch all products from Supabase
  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_archived', false);
      if (error) throw error;
      return data as Product[];
    }
  });

  // Extract unique values for filters
  const categories = Array.from(new Set(allProducts.map(p => p.category).filter(Boolean)));
  const brands = Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean)));
  const allColors = Array.from(new Set(allProducts.flatMap(p => p.colors || []).filter(Boolean)));
  const allSizes = Array.from(new Set(allProducts.flatMap(p => p.sizes || []).filter(Boolean)));

  // Generate suggestions based on actual product data
  const generateSuggestions = (query: string) => {
    const pastSearches = JSON.parse(localStorage.getItem('pastSearches') || '[]');
    const productNames = allProducts.map(p => p.name);
    const brandNames = Array.from(new Set(allProducts.map(p => p.brand).filter(Boolean)));
    
    const allSuggestions = [...pastSearches, ...productNames, ...brandNames, ...categories];
    return Array.from(new Set(allSuggestions))
      .filter(suggestion => 
        suggestion && suggestion.toLowerCase().includes(query.toLowerCase()) && suggestion !== query
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
    let results = [...allProducts];

    // Filter by search query - search across multiple fields
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(product =>
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.brand?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.colors?.some(c => c.toLowerCase().includes(query)) ||
        product.features?.some(f => f.toLowerCase().includes(query))
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      results = results.filter(product => product.category === selectedCategory);
    }

    // Filter by brands
    if (selectedBrands.length > 0) {
      results = results.filter(product => product.brand && selectedBrands.includes(product.brand));
    }

    // Filter by colors
    if (selectedColors.length > 0) {
      results = results.filter(product => 
        product.colors && product.colors.some(c => selectedColors.includes(c))
      );
    }

    // Filter by sizes
    if (selectedSizes.length > 0) {
      results = results.filter(product => 
        product.sizes && product.sizes.some(s => selectedSizes.includes(s))
      );
    }

    // Filter by stock availability
    if (inStock) {
      results = results.filter(product => product.stock > 0);
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
      case 'newest':
        results.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
        break;
      default: // relevance
        break;
    }

    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, priceRange, sortBy, allProducts, selectedBrands, selectedColors, selectedSizes, inStock]);

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
    setSelectedBrands([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setInStock(false);
  };

  const toggleBrand = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
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

        {/* Filters Layout */}
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filters
                  </h3>
                  {(selectedCategory !== 'all' || priceRange !== 'all' || selectedBrands.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || inStock) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  )}
                </div>

                {/* Stock Filter */}
                <div className="space-y-2">
                  <Label className="font-medium">Availability</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="in-stock" 
                      checked={inStock}
                      onCheckedChange={(checked) => setInStock(checked as boolean)}
                    />
                    <Label htmlFor="in-stock" className="cursor-pointer">In Stock Only</Label>
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <Label className="font-medium">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Filter */}
                <div className="space-y-2">
                  <Label className="font-medium">Price Range</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Prices" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-500">Under 500 L.E</SelectItem>
                      <SelectItem value="500-1500">500 - 1,500 L.E</SelectItem>
                      <SelectItem value="1500-3000">1,500 - 3,000 L.E</SelectItem>
                      <SelectItem value="3000">Above 3,000 L.E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Brand Filter */}
                {brands.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-medium">Brand</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {brands.map(brand => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`brand-${brand}`}
                            checked={selectedBrands.includes(brand)}
                            onCheckedChange={() => toggleBrand(brand)}
                          />
                          <Label htmlFor={`brand-${brand}`} className="cursor-pointer">{brand}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Color Filter */}
                {allColors.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-medium">Color</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {allColors.map(color => (
                        <div key={color} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`color-${color}`}
                            checked={selectedColors.includes(color)}
                            onCheckedChange={() => toggleColor(color)}
                          />
                          <Label htmlFor={`color-${color}`} className="cursor-pointer">{color}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Filter */}
                {allSizes.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-medium">Size</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {allSizes.map(size => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`size-${size}`}
                            checked={selectedSizes.includes(size)}
                            onCheckedChange={() => toggleSize(size)}
                          />
                          <Label htmlFor={`size-${size}`} className="cursor-pointer">{size}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Sort and Results Count */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-muted-foreground">
                {isLoading ? 'Loading...' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found${searchQuery ? ` for "${searchQuery}"` : ''}`}
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Active Filters Badges */}
            {(selectedCategory !== 'all' || priceRange !== 'all' || selectedBrands.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || inStock) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Category: {selectedCategory}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                  </Badge>
                )}
                {priceRange !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Price: {priceRange === '3000' ? 'Above 3,000 L.E' : `${priceRange} L.E`}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setPriceRange('all')} />
                  </Badge>
                )}
                {selectedBrands.map(brand => (
                  <Badge key={brand} variant="secondary" className="flex items-center gap-1">
                    Brand: {brand}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleBrand(brand)} />
                  </Badge>
                ))}
                {selectedColors.map(color => (
                  <Badge key={color} variant="secondary" className="flex items-center gap-1">
                    Color: {color}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleColor(color)} />
                  </Badge>
                ))}
                {selectedSizes.map(size => (
                  <Badge key={size} variant="secondary" className="flex items-center gap-1">
                    Size: {size}
                    <X className="h-3 w-3 cursor-pointer" onClick={() => toggleSize(size)} />
                  </Badge>
                ))}
                {inStock && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    In Stock Only
                    <X className="h-3 w-3 cursor-pointer" onClick={() => setInStock(false)} />
                  </Badge>
                )}
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="flex justify-center items-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
      </div>
    </div>
  );
};

export default Search;
