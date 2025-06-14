
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, Send, Users } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  user_id: string;
  sender_type: 'user' | 'admin';
  message: string;
  created_at: string;
  is_read: boolean;
}

interface UserProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
}

const CustomerSupportChat = () => {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const queryClient = useQueryClient();

  // Get all users with messages
  const { data: usersWithMessages = [] } = useQuery({
    queryKey: ['users-with-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          user_id,
          profiles!inner(id, first_name, last_name, email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Get unique users
      const uniqueUsers = data.reduce((acc: any[], curr) => {
        const existingUser = acc.find(u => u.user_id === curr.user_id);
        if (!existingUser) {
          acc.push({
            user_id: curr.user_id,
            profile: curr.profiles
          });
        }
        return acc;
      }, []);
      
      return uniqueUsers;
    }
  });

  // Get messages for selected user
  const { data: messages = [] } = useQuery({
    queryKey: ['chat-messages', selectedUserId],
    queryFn: async () => {
      if (!selectedUserId) return [];
      
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('user_id', selectedUserId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as ChatMessage[];
    },
    enabled: !!selectedUserId
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ userId, message }: { userId: string; message: string }) => {
      const { error } = await supabase
        .from('chat_messages')
        .insert({
          user_id: userId,
          sender_type: 'admin',
          message,
          is_read: false
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      setNewMessage('');
      toast.success('Message sent successfully!');
    },
    onError: (error) => {
      toast.error('Failed to send message: ' + error.message);
    }
  });

  // Mark messages as read
  const markAsReadMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { error } = await supabase
        .from('chat_messages')
        .update({ is_read: true })
        .eq('user_id', userId)
        .eq('sender_type', 'user');
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
    }
  });

  useEffect(() => {
    if (selectedUserId) {
      markAsReadMutation.mutate(selectedUserId);
    }
  }, [selectedUserId]);

  const handleSendMessage = () => {
    if (!selectedUserId || !newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      userId: selectedUserId,
      message: newMessage.trim()
    });
  };

  const getUnreadCount = (userId: string) => {
    return messages.filter(m => m.user_id === userId && m.sender_type === 'user' && !m.is_read).length;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Users List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Conversations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {usersWithMessages.length === 0 ? (
                <p className="text-muted-foreground text-sm">No conversations yet</p>
              ) : (
                usersWithMessages.map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => setSelectedUserId(user.user_id)}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedUserId === user.user_id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          {user.profile.first_name} {user.profile.last_name}
                        </p>
                        <p className="text-xs opacity-70">{user.profile.email}</p>
                      </div>
                      {getUnreadCount(user.user_id) > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {getUnreadCount(user.user_id)}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            {selectedUserId ? 'Customer Chat' : 'Select a conversation'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedUserId ? (
            <div className="flex flex-col h-[500px]">
              {/* Messages */}
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.sender_type === 'admin' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md p-3 rounded-lg ${
                          message.sender_type === 'admin'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.message}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(message.created_at).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your reply..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={sendMessageMutation.isPending}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  className="athletic-gradient"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-[500px] text-muted-foreground">
              <div className="text-center">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a customer conversation to start chatting</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerSupportChat;
