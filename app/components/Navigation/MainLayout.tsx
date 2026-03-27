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

  // Only show bottom nav on feed, unities, and profile pages, and only if user is logged in
  const showBottomNav = (pathname === '/feed' || pathname === '/unities' || pathname === '/profile') && user;

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <main className={styles.main}>
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