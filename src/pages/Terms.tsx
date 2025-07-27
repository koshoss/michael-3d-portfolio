import { useState, useEffect } from "react";
import { FileText, Shield, Clock, CreditCard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Terms = () => {
  const [termsContent, setTermsContent] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTermsContent = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content')
          .eq('page', 'terms')
          .eq('section', 'content')
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching terms content:', error);
          return;
        }

        setTermsContent(data?.content || "Terms and Conditions content goes here...");
      } catch (error) {
        console.error('Error fetching terms content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTermsContent();
  }, []);

  const sections = [
    {
      icon: FileText,
      title: "Service Agreement",
      content: [
        "All 3D modeling services are provided on a project basis with clear deliverables outlined before work begins.",
        "Clients must provide detailed briefs, reference materials, and specifications for accurate project completion.",
        "Project scope changes may result in additional charges and extended delivery times.",
        "Final delivery includes agreed-upon file formats (typically .blend, .fbx, .obj, and textures)."
      ]
    },
    {
      icon: CreditCard,
      title: "Payment Terms",
      content: [
        "Only two payment methods are accepted: PayPal and Roblox wallet (Robux currency).",
        "A 50% upfront payment is required before starting any project over $100.",
        "The remaining payment is due upon project completion and client approval.",
        "Refund Policy: Refunds are only applicable for orders above $100 and must be requested within 48 hours of project start if no work has been done."
      ]
    },
    {
      icon: Clock,
      title: "Delivery & Revisions",
      content: [
        "Delivery timeframes are estimated and may vary based on project complexity.",
        "Revision requests must be submitted within 7 days of initial delivery.",
        "Additional revisions beyond the package limit will incur extra charges.",
        "Rush delivery (50% faster) available for an additional 50% surcharge."
      ]
    },
    {
      icon: Shield,
      title: "Intellectual Property",
      content: [
        "Upon full payment, clients receive full commercial rights to the delivered 3D models.",
        "I retain the right to showcase completed work in my portfolio unless otherwise agreed.",
        "Client-provided reference materials must not infringe on third-party copyrights.",
        "Original design concepts and techniques remain my intellectual property."
      ]
    }
  ];

  const additionalTerms = [
    {
      title: "Quality Guarantee",
      description: "All models are delivered with professional quality standards. If you're not satisfied, I'll work with you to make it right."
    },
    {
      title: "Communication",
      description: "Regular project updates provided via email or your preferred communication method. Response time typically within 24 hours."
    },
    {
      title: "File Delivery",
      description: "All files delivered via secure cloud storage with download links valid for 30 days. Backup copies maintained for 6 months."
    },
    {
      title: "Confidentiality",
      description: "All client projects and information are kept strictly confidential. NDAs available upon request for sensitive projects."
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading terms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Terms & <span className="text-primary">Conditions</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Clear and transparent terms for our professional 3D modeling services. 
            Please read carefully before starting your project.
          </p>
        </div>

        {/* Main Terms Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className="bg-card rounded-lg p-8 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-6">
                <section.icon className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
              </div>
              
              <ul className="space-y-4">
                {section.content.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Additional Terms */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-8 text-center">
            Additional Terms
          </h2>
          
          <div className="space-y-6">
            {additionalTerms.map((term, index) => (
              <div
                key={term.title}
                className="bg-card rounded-lg p-6 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-xl font-semibold text-foreground mb-3">{term.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{term.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center">
          <div className="bg-card rounded-lg p-8 shadow-card max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Questions about these terms?
            </h3>
            <p className="text-muted-foreground mb-6">
              If you have any questions about these terms and conditions, 
              feel free to reach out before starting your project.
            </p>
            <a 
              href="https://discord.com/users/kosho_dev" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors inline-block"
            >
              Contact Me
            </a>
          </div>
        </div>

        
        {/* Custom Terms Content */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-card rounded-lg p-8 shadow-card">
            <h2 className="text-2xl font-bold text-foreground mb-6">Custom Terms</h2>
            <div className="prose prose-lg max-w-none">
              <div 
                className="text-muted-foreground leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: termsContent.replace(/\n/g, '<br />') }}
              />
            </div>
          </div>
        </div>

        {/* Last Updated */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Last updated: December 2024
          </p>
        </div>
      </div>
    </div>
  );
};

export default Terms;