-- Create projects table to track real project data
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'character', 'vehicle', 'weapon', 'environment', etc.
  status TEXT NOT NULL DEFAULT 'completed', -- 'in_progress', 'completed', 'delivered'
  is_delivered_on_time BOOLEAN NOT NULL DEFAULT true,
  client_satisfaction BOOLEAN NOT NULL DEFAULT true, -- true if client is satisfied
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (portfolio display)
CREATE POLICY "Projects are viewable by everyone" 
ON public.projects 
FOR SELECT 
USING (true);

-- Create policy for admin-only write access (you can manage this later)
CREATE POLICY "Only authenticated users can manage projects" 
ON public.projects 
FOR ALL 
USING (false) -- For now, no one can insert/update/delete
WITH CHECK (false);

-- Add trigger for automatic timestamp updates
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample project data
INSERT INTO public.projects (title, description, category, status, is_delivered_on_time, client_satisfaction, start_date, delivery_date) VALUES
('Medieval Warrior Character', 'High-detail 3D character model with full armor and textures', 'character', 'completed', true, true, '2024-01-15 10:00:00+00', '2024-01-20 14:00:00+00'),
('Futuristic Vehicle Design', 'Sci-fi hover car with advanced materials and lighting', 'vehicle', 'completed', true, true, '2024-01-22 09:00:00+00', '2024-01-27 16:00:00+00'),
('Fantasy Sword Collection', 'Set of 5 magical weapons with particle effects', 'weapon', 'completed', true, true, '2024-02-01 11:00:00+00', '2024-02-05 15:00:00+00'),
('Dragon Character Model', 'Detailed dragon with animations and textures', 'character', 'completed', true, true, '2024-02-10 10:00:00+00', '2024-02-15 12:00:00+00'),
('Space Station Environment', 'Complete 3D environment with lighting setup', 'environment', 'completed', true, true, '2024-02-20 08:00:00+00', '2024-02-28 17:00:00+00'),
('Robot Character', 'Mechanical robot with detailed joints and textures', 'character', 'completed', true, true, '2024-03-01 09:00:00+00', '2024-03-06 14:00:00+00'),
('Medieval Castle', 'Large-scale castle environment with props', 'environment', 'completed', true, true, '2024-03-10 10:00:00+00', '2024-03-18 16:00:00+00'),
('Combat Rifle', 'Military-style weapon with realistic materials', 'weapon', 'completed', true, true, '2024-03-20 11:00:00+00', '2024-03-24 13:00:00+00'),
('Alien Creature', 'Unique alien design with organic textures', 'character', 'completed', true, true, '2024-04-01 09:00:00+00', '2024-04-06 15:00:00+00'),
('Sports Car Model', 'High-end luxury vehicle with interior details', 'vehicle', 'completed', true, true, '2024-04-10 10:00:00+00', '2024-04-15 14:00:00+00'),
('Magic Staff', 'Ornate wizard staff with glowing effects', 'weapon', 'completed', true, true, '2024-04-20 08:00:00+00', '2024-04-23 12:00:00+00'),
('Cyberpunk Character', 'Futuristic character with tech implants', 'character', 'completed', true, true, '2024-05-01 09:00:00+00', '2024-05-07 16:00:00+00'),
('Tank Vehicle', 'Military tank with weathered textures', 'vehicle', 'completed', true, true, '2024-05-15 10:00:00+00', '2024-05-20 14:00:00+00'),
('Forest Environment', 'Natural forest scene with vegetation', 'environment', 'completed', true, true, '2024-06-01 08:00:00+00', '2024-06-08 17:00:00+00'),
('Pirate Character', 'Detailed pirate with accessories and clothing', 'character', 'completed', true, true, '2024-06-15 09:00:00+00', '2024-06-20 15:00:00+00');