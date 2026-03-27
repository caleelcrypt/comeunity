'use client';
import React, { useState, useEffect } from 'react';
import styles from './XPWalletCard.module.css';

interface XPWalletCardProps {
  xp: number;
  coins: number;
  level: number;
  levelTitle: string;
  nextLevelXP: number;
  progress: number;
  streak: number;
  onWalletClick?: () => void;
  onXPClick?: () => void;
  onStreakClick?: () => void;
  onReferralClick?: () => void;
}

export default function XPWalletCard({
  xp,
  coins,
  level,
  levelTitle,
  nextLevelXP,
  progress,
  streak,
  onWalletClick,
  onXPClick,
  onStreakClick,
  onReferralClick
}: XPWalletCardProps) {
  const [animateXP, setAnimateXP] = useState(false);
  const [animateCoins, setAnimateCoins] = useState(false);

  useEffect(() => {
    setAnimateXP(true);
    setAnimateCoins(true);
    const timer = setTimeout(() => {
      setAnimateXP(false);
      setAnimateCoins(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [xp, coins]);

  return (
    <div className={styles.xpWalletCard}>
      {/* XP Section - Silver Glowing Border */}
      <div className={styles.xpSection} onClick={onXPClick}>
        <div className={styles.xpIcon}>
          <i className="fas fa-star"></i>
        </div>
        <div className={styles.xpInfo}>
          <div className={styles.xpLabel}>Total XP</div>
          <div className={`${styles.xpValue} ${animateXP ? styles.pulse : ''}`}>
            {xp.toLocaleString()}
          </div>
        </div>
        <div className={styles.levelBadge}>
          <span>Lv.{level}</span>
          <span className={styles.levelTitle}>{levelTitle}</span>
        </div>
      </div>

      {/* XP Progress Bar */}
      <div className={styles.progressSection}>
        <div className={styles.progressLabel}>
          <span>Next Level: {nextLevelXP} XP</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      {/* Streak Section */}
      <div className={styles.streakSection} onClick={onStreakClick}>
        <div className={styles.streakIcon}>
          <i className="fas fa-fire"></i>
        </div>
        <div className={styles.streakInfo}>
          <div className={styles.streakLabel}>Current Streak</div>
          <div className={styles.streakValue}>{streak} days</div>
        </div>
        <button className={styles.streakBtn} onClick={onStreakClick}>
          <i className="fas fa-calendar-day"></i> Details
        </button>
      </div>

      {/* Referral Section */}
      <div className={styles.referralSection} onClick={onReferralClick}>
        <div className={styles.referralIcon}>
          <i className="fas fa-gift"></i>
        </div>
        <div className={styles.referralInfo}>
          <div className={styles.referralLabel}>Invite Friends</div>
          <div className={styles.referralValue}>+50 XP each</div>
        </div>
        <button className={styles.referralBtn} onClick={onReferralClick}>
          <i className="fas fa-share-alt"></i> Invite
        </button>
      </div>

      {/* Coins Section - Gold Border */}
      <div className={styles.coinsSection} onClick={onWalletClick}>
        <div className={styles.coinsIcon}>
          <i className="fas fa-coins"></i>
        </div>
        <div className={styles.coinsInfo}>
          <div className={styles.coinsLabel}>Wallet Balance</div>
          <div className={`${styles.coinsValue} ${animateCoins ? styles.pulse : ''}`}>
            {coins.toLocaleString()} coins
          </div>
        </div>
        <button className={styles.historyBtn} onClick={onWalletClick}>
          <i className="fas fa-history"></i>
          <span>History</span>
        </button>
      </div>
    </div>
  );
}