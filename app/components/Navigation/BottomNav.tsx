'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  currentPage: number;
  onPageChange: (index: number) => void;
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  const navItems = [
    { icon: 'fas fa-home', label: 'Home', path: '/feed', index: 0 },
    { icon: 'fas fa-users', label: 'Unities', path: '/unities', index: 1 },
    { icon: 'fas fa-user', label: 'Profile', path: '/profile/me', index: 2 }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.index !== currentPage) {
      onPageChange(item.index);
      router.push(item.path);
    }
  };

  return (
    <div className={styles.bottomNav}>
      {navItems.map((item) => (
        <div
          key={item.index}
          className={`${styles.navItem} ${currentPage === item.index ? styles.active : ''}`}
          onClick={() => handleNavClick(item)}
        >
          <i className={item.icon}></i>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}