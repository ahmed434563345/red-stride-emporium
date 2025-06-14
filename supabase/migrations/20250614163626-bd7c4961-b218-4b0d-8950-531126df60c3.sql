
-- Enable Row Level Security on existing tables (if not already enabled)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_analytics ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist and recreate them
DROP POLICY IF EXISTS "Anyone can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can update their own orders" ON public.orders;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.website_analytics;
DROP POLICY IF EXISTS "Authenticated users can view analytics" ON public.website_analytics;

-- Create RLS policies for products (public read access)
CREATE POLICY "Anyone can view products" ON public.products
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert products" ON public.products
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update products" ON public.products
    FOR UPDATE USING (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can delete products" ON public.products
    FOR DELETE USING (auth.uid() IS NOT NULL);

-- Create RLS policies for orders (users can only see their own orders)
CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for profiles (users can only see/edit their own profile)
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create RLS policies for website analytics (public insert, authenticated read)
CREATE POLICY "Anyone can insert analytics" ON public.website_analytics
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view analytics" ON public.website_analytics
    FOR SELECT USING (auth.uid() IS NOT NULL);

-- Add subcategory column if it doesn't exist
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory text;

-- Insert some default products with proper categories
INSERT INTO public.products (name, price, category, subcategory, description, stock, is_new, images) VALUES 
('Nike Air Force 1', 120, 'Shoes', 'Sneakers', 'Classic white sneakers', 50, true, ARRAY['/lovable-uploads/89e48b84-0586-4e14-b4e5-d11b38b4962c.png']),
('Barcelona Home Jersey 2024', 90, 'Athletic Wear', 'T-shirts', 'Official Barcelona home jersey', 30, true, ARRAY['/lovable-uploads/0e229d93-8ed2-4475-9fa4-c9dc86c63f76.png']),
('Nike Training Shorts', 45, 'Athletic Wear', 'Shorts', 'Comfortable training shorts', 40, false, ARRAY['/lovable-uploads/70691133-4b92-4f11-ae0e-8c73f1267caa.png']),
('Nike Track Pants', 75, 'Athletic Wear', 'Pants', 'Professional track pants', 25, false, ARRAY['/lovable-uploads/135a03be-032e-4e44-8519-3a802d0192a0.png']),
('American Eagle Black Graphic Tee', 25, 'Outerwear', 'T-shirts', 'Casual graphic tee', 60, false, ARRAY['/lovable-uploads/ecebd1a4-2de5-4911-bf69-38697a269054.png']),
('American Eagle Olive Graphic Tee', 28, 'Outerwear', 'T-shirts', 'Olive colored graphic tee', 45, false, ARRAY['/lovable-uploads/775ffd32-b47b-4081-b560-24e17fb8664a.png']),
('Winter Jacket', 95, 'Outerwear', 'Jackets', 'Warm winter jacket', 20, true, ARRAY['/lovable-uploads/9b98bff4-8569-4533-8eb7-e7a12673afc3.png'])
ON CONFLICT (id) DO NOTHING;

-- Create admin user role system
CREATE TABLE IF NOT EXISTS public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role text NOT NULL DEFAULT 'user',
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop and recreate user_roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

CREATE POLICY "Users can view their own roles" ON public.user_roles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles" ON public.user_roles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_roles ur 
            WHERE ur.user_id = auth.uid() AND ur.role = 'admin'
        )
    );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_roles.user_id = $1 AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers (drop first if exists)
DROP TRIGGER IF EXISTS handle_updated_at ON public.products;
DROP TRIGGER IF EXISTS handle_updated_at ON public.profiles;

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.products
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
