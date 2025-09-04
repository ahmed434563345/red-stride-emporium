import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  price: number;
  images?: string[];
  category: string;
}

interface WishlistPopupProps {
  isOpen: boolean;
  onClose: () => void;
  recentlyAdded?: Product;
}

const WishlistPopup = ({ isOpen, onClose, recentlyAdded }: WishlistPopupProps) => {
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);

  useEffect(() => {
    if (isOpen) {
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setWishlistItems(wishlist.slice(-3)); // Show last 3 items
    }
  }, [isOpen]);

  const removeFromWishlist = (productId: string) => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    const updatedWishlist = wishlist.filter((item: Product) => item.id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(updatedWishlist));
    setWishlistItems(updatedWishlist.slice(-3));
    window.dispatchEvent(new CustomEvent('wishlistUpdated'));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500 fill-current" />
            Wishlist
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {recentlyAdded && (
            <div className="border rounded-lg p-3 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <img 
                  src={recentlyAdded.images?.[0] || '/placeholder.svg'} 
                  alt={recentlyAdded.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">{recentlyAdded.name}</p>
                  <p className="text-souq-gold font-semibold">{recentlyAdded.price} L.E</p>
                </div>
                <Badge className="bg-green-500 text-white">Added!</Badge>
              </div>
            </div>
          )}

          {wishlistItems.length > 0 ? (
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} in your wishlist
              </p>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {wishlistItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-2 border rounded-lg">
                    <img 
                      src={item.images?.[0] || '/placeholder.svg'} 
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <p className="text-souq-gold font-semibold text-sm">{item.price} L.E</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => removeFromWishlist(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Heart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Your wishlist is empty</p>
            </div>
          )}

          <div className="flex gap-2 pt-4 border-t">
            <Link to="/wishlist" className="flex-1">
              <Button variant="outline" className="w-full" onClick={onClose}>
                View All Wishlist
              </Button>
            </Link>
            <Link to="/products" className="flex-1">
              <Button className="w-full souq-gradient text-white" onClick={onClose}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WishlistPopup;