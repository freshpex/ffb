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
    frontImage: null,
    backImage: null,
    proofOfAddressImage: null,
    selfieImage: null,
  });
  const [previews, setPreviews] = useState({
    frontImage: null,
    backImage: null,
    proofOfAddressImage: null,
    selfieImage: null,
  });
  const [kycData, setKycData] = useState({
    documentType: "passport",
    documentNumber: "",
    countryOfIssue: "",
    proofOfAddressType: "utility_bill",
    dateOfBirth: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [uploadStatus, setUploadStatus] = useState("");

  const kycStatus = profile?.kycStatus || "not_submitted";
  const isVerified = profile?.kycVerified || false;

  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
      return;
    }

    // Prefill from user profile when available
    setKycData((prev) => ({
      ...prev,
      dateOfBirth:
        prev.dateOfBirth ||
        (profile.dateOfBirth
          ? new Date(profile.dateOfBirth).toISOString().slice(0, 10)
          : ""),
      street: prev.street || profile.address?.street || "",
      city: prev.city || profile.address?.city || "",
      state: prev.state || profile.address?.state || "",
      postalCode: prev.postalCode || profile.address?.postalCode || "",
      country:
        prev.country ||
        profile.address?.country ||
        profile.country ||
        "",
    }));
  }, [dispatch, profile]);

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

    // Validate required fields
    const required = [
      "documentType",
      "documentNumber",
      "countryOfIssue",
      "proofOfAddressType",
      "dateOfBirth",
      "street",
      "city",
      "state",
      "postalCode",
      "country",
    ];
    const missing = required.filter((k) => !String(kycData[k] || "").trim());
    if (missing.length > 0) {
      alert("Please complete all required KYC details before submitting.");
      return;
    }

    // Validate required files
    if (!files.frontImage || !files.proofOfAddressImage || !files.selfieImage) {
      alert(
        "Please upload the ID front image, proof of address image, and a selfie with ID.",
      );
      return;
    }

    const formData = new FormData();

    // Text fields
    Object.entries(kycData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // File fields (must match backend multer field names)
    formData.append("frontImage", files.frontImage);
    if (files.backImage) formData.append("backImage", files.backImage);
    formData.append("proofOfAddressImage", files.proofOfAddressImage);
    formData.append("selfieImage", files.selfieImage);

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
        frontImage: null,
        backImage: null,
        proofOfAddressImage: null,
        selfieImage: null,
      });
      setPreviews({
        frontImage: null,
        backImage: null,
        proofOfAddressImage: null,
        selfieImage: null,
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
          {/* KYC Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Document Type *
              </label>
              <select
                value={kycData.documentType}
                onChange={(e) =>
                  setKycData((p) => ({ ...p, documentType: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2"
                required
              >
                <option value="passport">Passport</option>
                <option value="national_id">National ID</option>
                <option value="drivers_license">Driver's License</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Document Number *
              </label>
              <input
                type="text"
                value={kycData.documentNumber}
                onChange={(e) =>
                  setKycData((p) => ({ ...p, documentNumber: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2"
                placeholder="Enter your document number"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Country of Issue *
              </label>
              <input
                type="text"
                value={kycData.countryOfIssue}
                onChange={(e) =>
                  setKycData((p) => ({ ...p, countryOfIssue: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2"
                placeholder="e.g. United States"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                value={kycData.dateOfBirth}
                onChange={(e) =>
                  setKycData((p) => ({ ...p, dateOfBirth: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Proof of Address Type *
              </label>
              <select
                value={kycData.proofOfAddressType}
                onChange={(e) =>
                  setKycData((p) => ({
                    ...p,
                    proofOfAddressType: e.target.value,
                  }))
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2"
                required
              >
                <option value="utility_bill">Utility Bill</option>
                <option value="bank_statement">Bank Statement</option>
                <option value="government_letter">Government Letter</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Street Address *
              </label>
              <input
                type="text"
                value={kycData.street}
                onChange={(e) =>
                  setKycData((p) => ({ ...p, street: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2"
                placeholder="Street address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                City *
              </label>
              <input
                type="text"
                value={kycData.city}
                onChange={(e) =>
                  setKycData((p) => ({ ...p, city: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                State/Region *
              </label>
              <input
                type="text"
                value={kycData.state}
                onChange={(e) =>
                  setKycData((p) => ({ ...p, state: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                value={kycData.postalCode}
                onChange={(e) =>
                  setKycData((p) => ({ ...p, postalCode: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Country *
              </label>
              <input
                type="text"
                value={kycData.country}
                onChange={(e) =>
                  setKycData((p) => ({ ...p, country: e.target.value }))
                }
                className="w-full bg-gray-800 border border-gray-700 text-gray-100 rounded-lg px-3 py-2"
                required
              />
            </div>
          </div>

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
                name="frontImage"
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
            {previews.frontImage && (
              <img
                src={previews.frontImage}
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
                name="backImage"
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
            {previews.backImage && (
              <img
                src={previews.backImage}
                alt="Back Image Preview"
                className="mt-2 h-32 w-auto rounded border border-gray-600"
              />
            )}
          </div>

          {/* Proof of Address */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              <FaIdCard className="inline mr-2" />
              Proof of Address *
            </label>
            <p className="text-xs text-gray-400 mb-2">
              Upload a utility bill / bank statement / government letter (recent)
            </p>
            <div className="relative">
              <input
                type="file"
                name="proofOfAddressImage"
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
            {previews.proofOfAddressImage && (
              <img
                src={previews.proofOfAddressImage}
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
                name="selfieImage"
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
            {previews.selfieImage && (
              <img
                src={previews.selfieImage}
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
            disabled={
              loading ||
              !files.frontImage ||
              !files.proofOfAddressImage ||
              !files.selfieImage
            }
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
