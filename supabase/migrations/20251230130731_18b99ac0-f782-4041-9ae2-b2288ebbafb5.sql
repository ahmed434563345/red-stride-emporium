-- Create categories table for admin to manage product categories
CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  slug text NOT NULL UNIQUE,
  description text,
  icon text,
  parent_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Anyone can view active categories
CREATE POLICY "Anyone can view active categories"
ON public.categories
FOR SELECT
USING (is_active = true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
USING (is_admin(auth.uid()));

-- Insert default categories
INSERT INTO public.categories (name, slug, icon, sort_order) VALUES
  ('Footwear', 'footwear', 'footprints', 1),
  ('Men''s T-Shirts', 'men-t-shirts', 'shirt', 2),
  ('Men''s Jeans', 'men-jeans', 'package', 3),
  ('Men''s Accessories', 'men-caps-accessories', 'watch', 4),
  ('Women''s T-Shirts', 'women-t-shirts', 'shirt', 5),
  ('Women''s Jeans', 'women-jeans', 'package', 6),
  ('Women''s Accessories', 'women-caps-accessories', 'watch', 7),
  ('Athletic Wear', 'athletic-wear', 'zap', 8),
  ('Outerwear', 'outerwear', 'shirt', 9),
  ('Electronics', 'electronics', 'smartphone', 10),
  ('Home & Garden', 'home-garden', 'home', 11),
  ('Books', 'books', 'book-open', 12),
  ('Beauty', 'beauty', 'sparkles', 13);