'use client';
import React from 'react';
import styles from './LevelCard.module.css';

interface LevelCardProps {
  level: number;
  levelTitle: string;
  xp: number;
  nextXP: number;
  progress: number;
  streak: number;
  onLevelClick: () => void;
  onStreakClick: () => void;
  onReferralClick: () => void;
}

export default function LevelCard({
  level,
  levelTitle,
  xp,
  nextXP,
  progress,
  streak,
  onLevelClick,
  onStreakClick,
  onReferralClick
}: LevelCardProps) {
  return (
    <div className={styles.playerStatus}>
      <div className={styles.statusRow}>
        <div className={styles.fameLevel} onClick={onLevelClick}>
          <span className={styles.levelBadge}>Lvl {level} {levelTitle}</span>
          <div className={styles.levelProgress}>
            <div className={styles.levelProgressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <div className={styles.xpText}>{xp}/{nextXP > 0 ? nextXP : 'MAX'}</div>
        </div>
        
        <div className={styles.streakBadgeLarge} onClick={onStreakClick}>
          <i className="fas fa-fire"></i> {streak} day streak
        </div>
        
        <div className={styles.referralBadgeLarge} onClick={onReferralClick}>
          <i className="fas fa-gift"></i> Invite
        </div>
      </div>
      
      <div className={styles.statsRowMini}>
        <div className={styles.statMini}>
          <div className={styles.statValueMini}>{Math.floor(xp / 100)}</div>
          <div className={styles.statLabel}>Posts</div>
        </div>
        <div className={styles.statMini}>
          <div className={styles.statValueMini}>{Math.floor(xp / 50)}</div>
          <div className={styles.statLabel}>Comments</div>
        </div>
        <div className={styles.statMini}>
          <div className={styles.statValueMini}>134</div>
          <div className={styles.statLabel}>Likes Given</div>
        </div>
      </div>
    </div>
  );
}