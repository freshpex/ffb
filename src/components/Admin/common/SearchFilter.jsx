import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { FaSearch, FaFilter, FaTimes, FaCalendarAlt } from "react-icons/fa";

const SearchFilter = ({
  onSearch,
  onFilter,
  filterOptions = [],
  searchPlaceholder = "Search...",
  showDateFilter = false,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  const filterMenuRef = useRef(null);
  const filterButtonRef = useRef(null);

  // Handle outside click to close filter menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target) &&
        !filterButtonRef.current.contains(event.target)
      ) {
        setShowFilterMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle search input
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Trigger search with a small delay
    setTimeout(() => {
      onSearch(value);
    }, 300);
  };

  // Handle filter selection
  const handleFilterChange = (category, value, checked) => {
    setSelectedFilters((prev) => {
      const newFilters = { ...prev };

      if (!newFilters[category]) {
        newFilters[category] = [];
      }

      if (checked) {
        newFilters[category] = [...newFilters[category], value];
      } else {
        newFilters[category] = newFilters[category].filter(
          (item) => item !== value,
        );
      }

      // If category has no values, remove it
      if (newFilters[category].length === 0) {
        delete newFilters[category];
      }

      return newFilters;
    });
  };

  // Handle date range changes
  const handleDateChange = (field, value) => {
    setDateRange((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    const filters = { ...selectedFilters };

    // Add date range to filters if set
    if (showDateFilter && (dateRange.start || dateRange.end)) {
      filters.dateRange = dateRange;
    }

    onFilter(filters);
    setShowFilterMenu(false);
  };

  // Clear all filters
  const clearFilters = () => {
    setSelectedFilters({});
    setDateRange({ start: "", end: "" });
    onFilter({});
    setShowFilterMenu(false);
  };

  // Count total active filters
  const countActiveFilters = () => {
    let count = 0;

    // Count selected filter values
    Object.values(selectedFilters).forEach((values) => {
      count += values.length;
    });

    // Count date filters
    if (dateRange.start) count++;
    if (dateRange.end) count++;

    return count;
  };

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm("");
              onSearch("");
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-200"
          >
            <FaTimes size={14} />
          </button>
        )}
      </div>

      {/* Filter Button */}
      <div className="relative">
        <button
          ref={filterButtonRef}
          onClick={() => setShowFilterMenu(!showFilterMenu)}
          className={`px-4 py-2 rounded-md border flex items-center gap-2 transition-colors ${
            countActiveFilters() > 0
              ? "bg-blue-600 border-blue-500 text-white"
              : "bg-gray-800 border-gray-700 text-gray-200 hover:bg-gray-700"
          }`}
        >
          <FaFilter size={14} />
          <span>Filters</span>
          {countActiveFilters() > 0 && (
            <span className="flex items-center justify-center h-5 w-5 bg-blue-500 rounded-full text-xs text-white">
              {countActiveFilters()}
            </span>
          )}
        </button>

        {/* Filter Dropdown Menu */}
        {showFilterMenu && (
          <div
            ref={filterMenuRef}
            className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-md shadow-lg z-10 border border-gray-700 overflow-hidden"
          >
            <div className="p-3 border-b border-gray-700">
              <h3 className="text-white font-medium">Filters</h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {/* Date Range Filters */}
              {showDateFilter && (
                <div className="p-3 border-b border-gray-700">
                  <h4 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                    <FaCalendarAlt size={14} className="text-gray-400" />
                    Date Range
                  </h4>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.start}
                        onChange={(e) =>
                          handleDateChange("start", e.target.value)
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-xs mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={dateRange.end}
                        onChange={(e) =>
                          handleDateChange("end", e.target.value)
                        }
                        className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Filter Options */}
              {filterOptions.map((category) => (
                <div
                  key={category.name}
                  className="p-3 border-b border-gray-700"
                >
                  <h4 className="text-white text-sm font-medium mb-2">
                    {category.label}
                  </h4>
                  <div className="space-y-1">
                    {category.options.map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          id={`filter-${category.name}-${option.value}`}
                          type="checkbox"
                          checked={
                            selectedFilters[category.name]?.includes(
                              option.value,
                            ) || false
                          }
                          onChange={(e) =>
                            handleFilterChange(
                              category.name,
                              option.value,
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 rounded border-gray-600 text-blue-600 focus:ring-blue-500 bg-gray-700"
                        />
                        <label
                          htmlFor={`filter-${category.name}-${option.value}`}
                          className="ml-2 text-sm text-gray-300"
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Filter Actions */}
            <div className="p-3 flex items-center justify-between">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-400 hover:text-white"
              >
                Clear All
              </button>
              <button
                onClick={applyFilters}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

SearchFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  onFilter: PropTypes.func,
  filterOptions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
            .isRequired,
        }),
      ).isRequired,
    }),
  ),
  searchPlaceholder: PropTypes.string,
  showDateFilter: PropTypes.bool,
  className: PropTypes.string,
};

export default SearchFilter;
