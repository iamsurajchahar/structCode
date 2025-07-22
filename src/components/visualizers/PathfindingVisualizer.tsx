import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Define pathfinding algorithm types
type PathfindingAlgorithmType = 
  'dijkstra' | 
  'aStar' |
  'bfs' |
  'dfs';

// Node state types
type NodeType = 
  'empty' | 
  'wall' | 
  'start' | 
  'end' | 
  'visited' | 
  'path';

interface Node {
  row: number;
  col: number;
  type: NodeType;
  isVisited: boolean;
  distance: number;
  previousNode: Node | null;
  isInShortestPath: boolean;
}

const PathfindingVisualizer = () => {
  const [grid, setGrid] = useState<Node[][]>([]);
  const [algorithm, setAlgorithm] = useState<PathfindingAlgorithmType>('dijkstra');
  const [animationSpeed, setAnimationSpeed] = useState<number>(50);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [isMousePressed, setIsMousePressed] = useState<boolean>(false);
  const [startNode, setStartNode] = useState<{row: number, col: number}>({row: 5, col: 5});
  const [endNode, setEndNode] = useState<{row: number, col: number}>({row: 10, col: 20});
  const [currentAction, setCurrentAction] = useState<'wall' | 'start' | 'end'>('wall');
  const [pseudoCode, setPseudoCode] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  
  const ROWS = 15;
  const COLS = 30;
  
  // Create initial grid
  const createNode = (row: number, col: number): Node => {
    return {
      row,
      col,
      type: 'empty',
      isVisited: false,
      distance: Infinity,
      previousNode: null,
      isInShortestPath: false
    };
  };
  
  const initializeGrid = () => {
    const newGrid = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        currentRow.push(createNode(row, col));
      }
      newGrid.push(currentRow);
    }
    
    // Set start and end nodes
    newGrid[startNode.row][startNode.col].type = 'start';
    newGrid[endNode.row][endNode.col].type = 'end';
    
    setGrid(newGrid);
  };
  
  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, []);

  // Set pseudo code for the selected algorithm
  useEffect(() => {
    switch(algorithm) {
      case 'dijkstra':
        setPseudoCode([
          'procedure dijkstra(G, source)',
          '    dist[source] := 0',
          '    create vertex priority queue Q',
          '    for each vertex v in G do',
          '        if v ≠ source',
          '            dist[v] := INFINITY',
          '            prev[v] := UNDEFINED',
          '        end if',
          '        add v to Q',
          '    end for',
          '    while Q is not empty do',
          '        u := vertex in Q with min dist[u]',
          '        remove u from Q',
          '        for each neighbor v of u do',
          '            alt := dist[u] + length(u, v)',
          '            if alt < dist[v] then',
          '                dist[v] := alt',
          '                prev[v] := u',
          '            end if',
          '        end for',
          '    end while',
          'end procedure'
        ]);
        break;
      case 'aStar':
        setPseudoCode([
          'procedure AStar(start, goal)',
          '    openSet := {start}',
          '    closedSet := {}',
          '    gscore[start] := 0',
          '    fscore[start] := heuristic(start, goal)',
          '    while openSet is not empty do',
          '        current := node in openSet with lowest fscore value',
          '        if current = goal then',
          '            return reconstruct_path(current)',
          '        end if',
          '        remove current from openSet',
          '        add current to closedSet',
          '        for each neighbor of current do',
          '            if neighbor in closedSet then',
          '                continue',
          '            end if',
          '            tentative_gscore := gscore[current] + dist_between(current, neighbor)',
          '            if neighbor not in openSet then',
          '                add neighbor to openSet',
          '            else if tentative_gscore ≥ gscore[neighbor] then',
          '                continue',
          '            end if',
          '            came_from[neighbor] := current',
          '            gscore[neighbor] := tentative_gscore',
          '            fscore[neighbor] := gscore[neighbor] + heuristic(neighbor, goal)',
          '        end for',
          '    end while',
          '    return failure',
          'end procedure'
        ]);
        break;
      case 'bfs':
        setPseudoCode([
          'procedure BFS(G, root)',
          '    let Q be a queue',
          '    label root as discovered',
          '    Q.enqueue(root)',
          '    while Q is not empty do',
          '        v := Q.dequeue()',
          '        if v is the goal then',
          '            return v',
          '        end if',
          '        for all edges from v to w in G.adjacentEdges(v) do',
          '            if w is not labeled as discovered then',
          '                label w as discovered',
          '                w.parent := v',
          '                Q.enqueue(w)',
          '            end if',
          '        end for',
          '    end while',
          'end procedure'
        ]);
        break;
      case 'dfs':
        setPseudoCode([
          'procedure DFS(G, v)',
          '    label v as discovered',
          '    for all edges from v to w in G.adjacentEdges(v) do',
          '        if vertex w is not labeled as discovered then',
          '            recursively call DFS(G, w)',
          '        end if',
          '    end for',
          'end procedure'
        ]);
        break;
    }
  }, [algorithm]);

  // Handle node click for creating walls or setting start/end nodes
  const handleNodeClick = (row: number, col: number) => {
    if (isVisualizing) return;
    
    const newGrid = [...grid];
    const node = newGrid[row][col];
    
    if (currentAction === 'wall') {
      if (node.type !== 'start' && node.type !== 'end') {
        newGrid[row][col] = {
          ...node,
          type: node.type === 'wall' ? 'empty' : 'wall'
        };
      }
    } else if (currentAction === 'start') {
      // Clear previous start node
      if (startNode.row !== -1 && startNode.col !== -1) {
        newGrid[startNode.row][startNode.col] = {
          ...newGrid[startNode.row][startNode.col],
          type: 'empty'
        };
      }
      
      if (node.type !== 'end') {
        newGrid[row][col] = {
          ...node,
          type: 'start'
        };
        setStartNode({ row, col });
      }
    } else if (currentAction === 'end') {
      // Clear previous end node
      if (endNode.row !== -1 && endNode.col !== -1) {
        newGrid[endNode.row][endNode.col] = {
          ...newGrid[endNode.row][endNode.col],
          type: 'empty'
        };
      }
      
      if (node.type !== 'start') {
        newGrid[row][col] = {
          ...node,
          type: 'end'
        };
        setEndNode({ row, col });
      }
    }
    
    setGrid(newGrid);
  };
  
  const handleMouseDown = (row: number, col: number) => {
    if (isVisualizing) return;
    setIsMousePressed(true);
    handleNodeClick(row, col);
  };
  
  const handleMouseEnter = (row: number, col: number) => {
    if (isVisualizing || !isMousePressed) return;
    handleNodeClick(row, col);
  };
  
  const handleMouseUp = () => {
    setIsMousePressed(false);
  };

  // Dijkstra's algorithm implementation with visualization
  const dijkstra = async () => {
    setIsVisualizing(true);
    setCurrentStep(0); // Start at the first line of the algorithm
    
    const newGrid = [...grid];
    const startNodeObj = newGrid[startNode.row][startNode.col];
    startNodeObj.distance = 0;
    
    setCurrentStep(1); // 'dist[source] := 0'
    
    const unvisitedNodes = getAllNodes(newGrid);
    
    setCurrentStep(2); // 'create vertex priority queue Q'
    
    while (unvisitedNodes.length > 0) {
      setCurrentStep(10); // 'while Q is not empty do'
      
      // Sort nodes by distance
      unvisitedNodes.sort((a, b) => a.distance - b.distance);
      
      const closestNode = unvisitedNodes.shift()!;
      
      setCurrentStep(11); // 'u := vertex in Q with min dist[u]'
      setCurrentStep(12); // 'remove u from Q'
      
      // If we encounter a wall, skip it
      if (closestNode.type === 'wall') continue;
      
      // If the closest node has a distance of infinity,
      // then we are trapped and should stop
      if (closestNode.distance === Infinity) {
        toast.error("No path found to the destination!");
        setIsVisualizing(false);
        return;
      }
      
      // Mark the node as visited
      closestNode.isVisited = true;
      newGrid[closestNode.row][closestNode.col] = {
        ...closestNode,
        type: closestNode.type === 'start' || closestNode.type === 'end' 
          ? closestNode.type 
          : 'visited'
      };
      
      setGrid([...newGrid]);
      
      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed * 10));
      
      // If we reach the end node, we can visualize the path
      if (closestNode.row === endNode.row && closestNode.col === endNode.col) {
        await animateShortestPath(newGrid, closestNode);
        toast.success("Path found!");
        setIsVisualizing(false);
        return;
      }
      
      // Update neighbors
      setCurrentStep(13); // 'for each neighbor v of u do'
      
      const neighbors = getNeighbors(closestNode, newGrid);
      
      for (const neighbor of neighbors) {
        const alt = closestNode.distance + 1; // All edges have weight 1
        
        setCurrentStep(14); // 'alt := dist[u] + length(u, v)'
        setCurrentStep(15); // 'if alt < dist[v] then'
        
        if (alt < neighbor.distance) {
          neighbor.distance = alt;
          neighbor.previousNode = closestNode;
          
          setCurrentStep(16); // 'dist[v] := alt'
          setCurrentStep(17); // 'prev[v] := u'
        }
      }
    }
    
    // No path found
    toast.error("No path found to the destination!");
    setIsVisualizing(false);
  };

  // Helper functions for Dijkstra's algorithm
  const getAllNodes = (grid: Node[][]) => {
    const nodes = [];
    for (const row of grid) {
      for (const node of row) {
        nodes.push(node);
      }
    }
    return nodes;
  };
  
  const getNeighbors = (node: Node, grid: Node[][]) => {
    const neighbors = [];
    const { row, col } = node;
    
    // Check neighbors (up, right, down, left)
    if (row > 0) neighbors.push(grid[row - 1][col]);
    if (col < grid[0].length - 1) neighbors.push(grid[row][col + 1]);
    if (row < grid.length - 1) neighbors.push(grid[row + 1][col]);
    if (col > 0) neighbors.push(grid[row][col - 1]);
    
    return neighbors.filter(neighbor => !neighbor.isVisited && neighbor.type !== 'wall');
  };
  
  const animateShortestPath = async (grid: Node[][], endNode: Node) => {
    const path = getShortestPath(endNode);
    
    for (let i = 0; i < path.length; i++) {
      const node = path[i];
      
      if (node.type !== 'start' && node.type !== 'end') {
        grid[node.row][node.col] = {
          ...node,
          type: 'path',
          isInShortestPath: true
        };
        
        setGrid([...grid]);
        
        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }
  };
  
  const getShortestPath = (endNode: Node) => {
    const path = [];
    let currentNode: Node | null = endNode;
    
    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = currentNode.previousNode;
    }
    
    return path;
  };

  // Breadth-First Search implementation with visualization
  const bfs = async () => {
    setIsVisualizing(true);
    setCurrentStep(0); // Start at the first line of the algorithm
    
    const newGrid = [...grid];
    const startNodeObj = newGrid[startNode.row][startNode.col];
    
    setCurrentStep(1); // 'let Q be a queue'
    
    const queue = [];
    
    setCurrentStep(2); // 'label root as discovered'
    
    startNodeObj.isVisited = true;
    queue.push(startNodeObj);
    
    setCurrentStep(3); // 'Q.enqueue(root)'
    
    while (queue.length > 0) {
      setCurrentStep(4); // 'while Q is not empty do'
      
      const currentNode = queue.shift()!;
      
      setCurrentStep(5); // 'v := Q.dequeue()'
      
      // If we encounter a wall, skip it
      if (currentNode.type === 'wall') continue;
      
      // Mark the node as visited
      newGrid[currentNode.row][currentNode.col] = {
        ...currentNode,
        type: currentNode.type === 'start' || currentNode.type === 'end' 
          ? currentNode.type 
          : 'visited'
      };
      
      setGrid([...newGrid]);
      
      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed * 10));
      
      // If we reach the end node, we can visualize the path
      if (currentNode.row === endNode.row && currentNode.col === endNode.col) {
        setCurrentStep(6); // 'if v is the goal then'
        setCurrentStep(7); // 'return v'
        
        await animateShortestPath(newGrid, currentNode);
        toast.success("Path found!");
        setIsVisualizing(false);
        return;
      }
      
      setCurrentStep(8); // 'for all edges from v to w in G.adjacentEdges(v) do'
      
      const neighbors = getNeighbors(currentNode, newGrid);
      
      for (const neighbor of neighbors) {
        setCurrentStep(9); // 'if w is not labeled as discovered then'
        
        if (!neighbor.isVisited) {
          neighbor.isVisited = true;
          neighbor.previousNode = currentNode;
          
          setCurrentStep(10); // 'label w as discovered'
          setCurrentStep(11); // 'w.parent := v'
          setCurrentStep(12); // 'Q.enqueue(w)'
          
          queue.push(neighbor);
        }
      }
    }
    
    // No path found
    toast.error("No path found to the destination!");
    setIsVisualizing(false);
  };

  // Depth-First Search implementation with visualization
  const dfs = async () => {
    setIsVisualizing(true);
    setCurrentStep(0); // Start at the first line of the algorithm
    
    const newGrid = [...grid];
    const visited = new Set<string>();
    
    const dfsUtil = async (node: Node) => {
      const key = `${node.row}-${node.col}`;
      
      setCurrentStep(1); // 'label v as discovered'
      
      visited.add(key);
      
      // Mark the node as visited
      if (node.type !== 'start' && node.type !== 'end') {
        newGrid[node.row][node.col] = {
          ...node,
          type: 'visited',
          isVisited: true
        };
      } else {
        newGrid[node.row][node.col] = {
          ...node,
          isVisited: true
        };
      }
      
      setGrid([...newGrid]);
      
      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed * 10));
      
      // If we reach the end node, we can visualize the path
      if (node.row === endNode.row && node.col === endNode.col) {
        await animateShortestPath(newGrid, node);
        toast.success("Path found!");
        return true;
      }
      
      setCurrentStep(2); // 'for all edges from v to w in G.adjacentEdges(v) do'
      
      const neighbors = getNeighbors(node, newGrid);
      
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.row}-${neighbor.col}`;
        
        setCurrentStep(3); // 'if vertex w is not labeled as discovered then'
        
        if (!visited.has(neighborKey)) {
          neighbor.previousNode = node;
          
          setCurrentStep(4); // 'recursively call DFS(G, w)'
          
          const found = await dfsUtil(neighbor);
          if (found) return true;
        }
      }
      
      return false;
    };
    
    const startNodeObj = newGrid[startNode.row][startNode.col];
    const found = await dfsUtil(startNodeObj);
    
    if (!found) {
      toast.error("No path found to the destination!");
    }
    
    setIsVisualizing(false);
  };

  // Placeholder for A* algorithm (to be implemented)
  const aStar = () => {
    toast.info("A* algorithm will be implemented soon!");
    setIsVisualizing(false);
  };

  // Start visualization based on selected algorithm
  const visualize = () => {
    if (isVisualizing) return;
    
    // Reset the grid (keeping walls, start, and end nodes)
    const newGrid = [];
    for (let row = 0; row < ROWS; row++) {
      const currentRow = [];
      for (let col = 0; col < COLS; col++) {
        const oldNode = grid[row][col];
        const newNode = {
          ...createNode(row, col),
          type: oldNode.type
        };
        currentRow.push(newNode);
      }
      newGrid.push(currentRow);
    }
    
    setGrid(newGrid);
    
    switch(algorithm) {
      case 'dijkstra':
        dijkstra();
        break;
      case 'aStar':
        aStar();
        break;
      case 'bfs':
        bfs();
        break;
      case 'dfs':
        dfs();
        break;
    }
  };

  // Reset the grid
  const resetGrid = () => {
    if (isVisualizing) return;
    initializeGrid();
  };

  // Clear the path (keep walls)
  const clearPath = () => {
    if (isVisualizing) return;
    
    const newGrid = [...grid];
    
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const node = newGrid[row][col];
        if (node.type === 'visited' || node.type === 'path') {
          newGrid[row][col] = {
            ...node,
            type: 'empty',
            isVisited: false,
            distance: Infinity,
            previousNode: null,
            isInShortestPath: false
          };
        }
      }
    }
    
    setGrid(newGrid);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" onMouseLeave={handleMouseUp}>
      <div className="lg:col-span-3">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <div className="grid-container border rounded-md overflow-hidden" style={{ display: 'grid', gridTemplateColumns: `repeat(${COLS}, 1fr)` }}>
                {grid.map((row, rowIdx) =>
                  row.map((node, colIdx) => (
                    <div
                      key={`${rowIdx}-${colIdx}`}
                      className={`
                        grid-node w-full aspect-square border border-gray-200
                        ${node.type === 'wall' ? 'bg-gray-800' : ''}
                        ${node.type === 'start' ? 'bg-green-500' : ''}
                        ${node.type === 'end' ? 'bg-red-500' : ''}
                        ${node.type === 'visited' ? 'bg-blue-300' : ''}
                        ${node.type === 'path' ? 'bg-yellow-300' : ''}
                      `}
                      onMouseDown={() => handleMouseDown(rowIdx, colIdx)}
                      onMouseEnter={() => handleMouseEnter(rowIdx, colIdx)}
                      onMouseUp={handleMouseUp}
                    />
                  ))
                )}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2 justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={visualize}
                    disabled={isVisualizing}
                    className="bg-dsa-purple hover:bg-dsa-purple/90"
                  >
                    {isVisualizing ? 'Visualizing...' : 'Visualize!'}
                  </Button>
                  <Button
                    onClick={clearPath}
                    disabled={isVisualizing}
                    variant="outline"
                  >
                    Clear Path
                  </Button>
                  <Button
                    onClick={resetGrid}
                    disabled={isVisualizing}
                    variant="outline"
                  >
                    Reset Grid
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => setCurrentAction('wall')}
                    variant={currentAction === 'wall' ? 'default' : 'outline'}
                    className={currentAction === 'wall' ? 'bg-dsa-purple hover:bg-dsa-purple/90' : ''}
                    disabled={isVisualizing}
                  >
                    Wall
                  </Button>
                  <Button
                    onClick={() => setCurrentAction('start')}
                    variant={currentAction === 'start' ? 'default' : 'outline'}
                    className={currentAction === 'start' ? 'bg-green-500 hover:bg-green-600' : ''}
                    disabled={isVisualizing}
                  >
                    Start
                  </Button>
                  <Button
                    onClick={() => setCurrentAction('end')}
                    variant={currentAction === 'end' ? 'default' : 'outline'}
                    className={currentAction === 'end' ? 'bg-red-500 hover:bg-red-600' : ''}
                    disabled={isVisualizing}
                  >
                    End
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Algorithm</label>
                <Select
                  value={algorithm}
                  onValueChange={(value) => setAlgorithm(value as PathfindingAlgorithmType)}
                  disabled={isVisualizing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
                    <SelectItem value="aStar">A* Search</SelectItem>
                    <SelectItem value="bfs">Breadth-First Search</SelectItem>
                    <SelectItem value="dfs">Depth-First Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
            
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Animation Speed</label>
                  <span className="text-sm text-muted-foreground">{animationSpeed}%</span>
                </div>
                <Slider
                  value={[animationSpeed]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(values) => setAnimationSpeed(values[0])}
                  disabled={isVisualizing}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
        
      <div>
        <Card className="sticky top-20">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">Pseudocode</h3>
            <div className="bg-secondary/40 rounded-md p-3 font-mono text-xs overflow-auto max-h-[500px]">
              {pseudoCode.map((line, index) => (
                <div 
                  key={index} 
                  className={`whitespace-pre-wrap ${currentStep === index ? 'bg-dsa-purple text-white px-1 rounded' : ''}`}
                >
                  {line}
                </div>
              ))}
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              <h4 className="font-medium text-foreground">Time Complexity</h4>
              <p className="mt-1">
                {algorithm === 'dijkstra' && 'O(E + V log V) where E is edges and V is vertices'}
                {algorithm === 'aStar' && 'O(E) where E is the number of edges'}
                {algorithm === 'bfs' && 'O(V + E) where V is vertices and E is edges'}
                {algorithm === 'dfs' && 'O(V + E) where V is vertices and E is edges'}
              </p>
                
              <h4 className="font-medium mt-3 text-foreground">Space Complexity</h4>
              <p className="mt-1">
                {algorithm === 'dijkstra' && 'O(V) where V is the number of vertices'}
                {algorithm === 'aStar' && 'O(V) where V is the number of vertices'}
                {algorithm === 'bfs' && 'O(V) where V is the number of vertices'}
                {algorithm === 'dfs' && 'O(V) where V is the maximum depth of the recursion stack'}
              </p>

              <h4 className="font-medium mt-3 text-foreground">Notes</h4>
              <p className="mt-1">
                {algorithm === 'dijkstra' && 'Guarantees shortest path for weighted graphs with non-negative weights'}
                {algorithm === 'aStar' && 'Uses heuristics to find the shortest path more efficiently than Dijkstra\'s'}
                {algorithm === 'bfs' && 'Guarantees shortest path in unweighted graphs'}
                {algorithm === 'dfs' && 'Does not guarantee shortest path, but may be faster in some cases'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PathfindingVisualizer;
