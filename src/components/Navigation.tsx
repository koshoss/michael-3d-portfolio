import { NavLink } from "react-router-dom";
import { Button } from "./ui/button";
import { Home, FolderOpen, DollarSign, Star, FileText } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from '@supabase/supabase-js';

const Navigation = () => {
  console.log('Navigation.tsx: Navigation component rendering...');
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);

  const navItems = [
    { name: "Home", path: "/", icon: Home },
    { name: "Portfolio", path: "/portfolio", icon: FolderOpen, isMain: true },
    { name: "Pricing", path: "/pricing", icon: DollarSign },
    { name: "Reviews", path: "/reviews", icon: Star },
    { name: "Terms", path: "/terms", icon: FileText },
  ];

  // Set up auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch user profile
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

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
            
            {/* User Profile Picture or Default Visitor Image */}
            <div className="flex items-center">
              <img 
                src={
                  userProfile?.avatar_url || 
                  "/lovable-uploads/e797256a-0128-4706-85bc-cc98d47415ca.png"
                }
                alt={userProfile ? userProfile.username : "Guest"}
                className="w-10 h-10 rounded-full border-2 border-primary/30 object-cover transition-all duration-300 hover:border-primary"
                title={userProfile ? `Logged in as ${userProfile.username}` : "Guest"}
              />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;