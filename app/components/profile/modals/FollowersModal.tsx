'use client';
import React, { useState, useEffect } from 'react';
import styles from './FollowersModal.module.css';

interface Follower {
  id: string;
  username: string;
  avatar: string;
  displayName: string;
  is_following?: boolean;
  bio?: string;
  category?: string;
  followers_count?: number;
  following_count?: number;
}

interface FollowersModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  userId?: string; // The user ID to fetch followers/following for
  type: 'followers' | 'following'; // Type of modal
  onFollowChange?: () => void; // Callback when follow status changes
}

export default function FollowersModal({ 
  isOpen, 
  onClose, 
  title, 
  userId,
  type,
  onFollowChange 
}: FollowersModalProps) {
  const [users, setUsers] = useState<Follower[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch followers/following data when modal opens
  useEffect(() => {
    if (isOpen && userId) {
      fetchData();
      if (type === 'followers') {
        fetchStats();
      }
    }
  }, [isOpen, userId, type]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/users/${type}?userId=${userId}&limit=100&sortBy=recent`
      );
      const data = await response.json();
      
      if (response.ok) {
        setUsers(data.map((user: any) => ({
          id: user.id,
          username: user.username,
          displayName: user.display_name,
          avatar: user.avatar,
          is_following: user.is_following,
          bio: user.bio,
          category: user.category,
          followers_count: user.followers_count,
          following_count: user.following_count
        })));
      } else {
        setError(data.error || 'Failed to load data');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/users/follower-stats?userId=${userId}`);
      const data = await response.json();
      if (response.ok && data.success) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFollow = async (targetUserId: string) => {
    setLoadingStates(prev => ({ ...prev, [targetUserId]: true }));
    try {
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Update the user's is_following status in the list
        setUsers(prev => prev.map(user => 
          user.id === targetUserId 
            ? { ...user, is_following: true }
            : user
        ));
        
        // Refresh stats if it's followers modal
        if (type === 'followers') {
          fetchStats();
        }
        
        // Notify parent component
        if (onFollowChange) onFollowChange();
      } else {
        console.error('Failed to follow:', data.error);
      }
    } catch (error) {
      console.error('Error following user:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const handleUnfollow = async (targetUserId: string) => {
    setLoadingStates(prev => ({ ...prev, [targetUserId]: true }));
    try {
      const response = await fetch('/api/users/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: targetUserId })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        if (type === 'following') {
          // Remove user from following list
          setUsers(prev => prev.filter(user => user.id !== targetUserId));
        } else {
          // Update is_following status for followers list
          setUsers(prev => prev.map(user => 
            user.id === targetUserId 
              ? { ...user, is_following: false }
              : user
          ));
        }
        
        // Refresh stats
        if (type === 'followers') {
          fetchStats();
        }
        
        // Notify parent component
        if (onFollowChange) onFollowChange();
      } else {
        console.error('Failed to unfollow:', data.error);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [targetUserId]: false }));
    }
  };

  const filteredUsers = users.filter(user => 
    searchTerm === '' || 
    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className={`${styles.modal} ${isOpen ? styles.show : ''}`}>
      <div className={styles['modal-content']}>
        <div className={styles['modal-header']}>
          <h3>{title} ({users.length})</h3>
          <span className={styles['close-modal']} onClick={onClose}>&times;</span>
        </div>

        {/* Stats Section (only for followers) */}
        {type === 'followers' && stats && (
          <div className={styles['stats-section']}>
            <div className={styles['stats-grid']}>
              <div className={styles['stat-card']}>
                <span className={styles['stat-value']}>{stats.followers_count}</span>
                <span className={styles['stat-label']}>Followers</span>
              </div>
              <div className={styles['stat-card']}>
                <span className={styles['stat-value']}>{stats.following_count}</span>
                <span className={styles['stat-label']}>Following</span>
              </div>
              <div className={styles['stat-card']}>
                <span className={styles['stat-value']}>{stats.mutual_count}</span>
                <span className={styles['stat-label']}>Mutual</span>
              </div>
            </div>
          </div>
        )}

        {/* Search Input */}
        {users.length > 10 && (
          <input
            type="text"
            placeholder="Search users..."
            className={styles['search-input']}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}

        {/* Loading State */}
        {loading && (
          <div className={styles['loading-state']}>
            <div className={styles['spinner']}></div>
            <p>Loading {title.toLowerCase()}...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className={styles['error-state']}>
            <p>⚠️ {error}</p>
            <button onClick={fetchData} className={styles['retry-btn']}>
              Retry
            </button>
          </div>
        )}

        {/* User List */}
        {!loading && !error && (
          <>
            {filteredUsers.length === 0 ? (
              <p className={styles['empty-state']}>
                {searchTerm ? 'No users found' : `No ${title.toLowerCase()} yet`}
              </p>
            ) : (
              filteredUsers.map(user => (
                <div key={user.id} className={styles['treasure-item']}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flex: 1 }}>
                    <div className={styles['post-avatar']}>
                      {user.avatar || user.displayName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1 }}>
                      <strong>{user.displayName}</strong>
                      <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>
                        @{user.username}
                      </div>
                      {user.bio && (
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '2px' }}>
                          {user.bio.substring(0, 60)}...
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Follow/Unfollow Button */}
                  {type === 'followers' ? (
                    // For followers list: show follow button if not already following
                    !user.is_following ? (
                      <button
                        className={styles['profile-btn']}
                        onClick={() => handleFollow(user.id)}
                        disabled={loadingStates[user.id]}
                      >
                        {loadingStates[user.id] ? '...' : 'Follow'}
                      </button>
                    ) : (
                      <button
                        className={`${styles['profile-btn']} ${styles.following}`}
                        onClick={() => handleUnfollow(user.id)}
                        disabled={loadingStates[user.id]}
                      >
                        {loadingStates[user.id] ? '...' : 'Following'}
                      </button>
                    )
                  ) : (
                    // For following list: always show unfollow button
                    <button
                      className={`${styles['profile-btn']} ${styles.following}`}
                      onClick={() => handleUnfollow(user.id)}
                      disabled={loadingStates[user.id]}
                    >
                      {loadingStates[user.id] ? '...' : 'Unfollow'}
                    </button>
                  )}
                </div>
              ))
            )}
          </>
        )}
      </div>
    </div>
  );
}