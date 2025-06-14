
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import AdminDashboard from '@/components/AdminDashboard';
import ProductForm from '@/components/ProductForm';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, BarChart, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/signin');
        return;
      }

      setUser(user);

      // Check if user is admin by email
      if (user.email === 'athletic.website99@gmail.com') {
        setIsAdmin(true);
        
        // Ensure admin role exists in database
        const { error } = await supabase
          .from('user_roles')
          .upsert({ 
            user_id: user.id, 
            role: 'admin' 
          });
        
        if (error) {
          console.log('Error setting admin role:', error);
        }
      } else {
        setIsAdmin(false);
        toast.error('Access denied. Admin privileges required.');
        navigate('/');
      }
      
      setLoading(false);
    };

    checkAdminStatus();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/signin');
    toast.success('Signed out successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-muted-foreground">You do not have admin privileges.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store and view analytics</p>
            <p className="text-sm text-green-600">Welcome, {user?.email}</p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="add-product" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="add-product" className="space-y-6">
            <ProductForm onProductAdded={() => window.location.reload()} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
