
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import Footer from "@/components/layouts/Footer";

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="font-bold text-2xl text-marketplace-blue">
            IndoSource
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-marketplace-blue">Home</Link>
            <Link to="/how-it-works" className="font-medium hover:text-marketplace-blue">How It Works</Link>
            <Link to="/about" className="font-medium hover:text-marketplace-blue">About Us</Link>
            <Link to="/contact" className="font-medium hover:text-marketplace-blue">Contact</Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link to="/register">
              <Button className="bg-marketplace-blue hover:bg-marketplace-blue-light text-white">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Hero Section */}
      <HeroSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* How It Works */}
      <HowItWorksSection />
      
      {/* Testimonials */}
      <TestimonialsSection />
      
      {/* CTA Section */}
      <section className="py-20 bg-marketplace-teal text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Sourcing Process?
          </h2>
          <p className="text-lg max-w-3xl mx-auto mb-8">
            Join thousands of businesses that have streamlined their procurement with our platform.
          </p>
          <div className="flex justify-center space-x-4">
            <Link to="/register">
              <Button size="lg" className="bg-white hover:bg-gray-100 text-marketplace-teal">
                Get Started
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline" className="bg-transparent hover:bg-white/10 border-white text-white">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
