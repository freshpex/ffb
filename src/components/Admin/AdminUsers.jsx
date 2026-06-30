import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaBell,
  FaChartLine,
  FaCheck,
  FaEdit,
  FaEnvelope,
  FaExchangeAlt,
  FaEye,
  FaHistory,
  FaLock,
  FaMoneyBillWave,
  FaSearch,
  FaTimes,
  FaTools,
} from "react-icons/fa";
import {
  fetchUsers,
  selectUsers,
  selectUsersPagination,
  selectUsersStatus,
} from "../../redux/slices/adminUsersSlice";
import { useDarkMode } from "../../context/DarkModeContext";
import PageTransition from "../common/PageTransition";
import ComponentLoader from "../common/ComponentLoader";
import Pagination from "./common/Pagination";
import StatusBadge from "./common/StatusBadge";
import { adminService } from "../../services/apiService";

const initialForms = {
  balance: {
    action: "credit",
    amount: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
  },
  ledger: {
    type: "deposit",
    amount: "",
    minAmount: "",
    maxAmount: "",
    count: 12,
    startDate: "",
    endDate: new Date().toISOString().slice(0, 10),
    description: "",
    affectBalance: false,
  },
  trade: {
    mode: "create",
    tradeId: "",
    action: "close",
    market: "crypto",
    accountLabel: "",
    symbol: "BTC/USDT",
    side: "buy",
    type: "market",
    quantity: "",
    price: "",
    closePrice: "",
    profit: "",
    swap: "0",
    commission: "0",
    deposit: "",
    balance: "",
    status: "filled",
    date: new Date().toISOString().slice(0, 10),
  },
  investment: {
    mode: "create",
    investmentId: "",
    action: "cancel",
    planId: "",
    amount: "",
    startDate: new Date().toISOString().slice(0, 10),
    status: "active",
    debitBalance: false,
  },
  notification: {
    sendTo: "user",
    title: "",
    message: "",
    type: "info",
    priority: "medium",
  },
};

const actionTiles = [
  { id: "balance", label: "Credit/Debit", icon: FaMoneyBillWave },
  { id: "ledger", label: "Ledgers", icon: FaHistory },
  { id: "trade", label: "Trades", icon: FaExchangeAlt },
  { id: "investment", label: "Investments", icon: FaChartLine },
  { id: "notification", label: "Notifications", icon: FaBell },
];

const planOptions = [
  { value: "", label: "Auto by amount" },
  { value: "roi-100", label: "$100 -> $500 ROI" },
  { value: "roi-200", label: "$200 -> $1,000 ROI" },
  { value: "roi-500", label: "$500 -> $5,000 ROI" },
  { value: "roi-700", label: "$700 -> $10,000 ROI" },
  { value: "roi-1000", label: "$1,000 -> $15,000 ROI" },
  { value: "roi-10000", label: "$10,000 -> $70,000 ROI" },
  { value: "roi-50000", label: "$50,000 -> $500,000 ROI" },
];

const getUserId = (user) => user?._id || user?.id;

const getFullName = (user) =>
  user?.fullName ||
  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
  user?.username ||
  "User";

