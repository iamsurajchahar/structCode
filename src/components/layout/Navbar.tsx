import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/contexts/AuthContext';
import { Sun, Moon, User, LogOut, MessageSquare, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, signOut, loading, debugSession } = useAuth();
  const location = useLocation();
  
  // Admin functionality removed
  const isAdmin = false;
  
  // Debug logging
  console.log('Navbar render - User:', user?.email, 'Loading:', loading);
  
  // Function to check if a link is active
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50 transition-all duration-300">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-dsa-purple to-dsa-purple-light bg-clip-text text-transparent">StructCode</span>
          </Link>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/visualizer" 
            className={`transition-colors ${isActive('/visualizer') 
              ? 'text-foreground font-medium' 
              : 'text-foreground/80 hover:text-foreground'}`}
          >
            Visualizer
          </Link>
          <Link 
            to="/playground" 
            className={`transition-colors ${isActive('/playground') 
              ? 'text-foreground font-medium' 
              : 'text-foreground/80 hover:text-foreground'}`}
          >
            Playground
          </Link>
          <Link 
            to="/problems" 
            className={`transition-colors ${isActive('/problems') 
              ? 'text-foreground font-medium' 
              : 'text-foreground/80 hover:text-foreground'}`}
          >
            Practice
          </Link>
          <Link 
            to="/about" 
            className={`transition-colors ${isActive('/about') 
              ? 'text-foreground font-medium' 
              : 'text-foreground/80 hover:text-foreground'}`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`transition-colors ${isActive('/contact') 
              ? 'text-foreground font-medium' 
              : 'text-foreground/80 hover:text-foreground'}`}
          >
            Contact
          </Link>

        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleTheme}
            className="transition-all duration-500 hover:rotate-180"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
          
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User size={20} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User size={16} />
                    My Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={handleSignOut} className="flex items-center gap-2">
                  <LogOut size={16} />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button className="bg-dsa-purple hover:bg-dsa-purple/90" asChild>
                <Link to="/auth">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
