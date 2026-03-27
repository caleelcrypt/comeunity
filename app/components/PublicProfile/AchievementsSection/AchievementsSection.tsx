import React from 'react';

interface Achievement {
  id: number;
  name: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
}

interface AchievementsSectionProps {
  achievements: Achievement[];
  onViewAll: () => void;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements, onViewAll }) => {
  const recentAchievements = achievements.filter(a => a.unlocked).slice(0, 3);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-white">🏆 ACHIEVEMENTS</h3>
        <span onClick={onViewAll} className="text-[#b5179e] text-xs cursor-pointer">
          View All ({unlockedCount}/{achievements.length})
        </span>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {recentAchievements.map(achievement => (
          <div key={achievement.id} onClick={onViewAll} className="text-center cursor-pointer">
            <div className="w-14 h-14 mx-auto mb-1.5 bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] rounded-xl flex items-center justify-center text-2xl">
              {achievement.icon}
            </div>
            <div className="text-[10px] text-white/70">{achievement.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;