import React from 'react';

interface Achievement {
  id: number;
  name: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
}

interface AchievementsModalProps {
  isOpen: boolean;
  achievements: Achievement[];
  onClose: () => void;
}

const AchievementsModal: React.FC<AchievementsModalProps> = ({ isOpen, achievements, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="w-[90%] max-w-[340px] bg-[#12121a] border border-[#ff4d6d]/30 rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-white mb-4">Achievements</h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {achievements.map(achievement => (
            <div key={achievement.id} className={`flex items-center gap-3 p-3 rounded-xl ${achievement.unlocked ? 'bg-[#ff4d6d]/10' : 'bg-white/5 opacity-60'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] flex items-center justify-center text-xl">{achievement.icon}</div>
              <div className="flex-1">
                <div className="font-semibold text-white text-sm">{achievement.name}</div>
                <div className="text-xs text-white/40">{achievement.requirement}</div>
              </div>
              {achievement.unlocked && <i className="fas fa-check-circle text-green-400"></i>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AchievementsModal;