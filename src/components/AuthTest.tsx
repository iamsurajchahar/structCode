import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { checkUserExists } from '@/integrations/supabase/rpcTypes';
import { toast } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AuthTest = () => {
  const { user, session, loading, debugSession } = useAuth();
  const [testEmail, setTestEmail] = useState('');
  const [testResult, setTestResult] = useState<any>(null);

  const testUserExists = async () => {
    if (!testEmail) {
      toast.error('Please enter an email to test');
      return;
    }

    try {
      const result = await checkUserExists(testEmail);
      setTestResult(result);
      toast.success('User existence check completed');
    } catch (error) {
      console.error('Test error:', error);
      toast.error('Test failed');
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-background">
      <h3 className="text-lg font-semibold mb-4">Authentication Test</h3>
      
      <div className="space-y-4">
        <div>
          <p><strong>Current User:</strong> {user?.email || 'None'}</p>
          <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
          <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        </div>

        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Enter email to test"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
          />
          <Button onClick={testUserExists} size="sm">
            Test User Exists
          </Button>
        </div>

        {testResult && (
          <div className="p-2 bg-muted rounded">
            <pre className="text-xs">{JSON.stringify(testResult, null, 2)}</pre>
          </div>
        )}

        <Button onClick={debugSession} size="sm" variant="outline">
          Debug Session
        </Button>
      </div>
    </div>
  );
};

export default AuthTest; 