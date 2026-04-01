// comeunity/app/hooks/useSupabase.ts
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
          profiles:user_id (username, full_name, avatar_url)
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
          author_name: post.profiles?.full_name || post.profiles?.username || 'User',
          author_avatar: post.profiles?.avatar_url,
          is_liked: false,
          is_following: false,
          is_own_post: false
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
        author_name: post.profiles?.full_name || post.profiles?.username || 'User',
        author_avatar: post.profiles?.avatar_url,
        is_liked: likedSet.has(post.id),
        is_following: followingSet.has(post.user_id),
        is_own_post: post.user_id === user.id
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
      
      // Calculate XP and Coins based on category
      const isChallenge = input.category === 'Challenge';
      let xpGain = isChallenge ? 50 : 15;
      let coinGain = isChallenge ? 50 : 5;
      
      // Add link bonus
      if (input.link) {
        xpGain += 20;
        // No coin bonus for link
      }
      
      // Add mention bonus (max 3 mentions)
      const mentions = input.content.match(/@(\w+)/g) || [];
      xpGain += mentions.slice(0, 3).length * 10;
      // No coin bonus for mentions
      
      const { data: post, error: postError } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content: input.content,
          link: input.link || null,
          category: input.category,
          likes_count: 0,
          comments_count: 0
        })
        .select()
        .single();
      
      if (postError) throw postError;
      
      // Award XP and Coins
      await supabase.rpc('add_xp', { user_id: user.id, xp_amount: xpGain });
      await supabase.rpc('add_coins', { user_id: user.id, coin_amount: coinGain });
      
      return {
        ...post,
        author_name: profile?.full_name || profile?.username || 'User',
        author_avatar: profile?.avatar_url,
        is_liked: false,
        is_following: false,
        is_own_post: true
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePost = useCallback(async (postId: string, content: string, link?: string) => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error: updateError } = await supabase
        .from('posts')
        .update({
          content,
          link: link || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', postId)
        .eq('user_id', user.id);
      
      if (updateError) throw updateError;
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)
        .eq('user_id', user.id);
      
      if (deleteError) throw deleteError;
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const toggleLike = useCallback(async (postId: string, isOwnPost: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Don't award XP/coins for liking your own post
      const shouldReward = !isOwnPost;
      
      const { data: existingLike } = await supabase
        .from('likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();
      
      if (existingLike) {
        // Unlike
        await supabase
          .from('likes')
          .delete()
          .eq('id', existingLike.id);
        
        await supabase.rpc('decrement_post_likes', { post_id: postId });
        
        return { liked: false };
      } else {
        // Like
        await supabase
          .from('likes')
          .insert({ post_id: postId, user_id: user.id });
        
        await supabase.rpc('increment_post_likes', { post_id: postId });
        
        // Award XP and Coins only if not liking own post and once per post
        if (shouldReward) {
          const { data: alreadyLiked } = await supabase
            .from('user_post_actions')
            .select('id')
            .eq('user_id', user.id)
            .eq('post_id', postId)
            .eq('action_type', 'like')
            .single();
          
          if (!alreadyLiked) {
            await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 5 });
            await supabase.rpc('add_coins', { user_id: user.id, coin_amount: 2 });
            await supabase
              .from('user_post_actions')
              .insert({ user_id: user.id, post_id: postId, action_type: 'like' });
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
          profiles:user_id (username, full_name, avatar_url)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (commentsError) throw commentsError;
      
      if (!comments || comments.length === 0) {
        return [];
      }
      
      let likedSet = new Set();
      if (user) {
        const { data: likedComments } = await supabase
          .from('comment_likes')
          .select('comment_id')
          .eq('user_id', user.id)
          .in('comment_id', comments.map(c => c.id));
        
        likedSet = new Set(likedComments?.map(l => l.comment_id));
      }
      
      const commentMap = new Map();
      const rootComments: any[] = [];
      
      comments.forEach(comment => {
        const commentWithInteraction = {
          ...comment,
          author_name: comment.profiles?.full_name || comment.profiles?.username || 'User',
          author_avatar: comment.profiles?.avatar_url,
          is_liked: likedSet.has(comment.id),
          replies: []
        };
        commentMap.set(comment.id, commentWithInteraction);
      });
      
      comments.forEach(comment => {
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

  const createComment = useCallback(async (input: { post_id: string; content: string; parent_id?: string | null; is_own_post?: boolean }) => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const { data: comment, error: commentError } = await supabase
        .from('comments')
        .insert({
          post_id: input.post_id,
          user_id: user.id,
          content: input.content,
          parent_id: input.parent_id || null,
          likes_count: 0
        })
        .select(`
          *,
          profiles:user_id (username, full_name, avatar_url)
        `)
        .single();
      
      if (commentError) throw commentError;
      
      await supabase.rpc('increment_post_comments', { post_id: input.post_id });
      
      // Award XP and Coins only if not commenting on own post
      if (!input.is_own_post) {
        const { data: alreadyCommented } = await supabase
          .from('user_post_actions')
          .select('id')
          .eq('user_id', user.id)
          .eq('post_id', input.post_id)
          .eq('action_type', 'comment')
          .single();
        
        if (!alreadyCommented) {
          await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 8 });
          await supabase.rpc('add_coins', { user_id: user.id, coin_amount: 3 });
          await supabase
            .from('user_post_actions')
            .insert({ user_id: user.id, post_id: input.post_id, action_type: 'comment' });
        }
      }
      
      return {
        ...comment,
        author_name: comment.profiles?.full_name || comment.profiles?.username || 'User',
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
      
      // Deduct coins from sender
      await supabase.rpc('deduct_coins', { user_id: user.id, coin_amount: amount });
      
      // Add coins to recipient
      await supabase.rpc('add_coins', { user_id: recipientId, coin_amount: amount });
      
      // XP for sender: 10 XP per tip (once per day? For now, every tip)
      const xpGain = 10;
      await supabase.rpc('add_xp', { user_id: user.id, xp_amount: xpGain });
      
      // XP for recipient: 5 XP per tip received
      await supabase.rpc('add_xp', { user_id: recipientId, xp_amount: 5 });
      
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

  const sharePost = useCallback(async (postId: string, isOwnPost: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // Award XP and Coins only if not sharing own post and once per post
      if (!isOwnPost) {
        const { data: alreadyShared } = await supabase
          .from('user_post_actions')
          .select('id')
          .eq('user_id', user.id)
          .eq('post_id', postId)
          .eq('action_type', 'share')
          .single();
        
        if (!alreadyShared) {
          await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 10 });
          await supabase.rpc('add_coins', { user_id: user.id, coin_amount: 5 });
          await supabase
            .from('user_post_actions')
            .insert({ user_id: user.id, post_id: postId, action_type: 'share' });
        }
      }
      
      return true;
    } catch (err) {
      throw err;
    }
  }, []);

  const treasurePost = useCallback(async (postId: string, isOwnPost: boolean = false) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      // No reward for treasuring your own post
      if (!isOwnPost) {
        await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 10 });
      }
      
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
      
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: alreadyRead } = await supabase
          .from('user_actions')
          .select('id')
          .eq('user_id', user.id)
          .eq('action_type', 'read_notification')
          .single();
        
        if (!alreadyRead) {
          await supabase.rpc('add_xp', { user_id: user.id, xp_amount: 10 });
          await supabase
            .from('user_actions')
            .insert({ user_id: user.id, action_type: 'read_notification' });
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
      
      const { data: alreadyReviewed } = await supabase
        .from('user_actions')
        .select('id')
        .eq('user_id', user.id)
        .eq('action_type', 'write_review')
        .single();
      
      if (!alreadyReviewed) {
        await supabase
          .from('user_actions')
          .insert({ user_id: user.id, action_type: 'write_review' });
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
    updatePost,
    deletePost,
    toggleLike,
    toggleFollow,
    fetchComments,
    createComment,
    likeComment,
    sendTip,
    sharePost,
    treasurePost,
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