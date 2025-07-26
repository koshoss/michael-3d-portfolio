import { useState } from "react";
import { Button } from "./ui/button";
import { ExternalLink, Download } from "lucide-react";

interface ProjectCardProps {
  title: string;
  image: string;
  tools: string[];
  category: string;
  description?: string;
}

const ProjectCard = ({ title, image, tools, category, description }: ProjectCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`relative bg-card rounded-lg overflow-hidden shadow-card transition-all duration-500 hover:scale-105 hover:shadow-glow group ${
        isHovered ? "animate-glow-pulse" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {tools.map((tool) => (
            <span
              key={tool}
              className="px-2 py-1 bg-secondary text-secondary-foreground text-xs rounded-md"
            >
              {tool}
            </span>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <ExternalLink className="w-4 h-4" />
            View
          </Button>
          <Button variant="ghost" size="sm">
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;