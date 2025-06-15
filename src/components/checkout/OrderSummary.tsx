
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ShieldCheck } from 'lucide-react';

interface OrderSummaryProps {
  cartItems: any[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  isProcessing: boolean;
  onPlaceOrder: () => void;
}

export default function OrderSummary({
  cartItems,
  subtotal,
  shippingCost,
  tax,
  total,
  isProcessing,
  onPlaceOrder,
}: OrderSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {cartItems.map((item) => (
            <div key={`${item.id}-${item.size}`} className="flex gap-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.name}</h4>
                <p className="text-xs text-muted-foreground">Size: {item.size}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                <p className="font-semibold text-sm">{item.price * item.quantity} L.E</p>
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{subtotal.toFixed(2)} L.E</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'Free' : `${shippingCost.toFixed(2)} L.E`}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax (14%)</span>
            <span>{tax.toFixed(2)} L.E</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{total.toFixed(2)} L.E</span>
          </div>
        </div>
        <Button 
          className="w-full athletic-gradient" 
          size="lg"
          onClick={onPlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            'Processing...'
          ) : (
            <>
              <ShieldCheck className="mr-2 h-4 w-4" />
              Place Order
            </>
          )}
        </Button>
        <p className="text-xs text-center text-muted-foreground">
          Your payment information is secure and encrypted
        </p>
      </CardContent>
    </Card>
  );
}
