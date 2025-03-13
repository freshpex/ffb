import { useEffect, useRef } from 'react';

const TouchSidebarHandler = ({ onOpenSidebar, onCloseSidebar, isOpen }) => {
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const touchStartY = useRef(0); // Track vertical movement
  const minSwipeDistance = 70; // Minimum swipe distance in pixels
  const maxVerticalDeviation = 50; // Maximum allowed vertical movement
  
  useEffect(() => {
    const handleTouchStart = (e) => {
      touchStartX.current = e.touches[0].clientX;
      touchStartY.current = e.touches[0].clientY;
    };
    
    const handleTouchMove = (e) => {
      touchEndX.current = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e) => {
      // Calculate horizontal distance
      const horizontalDistance = touchEndX.current - touchStartX.current;
      
      // Calculate vertical distance to ensure it's mostly a horizontal swipe
      const verticalDistance = Math.abs(e.changedTouches[0].clientY - touchStartY.current);
      
      const isLeftSwipe = horizontalDistance < -minSwipeDistance;
      const isRightSwipe = horizontalDistance > minSwipeDistance;
      
      // Only trigger if it's a mostly horizontal swipe (not too much vertical movement)
      if (verticalDistance < maxVerticalDeviation) {
        // If swiping from left edge (first 30px) to right, open sidebar
        if (isRightSwipe && touchStartX.current < 30 && !isOpen) {
          onOpenSidebar();
        } 
        // If sidebar is open and swiping left, close it
        else if (isLeftSwipe && isOpen) {
          onCloseSidebar();
        }
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
  
  return null; // This component doesn't render anything
};

export default TouchSidebarHandler;
