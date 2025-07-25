
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
    <Card className="group relative overflow-hidden border-0 shadow-elegant hover:shadow-luxury hover-lift bg-white/80 backdrop-blur-sm">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden bg-gradient-to-br from-souq-cream to-souq-sand">
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-contain transition-all duration-500 group-hover:scale-110 p-6"
            />
          </div>
        </Link>

        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && (
            <Badge className="souq-gradient border-0 text-white shadow-md font-semibold animate-fade-in">NEW</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge variant="destructive" className="shadow-md font-semibold animate-zoom-in">-{discountPercentage}%</Badge>
          )}
          {!inStock && (
            <Badge variant="secondary" className="shadow-md">Out of Stock</Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 h-10 w-10 rounded-full ${
            isWishlisted ? 'text-red-500 bg-red-50' : 'text-gray-400 glass-card'
          } hover:text-red-500 hover:bg-red-50 transition-all duration-300 hover:scale-110 shadow-md`}
          onClick={handleToggleWishlist}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current animate-zoom-in' : ''}`} />
        </Button>

        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isLoading}
            variant="luxury"
            size="lg"
            className="w-full shadow-gold"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Adding...
              </div>
            ) : !inStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      <CardContent className="p-5">
        <div className="space-y-3">
          <Badge variant="secondary" className="text-xs font-medium px-3 py-1 rounded-full bg-souq-gold-muted text-souq-navy">
            {product.category}
          </Badge>
          
          <Link to={`/product/${product.id}`}>
            <h3 className="font-semibold text-base hover:souq-text-gradient transition-all duration-300 line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </Link>

          {product.brand && (
            <p className="text-sm text-muted-foreground font-medium">{product.brand}</p>
          )}

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xl text-souq-gold">{product.price} L.E</span>
              {product.original_price && (
                <span className="text-sm text-muted-foreground line-through font-medium">
                  {product.original_price} L.E
                </span>
              )}
            </div>
            <div className="text-xs text-muted-foreground bg-souq-sand px-2 py-1 rounded-md">
              Stock: {product.stock}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
