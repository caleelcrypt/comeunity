'use client';
import React, { useState, useMemo } from 'react';
import styles from './TransactionModal.module.css';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
  metadata?: {
    xp_gained?: number;
    coins_gained?: number;
    reason?: string;
  };
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  xpTransactions?: Transaction[];
}

export default function TransactionModal({ 
  isOpen, 
  onClose, 
  transactions, 
  xpTransactions = [] 
}: TransactionModalProps) {
  const [filter, setFilter] = useState<'all' | 'coins' | 'xp'>('all');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getTransactionIcon = (type: string) => {
    if (type.includes('Avatar Purchase')) return '🛍️';
    if (type.includes('Referral')) return '🤝';
    if (type.includes('Tip')) return '💎';
    if (type.includes('Level Up')) return '🎉';
    if (type.includes('Streak')) return '🔥';
    if (type.includes('Post')) return '📝';
    if (type.includes('Like')) return '❤️';
    if (type.includes('Comment')) return '💬';
    if (type.includes('Share')) return '📤';
    return '💰';
  };

  const getTransactionAmountClass = (amount: number) => {
    if (amount > 0) return styles.amountPositive;
    if (amount < 0) return styles.amountNegative;
    return styles.amountNeutral;
  };

  // Combine both coin and XP transactions
  const allTransactions = useMemo(() => {
    const coinTxs = transactions.map(t => ({ ...t, type: t.type, amount: t.amount, currency: 'coins' }));
    const xpTxs = xpTransactions.map(t => ({ ...t, type: t.type, amount: t.amount, currency: 'xp' }));
    
    if (filter === 'coins') return coinTxs;
    if (filter === 'xp') return xpTxs;
    return [...coinTxs, ...xpTxs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, xpTransactions, filter]);

  const stats = useMemo(() => {
    const totalCoinsEarned = transactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const totalCoinsSpent = transactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const totalXPEarned = xpTransactions.reduce((sum, t) => sum + t.amount, 0);
    return { totalCoinsEarned, totalCoinsSpent, totalXPEarned, netCoins: totalCoinsEarned - totalCoinsSpent };
  }, [transactions, xpTransactions]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.transactionModal} ${isOpen ? styles.show : ''}`}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h3>
            <i className="fas fa-history"></i> Transaction History
          </h3>
          <span className={styles.closeModal} onClick={onClose}>&times;</span>
        </div>

        {/* Stats Summary */}
        {allTransactions.length > 0 && (
          <div className={styles.statsSummary}>
            <div className={styles.statsItem}>
              <div className={styles.statsValue}>+{stats.totalCoinsEarned}</div>
              <div className={styles.statsLabel}>Coins Earned</div>
            </div>
            <div className={styles.statsItem}>
              <div className={styles.statsValue}>-{stats.totalCoinsSpent}</div>
              <div className={styles.statsLabel}>Coins Spent</div>
            </div>
            <div className={styles.statsItem}>
              <div className={styles.statsValue}>{stats.totalXPEarned}</div>
              <div className={styles.statsLabel}>XP Earned</div>
            </div>
            <div className={styles.statsItem}>
              <div className={styles.statsValue}>{stats.netCoins}</div>
              <div className={styles.statsLabel}>Net Coins</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {allTransactions.length > 0 && (
          <div className={styles.filterTabs}>
            <button 
              className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            <button 
              className={`${styles.filterTab} ${filter === 'coins' ? styles.active : ''}`}
              onClick={() => setFilter('coins')}
            >
              <i className="fas fa-coins"></i> Coins
            </button>
            <button 
              className={`${styles.filterTab} ${filter === 'xp' ? styles.active : ''}`}
              onClick={() => setFilter('xp')}
            >
              <i className="fas fa-star"></i> XP
            </button>
          </div>
        )}

        {/* Transaction List */}
        <div className={styles.transactionList}>
          {allTransactions.length === 0 ? (
            <div className={styles.emptyState}>
              <i className="fas fa-receipt"></i>
              <p>No transactions yet</p>
            </div>
          ) : (
            allTransactions.map(t => (
              <div key={t.id} className={styles.transactionItem}>
                <div className={styles.transactionType}>
                  <div className={styles.transactionIcon}>
                    {getTransactionIcon(t.type)}
                  </div>
                  <div className={styles.transactionName}>{t.type}</div>
                </div>
                <div className={`${styles.transactionAmount} ${getTransactionAmountClass(t.amount)}`}>
                  {t.currency === 'xp' ? (
                    <>{t.amount > 0 ? '+' : ''}{t.amount} <i className="fas fa-star"></i></>
                  ) : (
                    <>{t.amount > 0 ? '+' : ''}{t.amount} 🪙</>
                  )}
                </div>
                <div className={styles.transactionDate}>
                  {formatDate(t.date)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}