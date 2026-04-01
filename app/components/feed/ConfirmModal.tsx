import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: { title: string; message: string; onConfirm: () => void } | null;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose, config }) => {
  const handleConfirm = () => {
    if (config?.onConfirm) {
      config.onConfirm();
    }
    onClose();
  };

  if (!isOpen || !config) return null;

  return (
    <div className="modal show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>{config.title}</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        <p dangerouslySetInnerHTML={{ __html: config.message }} style={{ marginBottom: '16px' }}></p>
        <div className="modal-buttons">
          <button className="modal-btn modal-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn modal-btn-primary" onClick={handleConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};