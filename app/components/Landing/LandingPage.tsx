'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';

export default function LandingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [creatorCount, setCreatorCount] = useState(1234);
  const [toast, setToast] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsLoggedIn(!!session);
    };
    checkAuth();
  }, []);

  // Save referral code to localStorage
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode) {
      localStorage.setItem('comeunity_referral', refCode);
    }
  }, [searchParams]);

  // Check if user is already logged in - redirect to feed
  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/feed');
      }
    };
    checkAuthAndRedirect();
  }, [router]);

  // Animate creator count
  useEffect(() => {
    const interval = setInterval(() => {
      setCreatorCount(prev => {
        if (prev < 1250) {
          return prev + Math.floor(Math.random() * 3);
        }
        clearInterval(interval);
        return prev;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const showToastMessage = (message: string, isError: boolean = false) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  };

  const handleLogin = () => {
  router.push('/auth?tab=login');
};

  const handleSignUp = () => {
  router.push('/auth?tab=signup');

  const handleGetStarted = () => {
  router.push('/auth?tab=signup');
};
};

  const openReviewModal = () => {
    setShowReviewModal(true);
    setSelectedRating(0);
    setReviewText('');
    setShowDropdown(false);
  };

  const closeReviewModal = () => {
    setShowReviewModal(false);
  };

  const submitReview = async () => {
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    // Close modal and redirect to auth page with signup tab active
    closeReviewModal();
    router.push('/auth?tab=signup');
    return;
  }
  
  if (selectedRating === 0) {
    showToastMessage("Please select a rating", true);
    return;
  }
  
  if (!reviewText.trim()) {
    showToastMessage("Please share your experience", true);
    return;
  }
  
  // Here you would save the review to Supabase
  showToastMessage(`⭐ Thank you for your ${selectedRating}-star review! +50 XP`);
  closeReviewModal();
  setCreatorCount(prev => prev + 1);
};

  const showNotification = (message: string) => {
    showToastMessage(message);
    setShowDropdown(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('dropdownMenu');
      const menuButton = document.getElementById('menuButton');
      if (showDropdown && dropdown && menuButton && 
          !dropdown.contains(event.target as Node) && 
          !menuButton.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showDropdown]);

  return (
    <div className="app-container">
      <div className="app-wrapper">
        {/* Header with Menu Button */}
        <div className="landing-header">
          <div className="menu-button" id="menuButton" onClick={() => setShowDropdown(!showDropdown)}>
            <i className="fas fa-ellipsis-v"></i>
          </div>
          <div className={`dropdown-menu ${showDropdown ? 'open' : ''}`} id="dropdownMenu">
            <div className="dropdown-item" onClick={() => showNotification('Community Guidelines')}>
              <i className="fas fa-handshake"></i>
              <span>ComeUnity Guidelines</span>
            </div>
            <div className="dropdown-item" onClick={() => showNotification('Privacy Policy')}>
              <i className="fas fa-shield-alt"></i>
              <span>Privacy Policy</span>
            </div>
            <div className="dropdown-item" onClick={() => showNotification('Terms of Service')}>
              <i className="fas fa-file-contract"></i>
              <span>Terms of Service</span>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item" onClick={openReviewModal}>
              <i className="fas fa-star"></i>
              <span>Leave a Review</span>
            </div>
          </div>
        </div>

        {/* Logo Section */}
        <div className="logo-section">
          <div className="logo">
            <span>COME</span><span>UNITY</span>
          </div>
          <div className="tagline">The Home for Creators</div>
        </div>

        {/* Trending Card */}
        <div className="trending-card">
          <div className="card-header">
            <i className="fas fa-fire"></i>
            <span>Trending Creators</span>
          </div>
          <div className="trending-list">
            <div className="trending-item" onClick={() => showNotification("Viewing Jessica Parker's piece")}>
              <div className="trending-left">
                <div className="trending-icon">🎨</div>
                <div className="trending-info">
                  <div className="trending-title">Jessica Parker</div>
                  <div className="trending-meta">Artist</div>
                </div>
              </div>
              <div className="trending-value">+1,240 views</div>
            </div>
            <div className="trending-item" onClick={() => showNotification("Viewing Mike Chen's timelapse")}>
              <div className="trending-left">
                <div className="trending-icon">🎬</div>
                <div className="trending-info">
                  <div className="trending-title">Mike Chen</div>
                  <div className="trending-meta">Music</div>
                </div>
              </div>
              <div className="trending-value">89 likes</div>
            </div>
            <div className="trending-item" onClick={() => showNotification("Viewing weekly leaderboard")}>
              <div className="trending-left">
                <div className="trending-icon">🏆</div>
                <div className="trending-info">
                  <div className="trending-title">Weekly leaderboard</div>
                  <div className="trending-meta">Who's #1 this week?</div>
                </div>
              </div>
              <div className="trending-value">🔥 2,450 XP</div>
            </div>
          </div>
        </div>

        {/* Top Units Leaderboard */}
        <div className="leaderboard-card">
          <div className="card-header">
            <i className="fas fa-trophy"></i>
            <span>Top Unities This Week</span>
          </div>
          <div className="leaderboard-list">
            <div className="leaderboard-rank-item" onClick={() => showNotification("Viewing Digital Artists Unity")}>
              <div className="rank-number">1</div>
              <div className="rank-avatar">🎨</div>
              <div className="rank-info">
                <div className="rank-name">Digital Art</div>
                <div className="rank-stats">12.4K Units • 234 online</div>
              </div>
              <div className="rank-xp">12,450 XP</div>
            </div>
            <div className="leaderboard-rank-item" onClick={() => showNotification("Viewing Music Makers Unity")}>
              <div className="rank-number">2</div>
              <div className="rank-avatar">🎵</div>
              <div className="rank-info">
                <div className="rank-name">Music Makers</div>
                <div className="rank-stats">8.7K Units • 156 online</div>
              </div>
              <div className="rank-xp">8,900 XP</div>
            </div>
            <div className="leaderboard-rank-item" onClick={() => showNotification("Viewing Gaming Hub Unity")}>
              <div className="rank-number">3</div>
              <div className="rank-avatar">🎮</div>
              <div className="rank-info">
                <div className="rank-name">Gaming Hub</div>
                <div className="rank-stats">15.3K Units • 890 online</div>
              </div>
              <div className="rank-xp">7,200 XP</div>
            </div>
          </div>
        </div>

        {/* Auth Section */}
        <div className="auth-section">
          <div className="auth-buttons">
            <button className="auth-btn login-btn" onClick={handleLogin}>
              <i className="fas fa-sign-in-alt"></i> Log In
            </button>
            <button className="auth-btn signup-btn" onClick={handleSignUp}>
              <i className="fas fa-user-plus"></i> Sign Up
            </button>
          </div>
          <div className="social-count">
            <i className="fas fa-users"></i>
            <span>Join <span className="count-number">{creatorCount.toLocaleString()}</span> creators already here</span>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <div className={`modal ${showReviewModal ? 'show' : ''}`} id="reviewModal">
        <div className="modal-content">
          <div className="modal-header">
            <h3>Leave a Review</h3>
            <span className="close-modal" onClick={closeReviewModal}>&times;</span>
          </div>
          <div className="rating-stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fas fa-star star ${star <= (hoverRating || selectedRating) ? 'active' : ''}`}
                onClick={() => setSelectedRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{ cursor: 'pointer' }}
              ></i>
            ))}
          </div>
          <textarea
            className="review-textarea"
            rows={3}
            placeholder="Share your experience with ComeUnity..."
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
          ></textarea>
          <button className="submit-review-btn" onClick={submitReview}>
            Submit Review
          </button>
          <p style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.4)', textAlign: 'center', marginTop: '12px' }}>
            Your feedback helps us grow
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className="toast">
          <i className="fas fa-info-circle"></i> {toast}
        </div>
      )}
    </div>
  );
}