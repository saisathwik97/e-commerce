import { useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
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
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const mockOrders = [
  {
    id: "ORD-7829",
    buyer: "Global Retailers Inc.",
    items: [
      { name: "Cotton t-shirts", quantity: 1200, price: "$4.90" }
    ],
    total: "$5,880",
    status: "Processing",
    date: "2025-04-15",
    shipping: "Standard",
    notes: "Need delivery before June 1st"
  },
  {
    id: "ORD-7814",
    buyer: "EcoLife Products",
    items: [
      { name: "Bamboo kitchen utensils", quantity: 800, price: "$4.00" }
    ],
    total: "$3,200",
    status: "Shipped",
    date: "2025-04-10",
    shipping: "Express",
    notes: "Please include certification documents"
  },
  {
    id: "ORD-7802",
    buyer: "Urban Home Co.",
    items: [
      { name: "Handwoven baskets", quantity: 300, price: "$7.00" }
    ],
    total: "$2,100",
    status: "Completed",
    date: "2025-04-05",
    shipping: "Standard",
    notes: ""
  },
  {
    id: "ORD-7798",
    buyer: "Green Earth Trading",
    items: [
      { name: "Jute bags", quantity: 500, price: "$3.50" },
      { name: "Cotton totes", quantity: 250, price: "$4.20" }
    ],
    total: "$2,800",
    status: "Pending Payment",
    date: "2025-04-20",
    shipping: "Standard",
    notes: "First-time order, please contact for payment details"
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Pending Payment":
      return "bg-yellow-100 text-yellow-800";
    case "Processing":
      return "bg-blue-100 text-blue-800";
    case "Shipped":
      return "bg-purple-100 text-purple-800";
    case "Completed":
      return "bg-green-100 text-green-800";
    case "Cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const SellerOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderStatus, setOrderStatus] = useState("");
  
  const handleStatusChange = (status: string) => {
    setOrderStatus(status);
  };
  
  const handleUpdateStatus = () => {
    // Would update in a real app
    toast.success(`Order ${selectedOrder.id} status updated to ${orderStatus}`);
    setShowOrderDetails(false);
  };
  
  const viewOrderDetails = (order: any) => {
    setSelectedOrder(order);
    setOrderStatus(order.status);
    setShowOrderDetails(true);
  };

  const filteredOrders = mockOrders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.buyer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <DashboardLayout title="Orders" userType="seller">
      <div className="mb-6">
        <Tabs defaultValue="all">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="pending">Pending Payment</TabsTrigger>
              <TabsTrigger value="processing">Processing</TabsTrigger>
              <TabsTrigger value="shipped">Shipped</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <div className="relative w-full sm:w-auto">
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                🔍
              </span>
            </div>
          </div>
          
          <TabsContent value="all" className="space-y-6">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">{order.id}</CardTitle>
                      <CardDescription>
                        From {order.buyer} • Ordered on {order.date}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between">
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-500"> × {item.quantity}</span>
                          </div>
                          <span>{item.price} per unit</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <div>
                        <span className="text-sm text-gray-500">Total Amount:</span>
                        <span className="ml-2 font-bold">{order.total}</span>
                      </div>
                      
                      <div>
                        <span className="text-sm text-gray-500">Shipping:</span>
                        <span className="ml-2">{order.shipping}</span>
                      </div>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="flex justify-end">
                    <Button 
                      variant="outline"
                      onClick={() => viewOrderDetails(order)}
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No orders found matching your search</p>
              </div>
            )}
          </TabsContent>
          
          {/* Other tabs would filter by status */}
          {["pending", "processing", "shipped", "completed"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-6">
              {filteredOrders
                .filter(order => order.status.toLowerCase().includes(status))
                .map((order) => (
                  <Card key={order.id}>
                    {/* Same card content as above */}
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{order.id}</CardTitle>
                        <CardDescription>
                          From {order.buyer} • Ordered on {order.date}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Same content as above */}
                      <div className="space-y-2">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex justify-between">
                            <div>
                              <span className="font-medium">{item.name}</span>
                              <span className="text-gray-500"> × {item.quantity}</span>
                            </div>
                            <span>{item.price} per unit</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="mt-4 pt-4 border-t flex justify-between items-center">
                        <div>
                          <span className="text-sm text-gray-500">Total Amount:</span>
                          <span className="ml-2 font-bold">{order.total}</span>
                        </div>
                        
                        <div>
                          <span className="text-sm text-gray-500">Shipping:</span>
                          <span className="ml-2">{order.shipping}</span>
                        </div>
                      </div>
                    </CardContent>
                    
                    <CardFooter className="flex justify-end">
                      <Button 
                        variant="outline"
                        onClick={() => viewOrderDetails(order)}
                      >
                        View Details
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </TabsContent>
          ))}
        </Tabs>
      </div>
      
      {/* Order details dialog */}
      {selectedOrder && (
        <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Order Details - {selectedOrder.id}</DialogTitle>
              <DialogDescription>
                View and update order information
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Buyer</p>
                  <p>{selectedOrder.buyer}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Date</p>
                  <p>{selectedOrder.date}</p>
                </div>
              </div>
              
              <div className="border rounded-md p-4">
                <p className="text-sm font-medium mb-2">Items</p>
                {selectedOrder.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between mb-2 last:mb-0">
                    <div>
                      <span>{item.name}</span>
                      <span className="text-gray-500"> × {item.quantity}</span>
                    </div>
                    <span>{item.price} per unit</span>
                  </div>
                ))}
                
                <div className="mt-3 pt-3 border-t">
                  <div className="flex justify-between">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">{selectedOrder.total}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium mb-1">Shipping Method</p>
                <p>{selectedOrder.shipping}</p>
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <p className="text-sm font-medium mb-1">Notes</p>
                  <p className="text-sm">{selectedOrder.notes}</p>
                </div>
              )}
              
              <div className="mt-2">
                <p className="text-sm font-medium mb-2">Update Status</p>
                <div className="grid grid-cols-2 gap-2">
                  {["Pending Payment", "Processing", "Shipped", "Completed", "Cancelled"].map((status) => (
                    <div key={status} className="flex items-center">
                      <input 
                        type="radio"
                        id={status}
                        name="status"
                        value={status}
                        checked={orderStatus === status}
                        onChange={() => handleStatusChange(status)}
                        className="mr-2"
                      />
                      <label htmlFor={status}>{status}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setShowOrderDetails(false)}
              >
                Cancel
              </Button>
              <Button 
                className="bg-marketplace-blue hover:bg-marketplace-blue-light"
                onClick={handleUpdateStatus}
              >
                Update Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </DashboardLayout>
  );
};

export default SellerOrders;
