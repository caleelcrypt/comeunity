import React, { useState } from 'react';

interface TipModalProps {
  isOpen: boolean;
  walletBalance: number;
  onSendTip: (amount: number, message: string) => void;
  onClose: () => void;
}

const TipModal: React.FC<TipModalProps> = ({ isOpen, walletBalance, onSendTip, onClose }) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="w-[90%] max-w-[340px] bg-[#12121a] border border-[#ff4d6d]/30 rounded-3xl p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-4">Support Creator</h2>
        <div className="bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] px-4 py-2 rounded-full inline-block mb-4">
          <span className="text-white">{walletBalance} coins available</span>
        </div>
        <div className="flex gap-2 mb-4">
          {[50, 100, 200, 500].map(amount => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`flex-1 py-3 rounded-xl ${selectedAmount === amount ? 'bg-[#ff4d6d]' : 'bg-white/10'}`}
            >
              {amount}
            </button>
          ))}
        </div>
        <textarea
          className="w-full p-3 bg-white/10 rounded-xl text-white mb-4"
          placeholder="Add a message (optional)"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        <button
          onClick={() => selectedAmount && onSendTip(selectedAmount, message)}
          className="w-full py-3 rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] text-white font-bold"
        >
          Send Tip
        </button>
      </div>
    </div>
  );
};

export default TipModal;