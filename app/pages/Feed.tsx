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
  referred_by: string | null;
  created_at: string;
};

export default function FeedPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        
        if (profile) {
          setUser(profile);
          
          // Count referrals
          const { count } = await supabase
            .from("profiles")
            .select("*", { count: 'exact', head: true })
            .eq("referred_by", profile.id);
          
          setReferralCount(count || 0);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const copyReferralCode = () => {
    if (user?.own_referral_code) {
      navigator.clipboard.writeText(user.own_referral_code);
      alert(`📋 Copied: ${user.own_referral_code}`);
    }
  };

  if (!user) {
    return (
      <div className="page-content">
        <div className="page-icon">
          <i className="fas fa-home"></i>
        </div>
        <div className="page-label">Home</div>
        <div className="page-sub">Loading...</div>
      </div>
    );
  }

  return (
    <div className="page-content" style={{ width: '100%', padding: '20px', overflowY: 'auto', maxHeight: '100%' }}>
      {/* Welcome Header */}
      <div className="text-center mb-6">
        <div className="dashboard-heading" style={{ fontSize: '32px', marginBottom: '8px' }}>
          COMEUNITY
        </div>
        <div style={{ color: "#ff7b9c", fontWeight: "500", letterSpacing: "1px", fontSize: '12px' }}>
          Create.Connect.Collab.
        </div>
      </div>

      {/* User Info Card */}
      <div className="dashboard-card" style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '32px', padding: '20px', marginBottom: '16px' }}>
        <div className="info-row" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '20px', padding: '12px 16px' }}>
          <div style={{ fontWeight: "700", fontSize: "20px", color: "white", marginBottom: "8px" }}>{user.full_name}</div>
          <div style={{ color: "#ffb7c4", marginBottom: "4px", fontSize: '14px' }}>
            <i className="fas fa-at"></i> @{user.username}
          </div>
          <div style={{ color: "#9ca3af", marginBottom: "4px", fontSize: '13px' }}>
            <i className="far fa-envelope"></i> {user.email}
          </div>
          <div style={{ color: "#9ca3af", fontSize: '13px' }}>
            <i className="fas fa-link"></i> Referred by: {user.referred_by ? "Community Member" : "none"}
          </div>
          <div style={{ marginTop: "12px" }}>
            <span className="xp-badge" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", padding: "6px 14px", borderRadius: "40px", fontSize: '12px', fontWeight: '600' }}>
              ⭐ {user.xp || 0} XP
            </span>
          </div>
        </div>
      </div>

      {/* XP Card */}
      <div className="dashboard-card" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.15), rgba(245,158,11,0.1))", borderRadius: '32px', padding: '20px', marginBottom: '16px' }}>
        <p style={{ color: "#10b981", fontWeight: "600", marginBottom: "12px", fontSize: '14px' }}>
          <i className="fas fa-star"></i> YOUR XP BALANCE
        </p>
        <div style={{ fontSize: "56px", fontWeight: "800", color: "#fbbf24", textShadow: "0 2px 10px rgba(0,0,0,0.3)", textAlign: 'center' }}>
          {user.xp}
        </div>
        <div className="dashboard-text-muted" style={{ marginTop: "8px", textAlign: 'center', color: '#9ca3af', fontSize: '12px' }}>
          💡 Invite friends → +50 XP each!
        </div>
        <div className="dashboard-text-muted" style={{ marginTop: "4px", textAlign: 'center', color: '#9ca3af', fontSize: '11px' }}>
          You've referred {referralCount} {referralCount === 1 ? 'person' : 'people'}!
        </div>
      </div>

      {/* Referral Code Card */}
      <div className="dashboard-card" style={{ background: 'rgba(0,0,0,0.5)', borderRadius: '32px', padding: '20px', marginBottom: '16px' }}>
        <p style={{ color: "#ffb7c4", fontWeight: "600", marginBottom: "16px", fontSize: '14px' }}>
          <i className="fas fa-qrcode"></i> YOUR UNIQUE REFERRAL CODE
        </p>
        <div className="referral-box" style={{ background: "rgba(0, 0, 0, 0.6)", borderRadius: "60px", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", border: "1px solid rgba(255, 77, 109, 0.3)" }}>
          <code className="referral-code-text" style={{ fontFamily: "'SF Mono', monospace", fontSize: "18px", fontWeight: "700", letterSpacing: "1px", color: "#ffb347", background: "rgba(0,0,0,0.4)", padding: "4px 12px", borderRadius: "40px" }}>
            {user.own_referral_code}
          </code>
          <button 
            onClick={copyReferralCode}
            style={{ background: "rgba(255,255,255,0.1)", border: "none", padding: "8px 16px", borderRadius: "40px", color: "white", cursor: "pointer", fontSize: "14px" }}
          >
            <i className="far fa-copy"></i> Copy
          </button>
        </div>
        <p className="dashboard-text-muted" style={{ marginTop: "12px", textAlign: 'center', color: '#9ca3af', fontSize: '11px' }}>
          Share link: https://comeunity.com/?ref=<span style={{ color: "#ffb347" }}>{user.own_referral_code}</span>
        </p>
      </div>
    </div>
  );
}