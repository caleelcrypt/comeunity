'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import BottomNav from './BottomNav';
import SliderContainer from './SliderContainer';
import FeedPage from '../../pages/Feed';
import UnitiesPage from '../../pages/Unities';
import MyProfilePage from '../../pages/MyProfile';
import PublicProfilePage from '../../pages/PublicProfile';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  const getPageIndex = (path: string) => {
    if (path === '/feed') return 0;
    if (path === '/unities') return 1;
    if (path === '/profile/me') return 2;
    return 0;
  };

  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    setIsClient(true);
    setCurrentPage(getPageIndex(pathname));
  }, []);

  useEffect(() => {
    if (isClient) {
      setCurrentPage(getPageIndex(pathname));
    }
  }, [pathname, isClient]);

  const handlePageChange = (index: number) => {
    setCurrentPage(index);
    if (index === 0) router.push('/feed');
    if (index === 1) router.push('/unities');
    if (index === 2) router.push('/profile/me');
  };

  // For profile pages that are not /profile/me, show PublicProfilePage
  const isProfilePage = pathname?.startsWith('/profile/') && pathname !== '/profile/me';
  
  if (isProfilePage) {
    return (
      <div className={styles.phoneFrame}>
        <PublicProfilePage />
        <BottomNav currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    );
  }

  const pages = [
    <FeedPage key="feed" />,
    <UnitiesPage key="unities" />,
    <MyProfilePage key="profile" />
  ];

  if (!isClient) {
    return (
      <div className={styles.phoneFrame}>
        <SliderContainer currentPage={currentPage} onPageChange={handlePageChange}>
          {pages}
        </SliderContainer>
        <BottomNav currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    );
  }

  return (
    <div className={styles.phoneFrame}>
      <SliderContainer currentPage={currentPage} onPageChange={handlePageChange}>
        {pages}
      </SliderContainer>
      <BottomNav currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
}