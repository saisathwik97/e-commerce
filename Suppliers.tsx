
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

const mockSuppliers = [
  {
    id: "SUP-2501",
    name: "Artisan Crafts India",
    location: "Jaipur, Rajasthan",
    categories: ["Handicrafts", "Home Decor"],
    rating: 4.8,
    verified: true,
    contact: "Rajesh Sharma",
    phone: "+91 98765 43210",
    email: "contact@artisancrafts.in",
    notes: "Excellent for handmade items and traditional crafts. Good communication and reliable timelines."
  },
  {
    id: "SUP-2487",
    name: "Global Textiles Ltd",
    location: "Tirupur, Tamil Nadu",
    categories: ["Textiles", "Apparel"],
    rating: 4.5,
    verified: true,
    contact: "Priya Patel",
    phone: "+91 87654 32109",
    email: "info@globaltextiles.in",
    notes: "Specializes in organic cotton garments. Can handle large orders with consistent quality."
  },
  {
    id: "SUP-2465",
    name: "Premium Woods",
    location: "Saharanpur, Uttar Pradesh",
    categories: ["Furniture", "Wooden Crafts"],
    rating: 4.2,
    verified: true,
    contact: "Amit Singh",
    phone: "+91 76543 21098",
    email: "sales@premiumwoods.co.in",
    notes: "High-quality wooden furniture and products. Custom designs available. Longer lead times but worth the wait."
  },
  {
    id: "SUP-2452",
    name: "Eco Living Products",
    location: "Ahmedabad, Gujarat",
    categories: ["Home Goods", "Sustainable Products"],
    rating: 4.6,
    verified: false,
    contact: "Neha Mehta",
    phone: "+91 65432 10987",
    email: "connect@ecolivingproducts.in",
    notes: "Specializes in eco-friendly home products. Good for sustainable and biodegradable items."
  },
  {
    id: "SUP-2441",
    name: "Modern Metals",
    location: "Moradabad, Uttar Pradesh",
    categories: ["Metal Crafts", "Home Decor"],
    rating: 4.0,
    verified: true,
    contact: "Sanjay Gupta",
    phone: "+91 54321 09876",
    email: "inquiries@modernmetals.in",
    notes: "Brass and copper products of good quality. Can handle customization and bulk orders."
  }
];

const AgentSuppliers = () => {
  const [suppliers, setSuppliers] = useState(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showNewSupplierDialog, setShowNewSupplierDialog] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [showSupplierDetails, setShowSupplierDetails] = useState(false);
  
  const [newSupplier, setNewSupplier] = useState({
    name: "",
    location: "",
    category: "",
    contact: "",
    phone: "",
    email: "",
    notes: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCreateSupplier = () => {
    // Validate inputs
    if (!newSupplier.name || !newSupplier.location || !newSupplier.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Create new supplier
    const createdSupplier = {
      id: `SUP-${Math.floor(2400 + Math.random() * 200)}`,
      name: newSupplier.name,
      location: newSupplier.location,
      categories: newSupplier.category ? [newSupplier.category] : ["Uncategorized"],
      rating: 0,
      verified: false,
      contact: newSupplier.contact,
      phone: newSupplier.phone,
      email: newSupplier.email,
      notes: newSupplier.notes
    };

    setSuppliers([createdSupplier, ...suppliers]);

    // Reset form and close dialog
    setNewSupplier({
      name: "",
      location: "",
      category: "",
      contact: "",
      phone: "",
      email: "",
      notes: ""
    });

    setShowNewSupplierDialog(false);
    toast.success("Supplier added successfully");
  };
  
  const viewSupplierDetails = (supplier: any) => {
    setSelectedSupplier(supplier);
    setShowSupplierDetails(true);
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.categories.some(category => category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout title="My Suppliers" userType="agent">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <Input
            placeholder="Search suppliers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-80"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
            🔍
          </span>
        </div>
        
        <Dialog open={showNewSupplierDialog} onOpenChange={setShowNewSupplierDialog}>
          <DialogTrigger asChild>
            <Button className="bg-marketplace-blue hover:bg-marketplace-blue-light w-full sm:w-auto">
              Add New Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Enter the details of your supplier
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Supplier Name*
                </label>
                <Input
                  id="name"
                  name="name"
                  value={newSupplier.name}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="location" className="text-sm font-medium">
                    Location*
                  </label>
                  <Input
                    id="location"
                    name="location"
                    placeholder="e.g. Mumbai, Maharashtra"
                    value={newSupplier.location}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="category" className="text-sm font-medium">
                    Main Category
                  </label>
                  <Input
                    id="category"
                    name="category"
                    placeholder="e.g. Textiles"
                    value={newSupplier.category}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="contact" className="text-sm font-medium">
                  Contact Person
                </label>
                <Input
                  id="contact"
                  name="contact"
                  value={newSupplier.contact}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    value={newSupplier.phone}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="grid gap-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email*
                  </label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    value={newSupplier.email}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="notes" className="text-sm font-medium">
                  Notes
                </label>
                <Textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={newSupplier.notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowNewSupplierDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-marketplace-blue hover:bg-marketplace-blue-light"
                onClick={handleCreateSupplier}
              >
                Add Supplier
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{supplier.name}</CardTitle>
                {supplier.verified && (
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                )}
              </div>
              <p className="text-sm text-gray-500">{supplier.location}</p>
            </CardHeader>
            
            <CardContent>
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Categories</p>
                <div className="flex flex-wrap gap-2">
                  {supplier.categories.map((category, idx) => (
                    <span 
                      key={idx}
                      className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Rating</p>
                <div className="flex items-center">
                  <div className="text-yellow-400 flex mr-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx}>
                        {idx < Math.floor(supplier.rating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm">{supplier.rating.toFixed(1)}</span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Contact</p>
                <p className="truncate">{supplier.contact || supplier.email}</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between">
              <Button 
                variant="outline"
                onClick={() => viewSupplierDetails(supplier)}
              >
                View Details
              </Button>
              <Button variant="outline">Contact</Button>
            </CardFooter>
          </Card>
        ))}
        
        {filteredSuppliers.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 mb-4">No suppliers found</p>
            <Button 
              variant="outline" 
              onClick={() => setShowNewSupplierDialog(true)}
            >
              Add your first supplier
            </Button>
          </div>
        )}
      </div>
      
      {/* Supplier details dialog */}
      {selectedSupplier && (
        <Dialog open={showSupplierDetails} onOpenChange={setShowSupplierDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{selectedSupplier.name}</DialogTitle>
              <DialogDescription>Supplier details and information</DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="font-medium">{selectedSupplier.location}</p>
                </div>
                
                {selectedSupplier.verified && (
                  <Badge className="bg-green-100 text-green-800">Verified</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Contact Person</p>
                  <p>{selectedSupplier.contact || "Not specified"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Rating</p>
                  <div className="flex items-center">
                    <div className="text-yellow-400 flex mr-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx}>
                          {idx < Math.floor(selectedSupplier.rating) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                    <span>{selectedSupplier.rating.toFixed(1)}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p>{selectedSupplier.phone || "Not provided"}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="break-all">{selectedSupplier.email}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSupplier.categories.map((category: string, idx: number) => (
                    <span 
                      key={idx}
                      className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Notes</p>
                <p className="mt-1 text-sm">{selectedSupplier.notes || "No notes available."}</p>
              </div>
              
              <div className="border-t pt-4 mt-2">
                <h3 className="font-medium mb-2">Recent Orders</h3>
                <div className="text-center py-4 text-gray-500 text-sm">
                  No recent orders with this supplier
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSupplierDetails(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default AgentSuppliers;
