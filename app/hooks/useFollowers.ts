// hooks/useFollowers.ts
import { useState, useCallback } from 'react';

export function useFollowers(userId: string) {
  const [followers, setFollowers] = useState<any[]>([]);
  const [following, setFollowing] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFollowers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/followers?userId=${userId}&limit=100`);
      const data = await response.json();
      setFollowers(data);
    } catch (error) {
      console.error('Error fetching followers:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const fetchFollowing = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/users/following?userId=${userId}&limit=100`);
      const data = await response.json();
      setFollowing(data);
    } catch (error) {
      console.error('Error fetching following:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const followUser = useCallback(async (targetUserId: string) => {
    try {
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error following user:', error);
      return false;
    }
  }, []);

  const unfollowUser = useCallback(async (targetUserId: string) => {
    try {
      const response = await fetch('/api/users/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId })
      });
      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      return false;
    }
  }, []);

  return {
    followers,
    following,
    loading,
    fetchFollowers,
    fetchFollowing,
    followUser,
    unfollowUser
  };
}