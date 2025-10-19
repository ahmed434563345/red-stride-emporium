import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart, MessageCircle, Bell, Menu } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import VendorProductForm from '@/components/VendorProductForm';
import VendorProductManagement from '@/components/VendorProductManagement';
import VendorNotifications from '@/components/VendorNotifications';
import VendorMessages from '@/components/VendorMessages';
import VendorStoreSettings from '@/components/VendorStoreSettings';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';
import DashboardCharts from '@/components/dashboard/DashboardCharts';
import { Sheet, SheetContent } from '@/components/ui/sheet';

interface VendorProfile {
  id: string;
  vendor_name: string;
  business_email: string;
  business_phone: string;
  status: string;
}

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendorProfile, setVendorProfile] = useState<VendorProfile | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    unreadNotifications: 0,
    unreadMessages: 0
  });
  
  const [chartData] = useState({
    salesData: [
      { name: 'Jan', sales: 4000 },
      { name: 'Feb', sales: 3000 },
      { name: 'Mar', sales: 5000 },
      { name: 'Apr', sales: 4500 },
      { name: 'May', sales: 6000 },
      { name: 'Jun', sales: 5500 },
    ],
    categoryData: [
      { name: 'Clothing', value: 400 },
      { name: 'Shoes', value: 300 },
      { name: 'Accessories', value: 200 },
    ]
  });

  useEffect(() => {
    checkVendorAuth();
  }, []);

  const checkVendorAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/signin');
        return;
      }

      console.log('Checking vendor auth for user:', user.id);

      // First get vendor profile
      const { data: profileData, error: profileError } = await supabase
        .from('vendor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error('Error getting vendor profile:', profileError);
        toast.error('Failed to load vendor profile');
        navigate('/vendor-signup');
        return;
      }

      if (!profileData) {
        toast.error('No vendor profile found. Please complete vendor registration.');
        navigate('/vendor-signup');
        return;
      }

      console.log('Vendor profile found:', profileData);

      // Check if user has vendor role, if not create it
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'vendor')
        .maybeSingle();

      if (!roleData && !roleError) {
        // Create vendor role if it doesn't exist
        const { error: insertRoleError } = await supabase
          .from('user_roles')
          .insert({ user_id: user.id, role: 'vendor' });
        
        if (insertRoleError) {
          console.error('Error creating vendor role:', insertRoleError);
          // Continue anyway as the vendor profile exists
        }
      }

      setVendorProfile(profileData);
      await loadStats(profileData.id);
    } catch (error) {
      console.error('Error in checkVendorAuth:', error);
      toast.error('Authentication failed');
      navigate('/signin');
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (vendorProfileId: string) => {
    try {
      // Get products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_profile_id', vendorProfileId);

      // Get orders count directly
      const ordersCount = 0; // TODO: Fix this when orders schema is corrected

      // Get unread notifications count
      const { count: notificationsCount } = await supabase
        .from('vendor_notifications')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_profile_id', vendorProfileId)
        .eq('is_read', false);

      // Get unread messages count
      const { count: messagesCount } = await supabase
        .from('vendor_messages')
        .select('*', { count: 'exact', head: true })
        .eq('vendor_profile_id', vendorProfileId)
        .eq('is_read', false);

      setStats({
        totalProducts: productsCount || 0,
        totalOrders: ordersCount || 0,
        unreadNotifications: notificationsCount || 0,
        unreadMessages: messagesCount || 0
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error('Failed to sign out');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading vendor dashboard...</p>
        </div>
      </div>
    );
  }

  if (!vendorProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Vendor account required to access this page.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/')} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <DashboardSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
            unreadNotifications={stats.unreadNotifications}
            unreadMessages={stats.unreadMessages}
            collapsed={sidebarCollapsed}
            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-64">
            <DashboardSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              unreadNotifications={stats.unreadNotifications}
              unreadMessages={stats.unreadMessages}
              collapsed={false}
              onToggle={() => {}}
              onClose={() => setMobileMenuOpen(false)}
              isMobile={true}
            />
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 animate-fade-in">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="md:hidden"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold souq-text-gradient">Vendor Dashboard</h1>
                  <p className="text-muted-foreground">Welcome back, {vendorProfile.vendor_name}</p>
                  <Badge variant={vendorProfile.status === 'approved' ? 'default' : 'secondary'} className="mt-1">
                    {vendorProfile.status.charAt(0).toUpperCase() + vendorProfile.status.slice(1)}
                  </Badge>
                </div>
              </div>
              <Button onClick={handleSignOut} variant="outline" className="hover-scale">
                Sign Out
              </Button>
            </div>

            {/* Content Sections */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="hover-lift animate-fade-in">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                      <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold souq-text-gradient">{stats.totalProducts}</div>
                    </CardContent>
                  </Card>

                  <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                      <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold souq-text-gradient">{stats.totalOrders}</div>
                    </CardContent>
                  </Card>

                  <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                      <Bell className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold souq-text-gradient">{stats.unreadNotifications}</div>
                      <p className="text-xs text-muted-foreground">Unread</p>
                    </CardContent>
                  </Card>

                  <Card className="hover-lift animate-fade-in" style={{ animationDelay: '0.3s' }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Messages</CardTitle>
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold souq-text-gradient">{stats.unreadMessages}</div>
                      <p className="text-xs text-muted-foreground">Unread</p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <DashboardCharts salesData={chartData.salesData} categoryData={chartData.categoryData} />

                {/* Warning */}
                {vendorProfile.status !== 'approved' && (
                  <Card className="border-yellow-200 bg-yellow-50 animate-fade-in">
                    <CardHeader>
                      <CardTitle className="text-yellow-800">Account Pending Approval</CardTitle>
                      <CardDescription className="text-yellow-700">
                        Your vendor account is currently under review. You can add products, but they won't be visible to customers until your account is approved.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'products' && <VendorProductManagement vendorProfileId={vendorProfile.id} />}
            {activeTab === 'add-product' && <VendorProductForm vendorProfileId={vendorProfile.id} />}
            {activeTab === 'store' && <VendorStoreSettings vendorProfile={vendorProfile} onUpdate={setVendorProfile} />}
            {activeTab === 'notifications' && <VendorNotifications vendorProfileId={vendorProfile.id} />}
            {activeTab === 'messages' && <VendorMessages vendorProfileId={vendorProfile.id} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;