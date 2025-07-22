
import React, { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import Editor from '@monaco-editor/react';

// Define default code templates
const codeTemplates = {
  javascript: {
    default: `// Example code
function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        // Swap arr[j] and arr[j + 1]
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
  
  return arr;
}

// Test the function
const unsortedArray = [64, 34, 25, 12, 22, 11, 90];
console.log("Unsorted array:", unsortedArray);
console.log("Sorted array:", bubbleSort([...unsortedArray]));`,
    bfs: `// Breadth-First Search implementation
function bfs(graph, start) {
  const visited = new Set();
  const queue = [start];
  visited.add(start);
  
  while (queue.length > 0) {
    const vertex = queue.shift();
    console.log(vertex); // Process vertex
    
    for (const neighbor of graph[vertex]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
}

// Example usage
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

console.log("BFS traversal starting from vertex A:");
bfs(graph, 'A');`,
    dfs: `// Depth-First Search implementation
function dfs(graph, start, visited = new Set()) {
  console.log(start); // Process vertex
  visited.add(start);
  
  for (const neighbor of graph[start]) {
    if (!visited.has(neighbor)) {
      dfs(graph, neighbor, visited);
    }
  }
}

// Example usage
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

console.log("DFS traversal starting from vertex A:");
dfs(graph, 'A');`,
    sorting: `// Various sorting algorithms
function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]; // ES6 swap
      }
    }
  }
  return arr;
}

function selectionSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]; // ES6 swap
  }
  return arr;
}

function insertionSort(arr) {
  const n = arr.length;
  for (let i = 1; i < n; i++) {
    let key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = key;
  }
  return arr;
}

// Test the functions
const array = [64, 34, 25, 12, 22, 11, 90];
console.log("Original:", array);
console.log("Bubble Sort:", bubbleSort([...array]));
console.log("Selection Sort:", selectionSort([...array]));
console.log("Insertion Sort:", insertionSort([...array]));`
  },
  python: {
    default: `# Example Python code
def bubble_sort(arr):
    n = len(arr)
    
    for i in range(n-1):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    
    return arr

# Test the function
unsorted_array = [64, 34, 25, 12, 22, 11, 90]
print("Unsorted array:", unsorted_array)
print("Sorted array:", bubble_sort(unsorted_array.copy()))`,
    bfs: `# Breadth-First Search implementation
from collections import deque

def bfs(graph, start):
    visited = set()
    queue = deque([start])
    visited.add(start)
    
    while queue:
        vertex = queue.popleft()
        print(vertex)  # Process vertex
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print("BFS traversal starting from vertex A:")
bfs(graph, 'A')`,
    dfs: `# Depth-First Search implementation
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    print(start)  # Process vertex
    visited.add(start)
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            dfs(graph, neighbor, visited)

# Example usage
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

print("DFS traversal starting from vertex A:")
dfs(graph, 'A')`,
    sorting: `# Various sorting algorithms
def bubble_sort(arr):
    n = len(arr)
    for i in range(n-1):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

def selection_sort(arr):
    n = len(arr)
    for i in range(n-1):
        min_idx = i
        for j in range(i+1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        while j >= 0 and key < arr[j]:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    return arr

# Test the functions
array = [64, 34, 25, 12, 22, 11, 90]
print("Original:", array)
print("Bubble Sort:", bubble_sort(array.copy()))
print("Selection Sort:", selection_sort(array.copy()))
print("Insertion Sort:", insertion_sort(array.copy()))`
  },
  java: {
    default: `// Example Java code
import java.util.Arrays;

public class Main {
    static int[] bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // swap arr[j+1] and arr[j]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }
    
    public static void main(String[] args) {
        int[] unsortedArray = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("Unsorted array: " + Arrays.toString(unsortedArray));
        
        int[] sortedArray = bubbleSort(unsortedArray.clone());
        System.out.println("Sorted array: " + Arrays.toString(sortedArray));
    }
}`,
    bfs: `// Breadth-First Search implementation
import java.util.*;

public class Main {
    static void bfs(Map<String, List<String>> graph, String start) {
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        
        visited.add(start);
        queue.add(start);
        
        while (!queue.isEmpty()) {
            String vertex = queue.poll();
            System.out.println(vertex); // Process vertex
            
            for (String neighbor : graph.get(vertex)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
    }
    
    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", Arrays.asList("B", "C"));
        graph.put("B", Arrays.asList("A", "D", "E"));
        graph.put("C", Arrays.asList("A", "F"));
        graph.put("D", Arrays.asList("B"));
        graph.put("E", Arrays.asList("B", "F"));
        graph.put("F", Arrays.asList("C", "E"));
        
        System.out.println("BFS traversal starting from vertex A:");
        bfs(graph, "A");
    }
}`,
    dfs: `// Depth-First Search implementation
import java.util.*;

public class Main {
    static void dfs(Map<String, List<String>> graph, String start, Set<String> visited) {
        System.out.println(start); // Process vertex
        visited.add(start);
        
        for (String neighbor : graph.get(start)) {
            if (!visited.contains(neighbor)) {
                dfs(graph, neighbor, visited);
            }
        }
    }
    
    public static void main(String[] args) {
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", Arrays.asList("B", "C"));
        graph.put("B", Arrays.asList("A", "D", "E"));
        graph.put("C", Arrays.asList("A", "F"));
        graph.put("D", Arrays.asList("B"));
        graph.put("E", Arrays.asList("B", "F"));
        graph.put("F", Arrays.asList("C", "E"));
        
        System.out.println("DFS traversal starting from vertex A:");
        dfs(graph, "A", new HashSet<>());
    }
}`,
    sorting: `// Various sorting algorithms
import java.util.Arrays;

public class Main {
    static int[] bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
        return arr;
    }
    
    static int[] selectionSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            int minIdx = i;
            for (int j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) minIdx = j;
            }
            int temp = arr[minIdx];
            arr[minIdx] = arr[i];
            arr[i] = temp;
        }
        return arr;
    }
    
    static int[] insertionSort(int[] arr) {
        int n = arr.length;
        for (int i = 1; i < n; ++i) {
            int key = arr[i];
            int j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
        return arr;
    }
    
    public static void main(String[] args) {
        int[] array = {64, 34, 25, 12, 22, 11, 90};
        System.out.println("Original: " + Arrays.toString(array));
        System.out.println("Bubble Sort: " + Arrays.toString(bubbleSort(array.clone())));
        System.out.println("Selection Sort: " + Arrays.toString(selectionSort(array.clone())));
        System.out.println("Insertion Sort: " + Arrays.toString(insertionSort(array.clone())));
    }
}`
  },
  cpp: {
    default: `// Example C++ code
#include <iostream>
#include <vector>

std::vector<int> bubbleSort(std::vector<int> arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                // Swap arr[j] and arr[j+1]
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
    return arr;
}

int main() {
    std::vector<int> unsortedArray = {64, 34, 25, 12, 22, 11, 90};
    
    std::cout << "Unsorted array: ";
    for (int num : unsortedArray) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    std::vector<int> sortedArray = bubbleSort(unsortedArray);
    
    std::cout << "Sorted array: ";
    for (int num : sortedArray) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
    
    return 0;
}`,
    bfs: `// Breadth-First Search implementation
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_set>
#include <unordered_map>

void bfs(std::unordered_map<char, std::vector<char>> graph, char start) {
    std::unordered_set<char> visited;
    std::queue<char> queue;
    
    visited.insert(start);
    queue.push(start);
    
    while (!queue.empty()) {
        char vertex = queue.front();
        queue.pop();
        std::cout << vertex << " "; // Process vertex
        
        for (char neighbor : graph[vertex]) {
            if (visited.find(neighbor) == visited.end()) {
                visited.insert(neighbor);
                queue.push(neighbor);
            }
        }
    }
}

int main() {
    std::unordered_map<char, std::vector<char>> graph;
    graph['A'] = {'B', 'C'};
    graph['B'] = {'A', 'D', 'E'};
    graph['C'] = {'A', 'F'};
    graph['D'] = {'B'};
    graph['E'] = {'B', 'F'};
    graph['F'] = {'C', 'E'};
    
    std::cout << "BFS traversal starting from vertex A:\n";
    bfs(graph, 'A');
    std::cout << std::endl;
    
    return 0;
}`,
    dfs: `// Depth-First Search implementation
#include <iostream>
#include <vector>
#include <unordered_set>
#include <unordered_map>

void dfs(std::unordered_map<char, std::vector<char>> graph, char start, 
         std::unordered_set<char>& visited) {
    std::cout << start << " "; // Process vertex
    visited.insert(start);
    
    for (char neighbor : graph[start]) {
        if (visited.find(neighbor) == visited.end()) {
            dfs(graph, neighbor, visited);
        }
    }
}

int main() {
    std::unordered_map<char, std::vector<char>> graph;
    graph['A'] = {'B', 'C'};
    graph['B'] = {'A', 'D', 'E'};
    graph['C'] = {'A', 'F'};
    graph['D'] = {'B'};
    graph['E'] = {'B', 'F'};
    graph['F'] = {'C', 'E'};
    
    std::unordered_set<char> visited;
    
    std::cout << "DFS traversal starting from vertex A:\n";
    dfs(graph, 'A', visited);
    std::cout << std::endl;
    
    return 0;
}`,
    sorting: `// Various sorting algorithms
#include <iostream>
#include <vector>

std::vector<int> bubbleSort(std::vector<int> arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        for (int j = 0; j < n-i-1; j++) {
            if (arr[j] > arr[j+1]) {
                std::swap(arr[j], arr[j+1]);
            }
        }
    }
    return arr;
}

std::vector<int> selectionSort(std::vector<int> arr) {
    int n = arr.size();
    for (int i = 0; i < n-1; i++) {
        int min_idx = i;
        for (int j = i+1; j < n; j++) {
            if (arr[j] < arr[min_idx])
                min_idx = j;
        }
        std::swap(arr[min_idx], arr[i]);
    }
    return arr;
}

std::vector<int> insertionSort(std::vector<int> arr) {
    int n = arr.size();
    for (int i = 1; i < n; i++) {
        int key = arr[i];
        int j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
    }
    return arr;
}

void printArray(const std::vector<int>& arr, const std::string& label) {
    std::cout << label << ": ";
    for (int num : arr) {
        std::cout << num << " ";
    }
    std::cout << std::endl;
}

int main() {
    std::vector<int> array = {64, 34, 25, 12, 22, 11, 90};
    
    printArray(array, "Original");
    printArray(bubbleSort(array), "Bubble Sort");
    printArray(selectionSort(array), "Selection Sort");
    printArray(insertionSort(array), "Insertion Sort");
    
    return 0;
}`
  }
};

const PlaygroundPage = () => {
  const [language, setLanguage] = useState('javascript');
  const [template, setTemplate] = useState('default');
  const [code, setCode] = useState(codeTemplates.javascript.default);
  const [output, setOutput] = useState('// Output will appear here when you run your code');
  const editorRef = useRef(null);

  // Handle language change
  const handleLanguageChange = (value) => {
    setLanguage(value);
    setCode(codeTemplates[value][template] || codeTemplates[value].default);
  };

  // Handle template change
  const handleTemplateChange = (value) => {
    setTemplate(value);
    setCode(codeTemplates[language][value] || codeTemplates[language].default);
  };

  // Handle editor mount
  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  // Execute the code (JavaScript only for now)
  const runCode = () => {
    if (!editorRef.current) return;
    
    const userCode = editorRef.current.getValue();
    
    if (language === 'javascript') {
      // For JavaScript, we can actually run the code
      try {
        // Capture console.log output
        const originalLog = console.log;
        let logs = [];
        
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : arg
          ).join(' '));
        };
        
        // Execute the code
        eval(userCode);
        
        // Restore console.log
        console.log = originalLog;
        
        // Display the captured output
        setOutput(logs.join('\n'));
        
      } catch (error) {
        setOutput(`Error: ${error.message}`);
      }
    } else {
      // For other languages, just simulate execution
      toast.info(`Running ${language} code is simulated. Server-side execution would be needed for actual running.`);
      setOutput(`// ${language.toUpperCase()} code execution simulated\n// This would require a backend service to execute\n\n// Example output for demonstration:`);
      
      // Add some mock output based on the language
      if (language === 'python') {
        setOutput(prev => prev + '\n\nUnsorted array: [64, 34, 25, 12, 22, 11, 90]\nSorted array: [11, 12, 22, 25, 34, 64, 90]');
      } else if (language === 'java') {
        setOutput(prev => prev + '\n\nUnsorted array: [64, 34, 25, 12, 22, 11, 90]\nSorted array: [11, 12, 22, 25, 34, 64, 90]');
      } else if (language === 'cpp') {
        setOutput(prev => prev + '\n\nUnsorted array: 64 34 25 12 22 11 90\nSorted array: 11 12 22 25 34 64 90');
      }
    }
  };

  return (
    <div className="container px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="dsa-heading mb-2">Code Playground</h1>
        <p className="text-lg text-muted-foreground">
          Write, test, and run your code in the browser
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                  <Select value={language} onValueChange={handleLanguageChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="javascript">JavaScript</SelectItem>
                      <SelectItem value="python">Python</SelectItem>
                      <SelectItem value="java">Java</SelectItem>
                      <SelectItem value="cpp">C++</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={template} onValueChange={handleTemplateChange}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="default">Default</SelectItem>
                      <SelectItem value="bfs">BFS Template</SelectItem>
                      <SelectItem value="dfs">DFS Template</SelectItem>
                      <SelectItem value="sorting">Sorting Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  onClick={runCode} 
                  className="bg-dsa-purple hover:bg-dsa-purple/90 animate-pulse-once"
                >
                  Run Code
                </Button>
              </div>
              
              <div className="h-[500px] border rounded-md overflow-hidden">
                <Editor
                  height="100%"
                  language={language}
                  value={code}
                  theme="vs-dark"
                  onChange={(value) => setCode(value)}
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on"
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-5">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-4">Console Output</h3>
              <div className="border rounded-md h-[250px] bg-[#1e1e1e] text-white p-4 font-mono text-sm overflow-auto">
                {output.split('\n').map((line, i) => (
                  <div key={i} className={
                    line.startsWith('Error:') ? 'text-red-400' :
                    line.startsWith('//') ? 'text-gray-400' : 'text-green-400'
                  }>
                    {line}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-medium text-lg mb-4">Problem Description</h3>
              <div className="prose max-w-none">
                <p className="text-sm">
                  <strong>Implement a Bubble Sort Algorithm</strong><br />
                  Write a function that takes an array of integers as input and returns a sorted array using the bubble sort algorithm.
                </p>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium">Example Input:</h4>
                  <pre className="text-xs bg-secondary/40 p-2 rounded-md">[64, 34, 25, 12, 22, 11, 90]</pre>
                </div>
                
                <div className="mt-2">
                  <h4 className="text-sm font-medium">Example Output:</h4>
                  <pre className="text-xs bg-secondary/40 p-2 rounded-md">[11, 12, 22, 25, 34, 64, 90]</pre>
                </div>
                
                <div className="mt-4 text-sm">
                  <h4 className="font-medium">Constraints:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Array length: 1 ≤ n ≤ 1000</li>
                    <li>Array elements: -1000 ≤ elements ≤ 1000</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex justify-end mt-4">
                <Button variant="outline" onClick={() => toast.info('Hint: Look for optimizations in the inner loop')}>
                  Show Hint
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PlaygroundPage;
