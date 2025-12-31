import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaIdCard,
  FaFileImage,
  FaDownload,
  FaExternalLinkAlt,
} from "react-icons/fa";
import {
  fetchKycRequestById,
  approveKycRequest,
  rejectKycRequest,
  selectSelectedKycRequest,
  selectActionStatus,
  selectKycError,
  clearKycError,
} from "../../redux/slices/adminKycSlice";
import { useDarkMode } from "../../context/DarkModeContext";
import PageTransition from "../common/PageTransition";
import ComponentLoader from "../common/ComponentLoader";
import StatusBadge from "./common/StatusBadge";
import toast from "react-hot-toast";

const AdminKycDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { darkMode } = useDarkMode();

  const kycRequest = useSelector(selectSelectedKycRequest);
  const actionStatus = useSelector(selectActionStatus);
  const error = useSelector(selectKycError);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionNotes, setRejectionNotes] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    document.title = "KYC Request Details | Admin Dashboard";
    if (id) {
      dispatch(fetchKycRequestById(id));
    }

    // Check if action query param is present
    const action = searchParams.get("action");
    if (action === "approve" && kycRequest?.status === "pending") {
      setShowApproveModal(true);
    } else if (action === "reject" && kycRequest?.status === "pending") {
      setShowRejectModal(true);
    }
  }, [id, searchParams, dispatch, kycRequest?.status]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearKycError());
    }
  }, [error, dispatch]);

  const handleApprove = async () => {
    try {
      await dispatch(
        approveKycRequest({
          id: kycRequest._id,
          notes: approvalNotes,
        }),
      ).unwrap();

      toast.success("KYC request approved successfully");
      setShowApproveModal(false);
      setApprovalNotes("");
      // Refresh the KYC request
      dispatch(fetchKycRequestById(id));
    } catch (err) {
      toast.error(err || "Failed to approve KYC request");
    }
  };

  const handleReject = async () => {
    if (!rejectionReason) {
      toast.error("Please provide a rejection reason");
      return;
    }

    try {
      await dispatch(
        rejectKycRequest({
          id: kycRequest._id,
          reason: rejectionReason,
          notes: rejectionNotes,
        }),
      ).unwrap();

      toast.success("KYC request rejected");
      setShowRejectModal(false);
      setRejectionReason("");
      setRejectionNotes("");
      // Refresh the KYC request
      dispatch(fetchKycRequestById(id));
    } catch (err) {
      toast.error(err || "Failed to reject KYC request");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!kycRequest) {
    return <ComponentLoader height="600px" message="Loading KYC request..." />;
  }

  return (
    <PageTransition>
      <div>
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/admin/kyc")}
              className={`p-2 rounded-lg ${
                darkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <FaArrowLeft />
            </button>
            <div>
              <h1
                className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                KYC Request Details
              </h1>
              <p className={darkMode ? "text-gray-400" : "text-gray-600"}>
                Review and verify submitted documents
              </p>
            </div>
          </div>

          {kycRequest.status === "pending" && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowRejectModal(true)}
                disabled={actionStatus === "loading"}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FaTimes />
                <span>Reject</span>
              </button>
              <button
                onClick={() => setShowApproveModal(true)}
                disabled={actionStatus === "loading"}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <FaCheck />
                <span>Approve</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Documents */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Card */}
            <div
              className={`rounded-lg p-6 ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h2
                  className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Request Status
                </h2>
                <StatusBadge status={kycRequest.status} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Submitted
                  </p>
                  <p
                    className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {formatDate(kycRequest.submittedAt)}
                  </p>
                </div>
                <div>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Last Updated
                  </p>
                  <p
                    className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                    {formatDate(kycRequest.updatedAt)}
                  </p>
                </div>
              </div>

              {kycRequest.adminNotes && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p
                    className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    Admin Notes
                  </p>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {kycRequest.adminNotes}
                  </p>
                </div>
              )}

              {kycRequest.rejectionReason && (
                <div className="mt-4 pt-4 border-t border-red-200 dark:border-red-900">
                  <p className="text-sm mb-1 text-red-500">Rejection Reason</p>
                  <p
                    className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                  >
                    {kycRequest.rejectionReason}
                  </p>
                </div>
              )}
            </div>

            {/* Documents */}
            <div
              className={`rounded-lg p-6 ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              <h2
                className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                Submitted Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(!kycRequest.documents || kycRequest.documents.length === 0) && (
                  <div
                    className={`col-span-full text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-600"
                    }`}
                  >
                    No documents found for this request.
                  </div>
                )}
                {(kycRequest.documents || []).map((doc) => (
                  <DocumentCard
                    key={doc.type}
                    label={doc.label || doc.type}
                    url={doc.url}
                    darkMode={darkMode}
                    onClick={() => setSelectedImage(doc.url)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - User Info */}
          <div className="space-y-6">
            {/* User Information */}
            <div
              className={`rounded-lg p-6 ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200 shadow-sm"
              }`}
            >
              <h2
                className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
              >
                User Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-12 w-12 rounded-full flex items-center justify-center ${
                      darkMode ? "bg-gray-700" : "bg-gray-100"
                    }`}
                  >
                    <FaUser
                      className={`h-6 w-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    />
                  </div>
                  <div>
                    <p
                      className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                    >
                      Full Name
                    </p>
                    <p
                      className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {kycRequest.user?.fullName || "N/A"}
                    </p>
                  </div>
                </div>

                <InfoRow
                  icon={<FaEnvelope />}
                  label="Email"
                  value={kycRequest.user?.email || "N/A"}
                  darkMode={darkMode}
                />

                <InfoRow
                  icon={<FaCalendarAlt />}
                  label="Date of Birth"
                  value={
                    kycRequest.dateOfBirth
                      ? new Date(kycRequest.dateOfBirth).toLocaleDateString()
                      : "N/A"
                  }
                  darkMode={darkMode}
                />

                <InfoRow
                  icon={<FaMapMarkerAlt />}
                  label="Address"
                  value={
                    kycRequest.address
                      ? `${kycRequest.address.street}, ${kycRequest.address.city}, ${kycRequest.address.state}, ${kycRequest.address.postalCode}, ${kycRequest.address.country}`
                      : "N/A"
                  }
                  darkMode={darkMode}
                />

                <InfoRow
                  icon={<FaIdCard />}
                  label="Document Type"
                  value={kycRequest.documentType || "N/A"}
                  darkMode={darkMode}
                />

                <InfoRow
                  icon={<FaIdCard />}
                  label="Document Number"
                  value={kycRequest.documentNumber || "N/A"}
                  darkMode={darkMode}
                />

                <InfoRow
                  icon={<FaMapMarkerAlt />}
                  label="Country of Issue"
                  value={kycRequest.countryOfIssue || "N/A"}
                  darkMode={darkMode}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Approve Modal */}
        {showApproveModal && (
          <Modal
            title="Approve KYC Request"
            darkMode={darkMode}
            onClose={() => setShowApproveModal(false)}
          >
            <div className="space-y-4">
              <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                Are you sure you want to approve this KYC request? The user will
                be notified and granted verified status.
              </p>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Add any notes about this approval..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowApproveModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleApprove}
                  disabled={actionStatus === "loading"}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionStatus === "loading" ? "Approving..." : "Approve"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Reject Modal */}
        {showRejectModal && (
          <Modal
            title="Reject KYC Request"
            darkMode={darkMode}
            onClose={() => setShowRejectModal(false)}
          >
            <div className="space-y-4">
              <p className={darkMode ? "text-gray-300" : "text-gray-700"}>
                Please provide a reason for rejecting this KYC request. The user
                will be notified with this information.
              </p>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Rejection Reason *
                </label>
                <select
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="">Select a reason</option>
                  <option value="unclear_documents">Unclear Documents</option>
                  <option value="invalid_documents">Invalid Documents</option>
                  <option value="expired_documents">Expired Documents</option>
                  <option value="mismatch_information">
                    Mismatched Information
                  </option>
                  <option value="incomplete_submission">
                    Incomplete Submission
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label
                  className={`block text-sm font-medium mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Additional Notes (Optional)
                </label>
                <textarea
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                  placeholder="Provide specific details about the rejection..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={actionStatus === "loading" || !rejectionReason}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionStatus === "loading" ? "Rejecting..." : "Reject"}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Image Lightbox */}
        {selectedImage && (
          <ImageLightbox
            imageUrl={selectedImage}
            onClose={() => setSelectedImage(null)}
            darkMode={darkMode}
          />
        )}
      </div>
    </PageTransition>
  );
};

// Document Card Component
const DocumentCard = ({ label, url, darkMode, onClick }) => {
  return (
    <div
      className={`rounded-lg border ${
        darkMode
          ? "bg-gray-700/50 border-gray-600"
          : "bg-gray-50 border-gray-200"
      } overflow-hidden cursor-pointer hover:shadow-lg transition-shadow`}
      onClick={onClick}
    >
      <div className="aspect-video bg-gray-800 flex items-center justify-center relative group">
        <img
          src={url}
          alt={label}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.nextSibling.style.display = "flex";
          }}
        />
        <div className="hidden w-full h-full items-center justify-center">
          <FaFileImage className="text-gray-500 text-4xl" />
        </div>
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <FaExternalLinkAlt className="text-white text-2xl" />
        </div>
      </div>
      <div className="p-3">
        <p
          className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}
        >
          {label}
        </p>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-blue-500 hover:underline flex items-center mt-1"
        >
          <FaDownload className="mr-1" />
          Download
        </a>
      </div>
    </div>
  );
};

// Info Row Component
const InfoRow = ({ icon, label, value, darkMode }) => {
  return (
    <div className="flex items-start space-x-3">
      <div className={`mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {icon}
      </div>
      <div>
        <p
          className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
        >
          {label}
        </p>
        <p
          className={`text-sm font-medium ${darkMode ? "text-white" : "text-gray-900"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

// Modal Component
const Modal = ({ title, children, darkMode, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className={`rounded-lg max-w-lg w-full p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <h3
            className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${
              darkMode
                ? "text-gray-400 hover:bg-gray-700"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

// Image Lightbox Component
const ImageLightbox = ({ imageUrl, onClose, darkMode }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 p-2 rounded-lg bg-white/10 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <FaTimes size={24} />
      </button>
      <img
        src={imageUrl}
        alt="Document preview"
        className="max-w-full max-h-full object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default AdminKycDetail;
