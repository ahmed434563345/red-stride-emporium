
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, MapPin, Clock, Star } from 'lucide-react';

const StoreProfile = () => {
  const storeInfo = {
    name: "Athletic Store",
    phone: "01274449096",
    address: "123 Sports Street, Athletic District, Cairo, Egypt",
    hours: "9:00 AM - 10:00 PM",
    rating: 4.8,
    description: "Your premier destination for authentic athletic wear, sneakers, and sports equipment. We offer the latest collections from top brands."
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hello! I'm interested in your products.");
    window.open(`https://wa.me/${storeInfo.phone.replace(/\D/g, '')}?text=${message}`, '_blank');
  };

  const handleCallClick = () => {
    window.open(`tel:${storeInfo.phone}`, '_self');
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="athletic-gradient h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-white font-bold text-2xl">AS</span>
        </div>
        <CardTitle className="text-xl">{storeInfo.name}</CardTitle>
        <div className="flex items-center justify-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{storeInfo.rating}</span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground text-center">
          {storeInfo.description}
        </p>
        
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{storeInfo.address}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{storeInfo.hours}</span>
          </div>
          
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{storeInfo.phone}</span>
          </div>
        </div>

        <div className="flex gap-2 pt-4">
          <Button 
            onClick={handleCallClick}
            variant="outline" 
            className="flex-1 flex items-center gap-2"
          >
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button 
            onClick={handleWhatsAppClick}
            className="flex-1 flex items-center gap-2 bg-green-500 hover:bg-green-600"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreProfile;
