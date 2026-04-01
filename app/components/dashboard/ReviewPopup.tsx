import React, { useState, useEffect } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import { Review } from '../../types';
import { getRelativeTime } from '../../utils/helpers';

interface ReviewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (message: string, type?: string) => void;
  onConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const ReviewPopup: React.FC<ReviewPopupProps> = ({
  isOpen,
  onClose,
  showToast,
  onConfirm
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState('');
  const [filter, setFilter] = useState<'all' | '5' | '4' | '3' | '2' | '1'>('all');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const { fetchReviews, createReview } = useSupabase();

  useEffect(() => {
    if (isOpen) {
      loadReviews();
    }
  }, [isOpen]);

  const loadReviews = async () => {
    setLoading(true);
    const fetchedReviews = await fetchReviews();
    setReviews(fetchedReviews);
    setLoading(false);
  };

  const handleSubmitReview = async () => {
    if (selectedRating === 0) {
      showToast('✨ Please select a star rating first!');
      return;
    }
    if (!comment.trim()) {
      showToast('✏️ Write something about your experience.');
      return;
    }

    onConfirm(
      'Submit Review',
      `You're about to submit a ${selectedRating}-star review.<br><br>"${comment.substring(0, 80)}${comment.length > 80 ? '...' : ''}"`,
      async () => {
        setSubmitting(true);
        try {
          await createReview(selectedRating, comment.trim());
          showToast('🎉 Review published! +50 XP');
          setSelectedRating(0);
          setComment('');
          await loadReviews();
        } catch (err) {
          showToast('Failed to submit review', 'error');
        } finally {
          setSubmitting(false);
        }
      }
    );
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return sum / reviews.length;
  };

  const getFilteredReviews = () => {
    if (filter === 'all') return reviews;
    return reviews.filter(r => r.rating === parseInt(filter));
  };

  const renderStars = (rating: number, size: 'small' | 'large' = 'small') => {
    const starClass = size === 'large' ? 'popup-stars-big' : 'review-stars-mini';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className={starClass}>
        {'★'.repeat(fullStars)}
        {hasHalfStar && '½'}
        {'☆'.repeat(5 - Math.ceil(rating))}
      </div>
    );
  };

  if (!isOpen) return null;

  const filteredReviews = getFilteredReviews();
  const avgRating = getAverageRating();

  return (
    <div className="review-popup open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="popup-container">
        <div className="popup-header">
          <h2><i className="fas fa-star-of-life"></i> ComeUnity Reviews</h2>
          <div className="popup-close" onClick={onClose}>
            <i className="fas fa-times"></i>
          </div>
        </div>
        
        <div className="popup-body">
          <div className="popup-rating-summary">
            <div className="popup-avg">{avgRating.toFixed(1)}</div>
            {renderStars(avgRating, 'large')}
            <div style={{ fontSize: '12px', color: 'var(--text-tertiary)' }}>
              <span>{reviews.length}</span> authentic reviews
            </div>
          </div>
          
          <div className="filter-row">
            <span 
              className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All
            </span>
            <span 
              className={`filter-chip ${filter === '5' ? 'active' : ''}`}
              onClick={() => setFilter('5')}
            >
              5★
            </span>
            <span 
              className={`filter-chip ${filter === '4' ? 'active' : ''}`}
              onClick={() => setFilter('4')}
            >
              4★
            </span>
            <span 
              className={`filter-chip ${filter === '3' ? 'active' : ''}`}
              onClick={() => setFilter('3')}
            >
              3★
            </span>
            <span 
              className={`filter-chip ${filter === '2' ? 'active' : ''}`}
              onClick={() => setFilter('2')}
            >
              2★
            </span>
            <span 
              className={`filter-chip ${filter === '1' ? 'active' : ''}`}
              onClick={() => setFilter('1')}
            >
              1★
            </span>
          </div>
          
          <div className="star-input-group">
            {[1, 2, 3, 4, 5].map(star => (
              <i
                key={star}
                className={`${selectedRating >= star ? 'fas fa-star active-star' : 'far fa-star'}`}
                onClick={() => setSelectedRating(star)}
              ></i>
            ))}
          </div>
          
          <textarea
            className="review-textarea"
            rows={2}
            placeholder="Share your experience with ComeUnity... 💬"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          
          <button 
            className="popup-submit" 
            onClick={handleSubmitReview}
            disabled={submitting}
          >
            <i className="fas fa-pen-fancy"></i> {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
          
          <div style={{ marginTop: '4px', fontWeight: '600', fontSize: '14px' }}>
            📝 Recent reviews
          </div>
          
          <div className="review-list-popup">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px' }}>
                <i className="fas fa-spinner fa-spin"></i>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="empty-reviews">
                <i className="far fa-comment-dots"></i><br />
                No reviews with this filter.
              </div>
            ) : (
              filteredReviews.map(review => (
                <div key={review.id} className="review-card">
                  <div className="review-card-header">
                    <span className="reviewer-name">
                      <i className="fas fa-user-astronaut"></i> {review.user_name}
                    </span>
                    <div className="review-stars-mini">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                  </div>
                  <div className="review-comment-text">{review.comment}</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)', marginTop: '8px' }}>
                    {getRelativeTime(review.created_at)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .review-popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.92);
          backdrop-filter: blur(24px);
          z-index: 5000;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.2, 0.9, 0.4, 1.1);
          pointer-events: none;
        }
        .review-popup.open {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
        }
        .popup-container {
          width: 340px;
          max-height: 85vh;
          background: linear-gradient(145deg, #13131f, #0c0c12);
          border-radius: 48px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          box-shadow: 0 30px 50px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05);
          overflow: hidden;
          transform: scale(0.95);
          transition: transform 0.25s ease-out;
          display: flex;
          flex-direction: column;
        }
        .review-popup.open .popup-container {
          transform: scale(1);
        }
        .popup-header {
          padding: 20px 24px 12px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-glass);
          background: rgba(255, 255, 255, 0.02);
        }
        .popup-header h2 {
          font-size: 22px;
          font-weight: 700;
          background: linear-gradient(135deg, #ffd966, #ffb347);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .popup-close {
          background: var(--surface-glass);
          width: 36px;
          height: 36px;
          border-radius: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-secondary);
        }
        .popup-close:hover {
          background: rgba(255, 77, 109, 0.3);
          color: white;
          transform: rotate(90deg);
        }
        .popup-body {
          padding: 20px 24px;
          overflow-y: auto;
          flex: 1;
        }
        .popup-rating-summary {
          text-align: center;
          background: rgba(255, 215, 0, 0.05);
          border-radius: 32px;
          padding: 16px;
          margin-bottom: 20px;
        }
        .popup-avg {
          font-size: 44px;
          font-weight: 800;
          color: var(--gold);
          line-height: 1;
        }
        .popup-stars-big {
          letter-spacing: 2px;
          margin: 8px 0 4px;
          font-size: 20px;
          color: var(--gold);
        }
        .filter-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: center;
          margin: 16px 0 20px;
        }
        .filter-chip {
          background: rgba(255, 255, 255, 0.05);
          padding: 6px 14px;
          border-radius: 60px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          color: var(--text-secondary);
        }
        .filter-chip.active,
        .filter-chip:hover {
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          color: white;
          box-shadow: 0 4px 12px rgba(180, 83, 255, 0.3);
        }
        .star-input-group {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin: 20px 0 16px;
        }
        .star-input-group i {
          font-size: 32px;
          cursor: pointer;
          transition: all 0.15s;
          color: #3a3a44;
        }
        .star-input-group i.active-star {
          color: var(--gold);
          text-shadow: 0 0 8px #ffd700;
        }
        .review-textarea {
          width: 100%;
          background: rgba(10, 10, 15, 0.8);
          border: 1px solid var(--border-glass);
          border-radius: 28px;
          padding: 14px 18px;
          color: var(--text-primary);
          font-size: 14px;
          resize: vertical;
          font-family: 'Inter', sans-serif;
          margin: 8px 0 16px;
        }
        .review-textarea:focus {
          outline: none;
          border-color: var(--gradient-2);
        }
        .popup-submit {
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          border: none;
          width: 100%;
          padding: 14px;
          border-radius: 100px;
          font-weight: 700;
          font-size: 16px;
          color: white;
          cursor: pointer;
          transition: 0.2s;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        .popup-submit:hover {
          transform: translateY(-2px);
          filter: brightness(1.05);
        }
        .popup-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
        .review-list-popup {
          max-height: 260px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 8px;
        }
        .review-card {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 24px;
          padding: 14px;
          border: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.2s;
        }
        .review-card-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .reviewer-name {
          font-weight: 600;
          font-size: 13px;
        }
        .review-stars-mini {
          color: var(--gold);
          font-size: 12px;
        }
        .review-comment-text {
          font-size: 12px;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .empty-reviews {
          text-align: center;
          padding: 30px;
          color: var(--text-tertiary);
          font-size: 13px;
        }
      `}</style>
    </div>
  );
};