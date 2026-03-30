'use client';
import React from 'react';

interface StreakModalProps {
  isOpen: boolean;
  currentStreak: number;
  streakMilestones: number[];
  onClose: () => void;
}

const StreakModal: React.FC<StreakModalProps> = ({
  isOpen,
  currentStreak,
  streakMilestones,
  onClose
}) => {
  if (!isOpen) return null;

  const getNextMilestone = () => {
    const next = streakMilestones.find(m => m > currentStreak);
    return next || null;
  };

  const getDaysUntilNext = () => {
    const next = getNextMilestone();
    return next ? next - currentStreak : null;
  };

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal-content streak-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔥 Streak Badges</h3>
          <span className="modal-close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <div className="current-streak">
            <div className="streak-icon-large">🔥</div>
            <div className="streak-number">{currentStreak}</div>
            <div className="streak-label">Current Streak</div>
            {getNextMilestone() && (
              <div className="next-milestone">
                <i className="fas fa-arrow-up"></i>
                {getDaysUntilNext()} more days to reach {getNextMilestone()} days!
              </div>
            )}
          </div>
          
          <div className="streak-milestones">
            <h4 className="milestones-title">Streak Milestones</h4>
            <div className="milestones-grid">
              {streakMilestones.map(day => {
                const unlocked = currentStreak >= day;
                const isNext = day === getNextMilestone();
                return (
                  <div key={day} className={`milestone-card ${unlocked ? 'unlocked' : 'locked'} ${isNext ? 'next' : ''}`}>
                    <div className="milestone-icon">
                      {unlocked ? (day >= 30 ? '🏆' : '🔥') : '❄️'}
                    </div>
                    <div className="milestone-day">{day} Days</div>
                    {unlocked && <div className="milestone-check">✓</div>}
                    {isNext && !unlocked && <div className="milestone-next">Next!</div>}
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="streak-tip">
            <i className="fas fa-info-circle"></i>
            Post daily to maintain your streak and unlock badges!
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakModal;