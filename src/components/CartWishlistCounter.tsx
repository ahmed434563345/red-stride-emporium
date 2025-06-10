
import { useState, useEffect } from 'react';
import { Heart, ShoppingCart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CartWishlistCounterProps {
  type: 'cart' | 'wishlist';
  className?: string;
}

const CartWishlistCounter = ({ type, className = '' }: CartWishlistCounterProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const items = JSON.parse(localStorage.getItem(type) || '[]');
      if (type === 'cart') {
        const totalItems = items.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0);
        setCount(totalItems);
      } else {
        setCount(items.length);
      }
    };

    // Initial count
    updateCount();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === type) {
        updateCount();
      }
    };

    // Listen for custom events (for real-time updates)
    const handleCustomEvent = () => updateCount();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(`${type}Updated`, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(`${type}Updated`, handleCustomEvent);
    };
  }, [type]);

  const Icon = type === 'cart' ? ShoppingCart : Heart;

  return (
    <div className={`relative ${className}`}>
      <Icon className="h-5 w-5" />
      {count > 0 && (
        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500 text-white">
          {count > 99 ? '99+' : count}
        </Badge>
      )}
    </div>
  );
};

export default CartWishlistCounter;
