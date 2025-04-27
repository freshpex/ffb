import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaMoneyBillWave,
  FaBitcoin,
  FaEthereum,
  FaUniversity,
  FaInfoCircle,
  FaArrowRight,
  FaCheckCircle,
  FaHistory,
  FaQrcode,
  FaDollarSign,
  FaPaypal,
  FaWallet,
} from "react-icons/fa";
import DashboardLayout from "../Layout/DashboardLayout";
import FormInput from "../../common/FormInput";
import Button from "../../common/Button";
import Alert from "../../common/Alert";
import { selectUserBalance } from "../../../redux/slices/userSlice";
import {
  selectWithdrawalStatus,
  selectWithdrawalError,
  selectPendingWithdrawal,
  updateWithdrawalForm,
  submitWithdrawal,
  resetWithdrawalForm,
} from "../../../redux/slices/withdrawalSlice";

const Withdraw = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const userBalance = useSelector(selectUserBalance);
  const withdrawalStatus = useSelector(selectWithdrawalStatus);
  const withdrawalError = useSelector(selectWithdrawalError);
  const pendingWithdrawal = useSelector(selectPendingWithdrawal);

  // Local state
  const [errors, setErrors] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [alert, setAlert] = useState(null);
  const [activeMethod, setActiveMethod] = useState(null);
  const [formData, setFormData] = useState({
    amount: "",
    method: "",
    walletAddress: "",
    bankDetails: {
      accountName: "",
      accountNumber: "",
      bankName: "",
      routingNumber: "",
    },
    paypalEmail: "",
    description: "",
  });

  // Withdrawal methods
  const withdrawalMethods = [
    {
      id: "bank_transfer",
      name: "Bank Transfer",
      description: "Withdraw directly to your bank account",
      processingTime: "1-3 business days",
      minAmount: 100,
      maxAmount: 50000,
      fee: "1%",
      status: "active",
    },
    {
      id: "cryptocurrency",
      name: "Cryptocurrency",
      description: "Withdraw via Bitcoin, Ethereum, or USDT",
      processingTime: "10-60 minutes",
      minAmount: 50,
      maxAmount: 500000,
      fee: "1%",
      status: "active",
      cryptoOptions: [
        { id: "BTC", name: "Bitcoin (BTC)" },
        { id: "ETH", name: "Ethereum (ETH)" },
        { id: "USDT", name: "Tether (USDT)" },
      ],
    },
    {
      id: "paypal",
      name: "PayPal",
      description: "Withdraw to your PayPal account",
      processingTime: "1-24 hours",
      minAmount: 10,
      maxAmount: 10000,
      fee: "1%",
      status: "active",
    },
  ];

  // Clear alerts after 5 seconds
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  // Reset confirmation when pending withdrawal changes
  useEffect(() => {
    if (pendingWithdrawal) {
      setShowConfirmation(true);
    }
  }, [pendingWithdrawal]);

  const handleMethodSelect = (method) => {
    setActiveMethod(method);
    setFormData({
      ...formData,
      method: method.id,
      cryptoType: null,
    });
  };

  const handleCryptoSelect = (crypto) => {
    setFormData({
      ...formData,
      cryptoType: crypto.id,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      // Handle nested objects (e.g., bankDetails.accountName)
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }

    // Clear the related error when the user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (
      activeMethod &&
      parseFloat(formData.amount) < activeMethod.minAmount
    ) {
      newErrors.amount = `Minimum withdrawal amount is $${activeMethod.minAmount}`;
    } else if (parseFloat(formData.amount) > userBalance) {
      newErrors.amount = `Insufficient balance. Your current balance is $${userBalance}`;
    }

    // Wallet address validation for crypto withdrawals
    if (activeMethod?.id === "cryptocurrency" && !formData.walletAddress) {
      newErrors.walletAddress = "Wallet address is required";
    }

    // Bank details validation for bank transfer
    if (activeMethod?.id === "bank_transfer") {
      if (!formData.bankDetails.accountName) {
        newErrors["bankDetails.accountName"] = "Account name is required";
      }
      if (!formData.bankDetails.accountNumber) {
        newErrors["bankDetails.accountNumber"] = "Account number is required";
      }
      if (!formData.bankDetails.bankName) {
        newErrors["bankDetails.bankName"] = "Bank name is required";
      }
      if (!formData.bankDetails.routingNumber) {
        newErrors["bankDetails.routingNumber"] = "Routing number is required";
      }
    }

    // PayPal email validation
    if (activeMethod?.id === "paypal" && !formData.paypalEmail) {
      newErrors.paypalEmail = "PayPal email is required";
    } else if (
      activeMethod?.id === "paypal" &&
      !/\S+@\S+\.\S+/.test(formData.paypalEmail)
    ) {
      newErrors.paypalEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!activeMethod) {
      setAlert({
        type: "error",
        message: "Please select a withdrawal method",
      });
      return;
    }

    if (activeMethod.id === "cryptocurrency" && !formData.cryptoType) {
      setAlert({
        type: "error",
        message: "Please select a cryptocurrency",
      });
      return;
    }

    if (!validateForm()) return;

    try {
      const withdrawalData = {
        method: activeMethod.id,
        amount: parseFloat(formData.amount),
        description:
          formData.description || `Withdrawal via ${activeMethod.name}`,
      };

      // Add method-specific details
      if (activeMethod.id === "cryptocurrency") {
        withdrawalData.walletAddress = formData.walletAddress;
        withdrawalData.cryptoType = formData.cryptoType;
      } else if (activeMethod.id === "bank_transfer") {
        withdrawalData.bankDetails = {
          accountName: formData.bankDetails.accountName,
          accountNumber: formData.bankDetails.accountNumber,
          bankName: formData.bankDetails.bankName,
          routingNumber: formData.bankDetails.routingNumber,
        };
      } else if (activeMethod.id === "paypal") {
        withdrawalData.paypalEmail = formData.paypalEmail;
      }

      console.log("Submitting withdrawal:", withdrawalData);

      await dispatch(submitWithdrawal(withdrawalData));

      // Success will be handled by useEffect when pendingWithdrawal is updated
    } catch (error) {
      setAlert({
        type: "error",
        message: error.message || "Failed to process withdrawal",
      });
    }
  };

  const handleViewTransactions = () => {
    navigate("/login/withdrawtransaction");
  };

  const getMethodIcon = (methodId) => {
    switch (methodId) {
      case "cryptocurrency":
        return <FaBitcoin className="text-yellow-500" />;
      case "bank_transfer":
        return <FaUniversity className="text-blue-400" />;
      case "paypal":
        return <FaPaypal className="text-blue-500" />;
      default:
        return <FaWallet className="text-green-500" />;
    }
  };

  const getCryptoIcon = (cryptoId) => {
    switch (cryptoId) {
      case "BTC":
        return <FaBitcoin className="text-yellow-500" />;
      case "ETH":
        return <FaEthereum className="text-blue-400" />;
      case "USDT":
        return <FaDollarSign className="text-green-500" />;
      default:
        return <FaBitcoin className="text-yellow-500" />;
    }
  };

  const calculateFee = (amount) => {
    if (!amount || isNaN(amount)) return 0;
    // Assuming 1% fee
    return parseFloat(amount) * 0.01;
  };

  const calculateTotal = (amount) => {
    if (!amount || isNaN(amount)) return 0;
    const fee = calculateFee(amount);
    return parseFloat(amount) + fee;
  };

  const renderWithdrawalConfirmation = () => {
    if (!pendingWithdrawal) return null;

    return (
      <motion.div
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-gray-800 rounded-lg p-6 w-full max-w-md"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
        >
          <div className="mb-6 text-center">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCheckCircle className="text-green-500 text-3xl" />
            </div>
            <h3 className="text-xl font-medium text-white mb-2">
              Withdrawal Submitted
            </h3>
            <p className="text-gray-400">
              Your withdrawal request has been successfully submitted and is
              being processed.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Amount:</span>
              <span className="text-white font-medium">
                ${Math.abs(pendingWithdrawal.amount)}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Fee:</span>
              <span className="text-white font-medium">
                $
                {pendingWithdrawal.fee ||
                  calculateFee(Math.abs(pendingWithdrawal.amount))}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Method:</span>
              <span className="text-white font-medium">
                {pendingWithdrawal.method}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Status:</span>
              <span className="text-yellow-400 font-medium">
                {pendingWithdrawal.status || "Pending"}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-700">
              <span className="text-gray-400">Date:</span>
              <span className="text-white font-medium">
                {new Date(
                  pendingWithdrawal.createdAt || Date.now(),
                ).toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={() => {
                setShowConfirmation(false);
                dispatch(resetWithdrawalForm());
              }}
            >
              Close
            </Button>
            <Button type="button" fullWidth onClick={handleViewTransactions}>
              View Transactions
            </Button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  return (
    <DashboardLayout>
      <motion.div
        className="w-full p-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Withdraw Funds
          </h1>

          <Button variant="outline" onClick={handleViewTransactions}>
            <FaHistory className="mr-2" /> View Withdrawal History
          </Button>
        </div>

        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6">
            {/* Available Balance */}
            <div className="mb-6 bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-medium mb-2">Available Balance</h3>
              <div className="text-2xl font-bold text-green-400">
                ${userBalance.toFixed(2)}
              </div>
            </div>

            {alert && (
              <Alert
                type={alert.type}
                message={alert.message}
                onDismiss={() => setAlert(null)}
                className="mb-6"
              />
            )}

            {withdrawalError && (
              <Alert
                type="error"
                message={withdrawalError}
                onDismiss={() => dispatch({ type: "withdrawal/clearError" })}
                className="mb-6"
              />
            )}

            {/* Withdrawal Methods */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-white mb-4">
                Select Withdrawal Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {withdrawalMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`bg-gray-800 p-5 rounded-lg border-2 cursor-pointer transition-all
                      ${
                        activeMethod?.id === method.id
                          ? "border-primary-500 shadow-lg"
                          : "border-gray-700 hover:border-gray-600"
                      }`}
                    onClick={() => handleMethodSelect(method)}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                        {getMethodIcon(method.id)}
                      </div>
                      <h3 className="text-white font-medium mb-1">
                        {method.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {method.processingTime}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cryptocurrency Options */}
            <AnimatePresence>
              {activeMethod?.id === "cryptocurrency" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <h2 className="text-lg font-medium text-white mb-4">
                    Select Cryptocurrency
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {activeMethod.cryptoOptions.map((crypto) => (
                      <div
                        key={crypto.id}
                        className={`bg-gray-800 p-5 rounded-lg border-2 cursor-pointer transition-all
                          ${
                            formData.cryptoType === crypto.id
                              ? "border-primary-500 shadow-lg"
                              : "border-gray-700 hover:border-gray-600"
                          }`}
                        onClick={() => handleCryptoSelect(crypto)}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-3">
                            {getCryptoIcon(crypto.id)}
                          </div>
                          <h3 className="text-white font-medium mb-1">
                            {crypto.name}
                          </h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Withdrawal Form */}
            {activeMethod && (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FormInput
                  label="Withdrawal Amount ($)"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount to withdraw"
                  error={errors.amount}
                  required
                />

                {/* Method-specific fields */}
                {activeMethod.id === "cryptocurrency" &&
                  formData.cryptoType && (
                    <FormInput
                      label={`${formData.cryptoType} Wallet Address`}
                      name="walletAddress"
                      value={formData.walletAddress}
                      onChange={handleChange}
                      placeholder="Enter your wallet address"
                      error={errors.walletAddress}
                      required
                    />
                  )}

                {activeMethod.id === "bank_transfer" && (
                  <div className="space-y-4">
                    <FormInput
                      label="Account Holder Name"
                      name="bankDetails.accountName"
                      value={formData.bankDetails.accountName}
                      onChange={handleChange}
                      placeholder="Enter account holder name"
                      error={errors["bankDetails.accountName"]}
                      required
                    />
                    <FormInput
                      label="Account Number"
                      name="bankDetails.accountNumber"
                      value={formData.bankDetails.accountNumber}
                      onChange={handleChange}
                      placeholder="Enter account number"
                      error={errors["bankDetails.accountNumber"]}
                      required
                    />
                    <FormInput
                      label="Bank Name"
                      name="bankDetails.bankName"
                      value={formData.bankDetails.bankName}
                      onChange={handleChange}
                      placeholder="Enter bank name"
                      error={errors["bankDetails.bankName"]}
                      required
                    />
                    <FormInput
                      label="Routing Number / SWIFT Code"
                      name="bankDetails.routingNumber"
                      value={formData.bankDetails.routingNumber}
                      onChange={handleChange}
                      placeholder="Enter routing number or SWIFT code"
                      error={errors["bankDetails.routingNumber"]}
                      required
                    />
                  </div>
                )}

                {activeMethod.id === "paypal" && (
                  <FormInput
                    label="PayPal Email"
                    name="paypalEmail"
                    type="email"
                    value={formData.paypalEmail}
                    onChange={handleChange}
                    placeholder="Enter PayPal email address"
                    error={errors.paypalEmail}
                    required
                  />
                )}

                <FormInput
                  label="Description (Optional)"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add a note to your withdrawal"
                />

                {/* Withdrawal Summary */}
                {formData.amount &&
                  !isNaN(formData.amount) &&
                  parseFloat(formData.amount) > 0 && (
                    <div className="bg-gray-800 p-4 rounded-lg my-6">
                      <h4 className="text-white font-medium mb-3">
                        Withdrawal Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Method:</span>
                          <span className="text-white">
                            {activeMethod.id === "cryptocurrency"
                              ? formData.cryptoType
                              : activeMethod.name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Amount:</span>
                          <span className="text-white">
                            ${parseFloat(formData.amount).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Fee (1%):</span>
                          <span className="text-white">
                            ${calculateFee(formData.amount).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-300">Total:</span>
                          <span className="text-white">
                            ${calculateTotal(formData.amount).toFixed(2)}
                          </span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-700">
                          <span className="text-gray-400">
                            Processing Time:
                          </span>
                          <span className="text-white">
                            {activeMethod.processingTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                <div className="flex justify-end mt-6">
                  <Button
                    type="submit"
                    isLoading={withdrawalStatus === "loading"}
                    disabled={withdrawalStatus === "loading"}
                  >
                    <FaArrowRight className="mr-2" /> Submit Withdrawal
                  </Button>
                </div>
              </motion.form>
            )}
          </div>
        </div>
      </motion.div>

      {/* Withdrawal confirmation modal */}
      <AnimatePresence>
        {showConfirmation && renderWithdrawalConfirmation()}
      </AnimatePresence>
    </DashboardLayout>
  );
};

export default Withdraw;
