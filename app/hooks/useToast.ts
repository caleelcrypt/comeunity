import { useState, useCallback, useRef } from 'react';
import { ToastMessage } from '../types';

export const useToast = () => {
  const [queue, setQueue] = useState<ToastMessage[]>([]);
  const [active, setActive] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const processQueue = useCallback(() => {
    if (queue.length === 0) {
      setActive(false);
      return;
    }
    setActive(true);
    const { message, type } = queue[0];
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (type === 'coin') {
      toast.style.background = "linear-gradient(135deg, #ffd700, #ffaa00)";
      toast.style.color = "#1a1a1a";
      toast.style.fontWeight = "bold";
      toast.innerHTML = `<i class="fas fa-coins"></i> ${message}`;
    } else if (type === 'error') {
      toast.style.background = "linear-gradient(135deg, #ef4444, #dc2626)";
      toast.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    } else {
      toast.innerHTML = `<i class="fas fa-gem"></i> ${message}`;
    }
    document.body.appendChild(toast);
    
    timeoutRef.current = setTimeout(() => {
      toast.remove();
      setQueue(prev => prev.slice(1));
      processQueue();
    }, 2000);
  }, [queue]);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' | 'coin' = 'info') => {
    setQueue(prev => [...prev, { message, type }]);
    if (!active) processQueue();
  }, [active, processQueue]);

  return { showToast };
};