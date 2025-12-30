import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Store, 
  Package,
  MessageCircle,
  Star,
  Eye,
  FolderOpen,
  BarChart3,
  ShoppingCart
} from 'lucide-react';
import ProductManagement from '@/components/ProductManagement';
import CategoryManagement from '@/components/CategoryManagement';
import AdminVendorChat from '@/components/AdminVendorChat';
import { useState } from 'react';

const AdminDashboard = () => {
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Fetch orders from Supabase
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) {
        console.error('Error fetching orders:', error);
        return [];
      }
      return data || [];
    }
  });

  // Fetch products count
  const { data: productsCount = 0 } = useQuery({
    queryKey: ['products-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch user profiles count
  const { data: usersCount = 0 } = useQuery({
    queryKey: ['users-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });
      if (error) throw error;
      return count || 0;
    }
  });

  // Fetch analytics data
  const { data: analyticsData = {
    uniqueVisitors: 0,
    totalPageViews: 0,
    reviewsCount: 0,
    vendorMessagesCount: 0,
    supportMessagesCount: 0
  } } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      const { data: websiteAnalytics } = await supabase
        .from('website_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      const { count: reviewsCount } = await supabase
        .from('product_comments')
        .select('*', { count: 'exact', head: true });

      const { count: vendorMessagesCount } = await supabase
        .from('vendor_messages')
        .select('*', { count: 'exact', head: true });

      const { count: supportMessagesCount } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true });

      const uniqueVisitors = new Set(websiteAnalytics?.map(v => v.visitor_id)).size;
      const totalPageViews = websiteAnalytics?.length || 0;

      return {
        uniqueVisitors,
        totalPageViews,
        reviewsCount: reviewsCount || 0,
        vendorMessagesCount: vendorMessagesCount || 0,
        supportMessagesCount: supportMessagesCount || 0
      };
    }
  });

  // Fetch vendors data
  const { data: vendorsData = [] } = useQuery({
    queryKey: ['admin-vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching vendors:', error);
        return [];
      }
      return data || [];
    }
  });

  const totalRevenue = orders.reduce((sum: number, order: any) => sum + Number(order.price * order.quantity), 0);
  const vendorsCount = vendorsData.length;

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingCart, badge: orders.length },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: FolderOpen },
    { id: 'vendors', label: 'Vendors', icon: Store, badge: vendorsCount },
    { id: 'chat', label: 'Support', icon: MessageCircle },
  ];

  const stats = [
    { label: 'Products', value: productsCount, icon: ShoppingBag, color: 'text-blue-500' },
    { label: 'Orders', value: orders.length, icon: TrendingUp, color: 'text-green-500' },
    { label: 'Vendors', value: vendorsCount, icon: Store, color: 'text-purple-500' },
    { label: 'Users', value: usersCount, icon: Users, color: 'text-orange-500' },
    { label: 'Revenue', value: `${totalRevenue.toFixed(0)} L.E`, icon: DollarSign, color: 'text-primary' },
    { label: 'Visitors', value: analyticsData.uniqueVisitors, icon: Eye, color: 'text-cyan-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Mobile Navigation */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeSection === item.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setActiveSection(item.id)}
            className={`flex-shrink-0 gap-2 ${activeSection === item.id ? 'glass-button-primary' : 'glass-button-outline'}`}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
            {item.badge !== undefined && item.badge > 0 && (
              <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                {item.badge}
              </Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {stats.map((stat) => (
              <Card key={stat.label} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="glass-button w-10 h-10 rounded-xl flex items-center justify-center">
                    <Eye className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold">{analyticsData.totalPageViews}</p>
                    <p className="text-xs text-muted-foreground">Page Views</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="glass-button w-10 h-10 rounded-xl flex items-center justify-center">
                    <Star className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold">{analyticsData.reviewsCount}</p>
                    <p className="text-xs text-muted-foreground">Reviews</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="glass-button w-10 h-10 rounded-xl flex items-center justify-center">
                    <Store className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold">{analyticsData.vendorMessagesCount}</p>
                    <p className="text-xs text-muted-foreground">Vendor Msgs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="glass-button w-10 h-10 rounded-xl flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl md:text-2xl font-bold">{analyticsData.supportMessagesCount}</p>
                    <p className="text-xs text-muted-foreground">Support Msgs</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders Preview */}
          <Card className="glass-card">
            <CardHeader className="p-4 md:p-6">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveSection('orders')}>
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3">
                {orders.slice(0, 5).map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 rounded-xl border bg-background/50">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{order.product_name}</p>
                      <p className="text-xs text-muted-foreground truncate">{order.customer_name}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <p className="font-bold text-sm">{order.order_total} L.E</p>
                      <Badge variant={order.status === 'pending' ? 'secondary' : 'default'} className="text-xs">
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No orders yet</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders Section */}
      {activeSection === 'orders' && (
        <Card className="glass-card">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-lg md:text-xl">Orders ({orders.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-3">
              {orders.map((order: any) => (
                <div key={order.id} className="p-4 rounded-xl border bg-background/50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <p className="font-medium">{order.product_name}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                        <span>{order.customer_name}</span>
                        <span>{order.customer_email}</span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>{order.shipping_city}, {order.shipping_governorate}</span>
                        <span>{order.payment_method}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                      <div className="text-right">
                        <p className="font-bold">{order.order_total} L.E</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.order_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              {orders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products Section */}
      {activeSection === 'products' && <ProductManagement />}

      {/* Categories Section */}
      {activeSection === 'categories' && <CategoryManagement />}

      {/* Vendors Section */}
      {activeSection === 'vendors' && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="glass-card">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-lg">Vendors ({vendorsCount})</CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6 pt-0">
              <div className="space-y-3">
                {vendorsData.map((vendor) => (
                  <div key={vendor.id} className="p-4 rounded-xl border bg-background/50">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium truncate">{vendor.vendor_name}</h3>
                      <Badge variant={vendor.status === 'approved' ? 'default' : 'secondary'}>
                        {vendor.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{vendor.business_email}</p>
                    <p className="text-sm text-muted-foreground mb-3">{vendor.business_phone}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {new Date(vendor.created_at).toLocaleDateString()}
                      </span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="glass-button-outline"
                        onClick={() => setSelectedVendor(vendor)}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                ))}
                {vendorsData.length === 0 && (
                  <div className="text-center py-8">
                    <Store className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No vendors yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {selectedVendor && (
            <Card className="glass-card">
              <CardHeader className="p-4 md:p-6">
                <CardTitle className="text-lg">{selectedVendor.vendor_name}</CardTitle>
                <CardDescription>Vendor Details</CardDescription>
              </CardHeader>
              <CardContent className="p-4 md:p-6 pt-0 space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedVendor.business_email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">{selectedVendor.business_phone}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-medium">{selectedVendor.business_address || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="font-medium">{selectedVendor.business_description || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{new Date(selectedVendor.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Chat Section */}
      {activeSection === 'chat' && <AdminVendorChat />}
    </div>
  );
};

export default AdminDashboard;
