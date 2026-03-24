'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  username: string;
  email: string;
  xp: number;
  own_referral_code: string;
  created_at: string;
};

export default function UserProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      // Get session instead of getUser to avoid lock issues
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        setProfile(data);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/auth';
  };

  // If no profile yet, show minimal loading (just text, no screen)
  if (!profile) {
    return (
      <div className="page-content">
        <div className="page-icon">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="page-label">Profile</div>
        <div className="page-sub">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <div className="page-icon">
        <i className="fas fa-user-circle"></i>
      </div>
      <div className="page-label">Profile</div>
      <div className="page-sub">Your identity</div>
      
      <div className="dashboard-card" style={{ width: '90%', maxWidth: '300px', marginTop: '20px' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="xp-badge" style={{ marginBottom: '12px' }}>⭐ {profile?.xp || 0} XP</div>
          <h3 style={{ color: 'white', marginBottom: '4px' }}>{profile?.full_name}</h3>
          <p style={{ color: '#ffb7c4', fontSize: '14px', marginBottom: '12px' }}>@{profile?.username}</p>
          <p style={{ color: '#9ca3af', fontSize: '12px' }}>{profile?.email}</p>
          <p style={{ color: '#9ca3af', fontSize: '11px', marginTop: '12px' }}>Joined: {new Date(profile?.created_at || '').toLocaleDateString()}</p>
          
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '10px',
              background: 'linear-gradient(105deg, #ff4d6d, #b5179e, #4361ee)',
              border: 'none',
              borderRadius: '44px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Logout
          </button>
        </div>
      </div>
      
      <div className="swipe-hint" style={{ marginTop: '20px' }}>
        <i className="fas fa-fingerprint"></i>
        <span>Edit profile coming soon</span>
      </div>
    </div>
  );
}