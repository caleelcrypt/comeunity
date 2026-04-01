'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import BottomNav from '../Navigation/BottomNav';
import { FeedHeader } from '../Navigation/FeedHeader';
import styles from './MainLayout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  // Define public routes that don't require authentication
  const publicRoutes = ['/auth', '/publicprofile', '/public-profile-test', '/test-users'];
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

  // Update current page based on pathname
  useEffect(() => {
    if (pathname === '/feed') setCurrentPage(0);
    else if (pathname === '/discover') setCurrentPage(1);
    else if (pathname === '/unities') setCurrentPage(2);
    else if (pathname === '/profile') setCurrentPage(3);
  }, [pathname]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      if (session?.user) {
        // Fetch user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('username, full_name, avatar_url, xp, level, coins')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUserProfile(profile);
        }
      }
      
      setLoading(false);
    };
    checkUser();
  }, []);

  // Show header and bottom nav on ALL authenticated pages (not just specific ones)
  const showNavigation = !isPublicRoute && user;

  // Don't show loading on public routes
  if (loading && !isPublicRoute) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        {/* Header - Show on all authenticated pages */}
        {showNavigation && (
          <FeedHeader
            onMenuClick={() => setShowSidebar(true)}
            onSearchClick={() => setShowSearchModal(true)}
            onNotificationClick={() => setShowNotificationModal(true)}
            userAvatar={userProfile?.avatar_url}
            username={userProfile?.username || user?.user_metadata?.username || 'User'}
            userXp={userProfile?.xp || 0}
            userLevel={userProfile?.level || 1}
            notificationCount={5}
            showUserProfile={true}
          />
        )}
        
        <main className={styles.main}>
          {children}
        </main>
        
        {/* Bottom Nav - Show on all authenticated pages */}
        {showNavigation && (
          <BottomNav 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
          />
        )}
      </div>

      {/* Modals that need to be accessible globally */}
      {/* These would need to be lifted up or use a context, but for now they can stay in pages */}
    </div>
  );
}