import { useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  FaBitcoin,
  FaCreditCard,
  FaEdit,
  FaRegStar,
  FaSave,
  FaTimes,
  FaTrash,
  FaUniversity,
} from "react-icons/fa";

const PaymentMethodCard = ({ method, onRemove, onSetDefault, onUpdate }) => {
  const isCard = method.type === "card";
  const isBank = method.type === "bank_account";
  const isCrypto = method.type === "crypto_wallet";

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});

  const displayName = method.nickname || method.name;

  const initialEditData = useMemo(() => {
    if (isCard) {
      return {
        nickname: method.nickname || method.name || "",
        cardholderName: method.cardholderName || "",
        expiryMonth: method.expiryMonth || "",
        expiryYear: method.expiryYear || "",
      };
    }

    if (isBank) {
      return {
        nickname: method.nickname || method.name || "",
        accountName: method.accountName || "",
        bankName: method.bankName || "",
        routingNumber: method.routingNumber || "",
      };
    }

    if (isCrypto) {
      return {
        nickname: method.nickname || method.name || "",
        walletType: method.walletType || "",
        walletAddress: method.walletAddress || "",
        network: method.network || "",
      };
    }

    return { nickname: method.nickname || method.name || "" };
  }, [
    isBank,
    isCard,
    isCrypto,
    method.accountName,
    method.bankName,
    method.cardholderName,
    method.expiryMonth,
    method.expiryYear,
    method.name,
    method.network,
    method.nickname,
    method.routingNumber,
    method.walletAddress,
    method.walletType,
  ]);

  const getExpiryDate = () => {
    if (isCard && method.expiryMonth && method.expiryYear) {
      return `${method.expiryMonth.toString().padStart(2, "0")}/${method.expiryYear
        .toString()
        .substring(2)}`;
    }
    return null;
  };

  const getIconBackground = () => {
    if (isCard) return "bg-blue-900/20 text-blue-500";
    if (isBank) return "bg-green-900/20 text-green-500";
    if (isCrypto) return "bg-yellow-900/20 text-yellow-500";
    return "bg-gray-900/20 text-gray-500";
  };

  const getIcon = () => {
    if (isCard) return <FaCreditCard size={20} />;
    if (isBank) return <FaUniversity size={20} />;
    if (isCrypto) return <FaBitcoin size={20} />;
    return null;
  };

  const startEdit = () => {
    setEditData(initialEditData);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async () => {
    if (!onUpdate) return;

    const updates = {};

    if (typeof editData.nickname === "string" && editData.nickname.trim()) {
      updates.nickname = editData.nickname.trim();
    }

    if (isCard) {
      if (
        typeof editData.cardholderName === "string" &&
        editData.cardholderName.trim()
      ) {
        updates.cardholderName = editData.cardholderName.trim();
      }
      if (String(editData.expiryMonth).trim()) {
        updates.expiryMonth = Number(editData.expiryMonth);
      }
      if (String(editData.expiryYear).trim()) {
        updates.expiryYear = Number(editData.expiryYear);
      }
    }

    if (isBank) {
      if (
        typeof editData.accountName === "string" &&
        editData.accountName.trim()
      ) {
        updates.accountName = editData.accountName.trim();
      }
      if (typeof editData.bankName === "string" && editData.bankName.trim()) {
        updates.bankName = editData.bankName.trim();
      }
      if (
        typeof editData.routingNumber === "string" &&
        editData.routingNumber.trim()
      ) {
        updates.routingNumber = editData.routingNumber.trim();
      }
    }

    if (isCrypto) {
      if (
        typeof editData.walletType === "string" &&
        editData.walletType.trim()
      ) {
        updates.walletType = editData.walletType.trim();
      }
      if (
        typeof editData.walletAddress === "string" &&
        editData.walletAddress.trim()
      ) {
        updates.walletAddress = editData.walletAddress.trim();
      }
      if (typeof editData.network === "string" && editData.network.trim()) {
        updates.network = editData.network.trim();
      }
    }

    await onUpdate(updates);
    setIsEditing(false);
  };

  const cryptoShort = (() => {
    if (!method.walletAddress) return null;
    const addr = String(method.walletAddress);
    if (addr.length <= 14) return addr;
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  })();

  return (
    <div
      className={`
      bg-gray-800
      border ${method.isDefault ? "border-primary-500" : "border-gray-700"}
      rounded-lg p-4
      transition-all duration-200
      ${method.isDefault ? "shadow-md shadow-primary-900/20" : ""}
    `}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center">
          <div
            className={`
            w-12 h-12
            flex items-center justify-center
            rounded-full
            ${getIconBackground()}
            mr-4
          `}
          >
            {getIcon()}
          </div>

          <div>
            <div className="flex items-center">
              <h4 className="font-medium text-gray-200">{displayName}</h4>
              {method.isDefault && (
                <span className="ml-2 px-2 py-0.5 bg-primary-900/20 text-primary-500 text-xs rounded-full">
                  Default
                </span>
              )}
            </div>

            <div className="text-sm text-gray-400 mt-1">
              {isCard ? (
                <span>
                  •••• {method.last4}
                  {getExpiryDate() && (
                    <span className="ml-2">Expires {getExpiryDate()}</span>
                  )}
                </span>
              ) : null}

              {isBank ? (
                <span>
                  {method.bankName} ••••{method.last4}
                </span>
              ) : null}

              {isCrypto ? (
                <span>
                  {method.walletType || "Crypto"}
                  {cryptoShort ? <span> • {cryptoShort}</span> : null}
                  {method.network && method.network !== "mainnet" ? (
                    <span className="ml-2 text-xs bg-gray-700 px-1.5 py-0.5 rounded">
                      {method.network}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </div>

            {isCard && method.cardholderName ? (
              <div className="text-xs text-gray-500 mt-1">
                Cardholder: {method.cardholderName}
              </div>
            ) : null}

            {isBank && method.accountName ? (
              <div className="text-xs text-gray-500 mt-1">
                Account name: {method.accountName}
              </div>
            ) : null}

            {isCrypto && method.walletAddress ? (
              <div className="text-xs text-gray-500 mt-1 break-all font-mono">
                {method.walletAddress}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex space-x-2">
          {onUpdate ? (
            <>
              <button
                onClick={isEditing ? saveEdit : startEdit}
                className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
                title={isEditing ? "Save changes" : "Edit payment method"}
              >
                {isEditing ? <FaSave size={16} /> : <FaEdit size={16} />}
              </button>
              {isEditing ? (
                <button
                  onClick={cancelEdit}
                  className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
                  title="Cancel editing"
                >
                  <FaTimes size={16} />
                </button>
              ) : null}
            </>
          ) : null}

          {!method.isDefault && (
            <button
              onClick={onSetDefault}
              className="p-2 text-gray-400 hover:text-primary-500 transition-colors"
              title="Set as default"
            >
              <FaRegStar size={16} />
            </button>
          )}

          <button
            onClick={onRemove}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Remove payment method"
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-4 border-t border-gray-700 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Nickname
              </label>
              <input
                name="nickname"
                value={editData.nickname ?? ""}
                onChange={handleEditChange}
                className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                placeholder="e.g., Main card"
              />
            </div>

            {isCard ? (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Cardholder name
                  </label>
                  <input
                    name="cardholderName"
                    value={editData.cardholderName ?? ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Name on card"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Expiry month
                  </label>
                  <input
                    name="expiryMonth"
                    value={editData.expiryMonth ?? ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="MM"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Expiry year
                  </label>
                  <input
                    name="expiryYear"
                    value={editData.expiryYear ?? ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="YYYY"
                  />
                </div>
              </>
            ) : null}

            {isBank ? (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Account name
                  </label>
                  <input
                    name="accountName"
                    value={editData.accountName ?? ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Account name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Bank name
                  </label>
                  <input
                    name="bankName"
                    value={editData.bankName ?? ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Bank name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Routing number
                  </label>
                  <input
                    name="routingNumber"
                    value={editData.routingNumber ?? ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Routing number"
                  />
                </div>
              </>
            ) : null}

            {isCrypto ? (
              <>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Wallet type
                  </label>
                  <input
                    name="walletType"
                    value={editData.walletType ?? ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="e.g., Bitcoin"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm text-gray-400 mb-1">
                    Wallet address
                  </label>
                  <input
                    name="walletAddress"
                    value={editData.walletAddress ?? ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="Wallet address"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Network
                  </label>
                  <input
                    name="network"
                    value={editData.network ?? ""}
                    onChange={handleEditChange}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-600"
                    placeholder="mainnet"
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
};

PaymentMethodCard.propTypes = {
  method: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    nickname: PropTypes.string,
    last4: PropTypes.string,
    isDefault: PropTypes.bool.isRequired,
    // card
    cardholderName: PropTypes.string,
    expiryMonth: PropTypes.number,
    expiryYear: PropTypes.number,
    // bank
    bankName: PropTypes.string,
    accountName: PropTypes.string,
    routingNumber: PropTypes.string,
    // crypto
    walletType: PropTypes.string,
    walletAddress: PropTypes.string,
    network: PropTypes.string,
  }).isRequired,
  onRemove: PropTypes.func.isRequired,
  onSetDefault: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
};

export default PaymentMethodCard;
