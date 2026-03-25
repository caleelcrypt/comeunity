'use client';
import React from 'react';
import styles from './LevelModal.module.css';

interface LevelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLevel: number;
  levelNames: string[];
  levelThresholds: number[];
  getLevelTitle: (level: number) => string;
}

export default function LevelModal({
  isOpen,
  onClose,
  currentLevel,
  levelNames,
  levelThresholds,
  getLevelTitle
}: LevelModalProps) {
  if (!isOpen) return null;

  const maxLevel = Math.min(20, currentLevel + 10);

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>📊 Level Progression</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        <div className="level-grid">
          {Array.from({ length: maxLevel }, (_, i) => i + 1).map(lvl => {
            const requiredXP = 100 * Math.pow(lvl - 1, 2);
            const isCurrent = lvl === currentLevel;
            const isPassed = lvl < currentLevel;
            
            let levelClass = '';
            if (isCurrent) levelClass = 'current';
            else if (isPassed) levelClass = 'gold';
            else levelClass = 'silver';
            
            return (
              <div key={lvl} className={`level-grid-item ${levelClass}`}>
                <div>Level {lvl} {getLevelTitle(lvl)}</div>
                <div style={{ fontSize: '11px' }}>{requiredXP.toLocaleString()} XP</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}