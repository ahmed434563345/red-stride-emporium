
-- 1. Create `stores` table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Add `store_id` column to products table (nullable for existing data)
ALTER TABLE public.products ADD COLUMN store_id UUID REFERENCES public.stores(id);

-- 3. Enable RLS for stores so only admins can manage their own store rows
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Allow admin (by user_id) to select/update/insert/delete their own store row
CREATE POLICY "Admin can manage their own store" ON public.stores
  FOR ALL USING (admin_user_id = auth.uid()) WITH CHECK (admin_user_id = auth.uid());

-- 4. Update products policies so that only store admin can insert/update product for their own store
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Allow only the admin of the store to insert/update/delete their own store's products
CREATE POLICY "Store admin can manage their own products"
  ON public.products
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE public.stores.id = store_id AND public.stores.admin_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.stores
      WHERE public.stores.id = store_id AND public.stores.admin_user_id = auth.uid()
    )
  );
