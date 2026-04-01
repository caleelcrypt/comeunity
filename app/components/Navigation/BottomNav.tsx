'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '../../../lib/supabaseClient';
import styles from './BottomNav.module.css';

interface BottomNavProps {
  currentPage?: number;
  onPageChange?: (index: number) => void;
}

interface NavItem {
  icon: string;
  label: string;
  path: string;
  index: number;
  showMessage?: boolean;
  message?: string;
}

const NAV_ITEMS: NavItem[] = [
  { icon: 'fas fa-home', label: 'Home', path: '/feed', index: 0 },
  { icon: 'fas fa-compass', label: 'Discover', path: '/discover', index: 1, showMessage: true, message: 'Discover feature coming soon! 🚀' },
  { icon: 'fas fa-users', label: 'Unities', path: '/unities', index: 2 },
  { icon: 'fas fa-user', label: 'Profile', path: '/profile', index: 3 }
];

export default function BottomNav({ currentPage = 0, onPageChange }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeIndex, setActiveIndex] = useState(currentPage);

  // Update active index when pathname changes
  useEffect(() => {
    const currentItem = NAV_ITEMS.find(item => item.path === pathname);
    if (currentItem) {
      setActiveIndex(currentItem.index);
      if (onPageChange && currentItem.index !== currentPage) {
        onPageChange(currentItem.index);
      }
    }
  }, [pathname, onPageChange, currentPage]);

  const showToast = (message: string) => {
    // Create temporary toast notification
    const toast = document.createElement('div');
    toast.className = styles.toast;
    toast.innerHTML = `<i class="fas fa-info-circle"></i> ${message}`;
    document.body.appendChild(toast);
    
    setTimeout(() => {
      toast.classList.add(styles.toastExit);
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  };

  const handleNavClick = (item: NavItem) => {
    // Show message if the item has showMessage flag
    if (item.showMessage && item.message) {
      showToast(item.message);
      return;
    }

    // Don't navigate if already on that page
    if (pathname === item.path) {
      return;
    }
    
    // Update the active index
    setActiveIndex(item.index);
    
    // Update parent state if provided
    if (onPageChange && item.index !== currentPage) {
      onPageChange(item.index);
    }
    
    // Navigate
    router.push(item.path);
  };

  const isActive = (item: NavItem) => {
    return activeIndex === item.index || pathname === item.path;
  };

  return (
    <nav className={styles.bottomNav}>
      {NAV_ITEMS.map((item) => (
        <div
          key={item.index}
          className={`${styles.navItem} ${isActive(item) ? styles.active : ''} ${item.showMessage ? styles.comingSoon : ''}`}
          onClick={() => handleNavClick(item)}
        >
          <i className={item.icon}></i>
          <span>{item.label}</span>
          {item.showMessage && (
            <span className={styles.comingSoonBadge}>Soon</span>
          )}
        </div>
      ))}
    </nav>
  );
}