'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  currentPage: number;
  onPageChange: (index: number) => void;
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { icon: 'fas fa-home', label: 'Home', path: '/feed', index: 0 },
    { icon: 'fas fa-users', label: 'Unities', path: '/unities', index: 1 },
    { icon: 'fas fa-user', label: 'Profile', path: '/profile', index: 2 }
  ];

  const handleNavClick = (item: typeof navItems[0]) => {
    // Don't navigate if already on that page
    if (pathname === item.path) {
      return;
    }
    
    // Update the parent state
    if (item.index !== currentPage) {
      onPageChange(item.index);
    }
    
    // Navigate
    router.push(item.path);
  };

  const isActive = (item: typeof navItems[0]) => {
    if (item.path === '/feed' && pathname === '/feed') return true;
    if (item.path === '/unities' && pathname === '/unities') return true;
    if (item.path === '/profile' && pathname === '/profile') return true;
    return currentPage === item.index;
  };

  return (
    <div className={styles.bottomNav}>
      {navItems.map((item) => (
        <div
          key={item.index}
          className={`${styles.navItem} ${isActive(item) ? styles.active : ''}`}
          onClick={() => handleNavClick(item)}
        >
          <i className={item.icon}></i>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}