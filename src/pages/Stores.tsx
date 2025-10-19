import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Store, MapPin, Star, Package, Phone } from 'lucide-react';
import { toast } from 'sonner';
import SEOHead from '@/components/SEOHead';

interface VendorStore {
  id: string;
  name: string;
  store_description: string;
  store_logo_url: string;
  banner_url: string;
  location: string;
  rating: number;
  total_reviews: number;
  phone: string;
  vendor_name: string;
  profile_photo_url: string;
  product_count: number;
}

const Stores = () => {
  const [stores, setStores] = useState<VendorStore[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select(`
          *,
          vendor_profiles!inner(vendor_name, profile_photo_url, status)
        `)
        .eq('is_active', true)
        .eq('vendor_profiles.status', 'approved');

      if (error) throw error;

      // Transform data and get product counts
      const storesWithCounts = await Promise.all(
        (data || []).map(async (store: any) => {
          const { count } = await supabase
            .from('products')
            .select('*', { count: 'exact', head: true })
            .eq('store_id', store.id);

          return {
            id: store.id,
            name: store.name,
            store_description: store.store_description,
            store_logo_url: store.store_logo_url,
            banner_url: store.banner_url,
            location: store.location,
            rating: store.rating || 0,
            total_reviews: store.total_reviews || 0,
            phone: store.phone,
            vendor_name: store.vendor_profiles?.vendor_name || '',
            profile_photo_url: store.vendor_profiles?.profile_photo_url || '',
            product_count: count || 0
          };
        })
      );

      setStores(storesWithCounts);
    } catch (error) {
      console.error('Error loading stores:', error);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const handleStoreClick = (storeId: string) => {
    navigate(`/search?store=${storeId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SEOHead 
        title="Browse Vendor Stores | Red Stride Emporium"
        description="Explore our curated collection of verified vendor stores offering quality products"
        keywords="vendor stores, online shopping, verified sellers"
      />
      <Navigation />

      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Our <span className="souq-text-gradient">Vendor Stores</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover amazing products from our verified vendor partners
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stores.map((store, index) => (
            <Card 
              key={store.id} 
              className="group cursor-pointer hover-lift hover:shadow-luxury transition-all duration-300 overflow-hidden animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleStoreClick(store.id)}
            >
              {/* Banner */}
              {store.banner_url && (
                <div className="h-32 overflow-hidden bg-gradient-to-r from-souq-gold to-souq-navy">
                  <img 
                    src={store.banner_url} 
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  {/* Store Logo */}
                  <div className="h-16 w-16 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0 bg-gradient-to-br from-souq-cream to-souq-sand">
                    {store.store_logo_url ? (
                      <img 
                        src={store.store_logo_url} 
                        alt={store.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Store className="h-8 w-8 text-souq-gold" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <CardTitle className="text-xl mb-1 group-hover:souq-text-gradient transition-all">
                      {store.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <span>by {store.vendor_name}</span>
                    </p>
                  </div>
                </div>

                {store.store_description && (
                  <CardDescription className="mt-3 line-clamp-2">
                    {store.store_description}
                  </CardDescription>
                )}
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Stats */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-souq-gold text-souq-gold" />
                    <span className="font-semibold">{store.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({store.total_reviews})</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>{store.product_count} Products</span>
                  </div>
                </div>

                {/* Location */}
                {store.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{store.location}</span>
                  </div>
                )}

                {/* Phone */}
                {store.phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <span>{store.phone}</span>
                  </div>
                )}

                <Button className="w-full mt-4 souq-gradient hover-scale">
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {stores.length === 0 && (
          <div className="text-center py-12">
            <Store className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No Stores Yet</h2>
            <p className="text-muted-foreground">Check back soon for new vendor stores!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stores;