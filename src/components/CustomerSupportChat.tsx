import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Send, Users, Store } from 'lucide-react';
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
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [newVendorMessage, setNewVendorMessage] = useState('');
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

  // Fetch vendors for messaging
  const { data: vendors = [] } = useQuery({
    queryKey: ['admin-vendors-for-chat'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .order('vendor_name');
      
      if (error) throw error;
      return data;
    }
  });

  // Fetch vendor messages
  const { data: vendorMessages = [] } = useQuery({
    queryKey: ['vendor-messages', selectedVendorId],
    queryFn: async () => {
      if (!selectedVendorId) return [];
      
      const { data, error } = await supabase
        .from('vendor_messages')
        .select('*')
        .eq('vendor_profile_id', selectedVendorId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
    enabled: !!selectedVendorId
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

  // Send message to vendor
  const sendVendorMessageMutation = useMutation({
    mutationFn: async ({ vendorId, message }: { vendorId: string; message: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('vendor_messages')
        .insert({
          vendor_profile_id: vendorId,
          admin_user_id: user.id,
          sender_type: 'admin',
          subject: 'Message from Admin',
          message: message
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendor-messages'] });
      setNewVendorMessage('');
      toast.success('Message sent to vendor successfully');
    },
    onError: (error) => {
      console.error('Error sending vendor message:', error);
      toast.error('Failed to send message to vendor');
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

  // Set up real-time subscriptions
  useEffect(() => {
    const chatChannel = supabase
      .channel('chat_messages_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_messages' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
          queryClient.invalidateQueries({ queryKey: ['users-with-messages'] });
        }
      )
      .subscribe();

    const vendorChannel = supabase
      .channel('vendor_messages_realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'vendor_messages' },
        () => {
          queryClient.invalidateQueries({ queryKey: ['vendor-messages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatChannel);
      supabase.removeChannel(vendorChannel);
    };
  }, [queryClient]);

  const handleSendMessage = () => {
    if (!selectedUserId || !newMessage.trim()) return;
    
    sendMessageMutation.mutate({
      userId: selectedUserId,
      message: newMessage.trim()
    });
  };

  const handleSendVendorMessage = async () => {
    if (!newVendorMessage.trim() || !selectedVendorId) return;
    
    sendVendorMessageMutation.mutate({
      vendorId: selectedVendorId,
      message: newVendorMessage.trim()
    });
  };

  const getUnreadCount = (userId: string) => {
    return messages.filter(m => m.user_id === userId && m.sender_type === 'user' && !m.is_read).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Communication Center</h2>
      </div>

      <Tabs defaultValue="customers" className="space-y-4">
        <TabsList>
          <TabsTrigger value="customers">Customer Support</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Communication</TabsTrigger>
        </TabsList>

        <TabsContent value="customers">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Users List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Customer Conversations
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {usersWithMessages.length === 0 ? (
                    <p className="p-4 text-center text-muted-foreground">No conversations yet</p>
                  ) : (
                    <div className="space-y-1">
                      {usersWithMessages.map((user) => {
                        const unreadCount = getUnreadCount(user.user_id);
                        return (
                          <button
                            key={user.user_id}
                            onClick={() => setSelectedUserId(user.user_id)}
                            className={`w-full p-3 text-left hover:bg-muted transition-colors border-b ${
                              selectedUserId === user.user_id ? 'bg-muted' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">
                                  {user.profile.first_name} {user.profile.last_name}
                                </p>
                                <p className="text-sm text-muted-foreground">{user.profile.email}</p>
                              </div>
                              {unreadCount > 0 && (
                                <Badge variant="destructive">{unreadCount}</Badge>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Chat Messages */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedUserId 
                    ? `Chat with ${usersWithMessages.find(u => u.user_id === selectedUserId)?.profile.first_name} ${usersWithMessages.find(u => u.user_id === selectedUserId)?.profile.last_name}`
                    : 'Select a conversation'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {selectedUserId ? (
                  <>
                    <ScrollArea className="h-[400px] p-4">
                      {messages.length === 0 ? (
                        <p className="text-center text-muted-foreground">No messages yet</p>
                      ) : (
                        <div className="space-y-4">
                          {messages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.sender_type === 'admin' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  message.sender_type === 'admin'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p>{message.message}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim() || sendMessageMutation.isPending}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-[450px] flex items-center justify-center text-muted-foreground">
                    Select a customer to start chatting
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Vendors List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  Vendor Communication
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  {vendors.length === 0 ? (
                    <p className="p-4 text-center text-muted-foreground">No vendors found</p>
                  ) : (
                    <div className="space-y-1">
                      {vendors.map((vendor) => (
                        <button
                          key={vendor.id}
                          onClick={() => setSelectedVendorId(vendor.id)}
                          className={`w-full p-3 text-left hover:bg-muted transition-colors border-b ${
                            selectedVendorId === vendor.id ? 'bg-muted' : ''
                          }`}
                        >
                          <div>
                            <p className="font-medium">{vendor.vendor_name}</p>
                            <p className="text-sm text-muted-foreground">{vendor.business_email}</p>
                            <Badge variant={vendor.status === 'approved' ? 'default' : 'destructive'}>
                              {vendor.status}
                            </Badge>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Vendor Messages */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedVendorId 
                    ? `Messages with ${vendors.find(v => v.id === selectedVendorId)?.vendor_name}`
                    : 'Select a vendor to start conversation'
                  }
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {selectedVendorId ? (
                  <>
                    <ScrollArea className="h-[400px] p-4">
                      {vendorMessages.length === 0 ? (
                        <p className="text-center text-muted-foreground">No messages yet</p>
                      ) : (
                        <div className="space-y-4">
                          {vendorMessages.map((message) => (
                            <div
                              key={message.id}
                              className={`flex ${
                                message.sender_type === 'admin' ? 'justify-end' : 'justify-start'
                              }`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  message.sender_type === 'admin'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted'
                                }`}
                              >
                                <p className="font-medium text-sm">{message.subject}</p>
                                <p>{message.message}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {new Date(message.created_at).toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    
                    <div className="p-4 border-t">
                      <div className="flex gap-2">
                        <Input
                          value={newVendorMessage}
                          onChange={(e) => setNewVendorMessage(e.target.value)}
                          placeholder="Type your message to vendor..."
                          onKeyPress={(e) => e.key === 'Enter' && handleSendVendorMessage()}
                        />
                        <Button 
                          onClick={handleSendVendorMessage}
                          disabled={!newVendorMessage.trim() || sendVendorMessageMutation.isPending}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-[450px] flex items-center justify-center text-muted-foreground">
                    Select a vendor to start messaging
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerSupportChat;