
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Search, ShoppingCart, Heart, Menu, User, LogIn, Shield } from 'lucide-react';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItems, setCartItems] = useState(0);
  const [wishlistItems, setWishlistItems] = useState(0);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const updateCounts = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const userData = localStorage.getItem('user');
      const isAuth = localStorage.getItem('isAuthenticated') === 'true';
      
      setCartItems(cart.length);
      setWishlistItems(wishlist.length);
      setUser(userData && isAuth ? JSON.parse(userData) : null);
    };

    updateCounts();
    
    // Listen for storage changes
    window.addEventListener('storage', updateCounts);
    
    // Listen for custom events when cart/wishlist changes
    window.addEventListener('cartUpdated', updateCounts);
    window.addEventListener('wishlistUpdated', updateCounts);
    
    return () => {
      window.removeEventListener('storage', updateCounts);
      window.removeEventListener('cartUpdated', updateCounts);
      window.removeEventListener('wishlistUpdated', updateCounts);
    };
  }, [location]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'All Products', path: '/products' },
    { name: 'Shoes', path: '/shoes' },
    { name: 'Athletic Wear', path: '/athletic-wear' },
    { name: 'Outerwear', path: '/outerwear' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    setCartItems(0);
    setWishlistItems(0);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="athletic-gradient h-8 w-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-xl font-bold athletic-text-gradient">Athletic</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => navigate('/search')}>
              <Search className="h-4 w-4" />
            </Button>
            
            {user ? (
              <>
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon" className="relative">
                    <Heart className="h-4 w-4" />
                    {wishlistItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs athletic-gradient border-0">
                        {wishlistItems}
                      </Badge>
                    )}
                  </Button>
                </Link>

                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {cartItems > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center text-xs athletic-gradient border-0">
                        {cartItems}
                      </Badge>
                    )}
                  </Button>
                </Link>

                {user.isAdmin ? (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon" title="Admin Panel">
                      <Shield className="h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <Link to="/profile">
                    <Button variant="ghost" size="icon" title="Profile">
                      <User className="h-4 w-4" />
                    </Button>
                  </Link>
                )}

                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </>
            ) : (
              <Link to="/signin">
                <Button variant="ghost" size="icon" title="Sign In">
                  <LogIn className="h-4 w-4" />
                </Button>
              </Link>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={`text-lg font-medium transition-colors hover:text-primary ${
                        isActive(item.path) ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
