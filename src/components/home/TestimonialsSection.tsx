import React from 'react';
import { Star, Quote } from 'lucide-react';

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Kwame Asante",
      role: "Property Buyer",
      location: "Accra",
      rating: 5,
      comment: "Found my dream home in East Legon through Adobe of Homes. The verification process gave me confidence, and the direct connection with the owner saved me thousands in agent fees.",
      avatar: "KA"
    },
    {
      id: 2,
      name: "Ama Osei",
      role: "Property Owner",
      location: "Kumasi",
      rating: 5,
      comment: "Listed my property and got multiple serious inquiries within days. The platform is professional and the verification system builds trust with potential tenants.",
      avatar: "AO"
    },
    {
      id: 3,
      name: "Kofi Mensah",
      role: "Artisan",
      location: "Tema",
      rating: 5,
      comment: "As a verified artisan, I've received consistent work through the platform. Homeowners trust the verification system and I've built a great client base.",
      avatar: "KM"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-white to-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">What Our Users Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            Real experiences from property owners, buyers, and artisans using our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{animationDelay: `${0.3 + index * 0.1}s`}}
            >
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-ghana-primary to-ghana-primary/80 rounded-full flex items-center justify-center text-white font-bold text-xl mr-4">
                  {testimonial.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                  <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                  <p className="text-ghana-primary text-sm">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <blockquote className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-ghana-primary/20" />
                <p className="text-gray-700 leading-relaxed pl-6">
                  "{testimonial.comment}"
                </p>
              </blockquote>
            </div>
          ))}
        </div>

        {/* Stats section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up" style={{animationDelay: '0.8s'}}>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-ghana-primary mb-2 animate-gradient">500+</div>
            <div className="text-muted-foreground">Properties Listed</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-ghana-primary mb-2">200+</div>
            <div className="text-muted-foreground">Happy Clients</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-ghana-primary mb-2">50+</div>
            <div className="text-muted-foreground">Verified Artisans</div>
          </div>
          <div className="text-center">
            <div className="text-4xl md:text-5xl font-bold text-ghana-primary mb-2">98%</div>
            <div className="text-muted-foreground">Satisfaction Rate</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;


