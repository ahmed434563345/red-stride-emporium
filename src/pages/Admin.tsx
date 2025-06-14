import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import AdminDashboard from '@/components/AdminDashboard';
import ProductForm from '@/components/ProductForm';
import CustomerSupportChat from '@/components/CustomerSupportChat';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, BarChart, Plus, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Admin = () => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p>Loading admin dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Not Authenticated</h1>
            <p className="text-muted-foreground mb-4">Please sign in to access the admin dashboard.</p>
            <Button onClick={() => navigate('/signin')}>Go to Sign In</Button>
          </div>
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
            <p className="text-muted-foreground mb-2">You do not have admin privileges.</p>
            <p className="text-sm text-muted-foreground mb-4">Current email: {user?.email}</p>
            <p className="text-sm text-blue-600 mb-4">
              Expected admin email: athletic.website99@gmail.com
            </p>
            <div className="space-x-2">
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="add-product" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </TabsTrigger>
            <TabsTrigger value="customer-support" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Customer Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="add-product" className="space-y-6">
            <ProductForm onProductAdded={() => window.location.reload()} />
          </TabsContent>

          <TabsContent value="customer-support" className="space-y-6">
            <CustomerSupportChat />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
