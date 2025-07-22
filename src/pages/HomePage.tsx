
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [arrayData, setArrayData] = useState([35, 15, 50, 25, 80, 20, 90, 45, 10, 60, 30, 70, 40, 85, 55]);
  const { user } = useAuth();

  const handleSort = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const arr = [...arrayData];
    
    // Bubble sort with animation
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArrayData([...arr]);
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    }
    
    setIsAnimating(false);
  };

  const handleReset = async () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const originalArray = [35, 15, 50, 25, 80, 20, 90, 45, 10, 60, 30, 70, 40, 85, 55];
    
    // Shuffle animation
    for (let i = 0; i < 20; i++) {
      const newArray = [...originalArray];
      for (let j = newArray.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [newArray[j], newArray[k]] = [newArray[k], newArray[j]];
      }
      setArrayData(newArray);
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setArrayData(originalArray);
    setIsAnimating(false);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-16 md:py-24 container px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-dsa-purple to-dsa-purple-light bg-clip-text text-transparent">
                Visualize, Learn & Practice
              </span>
              <br />Data Structures & Algorithms
            </h1>
            <p className="text-xl text-muted-foreground">
              Interactive visualizations and practice problems to master DSA concepts with ease.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-dsa-purple hover:bg-dsa-purple/90">
                <Link to="/visualizer">
                  Try Visualizer
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/playground">
                  Code Playground
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative bg-gradient-to-br from-dsa-purple-light/20 to-dsa-purple/20 rounded-2xl p-8 h-[400px] flex items-center justify-center">
            <div className="w-full max-w-md array-container relative">
              <style>{`
                .array-container {
                  display: flex;
                  align-items: flex-end;
                  justify-content: center;
                  height: 280px;
                  gap: 4px;
                }
                .array-bar {
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  border-radius: 4px 4px 0 0;
                  position: relative;
                  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
                  border: 1px solid rgba(255,255,255,0.2);
                }
                .array-bar:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 6px 12px rgba(0,0,0,0.15);
                }
              `}</style>
              {arrayData.map((height, index) => (
                <div
                  key={`${index}-${height}`}
                  className="array-bar"
                  style={{
                    height: `${(height / 100) * 250}px`,
                    width: `${100 / arrayData.length}%`,
                    backgroundColor: index % 3 === 0 ? '#4C3AE3' : 
                                    index % 3 === 1 ? '#9B87F5' : '#D6BCFA',
                    transform: isAnimating ? 'scale(1.02)' : 'scale(1)',
                  }}
                ></div>
              ))}
            </div>
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              <Button 
                size="sm" 
                variant="secondary" 
                onClick={handleSort}
                disabled={isAnimating}
                className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'hover:scale-105 shadow-lg'}`}
              >
                {isAnimating ? 'Sorting...' : 'Sort'}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={handleReset}
                disabled={isAnimating}
                className={`transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'hover:scale-105 shadow-lg'}`}
              >
                {isAnimating ? 'Shuffling...' : 'Reset'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/30">
        <div className="container px-4">
          <div className="text-center mb-12">
            <h2 className="dsa-heading mb-4">Key Features</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to master data structures and algorithms in one platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="dsa-card">
              <CardContent className="pt-6">
                <div className="bg-dsa-purple/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dsa-purple"><polygon points="12 2 19 21 12 17 5 21 12 2"></polygon></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Algorithm Visualizations</h3>
                <p className="text-muted-foreground">
                  Step-by-step animated visualizations for sorting, pathfinding, tree traversals, and more algorithms.
                </p>
              </CardContent>
            </Card>
            
            <Card className="dsa-card">
              <CardContent className="pt-6">
                <div className="bg-dsa-purple/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dsa-purple"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Interactive Playground</h3>
                <p className="text-muted-foreground">
                  Write, run, and test your code directly in the browser with syntax highlighting and real-time output.
                </p>
              </CardContent>
            </Card>
            
            <Card className="dsa-card">
              <CardContent className="pt-6">
                <div className="bg-dsa-purple/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-dsa-purple"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path></svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Practice Hub</h3>
                <p className="text-muted-foreground">
                  Curated problem sets with difficulty levels, test cases, hints, and solutions to improve your skills.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Visualization Categories */}
      <section className="py-16 container px-4">
        <div className="text-center mb-12">
          <h2 className="dsa-heading mb-4">Visualization Categories</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore various algorithm and data structure visualizations
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/visualizer" className="block">
            <Card className="dsa-card h-full hover:border-dsa-purple/30">
              <CardContent className="pt-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-4">Sorting Algorithms</h3>
                <div className="flex-grow flex items-center justify-center">
                  <div className="w-full array-container h-32">
                    {[40, 20, 60, 30, 50, 10, 70, 45].map((height, index) => (
                      <div
                        key={index}
                        className="array-bar"
                        style={{
                          height: `${height}%`,
                          width: `${100 / 10}%`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Bubble Sort, Merge Sort, Quick Sort, and more
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/visualizer" className="block">
            <Card className="dsa-card h-full hover:border-dsa-purple/30">
              <CardContent className="pt-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-4">Pathfinding</h3>
                <div className="flex-grow flex items-center justify-center">
                  <div className="w-full grid grid-cols-5 grid-rows-5 gap-1">
                    {Array(25).fill(0).map((_, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-sm ${
                          i === 6 || i === 8 || i === 11 || i === 13 || i === 16 || i === 18
                            ? 'bg-dsa-purple/20'
                            : i === 7 ? 'bg-green-500' 
                            : i === 17 ? 'bg-red-500'
                            : 'bg-dsa-purple/5'
                        }`}
                      ></div>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Dijkstra's, A* Search, BFS, DFS
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/visualizer" className="block">
            <Card className="dsa-card h-full hover:border-dsa-purple/30">
              <CardContent className="pt-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-4">Tree Structures</h3>
                <div className="flex-grow flex items-center justify-center">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="20" r="12" fill="#4C3AE3" />
                    <circle cx="25" cy="50" r="12" fill="#9B87F5" />
                    <circle cx="75" cy="50" r="12" fill="#9B87F5" />
                    <circle cx="10" cy="80" r="10" fill="#D6BCFA" />
                    <circle cx="40" cy="80" r="10" fill="#D6BCFA" />
                    <circle cx="90" cy="80" r="10" fill="#D6BCFA" />
                    <line x1="50" y1="32" x2="25" y2="38" stroke="#4C3AE3" strokeWidth="2" />
                    <line x1="50" y1="32" x2="75" y2="38" stroke="#4C3AE3" strokeWidth="2" />
                    <line x1="25" y1="62" x2="10" y2="70" stroke="#9B87F5" strokeWidth="2" />
                    <line x1="25" y1="62" x2="40" y2="70" stroke="#9B87F5" strokeWidth="2" />
                    <line x1="75" y1="62" x2="90" y2="70" stroke="#9B87F5" strokeWidth="2" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  Binary Trees, BST, AVL, Heap
                </p>
              </CardContent>
            </Card>
          </Link>
          
          <Link to="/visualizer" className="block">
            <Card className="dsa-card h-full hover:border-dsa-purple/30">
              <CardContent className="pt-6 flex flex-col h-full">
                <h3 className="text-xl font-semibold mb-4">Graph Algorithms</h3>
                <div className="flex-grow flex items-center justify-center">
                  <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle cx="50" cy="20" r="10" fill="#4C3AE3" />
                    <circle cx="20" cy="40" r="10" fill="#9B87F5" />
                    <circle cx="80" cy="40" r="10" fill="#9B87F5" />
                    <circle cx="20" cy="80" r="10" fill="#D6BCFA" />
                    <circle cx="80" cy="80" r="10" fill="#D6BCFA" />
                    <line x1="50" y1="30" x2="20" y2="40" stroke="#4C3AE3" strokeWidth="2" />
                    <line x1="50" y1="30" x2="80" y2="40" stroke="#4C3AE3" strokeWidth="2" />
                    <line x1="20" y1="50" x2="20" y2="70" stroke="#9B87F5" strokeWidth="2" />
                    <line x1="80" y1="50" x2="80" y2="70" stroke="#9B87F5" strokeWidth="2" />
                    <line x1="20" y1="50" x2="80" y2="50" stroke="#9B87F5" strokeWidth="2" />
                    <line x1="20" y1="80" x2="80" y2="80" stroke="#D6BCFA" strokeWidth="2" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground mt-4">
                  MST, Shortest Path, Traversal
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
        
        <div className="mt-12 text-center">
          <Button asChild size="lg" className="bg-dsa-purple hover:bg-dsa-purple/90">
            <Link to="/visualizer">
              Explore All Visualizations
            </Link>
          </Button>
        </div>
      </section>

      {/* Progress Tracking Section (replacing CTA) */}
      {user ? (
        <section className="py-16 bg-gradient-to-r from-dsa-purple/10 to-dsa-purple-light/10">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="dsa-heading mb-6">Track Your Progress</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Monitor your learning journey with detailed analytics and achievements.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-dsa-purple mb-2">50+</div>
                    <p className="text-sm text-muted-foreground">Practice Problems</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-dsa-purple mb-2">15+</div>
                    <p className="text-sm text-muted-foreground">Visualizations</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6 text-center">
                    <div className="text-3xl font-bold text-dsa-purple mb-2">∞</div>
                    <p className="text-sm text-muted-foreground">Learning Opportunities</p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-dsa-purple hover:bg-dsa-purple/90">
                  <Link to="/problems">
                    Continue Learning
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/visualizer">
                    Try Visualizations
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 bg-gradient-to-r from-dsa-purple/10 to-dsa-purple-light/10">
          <div className="container px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="dsa-heading mb-6">Ready to master DSA?</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Start visualizing algorithms, practicing problems, and tracking your progress today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-dsa-purple hover:bg-dsa-purple/90">
                  <Link to="/auth">
                    Sign Up Free
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/visualizer">
                    Try Demo
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
