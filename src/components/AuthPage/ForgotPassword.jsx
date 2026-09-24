import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCheckCircle, FaEnvelope, FaKey, FaLock } from "react-icons/fa";
import Button from "../common/Button";
import { API_BASE_URL } from "../../utils/apiConfig";

const request = async (path, body) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Something went wrong. Please try again.");
  return data;
};

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!cooldown) return undefined;
    const timer = setInterval(() => setCooldown((value) => Math.max(0, value - 1)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const run = async (action) => {
    setLoading(true);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendCode = (event) => {
    event?.preventDefault();
    run(async () => {
      const data = await request("/auth/forgot-password", { email });
      setMessage(data.message);
      setCooldown(60);
      setStep(2);
    });
  };

  const verifyCode = (event) => {
    event.preventDefault();
    run(async () => {
      const data = await request("/auth/forgot-password/verify", { email, otp });
      setResetToken(data.resetToken);
      setMessage("Code verified. Choose a new secure password.");
      setStep(3);
    });
  };

  const changePassword = (event) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError("The two passwords do not match.");
      return;
    }
    run(async () => {
      await request("/auth/reset-password", { email, resetToken, newPassword: password });
      setStep(4);
    });
  };

  const steps = ["Email", "Verify", "New password"];

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10 flex items-center justify-center">
      <section className="w-full max-w-lg rounded-2xl border border-gray-700 bg-gray-800 shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-6">
            <FaArrowLeft /> Back to login
          </Link>

          {step < 4 ? (
            <>
              <p className="text-primary-400 text-sm font-semibold">Secure account recovery</p>
              <h1 className="text-2xl font-bold mt-1">Reset your password</h1>
              <p className="text-gray-400 mt-2">We will verify that you own the account before allowing any password change.</p>

              <ol className="grid grid-cols-3 gap-2 my-6" aria-label="Password reset progress">
                {steps.map((label, index) => (
                  <li key={label} className={`rounded-lg px-2 py-2 text-center text-xs ${step >= index + 1 ? "bg-primary-600 text-white" : "bg-gray-700 text-gray-400"}`}>
                    {index + 1}. {label}
                  </li>
                ))}
              </ol>
            </>
          ) : null}

          {error && <div role="alert" className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 p-3 text-sm text-red-200">{error}</div>}
          {message && step < 4 && <div role="status" className="mb-4 rounded-lg border border-green-500/40 bg-green-500/10 p-3 text-sm text-green-200">{message}</div>}

          {step === 1 && (
            <form onSubmit={sendCode} className="space-y-5">
              <label className="block text-sm text-gray-300" htmlFor="reset-email">Email address</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="reset-email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full rounded-lg border border-gray-600 bg-gray-700 py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <Button type="submit" fullWidth isLoading={loading} className="py-3">Send verification code</Button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={verifyCode} className="space-y-5">
              <div>
                <label className="block text-sm text-gray-300 mb-2" htmlFor="reset-code">6-digit code</label>
                <div className="relative">
                  <FaKey className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input id="reset-code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} placeholder="000000" className="w-full rounded-lg border border-gray-600 bg-gray-700 py-3 pl-10 pr-4 tracking-[0.4em] outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <p className="mt-2 text-xs text-gray-400">Check your inbox and spam folder. The code expires after 10 minutes.</p>
              </div>
              <Button type="submit" fullWidth isLoading={loading} className="py-3">Verify code</Button>
              <button type="button" disabled={cooldown > 0 || loading} onClick={() => sendCode()} className="w-full text-sm text-primary-400 disabled:text-gray-500">
                {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend verification code"}
              </button>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={changePassword} className="space-y-4">
              <p className="text-sm text-gray-400">Use at least 8 characters with uppercase, lowercase, and a number.</p>
              {[{ id: "new-password", label: "New password", value: password, setter: setPassword }, { id: "confirm-password", label: "Confirm new password", value: confirmPassword, setter: setConfirmPassword }].map((field) => (
                <div key={field.id}>
                  <label className="block text-sm text-gray-300 mb-2" htmlFor={field.id}>{field.label}</label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input id={field.id} type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} required value={field.value} onChange={(e) => field.setter(e.target.value)} className="w-full rounded-lg border border-gray-600 bg-gray-700 py-3 pl-10 pr-4 outline-none focus:ring-2 focus:ring-primary-500" />
                  </div>
                </div>
              ))}
              <label className="inline-flex items-center gap-2 text-sm text-gray-400"><input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} /> Show passwords</label>
              <Button type="submit" fullWidth isLoading={loading} className="py-3">Change password</Button>
            </form>
          )}

          {step === 4 && (
            <div className="py-8 text-center">
              <FaCheckCircle className="mx-auto text-green-400 text-5xl" />
              <h1 className="mt-4 text-2xl font-bold">Password changed</h1>
              <p className="mt-2 text-gray-400">Your new password is ready. Sign in again to continue.</p>
              <Button type="button" fullWidth className="mt-6 py-3" onClick={() => navigate("/login", { replace: true })}>Go to login</Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default ForgotPassword;
