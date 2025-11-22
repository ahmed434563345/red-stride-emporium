-- Add is_archived column to products table
ALTER TABLE public.products 
ADD COLUMN is_archived boolean NOT NULL DEFAULT false;

-- Create index for better query performance
CREATE INDEX idx_products_is_archived ON public.products(is_archived);

-- Add comment for documentation
COMMENT ON COLUMN public.products.is_archived IS 'Soft delete flag - archived products are hidden but not deleted';