import { useState, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Post, PostWithInteraction, Comment, Review, Notification } from '../types';

export const useSupabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCurrentUser = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    return { user, profile };
  }, []);

  const fetchPosts = useCallback(async (category?: string): Promise<PostWithInteraction[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let query = supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (username, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (category && category !== 'all') {
        query = query.eq('category', category);
      }
      
      const { data: posts, error: postsError } = await query;
      
      if (postsError) throw postsError;
      
      if (!user) {
        return posts?.map(post => ({
          ...post,
          author_name: post.profiles?.full_name || post.profiles?.username,
          author_avatar: post.profiles?.avatar_url,
          is_liked: false,
          is_following: false
        })) || [];
      }
      
      const { data: likedPosts } = await supabase
        .from('likes')
        .select('post_id')
        .eq('user_id', user.id)
        .in('post_id', posts?.map(p => p.id) || []);
      
      const likedSet = new Set(likedPosts?.map(l => l.post_id));
      
      const { data: following } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', user.id);
      
      const followingSet = new Set(following?.map(f => f.following_id));
      
      return posts?.map(post => ({
        ...post,
        author_name: post.profiles?.full_name || post.profiles?.username,
        author_avatar: post.profiles?.avatar_url,
        is_liked: likedSet.has(post.id),
        is_following: followingSet.has(post.author_id)
      })) || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch posts');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createPost = useCallback(async (input: { content: string; link?: string; category: string }) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('username, full_name, avatar_url')
        .eq('id', user.id)
        .single();
      
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          author_id: user.id,
          content: input.content,
          link: input.link || null,
          category: input.category,
          likes_count: 0,
          comments_count: 0
        })
        .select()
        .single();
      
      if (postError) throw postError;
      
      const mentions = input.content.match(/@(\w+)/g) || [];
      const xpGain = 50 + (input.link ? 20 : 0) + (mentions.slice(0, 3).length * 10);
      
      await supabase.rpc('add_xp', { user_id: user.id, xp_amount: xpGain });
      
      // Create notification for mentions
      if (mentions.length > 0) {
        for (const mention of mentions.slice(0, 3)) {
          const mentionedUsername = mention.substring(1);
          const { data: mentionedUser } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', mentionedUsername)
            .single();
          
          if (mentionedUser && mentionedUser.id !== user.id) {
            await supabase
              .from('notifications')
              .insert({
                user_id: mentionedUser.id,
                type: 'mention',
                actor_id: user.id,
                post_id: post.id,
                read: false,
                data: { content: input.content.substring(0, 100) }
              });
          }
        }
      }
      
      return {
        ...post,
        author_name: profile?.full_name || profile?.username || 'User',
        author_avatar: profile?.avatar_url,
        is_liked: false,
        is_following: false
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleLike = useCallback(async (postId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();
      
      if (existingLike) {
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
        
        await supabase.rpc('decrement_post_likes', { post_id: postId });
        
        return { liked: false };
      } else {
        await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });
        
        await supabase.rpc('increment_post_likes', { post_id: postId });
        
        // Check if user already got XP for liking this post
        const { data: alreadyLiked } = await supabase
          .from('user_post_actions')
          .select('id')
          .eq('user_id', user.id)
          .eq('post_id', postId)
          .eq('action', 'like')
          .single();
        
        if (!alreadyLiked) {
          await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 5 });
          await supabase
            .from('user_post_actions')
            .insert({ user_id: user.id, post_id: postId, action: 'like' });
        }
        
        // Create notification for post author
        const { data: post } = await supabase
          .from('posts')
          .select('author_id')
          .eq('id', postId)
          .single();
        
        if (post && post.author_id !== user.id) {
          // Check if we should group this notification
          const { data: recentLike } = await supabase
            .from('notifications')
            .select('id, data')
            .eq('user_id', post.author_id)
            .eq('type', 'like')
            .eq('post_id', postId)
            .eq('read', false)
            .order('created_at', { ascending: false })
            .limit(1)
            .single();
          
          if (recentLike) {
            // Update existing grouped notification
            const currentCount = recentLike.data?.count || 1;
            const currentUsers = recentLike.data?.users || [];
            if (!currentUsers.includes(user.id)) {
              await supabase
                .from('notifications')
                .update({
                  data: {
                    count: currentCount + 1,
                    users: [...currentUsers, user.id],
                    last_actor: user.id
                  }
                })
                .eq('id', recentLike.id);
            }
          } else {
            // Create new notification
            await supabase
              .from('notifications')
              .insert({
                user_id: post.author_id,
                type: 'like',
                actor_id: user.id,
                post_id: postId,
                read: false,
                data: { count: 1, users: [user.id] }
              });
          }
        }
        
        return { liked: true };
      }
    } catch (err) {
      throw err;
    }
  }, []);

  const toggleFollow = useCallback(async (authorId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: existingFollow } = await supabase
        .from('follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', authorId)
        .single();
      
      if (existingFollow) {
        await supabase
          .from('follows')
          .delete()
          .eq('id', existingFollow.id);
        
        return { following: false };
      } else {
        await supabase
          .from('follows')
          .insert({ follower_id: user.id, following_id: authorId });
        
        // Create notification for the user being followed
        if (authorId !== user.id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: authorId,
              type: 'follow',
              actor_id: user.id,
              read: false
            });
        }
        
        return { following: true };
      }
    } catch (err) {
      throw err;
    }
  }, []);

  const fetchComments = useCallback(async (postId: string) => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data: comments, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          profiles:author_id (username, full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (commentsError) throw commentsError;
      
      let likedSet = new Set();
      if (user) {
        const { data: likedComments } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id)
          .in('comment_id', comments?.map(c => c.id) || []);
        
        likedSet = new Set(likedComments?.map(l => l.comment_id));
      }
      
      const commentMap = new Map();
      const rootComments: any[] = [];
      
      comments?.forEach(comment => {
        const commentWithInteraction = {
          ...comment,
          author_name: comment.profiles?.full_name || comment.profiles?.username,
          author_avatar: comment.profiles?.avatar_url,
          is_liked: likedSet.has(comment.id),
          replies: []
        };
        commentMap.set(comment.id, commentWithInteraction);
      });
      
      comments?.forEach(comment => {
        const commentWithInteraction = commentMap.get(comment.id);
        if (comment.parent_id && commentMap.has(comment.parent_id)) {
          commentMap.get(comment.parent_id).replies.push(commentWithInteraction);
        } else if (!comment.parent_id) {
          rootComments.push(commentWithInteraction);
        }
      });
      
      return rootComments;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createComment = useCallback(async (input: { post_id: string; content: string; parent_id?: string | null }) => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .insert({
          post_id: input.post_id,
          author_id: user.id,
          content: input.content,
          parent_id: input.parent_id || null,
          likes_count: 0
        })
        .select(`
          *,
          profiles:author_id (username, full_name, avatar_url)
        `)
        .single();
      
      if (commentError) throw commentError;
      
      await supabase.rpc('increment_post_comments', { post_id: input.post_id });
      
      // Check if user already got XP for commenting on this post
      const { data: alreadyCommented } = await supabase
        .from('user_post_actions')
        .select('id')
        .eq('user_id', user.id)
        .eq('post_id', input.post_id)
        .eq('action', 'comment')
        .single();
      
      if (!alreadyCommented) {
        await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 8 });
        await supabase
          .from('user_post_actions')
          .insert({ user_id: user.id, post_id: input.post_id, action: 'comment' });
      }
      
      // Create notification for post author (if not self-comment)
      const { data: post } = await supabase
        .from('posts')
        .select('author_id')
        .eq('id', input.post_id)
        .single();
      
      if (post && post.author_id !== user.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: post.author_id,
            type: 'comment',
            actor_id: user.id,
            post_id: input.post_id,
            comment_id: comment.id,
            read: false,
            data: { content: input.content.substring(0, 100) }
          });
      }
      
      return {
        ...comment,
        author_name: comment.profiles?.full_name || comment.profiles?.username,
        author_avatar: comment.profiles?.avatar_url,
        is_liked: false,
        replies: []
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create comment');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const likeComment = useCallback(async (commentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: existingLike } = await supabase
        .from('comment_likes')
        .select('id')
        .eq('comment_id', commentId)
        .eq('user_id', user.id)
        .single();
      
      if (existingLike) {
        await supabase
          .from('comment_likes')
          .delete()
          .eq('id', existingLike.id);
        
        await supabase.rpc('decrement_comment_likes', { comment_id: commentId });
        
        return { liked: false };
      } else {
        await supabase
          .from('comment_likes')
          .insert({ comment_id: commentId, user_id: user.id });
        
        await supabase.rpc('increment_comment_likes', { comment_id: commentId });
        
        return { liked: true };
      }
    } catch (err) {
      throw err;
    }
  }, []);

  const sendTip = useCallback(async (recipientId: string, postId: string, amount: number, message?: string) => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: profile } = await supabase
        .from('profiles')
        .select('coins')
        .eq('id', user.id)
        .single();
      
      if (!profile || profile.coins < amount) {
        throw new Error('Insufficient coins');
      }
      
      const { data: tip, error: tipError } = await supabase
        .from('tips')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          post_id: postId,
          amount: amount,
          message: message || null
        })
        .select()
        .single();
      
      if (tipError) throw tipError;
      
      await supabase.rpc('deduct_coins', { user_id: user.id, coin_amount: amount });
      await supabase.rpc('add_coins', { user_id: recipientId, coin_amount: amount });
      
      const xpGain = Math.floor(amount / 10);
      await supabase.rpc('add_xp', { user_id: user.id, xp_amount: xpGain });
      
      // Create notification for tip recipient
      if (recipientId !== user.id) {
        await supabase
          .from('notifications')
          .insert({
            user_id: recipientId,
            type: 'tip',
            actor_id: user.id,
            post_id: postId,
            read: false,
            data: { amount, message: message || null }
          });
      }
      
      return { tip, xpGain };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send tip');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reportContent = useCallback(async (contentType: 'post' | 'comment', contentId: string, reason: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error: reportError } = await supabase
        .from('reports')
        .insert({
          reporter_id: user.id,
          content_type: contentType,
          content_id: contentId,
          reason: reason,
          status: 'pending'
        });
      
      if (reportError) throw reportError;
      
      return true;
    } catch (err) {
      throw err;
    }
  }, []);

  const fetchNotifications = useCallback(async (): Promise<Notification[]> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select(`
          *,
          actor:actor_id (username, full_name, avatar_url)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      
      return notifications?.map(notif => ({
        ...notif,
        actor_name: notif.actor?.full_name || notif.actor?.username,
        actor_avatar: notif.actor?.avatar_url
      })) || [];
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      return [];
    }
  }, []);

  const markNotificationRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      if (error) throw error;
      
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
      console.error('Failed to mark notification as read:', err);
      return false;
    }
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);
      
      if (error) throw error;
      
      // Add XP for marking all as read
      await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 25 });
      
      return true;
    } catch (err) {
      console.error('Failed to mark all notifications read:', err);
      return false;
    }
  }, []);

  const fetchReviews = useCallback(async () => {
    try {
      const { data: reviews, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return reviews?.map(review => ({
        ...review,
        user_name: review.profiles?.full_name || review.profiles?.username,
        user_avatar: review.profiles?.avatar_url
      })) || [];
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      return [];
    }
  }, []);

  const fetchUserReview = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data: review, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      return review || null;
    } catch (err) {
      console.error('Failed to fetch user review:', err);
      return null;
    }
  }, []);

  const createReview = useCallback(async (rating: number, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Check if user already has a review
      const { data: existingReview } = await supabase
        .from('reviews')
        .select('id')
        .eq('user_id', user.id)
        .single();
      
      if (existingReview) {
        throw new Error('You have already submitted a review');
      }
      
      const { data: review, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          rating: rating,
          comment: comment.trim()
        })
        .select()
        .single();
      
      if (error) throw error;
      
      await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 50 });
      await supabase.rpc('add_coins', { user_id: user.id, coin_amount: 10 });
      
      // Check if user already got XP for writing a review
      const { data: alreadyReviewed } = await supabase
        .from('user_actions')
        .select('id')
        .eq('user_id', user.id)
        .eq('action', 'write_review')
        .single();
      
      if (!alreadyReviewed) {
        await supabase
          .from('user_actions')
          .insert({ user_id: user.id, action: 'write_review' });
      }
      
      return review;
    } catch (err) {
      throw err;
    }
  }, []);

  const updateReview = useCallback(async (reviewId: string, rating: number, comment: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: review, error } = await supabase
        .from('reviews')
        .update({
          rating: rating,
          comment: comment.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', reviewId)
        .eq('user_id', user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      return review;
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteReview = useCallback(async (reviewId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      return true;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    getCurrentUser,
    fetchPosts,
    createPost,
    toggleLike,
    toggleFollow,
    fetchComments,
    createComment,
    likeComment,
    sendTip,
    reportContent,
    fetchNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    fetchReviews,
    fetchUserReview,
    createReview,
    updateReview,
    deleteReview
  };
};