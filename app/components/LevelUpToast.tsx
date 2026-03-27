'use client';
import React, { useEffect } from 'react';
import styles from './LevelUpToast.module.css';

interface LevelUpToastProps {
  level: number;
  levelTitle: string;
  onClose: () => void;
}

export default function LevelUpToast({ level, levelTitle, onClose }: LevelUpToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={styles.levelUpToast}>
      <div className={styles.toastIcon}>🎉</div>
      <div className={styles.toastContent}>
        <h4>LEVEL UP!</h4>
        <p>You are now <strong>Level {level} {levelTitle}</strong></p>
        <p className={styles.toastReward}>Keep going! More rewards await!</p>
      </div>
      <button onClick={onClose} className={styles.toastClose}>×</button>
    </div>
  );
}