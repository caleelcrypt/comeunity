'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

// Component Imports
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import LevelCard from '../components/profile/LevelCard';
import WalletCard from '../components/profile/WalletCard';
import AchievementsGrid from '../components/profile/AchievementsGrid';
import ProfileTabs from '../components/profile/ProfileTabs';
import UnityCard from '../components/profile/UnityCard';
import PostCard from '../components/profile/PostCard';
import EmptyState from '../components/profile/EmptyState';

// Modal Imports
import EditProfileModal from '../components/profile/modals/EditProfileModal';
import TransactionModal from '../components/profile/modals/TransactionModal';
import AchievementsModal from '../components/profile/modals/AchievementsModal';
import LevelModal from '../components/profile/modals/LevelModal';
import StreakModal from '../components/profile/modals/StreakModal';
import FollowersModal from '../components/profile/modals/FollowersModal';
import ReferralModal from '../components/profile/modals/ReferralModal';
import AvatarShopModal from '../components/profile/avatar-shop/AvatarShopModal';
import ConfirmModal from '../components/profile/ConfirmModal';

// Styles
import styles from './MyProfile.module.css';

// Avatar imports
import { FREE_AVATARS, ALL_AVATARS, tierConfig } from '../../lib/avatarData';

// ============================================
// TYPES
// ============================================

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  xp: number;
  coins: number;
  streak: number;
  avatar: string;
  bio?: string;
  category?: string;
  website?: string;
  location?: string;
  followers_count: number;
  following_count: number;
  likes_given: number;
  own_referral_code: string;
  verification_level: string;
  created_at: string;
};

type Transaction = {
  id: string;
  type: string;
  amount: number;
  date: string;
  created_at?: string;
};

type Post = {
  id: string;
  user_id: string;
  content: string;
  link?: string;
  link_domain?: string;
  link_title?: string;
  likes_count: number;
  comments_count: number;
  liked_by_user: boolean;
  created_at: string;
};

type Unity = {
  id: string;
  unity_name: string;
  unity_icon: string;
  tag: 'founder' | 'contributor' | 'member';
  members: number;
  joined_at: string;
};

type Achievement = {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  category: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic' | 'secret';
  xpReward?: number;
  earnedAt?: string;
};

// Update your Follower type to include displayName
type Follower = {
  id: string;
  username: string;
  avatar: string;
  displayName: string;  // ← ADD THIS (was display_name)
  is_following?: boolean;
  bio?: string;
  category?: string;
  followers_count?: number;
  following_count?: number;
};

// ============================================
// LEVEL SYSTEM FUNCTIONS
// ============================================

const calculateLevel = (xp: number): number => {
  return Math.floor(Math.sqrt(Math.max(0, xp) / 100)) + 1;
};

const getLevelTitle = (level: number): string => {
  const titles = ['Rookie', 'Newbie', 'Explorer', 'Adventurer', 'Master', 'Elite', 'Pro', 'Expert', 'Champion', 'Legend', 'Mythic', 'Godly'];
  return titles[Math.min(level - 1, titles.length - 1)] || 'Legend';
};

const getXPForNextLevel = (currentXP: number): number => {
  const level = calculateLevel(currentXP);
  return 100 * Math.pow(level, 2) - currentXP;
};

const getProgressToNextLevel = (currentXP: number): number => {
  const level = calculateLevel(currentXP);
  const currentLevelXP = 100 * Math.pow(level - 1, 2);
  const nextLevelXP = 100 * Math.pow(level, 2);
  const xpInLevel = currentXP - currentLevelXP;
  const xpNeeded = nextLevelXP - currentLevelXP;
  return (xpInLevel / xpNeeded) * 100;
};

// ============================================
// ACHIEVEMENTS GENERATION
// ============================================

