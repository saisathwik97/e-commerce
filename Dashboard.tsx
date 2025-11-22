
import DashboardLayout from "@/components/layouts/DashboardLayout";
import SalesChart from "@/components/charts/SalesChart";
import ProductPerformanceChart from "@/components/charts/ProductPerformanceChart";
import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react";
import { StatsCards } from "@/components/seller/dashboard/StatsCards";
import { UpcomingTasks } from "@/components/seller/dashboard/UpcomingTasks";
import { RecentActivities } from "@/components/seller/dashboard/RecentActivities";
import { TopBuyers } from "@/components/seller/dashboard/TopBuyers";

interface Task {
  task: string;
  date: string;
  priority: string;
}

const mockStats = [
  {
    title: "Total Products",
    value: "32",
    icon: Package,
    change: "+4 this month",
    color: "text-blue-600"
  },
  {
    title: "Active Orders",
    value: "12",
    icon: ShoppingCart,
    change: "+3 this week",
    color: "text-green-600"
  },
  {
    title: "Revenue",
    value: "$18,426",
    icon: DollarSign,
    change: "+12% this quarter",
    color: "text-orange-600"
  },
  {
    title: "Inquiries",
    value: "8",
    icon: TrendingUp,
    change: "+2 today",
    color: "text-purple-600"
  }
];

const upcomingTasks = [
  { task: "Quality inspection for order #ORD-7829", date: "Today, 2:00 PM", priority: "High" },
  { task: "Review new supplier application", date: "Tomorrow, 10:00 AM", priority: "Medium" },
  { task: "Update product catalog", date: "Apr 27, 2025", priority: "Low" }
];

const recentOrders = [
  { 
    id: "ORD-7829", 
    buyer: "Global Retailers Inc.", 
    items: "Cotton t-shirts (1,200 units)", 
    amount: "$5,880", 
    status: "Processing" 
  },
  { 
    id: "ORD-7814", 
    buyer: "EcoLife Products", 
    items: "Bamboo kitchen utensils (800 units)", 
    amount: "$3,200", 
    status: "Shipped" 
  },
  { 
    id: "ORD-7802", 
    buyer: "Urban Home Co.", 
    items: "Handwoven baskets (300 units)", 
    amount: "$2,100", 
    status: "Completed" 
  }
];

const notifications = [
  { message: "New order request from Better Living LLC", time: "10 minutes ago" },
  { message: "Quality inspection scheduled for order #ORD-7829", time: "2 hours ago" },
  { message: "Price inquiry for bamboo cutting boards", time: "Yesterday" },
  { message: "Payment received for order #ORD-7802", time: "2 days ago" }
];

const SellerDashboard = () => {
  return (
    <DashboardLayout title="Seller Dashboard" userType="seller">
      <StatsCards stats={mockStats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SalesChart />
        <ProductPerformanceChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <UpcomingTasks tasks={upcomingTasks as Task[]} />
        <RecentActivities notifications={notifications} />
      </div>

      <TopBuyers orders={recentOrders as Order[]} />
    </DashboardLayout>
  );
};

export default SellerDashboard;
