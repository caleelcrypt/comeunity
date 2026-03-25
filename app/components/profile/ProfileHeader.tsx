'use client';
import React from 'react';
import styles from './ProfileHeader.module.css';

interface ProfileHeaderProps {
  avatar: string;
  firstName: string;
  lastName: string;
  username: string;
  category: string;
  bio: string;
  verificationLevel: string;
  onAvatarClick: () => void;
  onEditProfile: () => void;
  onShareProfile: () => void;
  onCategoryClick?: () => void;
  onVerificationClick?: () => void;
}

const verificationConfig = {
  basic: { text: 'Basic', color: '#6b7280' },
  artist: { text: '✓ Artist', color: '#c0c0c0' },
  creator: { text: 'Creator', color: '#ffd700' },
  pro: { text: '✓✓✓ Pro', color: 'linear-gradient(135deg, #ff4d6d, #4361ee)' },
  legend: { text: '👑 Legend', color: '#ffd700' }
};

const categoryIcons: Record<string, string> = {
  Art: "🎨", Music: "🎵", Gaming: "🎮", Writing: "✍️", Photography: "📸",
  Fitness: "💪", Tech: "💻", Fashion: "👕", Food: "🍜", Dance: "💃", Comedy: "🎭", Travel: "✈️"
};

export default function ProfileHeader({
  avatar,
  firstName,
  lastName,
  username,
  category,
  bio,
  verificationLevel,
  onAvatarClick,
  onEditProfile,
  onShareProfile,
  onCategoryClick,
  onVerificationClick
}: ProfileHeaderProps) {
  const verification = verificationConfig[verificationLevel as keyof typeof verificationConfig] || verificationConfig.basic;

  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileCover}></div>
      
      {/* XP Badge will be separate component */}
      
      <div className={styles.profileInfo}>
        <div className={styles.avatarContainer} onClick={onAvatarClick}>
          <div className={styles.profileAvatarLarge}>{avatar}</div>
          <div className={styles.avatarShopBadge}>
            <i className="fas fa-shopping-cart"></i>
          </div>
        </div>
        
        <div className={styles.profileName}>
          {firstName} {lastName}
          <span 
            className={`${styles.verificationBadge} ${styles[verificationLevel]}`}
            onClick={onVerificationClick}
            style={verificationLevel === 'pro' ? { background: verification.color } : { background: verification.color }}
          >
            {verification.text}
          </span>
        </div>
        
        <div className={styles.profileHandle}>@{username}</div>
        
        <div className={styles.categoryTag} onClick={onCategoryClick}>
          {categoryIcons[category] || '🎨'} {category}
        </div>
        
        <div className={styles.profileBio}>{bio}</div>
        
        <div className={styles.profileActions}>
          <button className={`${styles.profileBtn} ${styles.primary}`} onClick={onEditProfile}>
            Edit Profile
          </button>
          <button className={styles.profileBtn} onClick={onShareProfile}>
            <i className="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
}