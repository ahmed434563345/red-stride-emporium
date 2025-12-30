import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import AdminDashboard from '@/components/AdminDashboard';
import ProductForm from '@/components/ProductForm';
import CustomerSupportChat from '@/components/CustomerSupportChat';
import { Button } from '@/components/ui/button';
import { 
  LogOut, 
  BarChart3, 
  Plus, 
  MessageCircle, 
  Menu,
  X,
  Package,
  Users,
  Settings,
  Home
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: BarChart3 },
    { id: 'add-product', label: 'Add Product', icon: Plus },
    { id: 'customer-support', label: 'Support', icon: MessageCircle },
  ];

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error('Error getting user:', userError);
          navigate('/signin');
          return;
        }

        if (!user) {
          console.log('No user found, redirecting to signin');
          navigate('/signin');
          return;
        }

        console.log('Current user:', user.email);
        setUser(user);

        const adminEmails = [
          'athletic.website99@gmail.com',
          'admin@admin.com',
          user.email
        ];

        const userIsAdmin = adminEmails.includes(user.email) || user.email === 'athletic.website99@gmail.com';
        
        if (userIsAdmin) {
          setIsAdmin(true);
          console.log('User is admin, setting up admin role in database');
          
          try {
            const { error: roleError } = await supabase
              .from('user_roles')
              .upsert({ 
                user_id: user.id, 
                role: 'admin' 
              }, {
                onConflict: 'user_id,role'
              });
            
            if (roleError) {
              console.log('Role upsert error (this is often normal):', roleError);
            } else {
              console.log('Admin role set successfully');
            }
          } catch (roleError) {
            console.log('Error setting admin role:', roleError);
          }
        } else {
          console.log('User is not admin:', user.email);
          setIsAdmin(false);
          toast.error(`Access denied. Admin privileges required. Current email: ${user.email}`);
          setTimeout(() => navigate('/'), 3000);
        }
      } catch (error) {
        console.error('Error in checkAdminStatus:', error);
        toast.error('Error checking admin status');
        navigate('/signin');
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        toast.error('Error signing out');
      } else {
        navigate('/signin');
        toast.success('Signed out successfully!');
      }
    } catch (error) {
      console.error('Unexpected sign out error:', error);
      toast.error('Error signing out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-destructive">Not Authenticated</h1>
            <p className="text-muted-foreground">Please sign in to access the admin dashboard.</p>
            <Button onClick={() => navigate('/signin')} className="w-full">Go to Sign In</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center space-y-4">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto">
              <X className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
            <p className="text-muted-foreground">You do not have admin privileges.</p>
            <p className="text-sm text-muted-foreground">Current email: {user?.email}</p>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => navigate('/')}>Go Home</Button>
              <Button onClick={handleSignOut} variant="outline">Sign Out</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-50 bg-card border-b px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="font-bold text-lg text-primary">Admin Panel</h1>
        <Button variant="ghost" size="icon" onClick={handleSignOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex min-h-screen lg:min-h-screen">
        {/* Sidebar */}
        <aside className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-72 bg-card border-r transform transition-transform duration-300 ease-in-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-bold text-lg">Athletic</h2>
                    <p className="text-xs text-muted-foreground">Admin Panel</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="lg:hidden"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-xl">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Admin</p>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 mb-3">
                Menu
              </p>
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    activeTab === item.id 
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" 
                      : "hover:bg-muted text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t space-y-2">
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3"
                onClick={() => navigate('/')}
              >
                <Home className="w-5 h-5" />
                Back to Store
              </Button>
              <Button 
                variant="ghost" 
                className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleSignOut}
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-0">
          {/* Desktop Header */}
          <header className="hidden lg:flex sticky top-0 z-40 bg-card/80 backdrop-blur-sm border-b px-6 py-4 items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
              </h1>
              <p className="text-sm text-muted-foreground">
                Manage your store and view analytics
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                <Home className="w-4 h-4 mr-2" />
                Store
              </Button>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-4 lg:p-6">
            {activeTab === 'overview' && <AdminDashboard />}
            {activeTab === 'add-product' && (
              <div className="max-w-4xl mx-auto">
                <ProductForm onProductAdded={() => window.location.reload()} />
              </div>
            )}
            {activeTab === 'customer-support' && (
              <div className="max-w-4xl mx-auto">
                <CustomerSupportChat />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Admin;
