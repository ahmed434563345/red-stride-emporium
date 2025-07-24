import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

const HelloIntro = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    const introShown = localStorage.getItem('souq-masr-intro-shown');
    if (introShown) {
      setIsVisible(false);
      setHasBeenShown(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setHasBeenShown(true);
    localStorage.setItem('souq-masr-intro-shown', 'true');
  };

  const handleExplore = () => {
    handleClose();
    // Smooth scroll to products section
    const productsSection = document.getElementById('featured-products');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!isVisible || hasBeenShown) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full relative overflow-hidden">
        <div className="arabic-pattern absolute inset-0 opacity-50" />
        <CardContent className="p-8 relative z-10">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="text-center space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold souq-text-gradient">
                أهلاً وسهلاً بك في سوق مصر
              </h1>
              <h2 className="text-3xl font-bold text-foreground">
                Welcome to Souq Masr!
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-lg text-muted-foreground leading-relaxed">
                Discover authentic Egyptian products, traditional crafts, and modern goods 
                all in one place. From handmade treasures to contemporary fashion, 
                we bring you the best of Egypt's marketplace.
              </p>
              
              <div className="grid grid-cols-3 gap-4 my-6">
                <div className="text-center space-y-2">
                  <div className="souq-gradient h-12 w-12 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-2xl">🏺</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Traditional Crafts</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="souq-gradient h-12 w-12 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-2xl">👗</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Modern Fashion</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="souq-gradient h-12 w-12 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-white text-2xl">🎁</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Unique Gifts</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={handleExplore} size="lg" className="souq-gradient text-white font-semibold">
                🛍️ Start Exploring
              </Button>
              <Button onClick={handleClose} variant="outline" size="lg">
                Maybe Later
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelloIntro;