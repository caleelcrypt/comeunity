'use client';
import React from 'react';
import styles from './TransactionModal.module.css';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  date: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export default function TransactionModal({ isOpen, onClose, transactions }: TransactionModalProps) {
  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>📜 Transaction History</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        {transactions.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>No transactions yet</p>
        ) : (
          transactions.map(t => (
            <div key={t.id} className="transaction-item">
              <span>{t.type}</span>
              <span>{t.amount} 🪙</span>
              <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)' }}>{formatDate(t.date)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}