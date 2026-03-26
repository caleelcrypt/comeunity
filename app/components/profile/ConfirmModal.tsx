'use client';
import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message }: ConfirmModalProps) {
  if (!isOpen) return null;

  const modalStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.96)',
    backdropFilter: 'blur(20px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000000, // Higher than avatar shop (999999)
    pointerEvents: 'auto'
  };

  const contentStyle: React.CSSProperties = {
    width: '90%',
    maxWidth: '340px',
    background: 'linear-gradient(145deg, #12121a, #0a0a0f)',
    border: '1px solid rgba(255, 77, 109, 0.3)',
    borderRadius: '36px',
    padding: '28px',
    boxShadow: '0 25px 45px rgba(0, 0, 0, 0.5)'
  };

  return (
    <div style={modalStyle}>
      <div style={contentStyle}>
        <h3 style={{ marginBottom: '16px', fontSize: '20px', fontWeight: 'bold', color: 'white' }}>{title}</h3>
        <p style={{ marginBottom: '20px', color: 'rgba(255,255,255,0.8)' }}>{message}</p>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '12px',
              background: 'linear-gradient(135deg, #ff4d6d, #4361ee)',
              border: 'none',
              borderRadius: '100px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Yes
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: '12px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '100px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}