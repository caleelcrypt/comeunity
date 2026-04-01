import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Notification } from '../types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setNotifications([]);
        setUnreadCount(0);
        return [];
      }
      
      const { data: notificationsData, error: notificationsError } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:actor_id (username, full_name, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (notificationsError) throw notificationsError;
      
      const formattedNotifications = notificationsData?.map(notif => ({
        ...notif,
        actor_name: notif.actor?.full_name || notif.actor?.username,
        actor_avatar: notif.actor?.avatar_url
      })) || [];
      
      setNotifications(formattedNotifications);
      
      const unread = formattedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
      return formattedNotifications;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark single notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (updateError) throw updateError;
      
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Add XP for reading notification (first time only)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: alreadyRead } = await supabase
          .from('user_actions')
          .select('id')
          .eq('user_id', user.id)
          .eq('action', 'read_notification')
          .single();
        
        if (!alreadyRead) {
          await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 10 });
          await supabase
            .from('user_actions')
            .insert({ user_id: user.id, action: 'read_notification' });
        }
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
      return false;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;
      
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (updateError) throw updateError;
      
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      
      // Add XP for marking all as read
      await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 25 });
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all as read');
      return false;
    }
  }, []);

  // Create a new notification
  const createNotification = useCallback(async (
    userId: string,
    type: string,
    actorId: string,
    postId?: string | null,
    commentId?: string | null,
    data?: any
  ) => {
    try {
      const { error: insertError } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type,
          actor_id: actorId,
          post_id: postId || null,
          comment_id: commentId || null,
          data: data || null,
          read: false
        });
      
      if (insertError) throw insertError;
      
      return true;
    } catch (err) {
      console.error('Failed to create notification:', err);
      return false;
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId);
      
      if (deleteError) throw deleteError;
      
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
      return false;
    }
  }, []);

  // Subscribe to real-time notifications
  useEffect(() => {
    const subscribeToNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          async (payload) => {
            // Fetch the full notification with actor details
            const { data: newNotif } = await supabase
              .from('notifications')
              .select(`
                *,
                actor:actor_id (username, full_name, avatar_url)
              `)
              .eq('id', payload.new.id)
              .single();
            
            if (newNotif) {
              const formattedNotif = {
                ...newNotif,
                actor_name: newNotif.actor?.full_name || newNotif.actor?.username,
                actor_avatar: newNotif.actor?.avatar_url
              };
              
              setNotifications(prev => [formattedNotif, ...prev]);
              setUnreadCount(prev => prev + 1);
            }
          }
        )
        .subscribe();
      
      return () => {
        subscription.unsubscribe();
      };
    };
    
    subscribeToNotifications();
  }, []);

  return {
    notifications,
    loading,
    unreadCount,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    createNotification,
    deleteNotification
  };
};