import React, { useEffect } from 'react';

interface CelebrationPopupProps {
  isOpen: boolean;
  config: { message: string; xp: number } | null;
}

export const CelebrationPopup: React.FC<CelebrationPopupProps> = ({ isOpen, config }) => {
  useEffect(() => {
    if (isOpen && config) {
      // Create confetti effect
      const container = document.createElement('div');
      container.className = 'confetti';
      document.body.appendChild(container);
      
      for (let i = 0; i < 120; i++) {
        const piece = document.createElement('div');
        piece.className = 'confetti-piece';
        piece.style.left = Math.random() * 100 + '%';
        piece.style.width = Math.random() * 8 + 4 + 'px';
        piece.style.height = Math.random() * 8 + 4 + 'px';
        piece.style.animationDelay = Math.random() * 0.5 + 's';
        container.appendChild(piece);
      }
      
      // Create floating hearts
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          const heart = document.createElement('div');
          heart.className = 'floating-heart';
          const hearts = ['❤️', '💖', '💗', '💓', '💕', '💝', '✨', '🎉'];
          heart.innerHTML = hearts[Math.floor(Math.random() * hearts.length)];
          heart.style.left = Math.random() * window.innerWidth + 'px';
          heart.style.bottom = '0px';
          heart.style.position = 'fixed';
          heart.style.fontSize = (Math.random() * 18 + 14) + 'px';
          heart.style.zIndex = '10001';
          document.body.appendChild(heart);
          setTimeout(() => heart.remove(), 1500);
        }, i * 40);
      }
      
      setTimeout(() => {
        container.remove();
      }, 2500);
    }
  }, [isOpen, config]);

  if (!isOpen || !config) return null;

  const getEmojiAndTitle = (xp: number) => {
    if (xp >= 100) {
      return { emoji: '👑🎉✨🏆', title: 'SUPER FAN! 👑' };
    }
    if (xp >= 70) {
      return { emoji: '🎉✨💖🎨', title: 'AMAZING! 🎉' };
    }
    if (xp >= 50) {
      return { emoji: '💖🎉✨', title: 'WONDERFUL! 💖' };
    }
    return { emoji: '💕✨🎈', title: 'YOU ROCK! ✨' };
  };

  const { emoji, title } = getEmojiAndTitle(config.xp);

  return (
    <div className={`celebration-popup ${isOpen ? 'show' : ''}`}>
      <div className="celebration-emoji">{emoji}</div>
      <div className="celebration-title">{title}</div>
      <div className="celebration-message">{config.message}</div>
      <div className="celebration-xp">+{config.xp} XP ✨</div>
      
      <style>{`
        .celebration-popup {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) scale(0.8);
          background: linear-gradient(145deg, var(--bg-secondary), #0f0f1a);
          border: 2px solid var(--gold);
          border-radius: 48px;
          padding: 28px 24px;
          text-align: center;
          z-index: 10000;
          opacity: 0;
          transition: all 0.4s cubic-bezier(0.34, 1.2, 0.64, 1);
          box-shadow: 0 0 60px rgba(255, 215, 0, 0.5);
          width: 300px;
          backdrop-filter: blur(20px);
          pointer-events: none;
        }
        .celebration-popup.show {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
        .celebration-emoji {
          font-size: 56px;
          margin-bottom: 12px;
          animation: bounce 0.5s ease;
        }
        .celebration-title {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, var(--gold), #ff69b4);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin-bottom: 8px;
        }
        .celebration-message {
          font-size: 14px;
          color: var(--text-secondary);
          margin-bottom: 12px;
          line-height: 1.4;
        }
        .celebration-xp {
          background: rgba(255, 215, 0, 0.2);
          border-radius: 100px;
          padding: 6px 12px;
          display: inline-block;
          font-size: 12px;
          color: var(--gold);
          font-weight: 600;
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
        .confetti {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 9999;
          overflow: hidden;
        }
        .confetti-piece {
          position: absolute;
          width: 10px;
          height: 10px;
          background: linear-gradient(135deg, #ff4d6d, #ffd700, #b5179e);
          animation: confettiFall 2.5s ease-out forwards;
        }
        @keyframes confettiFall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .floating-heart {
          position: fixed;
          color: #ff69b4;
          font-size: 18px;
          pointer-events: none;
          animation: floatUp 1.5s ease-out forwards;
          z-index: 10001;
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-80px) scale(1.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};