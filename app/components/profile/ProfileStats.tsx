'use client';
import React from 'react';
import styles from './ProfileStats.module.css';

interface ProfileStatsProps {
  followers: number;
  following: number;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
}

export default function ProfileStats({ followers, following, onFollowersClick, onFollowingClick }: ProfileStatsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className={styles.profileStats}>
      <div className={styles.profileStat} onClick={onFollowersClick}>
        <div className={styles.statNumber}>{formatNumber(followers)}</div>
        <div className={styles.statLabel}>Followers</div>
      </div>
      <div className={styles.profileStat} onClick={onFollowingClick}>
        <div className={styles.statNumber}>{formatNumber(following)}</div>
        <div className={styles.statLabel}>Following</div>
      </div>
    </div>
  );
}