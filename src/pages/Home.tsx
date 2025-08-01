import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Palette, Wrench, Zap } from "lucide-react";

const Home = () => {
  console.log('Home.tsx: Home component rendering...');
  const navigate = useNavigate();

  const modelingTools = [
    { name: "Blender", icon: "🎨" },
    { name: "Roblox Studio", icon: "🎮" },
    { name: "ZBrush", icon: "🗿" },
  ];

  const texturingTools = [
    { name: "Adobe Substance 3D Painter", icon: "🎨" },
    { name: "Krita", icon: "✏️" },
  ];

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Hi, I'm <span className="text-primary drop-shadow-lg" style={{textShadow: 'var(--text-shadow)'}}>Michael</span>
          </h1>
          <p className="text-lg md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            I'm 19 years old with 3 years of experience in 3D modeling
          </p>
          <Button
            variant="hero"
            size="lg"
            onClick={() => navigate("/portfolio")}
            className="text-lg md:text-xl px-6 md:px-8 py-3 md:py-4 w-full md:w-auto"
          >
            View My Work
          </Button>
        </div>

        {/* Bio Section */}
        <div className="max-w-4xl mx-auto mb-16 px-4">
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-card">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Zap className="text-primary" />
              About Me
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed tracking-wide" style={{lineHeight: '1.8'}}>
              I make game-ready 3D models using <strong className="text-primary font-semibold">Blender</strong>, focusing on stylized characters, weapons, and props for Roblox games. 
              I enjoy turning ideas into clean, optimized models that look great and perform well in-game.
            </p>
          </div>
        </div>

        {/* Tools Section */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto px-4">
          {/* Modeling Tools */}
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-card hover:shadow-glow transition-all duration-300">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Wrench className="text-primary" />
              Modeling Tools
            </h3>
            <div className="space-y-4">
              {modelingTools.map((tool, index) => (
                <div
                  key={tool.name}
                  className={`flex items-center gap-4 p-4 bg-secondary rounded-lg hover:bg-secondary-hover hover:translate-x-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer group ${
                    index % 2 === 1 ? 'bg-secondary/80' : ''
                  }`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{tool.icon}</span>
                   <span className="text-base md:text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-200">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Texturing Tools */}
          <div className="bg-card rounded-lg p-6 md:p-8 shadow-card hover:shadow-glow transition-all duration-300">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-3">
              <Palette className="text-primary" />
              Texturing Tools
            </h3>
            <div className="space-y-4">
              {texturingTools.map((tool, index) => (
                <div
                  key={tool.name}
                  className={`flex items-center gap-4 p-4 bg-secondary rounded-lg hover:bg-secondary-hover hover:translate-x-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer group ${
                    index % 2 === 1 ? 'bg-secondary/80' : ''
                  }`}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform duration-200">{tool.icon}</span>
                  <span className="text-base md:text-lg font-medium text-foreground group-hover:text-primary transition-colors duration-200">{tool.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 px-4">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Ready to bring your ideas to life?
          </h3>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Let's collaborate and create something amazing together
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Button
              variant="default"
              size="lg"
              onClick={() => navigate("/portfolio")}
              className="w-full sm:w-auto"
            >
              View Portfolio
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/pricing")}
              className="w-full sm:w-auto"
            >
              See Pricing
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;