import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, MapPin, Truck, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCheckoutForm } from "@/hooks/useCheckoutForm";
import ShippingForm from "@/components/checkout/ShippingForm";
import ShippingMethodSelect from "@/components/checkout/ShippingMethodSelect";
import PaymentForm from "@/components/checkout/PaymentForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import RelatedProducts from '@/components/RelatedProducts';

// Checkout page using refactored components and hook
const Checkout = () => {
  const {
    cartItems,
    setCartItems,
    shippingInfo,
    setShippingInfo,
    paymentMethod,
    setPaymentMethod,
    shippingMethod,
    setShippingMethod,
    saveInfo,
    setSaveInfo,
    isProcessing,
    setIsProcessing,
    subtotal,
    shippingCost,
    tax,
    total,
    handleInputChange,
    reset,
    navigate,
  } = useCheckoutForm();

  const handlePlaceOrder = async () => {
    if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone || !shippingInfo.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 3000));
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    if (!user) {
      toast.error('Please sign in to proceed with checkout');
      setIsProcessing(false);
      return;
    }
    const orderId = `ORD-${Date.now()}`;
    const placedOrderItems = cartItems.map(item => ({
      product_id: item.id,
      quantity: item.quantity,
      price: item.price * item.quantity,
      product_name: item.name,
      size: item.size,
      user_id: user.id,
      status: 'confirmed',
    }));

    let errored = false;
    if (placedOrderItems.length > 0) {
      const { error } = await supabase.from('orders').insert(placedOrderItems);
      if (error) {
        errored = true;
        toast.error('Failed to save order, please try again.');
        setIsProcessing(false);
        return;
      }
    }
    const order = {
      id: orderId,
      items: cartItems,
      shipping: shippingInfo,
      paymentMethod,
      shippingMethod,
      total,
      date: new Date().toISOString(),
      status: 'confirmed',
      userId: user.id
    };
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
    localStorage.removeItem('cart');

    try {
      await fetch(
        "https://phppkguqvucqvyycemeh.supabase.co/functions/v1/send-admin-order-email",
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order }),
        }
      );
    } catch (err) {
      // Emails may fail but don't block here
    }
    setIsProcessing(false);
    toast.success('Order placed successfully!');
    navigate('/payment-success', { state: { orderId: order.id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <ShippingForm
              shippingInfo={shippingInfo}
              handleInputChange={handleInputChange}
              setShippingInfo={setShippingInfo}
              saveInfo={saveInfo}
              setSaveInfo={setSaveInfo}
            />
            <ShippingMethodSelect
              shippingMethod={shippingMethod}
              setShippingMethod={setShippingMethod}
              subtotal={subtotal}
            />
            <PaymentForm
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary
              cartItems={cartItems}
              subtotal={subtotal}
              shippingCost={shippingCost}
              tax={tax}
              total={total}
              isProcessing={isProcessing}
              onPlaceOrder={handlePlaceOrder}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
