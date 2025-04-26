import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { FaChevronUp, FaChevronDown, FaEllipsisV, FaSpinner } from 'react-icons/fa';
import {
  fetchPortfolio,
  selectPositions,
  selectTradingStatus
} from '../../redux/slices/tradingSlice';

/**
 * Reusable component for displaying user positions/holdings
 */
const PositionsTable = ({ 
  variant = 'standard', // 'standard', 'compact', 'advanced'
  showHeader = true,
  showActions = true,
  maxItems = null,
  className = '',
  onPositionClick = () => {}
}) => {
  const dispatch = useDispatch();
  const positions = useSelector(selectPositions);
  const status = useSelector(selectTradingStatus);
  
  // Load positions on mount
  useEffect(() => {
    if (status.portfolio !== 'loading') {
      dispatch(fetchPortfolio());
    }
  }, [dispatch, status.portfolio]);
  
  // Format price with correct precision based on value
  const formatPrice = (price) => {
    if (typeof price !== 'number') return '0.00';
    
    if (price >= 1000) {
      return price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else if (price >= 1) {
      return price.toFixed(2);
    } else if (price >= 0.01) {
      return price.toFixed(4);
    } else {
      return price.toFixed(8);
    }
  };
  
  // Format percentage value
  const formatPercentage = (percentage) => {
    if (typeof percentage !== 'number') return '0.00%';
    return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
  };
  
  // Get positions to display (apply maxItems limit if set)
  const displayPositions = maxItems ? positions.slice(0, maxItems) : positions;
  
  // Check if positions are loading
  const isLoading = status.portfolio === 'loading';
  
  // Handle empty state
  if (!isLoading && (!positions || positions.length === 0)) {
    return (
      <div className={`bg-gray-800 rounded-lg p-4 ${className}`}>
        {showHeader && (
          <h3 className="text-sm font-medium text-white mb-4">Positions</h3>
        )}
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="text-gray-400 mb-2">No positions found</div>
          <div className="text-sm text-gray-500 max-w-md">
            When you buy assets, your positions will appear here. Start trading to build your portfolio.
          </div>
        </div>
      </div>
    );
  }
  
  // Compact variant (for dashboards, sidebars)
  if (variant === 'compact') {
    return (
      <div className={`bg-gray-800 rounded-lg ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between px-3 py-2 border-b border-gray-700">
            <h3 className="text-sm font-medium text-white">Positions</h3>
            {isLoading && (
              <FaSpinner className="animate-spin text-gray-400" size={14} />
            )}
          </div>
        )}
        
        {isLoading && positions.length === 0 ? (
          <div className="p-4 text-center">
            <FaSpinner className="animate-spin text-gray-400 mx-auto" size={20} />
            <p className="text-sm text-gray-400 mt-2">Loading positions...</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {displayPositions.map((position) => (
              <div 
                key={position.symbol} 
                className="p-3 hover:bg-gray-700/50 transition-colors cursor-pointer"
                onClick={() => onPositionClick(position)}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-white">{position.symbol}</span>
                  <span className={position.pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'}>
                    {formatPercentage(position.pnlPercentage)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="text-gray-400">
                    {formatPrice(position.amount)} {position.symbol}
                  </div>
                  <div className="text-right text-gray-300">
                    ${formatPrice(position.value)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Loading state
  if (isLoading && positions.length === 0) {
    return (
      <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
        {showHeader && (
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
            <h3 className="text-sm font-medium text-white">Positions</h3>
            <FaSpinner className="animate-spin text-gray-400" size={14} />
          </div>
        )}
        <div className="p-6 text-center">
          <FaSpinner className="animate-spin text-gray-400 mx-auto" size={24} />
          <p className="text-sm text-gray-400 mt-3">Loading positions...</p>
        </div>
      </div>
    );
  }

  // Standard variant (responsive)
  return (
    <div className={`bg-gray-800 rounded-lg overflow-hidden ${className}`}>
      {showHeader && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700">
          <h3 className="text-sm font-medium text-white">Positions</h3>
          {isLoading && (
            <FaSpinner className="animate-spin text-gray-400" size={14} />
          )}
        </div>
      )}
      
      {/* Desktop view - Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Asset
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Avg. Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Current Price
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                Value
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                PnL
              </th>
              {showActions && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {displayPositions.map((position) => (
              <tr 
                key={position.symbol}
                className="hover:bg-gray-700/30 transition-colors cursor-pointer"
                onClick={() => onPositionClick(position)}
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-2">
                      <div className="text-sm font-medium text-white">{position.symbol}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                  {formatPrice(position.amount)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                  ${formatPrice(position.avgPrice)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-gray-300">
                  ${formatPrice(position.currentPrice)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right font-medium text-white">
                  ${formatPrice(position.value)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                  <div className="flex flex-col items-end">
                    <span className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                      ${formatPrice(Math.abs(position.pnl))}
                    </span>
                    <span className={`text-xs ${position.pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {position.pnlPercentage >= 0 ? (
                        <FaChevronUp className="inline mr-1" size={8} />
                      ) : (
                        <FaChevronDown className="inline mr-1" size={8} />
                      )}
                      {formatPercentage(position.pnlPercentage)}
                    </span>
                  </div>
                </td>
                {showActions && (
                  <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onPositionClick(position, 'menu');
                      }}
                      className="text-gray-400 hover:text-white p-1 focus:outline-none"
                    >
                      <FaEllipsisV size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile view - Card layout */}
      <div className="md:hidden divide-y divide-gray-700">
        {displayPositions.map((position) => (
          <div 
            key={position.symbol} 
            className="p-4 hover:bg-gray-700/30 transition-colors cursor-pointer"
            onClick={() => onPositionClick(position)}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-white text-base">{position.symbol}</span>
              {showActions && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onPositionClick(position, 'menu');
                  }}
                  className="text-gray-400 hover:text-white p-1 focus:outline-none"
                >
                  <FaEllipsisV size={14} />
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div className="text-gray-400">Amount</div>
              <div className="text-right text-gray-300">
                {formatPrice(position.amount)}
              </div>
              
              <div className="text-gray-400">Avg Price</div>
              <div className="text-right text-gray-300">
                ${formatPrice(position.avgPrice)}
              </div>
              
              <div className="text-gray-400">Current Price</div>
              <div className="text-right text-gray-300">
                ${formatPrice(position.currentPrice)}
              </div>
              
              <div className="text-gray-400">Value</div>
              <div className="text-right font-medium text-white">
                ${formatPrice(position.value)}
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-1 border-t border-gray-700/50">
              <div className="text-gray-400 text-sm">P&L</div>
              <div className="flex flex-col items-end">
                <span className={position.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>
                  ${formatPrice(Math.abs(position.pnl))}
                </span>
                <span className={`text-xs ${position.pnlPercentage >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {position.pnlPercentage >= 0 ? (
                    <FaChevronUp className="inline mr-1" size={8} />
                  ) : (
                    <FaChevronDown className="inline mr-1" size={8} />
                  )}
                  {formatPercentage(position.pnlPercentage)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

PositionsTable.propTypes = {
  variant: PropTypes.oneOf(['standard', 'compact', 'advanced']),
  showHeader: PropTypes.bool,
  showActions: PropTypes.bool,
  maxItems: PropTypes.number,
  className: PropTypes.string,
  onPositionClick: PropTypes.func
};

export default PositionsTable;