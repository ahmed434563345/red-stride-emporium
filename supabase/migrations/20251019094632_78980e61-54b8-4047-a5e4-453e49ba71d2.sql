-- Add profile photo and additional vendor fields
ALTER TABLE vendor_profiles 
ADD COLUMN IF NOT EXISTS profile_photo_url TEXT,
ADD COLUMN IF NOT EXISTS banner_image_url TEXT,
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS website_url TEXT,
ADD COLUMN IF NOT EXISTS social_media JSONB DEFAULT '{}';

-- Enhance stores table with more fields
ALTER TABLE stores
ADD COLUMN IF NOT EXISTS banner_url TEXT,
ADD COLUMN IF NOT EXISTS business_hours JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS rating DECIMAL(2,1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_reviews INTEGER DEFAULT 0;

-- Add vendor info to products for customer visibility
ALTER TABLE products
ADD COLUMN IF NOT EXISTS vendor_logo_url TEXT,
ADD COLUMN IF NOT EXISTS vendor_business_name TEXT;

-- Create function to update vendor info on products when vendor profile changes
CREATE OR REPLACE FUNCTION update_product_vendor_info()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET 
    vendor_business_name = NEW.vendor_name,
    vendor_logo_url = NEW.profile_photo_url
  WHERE vendor_profile_id = NEW.id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update product vendor info
DROP TRIGGER IF EXISTS vendor_profile_update_trigger ON vendor_profiles;
CREATE TRIGGER vendor_profile_update_trigger
  AFTER UPDATE ON vendor_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_product_vendor_info();

-- Create view for public vendor stores
CREATE OR REPLACE VIEW public_vendor_stores AS
SELECT 
  s.id,
  s.name,
  s.store_description,
  s.store_logo_url,
  s.banner_url,
  s.location,
  s.rating,
  s.total_reviews,
  s.business_hours,
  s.phone,
  s.created_at,
  vp.vendor_name,
  vp.profile_photo_url,
  vp.bio,
  vp.website_url,
  COUNT(DISTINCT p.id) as product_count
FROM stores s
LEFT JOIN vendor_profiles vp ON s.vendor_profile_id = vp.id
LEFT JOIN products p ON p.store_id = s.id
WHERE s.is_active = true AND vp.status = 'approved'
GROUP BY s.id, vp.vendor_name, vp.profile_photo_url, vp.bio, vp.website_url;

-- RLS policy for public vendor stores view
ALTER VIEW public_vendor_stores SET (security_invoker = on);

-- Allow anyone to view active stores
CREATE POLICY "Anyone can view active stores" ON stores
  FOR SELECT USING (is_active = true);