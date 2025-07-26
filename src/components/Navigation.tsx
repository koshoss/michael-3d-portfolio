import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { Home, FolderOpen, DollarSign, Star, FileText } from "lucide-react";

const Navigation = () => {
  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Portfolio", path: "/portfolio", icon: FolderOpen, isMain: true },
    { name: "Pricing", path: "/pricing", icon: DollarSign },
    { name: "Reviews", path: "/reviews", icon: Star },
    { name: "Terms", path: "/terms", icon: FileText },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-primary">
            Michael's 3D Portfolio
          </div>
          
          <div className="flex items-center gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `transition-all duration-300 ${
                    isActive ? "scale-105" : ""
                  }`
                }
              >
                <Button
                  variant={item.isMain ? "portfolio" : "nav"}
                  size={item.isMain ? "lg" : "default"}
                  className="flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Button>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;