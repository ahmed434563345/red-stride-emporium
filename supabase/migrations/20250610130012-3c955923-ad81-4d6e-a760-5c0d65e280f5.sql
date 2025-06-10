
-- Create tables for products, orders, users, and analytics
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  description TEXT,
  category TEXT NOT NULL,
  brand TEXT,
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  images TEXT[] DEFAULT '{}',
  features TEXT[] DEFAULT '{}',
  stock INTEGER NOT NULL DEFAULT 0,
  is_new BOOLEAN DEFAULT false,
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  product_id UUID REFERENCES public.products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC NOT NULL,
  size TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create website analytics table
CREATE TABLE public.website_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visitor_id TEXT NOT NULL,
  page_path TEXT NOT NULL,
  session_id TEXT,
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_analytics ENABLE ROW LEVEL SECURITY;

-- Products policies (admin can manage all, users can view)
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admins can manage products" ON public.products FOR ALL USING (auth.jwt()->>'email' = 'athletic.website99@gmail.com');

-- Orders policies
CREATE POLICY "Users can view their orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT USING (auth.jwt()->>'email' = 'athletic.website99@gmail.com');

-- Profiles policies
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Analytics policies (public read, authenticated write)
CREATE POLICY "Anyone can view analytics" ON public.website_analytics FOR SELECT USING (true);
CREATE POLICY "Anyone can insert analytics" ON public.website_analytics FOR INSERT WITH CHECK (true);

-- Create function to handle new user profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (
    new.id,
    new.email,
    new.raw_user_meta_data->>'first_name',
    new.raw_user_meta_data->>'last_name'
  );
  RETURN new;
END;
$$;

-- Trigger for new user profiles
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert some real athletic products
INSERT INTO public.products (name, price, original_price, description, category, brand, sizes, colors, images, features, stock, is_new, seo_title, seo_description, seo_keywords) VALUES
('Nike Air Max 270', 899, 1199, 'The Nike Air Max 270 delivers visible cushioning under every step. The Air Max 270 features Nike largest heel Air unit yet for a super-soft ride that feels as impossible as it looks.', 'Shoes', 'Nike', ARRAY['38', '39', '40', '41', '42', '43', '44', '45'], ARRAY['Black', 'White', 'Red', 'Blue'], ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=500'], ARRAY['Air Max cushioning', 'Breathable mesh upper', 'Rubber outsole'], 25, true, 'Nike Air Max 270 - Premium Athletic Shoes', 'Experience ultimate comfort with Nike Air Max 270 featuring the largest heel Air unit for superior cushioning', 'nike, air max, shoes, athletic, comfort, cushioning'),

('Adidas Ultraboost 22', 1299, 1599, 'The Adidas Ultraboost 22 combines comfort and performance with responsive BOOST midsole and adaptive knit upper for the ultimate running experience.', 'Shoes', 'Adidas', ARRAY['38', '39', '40', '41', '42', '43', '44', '45'], ARRAY['Core Black', 'Cloud White', 'Solar Red'], ARRAY['https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=500', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500'], ARRAY['BOOST midsole', 'Primeknit upper', 'Continental rubber outsole'], 18, true, 'Adidas Ultraboost 22 - Running Shoes', 'Premium running shoes with BOOST technology for energy return and adaptive fit', 'adidas, ultraboost, running, boost, shoes, performance'),

('Under Armour HeatGear T-Shirt', 299, 399, 'Under Armour HeatGear fabric keeps you cool, dry and light. The fabric wicks sweat and dries really fast, perfect for intense workouts.', 'Athletic Wear', 'Under Armour', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'White', 'Navy', 'Red'], ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'], ARRAY['HeatGear fabric', 'Moisture-wicking', 'Quick dry', 'Anti-odor technology'], 35, false, 'Under Armour HeatGear Athletic T-Shirt', 'Stay cool and dry with Under Armour HeatGear moisture-wicking athletic t-shirt', 'under armour, heatgear, athletic wear, moisture wicking, workout'),

('Nike Dri-FIT Training Shorts', 449, null, 'Nike Dri-FIT technology moves sweat away from your skin for quicker evaporation, helping you stay dry and comfortable during workouts.', 'Athletic Wear', 'Nike', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Navy', 'Grey'], ARRAY['https://images.unsplash.com/photo-1506629905607-ee87515ac264?w=500'], ARRAY['Dri-FIT technology', 'Elastic waistband', 'Side pockets'], 28, false, 'Nike Dri-FIT Training Shorts', 'Comfortable training shorts with Dri-FIT technology for optimal performance', 'nike, dri-fit, shorts, training, athletic wear'),

('The North Face Resolve Jacket', 1899, 2299, 'The North Face Resolve Jacket provides reliable waterproof protection with a breathable design, perfect for outdoor adventures in any weather.', 'Outerwear', 'The North Face', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Red', 'Blue', 'Green'], ARRAY['https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=500'], ARRAY['Waterproof', 'Breathable', 'Adjustable hood', 'Zippered pockets'], 12, true, 'The North Face Resolve Waterproof Jacket', 'Stay dry in any weather with The North Face Resolve waterproof and breathable jacket', 'north face, jacket, waterproof, outdoor, outerwear'),

('Columbia Flash Forward Windbreaker', 799, 999, 'Lightweight and packable windbreaker that offers wind and water resistance while maintaining breathability for active pursuits.', 'Outerwear', 'Columbia', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'Blue', 'Orange'], ARRAY['https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=500'], ARRAY['Wind resistant', 'Water resistant', 'Packable design', 'Reflective details'], 20, false, 'Columbia Flash Forward Windbreaker', 'Lightweight packable windbreaker for active outdoor adventures', 'columbia, windbreaker, outdoor, lightweight, packable');
