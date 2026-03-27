import React from 'react';

interface ToastProps {
  title: string;
  message: string;
  xpGain?: number;
  isError?: boolean;
}

const Toast: React.FC<ToastProps> = ({ title, message, xpGain, isError }) => {
  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[10002] animate-slideUp">
      <div className={`${isError ? 'bg-red-500' : 'bg-gradient-to-r from-[#ff4d6d] to-[#b5179e] to-[#4361ee]'} px-6 py-3 rounded-full text-white text-sm font-medium shadow-lg`}>
        <span className="font-semibold">{title}:</span> {message}
        {xpGain && <span className="ml-2 text-yellow-300 font-bold">+{xpGain} XP</span>}
      </div>
    </div>
  );
};

export default Toast;