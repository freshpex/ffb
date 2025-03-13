import { useEffect, useRef } from 'react';

const TouchSidebarHandler = ({ onOpenSidebar, onCloseSidebar, isOpen }) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 70;
  
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e) => {
      touchEndX.current = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      const distance = touchEndX.current - touchStartX.current;
      const isLeftSwipe = distance < -minSwipeDistance;
      const isRightSwipe = distance > minSwipeDistance;
      
      // If swiping from left edge (first 30px) to right, open sidebar
      if (isRightSwipe && touchStartX.current < 30 && !isOpen) {
        onOpenSidebar();
      } 
      // If sidebar is open and swiping left, close it
      else if (isLeftSwipe && isOpen) {
        onCloseSidebar();
      }
    };
    
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [onOpenSidebar, onCloseSidebar, isOpen]);
  
  return null;
};

export default TouchSidebarHandler;
