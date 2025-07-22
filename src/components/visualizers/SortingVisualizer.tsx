
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

// Define sorting algorithm types
type SortingAlgorithmType = 
  'bubbleSort' | 
  'selectionSort' | 
  'insertionSort' | 
  'mergeSort' | 
  'quickSort' |
  'heapSort' |
  'shellSort' |
  'radixSort';

const SortingVisualizer = () => {
  const [array, setArray] = useState<number[]>([]);
  const [arraySize, setArraySize] = useState<number>(30);
  const [animationSpeed, setAnimationSpeed] = useState<number>(50);
  const [algorithm, setAlgorithm] = useState<SortingAlgorithmType>('bubbleSort');
  const [isSorting, setIsSorting] = useState<boolean>(false);
  const [isSorted, setIsSorted] = useState<boolean>(false);
  const [comparingIndices, setComparingIndices] = useState<number[]>([]);
  const [swappingIndices, setSwappingIndices] = useState<number[]>([]);
  const [pseudoCode, setPseudoCode] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);

  // Generate a new random array
  const generateArray = () => {
    const newArray = [];
    const min = 5;
    const max = 100;
    
    for (let i = 0; i < arraySize; i++) {
      newArray.push(Math.floor(Math.random() * (max - min + 1) + min));
    }
    
    setArray(newArray);
    setIsSorted(false);
    setComparingIndices([]);
    setSwappingIndices([]);
    setCurrentStep(-1);
  };

  // Initialize array
  useEffect(() => {
    generateArray();
  }, [arraySize]);

  // Set pseudo code for the selected algorithm
  useEffect(() => {
    switch(algorithm) {
      case 'bubbleSort':
        setPseudoCode([
          'procedure bubbleSort(A: list of sortable items)',
          '    n := length(A)',
          '    repeat',
          '        swapped := false',
          '        for i := 1 to n-1 inclusive do',
          '            if A[i-1] > A[i] then',
          '                swap(A[i-1], A[i])',
          '                swapped := true',
          '            end if',
          '        end for',
          '        n := n - 1',
          '    until not swapped',
          'end procedure'
        ]);
        break;
      case 'selectionSort':
        setPseudoCode([
          'procedure selectionSort(A: list of sortable items)',
          '    n := length(A)',
          '    for i := 0 to n-1 do',
          '        min_idx := i',
          '        for j := i+1 to n do',
          '            if A[j] < A[min_idx] then',
          '                min_idx := j',
          '            end if',
          '        end for',
          '        swap(A[i], A[min_idx])',
          '    end for',
          'end procedure'  
        ]);
        break;
      case 'insertionSort':
        setPseudoCode([
          'procedure insertionSort(A: list of sortable items)',
          '    n := length(A)',
          '    for i := 1 to n-1 do',
          '        j := i',
          '        while j > 0 and A[j-1] > A[j] do',
          '            swap(A[j], A[j-1])',
          '            j := j - 1',
          '        end while',
          '    end for',
          'end procedure'  
        ]);
        break;
      case 'mergeSort':
        setPseudoCode([
          'procedure mergeSort(A: list of sortable items, p, r)',
          '    if p < r then',
          '        q := floor((p + r) / 2)',
          '        mergeSort(A, p, q)',
          '        mergeSort(A, q + 1, r)',
          '        merge(A, p, q, r)',
          '    end if',
          'end procedure',
          '',
          'procedure merge(A, p, q, r)',
          '    // Create temp arrays',
          '    // Copy data to temp arrays',
          '    // Merge the temp arrays back',
          'end procedure'
        ]);
        break;
      case 'quickSort':
        setPseudoCode([
          'procedure quickSort(A: list of sortable items, low, high)',
          '    if low < high then',
          '        pivotIndex := partition(A, low, high)',
          '        quickSort(A, low, pivotIndex - 1)',
          '        quickSort(A, pivotIndex + 1, high)',
          '    end if',
          'end procedure',
          '',
          'procedure partition(A, low, high)',
          '    pivot := A[high]',
          '    i := low - 1',
          '    for j := low to high - 1 do',
          '        if A[j] <= pivot then',
          '            i := i + 1',
          '            swap(A[i], A[j])',
          '        end if',
          '    end for',
          '    swap(A[i + 1], A[high])',
          '    return i + 1',
          'end procedure'  
        ]);
        break;
      case 'heapSort':
        setPseudoCode([
          'procedure heapSort(A: list of sortable items)',
          '    n := length(A)',
          '    // Build max heap',
          '    for i := floor(n/2) down to 0 do',
          '        heapify(A, n, i)',
          '    end for',
          '    // Extract elements from heap one by one',
          '    for i := n-1 down to 0 do',
          '        swap(A[0], A[i])',
          '        heapify(A, i, 0)',
          '    end for',
          'end procedure',
          '',
          'procedure heapify(A, n, i)',
          '    largest := i',
          '    left := 2*i + 1',
          '    right := 2*i + 2',
          '    if left < n and A[left] > A[largest] then',
          '        largest := left',
          '    end if',
          '    if right < n and A[right] > A[largest] then',
          '        largest := right',
          '    end if',
          '    if largest != i then',
          '        swap(A[i], A[largest])',
          '        heapify(A, n, largest)',
          '    end if',
          'end procedure'
        ]);
        break;
      case 'shellSort':
        setPseudoCode([
          'procedure shellSort(A: list of sortable items)',
          '    n := length(A)',
          '    // Start with a big gap, then reduce the gap',
          '    for gap := n/2 down to 1 do',
          '        // Do a gapped insertion sort',
          '        for i := gap to n-1 do',
          '            temp := A[i]',
          '            // Shift earlier gap-sorted elements up',
          '            for j := i down to gap step -gap do',
          '                if A[j-gap] > temp then',
          '                    A[j] := A[j-gap]',
          '                else',
          '                    break',
          '                end if',
          '            end for',
          '            A[j] := temp',
          '        end for',
          '    end for',
          'end procedure'
        ]);
        break;
      case 'radixSort':
        setPseudoCode([
          'procedure radixSort(A: list of sortable items)',
          '    // Find the maximum number to know number of digits',
          '    max := getMax(A)',
          '    // Do counting sort for every digit',
          '    for exp := 1 to max by *10 do',
          '        countingSort(A, exp)',
          '    end for',
          'end procedure',
          '',
          'procedure countingSort(A, exp)',
          '    n := length(A)',
          '    output[n] := new array of size n',
          '    count[10] := new array of size 10 initialized to 0',
          '    // Store count of occurrences in count[]',
          '    for i := 0 to n-1 do',
          '        count[(A[i]/exp)%10] := count[(A[i]/exp)%10] + 1',
          '    end for',
          '    // Change count[i] so that count[i] contains',
          '    // position of digit in output[]',
          '    for i := 1 to 9 do',
          '        count[i] := count[i] + count[i-1]',
          '    end for',
          '    // Build the output array',
          '    for i := n-1 down to 0 do',
          '        output[count[(A[i]/exp)%10] - 1] := A[i]',
          '        count[(A[i]/exp)%10] := count[(A[i]/exp)%10] - 1',
          '    end for',
          '    // Copy the output array to A[]',
          '    for i := 0 to n-1 do',
          '        A[i] := output[i]',
          '    end for',
          'end procedure'
        ]);
        break;
    }
  }, [algorithm]);

  // Algorithm implementations with visualization
  const bubbleSort = async () => {
    setIsSorting(true);
    let sortArray = [...array];
    let n = sortArray.length;
    let swapped;
    
    setCurrentStep(2); // Start at the 'repeat' line
    
    do {
      swapped = false;
      setCurrentStep(3); // 'swapped := false'
      
      for (let i = 1; i < n; i++) {
        setCurrentStep(4); // 'for i := 1 to n-1...'
        
        setComparingIndices([i-1, i]);
        await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed * 10));
        
        setCurrentStep(5); // 'if A[i-1] > A[i]...'
        
        if (sortArray[i-1] > sortArray[i]) {
          setCurrentStep(6); // 'swap(A[i-1], A[i])'
          
          setSwappingIndices([i-1, i]);
          await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed * 10));
          
          // Swap elements
          let temp = sortArray[i-1];
          sortArray[i-1] = sortArray[i];
          sortArray[i] = temp;
          
          // Update the array in state
          setArray([...sortArray]);
          
          setCurrentStep(7); // 'swapped := true'
          swapped = true;
          await new Promise((resolve) => setTimeout(resolve, 500 - animationSpeed * 5));
        }
        
        setSwappingIndices([]);
      }
      
      setCurrentStep(9); // 'n := n - 1'
      n = n - 1;
      
      setCurrentStep(10); // 'until not swapped'
    } while (swapped);
    
    setIsSorting(false);
    setIsSorted(true);
    setComparingIndices([]);
    toast.success('Array sorted successfully!');
  };

  const selectionSort = async () => {
    setIsSorting(true);
    let sortArray = [...array];
    let n = sortArray.length;
    
    setCurrentStep(2); // Start at the first line of the algorithm
    
    for (let i = 0; i < n - 1; i++) {
      setCurrentStep(3); // 'for i := 0 to n-1...'
      
      let minIdx = i;
      setCurrentStep(4); // 'min_idx := i'
      
      for (let j = i + 1; j < n; j++) {
        setCurrentStep(5); // 'for j := i+1 to n...'
        
        setComparingIndices([minIdx, j]);
        await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed * 10));
        
        setCurrentStep(6); // 'if A[j] < A[min_idx]...'
        
        if (sortArray[j] < sortArray[minIdx]) {
          minIdx = j;
          setCurrentStep(7); // 'min_idx := j'
        }
      }
      
      setCurrentStep(9); // 'swap(A[i], A[min_idx])'
      
      // Only swap if needed
      if (minIdx !== i) {
        setSwappingIndices([i, minIdx]);
        await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed * 10));
        
        // Swap elements
        let temp = sortArray[i];
        sortArray[i] = sortArray[minIdx];
        sortArray[minIdx] = temp;
        
        // Update the array in state
        setArray([...sortArray]);
      }
      
      setSwappingIndices([]);
      setComparingIndices([]);
    }
    
    setIsSorting(false);
    setIsSorted(true);
    setComparingIndices([]);
    toast.success('Array sorted successfully!');
  };

  const insertionSort = async () => {
    setIsSorting(true);
    let sortArray = [...array];
    let n = sortArray.length;
    
    setCurrentStep(2); // Start at 'n := length(A)'
    
    for (let i = 1; i < n; i++) {
      setCurrentStep(3); // 'for i := 1 to n-1...'
      
      let j = i;
      setCurrentStep(4); // 'j := i'
      
      while (j > 0 && sortArray[j - 1] > sortArray[j]) {
        setCurrentStep(5); // 'while j > 0 and A[j-1] > A[j]...'
        
        setComparingIndices([j - 1, j]);
        await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed * 10));
        
        setCurrentStep(6); // 'swap(A[j], A[j-1])'
        
        setSwappingIndices([j - 1, j]);
        await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed * 10));
        
        // Swap elements
        let temp = sortArray[j];
        sortArray[j] = sortArray[j - 1];
        sortArray[j - 1] = temp;
        
        // Update the array in state
        setArray([...sortArray]);
        
        j--;
        setCurrentStep(7); // 'j := j - 1'
        
        setSwappingIndices([]);
      }
    }
    
    setIsSorting(false);
    setIsSorted(true);
    setComparingIndices([]);
    toast.success('Array sorted successfully!');
  };

  // Start the sorting process based on the selected algorithm
  const startSorting = () => {
    if (isSorting) return;
    
    switch(algorithm) {
      case 'bubbleSort':
        bubbleSort();
        break;
      case 'selectionSort':
        selectionSort();
        break;
      case 'insertionSort':
        insertionSort();
        break;
      case 'mergeSort':
      case 'quickSort':
      case 'heapSort':
      case 'shellSort':
      case 'radixSort':
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
                    className="array-bar"
                    style={{
                      height: `${value}%`,
                      width: `${100 / (arraySize * 1.5)}%`,
                      backgroundColor: 
                        swappingIndices.includes(idx) 
                          ? '#FF5733' // Red for swapping elements
                          : comparingIndices.includes(idx)
                          ? '#FFC300' // Yellow for comparing elements
                          : '#4C3AE3', // Default purple
                      transition: 'all 0.3s ease'
                    }}
                  ></div>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2 justify-between">
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    onClick={generateArray}
                    disabled={isSorting}
                    variant="outline"
                  >
                    Generate New Array
                  </Button>
                  <Button
                    onClick={startSorting}
                    disabled={isSorting || isSorted}
                    className="bg-dsa-purple hover:bg-dsa-purple/90"
                  >
                    {isSorting ? 'Sorting...' : 'Sort!'}
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
                  onValueChange={(value) => setAlgorithm(value as SortingAlgorithmType)}
                  disabled={isSorting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Algorithm" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bubbleSort">Bubble Sort</SelectItem>
                    <SelectItem value="selectionSort">Selection Sort</SelectItem>
                    <SelectItem value="insertionSort">Insertion Sort</SelectItem>
                    <SelectItem value="mergeSort">Merge Sort</SelectItem>
                    <SelectItem value="quickSort">Quick Sort</SelectItem>
                    <SelectItem value="heapSort">Heap Sort</SelectItem>
                    <SelectItem value="shellSort">Shell Sort</SelectItem>
                    <SelectItem value="radixSort">Radix Sort</SelectItem>
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
                  max={100}
                  step={1}
                  onValueChange={(values) => setArraySize(values[0])}
                  disabled={isSorting}
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
                  disabled={isSorting}
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
                {algorithm === 'bubbleSort' && 'Best: O(n) | Average: O(n²) | Worst: O(n²)'}
                {algorithm === 'selectionSort' && 'Best: O(n²) | Average: O(n²) | Worst: O(n²)'}
                {algorithm === 'insertionSort' && 'Best: O(n) | Average: O(n²) | Worst: O(n²)'}
                {algorithm === 'mergeSort' && 'Best: O(n log n) | Average: O(n log n) | Worst: O(n log n)'}
                {algorithm === 'quickSort' && 'Best: O(n log n) | Average: O(n log n) | Worst: O(n²)'}
                {algorithm === 'heapSort' && 'Best: O(n log n) | Average: O(n log n) | Worst: O(n log n)'}
                {algorithm === 'shellSort' && 'Best: O(n log n) | Average: O(n log n) | Worst: O(n²)'}
                {algorithm === 'radixSort' && 'Best: O(nk) | Average: O(nk) | Worst: O(nk)'}
              </p>
                
              <h4 className="font-medium mt-3 text-foreground">Space Complexity</h4>
              <p className="mt-1">
                {algorithm === 'bubbleSort' && 'O(1)'}
                {algorithm === 'selectionSort' && 'O(1)'}
                {algorithm === 'insertionSort' && 'O(1)'}
                {algorithm === 'mergeSort' && 'O(n)'}
                {algorithm === 'quickSort' && 'O(log n)'}
                {algorithm === 'heapSort' && 'O(1)'}
                {algorithm === 'shellSort' && 'O(1)'}
                {algorithm === 'radixSort' && 'O(n+k)'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SortingVisualizer;
