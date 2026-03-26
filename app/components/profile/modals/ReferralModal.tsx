'use client';
import React, { useState, useEffect } from 'react';
import styles from './ReferralModal.module.css';

interface ReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
  referralInvites: number;
  referralXPEarned: number;
  onCopyCode: () => void;
  onShare: (platform: string, referralLink: string) => void;
}

export default function ReferralModal({
  isOpen,
  onClose,
  referralCode,
  referralInvites,
  referralXPEarned,
  onCopyCode,
  onShare
}: ReferralModalProps) {
  const [referralLink, setReferralLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && referralCode) {
      const domain = window.location.origin;
      setReferralLink(`${domain}/signup?ref=${referralCode}`);
    }
  }, [referralCode]);

  if (!isOpen) return null;

  const sharePlatforms = [
    { id: 'whatsapp', name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366' },
    { id: 'facebook', name: 'Facebook', icon: 'fab fa-facebook-f', color: '#1877F2' },
    { id: 'twitter', name: 'Twitter', icon: 'fab fa-twitter', color: '#1DA1F2' },
    { id: 'telegram', name: 'Telegram', icon: 'fab fa-telegram-plane', color: '#26A5E4' },
    { id: 'copy', name: 'Copy Link', icon: 'fas fa-link', color: '#ff4d6d' }
  ];

  const handleShare = async (platform: string) => {
    setSelectedPlatform(platform);
    
    if (platform === 'copy') {
      try {
        await navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        onShare(platform, referralLink);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    } else {
      onShare(platform, referralLink);
    }
    
    setTimeout(() => setSelectedPlatform(null), 500);
  };

  const getShareMessage = () => {
    return `Join ComeUnity! Use my referral code ${referralCode} and we both get 50 XP! 🎉`;
  };

  const getShareUrl = (platform: string) => {
    const text = encodeURIComponent(getShareMessage());
    const url = encodeURIComponent(referralLink);
    
    switch (platform) {
      case 'whatsapp':
        return `https://wa.me/?text=${text} ${url}`;
      case 'facebook':
        return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
      case 'twitter':
        return `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
      case 'telegram':
        return `https://t.me/share/url?url=${url}&text=${text}`;
      default:
        return referralLink;
    }
  };

  const handlePlatformClick = (platform: string) => {
    if (platform === 'copy') {
      handleShare(platform);
    } else {
      const shareUrl = getShareUrl(platform);
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
      handleShare(platform);
    }
  };

  const nextMilestone = (invites: number) => {
    if (invites < 5) return { invites: 5, reward: 100, message: '5 Invites → +100 XP' };
    if (invites < 10) return { invites: 10, reward: 250, message: '10 Invites → +250 XP' };
    if (invites < 25) return { invites: 25, reward: 500, message: '25 Invites → +500 XP' };
    if (invites < 50) return { invites: 50, reward: 1000, message: '50 Invites → +1000 XP' };
    return { invites: null, reward: null, message: 'Max level reached!' };
  };

  const milestone = nextMilestone(referralInvites);
  const progressToNext = milestone.invites 
    ? (referralInvites / milestone.invites) * 100 
    : 100;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.show : ''}`}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>
            <i className="fas fa-gift"></i> Invite Friends
          </h3>
          <span className={styles.closeBtn} onClick={onClose}>&times;</span>
        </div>

        <div className={styles.heroSection}>
          <div className={styles.heroIcon}>🎁</div>
          <h4>Invite Friends, Earn XP!</h4>
          <p>
            Share your unique link – both you and your friend get <strong>50 XP</strong> instantly!
          </p>
        </div>

        <div className={styles.referralLinkSection}>
          <div className={styles.referralCode}>
            <div className={styles.codeLabel}>Your Referral Code</div>
            <div className={styles.codeValue}>
              <span>{referralCode}</span>
              <button 
                className={`${styles.copyBtn} ${copied ? styles.copied : ''}`} 
                onClick={() => handleShare('copy')}
              >
                {copied ? <i className="fas fa-check"></i> : <i className="fas fa-copy"></i>}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
          
          <div className={styles.referralLink}>
            <div className={styles.linkLabel}>Your Referral Link</div>
            <div className={styles.linkValue}>
              <input 
                type="text" 
                value={referralLink} 
                readOnly 
                onClick={() => handleShare('copy')}
              />
              <button 
                className={styles.linkCopyBtn}
                onClick={() => handleShare('copy')}
              >
                <i className="fas fa-copy"></i>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.shareSection}>
          <div className={styles.sectionTitle}>
            <i className="fas fa-share-alt"></i> Share with friends
          </div>
          <div className={styles.shareButtons}>
            {sharePlatforms.map(platform => (
              <button
                key={platform.id}
                className={`${styles.shareBtn} ${styles[platform.id]}`}
                onClick={() => handlePlatformClick(platform.id)}
                disabled={selectedPlatform === platform.id}
              >
                <i className={platform.icon}></i>
                <span>{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.statsSection}>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-user-plus"></i>
              </div>
              <div className={styles.statValue}>{referralInvites}</div>
              <div className={styles.statLabel}>Invites Sent</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-star"></i>
              </div>
              <div className={styles.statValue}>{referralXPEarned}</div>
              <div className={styles.statLabel}>XP Earned</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIcon}>
                <i className="fas fa-gem"></i>
              </div>
              <div className={styles.statValue}>{referralInvites * 50}</div>
              <div className={styles.statLabel}>Total XP Possible</div>
            </div>
          </div>
        </div>

        {milestone.invites && (
          <div className={styles.milestoneSection}>
            <div className={styles.milestoneHeader}>
              <span>🎯 Next Milestone</span>
              <span>{milestone.message}</span>
            </div>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progressToNext}%` }}
              ></div>
            </div>
            <div className={styles.progressStats}>
              <span>{referralInvites} / {milestone.invites} invites</span>
              <span>{Math.floor(progressToNext)}%</span>
            </div>
          </div>
        )}

        <div className={styles.howItWorks}>
          <div className={styles.sectionTitle}>
            <i className="fas fa-info-circle"></i> How It Works
          </div>
          <div className={styles.steps}>
            <div className={styles.step}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepText}>Share your unique referral link</div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepText}>Friend signs up using your link</div>
            </div>
            <div className={styles.step}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepText}>Both get <strong>50 XP</strong> instantly!</div>
            </div>
          </div>
        </div>

        <div className={styles.tipsSection}>
          <div className={styles.tipItem}>
            <i className="fas fa-lightbulb"></i>
            <span>Share on social media for more invites!</span>
          </div>
          <div className={styles.tipItem}>
            <i className="fas fa-trophy"></i>
            <span>Top referrers get exclusive badges and rewards</span>
          </div>
          <div className={styles.tipItem}>
            <i className="fas fa-infinity"></i>
            <span>No limit on how many friends you can invite!</span>
          </div>
        </div>
      </div>
    </div>
  );
}