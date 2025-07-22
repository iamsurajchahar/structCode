
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// Define searching algorithm types
type SearchingAlgorithmType = 
  'linearSearch' | 
  'binarySearch' | 
  'jumpSearch' |
  'interpolationSearch' |
  'exponentialSearch';

const SearchingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(20);
  const [animationSpeed, setAnimationSpeed] = useState<number>(50);
  const [algorithm, setAlgorithm] = useState<SearchingAlgorithmType>('linearSearch');
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [foundIndex, setFoundIndex] = useState<number>(-1);
  const [pseudoCode, setPseudoCode] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);

  // Generate a new sorted array for searching
  const generateArray = () => {
    const newArray = [];
    const min = 1;
    const max = 100;
    
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * (max - min + 1) + min));
    }
    
    // Sort the array for binary search algorithms
    newArray.sort((a, b) => a - b);
    
    setArray(newArray);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setCurrentStep(-1);
  };

  // Initialize array
  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Set pseudo code for the selected algorithm
  useEffect(() => {
    switch(algorithm) {
      case 'linearSearch':
        setPseudoCode([
          'procedure linearSearch(A: list of items, value: item)',
          '    for i := 0 to length(A)-1 do',
          '        if A[i] = value then',
          '            return i',
          '        end if',
          '    end for',
          '    return -1',
          'end procedure'
        ]);
        break;
      case 'binarySearch':
        setPseudoCode([
          'procedure binarySearch(A: sorted list of items, value: item)',
          '    low := 0',
          '    high := length(A)-1',
          '    while low ≤ high do',
          '        mid := floor((low + high) / 2)',
          '        if A[mid] < value then',
          '            low := mid + 1',
          '        else if A[mid] > value then',
          '            high := mid - 1',
          '        else',
          '            return mid',
          '        end if',
          '    end while',
          '    return -1',
          'end procedure'
        ]);
        break;
      case 'jumpSearch':
        setPseudoCode([
          'procedure jumpSearch(A: sorted list of items, value: item)',
          '    n := length(A)',
          '    step := floor(sqrt(n))',
          '    prev := 0',
          '    while A[min(step, n)-1] < value do',
          '        prev := step',
          '        step := step + floor(sqrt(n))',
          '        if prev ≥ n then',
          '            return -1',
          '        end if',
          '    end while',
          '    while A[prev] < value do',
          '        prev := prev + 1',
          '        if prev = min(step, n) then',
          '            return -1',
          '        end if',
          '    end while',
          '    if A[prev] = value then',
          '        return prev',
          '    end if',
          '    return -1',
          'end procedure'
        ]);
        break;
      case 'interpolationSearch':
        setPseudoCode([
          'procedure interpolationSearch(A: sorted list of items, value: item)',
          '    low := 0',
          '    high := length(A)-1',
          '    while low ≤ high and value ≥ A[low] and value ≤ A[high] do',
          '        if low = high then',
          '            if A[low] = value then',
          '                return low',
          '            end if',
          '            return -1',
          '        end if',
          '        pos := low + floor(((double)(high-low) / (A[high]-A[low])) * (value-A[low]))',
          '        if A[pos] = value then',
          '            return pos',
          '        else if A[pos] < value then',
          '            low := pos + 1',
          '        else',
          '            high := pos - 1',
          '        end if',
          '    end while',
          '    return -1',
          'end procedure'
        ]);
        break;
      case 'exponentialSearch':
        setPseudoCode([
          'procedure exponentialSearch(A: sorted list of items, value: item)',
          '    n := length(A)',
          '    if A[0] = value then',
          '        return 0',
          '    end if',
          '    i := 1',
          '    while i < n and A[i] ≤ value do',
          '        i := i * 2',
          '    end while',
          '    return binarySearch(A, value, i/2, min(i, n-1))',
          'end procedure',
          '',
          'procedure binarySearch(A, value, low, high)',
          '    while low ≤ high do',
          '        mid := floor((low + high) / 2)',
          '        if A[mid] = value then',
          '            return mid',
          '        else if A[mid] < value then',
          '            low := mid + 1',
          '        else',
          '            high := mid - 1',
          '        end if',
          '    end while',
          '    return -1',
          'end procedure'
        ]);
        break;
    }
  }, [algorithm]);

  // Algorithm implementations with visualization
  const linearSearch = async () => {
    setIsSearching(true);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number to search');
      setIsSearching(false);
      return;
    }
    
    setCurrentStep(1); // Start at the first line of the algorithm
    
    for (let i = 0; i < array.length; i++) {
      setCurrentStep(2); // 'for i := 0 to length(A)-1 do'
      
      setCurrentIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed * 10));
      
      setCurrentStep(3); // 'if A[i] = value then'
      
      if (array[i] === value) {
        setCurrentStep(4); // 'return i'
        
        setFoundIndex(i);
        toast.success(`Found ${value} at index ${i}`);
        setIsSearching(false);
        return;
      }
    }
    
    setCurrentStep(7); // 'return -1'
    
    toast.error(`Value ${value} not found in the array`);
    setIsSearching(false);
  };

  const binarySearch = async () => {
    setIsSearching(true);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    
    const value = parseInt(searchValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number to search');
      setIsSearching(false);
      return;
    }
    
    setCurrentStep(1); // Start at the first line of the algorithm
    
    let low = 0;
    setCurrentStep(2); // 'low := 0'
    
    let high = array.length - 1;
    setCurrentStep(3); // 'high := length(A)-1'
    
    while (low <= high) {
      setCurrentStep(4); // 'while low ≤ high do'
      
      let mid = Math.floor((low + high) / 2);
      setCurrentStep(5); // 'mid := floor((low + high) / 2)'
      
      setCurrentIndex(mid);
      await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed * 10));
      
      if (array[mid] < value) {
        setCurrentStep(6); // 'if A[mid] < value then'
        
        low = mid + 1;
        setCurrentStep(7); // 'low := mid + 1'
      } else if (array[mid] > value) {
        setCurrentStep(8); // 'else if A[mid] > value then'
        
        high = mid - 1;
        setCurrentStep(9); // 'high := mid - 1'
      } else {
        setCurrentStep(11); // 'return mid'
        
        setFoundIndex(mid);
        toast.success(`Found ${value} at index ${mid}`);
        setIsSearching(false);
        return;
      }
    }
    
    setCurrentStep(14); // 'return -1'
    
    toast.error(`Value ${value} not found in the array`);
    setIsSearching(false);
  };

  // Start the searching process based on the selected algorithm
  const startSearching = () => {
    if (isSearching) return;
    
    switch(algorithm) {
      case 'linearSearch':
        linearSearch();
        break;
      case 'binarySearch':
        binarySearch();
        break;
      case 'jumpSearch':
      case 'interpolationSearch':
      case 'exponentialSearch':
        toast.info(`${algorithm} will be implemented soon!`);
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col">
              <div className="array-container h-64 flex items-end justify-center gap-1">
                {array.map((value, idx) => (
                  <div
                    key={idx}
                    className="array-bar flex flex-col justify-end items-center"
                    style={{
                      height: '100%',
                      width: `${100 / (arraySize * 1.5)}%`
                    }}
                  >
                    <div
                      style={{
                        height: `${value}%`,
                        width: '100%',
                        backgroundColor: 
                          idx === foundIndex 
                            ? '#4CAF50' // Green for found element
                            : idx === currentIndex
                            ? '#FFC300' // Yellow for current element
                            : '#4C3AE3', // Default purple
                        transition: 'all 0.3s ease'
                      }}
                    />
                    <span className="text-xs mt-1">{value}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex flex-wrap items-center gap-2 justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={generateArray}
                    disabled={isSearching}
                    variant="outline"
                  >
                    Generate New Array
                  </Button>
                </div>
                
                <div className="flex flex-wrap items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Enter value to search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="w-40"
                    disabled={isSearching}
                  />
                  <Button
                    onClick={startSearching}
                    disabled={isSearching || !searchValue}
                    className="bg-dsa-purple hover:bg-dsa-purple/90"
                  >
                    {isSearching ? 'Searching...' : 'Search!'}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Algorithm</label>
                <Select
                  value={algorithm}
                  onValueChange={(value) => setAlgorithm(value as SearchingAlgorithmType)}
                  disabled={isSearching}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linearSearch">Linear Search</SelectItem>
                    <SelectItem value="binarySearch">Binary Search</SelectItem>
                    <SelectItem value="jumpSearch">Jump Search</SelectItem>
                    <SelectItem value="interpolationSearch">Interpolation Search</SelectItem>
                    <SelectItem value="exponentialSearch">Exponential Search</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
            
          <Card>
            <CardContent className="py-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium">Array Size</label>
                  <span className="text-sm text-muted-foreground">{arraySize}</span>
                </div>
                <Slider
                  value={[arraySize]}
                  min={5}
                  max={50}
                  step={1}
                  onValueChange={(values) => setArraySize(values[0])}
                  disabled={isSearching}
                />
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
                  disabled={isSearching}
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
                {algorithm === 'linearSearch' && 'Best: O(1) | Average: O(n) | Worst: O(n)'}
                {algorithm === 'binarySearch' && 'Best: O(1) | Average: O(log n) | Worst: O(log n)'}
                {algorithm === 'jumpSearch' && 'Best: O(1) | Average: O(√n) | Worst: O(√n)'}
                {algorithm === 'interpolationSearch' && 'Best: O(1) | Average: O(log log n) | Worst: O(n)'}
                {algorithm === 'exponentialSearch' && 'Best: O(1) | Average: O(log n) | Worst: O(log n)'}
              </p>
                
              <h4 className="font-medium mt-3 text-foreground">Space Complexity</h4>
              <p className="mt-1">
                {algorithm === 'linearSearch' && 'O(1)'}
                {algorithm === 'binarySearch' && 'O(1)'}
                {algorithm === 'jumpSearch' && 'O(1)'}
                {algorithm === 'interpolationSearch' && 'O(1)'}
                {algorithm === 'exponentialSearch' && 'O(1)'}
              </p>

              <h4 className="font-medium mt-3 text-foreground">Notes</h4>
              <p className="mt-1">
                {algorithm === 'linearSearch' && 'Works on both sorted and unsorted arrays'}
                {algorithm === 'binarySearch' && 'Requires a sorted array'}
                {algorithm === 'jumpSearch' && 'Requires a sorted array, optimal step size is √n'}
                {algorithm === 'interpolationSearch' && 'Requires a sorted array, works best on uniformly distributed data'}
                {algorithm === 'exponentialSearch' && 'Requires a sorted array, useful for unbounded/infinite arrays'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SearchingVisualizer;
