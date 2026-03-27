'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import ProfileHeader from './ProfileHeader/ProfileHeader';
import LevelCard from './LevelCard/LevelCard';
import StatsBanner from './StatsBanner/StatsBanner';
import AchievementsSection from './AchievementsSection/AchievementsSection';
import ProfileTabs from './ProfileTabs/ProfileTabs';
import EmptyState from './EmptyState/EmptyState';
import ConfirmModal from './Modals/ConfirmModal';
import TipModal from './Modals/TipModal';
import LevelModal from './Modals/LevelModal';
import AchievementsModal from './Modals/AchievementsModal';
import StreakModal from './Modals/StreakModal';
import Toast from './Toast/Toast';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  bio: string;
  avatar: string;
  xp: number;
  followers_count: number;
  following_count: number;
  streak: number;
  coins: number;
  created_at: string;
}

interface PublicProfileProps {
  username: string;
}

const levelThresholds = [0, 500, 1200, 2100, 3200, 4500, 6000, 7700, 9600, 11700, 14000];
const levelNames = ["Rookie", "Newbie", "Explorer", "Adventurer", "Master", "Elite", "Pro", "Expert", "Champion", "Legend", "Grandmaster"];
const streakMilestones = [3, 7, 14, 21, 30, 50, 100];

const getLevel = (xp: number) => {
  let lvl = 0;
  for (let i = 1; i < levelThresholds.length; i++) {
    if (xp >= levelThresholds[i]) lvl = i;
  }
  return lvl;
};

const getNextLevelXP = (xp: number) => {
  let lvl = getLevel(xp);
  return lvl + 1 < levelThresholds.length ? levelThresholds[lvl + 1] : null;
};

