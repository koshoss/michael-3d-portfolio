import { useState, useEffect } from "react";
import { Star, Quote, Edit3, Save, X, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from '@supabase/supabase-js';

interface Review {
  id: string;
  username: string;
  rating: number;
  review_text: string;
  created_at: string;
  user_id: string;
  isUserReview?: boolean;
}

const Reviews = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [formData, setFormData] = useState({
    review: "",
    rating: 0
  });
  const [errors, setErrors] = useState({
    review: "",
    rating: ""
  });
  const [editingReview, setEditingReview] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasExistingReview, setHasExistingReview] = useState(false);

  // Set up auth state listener
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Load reviews and projects from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch reviews
        const { data: reviewsData, error: reviewsError } = await supabase
          .from('reviews')
          .select('*')
          .order('created_at', { ascending: false });

        if (reviewsError) {
          console.error('Error fetching reviews:', reviewsError);
        } else {
          const processedReviews = reviewsData.map(review => ({
            ...review,
            isUserReview: user ? review.user_id === user.id : false
          }));
          setReviews(processedReviews);
          
          // Check if current user already has a review
          if (user) {
            const existingReview = reviewsData.find(review => review.user_id === user.id);
            setHasExistingReview(!!existingReview);
          }
        }

        // Fetch projects
        const { data: projectsData, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (projectsError) {
          console.error('Error fetching projects:', projectsError);
        } else {
          setProjects(projectsData || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [user]);

  const signInWithDiscord = async () => {
    try {
      const redirectUrl = `${window.location.origin}/reviews`;
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
          redirectTo: redirectUrl
        }
      });

      if (error) {
        console.error('Error signing in with Discord:', error);
        toast({
          title: "Error",
          description: "Failed to sign in with Discord. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error signing in with Discord:', error);
      toast({
        title: "Error",
        description: "Failed to sign in with Discord. Please try again.",
        variant: "destructive"
      });
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast({
          title: "Error",
          description: "Failed to sign out. Please try again.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been successfully signed out.",
        });
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const validateForm = () => {
    const newErrors = {
      review: "",
      rating: ""
    };

    if (!formData.review.trim()) {
      newErrors.review = "Review is required";
    } else if (formData.review.trim().length < 10) {
      newErrors.review = "Review must be at least 10 characters";
    }

    if (formData.rating === 0) {
      newErrors.rating = "Please select a star rating";
    }

    setErrors(newErrors);
    return !newErrors.review && !newErrors.rating;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in with Discord to submit a review.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Get Discord username from user metadata
      const username = user.user_metadata?.full_name || 
                      user.user_metadata?.name || 
                      user.user_metadata?.user_name || 
                      user.email?.split('@')[0] || 
                      'Discord User';

      const { data, error } = await supabase
        .from('reviews')
        .insert([
          {
            user_id: user.id,
            username: username,
            rating: formData.rating,
            review_text: formData.review.trim()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Error submitting review:', error);
        if (error.code === '23505') { // Unique constraint violation
          toast({
            title: "Review already exists",
            description: "You have already submitted a review. You can edit your existing review below.",
            variant: "destructive"
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to submit review. Please try again.",
            variant: "destructive"
          });
        }
        return;
      }

      const newReview = {
        ...data,
        isUserReview: true
      };

      setReviews(prev => [newReview, ...prev]);
      setFormData({ review: "", rating: 0 });
      setErrors({ review: "", rating: "" });
      setHasExistingReview(true);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
        .eq('user_id', user?.id);

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

  // Calculate real statistics from database
  const allReviews = reviews;
  const averageRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length).toFixed(1)
    : "5.0";

  // Calculate project statistics
  const totalProjects = projects.length;
  const satisfiedClients = projects.filter(p => p.client_satisfaction).length;
  const happyClientsPercentage = totalProjects > 0 
    ? Math.round((satisfiedClients / totalProjects) * 100)
    : 98;
  
  const onTimeDeliveries = projects.filter(p => p.is_delivered_on_time).length;
  const onTimePercentage = totalProjects > 0 
    ? Math.round((onTimeDeliveries / totalProjects) * 100)
    : 100;

  const stats = [
    { label: "Total Projects", value: `${totalProjects}+` },
    { label: "Happy Clients", value: `${happyClientsPercentage}%` },
    { label: "Average Rating", value: `${averageRating}/5` },
    { label: "On-Time Delivery", value: `${onTimePercentage}%` }
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

        {/* Authentication and Review Form */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="bg-card rounded-lg p-8 shadow-card hover:shadow-glow transition-all duration-300">
            <h2 className="text-3xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-3">
              <Star className="text-primary" />
              Leave a Review
            </h2>
            
            {!user ? (
              // Not authenticated - show Discord login
              <div className="text-center">
                <p className="text-muted-foreground mb-6">
                  Sign in with Discord to share your experience and help others discover quality 3D modeling services.
                </p>
                <Button
                  onClick={signInWithDiscord}
                  className="bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 px-8 rounded-lg shadow-deep hover:shadow-glow transition-all duration-300 hover:scale-[1.02] flex items-center gap-3 mx-auto"
                >
                  <LogIn className="w-5 h-5" />
                  Sign in with Discord
                </Button>
              </div>
            ) : hasExistingReview ? (
              // User has already submitted a review
              <div className="text-center">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-muted-foreground mb-2">
                      Welcome back, <span className="text-primary font-semibold">{user.user_metadata?.full_name || user.email}</span>!
                    </p>
                    <p className="text-muted-foreground text-sm">
                      You have already submitted a review. You can edit it below.
                    </p>
                  </div>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            ) : (
              // Authenticated and can submit review
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Welcome, <span className="text-primary font-semibold">{user.user_metadata?.full_name || user.email}</span>!
                  </p>
                  <Button
                    onClick={signOut}
                    variant="outline"
                    size="sm"
                  >
                    Sign Out
                  </Button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-6">
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
            )}
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
                <div className="bg-primary/20 rounded-lg p-3 flex-shrink-0">
                  <div className="text-3xl font-bold text-primary">{Math.round(review.rating * 20)}</div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-foreground">{review.username}</h3>
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