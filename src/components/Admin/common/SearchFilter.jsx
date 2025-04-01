import { useState } from 'react';
import PropTypes from 'prop-types';
import { FaSearch, FaFilter, FaTimes } from 'react-icons/fa';
import { useDarkMode } from '../../../context/DarkModeContext';

const SearchFilter = ({
  onSearch,
  searchPlaceholder = 'Search...',
  filters = [],
  showFilterLabels = true,
  className = ''
}) => {
  const { darkMode } = useDarkMode();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState(
    filters.reduce((acc, filter) => {
      acc[filter.id] = filter.defaultValue || '';
      return acc;
    }, {})
  );
  
  const hasActiveFilters = Object.values(filterValues).some(value => value !== '');
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch({ searchTerm, filters: filterValues });
  };
  
  const handleFilterChange = (id, value) => {
    setFilterValues(prev => ({
      ...prev,
      [id]: value
    }));
    
    // If immediate search is enabled, trigger search on filter change
    if (filters.find(f => f.id === id)?.searchOnChange) {
      onSearch({ 
        searchTerm, 
        filters: { ...filterValues, [id]: value }
      });
    }
  };
  
  const handleClearFilters = () => {
    const clearedFilters = {};
    filters.forEach(filter => {
      clearedFilters[filter.id] = '';
    });
    
    setFilterValues(clearedFilters);
    onSearch({ searchTerm, filters: clearedFilters });
  };
  
  return (
    <div className={`${
      darkMode ? 'bg-gray-800' : 'bg-white border border-gray-200 shadow-sm'
    } rounded-lg p-4 ${className}`}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-1 max-w-md">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className={darkMode ? 'text-gray-500' : 'text-gray-400'} />
            </div>
            <input
              type="text"
              className={`pl-10 pr-4 py-2 w-full rounded-l-lg focus:outline-none focus:ring-2 ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                  : 'bg-gray-50 border border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
              }`}
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-r-lg bg-primary-600 hover:bg-primary-700 text-white"
          >
            Search
          </button>
        </form>
        
        <div className="flex flex-wrap items-center gap-3">
          {filters.length > 0 && (
            <div className={`${showFilterLabels ? 'mr-0' : 'mr-2'} text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              <FaFilter className="inline mr-1" /> 
              {showFilterLabels && <span>Filters:</span>}
            </div>
          )}
          
          {filters.map((filter) => (
            <div key={filter.id} className="flex items-center">
              {showFilterLabels && (
                <label 
                  htmlFor={filter.id} 
                  className={`mr-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  {filter.label}:
                </label>
              )}
              
              <select
                id={filter.id}
                value={filterValues[filter.id] || ''}
                onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                className={`rounded-md text-sm px-2.5 py-1.5 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:ring-primary-500 focus:border-primary-500' 
                    : 'bg-gray-50 border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                } focus:outline-none focus:ring-2`}
              >
                <option value="">{filter.placeholder || 'All'}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
          
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className={`text-sm flex items-center px-2 py-1 rounded ${
                darkMode
                  ? 'text-gray-300 hover:bg-gray-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FaTimes className="mr-1" />
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

SearchFilter.propTypes = {
  onSearch: PropTypes.func.isRequired,
  searchPlaceholder: PropTypes.string,
  filters: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          value: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired
        })
      ).isRequired,
      defaultValue: PropTypes.string,
      placeholder: PropTypes.string,
      searchOnChange: PropTypes.bool
    })
  ),
  showFilterLabels: PropTypes.bool,
  className: PropTypes.string
};

export default SearchFilter;
