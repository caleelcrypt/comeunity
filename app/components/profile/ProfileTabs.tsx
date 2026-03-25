'use client';
import React from 'react';
import styles from './ProfileTabs.module.css';

interface ProfileTabsProps {
  activeTab: 'posts' | 'unities' | 'treasure';
  onTabChange: (tab: 'posts' | 'unities' | 'treasure') => void;
  postsCount: number;
  unitiesCount: number;
}

export default function ProfileTabs({ activeTab, onTabChange, postsCount, unitiesCount }: ProfileTabsProps) {
  return (
    <div className={styles.profileTabs}>
      <button
        className={`${styles.profileTab} ${activeTab === 'posts' ? styles.active : ''}`}
        onClick={() => onTabChange('posts')}
      >
        Posts ({postsCount})
      </button>
      <button
        className={`${styles.profileTab} ${activeTab === 'unities' ? styles.active : ''}`}
        onClick={() => onTabChange('unities')}
      >
        Unities ({unitiesCount})
      </button>
      <button
        className={`${styles.profileTab} ${activeTab === 'treasure' ? styles.active : ''}`}
        onClick={() => onTabChange('treasure')}
      >
        Treasure
      </button>
    </div>
  );
}