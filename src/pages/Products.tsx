
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [filterCategory, setFilterCategory] = useState('all');

  // Mock products data using uploaded images
  const allProducts = [
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
      id: '2',
      name: 'Barcelona Home Jersey 2024',
      price: 90,
      image: '/lovable-uploads/0e229d93-8ed2-4475-9fa4-c9dc86c63f76.png',
      category: 'Athletic Wear',
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
    },
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

  // Filter and sort products
  const filteredProducts = allProducts
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">All Products</h1>
          <p className="text-muted-foreground">
            Discover our complete collection of premium athletic wear and footwear
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4 lg:space-y-0 lg:flex lg:items-center lg:justify-between">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Shoes">Shoes</SelectItem>
                <SelectItem value="Athletic Wear">Athletic Wear</SelectItem>
                <SelectItem value="Outerwear">Outerwear</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Sort */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="name">Name: A to Z</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} of {allProducts.length} products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No products found</p>
            <Button
              onClick={() => {
                setSearchQuery('');
                setFilterCategory('all');
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
