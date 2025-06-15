
import ShippingForm from "@/components/checkout/ShippingForm";
import ShippingMethodSelect from "@/components/checkout/ShippingMethodSelect";
import PaymentForm from "@/components/checkout/PaymentForm";

interface CheckoutMainProps {
  shippingInfo: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShippingInfo: (v: any) => void;
  saveInfo: boolean;
  setSaveInfo: (v: boolean) => void;
  shippingMethod: string;
  setShippingMethod: (v: string) => void;
  paymentMethod: string;
  setPaymentMethod: (v: string) => void;
  subtotal: number;
}

export default function CheckoutMain({
  shippingInfo,
  handleInputChange,
  setShippingInfo,
  saveInfo,
  setSaveInfo,
  shippingMethod,
  setShippingMethod,
  paymentMethod,
  setPaymentMethod,
  subtotal,
}: CheckoutMainProps) {
  return (
    <div className="space-y-6">
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
  );
}
