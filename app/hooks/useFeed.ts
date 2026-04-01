// comeunity/app/hooks/useFeed.ts
import { useState, useEffect, useCallback } from 'react';
import { useSupabase } from './useSupabase';
import { PostWithInteraction } from '../types';
import { useToast } from './useToast';

export const useFeed = () => {
  const [posts, setPosts] = useState<PostWithInteraction[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  
  const {
    fetchPosts,
    createPost: createPostAPI,
    updatePost: updatePostAPI,
    deletePost: deletePostAPI,
    toggleLike: toggleLikeAPI,
    toggleFollow: toggleFollowAPI,
    sharePost: sharePostAPI,
    treasurePost: treasurePostAPI,
    reportContent: reportContentAPI,
    loading: apiLoading
  } = useSupabase();

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const fetchedPosts = await fetchPosts(filter === 'all' ? undefined : filter);
    setPosts(fetchedPosts);
    setLoading(false);
  }, [fetchPosts, filter]);

  const refreshPosts = useCallback(async () => {
    setRefreshing(true);
    const fetchedPosts = await fetchPosts(filter === 'all' ? undefined : filter);
    setPosts(fetchedPosts);
    setRefreshing(false);
  }, [fetchPosts, filter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  const createPost = useCallback(async (content: string, link: string | undefined, category: string) => {
    try {
      const newPost = await createPostAPI({ content, link, category });
      setPosts(prev => [newPost, ...prev]);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      return false;
    }
  }, [createPostAPI]);

  const updatePost = useCallback(async (postId: string, content: string, link?: string) => {
    try {
      await updatePostAPI(postId, content, link);
      // Update the post in the local state
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, content, link: link || null, updated_at: new Date().toISOString() }
          : post
      ));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      return false;
    }
  }, [updatePostAPI]);

  const deletePost = useCallback(async (postId: string) => {
    try {
      await deletePostAPI(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      return false;
    }
  }, [deletePostAPI]);

  const toggleLike = useCallback(async (postId: string, isOwnPost: boolean = false) => {
    try {
      const { liked } = await toggleLikeAPI(postId, isOwnPost);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: liked, 
              likes_count: post.likes_count + (liked ? 1 : -1) 
            }
          : post
      ));
      if (liked && !isOwnPost) {
        showToast('❤️ Liked! +5 XP +2 Coins', 'xp');
      } else if (liked) {
        showToast('❤️ Liked!', 'info');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like');
    }
  }, [toggleLikeAPI, showToast]);

  const toggleFollow = useCallback(async (authorId: string, postId: string) => {
    try {
      const { following } = await toggleFollowAPI(authorId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_following: following }
          : post
      ));
      showToast(following ? `✅ Following` : `👋 Unfollowed`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle follow');
    }
  }, [toggleFollowAPI, showToast]);

  const sharePost = useCallback(async (postId: string, isOwnPost: boolean = false) => {
    try {
      await sharePostAPI(postId, isOwnPost);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to share post');
      return false;
    }
  }, [sharePostAPI]);

  const treasurePost = useCallback(async (postId: string) => {
    try {
      await treasurePostAPI(postId);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to treasure post');
      return false;
    }
  }, [treasurePostAPI]);

  const reportPost = useCallback(async (postId: string, reason: string) => {
    try {
      await reportContentAPI('post', postId, reason);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit report');
      return false;
    }
  }, [reportContentAPI]);

  return {
    posts,
    loading: loading || apiLoading,
    refreshing,
    filter,
    setFilter,
    createPost,
    updatePost,
    deletePost,
    toggleLike,
    toggleFollow,
    sharePost,
    treasurePost,
    reportPost,
    refreshPosts,
    error
  };
};