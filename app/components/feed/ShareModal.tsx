import React from 'react';
import { Post } from '../../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  showToast: (message: string, type?: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, post, showToast }) => {
  const shareToX = () => {
    const text = encodeURIComponent(`Check out this amazing work by ${post?.author_name} on ComeUnity!`);
    const url = encodeURIComponent(window.location.href);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    showToast('📤 Shared to X');
    onClose();
  };

  const shareToWhatsApp = () => {
    const text = encodeURIComponent(`Check out this amazing work by ${post?.author_name} on ComeUnity! ${window.location.href}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    showToast('📤 Shared to WhatsApp');
    onClose();
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
    showToast('📤 Shared to Facebook');
    onClose();
  };

  if (!isOpen || !post) return null;

  return (
    <div className="modal show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Share</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        <div className="share-buttons">
          <div className="share-btn x" onClick={shareToX}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231z"/>
            </svg>
          </div>
          <div className="share-btn whatsapp" onClick={shareToWhatsApp}>
            <i className="fab fa-whatsapp"></i>
          </div>
          <div className="share-btn facebook" onClick={shareToFacebook}>
            <i className="fab fa-facebook-f"></i>
          </div>
        </div>
      </div>
    </div>
  );
};