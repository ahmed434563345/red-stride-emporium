
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Heart, ShoppingCart, Phone, MessageCircle, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  isNew?: boolean;
  inStock: boolean;
  description: string;
  sizes?: string[];
  colors?: string[];
  features?: string[];
  brand?: string;
  stock?: number;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Default products for fallback
  const defaultProducts = [
    {
      id: '1',
      name: 'Air Jordan 4 Retro "Bred"',
      price: 3400,
      originalPrice: 4250,
      image: '/lovable-uploads/9b98bff4-8569-4533-8eb7-e7a12673afc3.png',
      category: 'Shoes',
      isNew: true,
      inStock: true,
      description: 'The Air Jordan 4 Retro "Bred" brings back the iconic colorway from 1989. Featuring premium leather upper with mesh panels, visible Air cushioning, and the classic Jordan 4 silhouette.',
      sizes: ['7', '7.5', '8', '8.5', '9', '9.5', '10', '10.5', '11', '11.5', '12'],
      colors: ['Black/Red', 'White/Cement'],
      features: [
        'Premium leather and mesh upper',
        'Air cushioning in heel and forefoot',
        'Rubber outsole with herringbone pattern',
        'Iconic Flight logo on tongue'
      ],
      brand: 'Nike',
      stock: 25
    }
  ];

  useEffect(() => {
    // Load product from admin products or defaults
    const adminProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
    const allProducts = [...defaultProducts, ...adminProducts];
    
    const foundProduct = allProducts.find(p => p.id === id);
    
    if (foundProduct) {
      setProduct(foundProduct);
      
      // Add to recently viewed
      const viewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
      const updatedViewed = [foundProduct, ...viewed.filter(item => item.id !== foundProduct.id)].slice(0, 5);
      localStorage.setItem('recentlyViewed', JSON.stringify(updatedViewed));
      setRecentlyViewed(updatedViewed.slice(1));
      
      // Check if wishlisted
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setIsWishlisted(wishlist.some(item => item.id === foundProduct.id));
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error('Please select a color');
      return;
    }
    
    const cartItem = {
      ...product,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      addedAt: new Date().toISOString()
    };
    
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItemIndex = cart.findIndex(item => 
      item.id === product.id && 
      item.size === selectedSize && 
      item.color === selectedColor
    );
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += quantity;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Send order notification
    const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
    notifications.unshift({
      id: Date.now(),
      type: 'order',
      productName: product.name,
      quantity: quantity,
      timestamp: new Date().toISOString(),
      read: false
    });
    localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let updatedWishlist;
    
    if (isWishlisted) {
      updatedWishlist = wishlist.filter(item => item.id !== product.id);
      toast.success('Removed from wishlist');
    } else {
      updatedWishlist = [...wishlist, product];
      toast.success('Added to wishlist!');
    }
    
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/products">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productImages = product.images && product.images.length > 0 ? product.images : [product.image];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title={product.seoTitle || `${product.name} - Athletic Store`}
        description={product.seoDescription || product.description}
        keywords={product.seoKeywords || `${product.category}, ${product.brand}, ${product.name}`.toLowerCase()}
        image={product.image}
        type="product"
      />
      
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Home</Link>
          <span className="mx-2">/</span>
          <Link to="/products" className="hover:text-primary">Products</Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <img
                src={productImages[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            {productImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {productImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-primary' : 'border-gray-200'
                    }`}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary">{product.category}</Badge>
                {product.isNew && (
                  <Badge className="athletic-gradient border-0 text-white">NEW</Badge>
                )}
                {discountPercentage > 0 && (
                  <Badge variant="destructive">-{discountPercentage}%</Badge>
                )}
              </div>
              
              {product.brand && (
                <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
              )}
              
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl font-bold text-primary">{product.price} L.E</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {product.originalPrice} L.E
                  </span>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
              
              {product.stock !== undefined && (
                <p className="text-sm text-muted-foreground">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </p>
              )}
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Size</label>
                <Select value={selectedSize} onValueChange={setSelectedSize}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.sizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium">Color</label>
                <Select value={selectedColor} onValueChange={setSelectedColor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.colors.map((color) => (
                      <SelectItem key={color} value={color}>
                        {color}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium min-w-[2rem] text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 athletic-gradient hover:opacity-90"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleWishlist}
                className={isWishlisted ? 'text-red-500 border-red-500' : ''}
              >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </Button>
            </div>

            {/* Contact Options */}
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1">
                <Phone className="mr-2 h-4 w-4" />
                Call: +20 123 456 789
              </Button>
              <Button variant="outline" className="flex-1">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </div>
        </div>

        {/* Product Features */}
        {product.features && product.features.length > 0 && (
          <>
            <Separator className="mb-8" />
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Product Features</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {product.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <>
            <Separator className="mb-8" />
            <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Recently Viewed</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {recentlyViewed.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
