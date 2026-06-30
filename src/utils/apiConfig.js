const PRODUCTION_API_URL = "https://ffbb.vercel.app/api";
const LOCAL_API_URL = "http://localhost:5000/api";

const isLocalHostname = (hostname) =>
  !hostname || hostname === "localhost" || hostname === "127.0.0.1";

export const getApiBaseUrl = () => {
  const configured = import.meta.env.VITE_API_URL;

  if (typeof window === "undefined") {
    return configured || PRODUCTION_API_URL;
  }

  const isLocal = isLocalHostname(window.location.hostname);

  if (configured?.includes("localhost") && !isLocal) {
    return PRODUCTION_API_URL;
  }

  return configured || (isLocal ? LOCAL_API_URL : PRODUCTION_API_URL);
};

export const API_BASE_URL = getApiBaseUrl();
