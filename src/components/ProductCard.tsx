import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    window.dispatchEvent(new CustomEvent('cartUpdated'));
    
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsLoading(false);
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  const inStock = product.stock > 0;

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
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative bg-card border border-border/30 hover:border-border transition-all duration-300">
        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-3 right-3 z-10 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
            isWishlisted 
              ? 'text-red-500 bg-background/90 opacity-100' 
              : 'text-muted-foreground bg-background/80 hover:bg-background'
          }`}
          onClick={handleToggleWishlist}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </Button>

        {/* Product Image */}
        <div className="aspect-square overflow-hidden bg-muted/10 flex items-center justify-center p-6">
          <img
            src={productImage}
            alt={product.name}
            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Quick Add - Shows on hover */}
        <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Button
            onClick={handleAddToCart}
            disabled={!inStock || isLoading}
            size="sm"
            className="w-full bg-foreground hover:bg-foreground/90 text-background font-medium uppercase text-xs tracking-wider"
          >
            {isLoading ? 'Adding...' : !inStock ? 'Sold Out' : 'Quick Add'}
          </Button>
        </div>
      </div>

      {/* Product Info */}
      <div className="pt-4 pb-2 space-y-1">
        {/* Brand */}
        <p className="text-xs text-muted-foreground tracking-wide">
          {vendorInfo.name || product.brand || product.category}
        </p>
        
        {/* Product Name */}
        <h3 className="font-medium text-sm uppercase tracking-wide text-foreground leading-tight line-clamp-2">
          {product.name}
        </h3>
        
        {/* Price */}
        <div className="pt-1">
          <span className="text-sm font-medium text-foreground">
            EGP {product.price.toLocaleString()}+
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
