-- Create reviews table
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_identifier TEXT NOT NULL, -- Can be IP, session ID, or user ID
  name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

-- Create policy for insert (anyone can submit a review)
CREATE POLICY "Anyone can submit a review" 
ON public.reviews 
FOR INSERT 
WITH CHECK (true);

-- Create policy for update (users can only update their own reviews)
CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
USING (user_identifier = current_setting('request.headers')::json->>'x-user-identifier' OR user_identifier = current_setting('app.user_identifier', true));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create unique constraint to prevent duplicate reviews from same user
CREATE UNIQUE INDEX unique_user_review ON public.reviews (user_identifier);