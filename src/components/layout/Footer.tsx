
import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="container py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-dsa-purple to-dsa-purple-light bg-clip-text text-transparent">StructCode</span>
            </Link>
            <p className="text-muted-foreground mt-4">
              A comprehensive platform to learn, visualize, and practice data structures and algorithms.
            </p>
            <div className="flex mt-6 space-x-4">
              <a 
                href="https://github.com/iamsurajchahar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </a>
              <a 
                href="https://linkedin.com/in/imsurajchahar" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a 
                href="mailto:contact.chahar@gmail.com" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/visualizer" className="text-muted-foreground hover:text-foreground transition-colors">
                  Visualizer
                </Link>
              </li>
              <li>
                <Link to="/playground" className="text-muted-foreground hover:text-foreground transition-colors">
                  Playground
                </Link>
              </li>
              <li>
                <Link to="/problems" className="text-muted-foreground hover:text-foreground transition-colors">
                  Practice
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">DSA Topics</h3>
            <ul className="space-y-2">
              <li className="text-muted-foreground">Arrays & Strings</li>
              <li className="text-muted-foreground">Linked Lists</li>
              <li className="text-muted-foreground">Stacks & Queues</li>
              <li className="text-muted-foreground">Trees & Graphs</li>
              <li className="text-muted-foreground">Dynamic Programming</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-4">About</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                  About Me
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">&copy; {new Date().getFullYear()} StructCode. All rights reserved.</p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Created by <a href="https://github.com/iamsurajchahar" className="text-dsa-purple hover:underline">Suraj Singh Chahar</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
