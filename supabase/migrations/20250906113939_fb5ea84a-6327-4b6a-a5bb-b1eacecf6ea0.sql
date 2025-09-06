-- Create vendor profiles table
CREATE TABLE public.vendor_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vendor_name TEXT NOT NULL,
  business_email TEXT NOT NULL,
  business_phone TEXT NOT NULL,
  business_address TEXT,
  business_description TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  commission_rate DECIMAL(5,2) DEFAULT 15.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on vendor_profiles
ALTER TABLE public.vendor_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for vendor_profiles
CREATE POLICY "Vendors can view their own profile" 
ON public.vendor_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Vendors can update their own profile" 
ON public.vendor_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Anyone can create vendor profile" 
ON public.vendor_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all vendor profiles" 
ON public.vendor_profiles 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Update stores table to link with vendor_profiles
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS vendor_profile_id UUID REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
ADD COLUMN IF NOT EXISTS store_description TEXT,
ADD COLUMN IF NOT EXISTS store_logo_url TEXT,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update products table for vendor management
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS vendor_profile_id UUID REFERENCES public.vendor_profiles(id) ON DELETE CASCADE;

-- Create vendor notifications table
CREATE TABLE public.vendor_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_profile_id UUID NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('order_placed', 'product_reviewed', 'payout_ready', 'system_message')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on vendor_notifications
ALTER TABLE public.vendor_notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for vendor_notifications
CREATE POLICY "Vendors can view their own notifications" 
ON public.vendor_notifications 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM vendor_profiles 
  WHERE id = vendor_notifications.vendor_profile_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Vendors can update their own notifications" 
ON public.vendor_notifications 
FOR UPDATE 
USING (EXISTS (
  SELECT 1 FROM vendor_profiles 
  WHERE id = vendor_notifications.vendor_profile_id 
  AND user_id = auth.uid()
));

-- Create vendor_messages table for communication
CREATE TABLE public.vendor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_profile_id UUID NOT NULL REFERENCES public.vendor_profiles(id) ON DELETE CASCADE,
  admin_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('vendor', 'admin')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  parent_message_id UUID REFERENCES public.vendor_messages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on vendor_messages
ALTER TABLE public.vendor_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for vendor_messages
CREATE POLICY "Vendors can view their own messages" 
ON public.vendor_messages 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM vendor_profiles 
  WHERE id = vendor_messages.vendor_profile_id 
  AND user_id = auth.uid()
));

CREATE POLICY "Vendors can create messages" 
ON public.vendor_messages 
FOR INSERT 
WITH CHECK (EXISTS (
  SELECT 1 FROM vendor_profiles 
  WHERE id = vendor_messages.vendor_profile_id 
  AND user_id = auth.uid()
) AND sender_type = 'vendor');

CREATE POLICY "Admins can manage all messages" 
ON public.vendor_messages 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM user_roles 
  WHERE user_id = auth.uid() AND role = 'admin'
));

-- Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION public.update_vendor_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for vendor_profiles
CREATE TRIGGER update_vendor_profiles_updated_at
BEFORE UPDATE ON public.vendor_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_vendor_updated_at();

-- Add vendor role to existing enum or create if needed
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user', 'vendor');
  ELSE
    ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'vendor';
  END IF;
END$$;