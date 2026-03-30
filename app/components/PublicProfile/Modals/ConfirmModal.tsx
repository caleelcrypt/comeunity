'use client';
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  creatorName: string;
  isFollowing: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  creatorName,
  isFollowing,
  onConfirm,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`} onClick={onClose}>
      <div className="modal-content confirm-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3><i className="fas fa-user-plus"></i> Confirm Action</h3>
          <span className="modal-close" onClick={onClose}>&times;</span>
        </div>
        <div className="modal-body">
          <p className="confirm-message">
            {isFollowing ? `Unfollow ${creatorName}?` : `Follow ${creatorName}?`}
          </p>
          <div className="modal-buttons">
            <button className="modal-btn modal-btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="modal-btn modal-btn-primary" onClick={onConfirm}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;