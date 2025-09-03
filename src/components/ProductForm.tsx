import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';

interface Store {
  id: string;
  name: string;
  phone: string;
}

interface ProductFormData {
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  brand: string;
  features: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
}

const ProductForm = ({ onProductAdded }: { onProductAdded?: () => void }) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    originalPrice: 0,
    description: '',
    category: '',
    sizes: [],
    colors: [],
    images: [],
    stock: 0,
    brand: '',
    features: [],
    seoTitle: '',
    seoDescription: '',
    seoKeywords: ''
  });
  
  const [newSize, setNewSize] = useState('');
  const [newColor, setNewColor] = useState('');
  const [newImage, setNewImage] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // No longer require store selection

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const productToStore = {
        vendor_id: user?.id || null,
        name: formData.name,
        price: Number(formData.price),
        original_price: formData.originalPrice || null,
        description: formData.description,
        category: formData.category,
        sizes: formData.sizes.length ? formData.sizes : [],
        colors: formData.colors.length ? formData.colors : [],
        images: formData.images.length ? formData.images : null,
        stock: Number(formData.stock),
        brand: formData.brand,
        features: formData.features.length ? formData.features : [],
        seo_title: formData.seoTitle || null,
        seo_description: formData.seoDescription || null,
        seo_keywords: formData.seoKeywords || null,
        is_new: true
      };

      const { error } = await supabase.from('products').insert([productToStore]);
      if (error) {
        toast.error('Failed to save product to website: ' + error.message);
      } else {
        toast.success('Product added to website!');
      }

      // Also save to localStorage for admin notifications
      const product = {
        id: Date.now().toString(),
        ...formData,
        originalPrice: formData.originalPrice || undefined,
        isNew: true,
        inStock: formData.stock > 0,
        createdAt: new Date().toISOString(),
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      };

      // Save to localStorage
      const existingProducts = JSON.parse(localStorage.getItem('adminProducts') || '[]');
      existingProducts.push(product);
      localStorage.setItem('adminProducts', JSON.stringify(existingProducts));

      // Send notification email (existing logic)
      const notifications = JSON.parse(localStorage.getItem('adminNotifications') || '[]');
      notifications.unshift({
        id: Date.now(),
        type: 'product_added',
        productName: product.name,
        timestamp: new Date().toISOString(),
        read: false
      });
      localStorage.setItem('adminNotifications', JSON.stringify(notifications));

      // Reset form
      setFormData({
        name: '',
        price: 0,
        originalPrice: 0,
        description: '',
        category: '',
        sizes: [],
        colors: [],
        images: [],
        stock: 0,
        brand: '',
        features: [],
        seoTitle: '',
        seoDescription: '',
        seoKeywords: ''
      });

      onProductAdded?.();
    } catch (error) {
      toast.error('Failed to add product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSize = () => {
    if (newSize && !formData.sizes.includes(newSize)) {
      setFormData(prev => ({ ...prev, sizes: [...prev.sizes, newSize] }));
      setNewSize('');
    }
  };

  const addColor = () => {
    if (newColor && !formData.colors.includes(newColor)) {
      setFormData(prev => ({ ...prev, colors: [...prev.colors, newColor] }));
      setNewColor('');
    }
  };

  const addImage = () => {
    if (newImage && !formData.images.includes(newImage)) {
      setFormData(prev => ({ ...prev, images: [...prev.images, newImage] }));
      setNewImage('');
    }
  };

  const addFeature = () => {
    if (newFeature && !formData.features.includes(newFeature)) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature] }));
      setNewFeature('');
    }
  };

  const removeItem = (type: 'sizes' | 'colors' | 'images' | 'features', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData(prev => ({ ...prev, brand: e.target.value }))}
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (L.E) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Original Price (L.E)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Quantity *</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                required
              />
            </div>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {/* Men Categories */}
                <SelectItem value="Men / T-Shirts">Men / T-Shirts</SelectItem>
                <SelectItem value="Men / Jeans">Men / Jeans</SelectItem>
                <SelectItem value="Men / Caps & Accessories">Men / Caps & Accessories</SelectItem>
                {/* Women Categories */}
                <SelectItem value="Women / T-Shirts">Women / T-Shirts</SelectItem>
                <SelectItem value="Women / Jeans">Women / Jeans</SelectItem>
                <SelectItem value="Women / Caps & Accessories">Women / Caps & Accessories</SelectItem>
                {/* Existing categories (keep for legacy support) */}
                <SelectItem value="Shoes">Shoes</SelectItem>
                <SelectItem value="Athletic Wear">Athletic Wear</SelectItem>
                <SelectItem value="Outerwear">Outerwear</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              required
            />
          </div>

          {/* Sizes */}
          <div className="space-y-2">
            <Label>Available Sizes</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add size (e.g., M, L, XL, 42, 43)"
                value={newSize}
                onChange={(e) => setNewSize(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSize())}
              />
              <Button type="button" onClick={addSize}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map((size, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {size}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem('sizes', index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2">
            <Label>Available Colors</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add color (e.g., Red, Blue, Black)"
                value={newColor}
                onChange={(e) => setNewColor(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addColor())}
              />
              <Button type="button" onClick={addColor}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.colors.map((color, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {color}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem('colors', index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Product Images</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Image URL (e.g., https://example.com/image.jpg)"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
              />
              <Button type="button" onClick={addImage}>
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {formData.images.map((image, index) => (
                <div key={index} className="flex items-center gap-2 p-2 border rounded">
                  <img src={image} alt={`Product ${index + 1}`} className="w-10 h-10 object-cover rounded" />
                  <span className="flex-1 text-sm truncate">{image}</span>
                  <X className="h-4 w-4 cursor-pointer" onClick={() => removeItem('images', index)} />
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="space-y-2">
            <Label>Product Features</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add feature (e.g., Breathable material, Waterproof)"
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {feature}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => removeItem('features', index)} />
                </Badge>
              ))}
            </div>
          </div>

          {/* SEO Section */}
          <div className="border-t pt-6 space-y-4">
            <h3 className="text-lg font-semibold">SEO Optimization</h3>
            
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO Title</Label>
              <Input
                id="seoTitle"
                value={formData.seoTitle}
                onChange={(e) => setFormData(prev => ({ ...prev, seoTitle: e.target.value }))}
                placeholder="Optimized title for search engines"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO Description</Label>
              <Textarea
                id="seoDescription"
                value={formData.seoDescription}
                onChange={(e) => setFormData(prev => ({ ...prev, seoDescription: e.target.value }))}
                placeholder="Brief description for search engine results"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="seoKeywords">SEO Keywords</Label>
              <Input
                id="seoKeywords"
                value={formData.seoKeywords}
                onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                placeholder="Comma-separated keywords (e.g., shoes, sneakers, sports)"
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full athletic-gradient">
            {isSubmitting ? 'Adding Product...' : 'Add Product'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;
