import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Message {
  id: string;
  subject: string;
  message: string;
  sender_type: 'vendor' | 'admin';
  is_read: boolean;
  created_at: string;
  parent_message_id?: string;
}

interface VendorMessagesProps {
  vendorProfileId: string;
}

const VendorMessages = ({ vendorProfileId }: VendorMessagesProps) => {
  const queryClient = useQueryClient();
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newMessageData, setNewMessageData] = useState({
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const { data: messages, isLoading } = useQuery({
    queryKey: ['vendor-messages', vendorProfileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_messages')
        .select('*')
        .eq('vendor_profile_id', vendorProfileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Message[];
    }
  });

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('vendor_messages')
        .insert({
          vendor_profile_id: vendorProfileId,
          sender_type: 'vendor',
          subject: newMessageData.subject,
          message: newMessageData.message
        });

      if (error) throw error;

      toast.success('Message sent successfully');
      setNewMessageData({ subject: '', message: '' });
      setShowNewMessage(false);
      queryClient.invalidateQueries({ queryKey: ['vendor-messages', vendorProfileId] });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('vendor_messages')
        .update({ is_read: true })
        .eq('id', messageId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['vendor-messages', vendorProfileId] });
    } catch (error: any) {
      toast.error('Failed to mark message as read');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const unreadCount = messages?.filter(m => !m.is_read && m.sender_type === 'admin').length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Messages</h2>
          {unreadCount > 0 && (
            <p className="text-muted-foreground">You have {unreadCount} unread message{unreadCount > 1 ? 's' : ''}</p>
          )}
        </div>
        <Button onClick={() => setShowNewMessage(!showNewMessage)}>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      {showNewMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Send Message to Admin</CardTitle>
            <CardDescription>Contact the platform administrators</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={sendMessage} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject*</Label>
                <Input
                  id="subject"
                  value={newMessageData.subject}
                  onChange={(e) => setNewMessageData(prev => ({ ...prev, subject: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="message">Message*</Label>
                <Textarea
                  id="message"
                  value={newMessageData.message}
                  onChange={(e) => setNewMessageData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={loading}>
                  <Send className="h-4 w-4 mr-2" />
                  {loading ? 'Sending...' : 'Send Message'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowNewMessage(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {!messages || messages.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Messages</CardTitle>
            <CardDescription>Your conversation with the admin will appear here</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`${
                message.sender_type === 'admin' && !message.is_read ? 'border-primary bg-primary/5' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="mt-1">
                      <MessageSquare className={`h-5 w-5 ${
                        message.sender_type === 'admin' ? 'text-blue-600' : 'text-green-600'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm">{message.subject}</h3>
                        <Badge variant={message.sender_type === 'admin' ? 'default' : 'secondary'}>
                          {message.sender_type === 'admin' ? 'Admin' : 'You'}
                        </Badge>
                        {message.sender_type === 'admin' && !message.is_read && (
                          <Badge variant="destructive" className="text-xs">New</Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{message.message}</p>
                      
                      <p className="text-xs text-muted-foreground">
                        {new Date(message.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {message.sender_type === 'admin' && !message.is_read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markAsRead(message.id)}
                    >
                      Mark Read
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorMessages;