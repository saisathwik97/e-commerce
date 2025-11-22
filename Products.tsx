
import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const mockProducts = [
  {
    id: "prod-1",
    name: "Handcrafted Wooden Serving Bowl",
    price: "$18.50",
    minOrder: "100 units",
    category: "Home Goods",
    status: "Active",
    stock: "850 units",
    image: "/placeholder.svg"
  },
  {
    id: "prod-2",
    name: "Organic Cotton T-shirt",
    price: "$4.20",
    minOrder: "500 units",
    category: "Textiles",
    status: "Active",
    stock: "5,000 units",
    image: "/placeholder.svg"
  },
  {
    id: "prod-3",
    name: "Handwoven Jute Bag",
    price: "$3.80",
    minOrder: "300 units",
    category: "Fashion & Accessories",
    status: "Low Stock",
    stock: "120 units",
    image: "/placeholder.svg"
  },
  {
    id: "prod-4",
    name: "Brass Door Handle",
    price: "$7.90",
    minOrder: "200 units",
    category: "Home Goods",
    status: "Inactive",
    stock: "0 units",
    image: "/placeholder.svg"
  }
];

const SellerProducts = () => {
  const [products, setProducts] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewProductDialog, setShowNewProductDialog] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    minOrder: "",
    category: "",
    description: "",
    stock: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateProduct = () => {
    // Validate inputs
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create new product
    const createdProduct = {
      id: `prod-${products.length + 1}`,
      name: newProduct.name,
      price: newProduct.price.startsWith("$") ? newProduct.price : `$${newProduct.price}`,
      minOrder: newProduct.minOrder.includes("units") ? newProduct.minOrder : `${newProduct.minOrder} units`,
      category: newProduct.category,
      status: "Active",
      stock: newProduct.stock.includes("units") ? newProduct.stock : `${newProduct.stock} units`,
      image: "/placeholder.svg"
    };

    setProducts([createdProduct, ...products]);

    // Reset form and close dialog
    setNewProduct({
      name: "",
      price: "",
      minOrder: "",
      category: "",
      description: "",
      stock: ""
    });

    setShowNewProductDialog(false);
    toast.success("Product created successfully");
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <DashboardLayout title="My Products" userType="seller">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            🔍
          </span>
        </div>
        
        <Dialog open={showNewProductDialog} onOpenChange={setShowNewProductDialog}>
          <DialogTrigger asChild>
            <Button className="bg-marketplace-blue hover:bg-marketplace-blue-light w-full sm:w-auto">
              Add New Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Enter the details of your new product
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Product Name*
                </label>
                <Input
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="price" className="text-sm font-medium">
                    Price (per unit)*
                  </label>
                  <Input
                    id="price"
                    name="price"
                    placeholder="e.g. 18.50"
                    value={newProduct.price}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="minOrder" className="text-sm font-medium">
                    Minimum Order
                  </label>
                  <Input
                    id="minOrder"
                    name="minOrder"
                    placeholder="e.g. 100 units"
                    value={newProduct.minOrder}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Category*
                  </label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g. Home Goods"
                    value={newProduct.category}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="stock" className="text-sm font-medium">
                    Stock Available
                  </label>
                  <Input
                    id="stock"
                    name="stock"
                    placeholder="e.g. 850 units"
                    value={newProduct.stock}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={newProduct.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowNewProductDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-marketplace-blue hover:bg-marketplace-blue-light"
                onClick={handleCreateProduct}
              >
                Add Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="overflow-hidden">
            <div className="relative h-48 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <Badge 
                className={`absolute top-2 right-2 ${getStatusColor(product.status)}`}
              >
                {product.status}
              </Badge>
            </div>
            
            <CardHeader>
              <CardTitle className="text-lg">{product.name}</CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Price (per unit):</span>
                  <span className="font-medium">{product.price}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Min. Order:</span>
                  <span>{product.minOrder}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Category:</span>
                  <span>{product.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Available:</span>
                  <span>{product.stock}</span>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t pt-4">
              <Button variant="outline" size="sm">Edit</Button>
              <Button 
                variant="outline" 
                size="sm" 
                className={product.status === "Active" ? "border-red-200 text-red-600" : "border-green-200 text-green-600"}
              >
                {product.status === "Active" ? "Deactivate" : "Activate"}
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">No products found</p>
            <Button 
              variant="outline" 
              onClick={() => setShowNewProductDialog(true)}
            >
              Add your first product
            </Button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SellerProducts;
