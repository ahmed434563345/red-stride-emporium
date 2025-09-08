import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Send, MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface VendorMessage {
  id: string;
  vendor_profile_id: string;
  subject: string;
  message: string;
  sender_type: 'vendor' | 'admin';
  is_read: boolean;
  created_at: string;
  vendor_profiles: {
    vendor_name: string;
    business_email: string;
  };
}

const AdminVendorChat = () => {
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [messageSubject, setMessageSubject] = useState('');
  const queryClient = useQueryClient();

  // Fetch all vendor messages
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['admin-vendor-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_messages')
        .select(`
          *,
          vendor_profiles:vendor_profile_id(vendor_name, business_email)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as VendorMessage[];
    }
  });

  // Fetch vendors
  const { data: vendors = [] } = useQuery({
    queryKey: ['admin-vendors-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_profiles')
        .select('*')
        .order('vendor_name');
      
      if (error) throw error;
      return data;
    }
  });

  // Group messages by vendor
  const messagesByVendor = messages.reduce((acc, message) => {
    const vendorId = message.vendor_profile_id;
    if (!acc[vendorId]) {
      acc[vendorId] = [];
    }
    acc[vendorId].push(message);
    return acc;
  }, {} as Record<string, VendorMessage[]>);

  // Get unread count for each vendor
  const getUnreadCount = (vendorId: string) => {
    return messagesByVendor[vendorId]?.filter(m => !m.is_read && m.sender_type === 'vendor').length || 0;
  };

  // Send message to vendor
  const sendMessage = async () => {
    if (!selectedVendor || !newMessage.trim() || !messageSubject.trim()) return;

    try {
      const { error } = await supabase
        .from('vendor_messages')
        .insert({
          vendor_profile_id: selectedVendor,
          subject: messageSubject,
          message: newMessage,
          sender_type: 'admin'
        });

      if (error) throw error;

      setNewMessage('');
      setMessageSubject('');
      toast.success('Message sent successfully');
      queryClient.invalidateQueries({ queryKey: ['admin-vendor-messages'] });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    }
  };

  // Mark messages as read when viewing
  useEffect(() => {
    if (selectedVendor && messagesByVendor[selectedVendor]) {
      const unreadMessages = messagesByVendor[selectedVendor].filter(
        m => !m.is_read && m.sender_type === 'vendor'
      );
      
      if (unreadMessages.length > 0) {
        supabase
          .from('vendor_messages')
          .update({ is_read: true })
          .in('id', unreadMessages.map(m => m.id))
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ['admin-vendor-messages'] });
          });
      }
    }
  }, [selectedVendor, messagesByVendor, queryClient]);

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('vendor-messages-admin')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'vendor_messages'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['admin-vendor-messages'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return <div className="flex justify-center p-8">Loading messages...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Vendor List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Vendors ({vendors.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {vendors.map((vendor) => {
              const unreadCount = getUnreadCount(vendor.id);
              const hasMessages = messagesByVendor[vendor.id]?.length > 0;
              
              return (
                <div
                  key={vendor.id}
                  className={`p-4 border-b cursor-pointer hover:bg-muted/50 ${
                    selectedVendor === vendor.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => setSelectedVendor(vendor.id)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{vendor.vendor_name}</h4>
                      <p className="text-sm text-muted-foreground">{vendor.business_email}</p>
                      {hasMessages && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {messagesByVendor[vendor.id][0].subject}
                        </p>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Messages */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>
            {selectedVendor 
              ? `Messages with ${vendors.find(v => v.id === selectedVendor)?.vendor_name}`
              : 'Select a vendor to view messages'
            }
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedVendor ? (
            <div className="space-y-4">
              {/* Messages Display */}
              <ScrollArea className="h-[300px] border rounded-lg p-4">
                <div className="space-y-4">
                  {messagesByVendor[selectedVendor]?.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.sender_type === 'admin'
                          ? 'bg-primary text-primary-foreground ml-8'
                          : 'bg-muted mr-8'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h5 className="font-medium">{message.subject}</h5>
                        <Badge variant={message.sender_type === 'admin' ? 'secondary' : 'outline'}>
                          {message.sender_type === 'admin' ? 'Admin' : 'Vendor'}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{message.message}</p>
                      <p className="text-xs opacity-70">
                        {new Date(message.created_at).toLocaleString()}
                      </p>
                    </div>
                  ))}
                  {!messagesByVendor[selectedVendor]?.length && (
                    <p className="text-center text-muted-foreground">No messages yet</p>
                  )}
                </div>
              </ScrollArea>

              {/* Send Message Form */}
              <div className="space-y-3">
                <Input
                  placeholder="Message subject"
                  value={messageSubject}
                  onChange={(e) => setMessageSubject(e.target.value)}
                />
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim() || !messageSubject.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Select a vendor from the list to start messaging</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminVendorChat;