'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface BottomNavProps {
  currentPage: number;
  onPageChange: (index: number) => void;
}

export default function BottomNav({ currentPage, onPageChange }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  
  const navItems = [
    { icon: 'fas fa-home', label: 'Home', path: '/feed' },
    { icon: 'fas fa-users', label: 'Unities', path: '/unities' },
    { icon: 'fas fa-user', label: 'Profile', path: '/profile' }
  ];

  useEffect(() => {
    setIsClient(true);
  }, []);

  const createRipple = (event: React.MouseEvent | React.TouchEvent, element: HTMLElement) => {
    if (!isClient) return;
    const rect = element.getBoundingClientRect();
    const clientX = 'touches' in event ? event.touches[0].clientX : (event as React.MouseEvent).clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : (event as React.MouseEvent).clientY;
    const size = Math.max(rect.width, rect.height);
    const x = clientX - rect.left - size / 2;
    const y = clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple-effect');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 450);
  };

  const handleNavClick = (index: number, event: React.MouseEvent | React.TouchEvent) => {
    const target = event.currentTarget as HTMLElement;
    if (isClient) {
      createRipple(event, target);
    }
    
    if (index !== currentPage) {
      onPageChange(index);
      router.push(navItems[index].path);
    }
  };

  return (
    <div className="bottom-nav">
      {navItems.map((item, index) => (
        <div
          key={index}
          className={`nav-item ${currentPage === index ? 'active' : ''}`}
          data-nav={index}
          onClick={(e) => handleNavClick(index, e)}
        >
          <i className={item.icon}></i>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}