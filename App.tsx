
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { BlockchainProvider } from "./contexts/BlockchainContext";
// import ChatWidget from "./components/Chat/ChatWidget";

import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import BuyerDashboard from "./pages/buyer/Dashboard";
import SellerDashboard from "./pages/seller/Dashboard";
import AgentDashboard from "./pages/agent/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import BuyerRequests from "./pages/buyer/Requests";
import BuyerProposals from "./pages/buyer/Proposals";
import BuyerProjects from "./pages/buyer/Projects";
import BuyerProfile from "./pages/buyer/Profile";
import SellerProducts from "./pages/seller/Products";
import SellerOrders from "./pages/seller/Orders";
import SellerProfile from "./pages/seller/Profile";
import AgentRequests from "./pages/agent/Requests";
import AgentProjects from "./pages/agent/Projects";
import AgentSuppliers from "./pages/agent/Suppliers";
import AgentProfile from "./pages/agent/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BlockchainProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Buyer Routes */}
              <Route path="/buyer" element={<ProtectedRoute userType="buyer"><BuyerDashboard /></ProtectedRoute>} />
              <Route path="/buyer/requests" element={<ProtectedRoute userType="buyer"><BuyerRequests /></ProtectedRoute>} />
              <Route path="/buyer/proposals" element={<ProtectedRoute userType="buyer"><BuyerProposals /></ProtectedRoute>} />
              <Route path="/buyer/projects" element={<ProtectedRoute userType="buyer"><BuyerProjects /></ProtectedRoute>} />
              <Route path="/buyer/profile" element={<ProtectedRoute userType="buyer"><BuyerProfile /></ProtectedRoute>} />
              
              {/* Seller Routes */}
              <Route path="/seller" element={<ProtectedRoute userType="seller"><SellerDashboard /></ProtectedRoute>} />
              <Route path="/seller/products" element={<ProtectedRoute userType="seller"><SellerProducts /></ProtectedRoute>} />
              <Route path="/seller/orders" element={<ProtectedRoute userType="seller"><SellerOrders /></ProtectedRoute>} />
              <Route path="/seller/profile" element={<ProtectedRoute userType="seller"><SellerProfile /></ProtectedRoute>} />
              
              {/* Agent Routes */}
              <Route path="/agent" element={<ProtectedRoute userType="agent"><AgentDashboard /></ProtectedRoute>} />
              <Route path="/agent/requests" element={<ProtectedRoute userType="agent"><AgentRequests /></ProtectedRoute>} />
              <Route path="/agent/projects" element={<ProtectedRoute userType="agent"><AgentProjects /></ProtectedRoute>} />
              <Route path="/agent/suppliers" element={<ProtectedRoute userType="agent"><AgentSuppliers /></ProtectedRoute>} />
              <Route path="/agent/profile" element={<ProtectedRoute userType="agent"><AgentProfile /></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
            {/* <ChatWidget /> */}
          </BrowserRouter>
        </BlockchainProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
