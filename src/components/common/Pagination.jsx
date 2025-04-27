import PropTypes from "prop-types";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always include first page
    pageNumbers.push(1);

    // Calculate start and end of pagination range
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    // Add ellipsis after page 1 if needed
    if (startPage > 2) {
      pageNumbers.push("...");
    }

    // Add page numbers in range
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push("...");
    }

    // Always include last page if there is more than one page
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Handle page click
  const handlePageClick = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // If there's only one page or no pages, don't render pagination
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex justify-center items-center space-x-1 ${className}`}>
      {/* Previous button */}
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          currentPage === 1
            ? "text-gray-500 cursor-not-allowed"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
        aria-label="Previous page"
      >
        <FaChevronLeft size={14} />
      </button>

      {/* Page numbers */}
      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <span
            key={`ellipsis-${index}`}
            className="w-8 h-8 flex items-center justify-center text-gray-500"
          >
            ...
          </span>
        ) : (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPage === page
                ? "bg-primary-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-gray-700"
            }`}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
          >
            {page}
          </button>
        ),
      )}

      {/* Next button */}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-8 h-8 rounded-full ${
          currentPage === totalPages
            ? "text-gray-500 cursor-not-allowed"
            : "text-gray-400 hover:text-white hover:bg-gray-700"
        }`}
        aria-label="Next page"
      >
        <FaChevronRight size={14} />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default Pagination;
