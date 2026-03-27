'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import styles from './Feed.module.css';

export default function FeedPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState<string>('me');

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session?.user) {
        router.push('/auth');
        return;
      }

      setUser(session.user);

      // Fetch username
      const userMetadata = session.user.user_metadata;
      if (userMetadata?.username) {
        setUsername(userMetadata.username);
      } else {
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
        if (profile?.username) {
          setUsername(profile.username);
        }
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);
 
  
  const handleVisitProfile = () => {
    router.push(`/profile/${username}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  }; 

  

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.feedContainer}>
      <div className={styles.phoneFrame}>
        {/* Fixed Header */}
        <header className={styles.fixedHeader}>
          <div className={styles.headerContent}>
            <div className={styles.logo}>
              <span className={styles.logoGradient}>COME</span>UNITY
            </div>
            
            <div className={styles.headerActions}>
              <div className={styles.searchBar}>
                <i className="fas fa-search"></i>
                <input type="text" placeholder="Search..." />
              </div>
              <button className={styles.notificationBtn}>
                <i className="far fa-bell"></i>
              </button>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className={styles.scrollableContent}>
          <div className={styles.mainContent}>
            {/* Welcome Section */}
            <div className={styles.welcomeSection}>
              <h1 className={styles.title}>
                Welcome back, <span className={styles.gradient}>{user?.user_metadata?.first_name || 'Creator'}</span>!
              </h1>
              <p className={styles.subtitle}>
                Your streak is building. Keep creating and sharing your art with the community.
              </p>
              <button onClick={handleVisitProfile} className={styles.profileBtn}>
                Visit Your Profile →
              </button>
            </div>

            {/* Stats */}
            <div className={styles.statsContainer}>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>10K+</div>
                <div className={styles.statLabel}>Active Creators</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>50K+</div>
                <div className={styles.statLabel}>Posts Shared</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statNumber}>100K+</div>
                <div className={styles.statLabel}>Community Members</div>
              </div>
            </div>

            {/* Features Section */}
            <div className={styles.featuresSection}>
              <h2 className={styles.sectionTitle}>Why Join ComeUnity?</h2>
              <div className={styles.featuresGrid}>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🎨</div>
                  <h3>Share Your Art</h3>
                  <p>Post your creations and get feedback</p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🏆</div>
                  <h3>Earn Rewards</h3>
                  <p>Get XP, coins, and exclusive badges</p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>👥</div>
                  <h3>Build Community</h3>
                  <p>Join Unities, collaborate, grow together</p>
                </div>
                <div className={styles.featureCard}>
                  <div className={styles.featureIcon}>🛍️</div>
                  <h3>Collect Avatars</h3>
                  <p>Unlock 50+ unique avatars</p>
                </div>
              </div>
            </div>

            {/* Avatar Preview */}
            <div className={styles.avatarSection}>
              <h2 className={styles.sectionTitle}>50+ Unique Avatars</h2>
              <p className={styles.sectionSubtitle}>Express yourself with collectible avatars</p>
              <div className={styles.avatarGrid}>
                {['😎', '🥷', '🤖', '👽', '🐉', '🔥', '👑', '🌌'].map((emoji, i) => (
                  <div key={i} className={styles.avatarItem}>
                    {emoji}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <footer className={styles.footer}>
              <div className={styles.footerLogo}>COMEUNITY</div>
              <p className={styles.footerText}>Create. Connect. Collab.</p>
              <div className={styles.footerLinks}>
                <a href="/about">About</a>
                <a href="/terms">Terms</a>
                <a href="/privacy">Privacy</a>
                <a href="/contact">Contact</a>
              </div>
              <p className={styles.copyright}>© 2024 ComeUnity. All rights reserved.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}