import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from "@/contexts/AuthContext";
import { apiClient } from "@/services/api";
import { Product, CreateProductRequest } from "@/types/api";
import { Plus, Edit, Trash2, Upload, Save, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const [newProduct, setNewProduct] = useState<CreateProductRequest>({
    name: "",
    price: 0,
    description: "",
    brand: "",
    category: "Rods",
    stock: 0,
    summary: "",
    image: "/images/product1.jpg",
    availabilityDate: null,
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth");
      return;
    }
    
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }

    loadProducts();
  }, [isAuthenticated, isAdmin, navigate]);

  const loadProducts = async () => {
    try {
      const productList = await apiClient.getProducts();
      setProducts(productList);
    } catch (error) {
      console.error("Error loading products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newProduct.name || !newProduct.brand || newProduct.price <= 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const response = await apiClient.createProduct(newProduct);
      if (response.status === "success") {
        toast.success("Product created successfully!");
        setIsAddDialogOpen(false);
        setNewProduct({
          name: "",
          price: 0,
          description: "",
          brand: "",
          category: "Rods",
          stock: 0,
          summary: "",
          image: "/images/product1.jpg",
          availabilityDate: null,
        });
        loadProducts();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to create product");
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const response = await apiClient.updateProduct(editingProduct._id, {
        name: editingProduct.name,
        price: editingProduct.price,
        description: editingProduct.description,
        brand: editingProduct.brand,
        category: editingProduct.category,
        stock: editingProduct.stock,
        summary: editingProduct.summary,
        image: editingProduct.image,
        availabilityDate: editingProduct.availabilityDate,
      });
      
      if (response.status === "success") {
        toast.success("Product updated successfully!");
        setEditingProduct(null);
        loadProducts();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update product");
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await apiClient.deleteProduct(productId);
      if (response.status === "success") {
        toast.success("Product deleted successfully!");
        loadProducts();
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const handleImageUpload = async (file: File, setImageUrl: (url: string) => void) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const base64 = e.target?.result as string;
        const response = await apiClient.uploadImage({
          imageData: base64,
          fileName: file.name,
        });
        
        if (response.status === "success") {
          setImageUrl(response.imageUrl);
          toast.success("Image uploaded successfully!");
        }
      } catch (error: any) {
        toast.error(error.message || "Failed to upload image");
      }
    };
    reader.readAsDataURL(file);
  };

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="brand">Brand *</Label>
                  <Input
                    id="brand"
                    value={newProduct.brand}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, brand: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, stock: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select value={newProduct.category} onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rods">Rods</SelectItem>
                      <SelectItem value="Reels">Reels</SelectItem>
                      <SelectItem value="Lures">Lures</SelectItem>
                      <SelectItem value="Tackle Boxes">Tackle Boxes</SelectItem>
                      <SelectItem value="Clothing">Clothing</SelectItem>
                      <SelectItem value="Accessories">Accessories</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                <Input
                  id="summary"
                  value={newProduct.summary}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, summary: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <div className="flex gap-2">
                  <Input
                    id="image"
                    value={newProduct.image}
                    onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleImageUpload(file, (url) => setNewProduct(prev => ({ ...prev, image: url })));
                      }
                    }}
                    className="hidden"
                    id="image-upload"
                  />
                  <Button type="button" onClick={() => document.getElementById('image-upload')?.click()}>
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Product</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    {editingProduct?._id === product._id ? (
                      <Input
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct(prev => prev ? { ...prev, name: e.target.value } : null)}
                      />
                    ) : (
                      product.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProduct?._id === product._id ? (
                      <Input
                        value={editingProduct.brand}
                        onChange={(e) => setEditingProduct(prev => prev ? { ...prev, brand: e.target.value } : null)}
                      />
                    ) : (
                      product.brand
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge>{product.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {editingProduct?._id === product._id ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={editingProduct.price}
                        onChange={(e) => setEditingProduct(prev => prev ? { ...prev, price: parseFloat(e.target.value) || 0 } : null)}
                      />
                    ) : (
                      `R${product.price.toFixed(2)}`
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProduct?._id === product._id ? (
                      <Input
                        type="number"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct(prev => prev ? { ...prev, stock: parseInt(e.target.value) || 0 } : null)}
                      />
                    ) : (
                      product.stock
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {editingProduct?._id === product._id ? (
                        <>
                          <Button size="sm" onClick={handleUpdateProduct}>
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button size="sm" onClick={() => setEditingProduct(null)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button size="sm" onClick={() => setEditingProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduct(product._id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;