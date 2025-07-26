import { useState } from "react";
import FilterButtons from "@/components/FilterButtons";
import ProjectCard from "@/components/ProjectCard";
import heroBanner from "@/assets/hero-banner.jpg";
import projectCharacter1 from "@/assets/project-character-1.jpg";
import projectWeapon1 from "@/assets/project-weapon-1.jpg";
import projectVehicle1 from "@/assets/project-vehicle-1.jpg";

const Portfolio = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Characters", "UGC", "Weapons", "Stud Style", "Vehicles"];

  const projects = [
    {
      id: 1,
      title: "Cyber Warrior",
      image: projectCharacter1,
      tools: ["Blender", "Substance Painter"],
      category: "Characters",
      description: "High-poly character model with detailed armor and weapons"
    },
    {
      id: 2,
      title: "Plasma Rifle",
      image: projectWeapon1,
      tools: ["ZBrush", "Krita"],
      category: "Weapons",
      description: "Futuristic weapon with glowing energy effects"
    },
    {
      id: 3,
      title: "Hover Car",
      image: projectVehicle1,
      tools: ["Blender", "Substance Painter"],
      category: "Vehicles",
      description: "Sleek futuristic vehicle with detailed interior"
    },
    {
      id: 4,
      title: "Fantasy Knight",
      image: projectCharacter1,
      tools: ["Blender", "ZBrush"],
      category: "Characters",
      description: "Medieval fantasy character with intricate armor details"
    },
    {
      id: 5,
      title: "Magic Sword",
      image: projectWeapon1,
      tools: ["ZBrush", "Substance Painter"],
      category: "Weapons",
      description: "Enchanted blade with mystical runes and effects"
    },
    {
      id: 6,
      title: "Racing Pod",
      image: projectVehicle1,
      tools: ["Blender", "Krita"],
      category: "Vehicles",
      description: "High-speed racing vehicle with aerodynamic design"
    },
  ];

  const filteredProjects = activeCategory === "All" 
    ? projects 
    : projects.filter(project => project.category === activeCategory);

  return (
    <div className="min-h-screen bg-background pt-24">
      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden mb-16">
        <img
          src={heroBanner}
          alt="Portfolio Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 to-transparent flex items-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold text-foreground mb-4 animate-fade-in">
              My 3D <span className="text-primary">Portfolio</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl animate-fade-in">
              Explore my collection of 3D models, characters, and digital art created with passion and precision
            </p>
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
                image={project.image}
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