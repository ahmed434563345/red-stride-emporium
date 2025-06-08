
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

const Wishlist = () => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem('user');
    if (!user) {
      toast.error('Please sign in to view your wishlist');
      navigate('/signin');
      return;
    }

    // Load wishlist from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      setWishlistItems(JSON.parse(savedWishlist));
    }
  }, [navigate]);

  const removeFromWishlist = (productId) => {
    const updatedWishlist = wishlistItems.filter(item => item.id !== productId);
    setWishlistItems(updatedWishlist);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    toast.success('Item removed from wishlist');
  };

  const addAllToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    wishlistItems.forEach(item => {
      const cartItem = {
        ...item,
        quantity: 1,
        size: 'One Size',
        addedAt: new Date().toISOString()
      };
      
      const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);
      if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
      } else {
        cart.push(cartItem);
      }
    });
    
    localStorage.setItem('cart', JSON.stringify(cart));
    toast.success('All items added to cart!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save items you love to buy them later</p>
            <Button className="athletic-gradient" onClick={() => navigate('/products')}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} onWishlistChange={removeFromWishlist} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button className="athletic-gradient" size="lg" onClick={addAllToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add All to Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
