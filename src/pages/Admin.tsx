import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, BarChart, Package, ShoppingCart, Plus } from 'lucide-react';
import { toast } from 'sonner';
import ProductForm from '@/components/ProductForm';

const Admin = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [refreshProducts, setRefreshProducts] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    navigate('/signin');
    toast.success('Signed out successfully!');
  };

  const handleProductAdded = () => {
    setRefreshProducts(prev => prev + 1);
    toast.success('Product added successfully!');
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store and view analytics</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="add-product" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Total Products</h2>
                <p className="text-3xl font-bold text-primary">
                  {JSON.parse(localStorage.getItem('adminProducts') || '[]').length}
                </p>
              </div>

              <div className="bg-card rounded-lg p-6 shadow-sm">
                <h2 className="text-lg font-semibold mb-4">Total Orders</h2>
                <p className="text-3xl font-bold text-primary">
                  {JSON.parse(localStorage.getItem('adminNotifications') || '[]').filter(n => n.type === 'order').length}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {JSON.parse(localStorage.getItem('adminProducts') || '[]').map(product => (
                <div key={product.id} className="bg-card rounded-lg p-4 shadow-sm">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-muted-foreground">{product.description.substring(0, 50)}...</p>
                  <p className="text-primary font-bold">{product.price} L.E</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <div className="space-y-4">
              {JSON.parse(localStorage.getItem('adminNotifications') || '[]')
                .filter(n => n.type === 'order')
                .map(order => (
                  <div key={order.id} className="bg-card rounded-lg p-4 shadow-sm">
                    <h3 className="text-lg font-semibold mb-2">New Order</h3>
                    <p className="text-muted-foreground">Product: {order.productName}</p>
                    <p className="text-muted-foreground">Quantity: {order.quantity}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="add-product" className="space-y-6">
            <ProductForm onProductAdded={handleProductAdded} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
