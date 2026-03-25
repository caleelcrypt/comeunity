'use client';
import React from 'react';
import styles from './ConfirmModal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className={`modal ${isOpen ? 'show' : ''}`}>
      <div className="modal-content">
        <h3 style={{ marginBottom: '16px' }}>{title}</h3>
        <p style={{ marginBottom: '20px' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            className="profile-btn primary"
            onClick={onConfirm}
            style={{ background: 'linear-gradient(135deg, #ff4d6d, #4361ee)', color: 'white' }}
          >
            Yes
          </button>
          <button className="profile-btn" onClick={onClose}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}