
const testimonials = [
  {
    quote: "Finding reliable suppliers in India was always challenging until I found IndoSource. Their agents helped us navigate the local market and secure quality products at competitive prices.",
    author: "Sarah Johnson",
    role: "Procurement Manager",
    company: "Global Retailers Inc."
  },
  {
    quote: "The blockchain payment system gave me confidence when working with new suppliers. Milestone-based payments ensured quality work and timely delivery for our textile orders.",
    author: "Michael Chen",
    role: "Supply Chain Director",
    company: "Fashionista Brands"
  },
  {
    quote: "As someone new to sourcing from India, having a local agent who understood both my requirements and the local industry was invaluable. Highly recommend this platform.",
    author: "Emma Rodriguez",
    role: "Product Development",
    company: "HomeTrends LLC"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-20 bg-marketplace-blue text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            Discover how our platform has transformed sourcing experiences for businesses worldwide.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-marketplace-blue-light rounded-lg p-6 relative"
            >
              <div className="text-4xl text-marketplace-orange opacity-40 absolute top-4 left-6">"</div>
              <p className="text-lg mb-6 pt-4 relative z-10">{testimonial.quote}</p>
              
              <div>
                <p className="font-semibold">{testimonial.author}</p>
                <p className="text-sm opacity-80">{testimonial.role}, {testimonial.company}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
