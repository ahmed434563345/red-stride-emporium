
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import VisitorTracker from '@/components/VisitorTracker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const MenTShirts = () => {
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState('all');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [inStock, setInStock] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'Men / T-Shirts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', 'Men / T-Shirts');
      if (error) throw error;
      return data;
    }
  });

  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));
  const allColors = Array.from(new Set(products.flatMap(p => p.colors || []).filter(Boolean)));
  const allSizes = Array.from(new Set(products.flatMap(p => p.sizes || []).filter(Boolean)));

  useEffect(() => {
    let results = [...products];
    if (selectedBrands.length > 0) results = results.filter(p => p.brand && selectedBrands.includes(p.brand));
    if (selectedColors.length > 0) results = results.filter(p => p.colors && p.colors.some((c: string) => selectedColors.includes(c)));
    if (selectedSizes.length > 0) results = results.filter(p => p.sizes && p.sizes.some((s: string) => selectedSizes.includes(s)));
    if (inStock) results = results.filter(p => p.stock > 0);
    if (priceRange !== 'all') {
      const [min, max] = priceRange.split('-').map(Number);
      results = results.filter(p => max ? (p.price >= min && p.price <= max) : p.price >= min);
    }
    switch (sortBy) {
      case 'price-low': results.sort((a, b) => a.price - b.price); break;
      case 'price-high': results.sort((a, b) => b.price - a.price); break;
      case 'name': results.sort((a, b) => a.name.localeCompare(b.name)); break;
    }
    setFilteredProducts(results);
  }, [products, sortBy, priceRange, selectedBrands, selectedColors, selectedSizes, inStock]);

  const clearFilters = () => {
    setPriceRange('all'); setSortBy('relevance'); setSelectedBrands([]); setSelectedColors([]); setSelectedSizes([]); setInStock(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <VisitorTracker />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Men's T-Shirts</h1>
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-4 space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold flex items-center gap-2"><Filter className="h-4 w-4" />Filters</h3>
                  {(priceRange !== 'all' || selectedBrands.length > 0 || selectedColors.length > 0 || selectedSizes.length > 0 || inStock) && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>Clear</Button>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="stock" checked={inStock} onCheckedChange={(c) => setInStock(c as boolean)} />
                    <Label htmlFor="stock">In Stock Only</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-medium">Price</Label>
                  <Select value={priceRange} onValueChange={setPriceRange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Prices</SelectItem>
                      <SelectItem value="0-500">Under 500 L.E</SelectItem>
                      <SelectItem value="500-1500">500 - 1,500 L.E</SelectItem>
                      <SelectItem value="1500-3000">1,500 - 3,000 L.E</SelectItem>
                      <SelectItem value="3000">Above 3,000 L.E</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {brands.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-medium">Brand</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {brands.map(brand => (
                        <div key={brand} className="flex items-center space-x-2">
                          <Checkbox id={`b-${brand}`} checked={selectedBrands.includes(brand)} 
                            onCheckedChange={() => setSelectedBrands(p => p.includes(brand) ? p.filter(b => b !== brand) : [...p, brand])} />
                          <Label htmlFor={`b-${brand}`}>{brand}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {allColors.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-medium">Color</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {allColors.map(color => (
                        <div key={color} className="flex items-center space-x-2">
                          <Checkbox id={`c-${color}`} checked={selectedColors.includes(color)}
                            onCheckedChange={() => setSelectedColors(p => p.includes(color) ? p.filter(c => c !== color) : [...p, color])} />
                          <Label htmlFor={`c-${color}`}>{color}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {allSizes.length > 0 && (
                  <div className="space-y-2">
                    <Label className="font-medium">Size</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {allSizes.map(size => (
                        <div key={size} className="flex items-center space-x-2">
                          <Checkbox id={`s-${size}`} checked={selectedSizes.includes(size)}
                            onCheckedChange={() => setSelectedSizes(p => p.includes(size) ? p.filter(s => s !== size) : [...p, size])} />
                          <Label htmlFor={`s-${size}`}>{size}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <p className="text-muted-foreground">{filteredProducts.length} products found</p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {isLoading ? (
              <div className="text-center">Loading...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center text-muted-foreground">No T-Shirts found.</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MenTShirts;
