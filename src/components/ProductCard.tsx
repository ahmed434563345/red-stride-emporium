
import { useState } from 'react';
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
  originalPrice?: number;
  image: string;
  category: string;
  isNew?: boolean;
  inStock: boolean;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    
    setIsLoading(true);
    // Get existing cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Add product to cart with default size and quantity
    const cartItem = {
      ...product,
      quantity: 1,
      size: 'One Size', // Default for items added from card
      addedAt: new Date().toISOString()
    };
    
    const existingItemIndex = cart.findIndex(item => item.id === product.id);
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    if (!checkAuthentication()) return;
    
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    let updatedWishlist;
    
    if (isWishlisted) {
      updatedWishlist = wishlist.filter(item => item.id !== product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      updatedWishlist = [...wishlist, product];
      toast.success(`${product.name} added to wishlist!`);
    }
    
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setIsWishlisted(!isWishlisted);
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card className="group relative overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="relative">
        {/* Product Image */}
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden bg-gray-50">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isNew && (
            <Badge className="athletic-gradient border-0 text-white">NEW</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive">-{discountPercentage}%</Badge>
          )}
        </div>

        {/* Wishlist Button */}
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

        {/* Quick Add to Cart */}
        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock || isLoading}
            className="w-full athletic-gradient hover:opacity-90 transition-opacity"
          >
            {isLoading ? (
              "Adding..."
            ) : !product.inStock ? (
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

          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">{product.price} L.E</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice} L.E
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
