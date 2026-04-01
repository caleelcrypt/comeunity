'use client';
import React from 'react';
import styles from './FeedHeader.module.css';

interface FeedHeaderProps {
  onMenuClick: () => void;
  onSearchClick: () => void;
  onNotificationClick: () => void;
  notificationCount?: number;
  userAvatar?: string | null;
  username?: string;
  userXp?: number;
  userLevel?: number;
  showUserProfile?: boolean;
}

export const FeedHeader: React.FC<FeedHeaderProps> = ({
  onMenuClick,
  onSearchClick,
  onNotificationClick,
  notificationCount = 0,
  userAvatar,
  username,
  userXp = 0,
  userLevel = 1,
  showUserProfile = true
}) => {
  return (
    <header className={styles.feedHeader}>
      <div className={styles.headerContent}>
        <div className={styles.leftGroup}>
          <div className={styles.menuIcon} onClick={onMenuClick}>
            <i className="fas fa-bars"></i>
          </div>
          <div className={styles.logo}>
            <span>COME</span>
            <span>UNITY</span>
          </div>
        </div>
        
        <div className={styles.headerActions}>
          <div className={styles.headerIcon} onClick={onSearchClick}>
            <i className="fas fa-search"></i>
          </div>
          <div className={styles.headerIcon} onClick={onNotificationClick}>
            <i className="far fa-bell"></i>
            {notificationCount > 0 && (
              <span className={styles.notificationBadge}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </div>
          
          {showUserProfile && (
            <div className={styles.userMiniProfile} onClick={onMenuClick}>
              {userAvatar ? (
                <img src={userAvatar} alt={username} className={styles.userMiniAvatar} />
              ) : (
                <div className={styles.userMiniAvatarPlaceholder}>
                  {username?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className={styles.userMiniStats}>
                <span className={styles.userMiniLevel}>Lv.{userLevel}</span>
                <span className={styles.userMiniXp}>{userXp} XP</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};