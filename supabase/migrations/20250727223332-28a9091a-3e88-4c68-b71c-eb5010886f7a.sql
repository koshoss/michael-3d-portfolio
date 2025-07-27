-- Create an enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable Row-Level Security
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Only admins can manage roles"
ON public.user_roles
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Grant the kosho_dev user admin role
INSERT INTO public.user_roles (user_id, role)
SELECT u.id, 'admin'::app_role
FROM auth.users u
JOIN public.profiles p ON u.id = p.user_id
WHERE p.username = 'kosho_dev'
ON CONFLICT (user_id, role) DO NOTHING;

-- Create a table for site content management
CREATE TABLE public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page VARCHAR(50) NOT NULL,
    section VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE(page, section)
);

-- Enable RLS on site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Policies for site_content
CREATE POLICY "Site content is viewable by everyone"
ON public.site_content
FOR SELECT
USING (true);

CREATE POLICY "Only admins can modify site content"
ON public.site_content
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- Insert initial pricing content
INSERT INTO public.site_content (page, section, content) VALUES
('pricing', 'basic_price', '50'),
('pricing', 'basic_title', 'Basic Package'),
('pricing', 'basic_description', 'Perfect for simple 3D models and basic projects'),
('pricing', 'premium_price', '150'),
('pricing', 'premium_title', 'Premium Package'),
('pricing', 'premium_description', 'Advanced models with textures and lighting'),
('pricing', 'enterprise_price', '300'),
('pricing', 'enterprise_title', 'Enterprise Package'),
('pricing', 'enterprise_description', 'Complex projects with animations and full scenes'),
('terms', 'content', 'Terms and Conditions content goes here...');

-- Add trigger for updating timestamp
CREATE TRIGGER update_site_content_updated_at
BEFORE UPDATE ON public.site_content
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update projects table to allow admin management
CREATE POLICY "Only admins can manage projects"
ON public.projects
FOR ALL
USING (public.has_role(auth.uid(), 'admin'));