const AdminUsers = () => {
  const { darkMode } = useDarkMode();
  const dispatch = useDispatch();

  const users = useSelector(selectUsers);
  const pagination = useSelector(selectUsersPagination);
  const status = useSelector(selectUsersStatus);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeAction, setActiveAction] = useState(null);
  const [forms, setForms] = useState(initialForms);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const [activityLoading, setActivityLoading] = useState(false);
  const [userActivity, setUserActivity] = useState({
    trades: [],
    investments: [],
  });

  const isLoading = status === "loading";
  const modalUserId = getUserId(selectedUser);

  useEffect(() => {
    document.title = "User Management | Admin Dashboard";
  }, []);

  useEffect(() => {
    dispatch(
      fetchUsers({
        page,
        limit,
        search: searchTerm,
        status: statusFilter,
      }),
    );
  }, [dispatch, page, limit, searchTerm, statusFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount || 0);

  const updateForm = (section, field, value) => {
    setForms((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const toOptionalNumber = (value) => {
    if (value === "" || value === null || value === undefined) return undefined;
    const number = Number(value);
    return Number.isFinite(number) ? number : undefined;
  };

  const buildTradePayload = () => {
    const trade = forms.trade;
    const quantity = toOptionalNumber(trade.quantity);
    const price = toOptionalNumber(trade.price);
    const closePrice = toOptionalNumber(trade.closePrice);
    const profit = toOptionalNumber(trade.profit);
    const swap = toOptionalNumber(trade.swap);
    const commission = toOptionalNumber(trade.commission);
    const deposit = toOptionalNumber(trade.deposit);
    const balance = toOptionalNumber(trade.balance);
    const total =
      quantity !== undefined && price !== undefined
        ? Number((quantity * price).toFixed(8))
        : undefined;

    return {
      market: trade.market,
      accountLabel: trade.accountLabel || undefined,
      symbol: trade.symbol,
      side: trade.side,
      type: trade.type,
      status: trade.status,
      quantity,
      amount: quantity,
      price,
      executionPrice: price,
      openPrice: price,
      closePrice,
      total,
      profit,
      swap,
      commission,
      deposit,
      balance,
      date: trade.date,
    };
  };

  const buildTradeUpdatePayload = () => {
    const trade = forms.trade;
    const quantity = toOptionalNumber(trade.quantity);
    const price = toOptionalNumber(trade.price);
    const closePrice = toOptionalNumber(trade.closePrice);
    const profit = toOptionalNumber(trade.profit);
    const swap = toOptionalNumber(trade.swap);
    const commission = toOptionalNumber(trade.commission);
    const deposit = toOptionalNumber(trade.deposit);
    const balance = toOptionalNumber(trade.balance);
    const total =
      quantity !== undefined && price !== undefined
        ? Number((quantity * price).toFixed(8))
        : undefined;

    return {
      action: trade.action || "update",
      market: trade.market,
      accountLabel: trade.accountLabel || undefined,
      symbol: trade.symbol || undefined,
      side: trade.side,
      type: trade.type,
      status: trade.status,
      quantity,
      amount: quantity,
      price,
      executionPrice: price,
      openPrice: price,
      closePrice,
      total,
      profit,
      swap,
      commission,
      deposit,
      balance,
      date: trade.date,
    };
  };

  const loadTradeIntoForm = (item, action = "update") => {
    const price = item.executionPrice ?? item.price ?? item.openPrice ?? "";
    setForms((prev) => ({
      ...prev,
      trade: {
        ...prev.trade,
        mode: "update",
        tradeId: item._id || item.id || "",
        action,
        market: item.market || "crypto",
        accountLabel: item.accountLabel || "",
        symbol: item.symbol || "",
        side: item.side || "buy",
        type: item.type || "market",
        quantity: item.quantity ?? item.amount ?? item.executedQuantity ?? "",
        price: price ?? "",
        closePrice: item.closePrice ?? "",
        profit: item.profit ?? "",
        swap: item.swap ?? "0",
        commission: item.commission ?? item.fee ?? "0",
        deposit: item.deposit ?? "",
        balance: item.balance ?? "",
        status: item.status || "filled",
        date: item.createdAt
          ? new Date(item.createdAt).toISOString().slice(0, 10)
          : prev.trade.date,
      },
    }));
  };

  const resetActionState = () => {
    setActiveAction(null);
    setActionError("");
    setActionSuccess("");
    setUserActivity({ trades: [], investments: [] });
  };

  const openActions = (user) => {
    setSelectedUser(user);
    setForms(initialForms);
    resetActionState();
  };

  const closeActions = () => {
    setSelectedUser(null);
    setForms(initialForms);
    resetActionState();
  };

  const loadUserActivity = async (kind, userId = modalUserId) => {
    if (!userId || !["trade", "investment"].includes(kind)) return;

    setActivityLoading(true);
    try {
      const response =
        kind === "trade"
          ? await adminService.getUserTrades(userId)
          : await adminService.getUserInvestments(userId);
      const rows = response?.data?.data || response?.data || [];
      setUserActivity((prev) => ({
        ...prev,
        [kind === "trade" ? "trades" : "investments"]: Array.isArray(rows)
          ? rows
          : [],
      }));
    } catch (err) {
      setActionError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Could not load existing activity",
      );
    } finally {
      setActivityLoading(false);
    }
  };

  const selectAction = (id) => {
    setActiveAction(id);
    setActionError("");
    setActionSuccess("");
    if (id === "trade" || id === "investment") {
      loadUserActivity(id);
    }
  };

  const handleImpersonate = async (user) => {
    try {
      const userId = getUserId(user);
      if (!userId) return;

      const masterKey = window.prompt(
        `Enter master key to impersonate ${user?.email || "this user"}:`,
      );
      if (!masterKey) return;

      const reason = window.prompt(
        "Reason for impersonation (optional):",
        "Support session",
      );

      const resp = await adminService.impersonateUser(userId, {
        masterKey,
        reason,
      });

      const token = resp?.data?.token || resp?.data?.data?.token;
      const logId = resp?.data?.logId || resp?.data?.data?.logId;
      const userInfo = resp?.data?.user || resp?.data?.data?.user;

      if (!token) {
        throw new Error("Impersonation token was not returned");
      }

      const w = window.open("/impersonate", "_blank");
      if (!w) {
        throw new Error("Popup was blocked. Please allow popups and try again.");
      }

      const payload = {
        type: "FFB_IMPERSONATE",
        token,
        logId,
        user: userInfo,
      };

      let attempts = 0;
      const interval = setInterval(() => {
        attempts += 1;
        try {
          w.postMessage(payload, window.location.origin);
        } catch (e) {
          console.warn("Impersonation postMessage failed", e);
        }
        if (attempts > 50) clearInterval(interval);
      }, 250);

      const onAck = (event) => {
        if (event.origin !== window.location.origin) return;
        if (event.data?.type === "FFB_IMPERSONATE_ACK") {
          clearInterval(interval);
          window.removeEventListener("message", onAck);
        }
      };
      window.addEventListener("message", onAck);
    } catch (err) {
      alert(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Failed to impersonate user",
      );
    }
  };

  const submitAction = async (e) => {
    e.preventDefault();
    if (!modalUserId || !activeAction) return;

    setActionLoading(true);
    setActionError("");
    setActionSuccess("");

    try {
      if (activeAction === "balance") {
        await adminService.adjustUserBalance(modalUserId, forms.balance);
      }

      if (activeAction === "ledger") {
        const payload = {
          ...forms.ledger,
          minAmount: forms.ledger.minAmount || forms.ledger.amount,
          maxAmount: forms.ledger.maxAmount || forms.ledger.amount,
        };
        await adminService.createUserLedgers(modalUserId, payload);
      }

      if (activeAction === "trade") {
        if (forms.trade.mode === "create") {
          await adminService.createUserTrade(modalUserId, buildTradePayload());
        } else {
          await adminService.updateUserTrade(
            modalUserId,
            forms.trade.tradeId,
            buildTradeUpdatePayload(),
          );
        }
        await loadUserActivity("trade", modalUserId);
      }

      if (activeAction === "investment") {
        if (forms.investment.mode === "create") {
          await adminService.createUserInvestment(modalUserId, forms.investment);
        } else {
          await adminService.updateUserInvestment(
            modalUserId,
            forms.investment.investmentId,
            { action: forms.investment.action },
          );
        }
        await loadUserActivity("investment", modalUserId);
      }

      if (activeAction === "notification") {
        await adminService.sendUserNotification(modalUserId, forms.notification);
      }

      setActionSuccess("Action completed successfully.");
      dispatch(fetchUsers({ page, limit, search: searchTerm, status: statusFilter }));
    } catch (err) {
      setActionError(
        err?.response?.data?.error?.message ||
          err?.response?.data?.message ||
          err?.message ||
          "Action failed",
      );
    } finally {
      setActionLoading(false);
    }
  };

  const renderInput = (section, field, label, props = {}) => (
    <label className="block">
      <span className="block text-xs font-medium text-gray-400 mb-1">
        {label}
      </span>
      <input
        {...props}
        value={forms[section][field]}
        onChange={(e) =>
          updateForm(
            section,
            field,
            props.type === "checkbox" ? e.target.checked : e.target.value,
          )
        }
        className={`w-full rounded-md px-3 py-2 text-sm border ${
          darkMode
            ? "bg-gray-900 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-900"
        }`}
      />
    </label>
  );

  const renderSelect = (section, field, label, options) => (
    <label className="block">
      <span className="block text-xs font-medium text-gray-400 mb-1">
        {label}
      </span>
      <select
        value={forms[section][field]}
        onChange={(e) => updateForm(section, field, e.target.value)}
        className={`w-full rounded-md px-3 py-2 text-sm border ${
          darkMode
            ? "bg-gray-900 border-gray-700 text-white"
            : "bg-white border-gray-300 text-gray-900"
        }`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );

  const renderExistingActivity = (kind) => {
    const rows = kind === "trade" ? userActivity.trades : userActivity.investments;
    const emptyText =
      kind === "trade"
        ? "No existing trades found for this user."
        : "No existing investments found for this user.";

    return (
      <div
        className={`rounded-lg border p-3 sm:col-span-2 ${
          darkMode ? "border-gray-700 bg-gray-900/60" : "border-gray-200 bg-gray-50"
        }`}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <h3 className={darkMode ? "font-semibold text-white" : "font-semibold text-gray-900"}>
            Existing {kind === "trade" ? "Trades" : "Investments"}
          </h3>
          <button
            type="button"
            onClick={() => loadUserActivity(kind)}
            className="text-xs font-medium text-primary-500 hover:text-primary-400"
          >
            Refresh
          </button>
        </div>

        {activityLoading ? (
          <p className="text-sm text-gray-400">Loading records...</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-gray-400">{emptyText}</p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
            {rows.map((item) => {
              const id = item._id || item.id;
              const title =
                kind === "trade"
                  ? `${item.symbol || "Trade"} ${item.side || ""}`.trim()
                  : item.planName || item.planId || "Investment";
              const meta =
                kind === "trade"
                  ? `${item.quantity || 0} @ ${formatCurrency(item.executionPrice || item.price || 0)}`
                  : `${formatCurrency(item.amount)} ROI ${formatCurrency(item.roiAmount || item.expectedReturn || item.totalReturns || 0)}`;

              return (
                <div
                  key={id}
                  className={`rounded-md border p-3 ${
                    darkMode
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <div className={darkMode ? "font-medium text-white" : "font-medium text-gray-900"}>
                        {title}
                      </div>
                      <div className="text-xs text-gray-400">
                        {meta} · {item.status || "unknown"} · {formatDate(item.createdAt || item.startDate)}
                      </div>
                      <div className="text-[11px] text-gray-500 break-all">
                        ID: {id}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(kind === "trade"
                        ? [
                            ["update", "Edit"],
                            ["close", "Close"],
                            ["cancel", "Cancel"],
                            ["open", "Open"],
                          ]
                        : [
                            ["stop", "Stop"],
                            ["cancel", "Cancel"],
                            ["open", "Open"],
                          ]
                      ).map(([action, label]) => (
                        <button
                          key={action}
                          type="button"
                          onClick={() => {
                            if (kind === "trade") {
                              loadTradeIntoForm(item, action);
                            } else {
                              const section = "investment";
                              updateForm(section, "mode", "update");
                              updateForm(section, "investmentId", id);
                              updateForm(section, "action", action);
                            }
                          }}
                          className="rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-700"
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderActionForm = () => {
    if (!activeAction) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {actionTiles.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => selectAction(id)}
              className={`p-4 rounded-lg border text-left transition ${
                darkMode
                  ? "bg-gray-900 border-gray-700 hover:bg-gray-800 text-white"
                  : "bg-gray-50 border-gray-200 hover:bg-white text-gray-900"
              }`}
            >
              <Icon className="text-primary-500 mb-3" size={20} />
              <span className="font-medium">{label}</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleImpersonate(selectedUser)}
            className={`p-4 rounded-lg border text-left transition ${
              darkMode
                ? "bg-gray-900 border-gray-700 hover:bg-gray-800 text-white"
                : "bg-gray-50 border-gray-200 hover:bg-white text-gray-900"
            }`}
          >
            <FaArrowRight className="text-green-500 mb-3" size={20} />
            <span className="font-medium">Impersonate</span>
          </button>
        </div>
      );
    }

    return (
      <form onSubmit={submitAction} className="space-y-4">
        <button
          type="button"
          onClick={() => setActiveAction(null)}
          className="inline-flex items-center text-sm text-primary-500"
        >
          <FaArrowLeft className="mr-2" /> Back to actions
        </button>

        {activeAction === "balance" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderSelect("balance", "action", "Action", [
              { value: "credit", label: "Credit account" },
              { value: "debit", label: "Debit account" },
              { value: "withdraw", label: "Withdraw from account" },
            ])}
            {renderInput("balance", "amount", "Amount", {
              type: "number",
              min: "0",
              step: "0.01",
              required: true,
            })}
            {renderInput("balance", "date", "Date", { type: "date" })}
            <div className="sm:col-span-2">
              {renderInput("balance", "description", "Description", {
                placeholder: "Balance adjustment by admin",
              })}
            </div>
          </div>
        )}

        {activeAction === "ledger" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderSelect("ledger", "type", "Transaction type", [
              { value: "deposit", label: "Deposit" },
              { value: "withdrawal", label: "Withdrawal" },
              { value: "investment", label: "Investment" },
              { value: "bonus", label: "Bonus" },
              { value: "fee", label: "Fee" },
              { value: "transfer", label: "Transfer" },
            ])}
            {renderInput("ledger", "count", "How many entries", {
              type: "number",
              min: "1",
              max: "250",
            })}
            {renderInput("ledger", "amount", "Fixed amount", {
              type: "number",
              min: "0",
              step: "0.01",
            })}
            {renderInput("ledger", "minAmount", "Range min", {
              type: "number",
              min: "0",
              step: "0.01",
            })}
            {renderInput("ledger", "maxAmount", "Range max", {
              type: "number",
              min: "0",
              step: "0.01",
            })}
            {renderInput("ledger", "startDate", "Start date", { type: "date" })}
            {renderInput("ledger", "endDate", "End date", { type: "date" })}
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <input
                type="checkbox"
                checked={forms.ledger.affectBalance}
                onChange={(e) =>
                  updateForm("ledger", "affectBalance", e.target.checked)
                }
              />
              Apply entries to current balance
            </label>
            <div className="sm:col-span-2">
              {renderInput("ledger", "description", "Description", {
                placeholder: "Historical account activity",
              })}
            </div>
          </div>
        )}

        {activeAction === "trade" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderExistingActivity("trade")}
            {renderSelect("trade", "mode", "Mode", [
              { value: "create", label: "Create trade" },
              { value: "update", label: "Cancel/close/open trade" },
            ])}
            {forms.trade.mode === "update" ? (
              <>
                {renderInput("trade", "tradeId", "Trade ID", { required: true })}
                {renderSelect("trade", "action", "Action", [
                  { value: "update", label: "Update values only" },
                  { value: "cancel", label: "Cancel" },
                  { value: "close", label: "Close" },
                  { value: "open", label: "Open" },
                ])}
                {renderSelect("trade", "market", "Market", [
                  { value: "crypto", label: "Crypto / CFD" },
                  { value: "forex", label: "Forex position" },
                ])}
                {renderInput("trade", "symbol", "Symbol")}
                {renderSelect("trade", "side", "Side", [
                  { value: "buy", label: "Buy" },
                  { value: "sell", label: "Sell" },
                ])}
                {renderSelect("trade", "type", "Order type", [
                  { value: "market", label: "Market" },
                  { value: "limit", label: "Limit" },
                ])}
                {renderSelect("trade", "status", "Status", [
                  { value: "filled", label: "Closed/Filled" },
                  { value: "new", label: "Open" },
                  { value: "canceled", label: "Cancelled" },
                ])}
                {renderInput("trade", "quantity", "Quantity", {
                  type: "number",
                  min: "0",
                  step: "0.00000001",
                })}
                {renderInput("trade", "accountLabel", "Account label", {
                  placeholder: "D-NGBANK-USD-1379176370182",
                })}
                {renderInput("trade", "closePrice", "Close price", {
                  type: "number",
                  min: "0",
                  step: "0.001",
                })}
                {renderInput("trade", "profit", "Profit", {
                  type: "number",
                  step: "0.01",
                })}
                {renderInput("trade", "swap", "Swap", {
                  type: "number",
                  step: "0.01",
                })}
                {renderInput("trade", "commission", "Commission", {
                  type: "number",
                  step: "0.01",
                })}
                {renderInput("trade", "deposit", "Deposit", {
                  type: "number",
                  min: "0",
                  step: "0.01",
                })}
                {renderInput("trade", "balance", "Balance", {
                  type: "number",
                  min: "0",
                  step: "0.01",
                })}
                {renderInput("trade", "date", "Date", { type: "date" })}
              </>
            ) : (
              <>
                {renderSelect("trade", "market", "Market", [
                  { value: "crypto", label: "Crypto / CFD" },
                  { value: "forex", label: "Forex position" },
                ])}
                {renderInput("trade", "symbol", "Symbol", { required: true })}
                {renderSelect("trade", "side", "Side", [
                  { value: "buy", label: "Buy" },
                  { value: "sell", label: "Sell" },
                ])}
                {renderSelect("trade", "type", "Order type", [
                  { value: "market", label: "Market" },
                  { value: "limit", label: "Limit" },
                ])}
                {renderSelect("trade", "status", "Status", [
                  { value: "filled", label: "Closed/Filled" },
                  { value: "new", label: "Open" },
                  { value: "canceled", label: "Cancelled" },
                ])}
                {renderInput("trade", "quantity", "Quantity", {
                  type: "number",
                  min: "0",
                  step: "0.00000001",
                  required: true,
                })}
                {forms.trade.market === "forex" && (
                  <>
                    {renderInput("trade", "accountLabel", "Account label", {
                      placeholder: "D-NGBANK-USD-1379176370182",
                    })}
                    {renderInput("trade", "closePrice", "Close price", {
                      type: "number",
                      min: "0",
                      step: "0.001",
                    })}
                    {renderInput("trade", "profit", "Profit", {
                      type: "number",
                      step: "0.01",
                    })}
                    {renderInput("trade", "swap", "Swap", {
                      type: "number",
                      step: "0.01",
                    })}
                    {renderInput("trade", "commission", "Commission", {
                      type: "number",
                      step: "0.01",
                    })}
                    {renderInput("trade", "deposit", "Deposit", {
                      type: "number",
                      min: "0",
                      step: "0.01",
                    })}
                    {renderInput("trade", "balance", "Balance", {
                      type: "number",
                      min: "0",
                      step: "0.01",
                    })}
                  </>
                )}
              </>
            )}
            {renderInput("trade", "price", "Price", {
              type: "number",
              min: "0",
              step: forms.trade.market === "forex" ? "0.001" : "0.01",
              required: forms.trade.mode === "create",
            })}
            {forms.trade.mode === "create" &&
              renderInput("trade", "date", "Date", { type: "date" })}
          </div>
        )}

        {activeAction === "investment" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderExistingActivity("investment")}
            {renderSelect("investment", "mode", "Mode", [
              { value: "create", label: "Create investment" },
              { value: "update", label: "Cancel/stop/open investment" },
            ])}
            {forms.investment.mode === "update" ? (
              <>
                {renderInput("investment", "investmentId", "Investment ID", {
                  required: true,
                })}
                {renderSelect("investment", "action", "Action", [
                  { value: "cancel", label: "Cancel" },
                  { value: "stop", label: "Stop/complete" },
                  { value: "open", label: "Reopen" },
                ])}
              </>
            ) : (
              <>
                {renderSelect("investment", "planId", "Plan", planOptions)}
                {renderInput("investment", "amount", "Amount", {
                  type: "number",
                  min: "0",
                  step: "0.01",
                  required: true,
                })}
                {renderInput("investment", "startDate", "Start date", {
                  type: "date",
                })}
                {renderSelect("investment", "status", "Status", [
                  { value: "active", label: "Active" },
                  { value: "completed", label: "Completed" },
                  { value: "cancelled", label: "Cancelled" },
                ])}
                <label className="flex items-center gap-2 text-sm text-gray-400 sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={forms.investment.debitBalance}
                    onChange={(e) =>
                      updateForm("investment", "debitBalance", e.target.checked)
                    }
                  />
                  Debit investment amount from current balance
                </label>
              </>
            )}
          </div>
        )}

        {activeAction === "notification" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {renderSelect("notification", "sendTo", "Recipients", [
              { value: "user", label: "This user" },
              { value: "all", label: "All users" },
            ])}
            {renderSelect("notification", "type", "Type", [
              { value: "info", label: "Info" },
              { value: "success", label: "Success" },
              { value: "warning", label: "Warning" },
              { value: "error", label: "Error" },
              { value: "system", label: "System" },
            ])}
            {renderSelect("notification", "priority", "Priority", [
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ])}
            <div className="sm:col-span-2">
              {renderInput("notification", "title", "Title", { required: true })}
            </div>
            <label className="block sm:col-span-2">
              <span className="block text-xs font-medium text-gray-400 mb-1">
                Message
              </span>
              <textarea
                value={forms.notification.message}
                onChange={(e) =>
                  updateForm("notification", "message", e.target.value)
                }
                required
                rows={4}
                className={`w-full rounded-md px-3 py-2 text-sm border ${
                  darkMode
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </label>
          </div>
        )}

        {actionError && (
          <div className="rounded-md bg-red-900/30 border border-red-700 text-red-300 p-3 text-sm">
            {actionError}
          </div>
        )}
        {actionSuccess && (
          <div className="rounded-md bg-green-900/30 border border-green-700 text-green-300 p-3 text-sm">
            {actionSuccess}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => setActiveAction(null)}
            className="px-4 py-2 rounded-md bg-gray-700 text-gray-200 hover:bg-gray-600"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={actionLoading}
            className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60"
          >
            {actionLoading ? "Working..." : "Submit"}
          </button>
        </div>
      </form>
    );
  };

  const totalPages = pagination.pages || pagination.totalPages || 0;
  const totalItems = pagination.total || pagination.totalUsers || 0;

  return (
    <PageTransition>
      <div>
        <div className="mb-6">
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            User Management
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Search users and manage account activity
          </p>
        </div>

        <div
          className={`mb-6 rounded-lg p-4 border ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-[1fr_220px_120px] gap-3">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPage(1);
                }}
                placeholder="Search by username, email, name, or account number"
                className={`w-full pl-10 pr-3 py-2 rounded-md border ${
                  darkMode
                    ? "bg-gray-900 border-gray-700 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className={`rounded-md px-3 py-2 border ${
                darkMode
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className={`rounded-md px-3 py-2 border ${
                darkMode
                  ? "bg-gray-900 border-gray-700 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <ComponentLoader height="400px" message="Loading users..." />
        ) : (
          <div
            className={`rounded-lg overflow-hidden ${
              darkMode
                ? "border border-gray-700"
                : "border border-gray-200 shadow-md"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className={darkMode ? "bg-gray-700/30" : "bg-gray-50"}>
                  <tr>
                    {[
                      "User",
                      "Account Details",
                      "Status",
                      "Balance",
                      "Registered",
                      "Verification",
                      "Actions",
                    ].map((head) => (
                      <th
                        key={head}
                        className={`px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider ${
                          head === "Actions" ? "text-right" : "text-left"
                        }`}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                >
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center">
                        No users found.
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr
                        key={getUserId(user)}
                        className={
                          darkMode ? "hover:bg-gray-700/30" : "hover:bg-gray-50"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                              {user.profileImage ? (
                                <img
                                  src={user.profileImage}
                                  alt={getFullName(user)}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-primary-500 font-semibold">
                                  {getFullName(user).charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium">
                                {getFullName(user)}
                              </div>
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                                <FaEnvelope className="mr-1" size={10} />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm">{user.accountNumber || "N/A"}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {user.username || user.country || "N/A"}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className={`text-sm font-medium ${
                              user.balance > 0
                                ? "text-green-600 dark:text-green-400"
                                : darkMode
                                  ? "text-gray-300"
                                  : "text-gray-900"
                            }`}
                          >
                            {formatCurrency(user.balance)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm ${
                              user.kycVerified
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {user.kycVerified ? (
                              <span className="flex items-center">
                                <FaCheck className="mr-1" size={12} /> Verified
                              </span>
                            ) : (
                              "Not Verified"
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/admin/users/${getUserId(user)}`}
                              className="p-1.5 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-gray-700 dark:text-blue-400"
                              title="View User"
                            >
                              <FaEye size={14} />
                            </Link>
                            <Link
                              to={`/admin/users/${getUserId(user)}/edit`}
                              className="p-1.5 rounded-full bg-yellow-50 text-yellow-600 hover:bg-yellow-100 dark:bg-gray-700 dark:text-yellow-400"
                              title="Edit User"
                            >
                              <FaEdit size={14} />
                            </Link>
                            <Link
                              to={`/admin/users/${getUserId(user)}/security`}
                              className="p-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-400"
                              title="Security Settings"
                            >
                              <FaLock size={14} />
                            </Link>
                            <button
                              type="button"
                              onClick={() => openActions(user)}
                              className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary-600 text-white hover:bg-primary-700"
                            >
                              <FaTools size={13} className="mr-1.5" />
                              Actions
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
              <Pagination
                currentPage={pagination.page || page}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={limit}
                onPageChange={setPage}
              />
            </div>
          </div>
        )}

        <div
          className={`mt-6 p-4 rounded-lg ${
            darkMode
              ? "bg-gray-800 border border-gray-700"
              : "bg-white border border-gray-200 shadow-sm"
          }`}
        >
          <h3
            className={`font-medium mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/admin/users/new"
              className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors"
            >
              Add New User
            </Link>
            <Link
              to="/admin/bulk-export"
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                darkMode
                  ? "bg-gray-700 text-gray-200 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              } transition-colors`}
            >
              Export Users
            </Link>
          </div>
        </div>

        {selectedUser && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4">
            <div
              className={`mx-auto my-6 w-full max-w-3xl rounded-lg shadow-xl ${
                darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
              }`}
            >
              <div className="flex items-start justify-between p-4 border-b border-gray-700">
                <div>
                  <h2 className="text-lg font-semibold">
                    Actions for {getFullName(selectedUser)}
                  </h2>
                  <p className="text-sm text-gray-400">{selectedUser.email}</p>
                </div>
                <button
                  type="button"
                  onClick={closeActions}
                  className="p-2 text-gray-400 hover:text-white"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="p-4">{renderActionForm()}</div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminUsers;
