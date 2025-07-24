import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, ChevronDown, Search, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import AISearchBar from '@/components/AISearchBar';
import CartWishlistCounter from '@/components/CartWishlistCounter';
import { supabase } from '@/integrations/supabase/client'; // Add this import

const Navigation = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Subscribe to auth state change for realtime login/logout UI update
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
    // Use Supabase to sign the user out and listen for logout propagation everywhere
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

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="souq-gradient h-8 w-8 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">سوق</span>
            </div>
            <span className="text-xl font-bold">Souq Masr</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/products" className="text-gray-700 hover:text-primary transition-colors">
              All Products
            </Link>
            {/* ----- Men Dropdown ----- */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-700 hover:text-primary transition-colors flex items-center">
                Men
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/men/t-shirts">T-Shirts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/men/jeans">Jeans</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/men/caps-accessories">Caps &amp; Accessories</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* ----- Women Dropdown ----- */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-700 hover:text-primary transition-colors flex items-center">
                Women
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/women/t-shirts">T-Shirts</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/women/jeans">Jeans</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/women/caps-accessories">Caps &amp; Accessories</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* ----- New Categories Dropdown ----- */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-gray-700 hover:text-primary transition-colors flex items-center">
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/electronics">Electronics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/home-garden">Home & Garden</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/books">Books</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/beauty">Beauty</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/shoes">Shoes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/athletic-wear">Athletic Wear</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/outerwear">Outerwear</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              <AISearchBar />
            </div>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/wishlist">
                  <Button variant="ghost" size="icon">
                    <CartWishlistCounter type="wishlist" />
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button variant="ghost" size="icon">
                    <CartWishlistCounter type="cart" />
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Profile</Link>
                    </DropdownMenuItem>
                    {user.email === 'athletic.website99@gmail.com' && (
                      <DropdownMenuItem asChild>
                        <Link to="/admin">Admin</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="sm:max-w-xs">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Link to="/products" className="flex items-center space-x-2">
                    All Products
                  </Link>
                  {/* Men Mobile Section */}
                  <div className="font-semibold text-gray-600">Men</div>
                  <Link to="/men/t-shirts" className="flex items-center space-x-2 pl-2">T-Shirts</Link>
                  <Link to="/men/jeans" className="flex items-center space-x-2 pl-2">Jeans</Link>
                  <Link to="/men/caps-accessories" className="flex items-center space-x-2 pl-2">Caps &amp; Accessories</Link>
                  {/* Women Mobile Section */}
                  <div className="font-semibold text-gray-600 mt-2">Women</div>
                  <Link to="/women/t-shirts" className="flex items-center space-x-2 pl-2">T-Shirts</Link>
                  <Link to="/women/jeans" className="flex items-center space-x-2 pl-2">Jeans</Link>
                  <Link to="/women/caps-accessories" className="flex items-center space-x-2 pl-2">Caps &amp; Accessories</Link>
                  {/* New Categories Mobile Section */}
                  <div className="font-semibold text-gray-600 mt-2">Categories</div>
                  <Link to="/electronics" className="flex items-center space-x-2 pl-2">Electronics</Link>
                  <Link to="/home-garden" className="flex items-center space-x-2 pl-2">Home & Garden</Link>
                  <Link to="/books" className="flex items-center space-x-2 pl-2">Books</Link>
                  <Link to="/beauty" className="flex items-center space-x-2 pl-2">Beauty</Link>
                  <Link to="/shoes" className="flex items-center space-x-2 pl-2">Shoes</Link>
                  <Link to="/athletic-wear" className="flex items-center space-x-2 pl-2">Athletic Wear</Link>
                  <Link to="/outerwear" className="flex items-center space-x-2 pl-2">Outerwear</Link>
                  {user ? (
                    <>
                      <Link to="/profile" className="flex items-center space-x-2">
                        Profile
                      </Link>
                      {user.email === 'athletic.website99@gmail.com' && (
                        <Link to="/admin" className="flex items-center space-x-2">
                          Admin
                        </Link>
                      )}
                      <Button variant="destructive" onClick={handleSignOut} className="w-full">
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/signin" className="flex items-center space-x-2">
                        Sign In
                      </Link>
                      <Link to="/signup" className="flex items-center space-x-2">
                        Sign Up
                      </Link>
                    </>
                  )}
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
