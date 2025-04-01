import PropTypes from 'prop-types';
import { FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa';
import { useDarkMode } from '../../../context/DarkModeContext';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  siblingCount = 1,
  className = '' 
}) => {
  const { darkMode } = useDarkMode();

  // If there's only one page, don't render pagination
  if (totalPages <= 1) return null;

  // Generate page numbers to show
  const generatePagination = () => {
    // Always show first page
    const firstPage = 1;
    // Always show last page
    const lastPage = totalPages;
    
    // Calculate range of visible pages
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    // Show dots only if there are more than 1 page between the sibling and the end value
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;
    
    // Initialize an array to store page numbers
    const pages = [];
    
    // Handle case when showing left dots
    if (showLeftDots) {
      pages.push(firstPage);
      pages.push('leftDots');
    } else {
      // No left dots, show all pages from 1 to leftSiblingIndex
      for (let i = firstPage; i <= leftSiblingIndex; i++) {
        pages.push(i);
      }
    }
    
    // Show pages between siblings (inclusive)
    for (let i = leftSiblingIndex + (showLeftDots ? 1 : 0); i <= rightSiblingIndex - (showRightDots ? 1 : 0); i++) {
      pages.push(i);
    }
    
    // Handle case when showing right dots
    if (showRightDots) {
      pages.push('rightDots');
      pages.push(lastPage);
    } else {
      // No right dots, show all pages from rightSiblingIndex to lastPage
      for (let i = rightSiblingIndex + 1; i <= lastPage; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  };
  
  const pages = generatePagination();
  
  // Base styles for pagination buttons
  const baseButtonClass = `flex items-center justify-center w-9 h-9 rounded-md text-sm font-medium transition-colors duration-150 ${
    darkMode 
      ? 'focus:ring-primary-600 focus:ring-offset-gray-800'
      : 'focus:ring-primary-600 focus:ring-offset-white'
  } focus:outline-none focus:ring-2 focus:ring-offset-2`;
  
  const activeButtonClass = `${baseButtonClass} ${
    darkMode 
      ? 'bg-primary-600 text-white' 
      : 'bg-primary-600 text-white'
  }`;
  
  const inactiveButtonClass = `${baseButtonClass} ${
    darkMode 
      ? 'text-gray-400 hover:bg-gray-700 hover:text-white' 
      : 'text-gray-700 hover:bg-gray-100'
  }`;
  
  const disabledButtonClass = `${baseButtonClass} ${
    darkMode 
      ? 'text-gray-600 bg-gray-800 cursor-not-allowed' 
      : 'text-gray-400 bg-gray-200 cursor-not-allowed'
  }`;

  return (
    <nav className={`flex items-center justify-between flex-wrap gap-4 ${className}`}>
      <div className="flex items-center text-sm">
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Page <span className="font-medium">{currentPage}</span> of{' '}
          <span className="font-medium">{totalPages}</span>
        </span>
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Previous page button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={currentPage === 1 ? disabledButtonClass : inactiveButtonClass}
          aria-label="Previous page"
        >
          <FaChevronLeft className="h-4 w-4" />
        </button>
        
        {/* Page numbers */}
        {pages.map((page, index) => {
          if (page === 'leftDots' || page === 'rightDots') {
            return (
              <span
                key={`dots-${index}`}
                className={`flex items-center justify-center w-9 h-9 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                <FaEllipsisH className="h-3 w-3" />
              </span>
            );
          }
          
          return (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={page === currentPage ? activeButtonClass : inactiveButtonClass}
              aria-label={`Page ${page}`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </button>
          );
        })}
        
        {/* Next page button */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={currentPage === totalPages ? disabledButtonClass : inactiveButtonClass}
          aria-label="Next page"
        >
          <FaChevronRight className="h-4 w-4" />
        </button>
      </div>
    </nav>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  siblingCount: PropTypes.number,
  className: PropTypes.string
};

export default Pagination;
