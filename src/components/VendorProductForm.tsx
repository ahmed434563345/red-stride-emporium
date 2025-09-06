import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface VendorProductFormProps {
  vendorProfileId: string;
}

const VendorProductForm = ({ vendorProfileId }: VendorProductFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    original_price: '',
    stock: '',
    category: '',
    subcategory: '',
    brand: '',
    weight: '',
    dimensions: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    shipping_time: '3-5 business days'
  });

  const [sizes, setSizes] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [features, setFeatures] = useState<string[]>([]);
  
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newFeature, setNewFeature] = useState('');

  const categories = [
    'Electronics', 'Fashion', 'Home & Garden', 'Sports & Outdoors',
    'Beauty & Personal Care', 'Books', 'Toys & Games', 'Automotive',
    'Health & Wellness', 'Food & Beverages'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addItem = (type: 'size' | 'color' | 'image' | 'feature') => {
    const newValues = { size: newSize, color: newColor, image: newImage, feature: newFeature };
    const setters = { size: setNewSize, color: setNewColor, image: setNewImage, feature: setNewFeature };
    const arrays = { size: sizes, color: colors, image: images, feature: features };
    const setArrays = { size: setSizes, color: setColors, image: setImages, feature: setFeatures };

    if (newValues[type].trim()) {
      setArrays[type]([...arrays[type], newValues[type].trim()]);
      setters[type]('');
    }
  };

  const removeItem = (type: 'size' | 'color' | 'image' | 'feature', index: number) => {
    const arrays = { size: sizes, color: colors, image: images, feature: features };
    const setArrays = { size: setSizes, color: setColors, image: setImages, feature: setFeatures };
    
    setArrays[type](arrays[type].filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        original_price: formData.original_price ? parseFloat(formData.original_price) : null,
        stock: parseInt(formData.stock),
        category: formData.category,
        subcategory: formData.subcategory || null,
        brand: formData.brand || null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        dimensions: formData.dimensions || null,
        sizes,
        colors,
        images,
        features,
        seo_title: formData.seo_title || null,
        seo_description: formData.seo_description || null,
        seo_keywords: formData.seo_keywords || null,
        shipping_time: formData.shipping_time,
        vendor_profile_id: vendorProfileId,
        is_new: true
      };

      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) throw error;

      toast.success('Product added successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        original_price: '',
        stock: '',
        category: '',
        subcategory: '',
        brand: '',
        weight: '',
        dimensions: '',
        seo_title: '',
        seo_description: '',
        seo_keywords: '',
        shipping_time: '3-5 business days'
      });
      setSizes([]);
      setColors([]);
      setImages([]);
      setFeatures([]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
        <CardDescription>Create a new product listing for your store</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name*</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleInputChange('brand', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description*</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              required
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (EGP)*</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="original_price">Original Price (EGP)</Label>
              <Input
                id="original_price"
                type="number"
                step="0.01"
                value={formData.original_price}
                onChange={(e) => handleInputChange('original_price', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock Quantity*</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category*</Label>
              <Select onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="subcategory">Subcategory</Label>
              <Input
                id="subcategory"
                value={formData.subcategory}
                onChange={(e) => handleInputChange('subcategory', e.target.value)}
              />
            </div>
          </div>

          {/* Sizes */}
          <div>
            <Label>Sizes</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                placeholder="Add size (e.g., S, M, L, XL)"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('size'))}
              />
              <Button type="button" onClick={() => addItem('size')} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((size, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {size}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem('size', index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div>
            <Label>Colors</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                placeholder="Add color"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('color'))}
              />
              <Button type="button" onClick={() => addItem('color')} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colors.map((color, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {color}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem('color', index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Images */}
          <div>
            <Label>Image URLs</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                placeholder="Add image URL"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('image'))}
              />
              <Button type="button" onClick={() => addItem('image')} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {images.map((image, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <img src={image} alt={`Product ${index + 1}`} className="w-16 h-16 object-cover rounded" />
                  <span className="flex-1 text-sm truncate">{image}</span>
                  <X className="h-4 w-4 cursor-pointer" onClick={() => removeItem('image', index)} />
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <Label>Features</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Add product feature"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addItem('feature'))}
              />
              <Button type="button" onClick={() => addItem('feature')} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem('feature', index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Physical Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="dimensions">Dimensions</Label>
              <Input
                id="dimensions"
                value={formData.dimensions}
                onChange={(e) => handleInputChange('dimensions', e.target.value)}
                placeholder="L x W x H"
              />
            </div>
            <div>
              <Label htmlFor="shipping_time">Shipping Time</Label>
              <Input
                id="shipping_time"
                value={formData.shipping_time}
                onChange={(e) => handleInputChange('shipping_time', e.target.value)}
              />
            </div>
          </div>

          {/* SEO */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">SEO Optimization</h3>
            <div>
              <Label htmlFor="seo_title">SEO Title</Label>
              <Input
                id="seo_title"
                value={formData.seo_title}
                onChange={(e) => handleInputChange('seo_title', e.target.value)}
                placeholder="Optimized title for search engines"
              />
            </div>
            <div>
              <Label htmlFor="seo_description">SEO Description</Label>
              <Textarea
                id="seo_description"
                value={formData.seo_description}
                onChange={(e) => handleInputChange('seo_description', e.target.value)}
                placeholder="Meta description for search engines"
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="seo_keywords">SEO Keywords</Label>
              <Input
                id="seo_keywords"
                value={formData.seo_keywords}
                onChange={(e) => handleInputChange('seo_keywords', e.target.value)}
                placeholder="Comma-separated keywords"
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Adding Product...' : 'Add Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default VendorProductForm;