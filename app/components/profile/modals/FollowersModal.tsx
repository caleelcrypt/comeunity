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
  followers: Follower[];
  onFollow?: (userId: string) => void;
  onUnfollow?: (userId: string) => void;
  showStats?: boolean;
  searchable?: boolean;
}

export default function FollowersModal({
  isOpen,
  onClose,
  title,
  followers,
  onFollow,
  onUnfollow,
  showStats = false,
  searchable = false
}: FollowersModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [filteredFollowers, setFilteredFollowers] = useState<Follower[]>(followers);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredFollowers(followers);
    } else {
      const filtered = followers.filter(user => 
        user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredFollowers(filtered);
    }
  }, [searchTerm, followers]);

  const handleFollowAction = async (userId: string, isCurrentlyFollowing: boolean = false) => {
    setLoadingStates(prev => ({ ...prev, [userId]: true }));
    try {
      if (isCurrentlyFollowing && onUnfollow) {
        await onUnfollow(userId);
      } else if (onFollow) {
        await onFollow(userId);
      }
    } catch (error) {
      console.error('Error performing follow action:', error);
    } finally {
      setLoadingStates(prev => ({ ...prev, [userId]: false }));
    }
  };

  if (!isOpen) return null;

  const totalCount = followers.length;
  const followingCount = followers.filter(f => f.is_following).length;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.show : ''}`}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>{title} ({totalCount})</h3>
          <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        </div>

        {showStats && totalCount > 0 && (
          <div className={styles.statsSection}>
            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{totalCount}</div>
                <div className={styles.statLabel}>Total</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statValue}>{followingCount}</div>
                <div className={styles.statLabel}>Following You</div>
              </div>
            </div>
          </div>
        )}

        {searchable && followers.length > 5 && (
          <input
            type="text"
            placeholder="Search users..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        )}
        
        {filteredFollowers.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-users"></i>
            <p>{searchTerm ? 'No users found' : `No ${title.toLowerCase()} yet`}</p>
          </div>
        ) : (
          <div className={styles.followersList}>
            {filteredFollowers.map(user => (
              <div key={user.id} className={styles.followerItem}>
                <div className={styles.followerInfo}>
                  <div className={styles.avatar}>
                    {user.avatar || user.displayName?.charAt(0)?.toUpperCase() || '👤'}
                  </div>
                  <div className={styles.userInfo}>
                    <div className={styles.displayName}>{user.displayName}</div>
                    <div className={styles.username}>@{user.username}</div>
                    {user.bio && (
                      <div className={styles.bio}>{user.bio.substring(0, 60)}...</div>
                    )}
                  </div>
                </div>
                {(onFollow || onUnfollow) && (
                  <button
                    className={`${styles.followBtn} ${user.is_following ? styles.following : ''}`}
                    onClick={() => handleFollowAction(user.id, user.is_following)}
                    disabled={loadingStates[user.id]}
                  >
                    {loadingStates[user.id] ? (
                      <i className="fas fa-spinner fa-spin"></i>
                    ) : user.is_following ? (
                      'Following'
                    ) : (
                      'Follow'
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}