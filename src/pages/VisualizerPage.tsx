
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import SortingVisualizer from '@/components/visualizers/SortingVisualizer';
import SearchingVisualizer from '@/components/visualizers/SearchingVisualizer';
import PathfindingVisualizer from '@/components/visualizers/PathfindingVisualizer';
import TreeVisualizer from '@/components/visualizers/TreeVisualizer';
import GraphVisualizer from '@/components/visualizers/GraphVisualizer';

// Define algorithm categories
type AlgorithmCategory = 'sorting' | 'searching' | 'pathfinding' | 'trees' | 'graphs';

const VisualizerPage = () => {
  const [category, setCategory] = useState<AlgorithmCategory>('sorting');

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="dsa-heading mb-2">Algorithm Visualizer</h1>
        <p className="text-lg text-muted-foreground">
          Watch algorithms in action with step-by-step visualization
        </p>
      </div>
      
      <Tabs value={category} onValueChange={(value) => setCategory(value as AlgorithmCategory)}>
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="sorting">Sorting</TabsTrigger>
          <TabsTrigger value="searching">Searching</TabsTrigger>
          <TabsTrigger value="pathfinding">Pathfinding</TabsTrigger>
          <TabsTrigger value="trees">Trees</TabsTrigger>
          <TabsTrigger value="graphs">Graphs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sorting">
          <SortingVisualizer />
        </TabsContent>
        
        <TabsContent value="searching">
          <SearchingVisualizer />
        </TabsContent>
        
        <TabsContent value="pathfinding">
          <PathfindingVisualizer />
        </TabsContent>
        
        <TabsContent value="trees">
          <TreeVisualizer />
        </TabsContent>
        
        <TabsContent value="graphs">
          <GraphVisualizer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VisualizerPage;
