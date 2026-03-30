'use client';
import React from 'react';

interface LevelModalProps {
  isOpen: boolean;
  currentXP: number;
  currentLevel: number;
  levelNames: string[];
  levelThresholds: number[];
  onClose: () => void;
}

const LevelModal: React.FC<LevelModalProps> = ({
  isOpen,
  currentXP,
  currentLevel,
  levelNames,
  levelThresholds,
  onClose
}) => {
  if (!isOpen) return null;

  const getProgressToNext = () => {
    const currentThreshold = levelThresholds[currentLevel];
    const nextThreshold = levelThresholds[currentLevel + 1];
    if (!nextThreshold) return 100;
    return ((currentXP - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal-content level-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>📊 Level Progression</h3>
          <span className="modal-close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="current-level-info">
            <div className="current-level-badge">Level {currentLevel} {levelNames[currentLevel]}</div>
            <div className="current-xp">{currentXP} XP</div>
            {levelThresholds[currentLevel + 1] && (
              <div className="next-level-info">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${getProgressToNext()}%` }}></div>
                </div>
                <div className="next-xp">
                  {currentXP - levelThresholds[currentLevel]} / {levelThresholds[currentLevel + 1] - levelThresholds[currentLevel]} XP to next level
                </div>
              </div>
            )}
          </div>
          
          <div className="levels-list">
            {levelNames.slice(0, 11).map((name, i) => {
              const required = levelThresholds[i + 1];
              const isCurrent = i === currentLevel;
              const isUnlocked = currentXP >= (required || 0);
              return (
                <div key={i} className={`level-item ${isCurrent ? 'current' : ''} ${isUnlocked ? 'unlocked' : 'locked'}`}>
                  <div className="level-left">
                    <span className="level-number">Level {i}</span>
                    <span className="level-name">{name}</span>
                  </div>
                  <div className="level-right">
                    {required ? (
                      <span className="level-xp">{required.toLocaleString()} XP</span>
                    ) : (
                      <span className="level-xp">MAX LEVEL</span>
                    )}
                    {isCurrent && <span className="current-badge">Current</span>}
                    {isUnlocked && !isCurrent && required && <i className="fas fa-check-circle unlocked-icon"></i>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LevelModal;