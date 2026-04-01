import { useSupabase } from './useSupabase';
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { PostWithInteraction } from '../types';

export const useFeed = () => {
  const [posts, setPosts] = useState<PostWithInteraction[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    fetchPosts,
    createPost: createPostAPI,
    toggleLike: toggleLikeAPI,
    toggleFollow: toggleFollowAPI,
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

  const toggleLike = useCallback(async (postId: string) => {
    try {
      const { liked } = await toggleLikeAPI(postId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              is_liked: liked, 
              likes_count: post.likes_count + (liked ? 1 : -1) 
            }
          : post
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle like');
    }
  }, [toggleLikeAPI]);

  const toggleFollow = useCallback(async (authorId: string, postId: string) => {
    try {
      const { following } = await toggleFollowAPI(authorId);
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, is_following: following }
          : post
      ));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle follow');
    }
  }, [toggleFollowAPI]);

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
    toggleLike,
    toggleFollow,
    reportPost,
    refreshPosts,
    error
  };
};