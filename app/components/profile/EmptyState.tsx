'use client';
import React from 'react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

export default function EmptyState({ icon, title, message, actionText, onAction }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <i className={`fas ${icon} ${styles.emptyIcon}`}></i>
      <div className={styles.emptyTitle}>{title}</div>
      <div className={styles.emptyMessage}>{message}</div>
      {actionText && onAction && (
        <button className={styles.emptyAction} onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
}