const generateAllAchievements = (profile: UserProfile | null, postsCount: number, avatarCount: number, referralInvites: number, tipsGiven: number, tipsReceived: number, unityContributions: number, reportsSubmitted: number): Achievement[] => {
  const xp = profile?.xp || 0;
  const streak = profile?.streak || 0;
  
  return [
    // XP & Level Badges
    { id: 'rookie', name: 'Rookie', icon: '🌱', description: 'Sign up to ComeUnity', unlocked: true, category: 'level', rarity: 'common' as const, xpReward: 0 },
    { id: 'rising_star', name: 'Rising Star', icon: '⭐', description: 'Reach 100 XP', unlocked: xp >= 100, category: 'level', rarity: 'common' as const, xpReward: 0 },
    { id: 'explorer', name: 'Explorer', icon: '🗺️', description: 'Reach 500 XP', unlocked: xp >= 500, category: 'level', rarity: 'common' as const, xpReward: 0 },
    { id: 'adventurer', name: 'Adventurer', icon: '🧭', description: 'Reach 1,000 XP', unlocked: xp >= 1000, category: 'level', rarity: 'common' as const, xpReward: 0 },
    { id: 'master', name: 'Master', icon: '🏆', description: 'Reach 2,500 XP', unlocked: xp >= 2500, category: 'level', rarity: 'rare' as const, xpReward: 0 },
    { id: 'legend', name: 'Legend', icon: '👑', description: 'Reach 10,000 XP', unlocked: xp >= 10000, category: 'level', rarity: 'epic' as const, xpReward: 0 },
    { id: 'mythic', name: 'Mythic', icon: '🌟', description: 'Reach 25,000 XP', unlocked: xp >= 25000, category: 'level', rarity: 'legendary' as const, xpReward: 0 },
    { id: 'eternal', name: 'Eternal', icon: '♾️', description: 'Reach 50,000 XP', unlocked: xp >= 50000, category: 'level', rarity: 'mythic' as const, xpReward: 0 },
    { id: 'transcendent', name: 'Transcendent', icon: '🌌', description: 'Reach 100,000 XP', unlocked: xp >= 100000, category: 'level', rarity: 'mythic' as const, xpReward: 0 },
    
    // Streak Badges
    { id: 'first_step', name: 'First Step', icon: '👣', description: 'Maintain a 1-day streak', unlocked: streak >= 1, category: 'streak', rarity: 'common' as const, xpReward: 10 },
    { id: 'warming_up', name: 'Warming Up', icon: '🔥', description: 'Maintain a 3-day streak', unlocked: streak >= 3, category: 'streak', rarity: 'common' as const, xpReward: 20 },
    { id: 'on_fire', name: 'On Fire', icon: '⚡', description: 'Maintain a 5-day streak', unlocked: streak >= 5, category: 'streak', rarity: 'common' as const, xpReward: 50 },
    { id: 'week_warrior', name: 'Week Warrior', icon: '📅', description: 'Maintain a 7-day streak', unlocked: streak >= 7, category: 'streak', rarity: 'rare' as const, xpReward: 100 },
    { id: 'double_digits', name: 'Double Digits', icon: '🔟', description: 'Maintain a 10-day streak', unlocked: streak >= 10, category: 'streak', rarity: 'rare' as const, xpReward: 150 },
    { id: 'two_weeks', name: 'Two Weeks', icon: '✌️', description: 'Maintain a 14-day streak', unlocked: streak >= 14, category: 'streak', rarity: 'rare' as const, xpReward: 200 },
    { id: 'three_weeks', name: 'Three Weeks', icon: '🌟', description: 'Maintain a 21-day streak', unlocked: streak >= 21, category: 'streak', rarity: 'epic' as const, xpReward: 250 },
    { id: 'monthly_master', name: 'Monthly Master', icon: '🏆', description: 'Maintain a 30-day streak', unlocked: streak >= 30, category: 'streak', rarity: 'epic' as const, xpReward: 500 },
    { id: 'golden_streak', name: 'Golden Streak', icon: '👑', description: 'Maintain a 50-day streak', unlocked: streak >= 50, category: 'streak', rarity: 'legendary' as const, xpReward: 750 },
    { id: 'century_club', name: 'Century Club', icon: '🏅', description: 'Maintain a 100-day streak', unlocked: streak >= 100, category: 'streak', rarity: 'legendary' as const, xpReward: 1500 },
    { id: 'year_one', name: 'Year One', icon: '🎂', description: 'Maintain a 365-day streak', unlocked: streak >= 365, category: 'streak', rarity: 'mythic' as const, xpReward: 5000 },
    
    // Creator Badges
    { id: 'first_creation', name: 'First Creation', icon: '🎨', description: 'Create your first post', unlocked: postsCount >= 1, category: 'creator', rarity: 'common' as const, xpReward: 0 },
    { id: 'content_creator', name: 'Content Creator', icon: '✍️', description: 'Create 10 posts', unlocked: postsCount >= 10, category: 'creator', rarity: 'common' as const, xpReward: 0 },
    { id: 'prolific', name: 'Prolific', icon: '📝', description: 'Create 50 posts', unlocked: postsCount >= 50, category: 'creator', rarity: 'rare' as const, xpReward: 0 },
    { id: 'dedicated', name: 'Dedicated', icon: '🎯', description: 'Create 100 posts', unlocked: postsCount >= 100, category: 'creator', rarity: 'rare' as const, xpReward: 0 },
    { id: 'obsessed', name: 'Obsessed', icon: '🔥', description: 'Create 500 posts', unlocked: postsCount >= 500, category: 'creator', rarity: 'epic' as const, xpReward: 0 },
    { id: 'legendary_creator', name: 'Legendary Creator', icon: '👑', description: 'Create 1,000 posts', unlocked: postsCount >= 1000, category: 'creator', rarity: 'legendary' as const, xpReward: 0 },
    
    // Collector Badges
    { id: 'new_collector', name: 'New Collector', icon: '🛍️', description: 'Buy your first avatar', unlocked: avatarCount >= 1, category: 'collector', rarity: 'common' as const, xpReward: 0 },
    { id: 'avid_collector', name: 'Avid Collector', icon: '🌟', description: 'Own 5 avatars', unlocked: avatarCount >= 5, category: 'collector', rarity: 'rare' as const, xpReward: 0 },
    { id: 'serious_collector', name: 'Serious Collector', icon: '💎', description: 'Own 10 avatars', unlocked: avatarCount >= 10, category: 'collector', rarity: 'rare' as const, xpReward: 0 },
    { id: 'master_collector', name: 'Master Collector', icon: '🏆', description: 'Own 20 avatars', unlocked: avatarCount >= 20, category: 'collector', rarity: 'epic' as const, xpReward: 0 },
    
    // Referral Badges
    { id: 'first_invite', name: 'First Invite', icon: '🤝', description: 'Invite your first friend', unlocked: referralInvites >= 1, category: 'community', rarity: 'common' as const, xpReward: 50 },
    { id: 'popular', name: 'Popular', icon: '🌟', description: 'Invite 5 friends', unlocked: referralInvites >= 5, category: 'community', rarity: 'rare' as const, xpReward: 250 },
    { id: 'influencer', name: 'Influencer', icon: '👑', description: 'Invite 10 friends', unlocked: referralInvites >= 10, category: 'community', rarity: 'epic' as const, xpReward: 500 },
    { id: 'referral_king', name: 'Referral King', icon: '👑', description: 'Invite 100 friends', unlocked: referralInvites >= 100, category: 'community', rarity: 'legendary' as const, xpReward: 5000 },
    { id: 'referral_god', name: 'Referral God', icon: '🌟', description: 'Invite 500 friends', unlocked: referralInvites >= 500, category: 'community', rarity: 'mythic' as const, xpReward: 25000 },
    
    // Generosity Badges
    { id: 'first_tip', name: 'First Tip', icon: '🎁', description: 'Send your first tip', unlocked: tipsGiven >= 1, category: 'generosity', rarity: 'common' as const, xpReward: 0 },
    { id: 'generous_heart', name: 'Generous Heart', icon: '❤️', description: 'Send 10 tips', unlocked: tipsGiven >= 10, category: 'generosity', rarity: 'common' as const, xpReward: 0 },
    { id: 'supporter', name: 'Supporter', icon: '🤝', description: 'Send 50 tips', unlocked: tipsGiven >= 50, category: 'generosity', rarity: 'rare' as const, xpReward: 0 },
    { id: 'super_fan', name: 'Super Fan', icon: '⭐', description: 'Send 100 tips', unlocked: tipsGiven >= 100, category: 'generosity', rarity: 'rare' as const, xpReward: 0 },
    { id: 'patron', name: 'Patron', icon: '👑', description: 'Send 500 tips', unlocked: tipsGiven >= 500, category: 'generosity', rarity: 'epic' as const, xpReward: 0 },
    { id: 'angel', name: 'Angel', icon: '😇', description: 'Send 1,000 tips', unlocked: tipsGiven >= 1000, category: 'generosity', rarity: 'legendary' as const, xpReward: 0 },
    { id: 'whale', name: 'Whale', icon: '🐋', description: 'Give 10,000 total coins', unlocked: tipsGiven >= 10000, category: 'generosity', rarity: 'legendary' as const, xpReward: 0 },
  ];
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function MyProfilePage() {
  const router = useRouter();
  
  // State variables
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState<string | null>(null);
  
  // Data states
  const [posts, setPosts] = useState<Post[]>([]);
  const [unities, setUnities] = useState<Unity[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ownedAvatars, setOwnedAvatars] = useState<string[]>([]);
  const [currentAvatar, setCurrentAvatar] = useState('😎');
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Follower[]>([]);
  const [badges, setBadges] = useState<Achievement[]>([]);
  const [badgeStats, setBadgeStats] = useState<any>(null);
  
  // Tip states
  const [tipsGiven, setTipsGiven] = useState(0);
  const [tipsReceived, setTipsReceived] = useState(0);
  const [unityContributions, setUnityContributions] = useState(0);
  const [reportsSubmitted, setReportsSubmitted] = useState(0);
  
  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAvatarShop, setShowAvatarShop] = useState(false);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pendingPurchase, setPendingPurchase] = useState<{ emoji: string; price: number; name: string } | null>(null);
  
  // Tab state
  const [activeTab, setActiveTab] = useState<'posts' | 'unities' | 'treasure'>('posts');
  
  // Referral state
  const [referralInvites, setReferralInvites] = useState(0);
  const [referralXPEarned, setReferralXPEarned] = useState(0);
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState<any>(null);
  
  // ============================================
  // FOLLOWERS FUNCTIONS
  // ============================================
  
 const fetchFollowers = async (userId: string) => {
  try {
    const response = await fetch(`/api/users/followers?userId=${userId}&limit=100&sortBy=recent`);
    if (response.ok) {
      const data = await response.json();
      setFollowers(data.map((user: any) => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar || user.display_name?.charAt(0) || '👤',
        displayName: user.display_name,  // ← CHANGE THIS (was display_name)
        is_following: user.is_following,
        bio: user.bio,
        category: user.category,
        followers_count: user.followers_count,
        following_count: user.following_count
      })));
    }
  } catch (error) {
    console.error('Error fetching followers:', error);
  }
};

