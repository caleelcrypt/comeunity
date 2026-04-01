// comeunity/app/components/feed/CommentModal.tsx
import React, { useState, useEffect } from 'react';
import { Post, CommentWithInteraction } from '../../types';
import { useSupabase } from '../../hooks/useSupabase';
import { Avatar } from '../common/Avatar';
import { getRelativeTime } from '../../utils/helpers';

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onConfirm: (title: string, message: string, onConfirm: () => void) => void;
  showToast: (message: string, type?: string) => void;
}

export const CommentModal: React.FC<CommentModalProps> = ({
  isOpen,
  onClose,
  post,
  onConfirm,
  showToast
}) => {
  const [comments, setComments] = useState<CommentWithInteraction[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [showReplyInput, setShowReplyInput] = useState<Record<string, boolean>>({});
  const [visibleReplies, setVisibleReplies] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const { fetchComments, createComment, likeComment } = useSupabase();

  useEffect(() => {
    if (isOpen && post) {
      loadComments();
    }
  }, [isOpen, post]);

  const loadComments = async () => {
    if (!post) return;
    setLoading(true);
    const fetchedComments = await fetchComments(post.id);
    setComments(fetchedComments || []); // Ensure it's always an array
    setLoading(false);
  };

  const handleAddComment = async () => {
    if (!post || !newComment.trim()) return;
    
    setSubmitting(true);
    try {
      const comment = await createComment({
        post_id: post.id,
        content: newComment.trim()
      });
      setComments(prev => [comment, ...(prev || [])]);
      setNewComment('');
      showToast('💬 Comment added! +8 XP');
    } catch (err) {
      showToast('Failed to add comment', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddReply = async (parentId: string) => {
    if (!post || !replyText[parentId]?.trim()) return;
    
    setSubmitting(true);
    try {
      const reply = await createComment({
        post_id: post.id,
        content: replyText[parentId].trim(),
        parent_id: parentId
      });
      
      const updateReplies = (commentList: CommentWithInteraction[]): CommentWithInteraction[] => {
        if (!commentList) return [];
        return commentList.map(comment => {
          if (comment.id === parentId) {
            return { ...comment, replies: [reply, ...(comment.replies || [])] };
          }
          if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: updateReplies(comment.replies) };
          }
          return comment;
        });
      };
      
      setComments(prev => updateReplies(prev || []));
      setReplyText(prev => ({ ...prev, [parentId]: '' }));
      setShowReplyInput(prev => ({ ...prev, [parentId]: false }));
      showToast('💬 Reply added! +5 XP');
    } catch (err) {
      showToast('Failed to add reply', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const { liked } = await likeComment(commentId);
      
      const updateLikes = (commentList: CommentWithInteraction[]): CommentWithInteraction[] => {
        if (!commentList) return [];
        return commentList.map(comment => {
          if (comment.id === commentId) {
            return {
              ...comment,
              is_liked: liked,
              likes_count: comment.likes_count + (liked ? 1 : -1)
            };
          }
          if (comment.replies && comment.replies.length > 0) {
            return { ...comment, replies: updateLikes(comment.replies) };
          }
          return comment;
        });
      };
      
      setComments(prev => updateLikes(prev || []));
    } catch (err) {
      showToast('Failed to like comment', 'error');
    }
  };

  const handleDeleteComment = (commentId: string, authorName: string) => {
    onConfirm(
      'Delete Comment',
      `⚠️ Are you sure you want to delete this comment by ${authorName}? This action cannot be undone.`,
      async () => {
        // In a real implementation, you would call a deleteComment API
        showToast('🗑️ Comment deleted');
        await loadComments(); // Reload comments
      }
    );
  };

  const renderComment = (comment: CommentWithInteraction, depth: number = 0) => {
    const hasReplies = comment.replies && comment.replies.length > 0;
    const showReplies = visibleReplies[comment.id] !== false;
    const repliesToShow = showReplies ? comment.replies || [] : [];

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
            {(comment.author_name === 'You' || true) && (
              <span 
                className="comment-action danger"
                onClick={() => handleDeleteComment(comment.id, comment.author_name)}
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
              />
              <button onClick={() => handleAddReply(comment.id)} disabled={submitting}>
                Reply
              </button>
            </div>
          )}
        </div>
        
        {hasReplies && (
          <div className="replies-container">
            {repliesToShow.map(reply => renderComment(reply, depth + 1))}
          </div>
        )}
        
        {hasReplies && !showReplies && comment.replies && comment.replies.length > 0 && (
          <div 
            className="see-more-replies"
            onClick={() => setVisibleReplies(prev => ({ ...prev, [comment.id]: true }))}
          >
            + See {comment.replies.length} more {comment.replies.length === 1 ? 'reply' : 'replies'}
          </div>
        )}
        
        {hasReplies && showReplies && comment.replies && comment.replies.length > 0 && (
          <div 
            className="see-more-replies"
            onClick={() => setVisibleReplies(prev => ({ ...prev, [comment.id]: false }))}
          >
            − Hide replies
          </div>
        )}
      </div>
    );
  };

  if (!isOpen || !post) return null;

  return (
    <div className="comment-modal show" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="comment-modal-content">
        <div className="comment-modal-header">
          <h3>Comments</h3>
          <span className="close-comment" onClick={onClose}>&times;</span>
        </div>
        
        <div className="comments-list">
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-spinner fa-spin"></i>
            </div>
          ) : !comments || comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-tertiary)' }}>
              <i className="fas fa-comment-dots" style={{ fontSize: '32px', marginBottom: '12px', display: 'block' }}></i>
              No comments yet. Be the first to comment!
            </div>
          ) : (
            comments.map(comment => renderComment(comment))
          )}
        </div>
        
        <div className="add-comment-area">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            disabled={submitting}
          />
          <button onClick={handleAddComment} disabled={submitting}>
            {submitting ? '...' : 'Post'}
          </button>
        </div>
      </div>
    </div>
  );
};