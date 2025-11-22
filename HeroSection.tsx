
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowDown } from "lucide-react";
import { useEffect, useState } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const { setUserType } = useAuth();
  const [scrollOpacity, setScrollOpacity] = useState(1);
  
  const handleRoleSelect = (role: "buyer" | "seller" | "agent") => {
    setUserType(role);
    navigate("/register");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const newOpacity = Math.max(0, 1 - scrollY / 400);
      setScrollOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gradient-to-br from-marketplace-blue to-marketplace-blue-light text-white relative">
      <div className="container mx-auto px-4 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Connect with <span className="text-marketplace-orange">Verified</span> Indian Sourcing Experts
            </h1>
            
            <p className="text-lg md:text-xl opacity-90 mb-8">
              The premier platform connecting international buyers with verified Indian sourcing agents to streamline procurement, manufacturing coordination, and supplier discovery.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Button 
                size="lg"
                className="bg-marketplace-orange hover:bg-orange-500 text-white text-lg transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleRoleSelect("buyer")}
              >
                I'm a Buyer
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="bg-transparent hover:bg-white/10 border-white text-white text-lg transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleRoleSelect("seller")}
              >
                I'm a Seller
              </Button>
              
              <Button 
                size="lg"
                variant="outline"
                className="bg-transparent hover:bg-white/10 border-white text-white text-lg transform transition-transform duration-300 hover:scale-105"
                onClick={() => handleRoleSelect("agent")}
              >
                I'm an Agent
              </Button>
            </div>
          </div>
          
          <div className="hidden md:block">
            <div className="relative">
              <div className="absolute top-0 right-0 bg-marketplace-orange rounded-full w-64 h-64 opacity-20 animate-pulse-slow"></div>
              <div className="relative z-10 animate-float">
                <img 
                  src="https://www.gtechme.com/wp-content/uploads/2022/12/How-to-Get-an-eCommerce-License-in-Dubai-image-3.jpg" 
                  alt="Global Sourcing" 
                  className="rounded-2xl shadow-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer"
        style={{ opacity: scrollOpacity }}
        onClick={() => window.scrollTo({top: window.innerHeight, behavior: 'smooth'})}
      >
        <div className="flex flex-col items-center">
          <p className="mb-2 text-sm">Scroll to explore</p>
          <ArrowDown className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
