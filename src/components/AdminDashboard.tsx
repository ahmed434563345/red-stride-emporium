import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Users, ShoppingBag, DollarSign, TrendingUp, Store } from 'lucide-react';
import ProductManagement from '@/components/ProductManagement';
import AdminVendorChat from '@/components/AdminVendorChat';
import { useState } from 'react';

const AdminDashboard = () => {
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

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

  // Fetch comprehensive analytics data
  const { data: analyticsData = {
    websiteAnalytics: [],
    uniqueVisitors: 0,
    totalPageViews: 0,
    reviewsCount: 0,
    vendorMessagesCount: 0,
    supportMessagesCount: 0,
    topProducts: [],
    deviceTypes: {}
  } } = useQuery({
    queryKey: ['admin-analytics'],
    queryFn: async () => {
      // Website analytics
      const { data: websiteAnalytics, error: analyticsError } = await supabase
        .from('website_analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      // Product comments/reviews
      const { count: reviewsCount } = await supabase
        .from('product_comments')
        .select('*', { count: 'exact', head: true });

      // Vendor messages
      const { count: vendorMessagesCount } = await supabase
        .from('vendor_messages')
        .select('*', { count: 'exact', head: true });

      // Customer support messages
      const { count: supportMessagesCount } = await supabase
        .from('chat_messages')
        .select('*', { count: 'exact', head: true });

      // Top performing products
      const { data: topProducts } = await supabase
        .from('products')
        .select('*')
        .order('stock', { ascending: true })
        .limit(5);

      // Recent activity
      const uniqueVisitors = new Set(websiteAnalytics?.map(v => v.visitor_id)).size;
      const totalPageViews = websiteAnalytics?.length || 0;
      const deviceTypes = websiteAnalytics?.reduce((acc, item) => {
        acc[item.device_type || 'unknown'] = (acc[item.device_type || 'unknown'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        websiteAnalytics: websiteAnalytics || [],
        uniqueVisitors,
        totalPageViews,
        reviewsCount: reviewsCount || 0,
        vendorMessagesCount: vendorMessagesCount || 0,
        supportMessagesCount: supportMessagesCount || 0,
        topProducts: topProducts || [],
        deviceTypes: deviceTypes || {}
      };
    }
  });

  // Fetch vendors data
  const { data: vendorsData = [] } = useQuery({
    queryKey: ['admin-vendors'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select(`
          *,
          stores:stores(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching vendors:', error);
        return [];
      }
      return data || [];
    }
  });

  // Fetch vendor products for selected vendor
  const { data: vendorProducts = [] } = useQuery({
    queryKey: ['vendor-products', selectedVendor?.id],
    queryFn: async () => {
      if (!selectedVendor) return [];
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('vendor_profile_id', selectedVendor.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedVendor
  });

  const totalRevenue = orders.reduce((sum: number, order: any) => sum + Number(order.price * order.quantity), 0);
  const vendorsCount = vendorsData.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your e-commerce platform</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{vendorsCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Registered Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRevenue.toFixed(2)} L.E</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{analyticsData.uniqueVisitors}</div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Page Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{analyticsData.totalPageViews}</div>
            <p className="text-sm text-muted-foreground">Total page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{analyticsData.reviewsCount}</div>
            <p className="text-sm text-muted-foreground">Product reviews</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vendor Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{analyticsData.vendorMessagesCount}</div>
            <p className="text-sm text-muted-foreground">Total vendor messages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Support Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{analyticsData.supportMessagesCount}</div>
            <p className="text-sm text-muted-foreground">Customer support chats</p>
          </CardContent>
        </Card>
      </div>

      {/* Device Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Device Analytics</CardTitle>
          <CardDescription>Visitor device breakdown</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(analyticsData.deviceTypes).map(([device, count]) => (
              <div key={device} className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">{count as number}</div>
                <div className="text-sm text-muted-foreground capitalize">{device}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="vendors">Vendors</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="chat">Live Chat</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <p className="font-medium">{order.product_name}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Customer: {order.customer_name}</span>
                        <span>Email: {order.customer_email}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Address: {order.shipping_address || 'N/A'}</span>
                        <span>City: {order.shipping_city || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Governorate: {order.shipping_governorate || 'N/A'}</span>
                        <span>Method: {order.payment_method || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <p className="font-bold">{order.order_total} L.E</p>
                      <Badge variant={order.status === 'pending' ? 'secondary' : 'default'}>
                        {order.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.order_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vendors">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Management</CardTitle>
                <CardDescription>Manage vendor accounts and stores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {vendorsData.map((vendor) => (
                    <div key={vendor.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{vendor.vendor_name}</h3>
                        <Badge variant={vendor.status === 'approved' ? 'default' : 'destructive'}>
                          {vendor.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{vendor.business_email}</p>
                      <p className="text-sm text-muted-foreground mb-2">{vendor.business_phone}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Created: {new Date(vendor.created_at).toLocaleDateString()}</span>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedVendor(vendor)}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {selectedVendor && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedVendor.vendor_name} - Products</CardTitle>
                  <CardDescription>Products managed by this vendor</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {vendorProducts.map((product) => (
                      <div key={product.id} className="p-3 border rounded">
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        <div className="flex justify-between mt-2">
                          <span className="text-sm">${product.price}</span>
                          <span className="text-sm">Stock: {product.stock}</span>
                        </div>
                      </div>
                    ))}
                    {vendorProducts.length === 0 && (
                      <p className="text-sm text-muted-foreground">No products found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="products">
          <ProductManagement />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Website Analytics</CardTitle>
                <CardDescription>Recent visitor activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {analyticsData.websiteAnalytics.slice(0, 50).map((visit: any) => (
                    <div key={visit.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">{visit.page_path}</p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>Device: {visit.device_type || 'Unknown'}</span>
                          <span>Location: {visit.location || 'Unknown'}</span>
                          {visit.phone_number && <span>Phone: {visit.phone_number}</span>}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(visit.created_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Products with lowest stock (need attention)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.topProducts.map((product: any) => (
                    <div key={product.id} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{product.name}</h4>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${product.price}</p>
                        <Badge variant={product.stock < 10 ? 'destructive' : 'default'}>
                          Stock: {product.stock}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chat">
          <AdminVendorChat />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
