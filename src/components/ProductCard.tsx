
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  images?: string[];
  image?: string;
  category: string;
  stock: number;
  is_new?: boolean;
  brand?: string;
}

interface ProductCardProps {
  product: Product;
  onWishlistChange?: (productId: string) => void;
}

const ProductCard = ({ product, onWishlistChange }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Get the first image from images array or fallback to image prop
  const productImage = product.images?.[0] || product.image || '/placeholder.svg';

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    setIsWishlisted(wishlist.some((item: any) => item.id === product.id));
  }, [product.id]);

  const checkAuthentication = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please sign in to use this feature');
      navigate('/signin');
      return false;
    }
    return true;
  };

  const handleAddToCart = async () => {
    if (!checkAuthentication()) return;
    
    if (product.stock <= 0) {
      toast.error('Product is out of stock');
      return;
    }
    
    setIsLoading(true);
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    const cartItem = {
      ...product,
      quantity: 1,
      size: 'One Size',
      addedAt: new Date().toISOString()
    };
    
    const existingItemIndex = cart.findIndex((item: any) => item.id === product.id);
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Trigger cart update event
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    if (!checkAuthentication()) return;
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let updatedWishlist;
    
    if (isWishlisted) {
      updatedWishlist = wishlist.filter((item: any) => item.id !== product.id);
      toast.success(`${product.name} removed from wishlist`);
      onWishlistChange?.(product.id);
    } else {
      updatedWishlist = [...wishlist, product];
      toast.success(`${product.name} added to wishlist!`);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);
    
    // Trigger wishlist update event
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  const discountPercentage = product.original_price 
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const inStock = product.stock > 0;

  return (
    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden bg-gray-50">
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 p-4"
            />
          </div>
        </Link>

        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.is_new && (
            <Badge className="athletic-gradient border-0 text-white">NEW</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive">-{discountPercentage}%</Badge>
          )}
          {!inStock && (
            <Badge variant="secondary">Out of Stock</Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 h-8 w-8 ${
            isWishlisted ? 'text-red-500' : 'text-gray-400'
          } hover:text-red-500 bg-white/80 backdrop-blur-sm`}
          onClick={handleToggleWishlist}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>

        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isLoading}
            className="w-full athletic-gradient hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              "Adding..."
            ) : !inStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          
          <Link to={`/product/${product.id}`}>
            <h3 className="font-medium text-sm hover:text-primary transition-colors line-clamp-2">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{product.price} L.E</span>
              {product.original_price && (
                <span className="text-sm text-muted-foreground line-through">
                  {product.original_price} L.E
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Stock: {product.stock}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
