
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Post Sourcing Request",
    description: "Describe your product needs, including specifications, quantity, quality requirements, and delivery expectations."
  },
  {
    number: "02",
    title: "Connect with Agents",
    description: "Verified Indian sourcing agents review your request and send proposals based on their expertise and network."
  },
  {
    number: "03",
    title: "Select an Agent",
    description: "Compare agent profiles, reviews, and proposals to select the best match for your sourcing needs."
  },
  {
    number: "04",
    title: "Track Progress",
    description: "Monitor milestones, communicate with your agent, and receive updates as your order progresses."
  },
  {
    number: "05",
    title: "Secure Payment",
    description: "Make payments through our secure blockchain system, with funds released at predefined milestones."
  }
];

const HowItWorksSection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Our streamlined process makes international sourcing simple, transparent, and effective.
          </p>
        </div>
        
        <div className="space-y-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="flex items-start gap-6"
            >
              <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-marketplace-orange text-white font-bold">
                {step.number}
              </div>
              
              <div className="flex-1 pt-1">
                <h3 className="text-xl font-bold mb-1">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button size="lg" className="bg-marketplace-blue hover:bg-marketplace-blue-light text-white text-lg px-8">
            Get Started Today
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
