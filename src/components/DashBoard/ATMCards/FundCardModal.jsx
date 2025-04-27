import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fundCardFromBalance } from "../../../redux/slices/atmCardsSlice";
import Modal from "../../common/Modal";
import Button from "../../common/Button";
import Loader from "../../common/Loader";
import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

const FundCardModal = ({ isOpen, onClose, card, onSuccess }) => {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const transactionStatus = useSelector(
    (state) => state.atmCards.transactionStatus,
  );
  const accountBalance = useSelector(
    (state) => state.user?.profile?.balance || 0,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const fundAmount = parseFloat(amount);

    if (isNaN(fundAmount) || fundAmount <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (fundAmount > accountBalance) {
      setError("Insufficient account balance");
      return;
    }

    try {
      await dispatch(
        fundCardFromBalance({
          cardId: card.id || card._id,
          amount: fundAmount,
        }),
      ).unwrap();

      setAmount("");
      onSuccess("Card funded successfully");
    } catch (err) {
      setError(err.message || "Failed to fund card");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Fund Card from Balance">
      <div className="p-5">
        {transactionStatus === "loading" ? (
          <div className="flex justify-center py-8">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <div className="mb-6 bg-gray-700/30 rounded-lg p-4 flex items-center">
              <div className="mr-4 bg-primary-600/20 p-3 rounded-full text-primary-400">
                <FaMoneyBillWave size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Available Balance</p>
                <p className="text-xl font-medium text-white">
                  $
                  {accountBalance.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <div className="mb-6 bg-gray-700/30 rounded-lg p-4 flex items-center">
              <div className="mr-4 bg-blue-600/20 p-3 rounded-full text-blue-400">
                <FaCreditCard size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-400">Current Card Balance</p>
                <p className="text-xl font-medium text-white">
                  $
                  {(card?.balance || 0).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-400 text-sm">
                  {error}
                </div>
              )}

              <div className="mb-4">
                <label
                  htmlFor="amount"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Amount to Fund
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-400">$</span>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="bg-gray-800 text-white pl-8 pr-3 py-2 rounded-lg w-full border border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    min="0.01"
                    step="0.01"
                    required
                  />
                </div>
                <p className="mt-2 text-xs text-gray-400">
                  Transfer funds from your account balance to your card.
                </p>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" type="button" onClick={onClose}>
                  Cancel
                </Button>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={transactionStatus === "loading" || !amount}
                >
                  Fund Card
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </Modal>
  );
};

export default FundCardModal;
