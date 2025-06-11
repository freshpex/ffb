import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FaCopy, FaCheck, FaSpinner } from "react-icons/fa";
import { motion } from "framer-motion";

const QRCode = ({ value, size = 200, label, showCopyButton = true }) => {
  const [qrImage, setQrImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate QR code using QRServer API
  useEffect(() => {
    if (!value) return;

    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
    setQrImage(qrUrl);
    setIsLoading(false);
  }, [value, size]);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-gray-800 border border-gray-700 rounded-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="mb-2"
        >
          <FaSpinner size={30} className="text-primary-500" />
        </motion.div>
        <p className="text-gray-400 text-sm">Generating QR code...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 bg-gray-800 border border-gray-700 rounded-lg">
      {qrImage && (
        <img
          src={qrImage}
          alt={`QR Code for ${label || value}`}
          className="mb-4"
          width={size}
          height={size}
        />
      )}

      {label && <p className="text-sm text-gray-300 mb-2">{label}</p>}

      <div className="relative w-full max-w-md">
        <div className="bg-gray-700 p-2 rounded text-xs sm:text-sm text-gray-300 break-all">
          {value}
        </div>

        {showCopyButton && (
          <button
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors"
            onClick={handleCopy}
            title="Copy to clipboard"
          >
            {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
          </button>
        )}
      </div>
    </div>
  );
};

QRCode.propTypes = {
  value: PropTypes.string.isRequired,
  size: PropTypes.number,
  label: PropTypes.string,
  showCopyButton: PropTypes.bool,
};

export default QRCode;
