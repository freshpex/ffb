import { forwardRef } from 'react';
import PropTypes from 'prop-types';

const Button = forwardRef(({
  children,
  variant = "primary",
  size = "default",
  className = "",
  disabled = false,
  fullWidth = false,
  isLoading = false,
  type = "button",
  ...rest
}, ref) => {
  const variantClasses = {
    primary: "bg-primary-600 hover:bg-primary-700 text-white",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white", // Add success variant
    warning: "bg-yellow-600 hover:bg-yellow-700 text-white", // Add warning variant
    outline: "bg-transparent border border-gray-600 text-gray-300 hover:bg-gray-700"
  };
  
  const sizeClasses = {
    small: "py-1 px-3 text-xs",
    sm: "py-1 px-3 text-xs", // Alias for small
    default: "py-2 px-4 text-sm",
    large: "py-3 px-6 text-base",
    lg: "py-3 px-6 text-base" // Alias for large
  };
  
  const baseClasses = "rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50";
  const widthClass = fullWidth ? "w-full" : "";
  const disabledClass = disabled || isLoading ? "opacity-70 cursor-not-allowed" : "";
  
  return (
    <button
      ref={ref}
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size] || sizeClasses.default} ${widthClass} ${disabledClass} ${className}`}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
});

Button.displayName = 'Button';

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(["primary", "secondary", "danger", "success", "warning", "outline"]), // Update prop types
  size: PropTypes.oneOf(["small", "sm", "default", "large", "lg"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  isLoading: PropTypes.bool,
  type: PropTypes.string,
};

export default Button;
