import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import {
  FaTimes,
  FaClipboard,
  FaCheckCircle,
  FaExclamationCircle,
  FaQrcode,
  FaDownload,
} from "react-icons/fa";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Button from "./Button";

const TransactionDetailsModal = ({ transaction, onClose, showQR = false }) => {
  const [copySuccess, setCopySuccess] = useState(null);
  const receiptRef = useRef(null);

  // Handle copy to clipboard function
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess("Copied to clipboard!");

    setTimeout(() => {
      setCopySuccess(null);
    }, 2000);
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Format currency
  const formatCurrency = (amount, currency = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  };

  // Get status color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "success":
        return "bg-green-500/20 text-green-400";
      case "pending":
      case "processing":
        return "bg-yellow-500/20 text-yellow-400";
      case "failed":
      case "rejected":
        return "bg-red-500/20 text-red-400";
      case "cancelled":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
  };

  // Get status icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
      case "success":
        return <FaCheckCircle className="mr-2" />;
      case "failed":
      case "rejected":
        return <FaExclamationCircle className="mr-2" />;
      default:
        return null;
    }
  };

  const transactionType =
    transaction.type || (transaction.amount < 0 ? "withdrawal" : "deposit");

  const getReceiptNumber = () =>
    transaction.reference || transaction.id || transaction._id;

  const getReceiptDate = () =>
    formatDate(transaction.processedAt || transaction.createdAt);

  const getReceiptAmount = () => Math.abs(transaction.amount || 0);

  const getReceiptFee = () => Math.abs(transaction.fee || 0);

  const getReceiptTotal = () => getReceiptAmount() + getReceiptFee();

  const handleDownloadReceipt = async () => {
    if (!receiptRef.current) return;

    const canvas = await html2canvas(receiptRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    const safeType = transactionType.toLowerCase();
    const filename = `FFB-${safeType}-receipt-${getReceiptNumber()}.pdf`;
    pdf.save(filename);
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-gray-800 rounded-lg w-full max-w-md"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Off-screen receipt for PDF generation */}
        <div className="absolute left-[-9999px] top-0">
          <div
            ref={receiptRef}
            className="w-[700px] bg-white text-gray-900 p-8"
          >
            <div className="flex items-center justify-between border-b border-gray-200 pb-4">
              <div className="flex items-center gap-3">
                <img
                  src="/favicon.ico"
                  alt="FFB"
                  className="h-12 w-12"
                />
                <div>
                  <p className="text-lg font-bold">Fidelity First Brokers</p>
                  <p className="text-xs text-gray-500">
                    Transaction Receipt
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Receipt No</p>
                <p className="text-sm font-semibold">{getReceiptNumber()}</p>
                <p className="text-xs text-gray-500 mt-1">Issued</p>
                <p className="text-sm font-semibold">{getReceiptDate()}</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Transaction Type</p>
                <p className="text-sm font-semibold capitalize">
                  {transactionType}
                </p>
                <p className="text-xs text-gray-500 mt-3">Status</p>
                <p className="text-sm font-semibold capitalize">
                  {transaction.status}
                </p>
                <p className="text-xs text-gray-500 mt-3">Method</p>
                <p className="text-sm font-semibold capitalize">
                  {transaction.method}
                </p>
              </div>
              <div className="rounded border border-gray-200 p-4">
                <p className="text-xs text-gray-500">Amount</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(getReceiptAmount(), transaction.currency)}
                </p>
                {transaction.fee > 0 && (
                  <>
                    <p className="text-xs text-gray-500 mt-3">Fee</p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(getReceiptFee(), transaction.currency)}
                    </p>
                  </>
                )}
                <p className="text-xs text-gray-500 mt-3">Total</p>
                <p className="text-lg font-bold">
                  {formatCurrency(getReceiptTotal(), transaction.currency)}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded border border-gray-200 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Transaction ID</p>
                  <p className="text-sm font-semibold">
                    {transaction.id || transaction._id}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Reference</p>
                  <p className="text-sm font-semibold">
                    {transaction.reference || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Date</p>
                  <p className="text-sm font-semibold">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Currency</p>
                  <p className="text-sm font-semibold">
                    {transaction.currency || "USD"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between text-xs text-gray-500">
              <div>
                <p className="font-semibold text-gray-700">
                  Official Receipt
                </p>
                <p>Thank you for choosing FFB.</p>
              </div>
              <div className="text-right">
                <p className="uppercase tracking-widest">Authorized</p>
                <div className="mt-6 w-40 border-t border-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">
            Transaction Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>

        <div className="p-6">
          {/* Transaction Status */}
          <div className="flex items-center mb-6">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}
            >
              {getStatusIcon(transaction.status)}
              <span className="capitalize">{transaction.status}</span>
            </div>
          </div>

          {/* Main Details */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Transaction ID</span>
              <div className="text-white font-medium flex items-center">
                {transaction.id || transaction._id}
                <button
                  onClick={() => handleCopy(transaction.id || transaction._id)}
                  className="ml-2 text-gray-400 hover:text-primary-400 transition-colors"
                >
                  <FaClipboard size={14} />
                </button>
              </div>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Amount</span>
              <span className="text-white font-medium">
                {formatCurrency(
                  Math.abs(transaction.amount),
                  transaction.currency,
                )}
              </span>
            </div>

            {transaction.fee > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Fee</span>
                <span className="text-white font-medium">
                  {formatCurrency(transaction.fee, transaction.currency)}
                </span>
              </div>
            )}

            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Date</span>
              <span className="text-white font-medium">
                {formatDate(transaction.createdAt)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Type</span>
              <span className="text-white font-medium capitalize">
                {transactionType}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Method</span>
              <span className="text-white font-medium capitalize">
                {transaction.method}
              </span>
            </div>

            {transaction.reference && (
              <div className="flex justify-between py-2 border-b border-gray-700">
                <span className="text-gray-400">Reference</span>
                <div className="text-white font-medium flex items-center">
                  {transaction.reference}
                  <button
                    onClick={() => handleCopy(transaction.reference)}
                    className="ml-2 text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    <FaClipboard size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Display method-specific details */}
          {transaction.method === "bank_transfer" &&
            transaction.bankDetails && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-300 mb-3">
                  Bank Details
                </h4>
                <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                  {transaction.bankDetails.accountName && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Name</span>
                      <span className="text-white">
                        {transaction.bankDetails.accountName}
                      </span>
                    </div>
                  )}
                  {transaction.bankDetails.accountNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Account Number</span>
                      <span className="text-white">
                        {transaction.bankDetails.accountNumber}
                      </span>
                    </div>
                  )}
                  {transaction.bankDetails.bankName && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Bank Name</span>
                      <span className="text-white">
                        {transaction.bankDetails.bankName}
                      </span>
                    </div>
                  )}
                  {transaction.bankDetails.routingNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Routing Number</span>
                      <span className="text-white">
                        {transaction.bankDetails.routingNumber}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

          {/* Crypto wallet */}
          {transaction.method === "crypto" && transaction.walletAddress && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                Crypto Details
              </h4>
              <div className="bg-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Crypto Type</span>
                  <span className="text-white">
                    {transaction.cryptoType || "Bitcoin"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Wallet Address</span>
                  <div className="text-white flex items-center">
                    <span className="truncate max-w-[150px]">
                      {transaction.walletAddress}
                    </span>
                    <button
                      onClick={() => handleCopy(transaction.walletAddress)}
                      className="ml-2 text-gray-400 hover:text-primary-400 transition-colors"
                    >
                      <FaClipboard size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* QR Code for crypto transactions */}
          {showQR && transaction.method === "crypto" && (
            <div className="mb-6 text-center">
              <h4 className="text-sm font-medium text-gray-300 mb-3">
                Scan to Send Payment
              </h4>
              <div className="bg-white p-3 rounded-lg inline-block mx-auto">
                <FaQrcode size={150} className="text-gray-900" />
              </div>
              <p className="mt-2 text-sm text-gray-400">
                Scan this QR code to send payment
              </p>
            </div>
          )}

          {/* Notes or descriptions */}
          {transaction.note && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Note</h4>
              <p className="text-gray-400 text-sm">{transaction.note}</p>
            </div>
          )}

          {/* Copy message */}
          {copySuccess && (
            <div className="mt-3 text-center">
              <p className="text-green-400 text-sm">{copySuccess}</p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 mt-6">
            {transaction.status === "completed" && (
              <Button
                variant="outline"
                fullWidth
                onClick={handleDownloadReceipt}
              >
                <FaDownload className="mr-2" /> Download Receipt
              </Button>
            )}
            <Button fullWidth onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

TransactionDetailsModal.propTypes = {
  transaction: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  showQR: PropTypes.bool,
};

export default TransactionDetailsModal;
