// comeunity/app/components/feed/Toast.tsx
import React, { useEffect, useState, useCallback, createContext, useContext } from 'react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'error' | 'xp' | 'coin';
  duration?: number;
}

interface ToastProps {
  messages: ToastMessage[];
  onRemove: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ messages, onRemove }) => {
  useEffect(() => {
    messages.forEach(message => {
      const timer = setTimeout(() => {
        onRemove(message.id);
      }, message.duration || 2500);
      
      return () => clearTimeout(timer);
    });
  }, [messages, onRemove]);

  const getIcon = (type?: string) => {
    switch (type) {
      case 'success':
        return <i className="fas fa-check-circle"></i>;
      case 'error':
        return <i className="fas fa-exclamation-circle"></i>;
      case 'coin':
        return <i className="fas fa-coins"></i>;
      case 'xp':
        return <i className="fas fa-star"></i>;
      default:
        return <i className="fas fa-gem"></i>;
    }
  };

  const getBackground = (type?: string) => {
    switch (type) {
      case 'success':
        return 'linear-gradient(135deg, #10b981, #059669)';
      case 'error':
        return 'linear-gradient(135deg, #ef4444, #dc2626)';
      case 'coin':
        return 'linear-gradient(135deg, #ffd700, #ffaa00)';
      case 'xp':
        return 'linear-gradient(135deg, #a855f7, #7c3aed)';
      default:
        return 'linear-gradient(135deg, var(--gradient-1), var(--gradient-3))';
    }
  };

  const getTextColor = (type?: string) => {
    if (type === 'coin') return '#1a1a1a';
    return 'white';
  };

  return (
    <div className="toast-container">
      {messages.map(message => (
        <div
          key={message.id}
          className="toast-item"
          style={{
            background: getBackground(message.type),
            color: getTextColor(message.type)
          }}
        >
          <span className="toast-icon">{getIcon(message.type)}</span>
          <span className="toast-message">{message.message}</span>
        </div>
      ))}
      
      <style>{`
        .toast-container {
          position: fixed;
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2100;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          pointer-events: none;
        }
        .toast-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 100px;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
          animation: toastSlideUp 0.3s ease forwards;
          white-space: nowrap;
          pointer-events: auto;
        }
        .toast-icon {
          font-size: 14px;
        }
        .toast-message {
          line-height: 1;
        }
        @keyframes toastSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @media (max-width: 480px) {
          .toast-item {
            font-size: 12px;
            padding: 10px 20px;
            bottom: 80px;
          }
        }
      `}</style>
    </div>
  );
};

// Toast Context
interface ToastContextType {
  showToast: (message: string, type?: 'info' | 'success' | 'error' | 'xp' | 'coin', duration?: number) => void;
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' | 'xp' | 'coin' = 'info', duration: number = 2500) => {
    const id = Date.now().toString();
    setMessages(prev => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      setMessages(prev => prev.filter(m => m.id !== id));
    }, duration);
  }, []);

  const hideToast = useCallback((id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <Toast messages={messages} onRemove={hideToast} />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};