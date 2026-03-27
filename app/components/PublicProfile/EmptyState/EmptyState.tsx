import React from 'react';

interface EmptyStateProps {
  icon: string;
  text: string;
  subtext: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, text, subtext }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-white/5 rounded-3xl mt-3 gap-4">
      <div className="text-6xl opacity-50">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="text-base font-medium text-white/70">{text}</div>
      <div className="text-xs text-white/40">{subtext}</div>
    </div>
  );
};

export default EmptyState;