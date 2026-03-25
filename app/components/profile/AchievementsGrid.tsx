'use client';
import React from 'react';
import styles from './AchievementsGrid.module.css';

interface Achievement {
  id: string;
  name: string;
  icon: string;
  unlocked: boolean;
}

interface AchievementsGridProps {
  achievements: Achievement[];
  onViewAll: () => void;
}

export default function AchievementsGrid({ achievements, onViewAll }: AchievementsGridProps) {
  const recentAchievements = achievements.filter(a => a.unlocked).slice(0, 3);
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className={styles.achievementsSection}>
      <div className={styles.achievementsHeader}>
        <h3>🏆 RECENT ACHIEVEMENTS</h3>
        <span className={styles.viewAll} onClick={onViewAll}>
          View All ({unlockedCount}/{totalCount})
        </span>
      </div>
      <div className={styles.achievementsGrid}>
        {recentAchievements.map((ach) => (
          <div key={ach.id} className={`${styles.achievementItem} ${styles.unlocked}`} onClick={onViewAll}>
            <div className={styles.achievementIcon}>{ach.icon}</div>
            <div className={styles.achievementName}>{ach.name}</div>
          </div>
        ))}
        {Array(3 - recentAchievements.length).fill(0).map((_, i) => (
          <div key={`locked-${i}`} className={styles.achievementItem}>
            <div className={styles.achievementIcon}>🔒</div>
            <div className={styles.achievementName}>Locked</div>
          </div>
        ))}
      </div>
    </div>
  );
}