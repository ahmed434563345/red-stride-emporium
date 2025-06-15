
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { MapPin } from 'lucide-react';

interface ShippingFormProps {
  shippingInfo: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setShippingInfo: (v: any) => void;
  saveInfo: boolean;
  setSaveInfo: (v: boolean) => void;
}

export default function ShippingForm({
  shippingInfo,
  handleInputChange,
  setShippingInfo,
  saveInfo,
  setSaveInfo,
}: ShippingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              value={shippingInfo.fullName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={shippingInfo.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              name="phone"
              value={shippingInfo.phone}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="governorate">Governorate *</Label>
            <Select value={shippingInfo.governorate} onValueChange={value => setShippingInfo((prev: any) => ({ ...prev, governorate: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select governorate" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cairo">Cairo</SelectItem>
                <SelectItem value="giza">Giza</SelectItem>
                <SelectItem value="alexandria">Alexandria</SelectItem>
                <SelectItem value="dakahlia">Dakahlia</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            name="address"
            value={shippingInfo.address}
            onChange={handleInputChange}
            placeholder="Street address, building number, etc."
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              name="city"
              value={shippingInfo.city}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              name="postalCode"
              value={shippingInfo.postalCode}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="saveInfo"
            checked={saveInfo}
            onCheckedChange={(checked) => setSaveInfo(checked === true)}
          />
          <Label htmlFor="saveInfo">Save this information for next time</Label>
        </div>
      </CardContent>
    </Card>
  );
}
