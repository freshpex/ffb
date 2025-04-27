import React from "react";
import PropTypes from "prop-types";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useDarkMode } from "../../../context/DarkModeContext";

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}) => {
  const { darkMode } = useDarkMode();

  // Early return if we don't have enough data to render pagination
  if (!totalPages || totalPages <= 0) {
    return null;
  }

  // Generate page range to display
  const getPageRange = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= totalPages - 2) {
      return [
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const pageRange = getPageRange();

  // Calculate displayed items range
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col md:flex-row items-center justify-between">
      <div
        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-700"} mb-4 md:mb-0`}
      >
        Showing <span className="font-medium">{startItem}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> results
      </div>

      <div className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            darkMode
              ? currentPage === 1
                ? "text-gray-600 cursor-not-allowed"
                : "text-gray-300 hover:bg-gray-700"
              : currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaAngleLeft className="h-4 w-4" />
        </button>

        {pageRange[0] > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className={`px-3 py-1 rounded-md ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              1
            </button>
            {pageRange[0] > 2 && (
              <span
                className={`px-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                ...
              </span>
            )}
          </>
        )}

        {pageRange.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-md ${
              currentPage === page
                ? darkMode
                  ? "bg-primary-600 text-white"
                  : "bg-primary-600 text-white"
                : darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            {page}
          </button>
        ))}

        {pageRange[pageRange.length - 1] < totalPages && (
          <>
            {pageRange[pageRange.length - 1] < totalPages - 1 && (
              <span
                className={`px-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
              >
                ...
              </span>
            )}
            <button
              onClick={() => onPageChange(totalPages)}
              className={`px-3 py-1 rounded-md ${
                darkMode
                  ? "text-gray-300 hover:bg-gray-700"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {totalPages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            darkMode
              ? currentPage === totalPages
                ? "text-gray-600 cursor-not-allowed"
                : "text-gray-300 hover:bg-gray-700"
              : currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <FaAngleRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
