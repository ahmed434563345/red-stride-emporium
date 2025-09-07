import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { Users, ShoppingBag, DollarSign, TrendingUp, Store } from 'lucide-react';
import ProductManagement from '@/components/ProductManagement';
import { useState } from 'react';

const AdminDashboard = () => {
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  // Fetch orders from Supabase
  const { data: orders = [] } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          profiles:user_id(first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
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
      
      if (error) throw error;
      return data;
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
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
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Orders Management</TabsTrigger>
          <TabsTrigger value="vendors">Vendors Management</TabsTrigger>
          <TabsTrigger value="products">Products Management</TabsTrigger>
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
                        <span>Customer: {order.profiles?.first_name} {order.profiles?.last_name}</span>
                        <span>Email: {order.profiles?.email}</span>
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
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
