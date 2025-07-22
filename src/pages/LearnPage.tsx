
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const LearnPage = () => {
  return (
    <div className="container px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="dsa-heading mb-2">Learning Resources</h1>
        <p className="text-lg text-muted-foreground">
          Comprehensive guides to master data structures and algorithms
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="dsa-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">DSA Fundamentals</h3>
              <Badge variant="outline" className="bg-dsa-purple/10 text-dsa-purple border-none">Beginner</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Learn the basic building blocks of data structures and algorithms. Great starting point for beginners.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Introduction to Complexity Analysis
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Arrays and Strings
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Basic Sorting Algorithms
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Introduction to Recursion
              </li>
            </ul>
            <Button asChild className="w-full bg-dsa-purple hover:bg-dsa-purple/90">
              <Link to="/learn/fundamentals">
                Start Learning
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="dsa-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Advanced Data Structures</h3>
              <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-none">Intermediate</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Dive deeper into complex data structures and their real-world applications.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Trees & Binary Search Trees
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Heaps & Priority Queues
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Hash Tables & Implementations
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Graphs & Graph Algorithms
              </li>
            </ul>
            <Button asChild className="w-full" variant="outline">
              <Link to="/learn/advanced">
                Explore Topics
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="dsa-card">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">Algorithm Mastery</h3>
              <Badge variant="outline" className="bg-red-500/10 text-red-600 border-none">Advanced</Badge>
            </div>
            <p className="text-muted-foreground mb-4">
              Master complex algorithms and problem-solving techniques for technical interviews.
            </p>
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Dynamic Programming Patterns
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                Advanced Graph Algorithms
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                String Matching Algorithms
              </li>
              <li className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                NP-Complete Problems
              </li>
            </ul>
            <Button asChild className="w-full" variant="outline">
              <Link to="/learn/mastery">
                View Advanced Topics
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="mb-12">
        <h2 className="dsa-subheading mb-6">Latest Tutorials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <Badge className="mb-3 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20">Arrays</Badge>
              <h3 className="text-lg font-medium mb-2">Kadane's Algorithm for Maximum Subarray</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Learn how to efficiently find the contiguous subarray with the largest sum in linear time.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">15 min read</span>
                <Button asChild variant="ghost" size="sm" className="text-dsa-purple">
                  <Link to="/learn/tutorial/kadanes-algorithm">
                    Read Tutorial
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <Badge className="mb-3 bg-green-500/10 text-green-500 hover:bg-green-500/20">Trees</Badge>
              <h3 className="text-lg font-medium mb-2">Balanced Binary Search Trees Explained</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Understanding AVL and Red-Black trees with practical implementation examples.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">25 min read</span>
                <Button asChild variant="ghost" size="sm" className="text-dsa-purple">
                  <Link to="/learn/tutorial/balanced-bst">
                    Read Tutorial
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <Badge className="mb-3 bg-purple-500/10 text-purple-500 hover:bg-purple-500/20">Graphs</Badge>
              <h3 className="text-lg font-medium mb-2">Dijkstra's Algorithm Implementation</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Step-by-step guide to implement Dijkstra's algorithm for finding shortest paths.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">20 min read</span>
                <Button asChild variant="ghost" size="sm" className="text-dsa-purple">
                  <Link to="/learn/tutorial/dijkstra">
                    Read Tutorial
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="bg-gradient-to-r from-dsa-purple/10 to-dsa-purple-light/10 rounded-xl p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="dsa-heading mb-4">Ready to practice?</h2>
          <p className="text-lg text-muted-foreground mb-6">
            Apply what you've learned by solving real algorithmic problems.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild className="bg-dsa-purple hover:bg-dsa-purple/90">
              <Link to="/problems">
                Browse Problem Sets
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/visualizer">
                Try Visualizer
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
