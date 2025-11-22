
import { 
  Globe, 
  CheckCircle, 
  MessageSquare, 
  TrendingUp, 
  ShieldCheck 
} from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Global Access",
    description: "Connect with verified Indian sourcing agents from around the world to facilitate your procurement needs."
  },
  {
    icon: CheckCircle,
    title: "Verified Profiles",
    description: "All agents are thoroughly vetted with verified credentials, expertise, and ratings from past clients."
  },
  {
    icon: MessageSquare,
    title: "Streamlined Communication",
    description: "Integrated messaging, file sharing, and project management tools keep everyone aligned."
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking",
    description: "Monitor orders from request to delivery with real-time updates and milestone tracking."
  },
  {
    icon: ShieldCheck,
    title: "Secure Transactions",
    description: "Blockchain-powered payment protection ensures your funds are secure until you approve."
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Streamlining International Sourcing
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our platform bridges the gap between international buyers and Indian suppliers, 
            providing the tools and connections you need for successful procurement.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-marketplace-blue/10 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-marketplace-blue" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
