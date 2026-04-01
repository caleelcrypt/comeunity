import React from 'react';

interface PostActionsProps {
  liked: boolean;
  likes: number;
  comments: number;
  onLike: () => void;
  onComment: () => void;
  onTip: () => void;
  onShare: () => void;
}

export const PostActions: React.FC<PostActionsProps> = ({
  liked,
  likes,
  comments,
  onLike,
  onComment,
  onTip,
  onShare
}) => {
  return (
    <div className="post-actions">
      <button className={`action-btn ${liked ? 'liked' : ''}`} onClick={onLike}>
        <i className={`${liked ? 'fas' : 'far'} fa-heart`}></i> {likes}
      </button>
      <button className="action-btn" onClick={onComment}>
        <i className="far fa-comment"></i> {comments}
      </button>
      <button className="action-btn tip-btn" onClick={onTip}>
        <i className="fas fa-coins"></i> Tip
      </button>
      <button className="action-btn" onClick={onShare}>
        <i className="fas fa-share-alt"></i> Share
      </button>
    </div>
  );
};