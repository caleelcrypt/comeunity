'use client';
import React from 'react';

interface Achievement {
  id: number;
  name: string;
  icon: string;
  description: string;
  requirement_type: string;
  requirement_value: number;
  unlocked: boolean;
}

interface AchievementsModalProps {
  isOpen: boolean;
  achievements: Achievement[];
  onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  achievements,
  onClose
}) => {
  if (!isOpen) return null;

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const lockedCount = achievements.length - unlockedCount;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal-content achievements-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🏆 Achievements</h3>
          <span className="modal-close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="achievements-stats">
            <div className="stat-circle">
              <span className="stat-number">{unlockedCount}</span>
              <span className="stat-label">Unlocked</span>
            </div>
            <div className="stat-divider">/</div>
            <div className="stat-circle">
              <span className="stat-number">{achievements.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
          <div className="progress-bar achievements-progress">
            <div className="progress-fill" style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}></div>
          </div>
          
          <div className="achievements-list">
            {/* Unlocked Achievements */}
            {unlockedCount > 0 && (
              <div className="achievement-section">
                <h4 className="section-title unlocked-title">
                  <i className="fas fa-trophy"></i> Unlocked ({unlockedCount})
                </h4>
                {achievements.filter(a => a.unlocked).map(achievement => (
                  <div key={achievement.id} className="achievement-card unlocked">
                    <div className="achievement-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <div className="achievement-name">{achievement.name}</div>
                      <div className="achievement-desc">{achievement.description}</div>
                    </div>
                    <i className="fas fa-check-circle check-icon"></i>
                  </div>
                ))}
              </div>
            )}
            
            {/* Locked Achievements */}
            {lockedCount > 0 && (
              <div className="achievement-section">
                <h4 className="section-title locked-title">
                  <i className="fas fa-lock"></i> Locked ({lockedCount})
                </h4>
                {achievements.filter(a => !a.unlocked).map(achievement => (
                  <div key={achievement.id} className="achievement-card locked">
                    <div className="achievement-icon locked-icon">{achievement.icon}</div>
                    <div className="achievement-info">
                      <div className="achievement-name">{achievement.name}</div>
                      <div className="achievement-desc">{achievement.description}</div>
                    </div>
                    <i className="fas fa-lock lock-icon"></i>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;