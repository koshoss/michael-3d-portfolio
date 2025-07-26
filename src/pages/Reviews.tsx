import { useState, useEffect } from "react";
import { Star, Quote, Edit3, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Review {
  id: string;
  name: string;
  rating: number;
  review_text: string;
  created_at: string;
  user_identifier: string;
  isUserReview?: boolean;
}

const Reviews = () => {
  const [formData, setFormData] = useState({
    name: "",
    review: "",
    rating: 0
  });
  const [errors, setErrors] = useState({
    name: "",
    review: "",
    rating: ""
  });
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [userIdentifier, setUserIdentifier] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Generate or get user identifier
  useEffect(() => {
    let identifier = localStorage.getItem('user-identifier');
    if (!identifier) {
      identifier = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('user-identifier', identifier);
    }
    setUserIdentifier(identifier);
  }, []);

  // Load reviews from Supabase
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching reviews:', error);
          return;
        }

        const processedReviews = data.map(review => ({
          ...review,
          isUserReview: review.user_identifier === userIdentifier
        }));

        setReviews(processedReviews);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    if (userIdentifier) {
      fetchReviews();
    }
  }, [userIdentifier]);

  const staticReviews = [
    {
      id: "static-1",
      name: "Alex Thompson",
      rating: 5,
      review_text: "Michael delivered an absolutely stunning character model that exceeded all my expectations. The attention to detail and quality of work is professional-grade. Highly recommended!",
      created_at: "2024-01-01",
      user_identifier: "static",
      isUserReview: false
    },
    {
      id: "static-2",
      name: "Sarah Chen",
      rating: 5,
      review_text: "Incredible work on my futuristic vehicle design. Michael understood my vision perfectly and brought it to life with amazing texturing and lighting. Fast delivery too!",
      created_at: "2024-01-02",
      user_identifier: "static",
      isUserReview: false
    },
    {
      id: "static-3",
      name: "Jordan Lee",
      rating: 5,
      review_text: "Michael created a full set of medieval weapons for my game project. Each piece was meticulously crafted with realistic textures. Professional communication throughout the process.",
      created_at: "2024-01-03",
      user_identifier: "static",
      isUserReview: false
    }
  ];

  const validateForm = () => {
    const newErrors = {
      name: "",
      review: "",
      rating: ""
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.review.trim()) {
      newErrors.review = "Review is required";
    } else if (formData.review.trim().length < 10) {
      newErrors.review = "Review must be at least 10 characters";
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please select a star rating";
    }

    // Check if user has already submitted a review
    const existingReview = reviews.find(
      review => review.user_identifier === userIdentifier
    );
    if (existingReview) {
      newErrors.name = "You have already submitted a review. You can edit your existing review below.";
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.review && !newErrors.rating;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            user_identifier: userIdentifier,
            name: formData.name.trim(),
            rating: formData.rating,
            review_text: formData.review.trim()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error submitting review:', error);
        toast({
          title: "Error",
          description: "Failed to submit review. Please try again.",
          variant: "destructive"
        });
        return;
      }

      const newReview = {
        ...data,
        isUserReview: true
      };

      setReviews(prev => [newReview, ...prev]);
      setFormData({ name: "", review: "", rating: 0 });
      setErrors({ name: "", review: "", rating: "" });

      toast({
        title: "Review submitted!",
        description: "Thank you for your feedback. Your review has been added.",
      });
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleStarClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: "" }));
    }
  };

  const startEdit = (review: Review) => {
    setEditingReview(review.id);
    setEditText(review.review_text);
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditText("");
  };

  const saveEdit = async (reviewId: string) => {
    if (editText.trim().length < 10) {
      toast({
        title: "Error",
        description: "Review must be at least 10 characters long.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('reviews')
        .update({ review_text: editText.trim() })
        .eq('id', reviewId)
        .eq('user_identifier', userIdentifier);

      if (error) {
        console.error('Error updating review:', error);
        toast({
          title: "Error",
          description: "Failed to update review. Please try again.",
          variant: "destructive"
        });
        return;
      }

      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, review_text: editText.trim() }
            : review
        )
      );
      
      setEditingReview(null);
      setEditText("");
      
      toast({
        title: "Review updated!",
        description: "Your review has been successfully updated.",
      });
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: "Error",
        description: "Failed to update review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number, interactive: boolean = false, onStarClick?: (rating: number) => void) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 transition-all duration-200 ${
          i < rating 
            ? "text-primary fill-current" 
            : interactive 
              ? "text-muted-foreground hover:text-primary cursor-pointer"
              : "text-muted-foreground"
        } ${interactive ? "hover:scale-110" : ""}`}
        onClick={interactive && onStarClick ? () => onStarClick(i + 1) : undefined}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "1 day ago";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const allReviews = [...reviews, ...staticReviews];
  const averageRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1)
    : "5.0";

  const stats = [
    { label: "Total Projects", value: "150+" },
    { label: "Happy Clients", value: "98%" },
    { label: "Average Rating", value: `${averageRating}/5` },
    { label: "On-Time Delivery", value: "100%" }
  ];

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

        {/* Leave a Review Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-card rounded-lg p-8 shadow-card hover:shadow-glow transition-all duration-300">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-3">
              <Star className="text-primary" />
              Leave a Review
            </h2>
            <p className="text-muted-foreground text-center mb-8">
              Share your experience working with Michael and help others discover quality 3D modeling services.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 ${
                    errors.name ? 'border-destructive' : 'border-border hover:border-primary/50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="text-destructive text-sm mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">
                  Rating *
                </label>
                <div className="flex items-center gap-2 mb-2">
                  {renderStars(formData.rating, !loading, handleStarClick)}
                  {formData.rating > 0 && (
                    <span className="text-sm text-muted-foreground ml-2">
                      ({formData.rating} star{formData.rating !== 1 ? 's' : ''})
                    </span>
                  )}
                </div>
                {errors.rating && (
                  <p className="text-destructive text-sm mt-1">{errors.rating}</p>
                )}
              </div>

              <div>
                <label htmlFor="review" className="block text-sm font-medium text-foreground mb-2">
                  Your Review *
                </label>
                <textarea
                  id="review"
                  name="review"
                  value={formData.review}
                  onChange={handleInputChange}
                  disabled={loading}
                  rows={5}
                  className={`w-full px-4 py-3 bg-secondary border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none ${
                    errors.review ? 'border-destructive' : 'border-border hover:border-primary/50'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  placeholder="Tell others about your experience working with Michael..."
                />
                {errors.review && (
                  <p className="text-destructive text-sm mt-1">{errors.review}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 rounded-lg shadow-deep hover:shadow-glow transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
            </form>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {allReviews.map((review, index) => (
            <div
              key={review.id}
              className={`bg-card rounded-lg p-6 shadow-card hover:shadow-glow transition-all duration-300 animate-fade-in ${
                review.isUserReview ? 'ring-2 ring-primary/50 bg-card/80' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4 mb-4">
                <Quote className="w-8 h-8 text-primary flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{review.name}</h3>
                      {review.isUserReview && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                          Your Review
                        </span>
                      )}
                    </div>
                    {review.isUserReview && editingReview !== review.id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => startEdit(review)}
                        disabled={loading}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>
              
              {editingReview === review.id ? (
                <div className="space-y-4">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    disabled={loading}
                    className="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 resize-none"
                    rows={4}
                    placeholder="Edit your review..."
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={() => saveEdit(review.id)}
                      size="sm"
                      disabled={loading}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    >
                      <Save className="w-4 h-4 mr-1" />
                      {loading ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={cancelEdit}
                      variant="outline"
                      size="sm"
                      disabled={loading}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  "{review.review_text}"
                </p>
              )}
              
              <div className="text-sm text-muted-foreground">
                {formatDate(review.created_at)}
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
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Start Your Project
              </Button>
              <Button variant="outline">
                View Portfolio
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;