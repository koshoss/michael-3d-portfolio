import { Star, Quote } from "lucide-react";

const Reviews = () => {
  const reviews = [
    {
      id: 1,
      name: "Alex Thompson",
      project: "Character Design",
      rating: 5,
      review: "Michael delivered an absolutely stunning character model that exceeded all my expectations. The attention to detail and quality of work is professional-grade. Highly recommended!",
      date: "2 weeks ago"
    },
    {
      id: 2,
      name: "Sarah Chen",
      project: "Vehicle Modeling",
      rating: 5,
      review: "Incredible work on my futuristic vehicle design. Michael understood my vision perfectly and brought it to life with amazing texturing and lighting. Fast delivery too!",
      date: "1 month ago"
    },
    {
      id: 3,
      name: "Jordan Lee",
      project: "Weapon Collection",
      rating: 5,
      review: "Michael created a full set of medieval weapons for my game project. Each piece was meticulously crafted with realistic textures. Professional communication throughout the process.",
      date: "6 weeks ago"
    },
    {
      id: 4,
      name: "Maria Rodriguez",
      project: "UGC Items",
      rating: 5,
      review: "Perfect Roblox UGC items that fit the platform's style requirements. Michael knows exactly what works and delivers high-quality models that players love.",
      date: "2 months ago"
    },
    {
      id: 5,
      name: "David Kim",
      project: "Architecture Model",
      rating: 5,
      review: "Outstanding architectural visualization. The level of detail in the building model was impressive, and Michael provided multiple file formats as requested.",
      date: "3 months ago"
    },
    {
      id: 6,
      name: "Emma Watson",
      project: "Character Rigging",
      rating: 5,
      review: "Not only did Michael create an amazing character model, but the rigging was flawless. The character animates beautifully and was ready for production immediately.",
      date: "4 months ago"
    }
  ];

  const stats = [
    { label: "Total Projects", value: "150+" },
    { label: "Happy Clients", value: "98%" },
    { label: "Average Rating", value: "4.9/5" },
    { label: "On-Time Delivery", value: "100%" }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Client <span className="text-primary">Reviews</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See what my clients say about their experience working with me on their 3D modeling projects.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center bg-card rounded-lg p-6 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <div
              key={review.id}
              className="bg-card rounded-lg p-6 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{review.name}</h3>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-sm text-primary mb-2">{review.project}</p>
                </div>
              </div>
              
              <p className="text-muted-foreground mb-4 leading-relaxed">
                "{review.review}"
              </p>
              
              <div className="text-sm text-muted-foreground">
                {review.date}
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-card rounded-lg p-8 shadow-card max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to join my satisfied clients?
            </h3>
            <p className="text-muted-foreground mb-6">
              Let's discuss your project and bring your 3D vision to life with the same quality and attention to detail.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-lg font-medium transition-colors">
                Start Your Project
              </button>
              <button className="border border-border hover:bg-accent hover:text-accent-foreground px-6 py-3 rounded-lg font-medium transition-colors">
                View Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;