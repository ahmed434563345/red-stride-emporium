
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  governorate: string;
  postalCode?: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  size: string;
}

export const useCheckoutForm = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    governorate: '',
    postalCode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [saveInfo, setSaveInfo] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthAndCart = async () => {
      // Check authentication with Supabase
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('Please sign in to proceed with checkout');
        navigate('/signin');
        return;
      }

      // Check cart items
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (cart.length === 0) {
        toast.error('Your cart is empty');
        navigate('/cart');
        return;
      }
      
      setCartItems(cart);
    };

    checkAuthAndCart();
  }, [navigate]);

  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const shippingCost = shippingMethod === 'express' ? 100 : subtotal > 1700 ? 0 : 170;
  const tax = subtotal * 0.14;
  const total = subtotal + shippingCost + tax;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo(prev => ({ ...prev, [name]: value }));
  };

  const reset = () => {
    setShippingInfo({
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      governorate: '',
      postalCode: '',
    });
    setPaymentMethod('card');
    setShippingMethod('standard');
    setSaveInfo(false);
  };

  return {
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
  };
};
