import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleSidebar } from '../../redux/slices/layoutSlice';

const TouchSidebarHandler = ({ children }) => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.layout);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const minSwipeDistance = 50;

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
      
      if (isRightSwipe && !sidebarOpen && touchStartX.current < 50) {
        dispatch(toggleSidebar());
      } else if (isLeftSwipe && sidebarOpen) {
        dispatch(toggleSidebar());
      }
    };

    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [dispatch, sidebarOpen]);

  return <>{children}</>;
};

export default TouchSidebarHandler;
