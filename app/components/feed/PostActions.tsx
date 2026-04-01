// comeunity/app/components/feed/PostActions.tsx
import React from 'react';
import { ShowToastFunction } from '../../types'; // Add this import

interface PostActionsProps {
  liked: boolean;
  likes: number;
  comments: number;
  onLike: () => void;
  onComment: () => void;
  onTip: () => void;
  onShare: () => void;
  isOwnPost?: boolean;
  showToast?: ShowToastFunction; // Change this line
}

export const PostActions: React.FC<PostActionsProps> = ({
  liked,
  likes,
  comments,
  onLike,
  onComment,
  onTip,
  onShare,
  isOwnPost = false,
  showToast
}) => {
  const handleTip = () => {
    if (isOwnPost) {
      if (showToast) showToast('💡 You cannot tip your own post', 'info');
      return;
    }
    onTip();
  };

  const handleShare = () => {
    onShare();
  };

  return (
    <div className="post-actions">
      <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={onLike}>
        <i className={`${liked ? 'fas' : 'far'} fa-heart`}></i> {likes}
      </button>
      <button className="action-btn" onClick={onComment}>
        <i className="far fa-comment"></i> {comments}
      </button>
      <button className="action-btn tip-btn" onClick={handleTip}>
        <i className="fas fa-coins"></i> Tip
      </button>
      <button className="action-btn" onClick={handleShare}>
        <i className="fas fa-share-alt"></i> Share
      </button>
    </div>
  );
};