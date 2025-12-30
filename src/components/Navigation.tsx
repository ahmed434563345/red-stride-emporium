import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, ChevronDown, LogOut, ShoppingBag, Heart, Home, Shirt, Watch, Footprints, Package, Gem, Search, Grid3X3 } from 'lucide-react';
import { toast } from 'sonner';
import AISearchBar from '@/components/AISearchBar';
import CartWishlistCounter from '@/components/CartWishlistCounter';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
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

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Failed to sign out. Please try again.');
      return;
    }
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    navigate('/signin');
    toast.success('Signed out successfully!');
  };

  const bottomNavItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Grid3X3, label: 'Shop', path: '/products' },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: ShoppingBag, label: 'Cart', path: '/cart' },
    { icon: User, label: 'Account', path: user ? '/profile' : '/signin' },
  ];

  return (
    <>
      <nav className={cn(
        "sticky top-0 z-50 transition-all duration-500",
        scrolled 
          ? "glass-nav shadow-glass" 
          : "bg-background/80 backdrop-blur-sm border-b border-border/50"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-18">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="glass-button h-10 w-10 rounded-xl flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                <Gem className="h-5 w-5 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                <span className="text-primary">ATHLETIC</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <Link to="/products">
                <Button variant="ghost" className="glass-button-subtle font-medium">
                  <Package className="h-4 w-4 mr-2" />
                  Shop All
                </Button>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="glass-button-subtle font-medium">
                    <Shirt className="h-4 w-4 mr-2" />
                    Men
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-dropdown min-w-[180px]">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/men-t-shirts" className="flex items-center gap-2">
                      <Shirt className="h-4 w-4" /> T-Shirts
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/men-jeans" className="flex items-center gap-2">
                      <Package className="h-4 w-4" /> Jeans
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/men-caps-accessories" className="flex items-center gap-2">
                      <Watch className="h-4 w-4" /> Accessories
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="glass-button-subtle font-medium">
                    <Heart className="h-4 w-4 mr-2" />
                    Women
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="glass-dropdown min-w-[180px]">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/women-t-shirts" className="flex items-center gap-2">
                      <Shirt className="h-4 w-4" /> T-Shirts
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/women-jeans" className="flex items-center gap-2">
                      <Package className="h-4 w-4" /> Jeans
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/women-caps-accessories" className="flex items-center gap-2">
                      <Watch className="h-4 w-4" /> Accessories
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Link to="/shoes">
                <Button variant="ghost" className="glass-button-subtle font-medium">
                  <Footprints className="h-4 w-4 mr-2" />
                  Footwear
                </Button>
              </Link>

              <Link to="/athletic-wear">
                <Button variant="ghost" className="glass-button-subtle font-medium">
                  <Gem className="h-4 w-4 mr-2" />
                  Athletic
                </Button>
              </Link>
            </div>

            {/* Right Section */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="hidden md:block">
                <AISearchBar />
              </div>
              
              {user ? (
                <div className="hidden md:flex items-center space-x-1 md:space-x-2">
                  <Link to="/wishlist">
                    <Button variant="ghost" size="icon" className="glass-button-subtle relative">
                      <Heart className="h-5 w-5" />
                      <CartWishlistCounter type="wishlist" />
                    </Button>
                  </Link>
                  <Link to="/cart">
                    <Button variant="ghost" size="icon" className="glass-button-subtle relative">
                      <ShoppingBag className="h-5 w-5" />
                      <CartWishlistCounter type="cart" />
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="glass-button-subtle">
                        <User className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-dropdown min-w-[180px]">
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/profile" className="flex items-center gap-2">
                          <User className="h-4 w-4" /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/vendor-dashboard" className="flex items-center gap-2">
                          <Package className="h-4 w-4" /> Vendor Dashboard
                        </Link>
                      </DropdownMenuItem>
                      {user.email === 'athletic.website99@gmail.com' && (
                        <DropdownMenuItem asChild className="cursor-pointer">
                          <Link to="/admin" className="flex items-center gap-2">
                            <Gem className="h-4 w-4" /> Admin
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-2">
                  <Link to="/vendor-signup">
                    <Button variant="outline" className="glass-button-outline">
                      Sell
                    </Button>
                  </Link>
                  <Link to="/signin">
                    <Button variant="ghost" className="glass-button-subtle">Sign In</Button>
                  </Link>
                  <Link to="/signup">
                    <Button className="glass-button-primary">Sign Up</Button>
                  </Link>
                </div>
              )}

              {/* Mobile Search */}
              <Button variant="ghost" size="icon" className="md:hidden glass-button-subtle">
                <Search className="h-5 w-5" />
              </Button>

              {/* Mobile menu */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden glass-button-subtle">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent className="glass-sheet w-[300px] p-0">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="glass-button h-10 w-10 rounded-xl flex items-center justify-center">
                          <Gem className="h-5 w-5 text-primary" />
                        </div>
                        <span className="font-bold text-xl text-primary">ATHLETIC</span>
                      </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-1">
                      <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <Home className="h-5 w-5 text-primary" />
                        <span className="font-medium">Home</span>
                      </Link>
                      <Link to="/products" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <Package className="h-5 w-5 text-primary" />
                        <span className="font-medium">All Products</span>
                      </Link>
                      <Link to="/shoes" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <Footprints className="h-5 w-5 text-primary" />
                        <span className="font-medium">Footwear</span>
                      </Link>

                      <div className="pt-4 pb-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Men</p>
                      </div>
                      <Link to="/men-t-shirts" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors pl-6">
                        <Shirt className="h-4 w-4 text-muted-foreground" />
                        <span>T-Shirts</span>
                      </Link>
                      <Link to="/men-jeans" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors pl-6">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>Jeans</span>
                      </Link>
                      <Link to="/men-caps-accessories" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors pl-6">
                        <Watch className="h-4 w-4 text-muted-foreground" />
                        <span>Accessories</span>
                      </Link>

                      <div className="pt-4 pb-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">Women</p>
                      </div>
                      <Link to="/women-t-shirts" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors pl-6">
                        <Shirt className="h-4 w-4 text-muted-foreground" />
                        <span>T-Shirts</span>
                      </Link>
                      <Link to="/women-jeans" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors pl-6">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>Jeans</span>
                      </Link>
                      <Link to="/women-caps-accessories" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors pl-6">
                        <Watch className="h-4 w-4 text-muted-foreground" />
                        <span>Accessories</span>
                      </Link>

                      <div className="pt-4 pb-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3">More</p>
                      </div>
                      <Link to="/athletic-wear" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors pl-6">
                        <Gem className="h-4 w-4 text-muted-foreground" />
                        <span>Athletic Wear</span>
                      </Link>
                      <Link to="/outerwear" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors pl-6">
                        <Shirt className="h-4 w-4 text-muted-foreground" />
                        <span>Outerwear</span>
                      </Link>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-border/50 space-y-2">
                      {user ? (
                        <>
                          <Link to="/profile" className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                            <User className="h-5 w-5 text-primary" />
                            <span className="font-medium">Profile</span>
                          </Link>
                          <Button 
                            variant="destructive" 
                            onClick={handleSignOut} 
                            className="w-full glass-button"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign Out
                          </Button>
                        </>
                      ) : (
                        <div className="space-y-2">
                          <Link to="/signin" className="block">
                            <Button variant="outline" className="w-full glass-button-outline">
                              Sign In
                            </Button>
                          </Link>
                          <Link to="/signup" className="block">
                            <Button className="w-full glass-button-primary">
                              Sign Up
                            </Button>
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Bottom Navigation Bar - Mobile Only */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-border/50 pb-safe">
        <div className="flex items-center justify-around h-16">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full transition-all",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className={cn(
                  "relative p-2 rounded-xl transition-all",
                  isActive && "bg-primary/10"
                )}>
                  <item.icon className={cn("h-5 w-5", isActive && "scale-110")} />
                  {(item.label === 'Cart' || item.label === 'Wishlist') && (
                    <CartWishlistCounter type={item.label.toLowerCase() as 'cart' | 'wishlist'} />
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-medium mt-0.5",
                  isActive && "font-semibold"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer for bottom navigation on mobile */}
      <div className="md:hidden h-16" />
    </>
  );
};

export default Navigation;
