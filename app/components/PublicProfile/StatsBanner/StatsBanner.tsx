import React from 'react';

interface StatsBannerProps {
  totalPosts: number;
  streak: number;
  achievementsCount: number;
  onStreakClick: () => void;
}

const StatsBanner: React.FC<StatsBannerProps> = ({ totalPosts, streak, achievementsCount, onStreakClick }) => {
  return (
    <div className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-4">
      <div className="flex justify-around">
        <div className="text-center">
          <div className="text-xl font-bold text-white">{totalPosts}</div>
          <div className="text-xs text-white/40">Posts</div>
        </div>
        <div className="text-center cursor-pointer" onClick={onStreakClick}>
          <div className="text-xl font-bold text-white"><i className="fas fa-fire text-[#ff4d6d] mr-1"></i> {streak}</div>
          <div className="text-xs text-white/40">Day Streak</div>
        </div>
        <div className="text-center">
          <div className="text-xl font-bold text-white">🏆 {achievementsCount}</div>
          <div className="text-xs text-white/40">Achievements</div>
        </div>
      </div>
    </div>
  );
};

export default StatsBanner;