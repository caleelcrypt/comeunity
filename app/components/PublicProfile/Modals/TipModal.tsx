'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../../lib/supabaseClient';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  currentUserId: string;
  currentUserCoins: number;
  onTipSuccess: () => void;
}

interface RecentTip {
  id: string;
  sender_name: string;
  message: string;
  amount: number;
  created_at: string;
}

const TipModal: React.FC<TipModalProps> = ({
  isOpen,
  onClose,
  creatorId,
  creatorName,
  creatorAvatar,
  currentUserId,
  currentUserCoins,
  onTipSuccess
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [message, setMessage] = useState('');
  const [messageLength, setMessageLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recentTips, setRecentTips] = useState<RecentTip[]>([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [celebration, setCelebration] = useState<{ show: boolean; amount: number; xp: number; message: string }>({
    show: false,
    amount: 0,
    xp: 0,
    message: ''
  });

  const tipOptions = [
    { amount: 20, xp: 2, icon: '🪙' },
    { amount: 50, xp: 5, icon: '🪙🪙' },
    { amount: 70, xp: 7, icon: '🪙🪙🪙' },
    { amount: 100, xp: 10, icon: '🪙🪙🪙🪙' }
  ];

  // Fetch recent tips for this creator
  useEffect(() => {
    if (isOpen && creatorId) {
      fetchRecentTips();
    }
  }, [isOpen, creatorId]);

  const fetchRecentTips = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        amount,
        message,
        created_at,
        sender:profiles!transactions_sender_id_fkey (
          username,
          first_name,
          last_name
        )
      `)
      .eq('receiver_id', creatorId)
      .eq('type', 'tip')
      .order('created_at', { ascending: false })
      .limit(5);

    if (!error && data) {
      const formattedTips = data.map(tip => ({
        id: tip.id,
        sender_name: tip.sender?.first_name || tip.sender?.username || 'Anonymous',
        message: tip.message || 'Sent a tip! 💖',
        amount: tip.amount,
        created_at: tip.created_at
      }));
      setRecentTips(formattedTips);
    }
  };

  const calculateXP = (amount: number) => {
    return Math.min(50, Math.max(2, Math.floor(amount / 10)));
  };

  const handleSendTip = async () => {
    let amount = selectedAmount;
    if (customAmount && !isNaN(parseInt(customAmount))) {
      amount = parseInt(customAmount);
    }

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (amount < 20) {
      alert('Minimum tip is 20 coins');
      return;
    }

    if (amount > 500) {
      alert('Maximum tip is 500 coins (that\'s very generous!)');
      return;
    }

    if (currentUserCoins < amount) {
      alert(`Insufficient coins! You have ${currentUserCoins} coins. Need ${amount - currentUserCoins} more.`);
      return;
    }

    if (message.length > 40) {
      alert('Message must be 40 characters or less');
      return;
    }

    setShowConfirm(true);
  };

  const confirmTip = async () => {
    let amount = selectedAmount;
    if (customAmount && !isNaN(parseInt(customAmount))) {
      amount = parseInt(customAmount);
    }

    const xpGain = calculateXP(amount!);
    setLoading(true);

    try {
      const { data, error } = await supabase.rpc('process_tip', {
        sender_id_param: currentUserId,
        receiver_id_param: creatorId,
        amount_param: amount,
        message_param: message.trim() || null
      });

      if (error) throw error;

      if (data?.success) {
        setCelebration({
          show: true,
          amount: amount!,
          xp: xpGain,
          message: message.trim()
        });

        await fetchRecentTips();
        onTipSuccess();
        
        setSelectedAmount(null);
        setCustomAmount('');
        setMessage('');
        setMessageLength(0);
        setShowConfirm(false);
        
        setTimeout(() => {
          setCelebration({ show: false, amount: 0, xp: 0, message: '' });
        }, 5000);
        
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        alert(data?.error || 'Failed to send tip');
      }
    } catch (error) {
      console.error('Tip error:', error);
      alert('Failed to send tip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let text = e.target.value;
    if (text.length > 40) {
      text = text.slice(0, 40);
    }
    setMessage(text);
    setMessageLength(text.length);
    
    // Handle auto line break at 20 chars
    if (e.nativeEvent instanceof InputEvent && e.nativeEvent.inputType === 'insertText' && e.nativeEvent.data === ' ') {
      const cursorPos = e.target.selectionStart;
      if (cursorPos > 0) {
        const beforeCursor = text.substring(0, cursorPos);
        const lastNewline = beforeCursor.lastIndexOf('\n');
        const lineStart = lastNewline === -1 ? 0 : lastNewline + 1;
        const lineLength = cursorPos - lineStart;
        
        if (lineLength >= 20) {
          const newValue = text.slice(0, cursorPos - 1) + '\n ' + text.slice(cursorPos);
          setMessage(newValue);
          setTimeout(() => {
            e.target.selectionStart = cursorPos + 1;
            e.target.selectionEnd = cursorPos + 1;
          }, 0);
        }
      }
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    if (value) {
      setSelectedAmount(null);
    }
  };

  if (!isOpen) return null;

  const getCelebrationMessage = (amount: number) => {
    if (amount >= 100) return "an incredible super fan contribution! ⭐👑";
    if (amount >= 70) return "an amazing and generous tip! 🎉✨";
    if (amount >= 50) return "a wonderful show of support! 💖🎨";
    return "a lovely gesture of appreciation! 💕";
  };

  const getCelebrationEmoji = (amount: number) => {
    if (amount >= 100) return "👑🎉✨🏆";
    if (amount >= 70) return "🎉✨💖🎨";
    if (amount >= 50) return "💖🎉✨";
    return "💕✨🎈";
  };

  const getCelebrationTitle = (amount: number) => {
    if (amount >= 100) return "SUPER FAN! 👑";
    if (amount >= 70) return "AMAZING! 🎉";
    if (amount >= 50) return "WONDERFUL! 💖";
    return "YOU ROCK! ✨";
  };

  return (
    <>
      {/* Tip Modal */}
      <div className={`modal ${isOpen ? 'show' : ''}`} onClick={onClose}>
        <div className="tip-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>✨ Support {creatorName}</h3>
            <span className="close-modal" onClick={onClose}>&times;</span>
          </div>
          <div className="modal-body">
            <div className="support-message">
              <i className="fas fa-heart" style={{ color: 'var(--gold)' }}></i>
              Every coin goes 100% to the creator!
              <i className="fas fa-heart" style={{ color: 'var(--gold)' }}></i>
            </div>

            <div className="tip-options-grid">
              {tipOptions.map(option => (
                <div
                  key={option.amount}
                  className={`tip-option-card ${selectedAmount === option.amount ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedAmount(option.amount);
                    setCustomAmount('');
                  }}
                >
                  <div className="tip-coin-icon">
                    {Array.from({ length: Math.floor(option.amount / 25) + 1 }).map((_, i) => (
                      <i key={i} className="fas fa-coins"></i>
                    ))}
                  </div>
                  <div className="tip-amount">{option.amount} 🪙</div>
                  <div className="tip-xp-badge">+{option.xp} XP</div>
                </div>
              ))}
            </div>

            <div className="custom-amount">
              <div className="custom-label">
                <i className="fas fa-edit"></i> Or enter custom amount
              </div>
              <div className="custom-input-wrapper">
                <span className="coin-symbol">🪙</span>
                <input
                  type="number"
                  placeholder="Enter any amount"
                  min="20"
                  max="500"
                  step="1"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                />
              </div>
            </div>

            <div className="custom-message-input">
              <div className="custom-label">
                <i className="fas fa-comment"></i> Add a message (optional, max 40 chars)
              </div>
              <textarea
                rows={2}
                placeholder="Say something nice..."
                value={message}
                onChange={handleMessageChange}
                maxLength={40}
              />
              <div className={`char-counter ${messageLength >= 36 ? 'danger' : messageLength >= 30 ? 'warning' : ''}`}>
                {messageLength}/40
              </div>
            </div>

            <button
              className="send-btn"
              onClick={handleSendTip}
              disabled={loading}
            >
              <i className="fas fa-gift"></i>
              {loading ? 'Sending...' : 'Send Support'}
              <i className="fas fa-heart" style={{ color: 'var(--gold)' }}></i>
            </button>

            <div className="emotional-text">
              💖 Your support means the world to creators! 100% goes to them.
            </div>

            {/* Recent Supporters Section - INSIDE the modal */}
            {recentTips.length > 0 && (
              <div className="recent-tips-section">
                <div className="section-title">
                  <i className="fas fa-heart" style={{ color: 'var(--gradient-1)' }}></i>
                  Recent Supporters
                </div>
                <div className="tips-list">
                  {recentTips.map(tip => (
                    <div key={tip.id} className="tip-item">
                      <div className="tip-icon">
                        <i className="fas fa-user"></i>
                      </div>
                      <div className="tip-details">
                        <div className="tip-user">{tip.sender_name}</div>
                        <div className="tip-message">{tip.message}</div>
                      </div>
                      <div className="tip-amount">{tip.amount} 🪙</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <div className={`modal ${showConfirm ? 'show' : ''}`} onClick={() => setShowConfirm(false)}>
        <div className="tip-modal-content confirm-modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Confirm Tip</h3>
            <span className="close-modal" onClick={() => setShowConfirm(false)}>&times;</span>
          </div>
          <div className="modal-body">
            <div className="confirm-message">
              Tip <strong style={{ color: 'var(--gold)' }}>
                {selectedAmount || (customAmount && parseInt(customAmount))} coins
              </strong> to <strong style={{ color: 'var(--gradient-2)' }}>{creatorName}</strong>?
              {message && (
                <>
                  <br /><br />
                  Message: "{message.substring(0, 40)}"
                </>
              )}
              <br /><br />
              Your support helps them keep creating! 💖
            </div>
            <div className="modal-buttons">
              <button className="modal-btn modal-btn-secondary" onClick={() => setShowConfirm(false)}>
                Cancel
              </button>
              <button className="modal-btn modal-btn-primary" onClick={confirmTip} disabled={loading}>
                {loading ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Celebration Popup */}
      {celebration.show && (
        <div className="celebration-popup show">
          <div className="celebration-emoji">{getCelebrationEmoji(celebration.amount)}</div>
          <div className="celebration-title">{getCelebrationTitle(celebration.amount)}</div>
          <div className="celebration-message">
            You just supported <strong>{creatorName}</strong> with {celebration.amount} coins!<br />
            <span style={{ fontSize: '12px' }}>{celebration.message || getCelebrationMessage(celebration.amount)}</span>
          </div>
          <div className="celebration-xp">+{celebration.xp} XP ✨</div>
        </div>
      )}

      <style jsx>{`
        .support-message {
          text-align: center;
          margin-bottom: 20px;
          font-size: 13px;
          color: var(--text-secondary);
          background: rgba(255, 215, 0, 0.08);
          padding: 10px;
          border-radius: 60px;
        }

        .tip-options-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 20px;
        }

        .tip-option-card {
          background: var(--surface-glass);
          border: 1px solid var(--border-glass);
          border-radius: 24px;
          padding: 14px 10px;
          text-align: center;
          cursor: pointer;
          transition: all 0.25s;
        }

        .tip-option-card.selected {
          border: 2px solid var(--gold);
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.2), rgba(255, 77, 109, 0.1));
          box-shadow: 0 0 12px rgba(255, 215, 0, 0.5);
          transform: scale(1.02);
        }

        .tip-option-card:active {
          transform: scale(0.96);
        }

        .tip-coin-icon {
          font-size: 28px;
          margin-bottom: 8px;
          display: flex;
          justify-content: center;
          gap: 4px;
          color: var(--gold);
        }

        .tip-amount {
          font-size: 24px;
          font-weight: 800;
          color: white;
          margin-bottom: 4px;
        }

        .tip-xp-badge {
          font-size: 10px;
          color: var(--gradient-2);
          margin-top: 6px;
          background: rgba(181, 23, 158, 0.2);
          display: inline-block;
          padding: 2px 10px;
          border-radius: 100px;
        }

        .custom-amount {
          margin-bottom: 16px;
        }

        .custom-label {
          font-size: 12px;
          color: var(--text-secondary);
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .custom-input-wrapper {
          display: flex;
          align-items: center;
          background: var(--surface-glass);
          border: 1px solid var(--border-glass);
          border-radius: 60px;
          padding: 4px 4px 4px 18px;
          transition: all 0.2s;
        }

        .custom-input-wrapper:focus-within {
          border-color: var(--gold);
          box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
        }

        .custom-input-wrapper input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-primary);
          font-size: 15px;
          font-weight: 500;
          outline: none;
          padding: 12px 0;
        }

        .coin-symbol {
          font-size: 18px;
          color: var(--gold);
          margin-right: 4px;
        }

        .custom-message-input {
          margin-bottom: 20px;
        }

        .custom-message-input textarea {
          width: 100%;
          background: var(--surface-glass);
          border: 1px solid var(--border-glass);
          border-radius: 20px;
          padding: 12px 16px;
          color: var(--text-primary);
          font-size: 13px;
          font-family: 'Inter', sans-serif;
          resize: vertical;
          outline: none;
          line-height: 1.5;
        }

        .custom-message-input textarea:focus {
          border-color: var(--gold);
        }

        .char-counter {
          text-align: right;
          font-size: 10px;
          margin-top: 4px;
          color: var(--text-tertiary);
        }

        .char-counter.warning {
          color: #fbbf24;
        }

        .char-counter.danger {
          color: #ef4444;
        }

        .send-btn {
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          border: none;
          border-radius: 100px;
          padding: 14px;
          width: 100%;
          color: white;
          font-weight: 700;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 8px;
        }

        .send-btn:active {
          transform: scale(0.98);
        }

        .emotional-text {
          font-size: 11px;
          color: var(--text-tertiary);
          margin-top: 16px;
          padding-top: 12px;
          border-top: 1px solid var(--border-glass);
          text-align: center;
        }

        .recent-tips-section {
          margin-top: 24px;
        }

        .section-title {
          font-size: 15px;
          font-weight: 600;
          margin-bottom: 14px;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .tips-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 280px;
          overflow-y: auto;
        }

        .tips-list::-webkit-scrollbar {
          width: 4px;
        }

        .tip-item {
          background: var(--surface-glass);
          border-radius: 16px;
          padding: 10px 14px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          border: 1px solid var(--border-glass);
          transition: all 0.2s;
        }

        .tip-icon {
          width: 38px;
          height: 38px;
          background: rgba(255, 215, 0, 0.15);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          color: var(--gold);
          flex-shrink: 0;
        }

        .tip-details {
          flex: 1;
          min-width: 0;
        }

        .tip-user {
          font-weight: 600;
          font-size: 13px;
          color: var(--text-primary);
          display: block;
          margin-bottom: 2px;
        }

        .tip-message {
          font-size: 10px;
          color: var(--text-tertiary);
          word-wrap: break-word;
          white-space: normal;
          line-height: 1.3;
        }

        .tip-amount {
          font-weight: 700;
          color: var(--gold);
          font-size: 16px;
          white-space: nowrap;
          flex-shrink: 0;
        }

        .confirm-modal-content {
          max-width: 320px;
        }

        .confirm-message {
          margin: 16px 0;
          color: var(--text-secondary);
          line-height: 1.5;
          font-size: 14px;
        }

        .modal-buttons {
          display: flex;
          gap: 12px;
          margin-top: 16px;
        }

        .modal-btn {
          flex: 1;
          padding: 12px;
          border-radius: 100px;
          font-weight: 600;
          cursor: pointer;
          border: none;
          font-size: 14px;
        }

        .modal-btn-primary {
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          color: white;
        }

        .modal-btn-secondary {
          background: var(--surface-glass);
          border: 1px solid var(--border-glass);
          color: var(--text-secondary);
        }

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
          background: linear-gradient(135deg, var(--gold), var(--pink));
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
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </>
  );
};

export default TipModal;