
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Truck } from 'lucide-react';

interface ShippingMethodSelectProps {
  shippingMethod: string;
  setShippingMethod: (v: string) => void;
  subtotal: number;
}

export default function ShippingMethodSelect({
  shippingMethod,
  setShippingMethod,
  subtotal,
}: ShippingMethodSelectProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Method
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="standard" id="standard" />
            <Label htmlFor="standard" className="flex-1">
              <div className="flex justify-between">
                <span>Standard Delivery (3-5 days)</span>
                <span>{subtotal > 1700 ? 'Free' : '170 L.E'}</span>
              </div>
            </Label>
          </div>
          <div className="flex items-center space-x-2 p-3 border rounded-lg">
            <RadioGroupItem value="express" id="express" />
            <Label htmlFor="express" className="flex-1">
              <div className="flex justify-between">
                <span>Express Delivery (1-2 days)</span>
                <span>100 L.E</span>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
}
