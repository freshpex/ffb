import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../../AuthPage/AuthContext";
import FormInput from "../../common/FormInput";
import Button from "../../common/Button";
import { FaLock, FaShieldAlt, FaCheck, FaTimes, FaEnvelope } from "react-icons/fa";
import {
  updatePassword,
  setWithdrawalPin,
  selectSecurityStatus,
} from "../../../redux/slices/securitySlice";
import { useToast } from "../../../context/ToastContext";
import { fetchUserProfile, selectUserProfile } from "../../../redux/slices/userSlice";

const SecurityTab = ({ section }) => {
  const dispatch = useDispatch();
  const status = useSelector(selectSecurityStatus);
  const profile = useSelector(selectUserProfile);
  const { resetPassword, user } = useAuth();
  const [showResetOption, setShowResetOption] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  const [withdrawalPinData, setWithdrawalPinData] = useState({
    currentPin: "",
    pin: "",
    confirmPin: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (name === "newPassword") {
      checkPasswordStrength(value);
    }
  };

  const checkPasswordStrength = (password) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    });
  };

  const { showToast } = useToast();

  const handlePasswordReset = async () => {
    try {
      if (!user?.email) {
        showToast("No email found for password reset", { type: "error" });
        return;
      }
      await resetPassword(user.email);
      showToast(
        `Password reset email sent to ${user.email}. Please check your inbox.`,
        { type: "success", duration: 6000 }
      );
      setShowResetOption(false);
    } catch (err) {
      showToast(
        err?.message || "Failed to send password reset email",
        { type: "error" }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // Show error - passwords don't match
      showToast("New passwords do not match", { type: "error" });
      return;
    }

    try {
      const response = await dispatch(
        updatePassword({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      ).unwrap();

      showToast(response?.message || "Password changed successfully", {
        type: "success",
      });

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordStrength({
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false,
      });
    } catch (err) {
      const errorMsg = err || "Failed to change password";
      showToast(errorMsg, { type: "error" });
      
      // If password is incorrect, show reset option
      if (errorMsg.includes("incorrect") || errorMsg.includes("wrong")) {
        setShowResetOption(true);
      }
    }
  };

  const hasWithdrawalPin = !!profile?.hasWithdrawalPin;

  const handleWithdrawalPinChange = (e) => {
    const { name, value } = e.target;
    const cleaned = value.replace(/\D/g, "").slice(0, 6);
    setWithdrawalPinData((prev) => ({
      ...prev,
      [name]: cleaned,
    }));
  };

  const handleWithdrawalPinSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{4,6}$/.test(withdrawalPinData.pin)) {
      showToast("Withdrawal PIN must be 4 to 6 digits", { type: "error" });
      return;
    }

    if (withdrawalPinData.pin !== withdrawalPinData.confirmPin) {
      showToast("PIN and confirm PIN do not match", { type: "error" });
      return;
    }

    if (hasWithdrawalPin && !/^\d{4,6}$/.test(withdrawalPinData.currentPin)) {
      showToast("Current PIN is required to update your withdrawal PIN", {
        type: "error",
      });
      return;
    }

    try {
      const payload = {
        pin: withdrawalPinData.pin,
        confirmPin: withdrawalPinData.confirmPin,
      };

      if (hasWithdrawalPin) {
        payload.currentPin = withdrawalPinData.currentPin;
      }

      const response = await dispatch(setWithdrawalPin(payload)).unwrap();
      showToast(response?.message || "Withdrawal PIN saved successfully", {
        type: "success",
      });

      setWithdrawalPinData({
        currentPin: "",
        pin: "",
        confirmPin: "",
      });

      dispatch(fetchUserProfile());
    } catch (err) {
      showToast(err || "Failed to save withdrawal PIN", { type: "error" });
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="mb-8">
        <h3 className="text-xl font-medium text-gray-200 mb-4 flex items-center">
          <FaLock className="mr-2 text-primary-500" /> Change Password
        </h3>

        <FormInput
          label="Current Password"
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword}
          onChange={handleChange}
          placeholder="Enter your current password"
          required
        />

        <FormInput
          label="New Password"
          type="password"
          name="newPassword"
          value={passwordData.newPassword}
          onChange={handleChange}
          placeholder="Enter your new password"
          required
        />

        <FormInput
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your new password"
          required
        />

        <div className="bg-gray-800 p-4 rounded-md mb-6">
          <h4 className="font-medium text-sm text-gray-300 mb-2">
            Password Requirements
          </h4>
          <ul className="space-y-2">
            <li className="flex items-center text-sm">
              {passwordStrength.length ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              <span
                className={
                  passwordStrength.length ? "text-green-500" : "text-gray-400"
                }
              >
                At least 8 characters
              </span>
            </li>
            <li className="flex items-center text-sm">
              {passwordStrength.uppercase ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              <span
                className={
                  passwordStrength.uppercase
                    ? "text-green-500"
                    : "text-gray-400"
                }
              >
                At least one uppercase letter
              </span>
            </li>
            <li className="flex items-center text-sm">
              {passwordStrength.lowercase ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              <span
                className={
                  passwordStrength.lowercase
                    ? "text-green-500"
                    : "text-gray-400"
                }
              >
                At least one lowercase letter
              </span>
            </li>
            <li className="flex items-center text-sm">
              {passwordStrength.number ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              <span
                className={
                  passwordStrength.number ? "text-green-500" : "text-gray-400"
                }
              >
                At least one number
              </span>
            </li>
            <li className="flex items-center text-sm">
              {passwordStrength.special ? (
                <FaCheck className="text-green-500 mr-2" />
              ) : (
                <FaTimes className="text-red-500 mr-2" />
              )}
              <span
                className={
                  passwordStrength.special ? "text-green-500" : "text-gray-400"
                }
              >
                At least one special character
              </span>
            </li>
          </ul>
        </div>

        <Button
          type="submit"
          isLoading={status === "loading"}
          disabled={status === "loading"}
        >
          Update Password
        </Button>

        {showResetOption && (
          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500/50 rounded-lg">
            <p className="text-sm text-blue-300 mb-3">
              Having trouble with your current password? You can reset it via email instead.
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={handlePasswordReset}
              className="flex items-center gap-2"
            >
              <FaEnvelope /> Send Password Reset Email
            </Button>
          </div>
        )}
      </form>

      <div className="border-t border-gray-700 pt-6">
        <h3 className="text-xl font-medium text-gray-200 mb-4 flex items-center">
          <FaShieldAlt className="mr-2 text-primary-500" /> Two-Factor
          Authentication
        </h3>

        <p className="text-gray-400 mb-4">
          Enhance your account security by enabling two-factor authentication.
          When enabled, you'll be required to provide a verification code in
          addition to your password when logging in.
        </p>

        <Button variant="outline">Enable Two-Factor Authentication</Button>
      </div>

      <div
        id="withdrawal-pin"
        className={`border-t border-gray-700 pt-6 mt-8 ${section === "withdrawal-pin" ? "ring-1 ring-primary-500/60 rounded-lg p-4" : ""}`}
      >
        <h3 className="text-xl font-medium text-gray-200 mb-4 flex items-center">
          <FaShieldAlt className="mr-2 text-primary-500" /> Withdrawal PIN
        </h3>

        <p className="text-gray-400 mb-4">
          Your withdrawal PIN is required before any withdrawal can be completed.
          For security, each withdrawal also requires an OTP sent to your email.
        </p>

        {section === "withdrawal-pin" && (
          <div className="mb-4 p-3 rounded-lg bg-primary-900/20 border border-primary-500/30 text-primary-200 text-sm">
            Set your withdrawal PIN to continue with withdrawals.
          </div>
        )}

        <form onSubmit={handleWithdrawalPinSubmit} className="space-y-4">
          {hasWithdrawalPin && (
            <FormInput
              label="Current PIN"
              type="password"
              name="currentPin"
              value={withdrawalPinData.currentPin}
              onChange={handleWithdrawalPinChange}
              placeholder="Enter current PIN"
              required
            />
          )}

          <FormInput
            label={hasWithdrawalPin ? "New PIN" : "Set PIN"}
            type="password"
            name="pin"
            value={withdrawalPinData.pin}
            onChange={handleWithdrawalPinChange}
            placeholder="Enter 4-6 digit PIN"
            required
          />

          <FormInput
            label={hasWithdrawalPin ? "Confirm New PIN" : "Confirm PIN"}
            type="password"
            name="confirmPin"
            value={withdrawalPinData.confirmPin}
            onChange={handleWithdrawalPinChange}
            placeholder="Re-enter PIN"
            required
          />

          <Button
            type="submit"
            isLoading={status === "loading"}
            disabled={status === "loading"}
          >
            {hasWithdrawalPin ? "Update Withdrawal PIN" : "Set Withdrawal PIN"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default SecurityTab;
