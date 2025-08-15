import React from 'react';
import { Shield, MapPin, Users, CreditCard, Clock, Star, CheckCircle, Zap } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Shield,
      title: "Verified Properties",
      description: "All properties undergo strict verification to ensure authenticity and quality standards.",
      color: "text-green-600"
    },
    {
      icon: MapPin,
      title: "Location Intelligence",
      description: "Advanced mapping and location-based search to find properties in your preferred areas.",
      color: "text-blue-600"
    },
    {
      icon: Users,
      title: "Direct Connection",
      description: "Connect directly with property owners and artisans without middleman fees.",
      color: "text-purple-600"
    },
    {
      icon: CreditCard,
      title: "No Agent Fees",
      description: "Save thousands by connecting directly with verified property owners.",
      color: "text-orange-600"
    },
    {
      icon: Clock,
      title: "24/7 Availability",
      description: "Access property listings and contact information anytime, anywhere.",
      color: "text-indigo-600"
    },
    {
      icon: Star,
      title: "Quality Assurance",
      description: "Rigorous verification process ensures only high-quality properties are listed.",
      color: "text-yellow-600"
    },
    {
      icon: CheckCircle,
      title: "Trusted Network",
      description: "Join a community of verified professionals and satisfied customers.",
      color: "text-teal-600"
    },
    {
      icon: Zap,
      title: "Fast Response",
      description: "Quick communication and response times from property owners and artisans.",
      color: "text-red-600"
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up">Why Choose Adobe of Homes?</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            We're revolutionizing the property market in Ghana with innovative features and trusted connections
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group text-center p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 animate-fade-in-up"
              style={{animationDelay: `${0.3 + index * 0.1}s`}}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gray-200 transition-colors">
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-16 text-center animate-fade-in-up" style={{animationDelay: '1s'}}>
          <div className="bg-gradient-to-r from-ghana-primary/10 to-ghana-accent/10 rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-muted-foreground mb-6">
              Join thousands of satisfied users who have found their perfect properties through our platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-ghana-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-ghana-primary/90 transition-colors">
                Start Searching
              </button>
              <button className="border border-ghana-primary text-ghana-primary px-8 py-3 rounded-lg font-semibold hover:bg-ghana-primary hover:text-white transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;