const PublicProfile: React.FC<PublicProfileProps> = ({ username }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'posts' | 'unities'>('posts');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showTipModal, setShowTipModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string; xpGain?: number; isError?: boolean } | null>(null);
  const [achievements, setAchievements] = useState<any[]>([]);

  useEffect(() => {
    fetchProfile();
    getCurrentUser();
  }, [username]);

  const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      setCurrentUserId(user.id);
    }
  };

  const fetchProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();
    
    if (error) {
      setError('Profile not found');
    } else {
      setProfile(data);
      const computedAchievements = [
        { id: 1, name: "Welcome", icon: "🎉", requirement: "Joined ComeUnity", unlocked: true },
        { id: 2, name: "First Steps", icon: "👣", requirement: "Complete profile", unlocked: !!data.bio },
        { id: 3, name: "Level 5", icon: "⭐", requirement: "Reach Level 5", unlocked: data.xp >= 1200 },
        { id: 4, name: "Streak 7", icon: "🔥", requirement: "7 day streak", unlocked: data.streak >= 7 },
        { id: 5, name: "Popular", icon: "👑", requirement: "100 followers", unlocked: data.followers_count >= 100 },
      ];
      setAchievements(computedAchievements);
      
      if (currentUserId) {
        const { data: followData } = await supabase
          .from('follows')
          .select('*')
          .eq('follower_id', currentUserId)
          .eq('following_id', data.id)
          .single();
        setIsFollowing(!!followData);
      }
    }
    setLoading(false);
  };

  const handleFollow = async () => {
    if (!currentUserId || !profile) return;
    
    if (isFollowing) {
      await supabase
        .from('follows')
        .delete()
        .eq('follower_id', currentUserId)
        .eq('following_id', profile.id);
      setIsFollowing(false);
      setProfile(prev => ({ ...prev!, followers_count: (prev!.followers_count || 0) - 1 }));
    } else {
      await supabase
        .from('follows')
        .insert({ follower_id: currentUserId, following_id: profile.id });
      setIsFollowing(true);
      setProfile(prev => ({ ...prev!, followers_count: (prev!.followers_count || 0) + 1 }));
    }
    setShowConfirmModal(false);
  };

  const handleSendTip = async (amount: number, message: string) => {
    if (!currentUserId || !profile) return;
    setShowTipModal(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const showToastMsg = (title: string, message: string, xpGain?: number, isError?: boolean) => {
    setToast({ title, message, xpGain, isError });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="text-6xl mb-4">😕</div>
          <p className="mb-4">{error || 'Profile not found'}</p>
          <a href="/feed" className="text-[#ff4d6d]">Go to Feed</a>
        </div>
      </div>
    );
  }

  const currentLevel = getLevel(profile.xp);
  const nextXP = getNextLevelXP(profile.xp);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div className="max-w-md mx-auto">
        {/* Header - No sticky, normal flow */}
        <div className="bg-[#0a0a0f] border-b border-white/5 px-4 py-4">
          <div className="flex justify-between items-center">
            <button onClick={() => window.history.back()} className="text-white/70 hover:text-white transition-colors">
              <i className="fas fa-arrow-left text-xl"></i>
            </button>
            <div className="text-xl font-bold">
              <span className="bg-gradient-to-r from-[#ff4d6d] to-[#b5179e] bg-clip-text text-transparent">COME</span>
              <span className="bg-gradient-to-r from-[#b5179e] to-[#4361ee] bg-clip-text text-transparent">UNITY</span>
            </div>
            <div className="w-8"></div>
          </div>
        </div>

        {/* Content - No padding-top, starts immediately below header */}
        <div className="px-4 pb-24">
          {/* Profile Header - No margin-top */}
          <ProfileHeader
            creator={profile}
            visitor={{ id: currentUserId, coins: 0, isFollowing, xp: 0 }}
            avatarCategory="Common"
            onFollow={() => setShowConfirmModal(true)}
            onTip={() => setShowTipModal(true)}
            onShare={() => showToastMsg('Share', 'Profile link copied!')}
            formatNumber={formatNumber}
          />
          
          <LevelCard
            xp={profile.xp}
            level={currentLevel}
            levelName={levelNames[currentLevel]}
            nextXP={nextXP}
            onViewLevels={() => setShowLevelModal(true)}
          />
          
          <StatsBanner
            totalPosts={0}
            streak={profile.streak}
            achievementsCount={unlockedAchievements}
            onStreakClick={() => setShowStreakModal(true)}
          />
          
          <AchievementsSection
            achievements={achievements}
            onViewAll={() => setShowAchievementsModal(true)}
          />
          
          <ProfileTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          {activeTab === 'posts' ? (
            <EmptyState icon="fa-file-alt" text="No posts" subtext="This creator hasn't shared anything yet" />
          ) : (
            <EmptyState icon="fa-users" text="No unities joined" subtext="This creator hasn't joined any unities" />
          )}
        </div>
      </div>

      {/* Modals */}
      <ConfirmModal
        isOpen={showConfirmModal}
        creatorName={profile.first_name}
        isFollowing={isFollowing}
        onConfirm={handleFollow}
        onClose={() => setShowConfirmModal(false)}
      />

      <TipModal
        isOpen={showTipModal}
        walletBalance={0}
        onSendTip={handleSendTip}
        onClose={() => setShowTipModal(false)}
      />

      <LevelModal
        isOpen={showLevelModal}
        currentXP={profile.xp}
        currentLevel={currentLevel}
        levelNames={levelNames}
        levelThresholds={levelThresholds}
        onClose={() => setShowLevelModal(false)}
      />

      <AchievementsModal
        isOpen={showAchievementsModal}
        achievements={achievements}
        onClose={() => setShowAchievementsModal(false)}
      />

      <StreakModal
        isOpen={showStreakModal}
        currentStreak={profile.streak}
        streakMilestones={streakMilestones}
        onClose={() => setShowStreakModal(false)}
      />

      {toast && (
        <Toast
          title={toast.title}
          message={toast.message}
          xpGain={toast.xpGain}
          isError={toast.isError}
        />
      )}
    </div>
  );
};

export default PublicProfile;