
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Define tree operation types
type TreeOperationType = 'insert' | 'delete' | 'search';

// Define tree traversal types
type TreeTraversalType = 'inorder' | 'preorder' | 'postorder' | 'levelorder';

// Binary Tree Node
interface TreeNode {
  value: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x: number;
  y: number;
  highlighted: boolean;
  visited: boolean;
}

const TreeVisualizer = () => {
  const [root, setRoot] = useState<TreeNode | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [operation, setOperation] = useState<TreeOperationType>('insert');
  const [traversalType, setTraversalType] = useState<TreeTraversalType>('inorder');
  const [animationSpeed, setAnimationSpeed] = useState<number>(50);
  const [isVisualizing, setIsVisualizing] = useState<boolean>(false);
  const [pseudoCode, setPseudoCode] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  
  // SVG settings
  const SVG_WIDTH = 800;
  const SVG_HEIGHT = 500;
  const NODE_RADIUS = 25;
  const LEVEL_HEIGHT = 80;
  
  // Create a sample tree on component mount
  useEffect(() => {
    const sampleValues = [50, 30, 70, 20, 40, 60, 80];
    let newRoot = null;
    
    for (const value of sampleValues) {
      newRoot = insertNode(newRoot, value);
    }
    
    updateNodePositions(newRoot);
    setRoot(newRoot);
  }, []);

  // Update pseudo code based on the selected operation or traversal
  useEffect(() => {
    if (operation === 'insert') {
      setPseudoCode([
        'procedure insertNode(root, value)',
        '    if root is null then',
        '        return new Node(value)',
        '    end if',
        '    if value < root.value then',
        '        root.left := insertNode(root.left, value)',
        '    else if value > root.value then',
        '        root.right := insertNode(root.right, value)',
        '    end if',
        '    return root',
        'end procedure'
      ]);
    } else if (operation === 'delete') {
      setPseudoCode([
        'procedure deleteNode(root, value)',
        '    if root is null then',
        '        return null',
        '    end if',
        '    if value < root.value then',
        '        root.left := deleteNode(root.left, value)',
        '    else if value > root.value then',
        '        root.right := deleteNode(root.right, value)',
        '    else',
        '        // Node with only one child or no child',
        '        if root.left is null then',
        '            return root.right',
        '        else if root.right is null then',
        '            return root.left',
        '        end if',
        '        // Node with two children',
        '        root.value := minValue(root.right)',
        '        root.right := deleteNode(root.right, root.value)',
        '    end if',
        '    return root',
        'end procedure'
      ]);
    } else if (operation === 'search') {
      setPseudoCode([
        'procedure searchNode(root, value)',
        '    if root is null or root.value = value then',
        '        return root',
        '    end if',
        '    if value < root.value then',
        '        return searchNode(root.left, value)',
        '    else',
        '        return searchNode(root.right, value)',
        '    end if',
        'end procedure'
      ]);
    } else if (traversalType === 'inorder') {
      setPseudoCode([
        'procedure inorderTraversal(root)',
        '    if root is not null then',
        '        inorderTraversal(root.left)',
        '        visit(root)',
        '        inorderTraversal(root.right)',
        '    end if',
        'end procedure'
      ]);
    } else if (traversalType === 'preorder') {
      setPseudoCode([
        'procedure preorderTraversal(root)',
        '    if root is not null then',
        '        visit(root)',
        '        preorderTraversal(root.left)',
        '        preorderTraversal(root.right)',
        '    end if',
        'end procedure'
      ]);
    } else if (traversalType === 'postorder') {
      setPseudoCode([
        'procedure postorderTraversal(root)',
        '    if root is not null then',
        '        postorderTraversal(root.left)',
        '        postorderTraversal(root.right)',
        '        visit(root)',
        '    end if',
        'end procedure'
      ]);
    } else if (traversalType === 'levelorder') {
      setPseudoCode([
        'procedure levelorderTraversal(root)',
        '    if root is null then',
        '        return',
        '    end if',
        '    queue := new Queue()',
        '    queue.enqueue(root)',
        '    while queue is not empty do',
        '        node := queue.dequeue()',
        '        visit(node)',
        '        if node.left is not null then',
        '            queue.enqueue(node.left)',
        '        end if',
        '        if node.right is not null then',
        '            queue.enqueue(node.right)',
        '        end if',
        '    end while',
        'end procedure'
      ]);
    }
  }, [operation, traversalType]);

  // Create a new node
  const createNode = (value: number): TreeNode => {
    return {
      value,
      left: null,
      right: null,
      x: SVG_WIDTH / 2,
      y: 50,
      highlighted: false,
      visited: false
    };
  };

  // Insert a node into the tree
  const insertNode = (root: TreeNode | null, value: number): TreeNode => {
    if (root === null) {
      return createNode(value);
    }
    
    if (value < root.value) {
      root.left = insertNode(root.left, value);
    } else if (value > root.value) {
      root.right = insertNode(root.right, value);
    }
    
    return root;
  };

  // Find the minimum value in a tree
  const minValueNode = (node: TreeNode): TreeNode => {
    let current = node;
    while (current.left !== null) {
      current = current.left;
    }
    return current;
  };

  // Delete a node from the tree
  const deleteNode = (root: TreeNode | null, value: number): TreeNode | null => {
    if (root === null) {
      return null;
    }
    
    if (value < root.value) {
      root.left = deleteNode(root.left, value);
    } else if (value > root.value) {
      root.right = deleteNode(root.right, value);
    } else {
      // Node with only one child or no child
      if (root.left === null) {
        return root.right;
      } else if (root.right === null) {
        return root.left;
      }
      
      // Node with two children
      // Get the inorder successor (smallest value in right subtree)
      const temp = minValueNode(root.right);
      root.value = temp.value;
      
      // Delete the inorder successor
      root.right = deleteNode(root.right, temp.value);
    }
    
    return root;
  };

  // Search for a node in the tree
  const searchNode = (root: TreeNode | null, value: number): TreeNode | null => {
    if (root === null || root.value === value) {
      return root;
    }
    
    if (value < root.value) {
      return searchNode(root.left, value);
    }
    
    return searchNode(root.right, value);
  };

  // Calculate the x, y positions for nodes
  const updateNodePositions = (root: TreeNode | null, level: number = 0, offset: number = 0, width: number = SVG_WIDTH): void => {
    if (root === null) return;
    
    const x = offset + width / 2;
    const y = 50 + level * LEVEL_HEIGHT;
    
    root.x = x;
    root.y = y;
    
    const nextWidth = width / 2;
    
    updateNodePositions(root.left, level + 1, offset, nextWidth);
    updateNodePositions(root.right, level + 1, offset + nextWidth, nextWidth);
  };

  // Reset highlighting on all nodes
  const resetHighlighting = (node: TreeNode | null): void => {
    if (node === null) return;
    
    node.highlighted = false;
    node.visited = false;
    
    resetHighlighting(node.left);
    resetHighlighting(node.right);
  };

  // Handle the tree operation based on user input
  const handleOperation = async () => {
    if (isVisualizing) return;
    
    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }
    
    setIsVisualizing(true);
    
    // Reset node highlighting
    if (root !== null) {
      resetHighlighting(root);
      setRoot({ ...root });
    }
    
    setCurrentStep(0); // Start at the first line of the algorithm
    
    try {
      if (operation === 'insert') {
        await visualizeInsert(value);
      } else if (operation === 'delete') {
        await visualizeDelete(value);
      } else if (operation === 'search') {
        await visualizeSearch(value);
      }
    } catch (error) {
      console.error('Error during visualization:', error);
      toast.error('An error occurred during visualization');
    } finally {
      setIsVisualizing(false);
      setInputValue('');
    }
  };

  // Visualize the insertion of a node
  const visualizeInsert = async (value: number) => {
    const insertWithVisualization = async (node: TreeNode | null, value: number): Promise<TreeNode> => {
      if (node === null) {
        setCurrentStep(1); // 'if root is null then'
        setCurrentStep(2); // 'return new Node(value)'
        
        const newNode = createNode(value);
        await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
        return newNode;
      }
      
      node.highlighted = true;
      setRoot({ ...root! });
      await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
      
      if (value < node.value) {
        setCurrentStep(4); // 'if value < root.value then'
        setCurrentStep(5); // 'root.left := insertNode(root.left, value)'
        
        node.left = await insertWithVisualization(node.left, value);
      } else if (value > node.value) {
        setCurrentStep(6); // 'else if value > root.value then'
        setCurrentStep(7); // 'root.right := insertNode(root.right, value)'
        
        node.right = await insertWithVisualization(node.right, value);
      }
      
      node.highlighted = false;
      setCurrentStep(9); // 'return root'
      
      return node;
    };
    
    const newRoot = await insertWithVisualization(root, value);
    updateNodePositions(newRoot);
    setRoot({ ...newRoot });
    
    toast.success(`Inserted ${value} into the tree`);
  };

  // Visualize the deletion of a node
  const visualizeDelete = async (value: number) => {
    const deleteWithVisualization = async (node: TreeNode | null, value: number): Promise<TreeNode | null> => {
      if (node === null) {
        setCurrentStep(1); // 'if root is null then'
        setCurrentStep(2); // 'return null'
        
        await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
        return null;
      }
      
      node.highlighted = true;
      setRoot({ ...root! });
      await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
      
      if (value < node.value) {
        setCurrentStep(4); // 'if value < root.value then'
        setCurrentStep(5); // 'root.left := deleteNode(root.left, value)'
        
        node.left = await deleteWithVisualization(node.left, value);
      } else if (value > node.value) {
        setCurrentStep(6); // 'else if value > root.value then'
        setCurrentStep(7); // 'root.right := deleteNode(root.right, value)'
        
        node.right = await deleteWithVisualization(node.right, value);
      } else {
        setCurrentStep(8); // 'else'
        
        // Node to be deleted found
        if (node.left === null) {
          setCurrentStep(10); // 'if root.left is null then'
          setCurrentStep(11); // 'return root.right'
          
          node.highlighted = false;
          await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
          return node.right;
        } else if (node.right === null) {
          setCurrentStep(12); // 'else if root.right is null then'
          setCurrentStep(13); // 'return root.left'
          
          node.highlighted = false;
          await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
          return node.left;
        }
        
        setCurrentStep(16); // 'root.value := minValue(root.right)'
        
        // Node with two children
        // Get the inorder successor (smallest in right subtree)
        let successor = node.right;
        successor.highlighted = true;
        setRoot({ ...root! });
        await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
        
        while (successor.left !== null) {
          successor.highlighted = false;
          successor = successor.left;
          successor.highlighted = true;
          setRoot({ ...root! });
          await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
        }
        
        node.value = successor.value;
        successor.highlighted = false;
        
        setCurrentStep(17); // 'root.right := deleteNode(root.right, root.value)'
        
        node.right = await deleteWithVisualization(node.right, successor.value);
      }
      
      node.highlighted = false;
      setCurrentStep(19); // 'return root'
      
      return node;
    };
    
    const newRoot = await deleteWithVisualization(root, value);
    if (newRoot !== null) {
      updateNodePositions(newRoot);
      setRoot({ ...newRoot });
      toast.success(`Deleted ${value} from the tree`);
    } else {
      setRoot(null);
      toast.success(`Deleted the last node from the tree`);
    }
  };

  // Visualize searching for a node
  const visualizeSearch = async (value: number) => {
    const searchWithVisualization = async (node: TreeNode | null, value: number): Promise<boolean> => {
      if (node === null) {
        setCurrentStep(1); // 'if root is null or root.value = value then'
        await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
        return false;
      }
      
      node.highlighted = true;
      setRoot({ ...root! });
      await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
      
      if (node.value === value) {
        setCurrentStep(1); // 'if root is null or root.value = value then'
        setCurrentStep(2); // 'return root'
        
        node.visited = true;
        setRoot({ ...root! });
        await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
        return true;
      }
      
      if (value < node.value) {
        setCurrentStep(4); // 'if value < root.value then'
        setCurrentStep(5); // 'return searchNode(root.left, value)'
        
        node.highlighted = false;
        setRoot({ ...root! });
        return await searchWithVisualization(node.left, value);
      } else {
        setCurrentStep(6); // 'else'
        setCurrentStep(7); // 'return searchNode(root.right, value)'
        
        node.highlighted = false;
        setRoot({ ...root! });
        return await searchWithVisualization(node.right, value);
      }
    };
    
    const found = await searchWithVisualization(root, value);
    
    if (found) {
      toast.success(`Found ${value} in the tree`);
    } else {
      toast.error(`${value} not found in the tree`);
    }
  };

  // Visualize tree traversal
  const visualizeTraversal = async () => {
    if (isVisualizing || root === null) return;
    
    setIsVisualizing(true);
    
    // Reset node highlighting
    resetHighlighting(root);
    setRoot({ ...root });
    
    setCurrentStep(0); // Start at the first line of the algorithm
    
    try {
      const traversalResult: number[] = [];
      
      if (traversalType === 'inorder') {
        await inorderTraversal(root, traversalResult);
      } else if (traversalType === 'preorder') {
        await preorderTraversal(root, traversalResult);
      } else if (traversalType === 'postorder') {
        await postorderTraversal(root, traversalResult);
      } else if (traversalType === 'levelorder') {
        await levelOrderTraversal(root, traversalResult);
      }
      
      toast.success(`${traversalType} traversal: ${traversalResult.join(', ')}`);
    } catch (error) {
      console.error('Error during traversal:', error);
      toast.error('An error occurred during traversal');
    } finally {
      setIsVisualizing(false);
    }
  };

  // Inorder traversal
  const inorderTraversal = async (node: TreeNode | null, result: number[]) => {
    if (node === null) return;
    
    setCurrentStep(1); // 'if root is not null then'
    
    setCurrentStep(2); // 'inorderTraversal(root.left)'
    await inorderTraversal(node.left, result);
    
    setCurrentStep(3); // 'visit(root)'
    node.highlighted = true;
    node.visited = true;
    setRoot({ ...root! });
    await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
    result.push(node.value);
    
    setCurrentStep(4); // 'inorderTraversal(root.right)'
    await inorderTraversal(node.right, result);
    
    node.highlighted = false;
    setRoot({ ...root! });
  };

  // Preorder traversal
  const preorderTraversal = async (node: TreeNode | null, result: number[]) => {
    if (node === null) return;
    
    setCurrentStep(1); // 'if root is not null then'
    
    setCurrentStep(2); // 'visit(root)'
    node.highlighted = true;
    node.visited = true;
    setRoot({ ...root! });
    await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
    result.push(node.value);
    
    setCurrentStep(3); // 'preorderTraversal(root.left)'
    await preorderTraversal(node.left, result);
    
    setCurrentStep(4); // 'preorderTraversal(root.right)'
    await preorderTraversal(node.right, result);
    
    node.highlighted = false;
    setRoot({ ...root! });
  };

  // Postorder traversal
  const postorderTraversal = async (node: TreeNode | null, result: number[]) => {
    if (node === null) return;
    
    setCurrentStep(1); // 'if root is not null then'
    
    setCurrentStep(2); // 'postorderTraversal(root.left)'
    await postorderTraversal(node.left, result);
    
    setCurrentStep(3); // 'postorderTraversal(root.right)'
    await postorderTraversal(node.right, result);
    
    setCurrentStep(4); // 'visit(root)'
    node.highlighted = true;
    node.visited = true;
    setRoot({ ...root! });
    await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
    result.push(node.value);
    
    node.highlighted = false;
    setRoot({ ...root! });
  };

  // Level order traversal
  const levelOrderTraversal = async (root: TreeNode, result: number[]) => {
    setCurrentStep(4); // 'queue := new Queue()'
    
    const queue: TreeNode[] = [];
    
    setCurrentStep(5); // 'queue.enqueue(root)'
    queue.push(root);
    
    setCurrentStep(6); // 'while queue is not empty do'
    while (queue.length > 0) {
      const node = queue.shift()!;
      
      setCurrentStep(7); // 'node := queue.dequeue()'
      
      setCurrentStep(8); // 'visit(node)'
      node.highlighted = true;
      node.visited = true;
      setRoot({ ...root! });
      await new Promise(resolve => setTimeout(resolve, 1000 - animationSpeed * 10));
      result.push(node.value);
      
      if (node.left !== null) {
        setCurrentStep(9); // 'if node.left is not null then'
        setCurrentStep(10); // 'queue.enqueue(node.left)'
        
        queue.push(node.left);
      }
      
      if (node.right !== null) {
        setCurrentStep(11); // 'if node.right is not null then'
        setCurrentStep(12); // 'queue.enqueue(node.right)'
        
        queue.push(node.right);
      }
      
      node.highlighted = false;
      setRoot({ ...root! });
    }
  };

  // Create a new tree with random values
  const createRandomTree = () => {
    if (isVisualizing) return;
    
    // Generate random values
    const values = [];
    const count = Math.floor(Math.random() * 8) + 5; // 5-12 nodes
    
    for (let i = 0; i < count; i++) {
      values.push(Math.floor(Math.random() * 100));
    }
    
    // Create new tree
    let newRoot = null;
    for (const value of values) {
      newRoot = insertNode(newRoot, value);
    }
    
    updateNodePositions(newRoot);
    setRoot(newRoot);
    
    toast.info(`Created a new random tree with ${count} nodes`);
  };

  // Render the edges between nodes
  const renderEdges = (node: TreeNode | null): JSX.Element[] => {
    if (node === null) return [];
    
    const edges: JSX.Element[] = [];
    
    if (node.left !== null) {
      edges.push(
        <line
          key={`${node.value}-${node.left.value}`}
          x1={node.x}
          y1={node.y}
          x2={node.left.x}
          y2={node.left.y}
          stroke="#666"
          strokeWidth="2"
        />
      );
      
      edges.push(...renderEdges(node.left));
    }
    
    if (node.right !== null) {
      edges.push(
        <line
          key={`${node.value}-${node.right.value}`}
          x1={node.x}
          y1={node.y}
          x2={node.right.x}
          y2={node.right.y}
          stroke="#666"
          strokeWidth="2"
        />
      );
      
      edges.push(...renderEdges(node.right));
    }
    
    return edges;
  };

  // Render the nodes
  const renderNodes = (node: TreeNode | null): JSX.Element[] => {
    if (node === null) return [];
    
    const nodes: JSX.Element[] = [];
    
    nodes.push(
      <g key={`node-${node.value}`}>
        <circle
          cx={node.x}
          cy={node.y}
          r={NODE_RADIUS}
          fill={node.visited ? '#4CAF50' : node.highlighted ? '#FFC300' : '#4C3AE3'}
          stroke="#333"
          strokeWidth="2"
        />
        <text
          x={node.x}
          y={node.y}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
        >
          {node.value}
        </text>
      </g>
    );
    
    if (node.left !== null) {
      nodes.push(...renderNodes(node.left));
    }
    
    if (node.right !== null) {
      nodes.push(...renderNodes(node.right));
    }
    
    return nodes;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <div className="tree-container border rounded-md overflow-hidden bg-white">
                <svg width="100%" height={SVG_HEIGHT} viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`}>
                  {root && renderEdges(root)}
                  {root && renderNodes(root)}
                </svg>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2 justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={handleOperation}
                    disabled={isVisualizing || inputValue === ''}
                    className="bg-dsa-purple hover:bg-dsa-purple/90"
                  >
                    {operation === 'insert' && 'Insert'}
                    {operation === 'delete' && 'Delete'}
                    {operation === 'search' && 'Search'}
                  </Button>
                  <Button
                    onClick={visualizeTraversal}
                    disabled={isVisualizing || !root}
                    variant="outline"
                  >
                    {traversalType} Traversal
                  </Button>
                  <Button
                    onClick={createRandomTree}
                    disabled={isVisualizing}
                    variant="outline"
                  >
                    Random Tree
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Enter value"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-32"
                    disabled={isVisualizing}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Operation</label>
                <Select
                  value={operation}
                  onValueChange={(value) => setOperation(value as TreeOperationType)}
                  disabled={isVisualizing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Operation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="insert">Insert</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                    <SelectItem value="search">Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
            
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Traversal</label>
                <Select
                  value={traversalType}
                  onValueChange={(value) => setTraversalType(value as TreeTraversalType)}
                  disabled={isVisualizing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Traversal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inorder">In-order</SelectItem>
                    <SelectItem value="preorder">Pre-order</SelectItem>
                    <SelectItem value="postorder">Post-order</SelectItem>
                    <SelectItem value="levelorder">Level-order</SelectItem>
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
              <h4 className="font-medium text-foreground">Binary Search Tree</h4>
              <p className="mt-1">
                A binary search tree (BST) is a binary tree data structure where each node has at most two children, 
                and all nodes to the left are less than the parent, while all nodes to the right are greater.
              </p>
                
              <h4 className="font-medium mt-3 text-foreground">Time Complexity</h4>
              <p className="mt-1">
                {(operation === 'insert' || operation === 'delete' || operation === 'search') && 
                  'Average: O(log n) | Worst: O(n) (unbalanced tree)'}
                {traversalType !== undefined && 'All traversals: O(n) where n is the number of nodes'}
              </p>

              <h4 className="font-medium mt-3 text-foreground">Traversal Types</h4>
              <p className="mt-1">
                <strong>In-order:</strong> Left, Root, Right<br />
                <strong>Pre-order:</strong> Root, Left, Right<br />
                <strong>Post-order:</strong> Left, Right, Root<br />
                <strong>Level-order:</strong> Level by level, left to right
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TreeVisualizer;
