-- Drop existing RLS policies first
DROP POLICY IF EXISTS "Anyone can submit a review" ON public.reviews;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;

-- Clear existing reviews data since we're changing the authentication system
DELETE FROM public.reviews;

-- Update reviews table for Discord authentication
ALTER TABLE public.reviews 
DROP COLUMN user_identifier,
ADD COLUMN user_id UUID REFERENCES auth.users(id) NOT NULL,
ADD COLUMN username TEXT NOT NULL,
ADD CONSTRAINT reviews_user_id_unique UNIQUE (user_id);

-- Create new RLS policies for authenticated users
CREATE POLICY "Authenticated users can submit one review" 
ON public.reviews 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Reviews are viewable by everyone" 
ON public.reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own reviews" 
ON public.reviews 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.reviews 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);