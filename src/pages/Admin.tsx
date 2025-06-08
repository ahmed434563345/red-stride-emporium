import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Users, ShoppingBag, DollarSign, TrendingUp, LogOut, Package, BarChart3, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Air Jordan 4 Retro "Bred"',
      price: 200,
      category: 'Shoes',
      stock: 15,
      status: 'active'
    },
    {
      id: '2',
      name: 'Barcelona Home Jersey 2024',
      price: 90,
      category: 'Athletic Wear',
      stock: 8,
      status: 'active'
    },
    {
      id: '3',
      name: 'Air Jordan 1 "University Blue"',
      price: 170,
      category: 'Shoes',
      stock: 0,
      status: 'out_of_stock'
    }
  ]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    stock: '',
    image: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAuth = localStorage.getItem('isAuthenticated') === 'true';
    
    if (isAuth && user.isAdmin) {
      setIsAuthenticated(true);
      // Load admin orders
      const adminOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
      setOrders(adminOrders);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Admin credentials
    if (loginForm.username === 'admin' && loginForm.password === 'admin123') {
      setIsAuthenticated(true);
      const adminUser = {
        id: 'admin',
        email: 'admin@admin.com',
        name: 'Admin',
        isAdmin: true
      };
      localStorage.setItem('user', JSON.stringify(adminUser));
      localStorage.setItem('isAuthenticated', 'true');
      toast.success('Admin login successful!');
      
      // Load admin orders after login
      const adminOrders = JSON.parse(localStorage.getItem('adminOrders') || '[]');
      setOrders(adminOrders);
    } else {
      toast.error('Invalid credentials');
    }
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    toast.success('Signed out successfully');
    navigate('/');
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      description: '',
      stock: product.stock.toString(),
      image: ''
    });
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;
    
    const updatedProducts = products.map(p => 
      p.id === editingProduct.id 
        ? {
            ...p,
            name: newProduct.name,
            price: parseFloat(newProduct.price),
            category: newProduct.category,
            stock: parseInt(newProduct.stock) || 0
          }
        : p
    );
    
    setProducts(updatedProducts);
    setEditingProduct(null);
    setNewProduct({
      name: '',
      price: '',
      category: '',
      description: '',
      stock: '',
      image: ''
    });
    toast.success('Product updated successfully!');
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      stock: parseInt(newProduct.stock) || 0,
      status: 'active'
    };

    setProducts([...products, product]);
    setNewProduct({
      name: '',
      price: '',
      category: '',
      description: '',
      stock: '',
      image: ''
    });
    toast.success('Product added successfully!');
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    toast.success('Product deleted successfully!');
  };

  // Calculate analytics data
  const getOrdersByDay = () => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString();
      const dayOrders = orders.filter(order => 
        new Date(order.date).toLocaleDateString() === dateStr
      );
      last7Days.push({
        date: dateStr,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((total, order) => total + order.total, 0)
      });
    }
    return last7Days;
  };

  const getRevenueData = () => {
    return getOrdersByDay().map(day => ({
      date: day.date,
      revenue: day.revenue
    }));
  };

  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
  const totalOrders = orders.length;

  const stats = [
    {
      title: 'Total Products',
      value: products.length,
      icon: ShoppingBag,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Revenue',
      value: `${totalRevenue.toFixed(2)} L.E`,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Sales Growth',
      value: '+23%',
      icon: TrendingUp,
      color: 'bg-red-500'
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Admin Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={loginForm.username}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full athletic-gradient">
                    Login
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Username: admin | Password: admin123
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your Athletic store</p>
          </div>
          <Button variant="outline" onClick={handleSignOut} className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-full`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              Products
            </TabsTrigger>
            <TabsTrigger value="add-product" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </TabsTrigger>
            <TabsTrigger value="orders" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Orders per Day (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ orders: { label: "Orders", color: "hsl(var(--primary))" } }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={getOrdersByDay()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="orders" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Revenue Trend (Last 7 Days)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={{ revenue: { label: "Revenue", color: "hsl(var(--primary))" } }}>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={getRevenueData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No orders yet</p>
                ) : (
                  <div className="space-y-4">
                    {orders.slice().reverse().map((order) => (
                      <div key={order.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">Order #{order.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                            </p>
                          </div>
                          <Badge variant="secondary">{order.status}</Badge>
                        </div>
                        <div className="text-sm space-y-1">
                          <p><strong>Customer:</strong> {order.shipping.fullName}</p>
                          <p><strong>Email:</strong> {order.shipping.email}</p>
                          <p><strong>Total:</strong> {order.total.toFixed(2)} L.E</p>
                          <p><strong>Items:</strong> {order.items.length} products</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{product.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-muted-foreground">${product.price}</span>
                          <Badge variant="secondary">{product.category}</Badge>
                          <span className="text-sm text-muted-foreground">Stock: {product.stock}</span>
                          <Badge variant={product.status === 'active' ? 'default' : 'destructive'}>
                            {product.status === 'active' ? 'Active' : 'Out of Stock'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleEditProduct(product)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Add Product Tab */}
          <TabsContent value="add-product">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        placeholder="Enter product name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="price">Price *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Shoes">Shoes</SelectItem>
                          <SelectItem value="Athletic Wear">Athletic Wear</SelectItem>
                          <SelectItem value="Outerwear">Outerwear</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="stock">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                        placeholder="https://..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Product description..."
                        rows={4}
                      />
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
                  className="mt-6 athletic-gradient"
                  size="lg"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </Button>
                
                {editingProduct && (
                  <Button 
                    onClick={() => {
                      setEditingProduct(null);
                      setNewProduct({
                        name: '',
                        price: '',
                        category: '',
                        description: '',
                        stock: '',
                        image: ''
                      });
                    }}
                    variant="outline"
                    className="mt-2 ml-4"
                  >
                    Cancel Edit
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">User management features coming soon...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
