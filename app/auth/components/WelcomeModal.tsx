'use client';
import React, { useState } from 'react';
import styles from '../Auth.module.css';

interface WelcomeModalProps {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    ownReferralCode: string;
    xp: number;
  };
  onClose: () => void;
}

const WelcomeModal = ({ user, onClose }: WelcomeModalProps) => {
  const [copied, setCopied] = useState(false);
  const referralLink = `${window.location.origin}/auth?ref=${user.ownReferralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${styles.welcomeModal} ${styles.active}`}>
      <div className={styles.welcomeCard}>
        <div className={styles.welcomeIcon}>🎉</div>
        <h2>Welcome to ComeUnity, {user.firstName}!</h2>
        <p>You're now part of something special.</p>
        
        <div className={styles.referralBox}>
          <span className={styles.referralLabel}>Your referral link:</span>
          <div className={styles.referralCode}>{user.ownReferralCode}</div>
          <button className={styles.copyBtn} onClick={copyReferralLink}>
            <i className="fas fa-copy"></i> {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        
        <div className={styles.rewardInfo}>
          <div className={styles.rewardRow}>
            <span>✨ You earned</span>
            <span className={styles.rewardValue}>{user.xp} XP</span>
          </div>
          <div className={styles.rewardRow}>
            <span>🎁 Share your link</span>
            <span className={styles.rewardValue}>+50 XP per friend</span>
          </div>
        </div>
        
        <div className={styles.nextReward}>
          <i className="fas fa-chart-line"></i>
          <span>Refer 5 friends to unlock the Early Bird badge + 250 XP!</span>
        </div>
        
        <button className={styles.startBtn} onClick={onClose}>
          Start Exploring →
        </button>
      </div>
    </div>
  );
};

export default WelcomeModal;