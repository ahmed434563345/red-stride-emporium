import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, ShoppingCart, MessageCircle, Bell, Store, Plus } from 'lucide-react';
import { toast } from 'sonner';
import Navigation from '@/components/Navigation';
import VendorProductForm from '@/components/VendorProductForm';
import VendorProductManagement from '@/components/VendorProductManagement';
import VendorNotifications from '@/components/VendorNotifications';
import VendorMessages from '@/components/VendorMessages';
import VendorStoreSettings from '@/components/VendorStoreSettings';

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
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    unreadNotifications: 0,
    unreadMessages: 0
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
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {vendorProfile.vendor_name}</p>
            <Badge variant={vendorProfile.status === 'approved' ? 'default' : 'secondary'}>
              {vendorProfile.status.charAt(0).toUpperCase() + vendorProfile.status.slice(1)}
            </Badge>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="add-product">Add Product</TabsTrigger>
            <TabsTrigger value="store">Store Settings</TabsTrigger>
            <TabsTrigger value="notifications" className="relative">
              Notifications
              {stats.unreadNotifications > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs">{stats.unreadNotifications}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="messages" className="relative">
              Messages
              {stats.unreadMessages > 0 && (
                <Badge className="ml-2 h-5 w-5 p-0 text-xs">{stats.unreadMessages}</Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalProducts}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalOrders}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Notifications</CardTitle>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.unreadNotifications}</div>
                  <p className="text-xs text-muted-foreground">Unread</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Messages</CardTitle>
                  <MessageCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.unreadMessages}</div>
                  <p className="text-xs text-muted-foreground">Unread</p>
                </CardContent>
              </Card>
            </div>

            {vendorProfile.status !== 'approved' && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="text-yellow-800">Account Pending Approval</CardTitle>
                  <CardDescription className="text-yellow-700">
                    Your vendor account is currently under review. You can add products, but they won't be visible to customers until your account is approved.
                  </CardDescription>
                </CardHeader>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="products">
            <VendorProductManagement vendorProfileId={vendorProfile.id} />
          </TabsContent>

          <TabsContent value="add-product">
            <VendorProductForm vendorProfileId={vendorProfile.id} />
          </TabsContent>

          <TabsContent value="store">
            <VendorStoreSettings vendorProfile={vendorProfile} onUpdate={setVendorProfile} />
          </TabsContent>

          <TabsContent value="notifications">
            <VendorNotifications vendorProfileId={vendorProfile.id} />
          </TabsContent>

          <TabsContent value="messages">
            <VendorMessages vendorProfileId={vendorProfile.id} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default VendorDashboard;