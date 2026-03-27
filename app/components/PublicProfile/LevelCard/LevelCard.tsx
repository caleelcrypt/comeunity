import React from 'react';

interface LevelCardProps {
  xp: number;
  level: number;
  levelName: string;
  nextXP: number | null;
  onViewLevels: () => void;
}

const LevelCard: React.FC<LevelCardProps> = ({ xp, level, levelName, nextXP, onViewLevels }) => {
  const levelThresholds = [0, 500, 1200, 2100, 3200, 4500, 6000, 7700, 9600, 11700, 14000];
  const currentXP = levelThresholds[level];
  const progress = nextXP ? ((xp - currentXP) / (nextXP - currentXP)) * 100 : 100;

  return (
    <div onClick={onViewLevels} className="bg-white/5 border border-white/5 rounded-2xl p-4 mb-4 cursor-pointer">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-white/60">Current Level</div>
          <div className="text-2xl font-bold text-white">Level {level} {levelName}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-white/60">Total XP</div>
          <div className="text-xl font-bold text-[#ffd700]">{xp}</div>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex justify-between text-xs text-white/40 mb-1">
          <span>{currentXP} XP</span>
          <span>{nextXP || 'MAX'} XP</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] rounded-full" style={{ width: `${Math.min(100, progress)}%` }}></div>
        </div>
      </div>
    </div>
  );
};

export default LevelCard;