import { useState, useEffect } from "react";
import { User } from '@supabase/supabase-js';
import FilterButtons from "@/components/FilterButtons";
import ProjectCard from "@/components/ProjectCard";
import portfolioHero from "@/assets/portfolio-hero.jpg";
import projectCharacter1 from "@/assets/project-character-1.jpg";
import projectWeapon1 from "@/assets/project-weapon-1.jpg";
import projectVehicle1 from "@/assets/project-vehicle-1.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  tools: string[];
  created_at?: string;
  image?: string;
}

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [projects, setProjects] = useState<Project[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useAdmin(user);

  const defaultProjects: Project[] = [
    {
      id: "default-1",
      title: "Cyber Warrior",
      image: projectCharacter1,
      tools: ["Blender", "Substance Painter"],
      category: "Characters",
      description: "High-poly character model with detailed armor and weapons",
      created_at: new Date().toISOString()
    },
    {
      id: "default-2", 
      title: "Plasma Rifle",
      image: projectWeapon1,
      tools: ["ZBrush", "Krita"],
      category: "Weapons",
      description: "Futuristic weapon with glowing energy effects",
      created_at: new Date().toISOString()
    },
    {
      id: "default-3",
      title: "Hover Car", 
      image: projectVehicle1,
      tools: ["Blender", "Substance Painter"],
      category: "Vehicles",
      description: "Sleek futuristic vehicle with detailed interior",
      created_at: new Date().toISOString()
    }
  ];

  useEffect(() => {
    // Get current session
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching projects:', error);
          return;
        }

        // Combine database projects with default projects that have images
        const dbProjects = (data || []).map(project => ({
          ...project,
          tools: (project as any).tools || [],
          image: getDefaultImage(project.category)
        }));

        const allProjects = [...dbProjects, ...defaultProjects];
        setProjects(allProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(defaultProjects);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getDefaultImage = (category: string) => {
    switch (category.toLowerCase()) {
      case 'characters':
        return projectCharacter1;
      case 'weapons':
        return projectWeapon1;
      case 'vehicles':
        return projectVehicle1;
      default:
        return projectCharacter1;
    }
  };

  const categories = ["All", "Characters", "UGC", "Weapons", "Stud Style", "Vehicles"];

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden mb-16">
        <img
          src={portfolioHero}
          alt="Portfolio Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-5xl font-bold text-foreground mb-4 animate-fade-in">
                  My 3D <span className="text-primary">Portfolio</span>
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl animate-fade-in">
                  Explore my collection of 3D models, characters, and digital art created with passion and precision
                </p>
              </div>
              {isAdmin && (
                <Button
                  onClick={() => window.location.href = '/admin'}
                  variant="outline"
                  className="bg-primary/10 border-primary/50 hover:bg-primary/20"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Admin Panel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {/* Filter Buttons */}
        <FilterButtons
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div
              key={project.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ProjectCard
                title={project.title}
                image={(project as any).image || getDefaultImage(project.category)}
                tools={project.tools}
                category={project.category}
                description={project.description}
              />
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-xl text-muted-foreground">
              No projects found in this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Portfolio;