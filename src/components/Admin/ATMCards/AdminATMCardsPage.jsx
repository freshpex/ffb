import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaCreditCard,
  FaFilter,
  FaTimes,
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaSyncAlt,
} from "react-icons/fa";
import {
  fetchAdminCards,
  approveCardRequest,
  rejectCardRequest,
  selectAdminCards,
  selectAdminCardRequests,
  selectAdminCardsStatus,
  selectAdminCardsError,
  selectAdminCardsPagination,
} from "../../../redux/slices/adminCardSlice";
import Button from "../../common/Button";
import Alert from "../../common/Alert";
import Loader from "../../common/Loader";
import AdminCardRequestModal from "./AdminCardRequestModal";

const AdminATMCardsPage = () => {
  const dispatch = useDispatch();

  const adminCards = useSelector(selectAdminCards);
  const cardRequests = useSelector(selectAdminCardRequests);
  console.log("Admin Cards", adminCards);
  console.log("Requests", cardRequests);
  const status = useSelector(selectAdminCardsStatus);
  const error = useSelector(selectAdminCardsError);
  const pagination = useSelector(selectAdminCardsPagination);

  // Local state
  const [activeTab, setActiveTab] = useState("requests"); // 'requests', 'active', 'all'
  const [selectedCard, setSelectedCard] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: "", message: "" });
  const [filters, setFilters] = useState({
    status: "",
    type: "",
    search: "",
    sortBy: "createdAt",
    sortOrder: "desc",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    const queryParams = {
      page: currentPage,
      limit: 10,
      ...filters,
    };

    if (activeTab === "requests") {
      queryParams.status = "pending";
    } else if (activeTab === "active") {
      queryParams.status = "active,processing,shipped";
    }

    dispatch(fetchAdminCards(queryParams));
  }, [dispatch, filters, activeTab, currentPage]);

  // Show alert if error occurs
  useEffect(() => {
    if (error) {
      setAlertMessage({
        type: "error",
        message: error,
      });
      setShowAlert(true);
    }
  }, [error]);

  // Handle opening the card details modal
  const handleViewCard = (card) => {
    setSelectedCard(card);
    setIsModalOpen(true);
  };

  // Handle approving card requests
  const handleApproveCard = async (cardId) => {
    try {
      await dispatch(approveCardRequest(cardId));
      setIsModalOpen(false);
      setAlertMessage({
        type: "success",
        message: "Card request approved successfully",
      });
      setShowAlert(true);

      // Refresh the card list
      dispatch(
        fetchAdminCards({
          page: currentPage,
          limit: 10,
          status:
            activeTab === "requests"
              ? "pending"
              : activeTab === "active"
                ? "active,processing,shipped"
                : "",
          ...filters,
        }),
      );
    } catch (err) {
      setAlertMessage({
        type: "error",
        message: err.message || "Failed to approve card request",
      });
      setShowAlert(true);
    }
  };

  // Handle rejecting card requests
  const handleRejectCard = async (cardId, reason) => {
    try {
      await dispatch(rejectCardRequest({ cardId, reason }));
      setIsModalOpen(false);
      setAlertMessage({
        type: "success",
        message: "Card request rejected successfully",
      });
      setShowAlert(true);

      // Refresh the card list
      dispatch(
        fetchAdminCards({
          page: currentPage,
          limit: 10,
          status:
            activeTab === "requests"
              ? "pending"
              : activeTab === "active"
                ? "active,processing,shipped"
                : "",
          ...filters,
        }),
      );
    } catch (err) {
      setAlertMessage({
        type: "error",
        message: err.message || "Failed to reject card request",
      });
      setShowAlert(true);
    }
  };

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({
      status: "",
      type: "",
      search: "",
      sortBy: "createdAt",
      sortOrder: "desc",
    });
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Render status badge
  const renderStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300">
            Pending
          </span>
        );
      case "active":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300">
            Active
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
            Processing
          </span>
        );
      case "shipped":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300">
            Shipped
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300">
            Rejected
          </span>
        );
      case "frozen":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            Frozen
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
            {status}
          </span>
        );
    }
  };

  const displayCards = activeTab === "requests" ? cardRequests : adminCards;

  return (
    <>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4 md:mb-0">
            <FaCreditCard className="inline-block mr-3 text-primary-500" />
            Payment Cards Management
          </h1>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FaFilter className="mr-2" />{" "}
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>

            <Button
              variant="primary"
              onClick={() =>
                dispatch(
                  fetchAdminCards({
                    page: currentPage,
                    limit: 10,
                    status:
                      activeTab === "requests"
                        ? "pending"
                        : activeTab === "active"
                          ? "active,processing,shipped"
                          : "",
                    ...filters,
                  }),
                )
              }
            >
              <FaSyncAlt className="mr-2" /> Refresh
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {showAlert && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6"
            >
              <Alert
                type={alertMessage.type}
                message={alertMessage.message}
                onDismiss={() => setShowAlert(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mb-6 bg-gray-800 p-4 rounded-lg shadow border border-gray-700">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={activeTab === "requests" ? "primary" : "secondary"}
              onClick={() => setActiveTab("requests")}
            >
              Pending Requests
            </Button>
            <Button
              variant={activeTab === "active" ? "primary" : "secondary"}
              onClick={() => setActiveTab("active")}
            >
              Active Cards
            </Button>
            <Button
              variant={activeTab === "all" ? "primary" : "secondary"}
              onClick={() => setActiveTab("all")}
            >
              All Cards
            </Button>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Search
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search by name, email..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white"
                      />
                      <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      {filters.search && (
                        <button
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white"
                          onClick={() =>
                            handleFilterChange({
                              target: { name: "search", value: "" },
                            })
                          }
                        >
                          <FaTimes />
                        </button>
                      )}
                    </div>
                  </div>

                  {activeTab === "all" && (
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                      >
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="active">Active</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="rejected">Rejected</option>
                        <option value="frozen">Frozen</option>
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Card Type
                    </label>
                    <select
                      name="type"
                      value={filters.type}
                      onChange={handleFilterChange}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                    >
                      <option value="">All Types</option>
                      <option value="virtual-debit">Virtual Debit</option>
                      <option value="standard-debit">Standard Debit</option>
                      <option value="premium-debit">Premium Debit</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">
                      Sort By
                    </label>
                    <div className="flex gap-2">
                      <select
                        name="sortBy"
                        value={filters.sortBy}
                        onChange={handleFilterChange}
                        className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                      >
                        <option value="createdAt">Date Created</option>
                        <option value="name">Name</option>
                        <option value="type">Type</option>
                        <option value="status">Status</option>
                      </select>
                      <select
                        name="sortOrder"
                        value={filters.sortOrder}
                        onChange={handleFilterChange}
                        className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-white"
                      >
                        <option value="asc">Asc</option>
                        <option value="desc">Desc</option>
                      </select>
                    </div>
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <Button variant="outline" onClick={handleResetFilters}>
                      Reset Filters
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {status === "loading" ? (
          <div className="flex justify-center py-20">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
              {displayCards && displayCards.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-900">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Customer
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Card Details
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Status
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {displayCards.map((card) => (
                        <tr
                          key={card.id || card._id}
                          className="hover:bg-gray-750"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div>
                                <div className="text-sm font-medium text-white">
                                  {card.name}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {card.user?.email || "N/A"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white capitalize">
                              {card.type?.replace("-", " ") || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-400">
                              {card.currency || "USD"}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-white">
                              {card.createdAt
                                ? new Date(card.createdAt).toLocaleDateString()
                                : "N/A"}
                            </div>
                            <div className="text-sm text-gray-400">
                              {card.createdAt
                                ? new Date(card.createdAt).toLocaleTimeString()
                                : ""}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {renderStatusBadge(card.status || "unknown")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="outline"
                                size="xs"
                                onClick={() => handleViewCard(card)}
                              >
                                <FaEye className="mr-1" /> View
                              </Button>

                              {card.status === "pending" && (
                                <>
                                  <Button
                                    variant="success"
                                    size="xs"
                                    onClick={() =>
                                      handleApproveCard(card.id || card._id)
                                    }
                                  >
                                    <FaCheckCircle className="mr-1" /> Approve
                                  </Button>

                                  <Button
                                    variant="danger"
                                    size="xs"
                                    onClick={() => handleViewCard(card)}
                                  >
                                    <FaTimesCircle className="mr-1" /> Reject
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4">
                    <FaCreditCard className="text-gray-500" size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2">
                    No Cards Found
                  </h3>
                  <p className="text-gray-400">
                    No card requests matching your filters were found.
                  </p>
                </div>
              )}

              {pagination && pagination.pages > 1 && (
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-700">
                  <div className="text-sm text-gray-400">
                    Showing{" "}
                    <span className="font-medium">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(
                        pagination.page * pagination.limit,
                        pagination.total,
                      )}
                    </span>{" "}
                    of <span className="font-medium">{pagination.total}</span>{" "}
                    results
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === 1}
                      onClick={() => handlePageChange(pagination.page - 1)}
                    >
                      Previous
                    </Button>

                    {/* Show page numbers */}
                    <div className="flex space-x-1">
                      {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                        .filter(
                          (page) =>
                            page === 1 ||
                            page === pagination.pages ||
                            (page >= pagination.page - 1 &&
                              page <= pagination.page + 1),
                        )
                        .map((page, i, arr) => {
                          // Add ellipsis
                          if (i > 0 && page - arr[i - 1] > 1) {
                            return (
                              <React.Fragment key={`ellipsis-${page}`}>
                                <Button
                                  variant="secondary"
                                  size="sm"
                                  disabled
                                  className="px-2"
                                >
                                  ...
                                </Button>
                                <Button
                                  variant={
                                    pagination.page === page
                                      ? "primary"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => handlePageChange(page)}
                                  className="px-3"
                                >
                                  {page}
                                </Button>
                              </React.Fragment>
                            );
                          }

                          return (
                            <Button
                              key={page}
                              variant={
                                pagination.page === page ? "primary" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(page)}
                              className="px-3"
                            >
                              {page}
                            </Button>
                          );
                        })}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      disabled={pagination.page === pagination.pages}
                      onClick={() => handlePageChange(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <AdminCardRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        card={selectedCard}
        onApprove={handleApproveCard}
        onReject={handleRejectCard}
      />
    </>
  );
};

export default AdminATMCardsPage;
