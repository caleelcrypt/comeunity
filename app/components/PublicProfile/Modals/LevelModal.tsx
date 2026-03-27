import React from 'react';

interface LevelModalProps {
  isOpen: boolean;
  currentXP: number;
  currentLevel: number;
  levelNames: string[];
  levelThresholds: number[];
  onClose: () => void;
}

const LevelModal: React.FC<LevelModalProps> = ({ isOpen, currentXP, currentLevel, levelNames, levelThresholds, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="w-[90%] max-w-[340px] bg-[#12121a] border border-[#ff4d6d]/30 rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-white mb-4">Level Progression</h3>
        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {levelNames.slice(0, 6).map((name, i) => (
            <div key={i} className={`flex justify-between p-3 rounded-xl ${i === currentLevel ? 'bg-[#ff4d6d]/20 border border-[#ff4d6d]' : 'bg-white/5'}`}>
              <span>Level {i} {name}</span>
              <span>{levelThresholds[i + 1] || 'MAX'} XP</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LevelModal;