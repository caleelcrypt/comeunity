'use client';
import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import BottomNav from './BottomNav';
import styles from './MainLayout.module.css';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Define public routes that don't require authentication
  const publicRoutes = ['/auth', '/publicprofile', '/public-profile-test', '/test-users'];
  const isPublicRoute = publicRoutes.some(route => pathname?.startsWith(route));

  useEffect(() => {
    // Update current page based on pathname
    if (pathname === '/feed') setCurrentPage(0);
    else if (pathname === '/unities') setCurrentPage(1);
    else if (pathname === '/profile') setCurrentPage(2);
  }, [pathname]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkUser();
  }, []);

  // Only show bottom nav on authenticated pages
  // AND don't redirect on public routes
  const showBottomNav = !isPublicRoute && user && (pathname === '/feed' || pathname === '/unities' || pathname === '/profile');

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
        <main className={styles.main} style={{ paddingTop: 0, marginTop: 0 }}>
          {children}
        </main>
        
        {showBottomNav && (
          <BottomNav 
            currentPage={currentPage} 
            onPageChange={setCurrentPage} 
          />
        )}
      </div>
    </div>
  );
}