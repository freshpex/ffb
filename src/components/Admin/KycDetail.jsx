import { useState, useEffect } from "react";
import {
  useParams,
  useSearchParams,
  useNavigate,
  Link,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaIdCard,
  FaUser,
  FaHome,
  FaCalendarAlt,
  FaGlobe,
  FaPassport,
  FaCamera,
  FaCheckCircle,
  FaTimesCircle,
  FaArrowLeft,
  FaExclamationTriangle,
  FaInfoCircle,
  FaComment,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import {
  fetchKycRequestById,
  approveKycRequest,
  rejectKycRequest,
  selectSelectedKycRequest,
  selectKycStatus,
  selectKycActionStatus,
} from "../../redux/slices/adminKycSlice";
import { useDarkMode } from "../../context/DarkModeContext";
import PageTransition from "../common/PageTransition";
import ComponentLoader from "../common/ComponentLoader";
import StatusBadge from "./common/StatusBadge";

const KycDetail = () => {
  const { requestId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { darkMode } = useDarkMode();

  const kycRequest = useSelector(selectSelectedKycRequest);
  const status = useSelector(selectKycStatus);
  const actionStatus = useSelector(selectKycActionStatus);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  // Check if there is an action parameter in the URL (approve or reject)
  const actionParam = searchParams.get("action");

  useEffect(() => {
    document.title = "KYC Request Details | Admin Dashboard";
    dispatch(fetchKycRequestById(requestId));

    // If action parameter is present, show the corresponding modal
    if (actionParam === "approve") {
      setShowApproveModal(true);
    } else if (actionParam === "reject") {
      setShowRejectModal(true);
    }
  }, [dispatch, requestId, actionParam]);

  const handleApproveKyc = async () => {
    try {
      await dispatch(
        approveKycRequest({
          id: requestId,
          notes: "",
        }),
      ).unwrap();
      setShowApproveModal(false);
    } catch (error) {
      console.error("Failed to approve KYC request:", error);
    }
  };

  const handleRejectKyc = async () => {
    try {
      if (!rejectionReason.trim()) {
        alert("Please provide a reason for rejection");
        return;
      }

      await dispatch(
        rejectKycRequest({
          id: requestId,
          reason: rejectionReason,
          notes: rejectionReason,
        }),
      ).unwrap();

      setShowRejectModal(false);
    } catch (error) {
      console.error("Failed to reject KYC request:", error);
    }
  };

  // Format date to local format
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get document icon based on type
  const getDocumentIcon = (type) => {
    switch (type.toLowerCase()) {
      case "passport":
        return <FaPassport />;
      case "national_id":
      case "driving_license":
        return <FaIdCard />;
      case "utility_bill":
        return <FaHome />;
      case "selfie":
        return <FaCamera />;
      default:
        return <FaIdCard />;
    }
  };

  // Handle image preview
  const openImagePreview = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  if (status === "loading") {
    return (
      <ComponentLoader
        height="500px"
        message="Loading KYC request details..."
      />
    );
  }

  if (!kycRequest) {
    return (
      <div
        className={`rounded-lg p-8 text-center ${darkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <FaExclamationTriangle
          className={`mx-auto h-12 w-12 mb-4 ${darkMode ? "text-yellow-500" : "text-yellow-400"}`}
        />
        <h3
          className={`text-lg font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          KYC request not found
        </h3>
        <p className={`mt-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          The KYC request you are looking for does not exist or was removed.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/admin/kyc")}
            className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
          >
            <FaArrowLeft className="mr-2" /> Back to KYC Requests
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1
              className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
            >
              KYC Verification Details
            </h1>
            <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
              Review and manage customer identity verification
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/admin/kyc")}
              className={`inline-flex items-center px-3 py-2 border rounded-md text-sm font-medium ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FaArrowLeft className="mr-2" /> Back to KYC List
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div
            className={`rounded-lg ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white shadow-md"
            }`}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center">
                <div
                  className={`h-12 w-12 rounded-full mr-4 flex items-center justify-center ${
                    darkMode ? "bg-gray-700" : "bg-gray-100"
                  }`}
                >
                  <FaUser
                    className={`h-6 w-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  />
                </div>
                <div>
                  <h2
                    className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {kycRequest.user.fullName}
                  </h2>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {kycRequest.user.email}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3
                  className={`font-medium mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Request Information
                </h3>
                <div
                  className={`rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 space-y-3`}
                >
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Status
                    </span>
                    <StatusBadge status={kycRequest.status} />
                  </div>
                  <div className="flex justify-between">
                    <span
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Submitted On
                    </span>
                    <span
                      className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {formatDate(kycRequest.submittedAt)}
                    </span>
                  </div>
                  {kycRequest.updatedAt && (
                    <div className="flex justify-between">
                      <span
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Last Updated
                      </span>
                      <span
                        className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {formatDate(kycRequest.updatedAt)}
                      </span>
                    </div>
                  )}
                  {kycRequest.approvedBy && (
                    <div className="flex justify-between">
                      <span
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Approved By
                      </span>
                      <span
                        className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        Admin
                      </span>
                    </div>
                  )}
                  {kycRequest.rejectedBy && (
                    <div className="flex justify-between">
                      <span
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Rejected By
                      </span>
                      <span
                        className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        Admin
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <h3
                  className={`font-medium mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Personal Information
                </h3>
                <div
                  className={`rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-50"} p-4 space-y-3`}
                >
                  <div className="flex items-start">
                    <FaHome
                      className={`mt-0.5 mr-3 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        Address
                      </p>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {kycRequest.information.address},{" "}
                        {kycRequest.information.city},{" "}
                        {kycRequest.information.postalCode}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaGlobe
                      className={`mt-0.5 mr-3 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        Country
                      </p>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {kycRequest.information.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <FaCalendarAlt
                      className={`mt-0.5 mr-3 h-4 w-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    />
                    <div>
                      <p
                        className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        Date of Birth
                      </p>
                      <p
                        className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        {formatDate(kycRequest.information.dateOfBirth)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {kycRequest.status === "pending" ? (
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={() => setShowApproveModal(true)}
                    className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                  >
                    <FaCheckCircle className="inline mr-2" /> Approve KYC
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    <FaTimesCircle className="inline mr-2" /> Reject KYC
                  </button>
                </div>
              ) : kycRequest.status === "rejected" && kycRequest.notes ? (
                <div
                  className={`mt-4 p-4 rounded-lg ${
                    darkMode
                      ? "bg-red-900/30"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <h4
                    className={`flex items-center text-sm font-medium mb-2 ${
                      darkMode ? "text-red-400" : "text-red-800"
                    }`}
                  >
                    <FaInfoCircle className="mr-2" /> Rejection Reason
                  </h4>
                  <p
                    className={`text-sm ${darkMode ? "text-red-300" : "text-red-700"}`}
                  >
                    {kycRequest.notes}
                  </p>
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Column - Documents */}
          <div
            className={`rounded-lg lg:col-span-2 ${
              darkMode
                ? "bg-gray-800 border border-gray-700"
                : "bg-white shadow-md"
            }`}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2
                className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Verification Documents
              </h2>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              {kycRequest.documents.map((doc, index) => (
                <div
                  key={index}
                  className={`rounded-lg overflow-hidden border ${
                    darkMode ? "border-gray-700" : "border-gray-200"
                  }`}
                >
                  <div
                    className={`p-3 border-b ${
                      darkMode
                        ? "bg-gray-700 border-gray-700"
                        : "bg-gray-50 border-gray-200"
                    } flex items-center justify-between`}
                  >
                    <div className="flex items-center">
                      {getDocumentIcon(doc.type)}
                      <span
                        className={`ml-2 font-medium capitalize ${
                          darkMode ? "text-white" : "text-gray-900"
                        }`}
                      >
                        {doc.type.replace("_", " ")}
                      </span>
                    </div>
                    <StatusBadge status={doc.status} size="small" />
                  </div>

                  <div className="relative aspect-video bg-gray-900/20 flex items-center justify-center">
                    <img
                      src={doc.url}
                      alt={doc.type}
                      className="max-h-full max-w-full object-contain cursor-pointer"
                      onClick={() => openImagePreview(doc.url)}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x300?text=Image+Not+Available";
                      }}
                    />
                  </div>

                  <div className="p-3 flex justify-center">
                    <button
                      onClick={() => openImagePreview(doc.url)}
                      className={`text-sm px-4 py-1 rounded ${
                        darkMode
                          ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      View Full Image
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-75 flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-0 right-0 -mt-10 -mr-10 p-2 rounded-full bg-white text-gray-900 hover:bg-gray-200"
            >
              <FaTimes className="h-6 w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Document Preview"
              className="max-h-[80vh] max-w-full mx-auto"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://via.placeholder.com/800x600?text=Image+Not+Available";
              }}
            />
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div
              className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3
                  className={`text-lg font-medium mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Approve KYC Verification
                </h3>

                <div
                  className={`mb-4 p-4 rounded-lg ${
                    darkMode
                      ? "bg-green-900/20 text-green-400"
                      : "bg-green-50 text-green-800 border border-green-200"
                  }`}
                >
                  <p className="text-sm flex items-start">
                    <FaInfoCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      You are about to approve this user's KYC verification.
                      This will give them full access to the platform's
                      features. Are you sure?
                    </span>
                  </p>
                </div>
              </div>

              <div
                className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                  darkMode
                    ? "border-t border-gray-700"
                    : "border-t border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={handleApproveKyc}
                  disabled={actionStatus === "loading"}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    actionStatus === "loading"
                      ? "bg-green-500 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  } text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {actionStatus === "loading"
                    ? "Processing..."
                    : "Confirm Approval"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowApproveModal(false)}
                  disabled={actionStatus === "loading"}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    darkMode
                      ? "border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  } text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
            </div>

            <div
              className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <h3
                  className={`text-lg font-medium mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Reject KYC Verification
                </h3>

                <div
                  className={`mb-4 p-4 rounded-lg ${
                    darkMode
                      ? "bg-red-900/20 text-red-400"
                      : "bg-red-50 text-red-800 border border-red-200"
                  }`}
                >
                  <p className="text-sm flex items-start">
                    <FaInfoCircle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                    <span>
                      You are about to reject this user's KYC verification. The
                      user will be notified and will need to resubmit their
                      documents. Please provide a reason.
                    </span>
                  </p>
                </div>

                <div className="mb-4">
                  <label
                    className={`block text-sm font-medium mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    Reason for Rejection *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className={`w-full rounded-md ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white focus:ring-red-500 focus:border-red-500"
                        : "bg-white border-gray-300 text-gray-900 focus:ring-red-500 focus:border-red-500"
                    } shadow-sm`}
                    rows="3"
                    placeholder="Please provide a reason for rejecting this verification..."
                    required
                  ></textarea>
                  <p
                    className={`mt-1 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    This reason will be visible to the user.
                  </p>
                </div>
              </div>

              <div
                className={`px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse ${
                  darkMode
                    ? "border-t border-gray-700"
                    : "border-t border-gray-200"
                }`}
              >
                <button
                  type="button"
                  onClick={handleRejectKyc}
                  disabled={actionStatus === "loading"}
                  className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 ${
                    actionStatus === "loading"
                      ? "bg-red-500 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  } text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  {actionStatus === "loading"
                    ? "Processing..."
                    : "Confirm Rejection"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  disabled={actionStatus === "loading"}
                  className={`mt-3 w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 ${
                    darkMode
                      ? "border-gray-500 bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  } text-base font-medium sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageTransition>
  );
};

export default KycDetail;
