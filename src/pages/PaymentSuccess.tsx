
import { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';

const PaymentSuccess = () => {
  const location = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const orderId = location.state?.orderId;

  useEffect(() => {
    if (orderId) {
      // Try to get from lastOrder first (from checkout), then fall back to orders array
      const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || 'null');
      if (lastOrder && lastOrder.id === orderId) {
        setOrderDetails(lastOrder);
      } else {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const order = orders.find(o => o.id === orderId);
        setOrderDetails(order);
      }
    }
  }, [orderId]);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Order not found</h1>
          <Link to="/">
            <Button className="athletic-gradient">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-6" />
          <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your order. We've received your payment and will process your order soon.
          </p>

          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle>Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Order ID:</span>
                <span>{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total:</span>
                <span className="font-bold">{orderDetails.total.toFixed(2)} L.E</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Payment Method:</span>
                <span className="capitalize">{orderDetails.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Shipping Method:</span>
                <span className="capitalize">{orderDetails.shippingMethod} Delivery</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="text-center p-4">
              <Package className="mx-auto h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Order Processing</h3>
              <p className="text-sm text-muted-foreground">Your order is being prepared</p>
            </Card>
            <Card className="text-center p-4">
              <Truck className="mx-auto h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Shipping</h3>
              <p className="text-sm text-muted-foreground">
                {orderDetails.shippingMethod === 'express' ? '1-2 days' : '3-5 days'}
              </p>
            </Card>
            <Card className="text-center p-4">
              <Mail className="mx-auto h-8 w-8 text-primary mb-2" />
              <h3 className="font-semibold mb-1">Confirmation</h3>
              <p className="text-sm text-muted-foreground">Check your email for details</p>
            </Card>
          </div>

          <div className="flex gap-4 justify-center">
            <Link to="/profile">
              <Button variant="outline">View Order History</Button>
            </Link>
            <Link to="/">
              <Button className="athletic-gradient">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
