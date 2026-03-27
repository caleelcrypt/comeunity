import React from 'react';

interface ProfileTabsProps {
  activeTab: 'posts' | 'unities';
  onTabChange: (tab: 'posts' | 'unities') => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex gap-2 bg-white/5 p-1 rounded-full my-4">
      <button 
        className={`flex-1 py-2.5 text-center rounded-full text-sm font-medium transition-all ${
          activeTab === 'posts' ? 'bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] text-white' : 'text-white/70'
        }`}
        onClick={() => onTabChange('posts')}
      >
        Posts
      </button>
      <button 
        className={`flex-1 py-2.5 text-center rounded-full text-sm font-medium transition-all ${
          activeTab === 'unities' ? 'bg-gradient-to-r from-[#ff4d6d] to-[#4361ee] text-white' : 'text-white/70'
        }`}
        onClick={() => onTabChange('unities')}
      >
        Unities
      </button>
    </div>
  );
};

export default ProfileTabs;