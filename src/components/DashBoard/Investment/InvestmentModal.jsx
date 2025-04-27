import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import {
  makeInvestment,
  updateInvestmentForm,
  selectInvestmentForm,
  selectInvestmentStatus,
} from "../../../redux/slices/investmentSlice";
import {
  FaTimes,
  FaInfoCircle,
  FaMoneyBillWave,
  FaPercent,
  FaCalendarAlt,
  FaArrowRight,
  FaExclamationCircle,
} from "react-icons/fa";
import Loader from "../../common/Loader";

const InvestmentModal = ({ plan, onClose, userBalance }) => {
  const dispatch = useDispatch();
  const form = useSelector(selectInvestmentForm);
  const status = useSelector(selectInvestmentStatus);
  const [errors, setErrors] = useState({});

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d{0,2}$/.test(value)) {
      dispatch(updateInvestmentForm({ amount: value }));

      // Clear errors when user types
      if (errors.amount) {
        setErrors({ ...errors, amount: null });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const amount = parseFloat(form.amount);

    if (!form.amount || isNaN(amount) || amount <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (amount < plan.minAmount) {
      newErrors.amount = `Minimum investment is $${plan.minAmount.toLocaleString()}`;
    } else if (plan.maxAmount && amount > plan.maxAmount) {
      newErrors.amount = `Maximum investment is $${plan.maxAmount.toLocaleString()}`;
    } else if (amount > userBalance) {
      newErrors.amount = "Amount exceeds your available balance";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateReturns = () => {
    const amount = parseFloat(form.amount) || 0;
    return ((amount * plan.roi) / 100).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(
        makeInvestment({
          planId: plan.id,
          amount: parseFloat(form.amount),
        }),
      );

      onClose();
    } catch (error) {
      console.error("Investment failed:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-100">
                Invest in {plan.name}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="mb-6">
              <div className="bg-gray-700/30 p-4 rounded-lg">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-gray-400 text-xs mb-1 flex items-center">
                      <FaPercent className="mr-1" size={10} />
                      RETURN
                    </p>
                    <p className="text-primary-500 font-bold">{plan.roi}%</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1 flex items-center">
                      <FaCalendarAlt className="mr-1" size={10} />
                      DURATION
                    </p>
                    <p className="text-gray-200 font-bold">
                      {plan.duration} Days
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1 flex items-center">
                      <FaMoneyBillWave className="mr-1" size={10} />
                      MIN AMOUNT
                    </p>
                    <p className="text-gray-200 font-bold">${plan.minAmount}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-400 text-xs mb-1 flex items-center">
                    <FaInfoCircle className="mr-1" size={10} />
                    DESCRIPTION
                  </p>
                  <p className="text-gray-200 text-sm">{plan.description}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label
                  htmlFor="amount"
                  className="block text-gray-300 text-sm font-medium mb-2"
                >
                  Investment Amount
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
                    $
                  </span>
                  <input
                    type="text"
                    id="amount"
                    className={`block w-full pl-8 pr-12 py-3 bg-gray-700 border ${
                      errors.amount ? "border-red-500" : "border-gray-600"
                    } rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500`}
                    placeholder="0.00"
                    value={form.amount}
                    onChange={handleAmountChange}
                    disabled={status === "loading"}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      className="text-primary-500 hover:text-primary-400 text-xs font-bold"
                      onClick={() =>
                        dispatch(
                          updateInvestmentForm({
                            amount: userBalance.toFixed(2),
                          }),
                        )
                      }
                    >
                      MAX
                    </button>
                  </div>
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
                )}
                <p className="mt-1 text-xs text-gray-400">
                  Available balance: ${userBalance.toLocaleString()}
                </p>
              </div>

              <div className="bg-gray-700/30 p-4 rounded-lg mb-6">
                <div className="flex justify-between text-gray-300">
                  <span>Investment Amount:</span>
                  <span className="font-medium">
                    ${parseFloat(form.amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300 mt-2">
                  <span>Expected Return:</span>
                  <span className="font-medium text-green-500">
                    +${calculateReturns()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-300 mt-2">
                  <span>Duration:</span>
                  <span className="font-medium">{plan.duration} days</span>
                </div>
                <div className="flex justify-between text-gray-300 mt-2">
                  <span>Maturity Date:</span>
                  <span className="font-medium">
                    {new Date(
                      Date.now() + plan.duration * 24 * 60 * 60 * 1000,
                    ).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg mb-6 text-sm text-gray-300">
                <div className="flex">
                  <FaInfoCircle className="text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p>
                      By investing, you agree to the terms and conditions of
                      this investment plan. Early withdrawals may be subject to
                      fees or reduced returns.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="mr-4 px-4 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600"
                  disabled={status === "loading"}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center"
                  disabled={
                    status === "loading" ||
                    !form.amount ||
                    parseFloat(form.amount) <= 0
                  }
                >
                  {status === "loading" ? (
                    <Loader size="sm" className="mr-2" />
                  ) : (
                    <>
                      <span>Confirm Investment</span>
                      <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

InvestmentModal.propTypes = {
  plan: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    minAmount: PropTypes.number.isRequired,
    maxAmount: PropTypes.number,
    roi: PropTypes.number.isRequired,
    duration: PropTypes.number.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  userBalance: PropTypes.number.isRequired,
};

export default InvestmentModal;
