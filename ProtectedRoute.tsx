
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  userType?: "buyer" | "seller" | "agent";
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  userType 
}) => {
  const { isAuthenticated, userType: currentUserType } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (userType && currentUserType !== userType) {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
