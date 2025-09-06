import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, Star, DollarSign, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface Notification {
  id: string;
  type: 'order_placed' | 'product_reviewed' | 'payout_ready' | 'system_message';
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  order_id?: string;
  product_id?: string;
}

interface VendorNotificationsProps {
  vendorProfileId: string;
}

const VendorNotifications = ({ vendorProfileId }: VendorNotificationsProps) => {
  const queryClient = useQueryClient();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ['vendor-notifications', vendorProfileId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('vendor_notifications')
        .select('*')
        .eq('vendor_profile_id', vendorProfileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Notification[];
    }
  });

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('vendor_notifications')
        .update({ is_read: true })
        .eq('id', notificationId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['vendor-notifications', vendorProfileId] });
    } catch (error: any) {
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('vendor_notifications')
        .update({ is_read: true })
        .eq('vendor_profile_id', vendorProfileId)
        .eq('is_read', false);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['vendor-notifications', vendorProfileId] });
      toast.success('All notifications marked as read');
    } catch (error: any) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_placed':
        return <Package className="h-5 w-5 text-green-600" />;
      case 'product_reviewed':
        return <Star className="h-5 w-5 text-yellow-600" />;
      case 'payout_ready':
        return <DollarSign className="h-5 w-5 text-blue-600" />;
      case 'system_message':
        return <MessageSquare className="h-5 w-5 text-purple-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order_placed':
        return 'border-l-green-500';
      case 'product_reviewed':
        return 'border-l-yellow-500';
      case 'payout_ready':
        return 'border-l-blue-500';
      case 'system_message':
        return 'border-l-purple-500';
      default:
        return 'border-l-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const unreadCount = notifications?.filter(n => !n.is_read).length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <p className="text-muted-foreground">You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}</p>
          )}
        </div>
        {unreadCount > 0 && (
          <Button onClick={markAllAsRead} variant="outline">
            Mark All Read
          </Button>
        )}
      </div>

      {!notifications || notifications.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Notifications</CardTitle>
            <CardDescription>You'll see your notifications here when you receive them</CardDescription>
          </CardHeader>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`border-l-4 ${getNotificationColor(notification.type)} ${
                !notification.is_read ? 'bg-muted/50' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-sm">{notification.title}</h3>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        <p className="text-xs text-muted-foreground mt-2">
                          {new Date(notification.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {!notification.is_read && (
                          <Badge variant="default" className="text-xs">New</Badge>
                        )}
                        {!notification.is_read && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => markAsRead(notification.id)}
                          >
                            Mark Read
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorNotifications;