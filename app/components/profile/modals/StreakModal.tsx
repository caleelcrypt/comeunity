'use client';
import React from 'react';
import styles from './StreakModal.module.css';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
}

// Complete Streak Milestones (19 milestones, up to 1000 days)
const STREAK_MILESTONES = [
  { days: 1, badge: 'First Step', icon: '👣', xp: 10, rarity: 'common', message: 'You took your first step! 🎉' },
  { days: 3, badge: 'Warming Up', icon: '🔥', xp: 20, rarity: 'common', message: '3 days! You\'re warming up! 🔥' },
  { days: 5, badge: 'On Fire', icon: '⚡', xp: 50, rarity: 'common', message: '5 days! You\'re on fire! ⚡' },
  { days: 7, badge: 'Week Warrior', icon: '📅', xp: 100, rarity: 'rare', message: '7 DAYS! One week strong! 🎯' },
  { days: 10, badge: 'Double Digits', icon: '🔟', xp: 150, rarity: 'rare', message: '10 days! Double digits! 🔥' },
  { days: 14, badge: 'Two Weeks', icon: '✌️', xp: 200, rarity: 'rare', message: 'Two weeks! You\'re consistent! ✌️' },
  { days: 21, badge: 'Three Weeks', icon: '🌟', xp: 250, rarity: 'epic', message: '21 days! Three weeks strong! 🌟' },
  { days: 30, badge: 'Monthly Master', icon: '🏆', xp: 500, rarity: 'epic', message: '30 DAYS! You\'re a Monthly Master! 🏆' },
  { days: 50, badge: 'Golden Streak', icon: '👑', xp: 750, rarity: 'legendary', message: '50 days! Golden Streak achieved! 👑' },
  { days: 75, badge: 'Diamond Streak', icon: '💎', xp: 1000, rarity: 'legendary', message: '75 days! Diamond level! 💎' },
  { days: 100, badge: 'Century Club', icon: '🏅', xp: 1500, rarity: 'legendary', message: '100 DAYS! Welcome to the Century Club! 🏅' },
  { days: 150, badge: 'Immortal', icon: '♾️', xp: 2000, rarity: 'mythic', message: '150 days! Immortal streak! ♾️' },
  { days: 200, badge: 'Eternal Flame', icon: '🔥♾️', xp: 2500, rarity: 'mythic', message: '200 days! Eternal Flame! 🔥♾️' },
  { days: 250, badge: 'Unbreakable', icon: '🛡️', xp: 3000, rarity: 'mythic', message: '250 days! Unbreakable! 🛡️' },
  { days: 300, badge: 'Legendary Streak', icon: '🌌', xp: 3500, rarity: 'mythic', message: '300 days! Legendary! 🌌' },
  { days: 365, badge: 'Year One', icon: '🎂', xp: 5000, rarity: 'legendary', message: '365 DAYS! ONE FULL YEAR! 🎂🎉' },
  { days: 500, badge: 'Half Millennium', icon: '⭐', xp: 7500, rarity: 'godly', message: '500 days! HALF MILLENNIUM! ⭐' },
  { days: 730, badge: 'Two Years', icon: '🎊', xp: 10000, rarity: 'godly', message: '730 days! TWO YEARS! 🎊' },
  { days: 1000, badge: 'Millennium', icon: '👑🔥', xp: 15000, rarity: 'godly', message: '1000 DAYS! MILLENNIUM LEGEND! 👑🔥' }
];

// Function to get next milestone
const getNextMilestone = (currentStreak: number): { days: number; badge: string; icon: string; xp: number } | null => {
  const next = STREAK_MILESTONES.find(m => m.days > currentStreak);
  return next || null;
};

// Function to get previous earned milestones
const getEarnedMilestones = (currentStreak: number) => {
  return STREAK_MILESTONES.filter(m => m.days <= currentStreak);
};

// Function to get progress to next milestone
const getProgressToNextMilestone = (currentStreak: number, nextMilestoneDays: number): number => {
  if (!nextMilestoneDays) return 0;
  const previousMilestone = STREAK_MILESTONES.filter(m => m.days < currentStreak).pop();
  const previousDays = previousMilestone?.days || 0;
  const progress = ((currentStreak - previousDays) / (nextMilestoneDays - previousDays)) * 100;
  return Math.min(100, Math.max(0, progress));
};

export default function StreakModal({ isOpen, onClose, currentStreak }: StreakModalProps) {
  if (!isOpen) return null;

  const earnedMilestones = getEarnedMilestones(currentStreak);
  const nextMilestone = getNextMilestone(currentStreak);
  const progressToNext = nextMilestone ? getProgressToNextMilestone(currentStreak, nextMilestone.days) : 100;
  
  // Calculate next bonus XP
  const nextBonusXP = nextMilestone?.xp || 0;
  const daysToNext = nextMilestone ? nextMilestone.days - currentStreak : 0;

  // Calculate streak tier
  const getStreakTier = (streak: number) => {
    if (streak >= 100) return { name: 'Legendary', color: '#ff9f4a', icon: '👑' };
    if (streak >= 50) return { name: 'Epic', color: '#b86bff', icon: '⚡' };
    if (streak >= 30) return { name: 'Rare', color: '#4c9aff', icon: '🏆' };
    if (streak >= 14) return { name: 'Uncommon', color: '#a0a0a0', icon: '🔥' };
    return { name: 'Common', color: '#6b7280', icon: '👣' };
  };

  const tier = getStreakTier(currentStreak);

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.show : ''}`}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>🔥 Streak Badges</h3>
          <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        </div>

        {/* Current Streak Card */}
        <div className={styles.currentStreakCard}>
          <div className={styles.streakIconLarge}>
            {currentStreak >= 30 ? '🏆' : currentStreak >= 14 ? '🔥' : '👣'}
          </div>
          <div className={styles.currentStreakNumber}>{currentStreak}</div>
          <div className={styles.currentStreakLabel}>Day Streak</div>
          <div className={styles.streakTier} style={{ background: tier.color }}>
            {tier.icon} {tier.name} Tier
          </div>
        </div>

        {/* Next Milestone Progress */}
        {nextMilestone && (
          <div className={styles.nextMilestoneCard}>
            <div className={styles.nextMilestoneHeader}>
              <span>🎯 Next Milestone</span>
              <span className={styles.nextMilestoneDays}>{nextMilestone.days} Days</span>
            </div>
            <div className={styles.nextMilestoneBadge}>
              <span className={styles.milestoneIcon}>{nextMilestone.icon}</span>
              <span className={styles.milestoneName}>{nextMilestone.badge}</span>
              <span className={styles.milestoneXp}>+{nextMilestone.xp} XP</span>
            </div>
            <div className={styles.progressSection}>
              <div className={styles.progressLabel}>
                <span>{currentStreak}/{nextMilestone.days} days</span>
                <span>{Math.floor(progressToNext)}%</span>
              </div>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progressToNext}%` }}></div>
              </div>
            </div>
            <div className={styles.daysHint}>
              {daysToNext} more day{daysToNext !== 1 ? 's' : ''} to earn +{nextMilestone.xp} XP!
            </div>
          </div>
        )}

        {/* Daily Bonus Info */}
        <div className={styles.dailyBonusCard}>
          <i className="fas fa-calendar-day"></i>
          <div>
            <strong>Daily Activity Bonus</strong>
            <span>+5 XP for any activity each day</span>
          </div>
        </div>

        {/* Streak Milestones Grid */}
        <div className={styles.milestonesGrid}>
          {STREAK_MILESTONES.map(milestone => {
            const isEarned = currentStreak >= milestone.days;
            const isCurrent = milestone.days === nextMilestone?.days;
            
            return (
              <div 
                key={milestone.days} 
                className={`${styles.milestoneCard} ${isEarned ? styles.earned : ''} ${isCurrent ? styles.current : ''}`}
              >
                <div className={styles.milestoneIconLarge}>{milestone.icon}</div>
                <div className={styles.milestoneDay}>{milestone.days} Days</div>
                <div className={styles.milestoneBadgeName}>{milestone.badge}</div>
                <div className={styles.milestoneXpReward}>+{milestone.xp} XP</div>
                <div className={styles.milestoneRarity} data-rarity={milestone.rarity}>
                  {milestone.rarity}
                </div>
                {isEarned && <div className={styles.earnedCheck}>✅</div>}
                {isCurrent && !isEarned && <div className={styles.currentIndicator}>🎯</div>}
              </div>
            );
          })}
        </div>

        {/* Streak Tips */}
        <div className={styles.streakTips}>
          <div className={styles.tipItem}>
            <i className="fas fa-lightbulb"></i>
            <span>Do any activity once per day to keep your streak alive!</span>
          </div>
          <div className={styles.tipItem}>
            <i className="fas fa-fire"></i>
            <span>Higher streaks = bigger bonuses and exclusive badges</span>
          </div>
          <div className={styles.tipItem}>
            <i className="fas fa-calendar-check"></i>
            <span>Streak resets at midnight (your local time)</span>
          </div>
        </div>

        {/* Streak Quote */}
        <div className={styles.streakQuote}>
          <i className="fas fa-quote-left"></i>
          <p>"{currentStreak >= 30 
            ? 'Consistency is power. You\'re unstoppable!' 
            : currentStreak >= 14 
            ? 'You\'re building something great. Keep going!'
            : 'Every day counts. Start your streak today!'}"</p>
        </div>
      </div>
    </div>
  );
}