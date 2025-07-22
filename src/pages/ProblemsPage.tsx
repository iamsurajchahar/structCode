import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Settings } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import CodeEditor from '@/components/CodeEditor';

import { useNavigate } from 'react-router-dom';

interface PracticeProblem {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  starter_code: string | null;
  solution: string | null;
  test_cases: any;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

interface UserSubmission {
  id: string;
  problem_id: string;
  status: 'solved' | 'attempted';
  code: string;
  user_id: string;
  created_at: string;
}

const ProblemsPage = () => {
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<PracticeProblem[]>([]);
  const [submissions, setSubmissions] = useState<UserSubmission[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<PracticeProblem | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [output, setOutput] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Load problems immediately on component mount
  useEffect(() => {
    const loadProblems = async () => {
      setLoading(true);
      
      // Set a timeout to prevent infinite loading
      const timeoutId = setTimeout(() => {
        console.log("Loading timeout - using hardcoded problems");
        const fallbackProblems = getHardcodedProblems();
        setProblems(fallbackProblems);
        setFilteredProblems(fallbackProblems);
        setLoading(false);
      }, 5000); // 5 second timeout
      
      try {
        // Always start with hardcoded problems for immediate display
        const hardcodedProblems = getHardcodedProblems();
        setProblems(hardcodedProblems);
        setFilteredProblems(hardcodedProblems);
        setLoading(false); // Stop loading immediately after showing hardcoded problems
        clearTimeout(timeoutId); // Clear timeout since we loaded successfully
        
        // If user is logged in, try to fetch from database in background
        if (user) {
          console.log("User logged in - fetching problems from database");
          const { data, error } = await supabase
            .from('practice_problems')
            .select('id, title, description, difficulty, category, starter_code, solution, test_cases, created_at, updated_at, created_by')
            .order('created_at', { ascending: true })
            .limit(20);

          if (!error && data && data.length > 0) {
            console.log("Database problems loaded:", data.length);
            const problemsData = data as unknown as PracticeProblem[];
            setProblems(problemsData);
            setFilteredProblems(problemsData);
          } else {
            console.log("Using hardcoded problems (database empty or error)");
          }
        } else {
          console.log("No user logged in - using hardcoded problems");
        }
      } catch (error) {
        console.error('Error loading problems:', error);
        // Ensure hardcoded problems are set as fallback
        const fallbackProblems = getHardcodedProblems();
        setProblems(fallbackProblems);
        setFilteredProblems(fallbackProblems);
        setLoading(false);
        clearTimeout(timeoutId);
      }
    };
    
    loadProblems();
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchSubmissions();
    }
  }, [user]);
  
  // Debug effect to verify problems are being loaded
  useEffect(() => {
    console.log("Current problems:", problems.length);
    console.log("Current filtered problems:", filteredProblems.length);
    console.log("Loading state:", loading);
    console.log("User state:", user ? "logged in" : "not logged in");
  }, [problems, filteredProblems, loading, user]);

  useEffect(() => {
    filterProblems();
  }, [problems, selectedDifficulty, selectedCategory]);





  const fetchSubmissions = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('user_submissions')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;
      setSubmissions(data as UserSubmission[] || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const filterProblems = () => {
    let filtered = problems;

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(problem => problem.difficulty === selectedDifficulty);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(problem => problem.category === selectedCategory);
    }

    setFilteredProblems(filtered);
  };

  const getSubmissionStatus = (problemId: string) => {
    const submission = submissions.find(s => s.problem_id === problemId);
    return submission?.status || null;
  };

  const getDifficultyBadgeVariant = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (difficulty === 'easy') return 'default';
    if (difficulty === 'medium') return 'secondary';
    return 'destructive';
  };

  const selectProblem = (problem: PracticeProblem) => {
    setSelectedProblem(problem);
    setUserCode(problem.starter_code || '// Write your solution here');
    setOutput('');
  };

  const runCode = async () => {
    if (!selectedProblem || !userCode.trim()) {
      toast.error('Please write some code first');
      return;
    }

    // Allow non-logged in users to run code, just not save progress
    if (!user) {
      toast.info('Sign in to save your progress!');
      // Continue execution without returning
    }

    setIsRunning(true);
    
    try {
      // Simple JavaScript evaluation for demonstration
      const testCases = selectedProblem.test_cases || [];
      let results = [];
      
      try {
        // Create a function from the user's code
        const userFunction = new Function('return ' + userCode)();
        
        for (const testCase of testCases) {
          try {
            const result = userFunction(testCase.input);
            const passed = JSON.stringify(result) === JSON.stringify(testCase.output);
            results.push({
              input: testCase.input,
              expected: testCase.output,
              actual: result,
              passed
            });
          } catch (error) {
            results.push({
              input: testCase.input,
              expected: testCase.output,
              actual: `Error: ${error.message}`,
              passed: false
            });
          }
        }
      } catch (error) {
        setOutput(`Syntax Error: ${error.message}`);
        toast.error('Code has syntax errors');
        setIsRunning(false);
        return;
      }
      
      const allPassed = results.every(r => r.passed);
      const outputText = results.map(r => 
        `Input: ${JSON.stringify(r.input)}\nExpected: ${JSON.stringify(r.expected)}\nActual: ${JSON.stringify(r.actual)}\nPassed: ${r.passed ? '✅' : '❌'}`
      ).join('\n\n');
      
      setOutput(outputText);
      
      if (allPassed) {
        toast.success('All test cases passed!');
        if (user) saveSubmission('solved');
      } else {
        toast.warning('Some test cases failed');
        if (user) {
          saveSubmission('attempted');
        }
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      toast.error('Code execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const saveSubmission = async (status: 'solved' | 'attempted') => {
    if (!user || !selectedProblem) return;

    try {
      const { error } = await supabase
        .from('user_submissions')
        .upsert({
          user_id: user.id,
          problem_id: selectedProblem.id,
          code: userCode,
          status: status
        }, {
          onConflict: 'user_id,problem_id'
        });

      if (error) throw error;
      fetchSubmissions();
    } catch (error) {
      console.error('Error saving submission:', error);
    }
  };

  const getUniqueCategories = () => {
    const categories = problems.map(p => p.category);
    return [...new Set(categories)];
  };

  // Provides hardcoded problems as a fallback
  const getHardcodedProblems = (): PracticeProblem[] => {
    console.log("Using hardcoded problems");
    return [
      {
        id: "1",
        title: "Two Sum",
        description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
        difficulty: "easy",
        category: "Arrays",
        starter_code: "function twoSum(nums, target) {\n  // Your code here\n}",
        solution: "function twoSum(nums, target) {\n  const map = {};\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map[complement] !== undefined) {\n      return [map[complement], i];\n    }\n    map[nums[i]] = i;\n  }\n  return [];\n}",
        test_cases: [
          { input: [[2, 7, 11, 15], 9], output: [0, 1] },
          { input: [[3, 2, 4], 6], output: [1, 2] }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null
      },
      {
        id: "2",
        title: "Palindrome Number",
        description: "Given an integer x, return true if x is a palindrome, and false otherwise.",
        difficulty: "easy",
        category: "Math",
        starter_code: "function isPalindrome(x) {\n  // Your code here\n}",
        solution: "function isPalindrome(x) {\n  if (x < 0) return false;\n  const str = x.toString();\n  return str === str.split('').reverse().join('');\n}",
        test_cases: [
          { input: [121], output: true },
          { input: [-121], output: false },
          { input: [10], output: false }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null
      },
      {
        id: "3",
        title: "Merge Two Sorted Lists",
        description: "Merge two sorted linked lists and return it as a sorted list.",
        difficulty: "medium",
        category: "Linked Lists",
        starter_code: "function mergeTwoLists(l1, l2) {\n  // Your code here\n}",
        solution: "function mergeTwoLists(l1, l2) {\n  if (!l1) return l2;\n  if (!l2) return l1;\n  \n  if (l1.val < l2.val) {\n    l1.next = mergeTwoLists(l1.next, l2);\n    return l1;\n  } else {\n    l2.next = mergeTwoLists(l1, l2.next);\n    return l2;\n  }\n}",
        test_cases: [
          { input: [[1,2,4], [1,3,4]], output: [1,1,2,3,4,4] }
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: null
      }
    ];
  };



  if (selectedProblem) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            onClick={() => setSelectedProblem(null)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Problems
          </Button>
          <h1 className="text-3xl font-bold">{selectedProblem.title}</h1>
          <div className="flex gap-2 mt-2">
            <Badge variant={getDifficultyBadgeVariant(selectedProblem.difficulty)}>
              {selectedProblem.difficulty}
            </Badge>
            <Badge variant="outline">{selectedProblem.category}</Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Problem Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap">{selectedProblem.description}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Code Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeEditor
                  value={userCode}
                  onChange={setUserCode}
                  language="javascript"
                  height="300px"
                />
                <div className="mt-4 flex gap-2">
                  <Button 
                    onClick={runCode} 
                    disabled={isRunning}
                    className="bg-dsa-purple hover:bg-dsa-purple/90"
                  >
                    {isRunning ? 'Running...' : 'Run Code'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {output && (
              <Card>
                <CardHeader>
                  <CardTitle>Output</CardTitle>
                </CardHeader>
                <CardContent>
                  <pre className="whitespace-pre-wrap text-sm bg-secondary p-4 rounded">{output}</pre>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Practice Problems</h1>
          <p className="text-muted-foreground">
            Solve coding challenges and improve your skills
          </p>
        </div>

      </div>

      {!user && (
        <Card className="mb-8 bg-muted/50 border-dsa-purple/20">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-medium">Sample Problems</h3>
                <p className="text-muted-foreground">
                  You're viewing sample practice problems. Sign in to access the full collection!
                </p>
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="whitespace-nowrap"
                  onClick={() => navigate('/auth')}
                >
                  Sign In
                </Button>
                <Button 
                  className="whitespace-nowrap bg-dsa-purple hover:bg-dsa-purple/90"
                  onClick={() => navigate('/auth')}
                >
                  Create Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-dsa-purple border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="mt-4 text-lg">Loading problems...</p>
          </div>
        </div>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="all">All Categories</option>
                {getUniqueCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Debug info */}
          <p className="text-xs text-muted-foreground mb-4">
            {problems.length > 0 ? `Loaded ${problems.length} problems (${filteredProblems.length} filtered)` : "No problems loaded"}
          </p>

          {filteredProblems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProblems.map((problem, index) => {
                const status = getSubmissionStatus(problem.id);
                return (
                  <Card 
                    key={problem.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => selectProblem(problem)}
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{problem.title}</CardTitle>
                        {status && (
                          <Badge variant={status === 'solved' ? 'default' : 'secondary'}>
                            {status === 'solved' ? '✅ Solved' : '⏳ Attempted'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={getDifficultyBadgeVariant(problem.difficulty)}>
                          {problem.difficulty}
                        </Badge>
                        <Badge variant="outline">{problem.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {problem.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No problems found matching your filters.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProblemsPage;
