import React from 'react';

 interface Achievement {
  id: number;
  name: string;
  icon: string;
  description: string;  // ← Use description, not requirement
  unlocked: boolean;
}

interface AchievementsSectionProps {
  achievements: Achievement[];
  onViewAll: () => void;
}

const AchievementsSection: React.FC<AchievementsSectionProps> = ({ achievements, onViewAll }) => {
  // Only show UNLOCKED achievements
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const recentAchievements = unlockedAchievements.slice(0, 3);
  const unlockedCount = unlockedAchievements.length;
  const totalCount = achievements.length;

  return (
    <div className="mb-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <span>🏆</span> ACHIEVEMENTS
        </h3>
        <button 
          onClick={onViewAll} 
          className="text-[#b5179e] text-xs cursor-pointer hover:text-[#ff4d6d] transition-colors flex items-center gap-1"
        >
          View All ({unlockedCount}/{totalCount})
          <i className="fas fa-chevron-right text-[10px]"></i>
        </button>
      </div>
      
      {/* Show only unlocked achievements (max 3 for preview) */}
      {unlockedAchievements.length > 0 ? (
        <div className="grid grid-cols-3 gap-3">
          {recentAchievements.map((achievement, index) => (
            <div 
              key={achievement.id} 
              onClick={onViewAll} 
              className="group text-center cursor-pointer hover:scale-105 transition-all duration-200"
            >
              <div className="relative">
                <div className="w-14 h-14 mx-auto mb-1.5 bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] rounded-xl flex items-center justify-center text-2xl shadow-lg group-hover:shadow-xl transition-all">
                  {achievement.icon}
                </div>
                {/* Optional: Add a glow effect on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-[#ff4d6d]/20 to-[#4361ee]/20"></div>
              </div>
              <div className="text-[10px] text-white/70 font-medium">{achievement.name}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white/5 rounded-xl border border-white/5">
          <div className="text-4xl mb-3 opacity-50">🔒</div>
          <p className="text-white/40 text-sm font-medium">No achievements unlocked yet</p>
          <p className="text-white/30 text-xs mt-2">Keep creating, engaging, and tipping to earn achievements!</p>
          <div className="flex justify-center gap-4 mt-4 text-[10px] text-white/30">
            <span>✨ Create posts</span>
            <span>💝 Send tips</span>
            <span>🔥 Maintain streaks</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementsSection;