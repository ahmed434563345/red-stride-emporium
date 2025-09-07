-- Fix infinite recursion in user_roles by creating a security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Enable all access for admin email" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Create new policies using the security definer function
CREATE POLICY "Admins can manage all user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Add vendor role support
CREATE POLICY "Vendors can view their own vendor role"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id AND role = 'vendor');

-- Enable realtime for vendor notifications and messages
ALTER TABLE vendor_notifications REPLICA IDENTITY FULL;
ALTER TABLE vendor_messages REPLICA IDENTITY FULL;
ALTER TABLE chat_messages REPLICA IDENTITY FULL;

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE vendor_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_messages;