
-- Update the admin policy to use the correct email
DROP POLICY IF EXISTS "Admin can view all orders" ON public.orders;

CREATE POLICY "Admin can view all orders" ON public.orders
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND email = 'athletic.website99@gmail.com'
    )
  );
