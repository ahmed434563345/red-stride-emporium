import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, User, LogOut, Heart, Home, Search, ShoppingBag, X } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';
import CartWishlistCounter from '@/components/CartWishlistCounter';

const Navigation = () => {
  const [user, setUser] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    const handler = (e: StorageEvent) => {
      if (e.key === 'user') {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to sign out');
      return;
    }
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    navigate('/signin');
    toast.success('Signed out successfully');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { label: 'SNEAKERS', path: '/shoes' },
    { label: 'MEN', path: '/products?category=men' },
    { label: 'WOMEN', path: '/products?category=women' },
    { label: 'NEW', path: '/products?filter=new' },
  ];

  const mobileNavLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Products', path: '/products' },
    { label: 'Sneakers', path: '/shoes' },
    { label: 'Men', path: '/products?category=men' },
    { label: 'Women', path: '/products?category=women' },
    { label: 'New Arrivals', path: '/products?filter=new' },
    { label: 'Athletic Wear', path: '/athletic-wear' },
  ];

  return (
    <>
      {/* Main Navigation */}
      <nav className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            
            {/* Left: Search + Nav Links */}
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </button>
              
              <div className="hidden lg:flex items-center gap-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Center: Logo */}
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <span className="text-xl font-bold tracking-tight text-primary uppercase">
                ATHLETIC
              </span>
            </Link>

            {/* Right: Actions */}
            <div className="flex items-center gap-4">
              <Link 
                to="/stores" 
                className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
              >
                Stores
              </Link>
              
              <Link 
                to="/wishlist" 
                className="hidden md:flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider relative"
              >
                Favorites
                <CartWishlistCounter type="wishlist" />
              </Link>

              {user ? (
                <Link 
                  to="/profile" 
                  className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                >
                  Account
                </Link>
              ) : (
                <Link 
                  to="/signin" 
                  className="hidden md:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                >
                  Account
                </Link>
              )}

              <Link to="/cart" className="relative">
                <ShoppingBag className="h-5 w-5 text-foreground" />
                <CartWishlistCounter type="cart" />
              </Link>

              {/* Mobile Menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden h-8 w-8">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-sm p-0 bg-background">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                      <span className="text-lg font-bold uppercase">Menu</span>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto py-4">
                      {mobileNavLinks.map((link) => (
                        <Link
                          key={link.path}
                          to={link.path}
                          className="block px-6 py-4 text-base font-medium hover:bg-muted transition-colors border-b border-border/50"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    <div className="p-4 border-t border-border space-y-3">
                      {user ? (
                        <>
                          <Link to="/profile" className="block">
                            <Button variant="outline" className="w-full justify-start">
                              <User className="h-4 w-4 mr-2" />
                              My Account
                            </Button>
                          </Link>
                          {user.email === 'athletic.website99@gmail.com' && (
                            <Link to="/admin" className="block">
                              <Button variant="outline" className="w-full justify-start">
                                Admin Dashboard
                              </Button>
                            </Link>
                          )}
                          <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-destructive">
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link to="/signin" className="block">
                            <Button variant="outline" className="w-full">Sign In</Button>
                          </Link>
                          <Link to="/signup" className="block">
                            <Button className="w-full bg-foreground text-background hover:bg-foreground/90">Sign Up</Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-[60] bg-background">
          <div className="container mx-auto px-4">
            <div className="flex items-center h-14 gap-4">
              <form onSubmit={handleSearch} className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for sneakers, brands..."
                  className="w-full bg-transparent text-lg font-medium placeholder:text-muted-foreground focus:outline-none"
                  autoFocus
                />
              </form>
              <button 
                onClick={() => setSearchOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground mb-4">Popular Searches</p>
              <div className="flex flex-wrap gap-2">
                {['Jordan', 'Nike', 'Adidas', 'New Balance', 'Running'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      navigate(`/search?q=${term}`);
                      setSearchOpen(false);
                    }}
                    className="px-4 py-2 bg-muted rounded-full text-sm font-medium hover:bg-muted/80 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          <Link
            to="/"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
              location.pathname === '/' ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-[10px] font-medium mt-1">Home</span>
          </Link>
          
          <button
            onClick={() => setSearchOpen(true)}
            className="flex flex-col items-center justify-center flex-1 py-2 text-muted-foreground"
          >
            <Search className="h-5 w-5" />
            <span className="text-[10px] font-medium mt-1">Search</span>
          </button>
          
          <Link
            to="/wishlist"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2 transition-colors relative",
              location.pathname === '/wishlist' ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <div className="relative">
              <Heart className="h-5 w-5" />
              <CartWishlistCounter type="wishlist" />
            </div>
            <span className="text-[10px] font-medium mt-1">Saved</span>
          </Link>
          
          <Link
            to="/cart"
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2 transition-colors relative",
              location.pathname === '/cart' ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" />
              <CartWishlistCounter type="cart" />
            </div>
            <span className="text-[10px] font-medium mt-1">Bag</span>
          </Link>
          
          <Link
            to={user ? "/profile" : "/signin"}
            className={cn(
              "flex flex-col items-center justify-center flex-1 py-2 transition-colors",
              location.pathname === '/profile' ? "text-foreground" : "text-muted-foreground"
            )}
          >
            <User className="h-5 w-5" />
            <span className="text-[10px] font-medium mt-1">Account</span>
          </Link>
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default Navigation;
