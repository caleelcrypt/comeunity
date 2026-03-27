import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  creatorName: string;
  isFollowing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, creatorName, isFollowing, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[10000]" onClick={onClose}>
      <div className="w-[90%] max-w-[340px] bg-[#12121a] border border-[#ff4d6d]/30 rounded-3xl p-7" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-white mb-4">Confirm Action</h3>
        <p className="text-white/70 mb-6">{isFollowing ? `Unfollow ${creatorName}?` : `Follow ${creatorName}?`}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-full bg-white/10 text-white">Cancel</button>
          <button onClick={onConfirm} className="flex-1 py-3 rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] text-white">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;