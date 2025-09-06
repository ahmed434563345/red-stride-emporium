import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface VendorProfile {
  id: string;
  vendor_name: string;
  business_email: string;
  business_phone: string;
  business_address?: string;
  business_description?: string;
  status: string;
}

interface VendorStoreSettingsProps {
  vendorProfile: VendorProfile;
  onUpdate: (profile: VendorProfile) => void;
}

const VendorStoreSettings = ({ vendorProfile, onUpdate }: VendorStoreSettingsProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    vendor_name: vendorProfile.vendor_name,
    business_email: vendorProfile.business_email,
    business_phone: vendorProfile.business_phone,
    business_address: vendorProfile.business_address || '',
    business_description: vendorProfile.business_description || ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .update({
          vendor_name: formData.vendor_name,
          business_email: formData.business_email,
          business_phone: formData.business_phone,
          business_address: formData.business_address,
          business_description: formData.business_description
        })
        .eq('id', vendorProfile.id)
        .select()
        .single();

      if (error) throw error;

      onUpdate(data);
      toast.success('Store settings updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update store settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Store Settings</CardTitle>
          <CardDescription>Manage your store information and settings</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vendor_name">Store Name*</Label>
                <Input
                  id="vendor_name"
                  value={formData.vendor_name}
                  onChange={(e) => handleChange('vendor_name', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="business_email">Business Email*</Label>
                <Input
                  id="business_email"
                  type="email"
                  value={formData.business_email}
                  onChange={(e) => handleChange('business_email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="business_phone">Business Phone*</Label>
                <Input
                  id="business_phone"
                  type="tel"
                  value={formData.business_phone}
                  onChange={(e) => handleChange('business_phone', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="status">Account Status</Label>
                <Input
                  id="status"
                  value={vendorProfile.status}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="business_address">Business Address</Label>
              <Input
                id="business_address"
                value={formData.business_address}
                onChange={(e) => handleChange('business_address', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="business_description">Store Description</Label>
              <Textarea
                id="business_description"
                value={formData.business_description}
                onChange={(e) => handleChange('business_description', e.target.value)}
                rows={4}
                placeholder="Tell customers about your store..."
              />
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Store Settings'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Status</CardTitle>
          <CardDescription>Your vendor account approval status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-semibold">Verification Status</h3>
                <p className="text-sm text-muted-foreground">
                  {vendorProfile.status === 'pending' && 'Your account is under review'}
                  {vendorProfile.status === 'approved' && 'Your account is approved and active'}
                  {vendorProfile.status === 'rejected' && 'Your account was rejected'}
                  {vendorProfile.status === 'suspended' && 'Your account is suspended'}
                </p>
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                vendorProfile.status === 'approved' ? 'bg-green-100 text-green-800' :
                vendorProfile.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                vendorProfile.status === 'rejected' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {vendorProfile.status.charAt(0).toUpperCase() + vendorProfile.status.slice(1)}
              </div>
            </div>

            {vendorProfile.status === 'pending' && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <h4 className="font-semibold text-yellow-800 mb-2">Account Under Review</h4>
                <p className="text-sm text-yellow-700">
                  We're reviewing your vendor application. This process typically takes 1-3 business days. 
                  You can add products during this time, but they won't be visible to customers until approval.
                </p>
              </div>
            )}

            {vendorProfile.status === 'rejected' && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2">Application Rejected</h4>
                <p className="text-sm text-red-700">
                  Your vendor application was not approved. Please contact our support team for more information.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendorStoreSettings;