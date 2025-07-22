import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

interface AdminProblemManagerProps {
  onProblemsUpdate?: () => void;
}

const AdminProblemManager: React.FC<AdminProblemManagerProps> = ({ onProblemsUpdate }) => {
  const [problems, setProblems] = useState<PracticeProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProblem, setEditingProblem] = useState<PracticeProblem | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'easy' as 'easy' | 'medium' | 'hard',
    category: '',
    starter_code: '',
    solution: '',
    test_cases: ''
  });

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const { data, error } = await supabase
        .from('practice_problems')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProblems(data || []);
      if (onProblemsUpdate) {
        onProblemsUpdate();
      }
    } catch (error) {
      console.error('Error fetching problems:', error);
      toast.error('Failed to load problems');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      difficulty: 'easy',
      category: '',
      starter_code: '',
      solution: '',
      test_cases: ''
    });
  };

  const handleCreateProblem = async () => {
    try {
      let testCasesJson = null;
      if (formData.test_cases.trim()) {
        try {
          testCasesJson = JSON.parse(formData.test_cases);
        } catch (e) {
          toast.error('Invalid JSON format for test cases');
          return;
        }
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('practice_problems')
        .insert([{
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          category: formData.category,
          starter_code: formData.starter_code || null,
          solution: formData.solution || null,
          test_cases: testCasesJson,
          created_by: user?.id || null
        }]);

      if (error) throw error;

      toast.success('Problem created successfully!');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchProblems();
    } catch (error) {
      console.error('Error creating problem:', error);
      toast.error('Failed to create problem');
    }
  };

  const handleUpdateProblem = async () => {
    if (!editingProblem) return;

    try {
      let testCasesJson = null;
      if (formData.test_cases.trim()) {
        try {
          testCasesJson = JSON.parse(formData.test_cases);
        } catch (e) {
          toast.error('Invalid JSON format for test cases');
          return;
        }
      }

      const { error } = await supabase
        .from('practice_problems')
        .update({
          title: formData.title,
          description: formData.description,
          difficulty: formData.difficulty,
          category: formData.category,
          starter_code: formData.starter_code || null,
          solution: formData.solution || null,
          test_cases: testCasesJson,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingProblem.id);

      if (error) throw error;

      toast.success('Problem updated successfully!');
      setIsEditDialogOpen(false);
      setEditingProblem(null);
      resetForm();
      fetchProblems();
    } catch (error) {
      console.error('Error updating problem:', error);
      toast.error('Failed to update problem');
    }
  };

  const handleDeleteProblem = async (problemId: string) => {
    if (!confirm('Are you sure you want to delete this problem?')) return;

    try {
      const { error } = await supabase
        .from('practice_problems')
        .delete()
        .eq('id', problemId);

      if (error) throw error;

      toast.success('Problem deleted successfully!');
      fetchProblems();
    } catch (error) {
      console.error('Error deleting problem:', error);
      toast.error('Failed to delete problem');
    }
  };

  const openEditDialog = (problem: PracticeProblem) => {
    setEditingProblem(problem);
    setFormData({
      title: problem.title,
      description: problem.description,
      difficulty: problem.difficulty,
      category: problem.category,
      starter_code: problem.starter_code || '',
      solution: problem.solution || '',
      test_cases: problem.test_cases ? JSON.stringify(problem.test_cases, null, 2) : ''
    });
    setIsEditDialogOpen(true);
  };

  const getDifficultyBadgeVariant = (difficulty: 'easy' | 'medium' | 'hard') => {
    if (difficulty === 'easy') return 'default';
    if (difficulty === 'medium') return 'secondary';
    return 'destructive';
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading problems...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Practice Problems Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Create Problem
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Problem</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Problem title"
                />
              </div>
              <div>
                <Label>Category</Label>
                <Input
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  placeholder="e.g., Arrays, Trees, Graphs"
                />
              </div>
              <div>
                <Label>Difficulty</Label>
                <Select value={formData.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setFormData({...formData, difficulty: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label>Description</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Problem description"
                  rows={4}
                />
              </div>
              <div>
                <Label>Starter Code</Label>
                <Textarea
                  value={formData.starter_code}
                  onChange={(e) => setFormData({...formData, starter_code: e.target.value})}
                  placeholder="function solution() { // Your code here }"
                  rows={6}
                />
              </div>
              <div>
                <Label>Solution</Label>
                <Textarea
                  value={formData.solution}
                  onChange={(e) => setFormData({...formData, solution: e.target.value})}
                  placeholder="Complete solution code"
                  rows={6}
                />
              </div>
              <div className="col-span-2">
                <Label>Test Cases (JSON)</Label>
                <Textarea
                  value={formData.test_cases}
                  onChange={(e) => setFormData({...formData, test_cases: e.target.value})}
                  placeholder='[{"input": {"nums": [1,2,3]}, "output": 6}]'
                  rows={4}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProblem}>
                Create Problem
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {problems.map((problem) => (
          <Card key={problem.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{problem.title}</CardTitle>
                  <div className="flex gap-2 mt-2">
                    <Badge variant={getDifficultyBadgeVariant(problem.difficulty)}>
                      {problem.difficulty}
                    </Badge>
                    <Badge variant="outline">{problem.category}</Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(problem)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteProblem(problem.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{problem.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Problem</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Problem title"
              />
            </div>
            <div>
              <Label>Category</Label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Arrays, Trees, Graphs"
              />
            </div>
            <div>
              <Label>Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value: 'easy' | 'medium' | 'hard') => setFormData({...formData, difficulty: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Problem description"
                rows={4}
              />
            </div>
            <div>
              <Label>Starter Code</Label>
              <Textarea
                value={formData.starter_code}
                onChange={(e) => setFormData({...formData, starter_code: e.target.value})}
                placeholder="function solution() { // Your code here }"
                rows={6}
              />
            </div>
            <div>
              <Label>Solution</Label>
              <Textarea
                value={formData.solution}
                onChange={(e) => setFormData({...formData, solution: e.target.value})}
                placeholder="Complete solution code"
                rows={6}
              />
            </div>
            <div className="col-span-2">
              <Label>Test Cases (JSON)</Label>
              <Textarea
                value={formData.test_cases}
                onChange={(e) => setFormData({...formData, test_cases: e.target.value})}
                placeholder='[{"input": {"nums": [1,2,3]}, "output": 6}]'
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateProblem}>
              Update Problem
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminProblemManager;
