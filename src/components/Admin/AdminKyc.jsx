import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  FaEye,
  FaCheck,
  FaTimes,
  FaIdCard,
  FaUser,
  FaCalendarAlt,
  FaFilter,
} from "react-icons/fa";
import {
  fetchKycRequests,
  selectKycRequests,
  selectKycPagination,
  selectKycStatus,
} from "../../redux/slices/adminKycSlice";
import { useDarkMode } from "../../context/DarkModeContext";
import PageTransition from "../common/PageTransition";
import ComponentLoader from "../common/ComponentLoader";
import Pagination from "./common/Pagination";
import StatusBadge from "./common/StatusBadge";
import SearchFilter from "./common/SearchFilter";

const AdminKyc = () => {
  const { darkMode } = useDarkMode();
  const dispatch = useDispatch();

  const kycRequests = useSelector(selectKycRequests);
  const pagination = useSelector(selectKycPagination);
  const status = useSelector(selectKycStatus);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const isLoading = status === "loading";

  useEffect(() => {
    document.title = "KYC Verification | Admin Dashboard";
    loadKycRequests();
  }, [page, limit]);

  const loadKycRequests = () => {
    dispatch(fetchKycRequests({ page, limit }));
  };

  const handleSearch = ({ searchTerm, filters }) => {
    setPage(1); // Reset to first page when applying new search/filters

    dispatch(
      fetchKycRequests({
        page: 1,
        limit,
        search: searchTerm,
        status: filters.status,
      }),
    );
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleLimitChange = (e) => {
    setLimit(Number(e.target.value));
    setPage(1);
  };

  // Define status filter options
  const statusFilterOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
    { value: "waiting_for_documents", label: "Waiting For Documents" },
  ];

  // Format date to local format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <PageTransition>
      <div>
        <div className="mb-6">
          <h1
            className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            KYC Verification Requests
          </h1>
          <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
            Manage customer identity verification requests
          </p>
        </div>

        <SearchFilter
          onSearch={handleSearch}
          searchPlaceholder="Search by name, email or ID..."
          filters={[
            {
              id: "status",
              label: "Status",
              options: statusFilterOptions,
              placeholder: "All Statuses",
            },
          ]}
          className="mb-6"
        />

        {isLoading ? (
          <ComponentLoader height="400px" message="Loading KYC requests..." />
        ) : (
          <div>
            <div
              className={`rounded-lg overflow-hidden ${
                darkMode
                  ? "border border-gray-700"
                  : "border border-gray-200 shadow-md"
              }`}
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h2
                  className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}
                >
                  Verification Requests
                </h2>
                <div className="flex items-center space-x-2">
                  <label
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Show:
                  </label>
                  <select
                    value={limit}
                    onChange={handleLimitChange}
                    className={`rounded-md text-sm ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
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

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className={darkMode ? "bg-gray-700/30" : "bg-gray-50"}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Submitted
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Documents
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className={`divide-y divide-gray-200 dark:divide-gray-700 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {kycRequests.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center">
                          <div className="flex flex-col items-center justify-center">
                            <p
                              className={`text-lg font-medium mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                            >
                              No KYC requests found
                            </p>
                            <p
                              className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}
                            >
                              Try adjusting your search or filter to find what
                              you're looking for.
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      kycRequests.map((kyc) => (
                        <tr
                          key={kyc.id}
                          className={
                            darkMode
                              ? "hover:bg-gray-700/30"
                              : "hover:bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div
                                className={`h-10 w-10 rounded-full mr-3 flex items-center justify-center ${
                                  darkMode ? "bg-gray-700" : "bg-gray-200"
                                }`}
                              >
                                <FaUser
                                  className={`h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                />
                              </div>
                              <div>
                                <p
                                  className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                                >
                                  {kyc.user.fullName}
                                </p>
                                <p
                                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  {kyc.user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center text-sm">
                              <FaCalendarAlt
                                className={`mr-2 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                              />
                              {formatDate(kyc.submittedAt)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={kyc.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-col gap-1">
                              {kyc.documents.map((doc, index) => (
                                <span
                                  key={index}
                                  className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                                >
                                  <FaIdCard className="inline mr-1" />{" "}
                                  {doc.type.replace("_", " ")}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {kyc.updatedAt ? formatDate(kyc.updatedAt) : "-"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <div className="flex items-center justify-end space-x-2">
                              <Link
                                to={`/admin/kyc/${kyc.id}`}
                                className={`p-1.5 rounded-full ${
                                  darkMode
                                    ? "bg-gray-700 text-blue-400 hover:bg-gray-600"
                                    : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                                }`}
                                title="View KYC Details"
                              >
                                <FaEye size={14} />
                              </Link>

                              {kyc.status === "pending" && (
                                <>
                                  <Link
                                    to={`/admin/kyc/${kyc.id}?action=approve`}
                                    className={`p-1.5 rounded-full ${
                                      darkMode
                                        ? "bg-gray-700 text-green-400 hover:bg-gray-600"
                                        : "bg-green-50 text-green-600 hover:bg-green-100"
                                    }`}
                                    title="Approve KYC"
                                  >
                                    <FaCheck size={14} />
                                  </Link>
                                  <Link
                                    to={`/admin/kyc/${kyc.id}?action=reject`}
                                    className={`p-1.5 rounded-full ${
                                      darkMode
                                        ? "bg-gray-700 text-red-400 hover:bg-gray-600"
                                        : "bg-red-50 text-red-600 hover:bg-red-100"
                                    }`}
                                    title="Reject KYC"
                                  >
                                    <FaTimes size={14} />
                                  </Link>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <Pagination
                  currentPage={pagination.page || 1}
                  totalPages={pagination.totalPages || 0}
                  totalItems={pagination.totalRequests || 10}
                  itemsPerPage={limit}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>

            {/* KYC Stats */}
            <div
              className={`mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 ${
                darkMode ? "text-gray-200" : "text-gray-700"
              }`}
            >
              <div
                className={`p-4 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Pending
                </h3>
                <p className="text-2xl font-bold text-yellow-500">
                  {kycRequests.filter((k) => k.status === "pending").length}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Approved
                </h3>
                <p className="text-2xl font-bold text-green-500">
                  {kycRequests.filter((k) => k.status === "approved").length}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Rejected
                </h3>
                <p className="text-2xl font-bold text-red-500">
                  {kycRequests.filter((k) => k.status === "rejected").length}
                </p>
              </div>

              <div
                className={`p-4 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200 shadow-sm"
                }`}
              >
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase mb-2">
                  Total
                </h3>
                <p className="text-2xl font-bold text-primary-500">
                  {pagination.totalRequests || kycRequests.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default AdminKyc;
