import React from 'react';

interface StreakModalProps {
  isOpen: boolean;
  currentStreak: number;
  streakMilestones: number[];
  onClose: () => void;
}

const StreakModal: React.FC<StreakModalProps> = ({ isOpen, currentStreak, streakMilestones, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="w-[90%] max-w-[340px] bg-[#12121a] border border-[#ff4d6d]/30 rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-white mb-4">Streak Badges</h3>
        <div className="text-center mb-4">
          <div className="text-4xl mb-2">🔥 {currentStreak}</div>
          <p className="text-white/60">Current Streak</p>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {streakMilestones.map(day => (
            <div key={day} className={`p-3 text-center rounded-xl ${currentStreak >= day ? 'bg-[#ff4d6d]/20 border border-[#ff4d6d]' : 'bg-white/10'}`}>
              <div className="font-bold text-white">{day} days</div>
              <div className="text-xs text-white/40">{currentStreak >= day ? 'Unlocked' : 'Locked'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StreakModal;