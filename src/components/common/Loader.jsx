import { memo } from "react";
import PropTypes from "prop-types";

const Loader = memo(({ fullScreen = true, size = "default", text = "Loading..." }) => {
  const sizes = {
    small: "w-8 h-8",
    default: "w-16 h-16",
    large: "w-24 h-24"
  };


  const loaderContent = (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`${sizes[size]} border-4 border-t-primary-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin`}
      />
      {text && <p className="mt-4 text-gray-300 font-medium">{text}</p>}
    </div>
  );

  // If fullScreen, render with a full screen overlay
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-gray-900/90 z-50 flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  // Otherwise, render without the overlay
  return loaderContent;
});

Loader.displayName = 'Loader';

Loader.propTypes = {
  fullScreen: PropTypes.bool,
  size: PropTypes.oneOf(["small", "default", "large"]),
  text: PropTypes.string
};

export default Loader;
