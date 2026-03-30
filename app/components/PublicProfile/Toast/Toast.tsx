'use client';
import React, { useEffect, useState } from 'react';

interface ToastProps {
  title: string;
  message: string;
  xpGain?: number;
  isError?: boolean;
}

const Toast: React.FC<ToastProps> = ({ title, message, xpGain, isError = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`toast-notification ${isVisible ? 'show' : ''}`}>
      <div className="toast-content">
        <div className="toast-icon" style={{ background: isError ? '#ff4757' : 'linear-gradient(135deg, var(--gradient-1), var(--gradient-3))' }}>
          {isError ? '⚠️' : '💖'}
        </div>
        <div className="toast-text">
          <div className="toast-title">{title}</div>
          <div className="toast-message">{message}</div>
        </div>
        {xpGain && (
          <div className="toast-xp">
            <i className="fas fa-star"></i> +{xpGain} XP
          </div>
        )}
      </div>
    </div>
  );
};

export default Toast;