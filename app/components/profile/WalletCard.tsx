'use client';
import React from 'react';
import styles from './WalletCard.module.css';

interface WalletCardProps {
  coins: number;
  onWalletClick: () => void;
}

export default function WalletCard({ coins, onWalletClick }: WalletCardProps) {
  return (
    <div className={styles.walletCard} onClick={onWalletClick}>
      <div className={styles.walletBalance}>
        <i className="fas fa-coins"></i> {coins.toLocaleString()} coins
      </div>
      <div className={styles.walletActions}>
        <div className={styles.walletBtn}>
          <i className="fas fa-history"></i> Transaction History
        </div>
      </div>
    </div>
  );
}