const fetchFollowing = async (userId: string) => {
  try {
    const response = await fetch(`/api/users/following?userId=${userId}&limit=100&sortBy=recent`);
    if (response.ok) {
      const data = await response.json();
      setFollowing(data.map((user: any) => ({
        id: user.id,
        username: user.username,
        avatar: user.avatar || user.display_name?.charAt(0) || '👤',
        displayName: user.display_name,  // ← CHANGE THIS (was display_name)
        is_following: true,
        bio: user.bio,
        category: user.category,
        followers_count: user.followers_count,
        following_count: user.following_count
      })));
    }
  } catch (error) {
    console.error('Error fetching following:', error);
  }
};
  const fetchBadges = async () => {
    if (!profile) return;
    try {
      const response = await fetch(`/api/users/badges?userId=${profile.id}`);
      const data = await response.json();
      if (data.success && data.badges) {
        setBadges(data.badges);
        setBadgeStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  };
  
  const fetchTipsData = async (userId: string) => {
    try {
      const { data: givenData, error: givenError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'Sent Tip');
      
      if (!givenError && givenData) {
        const totalGiven = givenData.reduce((sum, t) => sum + t.amount, 0);
        setTipsGiven(totalGiven);
      }
    } catch (error) {
      console.error('Error fetching tips data:', error);
    }
  };
  
  // ============================================
  // REFERRAL FUNCTIONS
  // ============================================
  
  const fetchReferralStats = async () => {
    try {
      const response = await fetch('/api/users/referral');
      const data = await response.json();
      if (data.success) {
        setReferralInvites(data.data.total_invites);
        setReferralXPEarned(data.data.total_xp_earned);
        setReferralCode(data.data.referral_code);
        setReferralStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    }
  };
  
  const handleCopyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      showToastMessage('Referral code copied!');
    }
  };
  
  const handleShareReferral = (platform: string, referralLink: string) => {
    const text = `Join ComeUnity with my referral code ${referralCode} and get 50 XP! 🎉`;
    
    let shareUrl = '';
    if (platform === 'whatsapp') {
      shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + referralLink)}`;
    } else if (platform === 'facebook') {
      shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`;
    } else if (platform === 'twitter') {
      shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
    } else if (platform === 'telegram') {
      shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
    } else if (platform === 'copy') {
      navigator.clipboard.writeText(referralLink);
      showToastMessage('Referral link copied!');
      return;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'noopener,noreferrer');
    }
  };
  
  // ============================================
  // FOLLOW/UNFOLLOW FUNCTIONS
  // ============================================
  
  const handleFollowUser = async (userId: string) => {
    if (!profile) return;
    try {
      const response = await fetch('/api/users/follow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchProfileData();
        if (showFollowersModal) await fetchFollowers(profile.id);
        if (showFollowingModal) await fetchFollowing(profile.id);
        showToastMessage(`✅ Now following user!`);
      } else {
        showToastMessage(`❌ ${data.error || 'Failed to follow user'}`);
      }
    } catch (error) {
      console.error('Error following user:', error);
      showToastMessage('❌ Error following user');
    }
  };
  
  const handleUnfollowUser = async (userId: string) => {
    if (!profile) return;
    try {
      const response = await fetch('/api/users/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        await fetchProfileData();
        if (showFollowersModal) await fetchFollowers(profile.id);
        if (showFollowingModal) await fetchFollowing(profile.id);
        showToastMessage(`✅ Unfollowed user`);
      } else {
        showToastMessage(`❌ ${data.error || 'Failed to unfollow user'}`);
      }
    } catch (error) {
      console.error('Error unfollowing user:', error);
      showToastMessage('❌ Error unfollowing user');
    }
  };
  
  // ============================================
  // DATA FETCHING
  // ============================================
  
