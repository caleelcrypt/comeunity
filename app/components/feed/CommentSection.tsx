import React, { useState, useEffect } from 'react';
import { CommentWithInteraction } from '../../types';
import { Avatar } from '../common/Avatar';
import { getRelativeTime } from '../../utils/helpers';

interface CommentSectionProps {
  comments: CommentWithInteraction[];
  postId: string;
  onAddComment: (content: string, parentId?: string | null) => Promise<void>;
  onLikeComment: (commentId: string) => Promise<void>;
  onDeleteComment?: (commentId: string) => Promise<void>;
  currentUserId?: string;
  loading?: boolean;
  showToast?: (message: string, type?: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  comments,
  postId,
  onAddComment,
  onLikeComment,
  onDeleteComment,
  currentUserId,
  loading = false,
  showToast
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>({});
  const [visibleReplies, setVisibleReplies] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    try {
      await onAddComment(newComment.trim());
      setNewComment('');
      if (showToast) showToast('💬 Comment added! +8 XP');
    } catch (err) {
      if (showToast) showToast('Failed to add comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!replyText[parentId]?.trim()) return;
    
    setSubmitting(true);
    try {
      await onAddComment(replyText[parentId].trim(), parentId);
      setReplyText(prev => ({ ...prev, [parentId]: '' }));
      setShowReplyInput(prev => ({ ...prev, [parentId]: false }));
      if (showToast) showToast('💬 Reply added! +5 XP');
    } catch (err) {
      if (showToast) showToast('Failed to add reply', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await onLikeComment(commentId);
    } catch (err) {
      if (showToast) showToast('Failed to like comment', 'error');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (onDeleteComment) {
      try {
        await onDeleteComment(commentId);
        if (showToast) showToast('🗑️ Comment deleted');
      } catch (err) {
        if (showToast) showToast('Failed to delete comment', 'error');
      }
    }
  };

  const toggleReplies = (commentId: string) => {
    setVisibleReplies(prev => ({ ...prev, [commentId]: !prev[commentId] }));
  };

  const renderComment = (comment: CommentWithInteraction, depth: number = 0) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const showReplies = visibleReplies[comment.id] !== false;
    const repliesToShow = showReplies ? comment.replies : [];
    // FIXED: use user_id instead of author_id
    const isOwnComment = currentUserId === comment.user_id;

    return (
      <div key={comment.id} className="comment-thread" style={{ marginLeft: depth * 20 }}>
        <div className="comment-item">
          <div className="comment-header">
            <Avatar src={comment.author_avatar} alt={comment.author_name} size={32} />
            <div className="comment-author-info">
              <div className="comment-author">{comment.author_name}</div>
              <div className="comment-time">{getRelativeTime(new Date(comment.created_at))}</div>
            </div>
          </div>
          <div className="comment-text">{comment.content}</div>
          <div className="comment-actions">
            <span 
              className={`comment-action ${comment.is_liked ? 'liked' : ''}`}
              onClick={() => handleLikeComment(comment.id)}
            >
              ❤️ {comment.likes_count}
            </span>
            <span 
              className="comment-action"
              onClick={() => setShowReplyInput(prev => ({ ...prev, [comment.id]: !prev[comment.id] }))}
            >
              💬 Reply
            </span>
            {(isOwnComment || onDeleteComment) && (
              <span 
                className="comment-action danger"
                onClick={() => handleDeleteComment(comment.id)}
              >
                🗑️ Delete
              </span>
            )}
          </div>
          
          {showReplyInput[comment.id] && (
            <div className="reply-input">
              <input
                type="text"
                placeholder="Write a reply..."
                value={replyText[comment.id] || ''}
                onChange={(e) => setReplyText(prev => ({ ...prev, [comment.id]: e.target.value }))}
                onKeyPress={(e) => e.key === 'Enter' && handleAddReply(comment.id)}
                disabled={submitting}
              />
              <button onClick={() => handleAddReply(comment.id)} disabled={submitting}>
                Reply
              </button>
            </div>
          )}
        </div>
        
        {hasReplies && (
          <div className="replies-container">
            {repliesToShow?.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
        
        {hasReplies && !showReplies && (
          <div 
            className="see-more-replies"
            onClick={() => toggleReplies(comment.id)}
          >
            + See {comment.replies?.length} more {comment.replies?.length === 1 ? 'reply' : 'replies'}
          </div>
        )}
        
        {hasReplies && showReplies && comment.replies && comment.replies.length > 0 && (
          <div 
            className="see-more-replies"
            onClick={() => toggleReplies(comment.id)}
          >
            − Hide replies
          </div>
        )}
      </div>
    );
  };

  const groupCommentsByDate = (commentList: CommentWithInteraction[]) => {
    const groups: Record<string, CommentWithInteraction[]> = {};
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    commentList.forEach(comment => {
      const commentDate = new Date(comment.created_at);
      let group = '';
      if (commentDate >= today) group = 'Today';
      else if (commentDate >= yesterday) group = 'Yesterday';
      else if (commentDate >= new Date(today.setDate(today.getDate() - 7))) group = 'This Week';
      else group = 'Older';
      
      if (!groups[group]) groups[group] = [];
      groups[group].push(comment);
    });
    
    return groups;
  };

  if (loading) {
    return (
      <div className="comment-section-loading">
        <i className="fas fa-spinner fa-spin"></i>
        <span>Loading comments...</span>
      </div>
    );
  }

  const groupedComments = groupCommentsByDate(comments);

  return (
    <div className="comment-section">
      <div className="comment-section-header">
        <h3>Comments ({comments.length})</h3>
      </div>
      
      <div className="add-comment-area">
        <Avatar src={undefined} alt="You" size={36} />
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
          disabled={submitting}
        />
        <button onClick={handleAddComment} disabled={submitting || !newComment.trim()}>
          {submitting ? '...' : 'Post'}
        </button>
      </div>
      
      <div className="comments-list">
        {comments.length === 0 ? (
          <div className="empty-comments">
            <i className="fas fa-comment-dots"></i>
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          Object.entries(groupedComments).map(([group, groupComments]) => (
            <div key={group} className="comment-group">
              <div className="comment-group-header">{group}</div>
              {groupComments.map(comment => renderComment(comment))}
            </div>
          ))
        )}
      </div>
      
      <style>{`
        .comment-section {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .comment-section-header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-glass);
        }
        .comment-section-header h3 {
          font-size: 16px;
          font-weight: 600;
        }
        .add-comment-area {
          padding: 16px 20px;
          display: flex;
          gap: 12px;
          align-items: center;
          border-bottom: 1px solid var(--border-glass);
          background: var(--bg-secondary);
        }
        .add-comment-area input {
          flex: 1;
          background: var(--surface-glass);
          border: 1px solid var(--border-glass);
          border-radius: 100px;
          padding: 10px 16px;
          color: var(--text-primary);
          font-size: 13px;
          outline: none;
        }
        .add-comment-area input:focus {
          border-color: var(--gradient-2);
        }
        .add-comment-area button {
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          border: none;
          border-radius: 100px;
          padding: 8px 20px;
          color: white;
          font-weight: 600;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .add-comment-area button:hover:not(:disabled) {
          transform: translateY(-1px);
          filter: brightness(1.05);
        }
        .add-comment-area button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .comments-list {
          flex: 1;
          overflow-y: auto;
          padding: 16px 20px;
        }
        .comment-group {
          margin-bottom: 24px;
        }
        .comment-group-header {
          font-size: 12px;
          font-weight: 600;
          color: var(--gradient-2);
          margin-bottom: 12px;
          padding-left: 8px;
          border-left: 3px solid var(--gradient-2);
        }
        .comment-thread {
          position: relative;
          margin-bottom: 16px;
        }
        .comment-item {
          background: var(--surface-glass);
          border-radius: 20px;
          padding: 12px;
          margin-bottom: 8px;
          position: relative;
        }
        .comment-header {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 8px;
        }
        .comment-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 600;
          flex-shrink: 0;
          overflow: hidden;
        }
        .comment-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .comment-author-info {
          flex: 1;
        }
        .comment-author {
          font-weight: 700;
          font-size: 13px;
        }
        .comment-time {
          font-size: 10px;
          color: var(--text-tertiary);
        }
        .comment-text {
          font-size: 13px;
          color: var(--text-secondary);
          line-height: 1.4;
          margin-bottom: 8px;
        }
        .comment-actions {
          display: flex;
          gap: 12px;
          font-size: 11px;
        }
        .comment-action {
          cursor: pointer;
          color: var(--text-tertiary);
          transition: all 0.2s;
        }
        .comment-action:hover {
          color: var(--gradient-2);
        }
        .comment-action.liked {
          color: var(--gradient-1);
        }
        .comment-action.danger {
          color: #ff4d6d;
        }
        .replies-container {
          position: relative;
          margin-left: 20px;
          margin-top: 4px;
          padding-left: 20px;
        }
        .replies-container::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, var(--gradient-2), var(--gradient-3));
          border-radius: 2px;
          opacity: 0.5;
        }
        .see-more-replies {
          font-size: 11px;
          color: var(--gradient-2);
          cursor: pointer;
          margin: 8px 0 8px 40px;
          display: inline-block;
          background: var(--surface-glass);
          padding: 4px 12px;
          border-radius: 100px;
          transition: all 0.2s;
        }
        .see-more-replies:hover {
          background: var(--surface-glass-hover);
          transform: translateX(4px);
        }
        .reply-input {
          display: flex;
          gap: 10px;
          margin-top: 10px;
          align-items: center;
        }
        .reply-input input {
          flex: 1;
          background: var(--surface-glass);
          border: 1px solid var(--border-glass);
          border-radius: 100px;
          padding: 8px 14px;
          color: var(--text-primary);
          font-size: 12px;
          outline: none;
        }
        .reply-input input:focus {
          border-color: var(--gradient-2);
        }
        .reply-input button {
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          border: none;
          border-radius: 100px;
          padding: 6px 16px;
          color: white;
          font-size: 11px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .reply-input button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .reply-input button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .empty-comments {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-tertiary);
        }
        .empty-comments i {
          font-size: 48px;
          margin-bottom: 16px;
          display: block;
        }
        .empty-comments p {
          font-size: 14px;
        }
        .comment-section-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px;
          color: var(--text-tertiary);
        }
        .comment-section-loading i {
          font-size: 32px;
          margin-bottom: 12px;
        }
      `}</style>
    </div>
  );
};