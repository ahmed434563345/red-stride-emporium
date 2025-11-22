
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

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
  vendor_profile_id?: string;
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

  // Fetch vendor info
  const [vendorInfo, setVendorInfo] = useState<{ name?: string; logo?: string }>({});

  useEffect(() => {
    const loadVendorInfo = async () => {
      if (product.vendor_profile_id) {
        const { data } = await supabase
          .from('vendor_profiles')
          .select('vendor_name, profile_photo_url')
          .eq('id', product.vendor_profile_id)
          .single();
        
        if (data) {
          setVendorInfo({ name: data.vendor_name, logo: data.profile_photo_url });
        }
      }
    };
    loadVendorInfo();
  }, [product.vendor_profile_id]);

  return (
    <Card className="group relative overflow-hidden border border-border/50 hover:border-primary/30 hover:shadow-xl transition-all duration-300 bg-card">
      <div className="relative">
        <Link to={`/product/${product.id}`}>
          <div className="aspect-square overflow-hidden bg-muted/30">
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105 p-4"
            />
          </div>
        </Link>

        <div className="absolute top-2 left-2 flex flex-col gap-1.5">
          {product.is_new && (
            <Badge className="bg-green-600 hover:bg-green-700 border-0 text-white text-xs px-2 py-0.5 font-medium">NEW</Badge>
          )}
          {discountPercentage > 0 && (
            <Badge className="bg-red-600 hover:bg-red-700 border-0 text-white text-xs px-2 py-0.5 font-bold">-{discountPercentage}%</Badge>
          )}
          {!inStock && (
            <Badge variant="secondary" className="text-xs px-2 py-0.5">Out of Stock</Badge>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 right-2 h-9 w-9 rounded-full ${
            isWishlisted ? 'text-red-500 bg-red-50 hover:bg-red-100' : 'text-muted-foreground bg-background/80 hover:bg-background'
          } transition-all duration-200 shadow-sm hover:shadow-md`}
          onClick={handleToggleWishlist}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>

        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isLoading}
            size="sm"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Adding...
              </div>
            ) : !inStock ? (
              "Out of Stock"
            ) : (
              <>
                <ShoppingCart className="mr-1.5 h-4 w-4" />
                Add to Cart
              </>
            )}
          </Button>
        </div>
      </div>

      <CardContent className="p-3 space-y-2">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-sm hover:text-primary transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center">
            ⭐ <span className="ml-0.5 font-medium">4.5</span>
          </span>
          <span className="text-muted-foreground/60">(127)</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="font-bold text-base text-foreground">EGP {product.price}</span>
          {product.original_price && (
            <span className="text-xs text-muted-foreground line-through">
              {product.original_price}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="inline-flex items-center gap-1 text-green-600 font-medium">
            🚚 Free Delivery
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-yellow-400 text-black border-0 font-bold">
            express
          </Badge>
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 bg-black text-white border-0">
            Tomorrow
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
