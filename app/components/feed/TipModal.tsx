import React, { useState } from 'react';
import { Post } from '../../types';
import { useSupabase } from '../../hooks/useSupabase';
import { TIP_OPTIONS } from '../../utils/constants';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onConfirm: (title: string, message: string, onConfirm: () => void) => void;
  showToast: (message: string, type?: string) => void;
}

export const TipModal: React.FC<TipModalProps> = ({
  isOpen,
  onClose,
  post,
  onConfirm,
  showToast
}) => {
  const [selectedCoins, setSelectedCoins] = useState<number | null>(null);
  const [customCoins, setCustomCoins] = useState<string>('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { sendTip } = useSupabase();

  const handleSelectOption = (coins: number) => {
    setSelectedCoins(coins);
    setCustomCoins('');
  };

  const handleCustomChange = (value: string) => {
    setCustomCoins(value);
    setSelectedCoins(null);
  };

  const getCoinsAmount = (): number => {
    if (selectedCoins) return selectedCoins;
    if (customCoins) return parseInt(customCoins);
    return 0;
  };

  const getXpGain = (coins: number): number => {
    return Math.floor(coins / 10);
  };

  const handleSendTip = async () => {
    const amount = getCoinsAmount();
    if (!post) return;
    
    if (amount < 20) {
      showToast('💎 Minimum tip is 20 coins');
      return;
    }
    if (amount > 500) {
      showToast('💎 Maximum tip is 500 coins');
      return;
    }
    
    onConfirm(
      'Confirm Tip',
      `Tip <strong style="color:var(--gold);">${amount} coins</strong> to <strong style="color:var(--gradient-2);">${post.author_name}</strong>?${message ? `<br><br>Message: "${message}"` : ''}<br><br>Your support helps them keep creating! 💖`,
      async () => {
        setIsSending(true);
        try {
          const { xpGain } = await sendTip(post.author_id, post.id, amount, message || undefined);
          showToast(`💎 You tipped ${amount} coins to ${post.author_name}! +${xpGain} XP`, 'coin');
          onClose();
        } catch (err) {
          showToast(err instanceof Error ? err.message : 'Failed to send tip', 'error');
        } finally {
          setIsSending(false);
        }
      }
    );
  };

  if (!isOpen || !post) return null;

  const displayAmount = getCoinsAmount();
  const xpGain = getXpGain(displayAmount);

  return (
    <div className="modal show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content tip-modal-content">
        <div className="modal-header">
          <h3>✨ Support {post.author_name.split(' ')[0]}</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        
        <div className="modal-body">
          <div className="support-message">
            <i className="fas fa-heart" style={{ color: 'var(--gold)' }}></i> 
            Every coin goes 100% to the creator! 
            <i className="fas fa-heart" style={{ color: 'var(--gold)' }}></i>
          </div>
          
          <div className="tip-options-grid">
            {TIP_OPTIONS.map(option => (
              <div
                key={option.coins}
                className={`tip-option-card ${selectedCoins === option.coins ? 'selected' : ''}`}
                onClick={() => handleSelectOption(option.coins)}
              >
                <div className="tip-coin-icon">
                  {Array(Math.min(4, Math.floor(option.coins / 20))).fill(0).map((_, i) => (
                    <i key={i} className="fas fa-coins"></i>
                  ))}
                </div>
                <div className="tip-amount">{option.coins} 🪙</div>
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
                step="1"
                value={customCoins}
                onChange={(e) => handleCustomChange(e.target.value)}
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
              onChange={(e) => setMessage(e.target.value.slice(0, 40))}
            />
            <div className="char-counter">{message.length}/40</div>
          </div>
          
          <button 
            className="send-btn" 
            onClick={handleSendTip}
            disabled={isSending || displayAmount === 0}
          >
            {isSending ? (
              <><i className="fas fa-spinner fa-spin"></i> Sending...</>
            ) : (
              <><i className="fas fa-gift"></i> Send {displayAmount > 0 ? `${displayAmount} Coins` : 'Support'} <i className="fas fa-heart" style={{ color: 'var(--gold)' }}></i></>
            )}
          </button>
          
          {displayAmount > 0 && (
            <div className="emotional-text">
              ✨ You'll earn +{xpGain} XP for your support!
            </div>
          )}
          <div className="emotional-text">
            💖 Your support means the world to creators! 100% goes to them.
          </div>
        </div>
      </div>
    </div>
  );
};