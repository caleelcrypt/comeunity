'use client';
import React, { useRef, useState, useEffect } from 'react';
import styles from './SliderContainer.module.css';

interface SliderContainerProps {
  children: React.ReactNode[];
  currentPage: number;
  onPageChange: (index: number) => void;
}

export default function SliderContainer({ children, currentPage, onPageChange }: SliderContainerProps) {
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const updateSliderPosition = (index: number, animated: boolean = true) => {
    if (!sliderTrackRef.current) return;
    const translateX = -index * 100;
    
    if (animated) {
      sliderTrackRef.current.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
    } else {
      sliderTrackRef.current.style.transition = 'none';
    }
    
    sliderTrackRef.current.style.transform = `translateX(${translateX}%)`;
    
    if (!animated) {
      void sliderTrackRef.current.offsetHeight;
      sliderTrackRef.current.style.transition = '';
    }
  };

  useEffect(() => {
    if (isClient) {
      updateSliderPosition(currentPage, true);
    }
  }, [currentPage, isClient]);

  if (!isClient) {
    return (
      <div className={styles.pagesContainer}>
        <div ref={sliderTrackRef} className={styles.sliderTrack}>
          {children.map((child, index) => (
            <div key={index} className={styles.pagePanel}>
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.pagesContainer}>
      <div ref={sliderTrackRef} className={styles.sliderTrack}>
        {children.map((child, index) => (
          <div key={index} className={styles.pagePanel}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}