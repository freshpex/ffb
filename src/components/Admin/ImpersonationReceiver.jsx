import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Receives an impersonation token from the admin window via postMessage,
// stores it in sessionStorage, then redirects to the user dashboard.
const AUTH_TOKEN_KEY = "ffb_auth_token";
const CURRENT_USER_KEY = "ffb_current_user";

export default function ImpersonationReceiver() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Waiting for token...");

  useEffect(() => {
    const handler = (event) => {
      console.debug("ImpersonationReceiver received message", {
        origin: event.origin,
        expectedOrigin: window.location.origin,
        sourceIsOpener: event.source === window.opener,
        data: event.data ? { type: event.data.type } : null,
      });

      const data = event.data;
      if (!data || data.type !== "FFB_IMPERSONATE" || !data.token) return;

      try {
        sessionStorage.setItem(AUTH_TOKEN_KEY, data.token);

        if (data.user) {
          sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(data.user));
        }

        sessionStorage.setItem(
          "ffb_impersonation_meta",
          JSON.stringify({
            impersonatedBy: data.impersonatedBy || null,
            logId: data.logId || null,
            user: data.user || null,
            receivedAt: new Date().toISOString(),
          }),
        );

        setStatus("Token received. Redirecting...");

        // Acknowledge to opener when possible. Prefer event.source (the
        // original window reference) where available, otherwise fallback to
        // window.opener (may be null when noopener was used).
        try {
          if (event.source && typeof event.source.postMessage === "function") {
            event.source.postMessage({ type: "FFB_IMPERSONATE_ACK" }, event.origin);
          } else {
            window.opener?.postMessage({ type: "FFB_IMPERSONATE_ACK" }, window.location.origin);
          }
        } catch (e) {
          // ignore acknowledgement errors
        }

        // Force a full reload into the dashboard so the app picks up the new token
        // and initializes user context from storage.
        window.location.href = "/login/dashboardpage";
      } catch (e) {
        setStatus("Failed to store token");
      }
    };

    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [navigate]);

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h2>Starting impersonation session</h2>
      <p>{status}</p>
      <p style={{ opacity: 0.7, fontSize: 12 }}>
        You can close this tab if nothing happens within a few seconds.
      </p>
    </div>
  );
}