const fetchProfileData = async () => {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  // Don't redirect - just return null if no user
  if (!authUser) {
    console.error('No user found in fetchProfileData');
    return null;
  }
  
  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", authUser.id)
    .single();
    
  if (profileData) {
    setProfile(profileData);
    setCurrentAvatar(profileData.avatar || '😎');
  }
  
  return profileData;
};

const fetchAllData = async () => {
  setLoading(true);
  
  const { data: { user: authUser } } = await supabase.auth.getUser();
  
  // If no user, show error but don't redirect - the parent route handles auth
  if (!authUser) {
    console.error('No authenticated user found');
    setLoading(false);
    return;
  }
  
  // 1. Fetch profile
  const profileData = await fetchProfileData();
  
  // 2. Fetch owned avatars
  const { data: avatarsData } = await supabase
    .from("user_avatars")
    .select("avatar_emoji")
    .eq("user_id", authUser.id);
  
  if (avatarsData && avatarsData.length > 0) {
    setOwnedAvatars(avatarsData.map(a => a.avatar_emoji));
  } else {
    setOwnedAvatars(['😎']);
  }
  
  // 3. Fetch posts
  const { data: postsData } = await supabase
    .from("posts")
    .select("*")
    .eq("user_id", authUser.id)
    .order("created_at", { ascending: false });
  if (postsData) setPosts(postsData);
  
  // 4. Fetch unities
  const { data: unitiesData } = await supabase
    .from("user_unities")
    .select("*")
    .eq("user_id", authUser.id);
  if (unitiesData) {
    const formattedUnities = unitiesData.map(u => ({
      ...u,
      tag: u.unity_name === 'Digital Artists' ? 'founder' as const : 'contributor' as const,
      members: 12400
    }));
    setUnities(formattedUnities);
  }
  
  // 5. Fetch transactions
  const { data: transactionsData } = await supabase
    .from("transactions")
    .select("*")
    .eq("user_id", authUser.id)
    .order("created_at", { ascending: false })
    .limit(20);
  
  if (transactionsData) {
    setTransactions(transactionsData.map(t => ({
      ...t,
      date: t.created_at || new Date().toISOString()
    })));
  } else {
    setTransactions([]);
  }
  
  // 6. Fetch followers and following
  if (authUser.id) {
    await Promise.all([
      fetchFollowers(authUser.id),
      fetchFollowing(authUser.id)
    ]);
  }
  
  // 7. Fetch referral stats
  await fetchReferralStats();
  
  // 8. Fetch tips data
  await fetchTipsData(authUser.id);
  
  // 9. Fetch badges
  await fetchBadges();
  
  // 10. Set referral code from profile
  if (profileData && profileData.own_referral_code) {
    setReferralCode(profileData.own_referral_code);
    setReferralInvites(profileData.referral_invites || 0);
    setReferralXPEarned(profileData.referral_xp_earned || 0);
  }
  
  // 11. Generate achievements as fallback
  const allAchievements = generateAllAchievements(
    profileData,
    postsData?.length || 0,
    avatarsData?.length || 1,
    referralInvites,
    tipsGiven,
    tipsReceived,
    unitiesData?.length || 0,
    reportsSubmitted
  );
  
  // 12. Only use fallback if badges array is empty
  if (badges.length === 0) {
    setBadges(allAchievements);
  }
  
  setLoading(false);
};
  // ============================================
  // XP EARNING FUNCTION
  // ============================================
  
  const earnXP = async (amount: number, reason: string) => {
    if (!profile) return;
    const newXP = profile.xp + amount;
    await supabase
      .from("profiles")
      .update({ xp: newXP })
      .eq("id", profile.id);
    setProfile({ ...profile, xp: newXP });
    const oldLevel = calculateLevel(profile.xp);
    const newLevel = calculateLevel(newXP);
    if (newLevel > oldLevel) {
      showToastMessage(`🎉 LEVEL UP! You're now Level ${newLevel} ${getLevelTitle(newLevel)}! 🎉`);
    }
    return newXP;
  };
  
  // ============================================
  // HANDLERS
  // ============================================
  
  const showToastMessage = (msg: string) => {
    setShowToast(msg);
    setTimeout(() => setShowToast(null), 2500);
  };
  
  const handleEditProfile = () => setShowEditModal(true);
  
  const handleSaveProfile = async (data: {
    first_name: string;
    last_name: string;
    bio: string;
    category: string;
  }) => {
    if (!profile) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: `${data.first_name} ${data.last_name}`,
        bio: data.bio,
        category: data.category,
      })
      .eq("id", profile.id);
    if (!error) {
      setProfile({
        ...profile,
        first_name: data.first_name,
        last_name: data.last_name,
        full_name: `${data.first_name} ${data.last_name}`,
        bio: data.bio,
        category: data.category,
      });
      showToastMessage('✅ Profile updated!');
    } else {
      showToastMessage('❌ Error updating profile');
    }
  };
  
  const handleShareProfile = () => {
    navigator.clipboard.writeText(`${window.location.origin}/profile/${profile?.username}`);
    showToastMessage('Profile link copied!');
  };
  
  const handleOpenAvatarShop = () => setShowAvatarShop(true);
  
 const handleSelectAvatar = async (emoji: string) => {
  if (!profile) return;
  
  if (ownedAvatars.includes(emoji)) {
    setCurrentAvatar(emoji);  // ← This uses the setter
    await supabase
      .from("profiles")
      .update({ avatar: emoji })
      .eq("id", profile.id);
    setProfile({ ...profile, avatar: emoji });
    setShowAvatarShop(false);
    showToastMessage(`Avatar changed to ${emoji}!`);
  } else {
    showToastMessage("You don't own this avatar yet!");
  }
};
  const handlePurchaseAvatar = (avatar: { emoji: string; price: number; name: string }) => {
    if (ownedAvatars.includes(avatar.emoji)) {
      handleSelectAvatar(avatar.emoji);
      return;
    }
    setPendingPurchase(avatar);
    setShowConfirmModal(true);
  };
  
  const handleConfirmPurchase = async () => {
    if (!profile || !pendingPurchase) return;
    if (profile.coins >= pendingPurchase.price) {
      const newCoins = profile.coins - pendingPurchase.price;
      
      await supabase
        .from("profiles")
        .update({ coins: newCoins })
        .eq("id", profile.id);
      
      await supabase
        .from("user_avatars")
        .insert({ user_id: profile.id, avatar_emoji: pendingPurchase.emoji });
      
      await supabase
        .from("transactions")
        .insert({
          user_id: profile.id,
          type: `Avatar Purchase: ${pendingPurchase.name}`,
          amount: pendingPurchase.price
        });
      
      setProfile({ ...profile, coins: newCoins });
      setOwnedAvatars([...ownedAvatars, pendingPurchase.emoji]);
      setCurrentAvatar(pendingPurchase.emoji);
      
      const newTransaction = {
        id: Date.now().toString(),
        type: `Avatar Purchase: ${pendingPurchase.name}`,
        amount: pendingPurchase.price,
        date: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      setTransactions([newTransaction, ...transactions]);
      
      await earnXP(Math.floor(pendingPurchase.price / 10), `Purchased ${pendingPurchase.name} avatar`);
      
      setShowConfirmModal(false);
      setShowAvatarShop(false);
      showToastMessage(`✨ Purchased ${pendingPurchase.emoji} ${pendingPurchase.name}! +${Math.floor(pendingPurchase.price / 10)} XP`);
    } else {
      showToastMessage(`❌ Not enough coins! Need ${pendingPurchase.price - profile.coins} more.`);
    }
    setPendingPurchase(null);
  };
  
  const handleOpenLevelModal = () => setShowLevelModal(true);
  const handleOpenStreakModal = () => setShowStreakModal(true);
  const handleOpenAchievementsModal = () => {
    fetchBadges();
    setShowAchievementsModal(true);
  };
  const handleOpenTransactionModal = () => setShowTransactionModal(true);
  const handleOpenFollowersModal = () => {
    if (profile) fetchFollowers(profile.id);
    setShowFollowersModal(true);
  };
  const handleOpenFollowingModal = () => {
    if (profile) fetchFollowing(profile.id);
    setShowFollowingModal(true);
  };
  const handleOpenReferralModal = () => {
    fetchReferralStats();
    setShowReferralModal(true);
  };
  
  const handleLikePost = async (postId: string) => {
    if (!profile) return;
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    if (post.liked_by_user) {
      await supabase
        .from("likes")
        .delete()
        .eq("user_id", profile.id)
        .eq("post_id", postId);
      await supabase
        .from("posts")
        .update({ likes_count: post.likes_count - 1 })
        .eq("id", postId);
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes_count: p.likes_count - 1, liked_by_user: false } : p
      ));
    } else {
      await supabase
        .from("likes")
        .insert({ user_id: profile.id, post_id: postId });
      await supabase
        .from("posts")
        .update({ likes_count: post.likes_count + 1 })
        .eq("id", postId);
      setPosts(posts.map(p => 
        p.id === postId ? { ...p, likes_count: p.likes_count + 1, liked_by_user: true } : p
      ));
      await earnXP(5, `Liked a post`);
      showToastMessage(`❤️ Liked post! +5 XP`);
    }
  };
  
  const handleTipPost = async (postId: string, postUserId: string) => {
    if (!profile) return;
    const tipAmount = 20;
    if (profile.coins >= tipAmount) {
      const newCoins = profile.coins - tipAmount;
      await supabase
        .from("profiles")
        .update({ coins: newCoins })
        .eq("id", profile.id);
      await supabase
        .from("profiles")
        .update({ coins: profile.coins + tipAmount })
        .eq("id", postUserId);
      await supabase
        .from("transactions")
        .insert({
          user_id: profile.id,
          type: 'Sent Tip',
          amount: tipAmount
        });
      setProfile({ ...profile, coins: newCoins });
      const newTransaction = {
        id: Date.now().toString(),
        type: 'Sent Tip',
        amount: tipAmount,
        date: new Date().toISOString(),
        created_at: new Date().toISOString()
      };
      setTransactions([newTransaction, ...transactions]);
      await earnXP(10, `Tipped a post`);
      showToastMessage(`💎 Tipped ${tipAmount} coins! +10 XP`);
    } else {
      showToastMessage(`❌ Insufficient coins! Need ${tipAmount - profile.coins} more.`);
    }
  };
  
  const handleCreatePost = () => router.push('/create');
  const handleDiscoverUnities = () => router.push('/discover');
  
  // ============================================
  // EFFECTS
  // ============================================
  
  useEffect(() => {
    fetchAllData();
  }, []);
  
  // ============================================
  // RENDER
  // ============================================
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };
  
  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your profile...</p>
      </div>
    );
  }
  
  const level = calculateLevel(profile?.xp || 0);
  const levelTitle = getLevelTitle(level);
  const nextXP = getXPForNextLevel(profile?.xp || 0);
  const progress = getProgressToNextLevel(profile?.xp || 0);
  
  return (
    <>
      <div className={styles.myProfilePage}>
        <div className={styles.container}>
          {/* Header */}
          <header className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.leftGroup}>
                <div className={styles.menuIcon} onClick={() => router.push('/feed')}>
                  <i className="fas fa-bars"></i>
                </div>
                <div className={styles.logo} onClick={() => router.push('/feed')}>
                  <span>COME</span><span>UNITY</span>
                </div>
              </div>
              <div className={styles.headerActions}>
                <div className={styles.walletBadge} onClick={handleOpenTransactionModal}>
                  <i className="fas fa-coins"></i> <span>{profile?.coins?.toLocaleString() || 0}</span>
                </div>
                <div className={styles.headerIcon}>
                  <i className="far fa-bell"></i>
                </div>
              </div>
            </div>
          </header>
          
          <main className={styles.mainContent}>
            <ProfileHeader
              avatar={currentAvatar}
              firstName={profile?.first_name || ''}
              lastName={profile?.last_name || ''}
              username={profile?.username || ''}
              category={profile?.category || 'Art'}
              bio={profile?.bio || "No bio yet. Tap Edit to add one!"}
              verificationLevel={profile?.verification_level || 'creator'}
              onAvatarClick={handleOpenAvatarShop}
              onEditProfile={handleEditProfile}
              onShareProfile={handleShareProfile}
            />
            
            <ProfileStats
              followers={profile?.followers_count || 0}
              following={profile?.following_count || 0}
              onFollowersClick={handleOpenFollowersModal}
              onFollowingClick={handleOpenFollowingModal}
            />
            
            <LevelCard
              level={level}
              levelTitle={levelTitle}
              xp={profile?.xp || 0}
              nextXP={nextXP}
              progress={progress}
              streak={profile?.streak || 0}
              onLevelClick={handleOpenLevelModal}
              onStreakClick={handleOpenStreakModal}
              onReferralClick={handleOpenReferralModal}
            />
            
            <WalletCard
              coins={profile?.coins || 0}
              onWalletClick={handleOpenTransactionModal}
            />
            
            <AchievementsGrid
              achievements={badges}
              onViewAll={handleOpenAchievementsModal}
            />
            
            <ProfileTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              postsCount={posts.length}
              unitiesCount={unities.length}
            />
            
            {activeTab === 'posts' && (
              <div className={styles.postsTab}>
                {posts.length === 0 ? (
                  <EmptyState
                    icon="fa-camera"
                    title="No Posts Yet"
                    message="Share your first link or thought!"
                    actionText="Create Post"
                    onAction={handleCreatePost}
                  />
                ) : (
                  posts.map(post => (
                    <PostCard
                      key={post.id}
                      avatar={currentAvatar}
                      author={`${profile?.first_name} ${profile?.last_name}`}
                      time={formatDate(post.created_at)}
                      content={post.content}
                      link={post.link ? {
                        url: post.link,
                        domain: post.link_domain || 'link',
                        title: post.link_title || 'View content'
                      } : undefined}
                      likes={post.likes_count}
                      comments={post.comments_count}
                      liked={post.liked_by_user}
                      onLike={() => handleLikePost(post.id)}
                      onComment={() => showToastMessage('Comment feature coming soon')}
                      onTip={() => handleTipPost(post.id, post.user_id)}
                    />
                  ))
                )}
              </div>
            )}
            
            {activeTab === 'unities' && (
              <div className={styles.unitiesTab}>
                {unities.length === 0 ? (
                  <EmptyState
                    icon="fa-users"
                    title="No Unities Joined"
                    message="Explore and join communities that match your interests!"
                    actionText="Discover Unities"
                    onAction={handleDiscoverUnities}
                  />
                ) : (
                  unities.map(unity => (
                    <UnityCard
                      key={unity.id}
                      name={unity.unity_name}
                      icon={unity.unity_icon || '🎨'}
                      members={unity.members}
                      tag={unity.tag}
                      onView={() => router.push(`/unity/${unity.unity_name}`)}
                    />
                  ))
                )}
              </div>
            )}
            
            {activeTab === 'treasure' && (
              <div className={styles.treasureTab}>
                <EmptyState
                  icon="fa-box-open"
                  title="No Saved Posts"
                  message="Treasure posts you love to find them later!"
                />
              </div>
            )}
          </main>
        </div>
      </div>
      
      {/* Modals */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={{
          first_name: profile?.first_name || '',
          last_name: profile?.last_name || '',
          username: profile?.username || '',
          bio: profile?.bio || '',
          category: profile?.category || 'Art'
        }}
        onSave={handleSaveProfile}
      />
      
      <TransactionModal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        transactions={transactions}
      />
      
      <AchievementsModal
        isOpen={showAchievementsModal}
        onClose={() => setShowAchievementsModal(false)}
        achievements={badges}
        onShare={(achievement) => {
          console.log('Share achievement:', achievement);
          showToastMessage(`🏆 I earned the ${achievement.name} badge!`);
        }}
      />
      
      <LevelModal
        isOpen={showLevelModal}
        onClose={() => setShowLevelModal(false)}
        currentXP={profile?.xp || 0}
      />
      
      <StreakModal
        isOpen={showStreakModal}
        onClose={() => setShowStreakModal(false)}
        currentStreak={profile?.streak || 0}
      />
      
      <FollowersModal
        isOpen={showFollowersModal}
        onClose={() => setShowFollowersModal(false)}
        title="Followers"
        followers={followers}
        onFollow={handleFollowUser}
        onUnfollow={handleUnfollowUser}
        showStats={true}
        searchable={true}
      />
      
      <FollowersModal
        isOpen={showFollowingModal}
        onClose={() => setShowFollowingModal(false)}
        title="Following"
        followers={following}
        onFollow={handleFollowUser}
        onUnfollow={handleUnfollowUser}
        showStats={true}
        searchable={true}
      />
      
      <ReferralModal
        isOpen={showReferralModal}
        onClose={() => setShowReferralModal(false)}
        referralCode={referralCode}
        referralInvites={referralInvites}
        referralXPEarned={referralXPEarned}
        onCopyCode={handleCopyReferralCode}
        onShare={handleShareReferral}
      />
      
      <AvatarShopModal
        isOpen={showAvatarShop}
        onClose={() => setShowAvatarShop(false)}
        ownedAvatars={ownedAvatars}
        currentAvatar={currentAvatar}
        coins={profile?.coins || 0}
        onSelectAvatar={handleSelectAvatar}
        onPurchase={handlePurchaseAvatar}
      />
      
      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setPendingPurchase(null);
        }}
        onConfirm={handleConfirmPurchase}
        title="Confirm Purchase"
        message={`Buy ${pendingPurchase?.emoji} ${pendingPurchase?.name} avatar for ${pendingPurchase?.price} coins?`}
      />
      
      {showToast && (
        <div className="toast">
          {showToast}
        </div>
      )}
    </>
  );
}