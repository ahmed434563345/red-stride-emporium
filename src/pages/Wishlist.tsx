
import { useState } from 'react';
import Navigation from '@/components/Navigation';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';

const Wishlist = () => {
  const [wishlistItems] = useState([
    {
      id: '1',
      name: 'Air Jordan 4 Retro "Bred"',
      price: 200,
      originalPrice: 250,
      image: '/lovable-uploads/9b98bff4-8569-4533-8eb7-e7a12673afc3.png',
      category: 'Shoes',
      isNew: true,
      inStock: true
    },
    {
      id: '3',
      name: 'Air Jordan 1 "University Blue"',
      price: 170,
      image: '/lovable-uploads/89e48b84-0586-4e14-b4e5-d11b38b4962c.png',
      category: 'Shoes',
      inStock: true
    },
    {
      id: '4',
      name: 'Yeezy Boost 350 V2 "Cream"',
      price: 220,
      image: '/lovable-uploads/70691133-4b92-4f11-ae0e-8c73f1267caa.png',
      category: 'Shoes',
      inStock: false
    },
    {
      id: '7',
      name: 'American Eagle Olive Graphic Tee',
      price: 28,
      image: '/lovable-uploads/775ffd32-b47b-4081-b560-24e17fb8664a.png',
      category: 'Outerwear',
      inStock: true
    },
    {
      id: '9',
      name: 'American Eagle Teal Eagle Tee',
      price: 26,
      image: '/lovable-uploads/d7239c31-30da-4311-9456-7f8cdcb03b81.png',
      category: 'Outerwear',
      inStock: true
    }
  ]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
            <Heart className="h-8 w-8 text-red-500 fill-current" />
            My Wishlist
          </h1>
          <p className="text-muted-foreground">
            {wishlistItems.length} item{wishlistItems.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-muted-foreground mb-6">Save items you love to buy them later</p>
            <Button className="athletic-gradient">Continue Shopping</Button>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button className="athletic-gradient" size="lg">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add All to Cart
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
