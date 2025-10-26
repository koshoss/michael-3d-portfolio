import { useState } from "react";
import FilterButtons from "@/components/FilterButtons";
import ProjectCard from "@/components/ProjectCard";
import portfolioHero from "@/assets/portfolio-hero.jpg";
import projectCharacter1 from "@/assets/project-character-1.jpg";
import projectWeapon1 from "@/assets/project-weapon-1.jpg";
import projectVehicle1 from "@/assets/project-vehicle-1.jpg";
import weapon1 from "@/assets/weapon-1.png";
import weapon2 from "@/assets/weapon-2.png";
import weapon3 from "@/assets/weapon-3.png";
import weapon4 from "@/assets/weapon-4.png";
import weapon5 from "@/assets/weapon-5.png";
import weapon6 from "@/assets/weapon-6.png";
import weapon10 from "@/assets/weapon-10.png";
import ugcHornedSkull from "@/assets/ugc-horned-skull.png";
import ugcSkullMask from "@/assets/ugc-skull-mask.png";
import ugcJawMask from "@/assets/ugc-jaw-mask.png";
import ugcBeadedBracelet from "@/assets/ugc-beaded-bracelet.png";
import ugcChristmasHeadphones from "@/assets/ugc-christmas-headphones.png";
import ugcMoonNecklace from "@/assets/ugc-moon-necklace.png";
import ugcCoinPendant from "@/assets/ugc-coin-pendant.png";
import tieBlack from "@/assets/tie-black.png";
import tieBrown from "@/assets/tie-brown.png";
import tieBlue from "@/assets/tie-blue.png";
import tieNavy from "@/assets/tie-navy.png";
import tieGray from "@/assets/tie-gray.png";
import tieRed from "@/assets/tie-red.png";

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
      title: "Crystal Blade",
      image: weapon1,
      tools: ["Blender", "Substance Painter"],
      category: "Weapons",
      description: "Mystical dagger with glowing crystal blade"
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
      title: "Death Scythe",
      image: weapon2,
      tools: ["ZBrush", "Blender"],
      category: "Weapons",
      description: "Dark reaper scythe with intricate blade design"
    },
    {
      id: 7,
      title: "Shadow Scythe",
      image: weapon3,
      tools: ["Blender", "Krita"],
      category: "Weapons",
      description: "Dark fantasy scythe with ornate details"
    },
    {
      id: 8,
      title: "Shadow Sword",
      image: weapon4,
      tools: ["ZBrush", "Substance Painter"],
      category: "Weapons",
      description: "Dark blade with mystical shadow decorations"
    },
    {
      id: 9,
      title: "Shadow Bow",
      image: weapon5,
      tools: ["Blender", "Substance Painter"],
      category: "Weapons",
      description: "Dark curved bow with ornate shadow design"
    },
    {
      id: 10,
      title: "Shadow Spear",
      image: weapon10,
      tools: ["ZBrush", "Krita"],
      category: "Weapons",
      description: "Dark spear with shadowy ornamental decorations"
    },
    {
      id: 6,
      title: "Racing Pod",
      image: projectVehicle1,
      tools: ["Blender", "Krita"],
      category: "Vehicles",
      description: "High-speed racing vehicle with aerodynamic design"
    },
    {
      id: 11,
      title: "Horned Skull Mask",
      image: ugcHornedSkull,
      tools: ["Blender", "Substance Painter"],
      category: "UGC",
      description: "Demonic skull mask with curved horns"
    },
    {
      id: 12,
      title: "White Skull Mask",
      image: ugcSkullMask,
      tools: ["Blender", "ZBrush"],
      category: "UGC",
      description: "Angular white skull mask with sharp features"
    },
    {
      id: 13,
      title: "Jaw Mask",
      image: ugcJawMask,
      tools: ["Blender", "Substance Painter"],
      category: "UGC",
      description: "Lower jaw skeleton mask with fangs"
    },
    {
      id: 14,
      title: "Beaded Bracelet",
      image: ugcBeadedBracelet,
      tools: ["Blender", "Substance Painter"],
      category: "UGC",
      description: "Golden beaded bracelet accessory"
    },
    {
      id: 15,
      title: "Christmas Headphones",
      image: ugcChristmasHeadphones,
      tools: ["Blender", "Substance Painter"],
      category: "UGC",
      description: "Festive candy cane themed headphones"
    },
    {
      id: 16,
      title: "Moon Necklace",
      image: ugcMoonNecklace,
      tools: ["Blender", "Substance Painter"],
      category: "UGC",
      description: "Silver chain necklace with crescent moon pendant"
    },
    {
      id: 17,
      title: "Chinese Coin Pendant",
      image: ugcCoinPendant,
      tools: ["Blender", "Substance Painter"],
      category: "UGC",
      description: "Traditional golden coin pendant on black cord"
    },
    {
      id: 18,
      title: "Classic Striped Tie",
      image: tieBlack,
      tools: ["Blender", "Substance Painter"],
      category: "UGC",
      description: "Elegant striped tie with multiple color variants",
      colorVariants: [
        { color: "Black", image: tieBlack, displayColor: "#1a1a1a" },
        { color: "Brown", image: tieBrown, displayColor: "#5c3a3a" },
        { color: "Blue", image: tieBlue, displayColor: "#3a5c8c" },
        { color: "Navy", image: tieNavy, displayColor: "#1e2f4d" },
        { color: "Gray", image: tieGray, displayColor: "#7a7a7a" },
        { color: "Red", image: tieRed, displayColor: "#a83a3a" },
      ]
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
          src={portfolioHero}
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
                colorVariants={project.colorVariants}
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