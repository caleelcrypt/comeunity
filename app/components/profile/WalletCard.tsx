'use client';
import React from 'react';
import styles from './WalletCard.module.css';

interface WalletCardProps {
  coins: number;
  onWalletClick?: () => void;
}

export default function WalletCard({ coins, onWalletClick }: WalletCardProps) {
  return (
    <div className={styles.walletCard} onClick={onWalletClick}>
      <div className={styles.walletIcon}>
        <i className="fas fa-coins"></i>
      </div>
      <div className={styles.walletInfo}>
        <div className={styles.walletLabel}>Wallet Balance</div>
        <div className={styles.walletAmount}>{coins.toLocaleString()} coins</div>
      </div>
      <button className={styles.walletBtn} onClick={onWalletClick}>
        <i className="fas fa-history"></i> History
      </button>
    </div>
  );
}