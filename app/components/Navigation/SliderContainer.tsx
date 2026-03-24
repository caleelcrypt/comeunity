'use client';
import React, { useRef, useState, useEffect } from 'react';

interface SliderContainerProps {
  children: React.ReactNode[];
  currentPage: number;
  onPageChange: (index: number) => void;
}

export default function SliderContainer({ children, currentPage, onPageChange }: SliderContainerProps) {
  const sliderTrackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [startOffset, setStartOffset] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const lastMoveX = useRef(0);
  const lastMoveTime = useRef(0);

  // Only run on client
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

  const onDragStart = (clientX: number) => {
    if (!sliderTrackRef.current) return;
    setIsDragging(true);
    setTouchStartX(clientX);
    setStartOffset(-currentPage * 100);
    sliderTrackRef.current.style.transition = 'none';
    const newTranslate = -currentPage * 100;
    sliderTrackRef.current.style.transform = `translateX(${newTranslate}%)`;
  };

  const onDragMove = (clientX: number) => {
    if (!isDragging || !sliderTrackRef.current || !containerRef.current) return;
    const deltaX = clientX - touchStartX;
    const containerWidth = containerRef.current.offsetWidth;
    const percentMoved = (deltaX / containerWidth) * 100;
    let newTranslate = startOffset + percentMoved;
    
    const maxLeft = 0;
    const maxRight = -(children.length - 1) * 100;
    
    if (newTranslate > maxLeft) {
      newTranslate = maxLeft + (newTranslate - maxLeft) * 0.25;
    } else if (newTranslate < maxRight) {
      newTranslate = maxRight + (newTranslate - maxRight) * 0.25;
    }
    
    sliderTrackRef.current.style.transform = `translateX(${newTranslate}%)`;
  };

  const onDragEnd = (clientX: number) => {
    if (!isDragging || !containerRef.current) return;
    setIsDragging(false);
    
    const deltaX = clientX - touchStartX;
    const containerWidth = containerRef.current.offsetWidth;
    const threshold = containerWidth * 0.2;
    let newIndex = currentPage;
    
    if (Math.abs(deltaX) > threshold) {
      if (deltaX < 0 && currentPage < children.length - 1) {
        newIndex = currentPage + 1;
      } else if (deltaX > 0 && currentPage > 0) {
        newIndex = currentPage - 1;
      }
    }
    
    if (newIndex !== currentPage) {
      onPageChange(newIndex);
    } else {
      updateSliderPosition(currentPage, true);
    }
    
    if (sliderTrackRef.current) {
      sliderTrackRef.current.style.transition = 'transform 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1)';
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isClient) return;
    const touch = e.touches[0];
    if (!touch) return;
    onDragStart(touch.clientX);
    lastMoveX.current = touch.clientX;
    lastMoveTime.current = Date.now();
    e.preventDefault();
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isClient || !isDragging) return;
    const touch = e.touches[0];
    if (!touch) return;
    onDragMove(touch.clientX);
    lastMoveX.current = touch.clientX;
    lastMoveTime.current = Date.now();
    e.preventDefault();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isClient || !isDragging) return;
    const endClientX = e.changedTouches[0]?.clientX || touchStartX;
    onDragEnd(endClientX);
    e.preventDefault();
  };

  // Mouse events for desktop
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isClient) return;
    e.preventDefault();
    setIsMouseDown(true);
    onDragStart(e.clientX);
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isMouseDown) return;
      onDragMove(moveEvent.clientX);
    };
    
    const handleMouseUp = (upEvent: MouseEvent) => {
      setIsMouseDown(false);
      onDragEnd(upEvent.clientX);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Don't render interactive elements until client-side
  if (!isClient) {
    return (
      <div ref={containerRef} className="pages-container">
        <div ref={sliderTrackRef} className="slider-track">
          {children.map((child, index) => (
            <div key={index} className="page-panel" data-index={index}>
              {child}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="pages-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onDragStart={(e) => e.preventDefault()}
    >
      <div ref={sliderTrackRef} className="slider-track">
        {children.map((child, index) => (
          <div key={index} className="page-panel" data-index={index}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
}