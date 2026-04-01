// comeunity/app/auth/components/OnboardingFlow.tsx
'use client';
import React, { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import styles from '../Auth.module.css';

interface OnboardingFlowProps {
  user: any;
  onComplete: (user: any) => void;
}

const OnboardingFlow = ({ user, onComplete }: OnboardingFlowProps) => {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [username, setUsername] = useState(user?.username || '');
  const [avatar, setAvatar] = useState('😎');
  const [selectedUnities, setSelectedUnities] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const avatars = ['😎', '🎨', '🎵', '🎮', '✍️', '📸', '💪', '💻', '👕', '🍜', '💃', '🎭', '✈️', '🐉', '🔥', '👑', '🌌', '🤖', '🦄', '🌟'];

  const roles = [
    { id: 'creator', name: 'I CREATE', icon: '🎨', description: 'Share art, music, writing, or other creative work', reward: '+50 XP', color: '#ff4d6d' },
    { id: 'supporter', name: 'I SUPPORT', icon: '❤️', description: 'Follow creators and be part of their journey', reward: '+25 XP', color: '#b5179e' },
    { id: 'explorer', name: 'I EXPLORE', icon: '🔍', description: 'Discover amazing content and find your people', reward: '+25 XP', color: '#4361ee' },
  ];

  const unities = [
    { id: 'digital-artists', name: 'Digital Artists', icon: '🎨', members: '4.2K', description: 'Share and discuss digital art' },
    { id: 'music-makers', name: 'Music Makers', icon: '🎵', members: '3.1K', description: 'Connect with fellow musicians' },
    { id: 'gaming-hub', name: 'Gaming Hub', icon: '🎮', members: '5.6K', description: 'Talk about games and gaming culture' },
    { id: 'writers-guild', name: 'Writers Guild', icon: '✍️', members: '2.8K', description: 'Share your stories and writing' },
    { id: 'photography', name: 'Photography', icon: '📸', members: '3.4K', description: 'Showcase your photos' },
    { id: 'fitness', name: 'Fitness', icon: '💪', members: '2.1K', description: 'Share your fitness journey' },
  ];

  const handleSelectRole = (roleId: string) => {
    setSelectedRole(roleId);
  };

  const handleToggleUnity = (unityId: string) => {
    setSelectedUnities(prev =>
      prev.includes(unityId)
        ? prev.filter(id => id !== unityId)
        : [...prev, unityId]
    );
  };

  const handleComplete = async () => {
    setLoading(true);
    
    try {
      // Calculate onboarding XP reward
      let xpReward = 0;
      if (selectedRole === 'creator') xpReward = 50;
      else if (selectedRole === 'supporter' || selectedRole === 'explorer') xpReward = 25;
      
      // Add XP for each Unity joined (10 XP each)
      xpReward += selectedUnities.length * 10;
      
      // Update user profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: selectedRole,
          avatar: avatar,
          username: username,
          xp: (user.xp || 0) + xpReward,
          onboarding_completed: true,
          joined_unities: selectedUnities,
        })
        .eq('id', user.id);
      
      if (updateError) throw updateError;
      
      // Award XP for onboarding
      await supabase.rpc('add_xp', { user_id: user.id, xp_amount: xpReward });
      
      // Create transactions for onboarding rewards
      await supabase.from('transactions').insert({
        user_id: user.id,
        type: 'Onboarding Reward',
        amount: 0,
        metadata: {
          xp_gained: xpReward,
          role: selectedRole,
          unities_joined: selectedUnities.length
        }
      });
      
      // Join the selected Unities
      for (const unityId of selectedUnities) {
        await supabase.from('user_unities').insert({
          user_id: user.id,
          unity_id: unityId,
          joined_at: new Date().toISOString()
        });
      }
      
      onComplete({ ...user, xp: (user.xp || 0) + xpReward, role: selectedRole });
      
    } catch (error) {
      console.error('Onboarding error:', error);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: 'Choose Your Role',
      description: 'How do you want to use ComeUnity?',
      content: (
        <div className={styles.roleGrid}>
          {roles.map(role => (
            <div
              key={role.id}
              className={`${styles.roleCard} ${selectedRole === role.id ? styles.selected : ''}`}
              onClick={() => handleSelectRole(role.id)}
            >
              <div className={styles.roleIcon}>{role.icon}</div>
              <div className={styles.roleInfo}>
                <h3>{role.name}</h3>
                <p>{role.description}</p>
                <span className={styles.roleReward}>{role.reward}</span>
              </div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Choose Your Avatar',
      description: 'Pick an avatar that represents you',
      content: (
        <div className={styles.avatarGrid}>
          {avatars.map(emoji => (
            <div
              key={emoji}
              className={`${styles.avatarOption} ${avatar === emoji ? styles.selected : ''}`}
              onClick={() => setAvatar(emoji)}
            >
              {emoji}
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Set Your Username',
      description: 'This is how others will see you',
      content: (
        <div className={styles.usernameSection}>
          <div className={styles.usernamePreview}>
            <div className={styles.usernameAvatar}>{avatar}</div>
            <div className={styles.usernameField}>
              <span className={styles.atSymbol}>@</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                maxLength={20}
              />
            </div>
          </div>
          <p className={styles.usernameHint}>3-20 characters, letters, numbers, and underscores only</p>
        </div>
      )
    },
    {
      title: 'Join Unities',
      description: 'Choose communities to get started (each gives +10 XP!)',
      content: (
        <div className={styles.unityGrid}>
          {unities.map(unity => (
            <div
              key={unity.id}
              className={`${styles.unityOption} ${selectedUnities.includes(unity.id) ? styles.selected : ''}`}
              onClick={() => handleToggleUnity(unity.id)}
            >
              <div className={styles.unityIcon}>{unity.icon}</div>
              <div className={styles.unityDetails}>
                <div className={styles.unityName}>{unity.name}</div>
                <div className={styles.unityMeta}>
                  <span><i className="fas fa-users"></i> {unity.members} members</span>
                </div>
                <div className={styles.unityDesc}>{unity.description}</div>
              </div>
              {selectedUnities.includes(unity.id) && (
                <div className={styles.checkmark}>✓</div>
              )}
            </div>
          ))}
        </div>
      )
    }
  ];

  const currentStep = steps[step];

  return (
    <div className={styles.onboardingModal}>
      <div className={styles.onboardingContainer}>
        <div className={styles.onboardingProgress}>
          {steps.map((_, idx) => (
            <div
              key={idx}
              className={`${styles.progressStep} ${idx <= step ? styles.completed : ''} ${idx === step ? styles.active : ''}`}
              onClick={() => idx <= step && setStep(idx)}
            >
              <span className={styles.stepNumber}>{idx + 1}</span>
              <span className={styles.stepLabel}>{steps[idx].title}</span>
            </div>
          ))}
        </div>

        <div className={styles.onboardingContent}>
          <h2>{currentStep.title}</h2>
          <p className={styles.stepDescription}>{currentStep.description}</p>
          {currentStep.content}
        </div>

        <div className={styles.onboardingActions}>
          {step > 0 && (
            <button className={styles.backBtn} onClick={() => setStep(step - 1)}>
              ← Back
            </button>
          )}
          {step < steps.length - 1 ? (
            <button
              className={styles.nextBtn}
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !selectedRole || step === 2 && !username.trim()}
            >
              Continue →
            </button>
          ) : (
            <button
              className={styles.completeBtn}
              onClick={handleComplete}
              disabled={loading}
            >
              {loading ? 'Setting up...' : 'Complete Setup →'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .${styles.onboardingModal} {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        
        .${styles.onboardingContainer} {
          width: 90%;
          max-width: 600px;
          max-height: 85vh;
          background: linear-gradient(145deg, #12121a, #0a0a0f);
          border-radius: 48px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }
        
        .${styles.onboardingProgress} {
          display: flex;
          padding: 20px 24px;
          background: rgba(255, 255, 255, 0.03);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .${styles.progressStep} {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          opacity: 0.5;
          transition: all 0.2s;
        }
        
        .${styles.progressStep}.completed {
          opacity: 1;
        }
        
        .${styles.progressStep}.active {
          opacity: 1;
        }
        
        .${styles.progressStep}.active .${styles.stepNumber} {
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          color: white;
        }
        
        .${styles.stepNumber} {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        
        .${styles.stepLabel} {
          font-size: 11px;
          color: var(--text-secondary);
        }
        
        .${styles.onboardingContent} {
          flex: 1;
          overflow-y: auto;
          padding: 32px;
        }
        
        .${styles.onboardingContent} h2 {
          font-size: 24px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .${styles.stepDescription} {
          color: var(--text-secondary);
          margin-bottom: 32px;
        }
        
        .${styles.roleGrid} {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .${styles.roleCard} {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 28px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .${styles.roleCard}:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(4px);
        }
        
        .${styles.roleCard}.selected {
          background: linear-gradient(135deg, rgba(255, 77, 109, 0.15), rgba(67, 97, 238, 0.15));
          border-color: var(--gold);
        }
        
        .${styles.roleIcon} {
          width: 56px;
          height: 56px;
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }
        
        .${styles.roleInfo} {
          flex: 1;
        }
        
        .${styles.roleInfo} h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 4px;
        }
        
        .${styles.roleInfo} p {
          font-size: 13px;
          color: var(--text-secondary);
          margin-bottom: 8px;
        }
        
        .${styles.roleReward} {
          font-size: 11px;
          color: var(--gold);
          font-weight: 600;
        }
        
        .${styles.avatarGrid} {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 12px;
        }
        
        .${styles.avatarOption} {
          aspect-ratio: 1;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .${styles.avatarOption}:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }
        
        .${styles.avatarOption}.selected {
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          transform: scale(1.05);
        }
        
        .${styles.usernameSection} {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
        }
        
        .${styles.usernamePreview} {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 20px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 60px;
        }
        
        .${styles.usernameAvatar} {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
        }
        
        .${styles.usernameField} {
          position: relative;
        }
        
        .${styles.atSymbol} {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gold);
          font-weight: 600;
        }
        
        .${styles.usernameField} input {
          padding: 12px 12px 12px 32px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 40px;
          font-size: 18px;
          color: white;
          outline: none;
        }
        
        .${styles.usernameField} input:focus {
          border-color: var(--gold);
        }
        
        .${styles.usernameHint} {
          font-size: 12px;
          color: var(--text-tertiary);
        }
        
        .${styles.unityGrid} {
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .${styles.unityOption} {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.2s;
          position: relative;
        }
        
        .${styles.unityOption}:hover {
          background: rgba(255, 255, 255, 0.08);
        }
        
        .${styles.unityOption}.selected {
          background: rgba(255, 214, 10, 0.1);
          border-color: var(--gold);
        }
        
        .${styles.unityIcon} {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .${styles.unityDetails} {
          flex: 1;
        }
        
        .${styles.unityName} {
          font-weight: 700;
          font-size: 16px;
          margin-bottom: 4px;
        }
        
        .${styles.unityMeta} {
          font-size: 11px;
          color: var(--text-tertiary);
          margin-bottom: 4px;
        }
        
        .${styles.unityDesc} {
          font-size: 12px;
          color: var(--text-secondary);
        }
        
        .${styles.checkmark} {
          width: 24px;
          height: 24px;
          background: var(--gold);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #1a1a1a;
          font-weight: 700;
        }
        
        .${styles.onboardingActions} {
          display: flex;
          gap: 12px;
          padding: 20px 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }
        
        .${styles.backBtn}, .${styles.nextBtn}, .${styles.completeBtn} {
          flex: 1;
          padding: 12px;
          border-radius: 40px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .${styles.backBtn} {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: white;
        }
        
        .${styles.nextBtn}, .${styles.completeBtn} {
          background: linear-gradient(135deg, var(--gradient-1), var(--gradient-3));
          border: none;
          color: white;
        }
        
        .${styles.backBtn}:hover, .${styles.nextBtn}:hover, .${styles.completeBtn}:hover {
          transform: translateY(-2px);
        }
        
        .${styles.nextBtn}:disabled, .${styles.completeBtn}:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OnboardingFlow;