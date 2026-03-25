'use client';
import React from 'react';
import styles from './StreakModal.module.css';

interface StreakModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStreak: number;
  streakMilestones: number[];
}

export default function StreakModal({ isOpen, onClose, currentStreak, streakMilestones }: StreakModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>🔥 Streak Badges</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        <div className="streak-badges-grid">
          {streakMilestones.map(day => {
            const unlocked = currentStreak >= day;
            const icon = unlocked ? (day >= 30 ? "🏆" : "🔥") : "❄️";
            return (
              <div key={day} className="streak-badge-card" style={{ opacity: unlocked ? 1 : 0.5 }}>
                <div className="streak-icon">{icon}</div>
                <div>{unlocked ? '✅' : '🔒'} {day} Days</div>
                <div style={{ fontSize: '10px' }}>{unlocked ? 'Earned' : 'Locked'}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}