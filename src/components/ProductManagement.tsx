import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  description?: string;
  category: string;
  stock: number;
  brand?: string;
  images?: string[];
  is_new?: boolean;
}

const ProductManagement = () => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Product[];
    }
  });

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', productId);

    if (error) {
      toast.error('Failed to delete product');
      return;
    }

    toast.success('Product deleted successfully');
    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
  };

  const handleSaveProduct = async (productData: Partial<Product>) => {
    if (editingProduct) {
      // Update existing product
      const { error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          price: productData.price,
          original_price: productData.original_price || null,
          description: productData.description,
          category: productData.category,
          stock: productData.stock,
          brand: productData.brand,
        })
        .eq('id', editingProduct.id);

      if (error) {
        toast.error('Failed to update product');
        return;
      }

      toast.success('Product updated successfully');
      setIsEditDialogOpen(false);
    } else {
      // Create new product
      const { error } = await supabase
        .from('products')
        .insert([{
          name: productData.name,
          price: productData.price,
          original_price: productData.original_price || null,
          description: productData.description,
          category: productData.category,
          stock: productData.stock,
          brand: productData.brand,
          images: [],
          is_new: true,
        }]);

      if (error) {
        toast.error('Failed to create product');
        return;
      }

      toast.success('Product created successfully');
      setIsCreateDialogOpen(false);
    }

    queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    setEditingProduct(null);
  };

  const ProductForm = ({ product, onSave }: { product?: Product; onSave: (data: Partial<Product>) => void }) => {
    const [formData, setFormData] = useState({
      name: product?.name || '',
      price: product?.price?.toString() || '',
      original_price: product?.original_price?.toString() || '',
      description: product?.description || '',
      category: product?.category || '',
      stock: product?.stock?.toString() || '',
      brand: product?.brand || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSave({
        name: formData.name,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : undefined,
        description: formData.description,
        category: formData.category,
        stock: parseInt(formData.stock),
        brand: formData.brand,
      });
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Price (L.E)</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="original_price">Original Price (L.E)</Label>
            <Input
              id="original_price"
              type="number"
              step="0.01"
              value={formData.original_price}
              onChange={(e) => setFormData({ ...formData, original_price: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock">Stock</Label>
            <Input
              id="stock"
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input
              id="brand"
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
        </div>

        <Button type="submit" className="w-full souq-gradient text-white">
          {product ? 'Update Product' : 'Create Product'}
        </Button>
      </form>
    );
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Product Management</h2>
          <div className="text-muted-foreground">
            Total Products: <Badge variant="secondary">{products.length}</Badge>
          </div>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="souq-gradient text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>
            <ProductForm onSave={handleSaveProduct} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {products.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {product.name}
                    {product.is_new && <Badge className="bg-green-500">New</Badge>}
                  </CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline">{product.category}</Badge>
                    {product.brand && <Badge variant="secondary">{product.brand}</Badge>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Edit Product</DialogTitle>
                      </DialogHeader>
                      {editingProduct && (
                        <ProductForm product={editingProduct} onSave={handleSaveProduct} />
                      )}
                    </DialogContent>
                  </Dialog>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProduct(product.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="font-medium">Price</p>
                  <p className="text-souq-gold font-semibold">{product.price} L.E</p>
                  {product.original_price && (
                    <p className="text-muted-foreground line-through text-xs">
                      {product.original_price} L.E
                    </p>
                  )}
                </div>
                <div>
                  <p className="font-medium">Stock</p>
                  <p className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                    {product.stock} units
                  </p>
                </div>
                <div>
                  <p className="font-medium">Images</p>
                  <p className="text-muted-foreground">{product.images?.length || 0} images</p>
                </div>
                <div>
                  <p className="font-medium">Status</p>
                  <Badge variant={product.stock > 0 ? 'default' : 'destructive'}>
                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </Badge>
                </div>
              </div>
              {product.description && (
                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                  {product.description}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="text-center py-16">
            <p className="text-lg text-muted-foreground mb-4">No products found</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="souq-gradient text-white"
            >
              Create Your First Product
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductManagement;