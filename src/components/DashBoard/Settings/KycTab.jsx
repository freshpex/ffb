import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiService from "../../../services/apiService";
import { fetchUserProfile } from "../../../redux/slices/userSlice";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUpload,
  FaIdCard,
  FaCamera,
} from "react-icons/fa";

const KycTab = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({
    idDocument: null,
    proofOfAddress: null,
    selfie: null,
  });
  const [previews, setPreviews] = useState({
    idDocument: null,
    proofOfAddress: null,
    selfie: null,
  });
  const [uploadStatus, setUploadStatus] = useState("");

  const kycStatus = profile?.kycStatus || "not_submitted";
  const isVerified = profile?.kycVerified || false;

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    if (selectedFiles && selectedFiles[0]) {
      const file = selectedFiles[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Only image files are allowed");
        return;
      }

      setFiles((prev) => ({ ...prev, [name]: file }));

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required files
    if (!files.idDocument || !files.selfie) {
      alert("Please upload ID document and selfie images");
      return;
    }

    const formData = new FormData();
    if (files.idDocument) formData.append("idDocument", files.idDocument);
    if (files.proofOfAddress)
      formData.append("proofOfAddress", files.proofOfAddress);
    if (files.selfie) formData.append("selfie", files.selfie);

    setLoading(true);
    setUploadStatus("");

    try {
      await apiService.uploadKYC(formData);
      setUploadStatus("success");

      // Refresh profile to get updated KYC status
      setTimeout(() => {
        dispatch(fetchUserProfile());
      }, 1000);

      // Clear form
      setFiles({
        idDocument: null,
        proofOfAddress: null,
        selfie: null,
      });
      setPreviews({
        idDocument: null,
        proofOfAddress: null,
        selfie: null,
      });
    } catch (err) {
      console.error("KYC upload error:", err);
      setUploadStatus("error");
      alert(
        err.response?.data?.message ||
          "Failed to submit KYC. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = () => {
    switch (kycStatus) {
      case "approved":
        return (
          <div className="flex items-center space-x-2 px-4 py-2 bg-green-900/30 border border-green-500 rounded-lg">
            <FaCheckCircle className="text-green-500" />
            <span className="text-green-400 font-medium">Verified</span>
          </div>
        );
      case "pending":
        return (
          <div className="flex items-center space-x-2 px-4 py-2 bg-yellow-900/30 border border-yellow-500 rounded-lg">
            <FaClock className="text-yellow-500" />
            <span className="text-yellow-400 font-medium">Under Review</span>
          </div>
        );
      case "rejected":
        return (
          <div className="flex items-center space-x-2 px-4 py-2 bg-red-900/30 border border-red-500 rounded-lg">
            <FaTimesCircle className="text-red-500" />
            <span className="text-red-400 font-medium">Rejected</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg">
            <FaClock className="text-gray-400" />
            <span className="text-gray-300 font-medium">Not Submitted</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-100 mb-2">
          KYC Verification
        </h2>
        <p className="text-gray-400">
          Complete your KYC verification to unlock all features including
          withdrawals.
        </p>
      </div>

      {/* Status Badge */}
      <div className="flex items-center justify-between">
        <span className="text-gray-300 font-medium">Verification Status:</span>
        {getStatusBadge()}
      </div>

      {isVerified ? (
        <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-6 text-center">
          <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-green-400 mb-2">
            Account Verified!
          </h3>
          <p className="text-gray-300">
            Your identity has been verified. You can now access all platform
            features.
          </p>
        </div>
      ) : kycStatus === "pending" ? (
        <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-6 text-center">
          <FaClock className="text-yellow-500 text-5xl mx-auto mb-4" />
          <h3 className="text-xl font-bold text-yellow-400 mb-2">
            Verification in Progress
          </h3>
          <p className="text-gray-300">
            Your documents are being reviewed. This typically takes 1-2 business
            days.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ID Front Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              <FaIdCard className="inline mr-2" />
              ID Card / Passport (Front) *
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Upload a clear photo of the front of your ID or passport
            </p>
            <div className="relative">
              <input
                type="file"
                name="idDocument"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-600 file:text-white
                  hover:file:bg-primary-700
                  cursor-pointer"
                required
              />
            </div>
            {previews.idDocument && (
              <img
                src={previews.idDocument}
                alt="ID Document Preview"
                className="mt-2 h-32 w-auto rounded border border-gray-600"
              />
            )}
          </div>

          {/* ID Back Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              <FaIdCard className="inline mr-2" />
              ID Card (Back) - Optional
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Upload the back of your ID card if applicable
            </p>
            <div className="relative">
              <input
                type="file"
                name="proofOfAddress"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-600 file:text-white
                  hover:file:bg-primary-700
                  cursor-pointer"
              />
            </div>
            {previews.proofOfAddress && (
              <img
                src={previews.proofOfAddress}
                alt="Proof of Address Preview"
                className="mt-2 h-32 w-auto rounded border border-gray-600"
              />
            )}
          </div>

          {/* Selfie Image */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              <FaCamera className="inline mr-2" />
              Selfie with ID *
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Take a selfie while holding your ID next to your face
            </p>
            <div className="relative">
              <input
                type="file"
                name="selfie"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-primary-600 file:text-white
                  hover:file:bg-primary-700
                  cursor-pointer"
                required
              />
            </div>
            {previews.selfie && (
              <img
                src={previews.selfie}
                alt="Selfie Preview"
                className="mt-2 h-32 w-auto rounded border border-gray-600"
              />
            )}
          </div>

          {/* Requirements Info */}
          <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
            <h4 className="font-medium text-blue-400 mb-2">Requirements:</h4>
            <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
              <li>Images must be clear and readable</li>
              <li>All corners of the document must be visible</li>
              <li>File size should not exceed 5MB</li>
              <li>Accepted formats: JPG, PNG, PDF</li>
              <li>Document must be valid and not expired</li>
            </ul>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || !files.idDocument || !files.selfie}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg
              disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <FaUpload />
                <span>Submit KYC Documents</span>
              </>
            )}
          </button>

          {uploadStatus === "success" && (
            <div className="bg-green-900/30 border border-green-500 text-green-400 px-4 py-3 rounded-lg">
              KYC documents submitted successfully! Your submission is under
              review.
            </div>
          )}

          {uploadStatus === "error" && (
            <div className="bg-red-900/30 border border-red-500 text-red-400 px-4 py-3 rounded-lg">
              Failed to submit KYC documents. Please try again.
            </div>
          )}
        </form>
      )}

      {kycStatus === "rejected" && profile?.kycNotes && (
        <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4">
          <h4 className="font-medium text-red-400 mb-2">Rejection Reason:</h4>
          <p className="text-gray-300 text-sm">{profile.kycNotes}</p>
          <p className="text-gray-400 text-xs mt-2">
            Please correct the issues and resubmit your documents.
          </p>
        </div>
      )}
    </div>
  );
};

export default KycTab;
