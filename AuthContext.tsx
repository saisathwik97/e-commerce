import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { toast } from "sonner";
import { loginBuyer, registerBuyer } from "@/services/buyerService";

type UserType = "buyer" | "seller" | "agent" | null;

interface AuthContextType {
  user: User | null;
  userType: UserType;
  isAuthenticated: boolean;
  login: (email: string, password: string, type: UserType) => Promise<boolean>;
  register: (userData: RegistrationData, type: UserType) => Promise<boolean>;
  logout: () => void;
  setUserType: (type: UserType) => void;
}

interface User {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  avatar?: string;
}

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  company?: string;
  phone?: string;
  address?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<UserType>(null);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem('user');
    const storedUserType = localStorage.getItem('userType');
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedUserType && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserType(storedUserType as UserType);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        // Clear invalid stored data
        localStorage.removeItem('user');
        localStorage.removeItem('userType');
        localStorage.removeItem('token');
      }
    }
  }, []);

  const login = async (email: string, password: string, type: UserType): Promise<boolean> => {
    try {
      if (type === 'buyer') {
        const response = await loginBuyer(email, password);
        
        if (response && response.user) {
          const { user, token } = response;
          // Ensure all required fields are present
          const userData: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            company: user.company,
            phone: user.phone,
            address: user.address
          };
          
          setUser(userData);
          setUserType(type);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userType', type);
          localStorage.setItem('token', token);
          
          toast.success("Logged in successfully");
          return true;
        }
      } else if (type === 'agent') {
        const response = await fetch('http://localhost:5000/api/agent/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        
        if (data && data.agent) {
          const { agent, token } = data;
          const userData: User = {
            id: agent.id,
            name: agent.name,
            email: agent.email,
            company: agent.company,
            phone: agent.phone,
            address: agent.address
          };
          
          setUser(userData);
          setUserType(type);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userType', type);
          localStorage.setItem('token', token);
          
          toast.success("Logged in successfully");
          return true;
        }
      }
      else if (type === 'seller') {
        const response = await fetch('http://localhost:5000/api/seller/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();
        
        if (data && data.seller) {
          const { seller, token } = data;
          const userData: User = {
            id: seller.id,
            name: seller.name,
            email: seller.email,
            company: seller.company,
            phone: seller.phone,
            address: seller.address
          };
          
          setUser(userData);
          setUserType(type);
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('userType', type);
          localStorage.setItem('token', token);
          
          toast.success("Logged in successfully");
          return true;
        }
    }}catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : "Login failed");
      return false;
    }
  };

  const register = async (userData: RegistrationData, type: UserType): Promise<boolean> => {
    try {
      if (type === 'buyer') {
        const response = await registerBuyer(userData);
        
        if (response && response.user) {
          const { user, token } = response;
          // Ensure all required fields are present
          const newUser: User = {
            id: user.id,
            name: user.name,
            email: user.email,
            company: user.company,
            phone: user.phone,
            address: user.address
          };
          
          setUser(newUser);
          setUserType(type);
          localStorage.setItem('user', JSON.stringify(newUser));
          localStorage.setItem('userType', type);
          localStorage.setItem('token', token);
          
          toast.success("Registered successfully");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Registration failed");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setUserType(null);
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    localStorage.removeItem('token');
    toast.success("Logged out successfully");
  };

  const value = {
    user,
    userType,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    setUserType
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
