import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Star, Clock } from "lucide-react";

const Pricing = () => {
  const pricingTiers = [
    {
      name: "Basic",
      price: "$5",
      duration: "per model",
      deliveryTime: "Delivery in 1 - 3 days",
      description: "Perfect for simple modeling needs",
      features: [
        "Low-Poly modeling",
        "Up to 1 revision",
        "Low texture details",
        "No rigging",
        "No animation"
      ]
    },
    {
      name: "Professional",
      price: "$20",
      duration: "per model",
      deliveryTime: "Delivery in 4 - 7 days",
      description: "Recommended for most projects",
      features: [
        "Mid-Poly modeling",
        "Up to 3 revisions",
        "High Texture details",
        "Rigging (if needed)",
        "No animation"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: "$50",
      duration: "per model",
      deliveryTime: "Delivery in 7 - 10 days",
      description: "Everything you need for professional work",
      features: [
        "High-Poly Modeling",
        "Unlimited of revisions",
        "High Texture details",
        "Rigging (if needed)",
        "Animation (if needed)"
      ]
    }
  ];

  const handleDiscordRedirect = () => {
    window.open("https://discord.com/users/kosho_dev", "_blank");
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Pricing Plans
          </h1>
          <p className="text-lg text-muted-foreground">
            1$ = 200 Robux
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
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-2">
                  <Clock className="w-4 h-4" />
                  <span>{tier.deliveryTime}</span>
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
                onClick={handleDiscordRedirect}
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
            <Button variant="default" size="lg" onClick={handleDiscordRedirect}>
              Contact for Custom Quote
            </Button>
          </div>
        </div>

        <div className="mt-16 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-foreground mb-8 text-center">
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="payment">
              <AccordionTrigger className="text-foreground text-left">
                How do I pay?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                <p className="mb-4">
                  Payments are made via PayPal. Please click the button below to proceed:
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => window.open("https://paypal.me/KoshoDev", "_blank")}
                >
                  Pay via PayPal
                </Button>
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="refund">
              <AccordionTrigger className="text-foreground text-left">
                Can I get a refund?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Refunds are possible only within the first 24 hours of ordering, and only if work hasn't started.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="rigging">
              <AccordionTrigger className="text-foreground text-left">
                What's included in rigging?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                Basic skeleton setup with bones and structure prepared for movement. Advanced rigging can be discussed if needed.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default Pricing;