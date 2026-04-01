import React from 'react';
import { getDomain, getIconForUrl, getVideoThumbnail } from '../../utils/helpers';

interface LinkPreviewProps {
  url: string;
  onConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const LinkPreview: React.FC<LinkPreviewProps> = ({ url, onConfirm }) => {
  const domain = getDomain(url);
  const icon = getIconForUrl(url);
  const thumbnail = getVideoThumbnail(url);

  const handleClick = () => {
    onConfirm(
      'Leave ComeUnity?',
      `<div style="display: flex; flex-direction: column; align-items: center; gap: 12px;">
        <div style="font-size: 48px;">${icon}</div>
        <div style="font-size: 14px; color: var(--text-secondary);">You're about to leave ComeUnity to visit:</div>
        <div style="font-size: 20px; font-weight: 700; color: var(--gradient-2); word-break: break-all;">${domain}</div>
        <div style="font-size: 12px; color: var(--text-tertiary); margin-top: 8px;">The link will open in 3 seconds after confirmation</div>
      </div>`,
      () => {
        setTimeout(() => {
          window.open(url, '_blank');
        }, 3000);
      }
    );
  };

  if (thumbnail) {
    return (
      <div className="link-preview" onClick={handleClick}>
        <img className="preview-image" src={thumbnail} alt="Video thumbnail" />
        <div className="preview-content">
          <div className="preview-icon">{icon}</div>
          <div className="preview-info">
            <div className="preview-domain">{domain}</div>
            <div className="preview-title">Watch on {domain.split('.')[0]}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="link-preview" onClick={handleClick}>
      <div className="preview-content">
        <div className="preview-icon">{icon}</div>
        <div className="preview-info">
          <div className="preview-domain">{domain}</div>
          <div className="preview-title">{domain}</div>
        </div>
      </div>
    </div>
  );
};