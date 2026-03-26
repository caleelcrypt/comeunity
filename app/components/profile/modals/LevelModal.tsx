'use client';
import React from 'react';
import styles from './LevelModal.module.css';

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentXP: number;
}

// ============================================
// ENDLESS LEVELING SYSTEM (Levels 1-100+)
// ============================================

// Calculate level from XP using exponential formula
const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
};

// XP needed for a specific level
const getXPForLevel = (level: number): number => {
  return 100 * Math.pow(level - 1, 2);
};

// Get level title based on level number
const getLevelTitle = (level: number): string => {
  if (level <= 5) {
    const titles = ['Rookie', 'Newbie', 'Explorer', 'Adventurer', 'Master'];
    return titles[level - 1];
  } else if (level <= 10) {
    const titles = ['Elite', 'Pro', 'Expert', 'Champion', 'Legend'];
    return titles[level - 6];
  } else if (level <= 15) {
    const titles = ['Mythic', 'Hero', 'Titan', 'Colossus', 'Behemoth'];
    return titles[level - 11];
  } else if (level <= 20) {
    const titles = ['Ascendant', 'Transcendent', 'Divine', 'Eternal', 'Infinity'];
    return titles[level - 16];
  } else if (level <= 25) {
    const titles = ['Cosmic', 'Celestial', 'Galactic', 'Universal', 'Omni'];
    return titles[level - 21];
  } else if (level <= 30) {
    const titles = ['Immortal', 'Phoenix', 'Reborn', 'Eternal Flame', 'Ascended'];
    return titles[level - 26];
  } else if (level <= 40) {
    return 'Mythic Lord';
  } else if (level <= 50) {
    return 'Godly';
  } else if (level <= 75) {
    return 'Transcendent';
  } else if (level <= 100) {
    return 'Omnipotent';
  } else {
    return 'Eternal';
  }
};

// Get XP needed for next level
const getXPToNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  return getXPForLevel(currentLevel + 1) - currentXP;
};

// Get progress percentage to next level
const getProgressToNextLevel = (currentXP: number): number => {
  const currentLevel = calculateLevel(currentXP);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  return (xpInCurrentLevel / xpNeeded) * 100;
};

// Get next milestone (next significant level like 5, 10, 15, etc.)
const getNextMilestone = (currentLevel: number): { level: number; title: string; xpNeeded: number } => {
  const milestones = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100];
  const nextMilestone = milestones.find(m => m > currentLevel);
  
  if (nextMilestone) {
    const xpNeeded = getXPForLevel(nextMilestone);
    return {
      level: nextMilestone,
      title: getLevelTitle(nextMilestone),
      xpNeeded
    };
  }
  
  return {
    level: currentLevel + 10,
    title: getLevelTitle(currentLevel + 10),
    xpNeeded: getXPForLevel(currentLevel + 10)
  };
};

export default function LevelModal({ isOpen, onClose, currentXP }: LevelModalProps) {
  if (!isOpen) return null;

  const currentLevel = calculateLevel(currentXP);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);
  const xpToNext = getXPToNextLevel(currentXP);
  const progress = getProgressToNextLevel(currentXP);
  const nextLevelTitle = getLevelTitle(currentLevel + 1);
  
  // Get dynamic milestone based on current level
  const milestone = getNextMilestone(currentLevel);
  const xpToMilestone = milestone.xpNeeded - currentXP;
  const milestoneProgress = ((currentXP / milestone.xpNeeded) * 100);

  // Generate levels to show (show 5 levels before and 10 levels after current)
  const startLevel = Math.max(1, currentLevel - 4);
  const endLevel = Math.min(100, currentLevel + 15);
  const levels = Array.from({ length: endLevel - startLevel + 1 }, (_, i) => startLevel + i);

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.show : ''}`}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>📊 Level Progression</h3>
          <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        </div>

        {/* Current Level Card */}
        <div className={styles.currentLevelCard}>
          <div className={styles.currentLevelNumber}>{currentLevel}</div>
          <div className={styles.currentLevelTitle}>{getLevelTitle(currentLevel)}</div>
          <div className={styles.currentLevelXp}>{currentXP.toLocaleString()} / {nextLevelXP.toLocaleString()} XP</div>
          <div className={styles.nextLevelHint}>
            🎯 {xpToNext.toLocaleString()} XP needed for Level {currentLevel + 1} ({nextLevelTitle})
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressLabel}>
            <span>Progress to Level {currentLevel + 1}</span>
            <span>{Math.min(100, Math.floor(progress))}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${Math.min(100, progress)}%` }}></div>
          </div>
        </div>

        {/* Dynamic Milestone Preview */}
        <div className={styles.milestonePreview}>
          <i className="fas fa-trophy"></i>
          <span>
            🏆 {xpToMilestone > 0 
              ? `${xpToMilestone.toLocaleString()} XP until ${milestone.title} (Level ${milestone.level})`
              : `You've reached ${milestone.title}! Next milestone: Level ${milestone.level + 5}`
            }
          </span>
        </div>

        {/* Milestone Progress Bar */}
        <div className={styles.milestoneProgressSection}>
          <div className={styles.progressLabel}>
            <span>Progress to {milestone.title}</span>
            <span>{Math.min(100, Math.floor(milestoneProgress))}%</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.milestoneProgressFill} style={{ width: `${Math.min(100, milestoneProgress)}%` }}></div>
          </div>
        </div>

        {/* Level Grid */}
        <div className={styles.levelGrid}>
          {levels.map(lvl => {
            const isCurrent = lvl === currentLevel;
            const isPassed = lvl < currentLevel;
            const xpRequired = getXPForLevel(lvl);
            const levelTitle = getLevelTitle(lvl);
            const isMilestone = [5, 10, 15, 20, 25, 30, 40, 50, 75, 100].includes(lvl);
            
            let cardClass = styles.levelCard;
            if (isCurrent) cardClass += ` ${styles.current}`;
            if (isPassed) cardClass += ` ${styles.passed}`;
            if (isMilestone && !isCurrent) cardClass += ` ${styles.milestone}`;
            
            return (
              <div key={lvl} className={cardClass}>
                <div className={styles.levelNumber}>{lvl}</div>
                <div className={styles.levelTitle}>{levelTitle}</div>
                <div className={styles.levelXp}>{xpRequired.toLocaleString()} XP</div>
                {isCurrent && <div className={styles.currentBadge}>CURRENT</div>}
                {isMilestone && !isCurrent && !isPassed && <div className={styles.milestoneBadge}>🎯 MILESTONE</div>}
              </div>
            );
          })}
        </div>

        {/* XP Formula Explanation */}
        <div className={styles.formulaNote}>
          <i className="fas fa-chart-line"></i>
          <span>XP needed for Level N = 100 × (N-1)²</span>
        </div>
      </div>
    </div>
  );
}