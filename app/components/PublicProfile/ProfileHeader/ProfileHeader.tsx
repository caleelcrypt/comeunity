import React from 'react';

interface ProfileHeaderProps {
  creator: any;
  visitor: any;
  avatarCategory: string;
  onFollow: () => void;
  onTip: () => void;
  onShare: () => void;
  formatNumber: (num: number) => string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  creator,
  visitor,
  onFollow,
  onTip,
  onShare,
  formatNumber
}) => {
  return (
    <div className="relative bg-gradient-to-br from-[#ff4d6d]/10 to-[#4361ee]/10 border border-white/5 rounded-3xl p-6 mb-5 mt-0">
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] opacity-20 rounded-t-3xl"></div>
      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] flex items-center justify-center text-5xl mb-3">
          {creator.avatar || '😎'}
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          {creator.first_name} {creator.last_name}
        </h1>
        <p className="text-sm text-white/40 mb-2">@{creator.username}</p>
        {creator.bio && (
          <p className="text-sm text-white/70 max-w-[280px] mx-auto mb-4">{creator.bio}</p>
        )}
        <div className="flex gap-8 justify-center mb-5">
          <div className="text-center">
            <div className="text-xl font-bold text-white">{formatNumber(creator.followers_count || 0)}</div>
            <div className="text-xs text-white/40">Followers</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{formatNumber(creator.following_count || 0)}</div>
            <div className="text-xs text-white/40">Following</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-white">{formatNumber(creator.xp || 0)}</div>
            <div className="text-xs text-white/40">XP</div>
          </div>
        </div>
        {visitor.id && visitor.id !== creator.id && (
          <button
            onClick={onFollow}
            className={`px-8 py-2.5 rounded-full font-medium transition-all ${
              visitor.isFollowing
                ? 'bg-[#ff4d6d]/20 border border-[#ff4d6d] text-[#ff4d6d]'
                : 'bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] text-white'
            }`}
          >
            {visitor.isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
        <button
          onClick={onTip}
          className="mt-3 px-8 py-2.5 rounded-full font-medium bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
        >
          <i className="fas fa-coins mr-1"></i> Send Tip
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;