import { useEffect, useRef } from 'react';

const TouchSidebarHandler = ({ onOpenSidebar, onCloseSidebar, isOpen }) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0);
  const minSwipeDistance = 70;
  const maxVerticalDeviation = 50;
  
  useEffect(() => {
    const handleTouchStart = (e) => {
      // Only track touches starting from the left edge (for opening sidebar)
      // or anywhere if the sidebar is already open (for closing it)
      if (e.touches[0].clientX < 30 || isOpen) {
        touchStartX.current = e.touches[0].clientX;
        touchStartY.current = e.touches[0].clientY;
      }
    };
    
    const handleTouchMove = (e) => {
      if (touchStartX.current > 0 || isOpen) {
        touchEndX.current = e.touches[0].clientX;
      }
    };
    
    const handleTouchEnd = (e) => {
      if (touchStartX.current === 0 && !isOpen) return;
      
      const horizontalDistance = touchEndX.current - touchStartX.current;
      const verticalDistance = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
      
      const isLeftSwipe = horizontalDistance < -minSwipeDistance;
      const isRightSwipe = horizontalDistance > minSwipeDistance;
      
      // Only process horizontal swipes (not too much vertical movement)
      if (verticalDistance < maxVerticalDeviation) {
        // If swiping from left edge to right, open sidebar
        if (isRightSwipe && touchStartX.current < 30 && !isOpen) {
          onOpenSidebar();
        } 
        // If sidebar is open and swiping left, close it
        else if (isLeftSwipe && isOpen) {
          onCloseSidebar();
        }
      }
      
      // Reset touch tracking
      touchStartX.current = 0;
      touchEndX.current = 0;
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
