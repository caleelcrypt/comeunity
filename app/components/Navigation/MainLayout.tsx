'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import BottomNav from './BottomNav';
import FeedPage from '../../pages/Feed';
import UnitiesPage from '../../pages/Unities';
import MyProfilePage from '../../pages/MyProfile';
import PublicProfilePage from '../../pages/PublicProfile';
import styles from './MainLayout.module.css';

export default function MainLayout() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);

  const getPageIndex = (path: string) => {
    if (path === '/feed') return 0;
    if (path === '/unities') return 1;
    if (path === '/profile/me') return 2;
    return 0;
  };

  useEffect(() => {
    setCurrentPage(getPageIndex(pathname));
  }, [pathname]);

  const handlePageChange = (index: number) => {
    setCurrentPage(index);
    if (index === 0) router.push('/feed');
    if (index === 1) router.push('/unities');
    if (index === 2) router.push('/profile/me');
  };

  const isProfilePage = pathname?.startsWith('/profile/') && pathname !== '/profile/me';
  
  if (isProfilePage) {
    return (
      <div className={styles.phoneFrame}>
        <PublicProfilePage />
        <BottomNav currentPage={currentPage} onPageChange={handlePageChange} />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 0:
        return <FeedPage />;
      case 1:
        return <UnitiesPage />;
      case 2:
        return <MyProfilePage />;
      default:
        return <FeedPage />;
    }
  };

  return (
    <div className={styles.phoneFrame}>
      <div className={styles.pageContainer}>
        {renderPage()}
      </div>
      <BottomNav currentPage={currentPage} onPageChange={handlePageChange} />
    </div>
  );
}