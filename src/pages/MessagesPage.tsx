import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Mail, Calendar, User, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  read: boolean;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  // Admin functionality removed
  const isAdmin = false;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to view this page.",
        variant: "destructive",
      });
      navigate('/');
      return;
    }
    
    fetchMessages();
  }, [user, navigate, isAdmin]);

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Add read property if missing in the returned data
      const processedData = (data || []).map(msg => {
        if (msg.read === undefined || msg.read === null) {
          return { ...msg, read: false };
        }
        return msg;
      });
      
      setMessages(processedData);
    } catch (error: any) {
      toast({
        title: "Error fetching messages",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('contact_messages')
        .update({ read: true })
        .eq('id', id);

      if (error) {
        // Special handling for missing column error
        if (error.message?.includes("column \"read\" of relation") || 
            error.message?.includes("does not exist")) {
          console.error("Read column missing:", error.message);
          toast({
            title: "Database setup required",
            description: "The contact_messages table needs to be updated with the SQL script",
            variant: "destructive",
          });
          return;
        }
        throw error;
      }
      
      // Update local state
      setMessages(messages.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      ));
      
      toast({
        title: "Message marked as read",
      });
    } catch (error: any) {
      toast({
        title: "Error updating message",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <div className="container px-4 py-8">
        <div className="text-center">Loading messages...</div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-6 w-6 text-dsa-purple" />
            <h1 className="dsa-heading">Admin Dashboard - Contact Messages</h1>
          </div>
          <Badge variant="secondary" className="text-sm">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </Badge>
        </div>

        {messages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
              <p className="text-muted-foreground">
                Contact form submissions will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id} className={message.read ? "border-opacity-50" : "border-dsa-purple"}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{message.subject}</CardTitle>
                        {!message.read && (
                          <Badge variant="secondary" className="bg-dsa-purple text-white">New</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {message.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {message.email}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(message.created_at)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.message}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      asChild
                    >
                      <a href={`mailto:${message.email}?subject=Re: ${message.subject}`}>
                        Reply via Email
                      </a>
                    </Button>
                    {!message.read && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsRead(message.id)}
                      >
                        Mark as Read
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
