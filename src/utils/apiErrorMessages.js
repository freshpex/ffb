const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

export const getFriendlyApiErrorMessage = (
  error,
  fallback = GENERIC_ERROR_MESSAGE,
) => {
  const type = typeof error === "object" ? error?.type : null;
  const rawMessage =
    typeof error === "string"
      ? error
      : error?.message || error?.error?.message || fallback;

  switch (type) {
    case "withdrawal_commitment_required":
    case "insufficient_deposits":
      return "To withdraw, you need either 500 USDT in completed deposits or 3 invited users who have completed KYC verification.";
    case "kyc_required":
      return "Please complete KYC verification in Settings before withdrawing funds.";
    case "withdrawal_pin_not_set":
      return "Please set your withdrawal PIN in Settings > Security before making a withdrawal.";
    case "withdrawal_pin_required":
      return "Enter your withdrawal PIN to continue.";
    case "withdrawal_otp_required":
    case "otp_missing":
      return "Enter the email verification code to continue.";
    case "invalid_withdrawal_pin":
      return "The withdrawal PIN you entered is incorrect.";
    case "invalid_otp":
      return "The verification code you entered is incorrect.";
    case "otp_expired":
      return "Your verification code has expired. Please request a new one.";
    case "otp_cooldown":
      return (
        rawMessage ||
        "Please wait a moment before requesting another verification code."
      );
    case "otp_attempts_exceeded":
      return "Too many incorrect verification attempts. Please request a new code.";
    case "insufficient_balance":
      return (
        rawMessage ||
        "Your available balance is not enough for this withdrawal."
      );
    case "below_minimum":
      return rawMessage || "This withdrawal is below the minimum amount.";
    default:
      return rawMessage || fallback;
  }
};
