import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Define graph algorithm types
type GraphAlgorithmType = 'dfs' | 'bfs' | 'dijkstra' | 'prim' | 'kruskal';

interface Node {
  id: number;
  x: number;
  y: number;
  isVisited: boolean;
  isStart: boolean;
  isEnd: boolean;
}

interface Edge {
  from: number;
  to: number;
  weight: number;
  isVisited: boolean;
}

const GraphVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [algorithm, setAlgorithm] = useState<GraphAlgorithmType>('bfs');
  const [animationSpeed, setAnimationSpeed] = useState<number>(50);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [startNode, setStartNode] = useState<number | null>(null);
  const [endNode, setEndNode] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [pseudoCode, setPseudoCode] = useState<string[]>([]);
  
  // Initialize canvas and event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    // Draw graph
    drawGraph();
    
    // Handle window resize
    const handleResize = () => {
      if (canvas) {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        drawGraph();
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [nodes, edges, selectedNode]);
  
  // Set pseudo code for the selected algorithm
  useEffect(() => {
    switch(algorithm) {
      case 'dfs':
        setPseudoCode([
          'procedure DFS(G, v)',
          '    label v as visited',
          '    for all directed edges from v to w that are in G.adjacentEdges(v) do',
          '        if vertex w is not labeled as visited then',
          '            recursively call DFS(G, w)',
          '    end for',
          'end procedure'
        ]);
        break;
      case 'bfs':
        setPseudoCode([
          'procedure BFS(G, root)',
          '    let Q be a queue',
          '    label root as visited',
          '    Q.enqueue(root)',
          '    while Q is not empty do',
          '        v := Q.dequeue()',
          '        for all edges from v to w in G.adjacentEdges(v) do',
          '            if w is not labeled as visited then',
          '                label w as visited',
          '                Q.enqueue(w)',
          '            end if',
          '        end for',
          '    end while',
          'end procedure'
        ]);
        break;
      case 'dijkstra':
        setPseudoCode([
          'procedure Dijkstra(G, source)',
          '    dist[source] := 0',
          '    for each vertex v in G do',
          '        if v ≠ source',
          '            dist[v] := ∞',
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
      case 'prim':
        setPseudoCode([
          'procedure Prim(G, source)',
          '    for each vertex v in G do',
          '        key[v] := ∞',
          '        parent[v] := NULL',
          '    end for',
          '    key[source] := 0',
          '    while there are vertices remaining in Q do',
          '        u := extract_min(Q)',
          '        for each neighbor v of u do',
          '            if v in Q and weight(u,v) < key[v] then',
          '                parent[v] := u',
          '                key[v] := weight(u,v)',
          '            end if',
          '        end for',
          '    end while',
          'end procedure'
        ]);
        break;
      case 'kruskal':
        setPseudoCode([
          'procedure Kruskal(G)',
          '    A := ∅',
          '    for each vertex v in G do',
          '        Make_Set(v)',
          '    end for',
          '    sort edges of G by weight',
          '    for each edge (u,v) in G (in order of increasing weight) do',
          '        if Find_Set(u) ≠ Find_Set(v) then',
          '            A := A ∪ {(u,v)}',
          '            Union(u, v)',
          '        end if',
          '    end for',
          'end procedure'
        ]);
        break;
    }
  }, [algorithm]);

  // Draw the graph
  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    edges.forEach(edge => {
      const fromNode = nodes.find(node => node.id === edge.from);
      const toNode = nodes.find(node => node.id === edge.to);
      
      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        
        if (edge.isVisited) {
          ctx.strokeStyle = '#4CAF50'; // Green for visited edges
        } else {
          ctx.strokeStyle = '#4C3AE3'; // Default purple
        }
        
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw edge weight
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        
        ctx.fillStyle = 'white';
        ctx.fillRect(midX - 10, midY - 10, 20, 20);
        
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'black';
        ctx.fillText(edge.weight.toString(), midX, midY);
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 15, 0, Math.PI * 2);
      
      if (node.isStart) {
        ctx.fillStyle = '#2196F3'; // Blue for start node
      } else if (node.isEnd) {
        ctx.fillStyle = '#F44336'; // Red for end node
      } else if (node.isVisited) {
        ctx.fillStyle = '#4CAF50'; // Green for visited nodes
      } else if (node.id === selectedNode) {
        ctx.fillStyle = '#FFC107'; // Yellow for selected node
      } else {
        ctx.fillStyle = '#4C3AE3'; // Default purple
      }
      
      ctx.fill();
      
      // Draw node ID
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'white';
      ctx.fillText(node.id.toString(), node.x, node.y);
    });
  };
  
  // Handle canvas click for node placement and selection
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Check if clicked on an existing node
    const clickedNode = nodes.findIndex(node => 
      Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2)) < 15
    );
    
    if (clickedNode >= 0) {
      // Node is clicked
      if (selectedNode === null) {
        // Select node
        setSelectedNode(nodes[clickedNode].id);
      } else if (selectedNode === nodes[clickedNode].id) {
        // Deselect node
        setSelectedNode(null);
      } else {
        // Add edge between selected node and clicked node
        const newEdge: Edge = {
          from: selectedNode,
          to: nodes[clickedNode].id,
          weight: Math.floor(Math.random() * 10) + 1, // Random weight between 1-10
          isVisited: false
        };
        
        // Check if edge already exists
        const edgeExists = edges.some(edge => 
          (edge.from === newEdge.from && edge.to === newEdge.to) || 
          (edge.from === newEdge.to && edge.to === newEdge.from)
        );
        
        if (!edgeExists) {
          setEdges([...edges, newEdge]);
        }
        
        setSelectedNode(null);
      }
    } else {
      // Add new node if not clicked on an existing one
      const newNode: Node = {
        id: nodes.length > 0 ? Math.max(...nodes.map(n => n.id)) + 1 : 0,
        x,
        y,
        isVisited: false,
        isStart: false,
        isEnd: false
      };
      
      setNodes([...nodes, newNode]);
    }
  };
  
  // Set start node
  const setAsStartNode = () => {
    if (selectedNode === null || isRunning) return;
    
    setNodes(nodes.map(node => ({
      ...node,
      isStart: node.id === selectedNode ? true : false,
      isEnd: node.id === selectedNode ? false : node.isEnd
    })));
    
    setStartNode(selectedNode);
    setSelectedNode(null);
  };
  
  // Set end node
  const setAsEndNode = () => {
    if (selectedNode === null || isRunning) return;
    
    setNodes(nodes.map(node => ({
      ...node,
      isEnd: node.id === selectedNode ? true : false,
      isStart: node.id === selectedNode ? false : node.isStart
    })));
    
    setEndNode(selectedNode);
    setSelectedNode(null);
  };
  
  // Clear graph
  const clearGraph = () => {
    if (isRunning) return;
    
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setStartNode(null);
    setEndNode(null);
    setCurrentStep(-1);
  };
  
  // Reset visited status
  const resetVisited = () => {
    setNodes(nodes.map(node => ({ ...node, isVisited: false })));
    setEdges(edges.map(edge => ({ ...edge, isVisited: false })));
    setCurrentStep(-1);
  };
  
  // Delete selected node
  const deleteSelectedNode = () => {
    if (selectedNode === null || isRunning) return;
    
    setEdges(edges.filter(edge => edge.from !== selectedNode && edge.to !== selectedNode));
    setNodes(nodes.filter(node => node.id !== selectedNode));
    
    if (startNode === selectedNode) setStartNode(null);
    if (endNode === selectedNode) setEndNode(null);
    
    setSelectedNode(null);
  };
  
  // Generate random graph
  const generateRandomGraph = () => {
    if (isRunning) return;
    
    const numNodes = 6;
    const nodeRadius = 15;
    const canvasWidth = canvasRef.current?.width || 600;
    const canvasHeight = canvasRef.current?.height || 400;
    
    // Generate nodes
    const newNodes: Node[] = [];
    for (let i = 0; i < numNodes; i++) {
      let valid = false;
      let x, y;
      
      // Ensure nodes are not too close to each other
      while (!valid) {
        x = Math.random() * (canvasWidth - 2 * nodeRadius) + nodeRadius;
        y = Math.random() * (canvasHeight - 2 * nodeRadius) + nodeRadius;
        valid = true;
        
        for (const node of newNodes) {
          const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2));
          if (distance < 3 * nodeRadius) {
            valid = false;
            break;
          }
        }
      }
      
      newNodes.push({
        id: i,
        x: x as number,
        y: y as number,
        isVisited: false,
        isStart: false,
        isEnd: false
      });
    }
    
    // Generate edges
    const newEdges: Edge[] = [];
    for (let i = 0; i < numNodes; i++) {
      for (let j = i + 1; j < numNodes; j++) {
        if (Math.random() < 0.4) { // 40% chance to create an edge
          newEdges.push({
            from: i,
            to: j,
            weight: Math.floor(Math.random() * 10) + 1, // Random weight between 1-10
            isVisited: false
          });
        }
      }
    }
    
    // Set start and end nodes
    const startIdx = Math.floor(Math.random() * numNodes);
    let endIdx;
    do {
      endIdx = Math.floor(Math.random() * numNodes);
    } while (endIdx === startIdx);
    
    newNodes[startIdx].isStart = true;
    newNodes[endIdx].isEnd = true;
    
    setNodes(newNodes);
    setEdges(newEdges);
    setStartNode(startIdx);
    setEndNode(endIdx);
    setSelectedNode(null);
  };

  // Run algorithm animation
  const runAlgorithm = async () => {
    if (isRunning || startNode === null) {
      if (startNode === null) {
        toast.error("Please set a start node");
      }
      return;
    }
    
    setIsRunning(true);
    resetVisited();
    
    // Create adjacency list
    const adjList: { [key: number]: number[] } = {};
    nodes.forEach(node => {
      adjList[node.id] = [];
    });
    
    edges.forEach(edge => {
      adjList[edge.from].push(edge.to);
      adjList[edge.to].push(edge.from); // For undirected graph
    });
    
    // Delay function for visualization
    const delay = () => new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
    
    // Mark node as visited
    const visitNode = (nodeId: number) => {
      setNodes(prev => prev.map(node => 
        node.id === nodeId ? { ...node, isVisited: true } : node
      ));
    };
    
    // Mark edge as visited
    const visitEdge = (from: number, to: number) => {
      setEdges(prev => prev.map(edge => 
        (edge.from === from && edge.to === to) || (edge.from === to && edge.to === from) 
          ? { ...edge, isVisited: true } 
          : edge
      ));
    };
    
    // BFS algorithm
    if (algorithm === 'bfs') {
      setCurrentStep(0); // procedure BFS
      await delay();
      
      setCurrentStep(1); // let Q be a queue
      const queue: number[] = [startNode];
      const visited: Set<number> = new Set([startNode]);
      
      setCurrentStep(2); // label root as visited
      visitNode(startNode);
      await delay();
      
      setCurrentStep(3); // Q.enqueue(root)
      await delay();
      
      setCurrentStep(4); // while Q is not empty
      while (queue.length > 0) {
        setCurrentStep(5); // v := Q.dequeue()
        const current = queue.shift()!;
        await delay();
        
        setCurrentStep(6); // for all edges from v to w
        for (const neighbor of adjList[current]) {
          if (!visited.has(neighbor)) {
            setCurrentStep(7); // if w is not labeled as visited
            await delay();
            
            setCurrentStep(8); // label w as visited
            visited.add(neighbor);
            visitNode(neighbor);
            visitEdge(current, neighbor);
            await delay();
            
            setCurrentStep(9); // Q.enqueue(w)
            queue.push(neighbor);
            await delay();
          }
        }
      }
    }
    // DFS algorithm
    else if (algorithm === 'dfs') {
      setCurrentStep(0); // procedure DFS
      
      const dfs = async (nodeId: number, visited: Set<number>) => {
        setCurrentStep(1); // label v as visited
        visited.add(nodeId);
        visitNode(nodeId);
        await delay();
        
        setCurrentStep(2); // for all directed edges
        for (const neighbor of adjList[nodeId]) {
          if (!visited.has(neighbor)) {
            setCurrentStep(3); // if vertex w is not labeled as visited
            visitEdge(nodeId, neighbor);
            await delay();
            
            setCurrentStep(4); // recursively call DFS
            await dfs(neighbor, visited);
          }
        }
      };
      
      await dfs(startNode, new Set<number>());
    }
    // Other algorithms (placeholder)
    else {
      toast.info(`${algorithm} visualization will be implemented soon!`);
    }
    
    setIsRunning(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <canvas 
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="border border-border rounded-md h-64 bg-secondary/20 cursor-pointer"
              />
              
              <div className="mt-6 flex flex-wrap items-center gap-2 justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={generateRandomGraph}
                    disabled={isRunning}
                    variant="outline"
                  >
                    Generate Random Graph
                  </Button>
                  <Button
                    onClick={clearGraph}
                    disabled={isRunning}
                    variant="outline"
                  >
                    Clear Graph
                  </Button>
                  <Button
                    onClick={runAlgorithm}
                    disabled={isRunning || startNode === null}
                    className="bg-dsa-purple hover:bg-dsa-purple/90"
                  >
                    {isRunning ? 'Running...' : 'Run Algorithm'}
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  {selectedNode !== null && (
                    <>
                      <Button
                        onClick={setAsStartNode}
                        disabled={isRunning}
                        variant="outline"
                        className="border-blue-500 text-blue-500"
                      >
                        Set as Start
                      </Button>
                      <Button
                        onClick={setAsEndNode}
                        disabled={isRunning}
                        variant="outline"
                        className="border-red-500 text-red-500"
                      >
                        Set as End
                      </Button>
                      <Button
                        onClick={deleteSelectedNode}
                        disabled={isRunning}
                        variant="outline"
                        className="border-destructive text-destructive"
                      >
                        Delete Node
                      </Button>
                    </>
                  )}
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
                  onValueChange={(value) => setAlgorithm(value as GraphAlgorithmType)}
                  disabled={isRunning}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dfs">Depth-First Search (DFS)</SelectItem>
                    <SelectItem value="bfs">Breadth-First Search (BFS)</SelectItem>
                    <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
                    <SelectItem value="prim">Prim's Algorithm</SelectItem>
                    <SelectItem value="kruskal">Kruskal's Algorithm</SelectItem>
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
                  disabled={isRunning}
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
              <h4 className="font-medium text-foreground">Instructions</h4>
              <ul className="mt-1 list-disc list-inside space-y-1">
                <li>Click on empty space to add a node</li>
                <li>Click a node to select it (yellow)</li>
                <li>Click another node to create an edge</li>
                <li>Use buttons to set start/end nodes</li>
              </ul>
              
              <h4 className="font-medium mt-3 text-foreground">Time Complexity</h4>
              <p className="mt-1">
                {algorithm === 'dfs' && 'O(V + E) where V is vertices and E is edges'}
                {algorithm === 'bfs' && 'O(V + E) where V is vertices and E is edges'}
                {algorithm === 'dijkstra' && 'O((V + E) log V) with binary heap'}
                {algorithm === 'prim' && 'O(E log V) with binary heap'}
                {algorithm === 'kruskal' && 'O(E log E) or O(E log V)'}
              </p>
                
              <h4 className="font-medium mt-3 text-foreground">Space Complexity</h4>
              <p className="mt-1">
                {algorithm === 'dfs' && 'O(V) for recursion stack'}
                {algorithm === 'bfs' && 'O(V) for queue'}
                {algorithm === 'dijkstra' && 'O(V) for distance array and priority queue'}
                {algorithm === 'prim' && 'O(V) for key and parent arrays'}
                {algorithm === 'kruskal' && 'O(V) for disjoint-set data structure'}
              </p>

              <h4 className="font-medium mt-3 text-foreground">Applications</h4>
              <p className="mt-1">
                {algorithm === 'dfs' && 'Cycle detection, topological sorting, solving puzzles'}
                {algorithm === 'bfs' && 'Finding shortest paths, connected components, bipartite graph verification'}
                {algorithm === 'dijkstra' && 'Shortest path problems, GPS systems, network routing protocols'}
                {algorithm === 'prim' && 'Minimum spanning tree, network design, clustering'}
                {algorithm === 'kruskal' && 'Minimum spanning tree, network design, cluster analysis'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GraphVisualizer;
