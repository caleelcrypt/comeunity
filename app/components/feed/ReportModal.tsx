import React, { useState } from 'react';
import { Post } from '../../types';
import { REPORT_REASONS } from '../../utils/constants';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onSubmitReport: (postId: string, reason: string) => Promise<boolean>;
  onConfirm: (title: string, message: string, onConfirm: () => void) => void;
  showToast: (message: string, type?: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  post,
  onSubmitReport,
  onConfirm,
  showToast
}) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const handleReport = (reason: string) => {
    if (!post) return;
    
    onConfirm(
      '⚠️ Report Content',
      `<div style="text-align: center;">
        <i class="fas fa-gavel" style="font-size: 32px; color: var(--danger); margin-bottom: 12px; display: block;"></i>
        <strong style="color: var(--danger);">False reporting may result in penalties!</strong>
        <br><br>
        Are you sure you want to report <strong style="color:var(--gradient-2);">@${post.author_name}</strong> for <strong style="color:var(--danger);">"${reason}"</strong>?
        <br><br>
        <span style="font-size: 12px; color: var(--text-tertiary);">Our team will review your report. False reports can lead to account restrictions.</span>
      </div>`,
      async () => {
        const success = await onSubmitReport(post.id, reason);
        if (success) {
          showToast(`📢 Report sent for @${post.author_name}: ${reason}`);
          onClose();
        } else {
          showToast('Failed to submit report', 'error');
        }
      }
    );
  };

  if (!isOpen || !post) return null;

  return (
    <div className="modal show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content">
        <div className="modal-header">
          <h3>Report</h3>
          <span className="close-modal" onClick={onClose}>&times;</span>
        </div>
        <div className="report-options">
          {REPORT_REASONS.map(reason => (
            <div
              key={reason}
              className="report-reason"
              onClick={() => handleReport(reason)}
            >
              {reason === 'Sexual Harassment' && '⚠️ '}
              {reason === 'Violence' && '💢 '}
              {reason === 'Hate Speech' && '😠 '}
              {reason === 'Harassment' && '💬 '}
              {reason === 'Spam' && '📢 '}
              {reason === 'Misinformation' && '❌ '}
              {reason === 'Copyright Infringement' && '©️ '}
              {reason === 'Impersonation' && '🎭 '}
              {reason}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};