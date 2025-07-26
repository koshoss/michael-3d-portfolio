import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const Pricing = () => {
  const pricingTiers = [
    {
      name: "Basic",
      price: "$50",
      duration: "per model",
      description: "Perfect for simple models and quick projects",
      features: [
        "Low to medium poly count",
        "Basic texturing",
        "1 revision included",
        "Delivery in 3-5 days",
        "Standard file formats"
      ]
    },
    {
      name: "Professional",
      price: "$150",
      duration: "per model",
      description: "Ideal for detailed characters and complex models",
      features: [
        "High poly count",
        "Advanced texturing & materials",
        "3 revisions included",
        "Delivery in 5-7 days",
        "Multiple file formats",
        "Basic rigging (if needed)"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: "$300",
      duration: "per model",
      description: "For production-ready models with full customization",
      features: [
        "Ultra high poly count",
        "PBR texturing & materials",
        "Unlimited revisions",
        "Delivery in 7-10 days",
        "All file formats",
        "Full rigging & animation",
        "Source files included"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            <span className="text-primary">Pricing</span> Plans
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transparent pricing for quality 3D modeling services. Choose the plan that fits your project needs.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div
              key={tier.name}
              className={`relative bg-card rounded-lg p-8 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in ${
                tier.popular ? "ring-2 ring-primary scale-105" : ""
              }`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-foreground mb-2">{tier.name}</h3>
                <div className="text-4xl font-bold text-primary mb-2">
                  {tier.price}
                  <span className="text-lg text-muted-foreground font-normal">
                    /{tier.duration}
                  </span>
                </div>
                <p className="text-muted-foreground">{tier.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={tier.popular ? "default" : "outline"}
                className="w-full"
                size="lg"
              >
                Get Started
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-card rounded-lg p-8 shadow-card max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Need a custom quote?
            </h3>
            <p className="text-muted-foreground mb-6">
              For large projects, bulk orders, or specialized requirements, 
              I offer custom pricing tailored to your specific needs.
            </p>
            <Button variant="default" size="lg">
              Contact for Custom Quote
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;