import { useState } from "react";
import { useDispatch } from "react-redux";
import { setGlobalError } from "../redux/slices/layoutSlice";

/**
 * A simple diagnostic tool for checking API connectivity
 * You can include this in your development builds to test connectivity
 */
const DiagnosticTool = () => {
  const dispatch = useDispatch();
  const [status, setStatus] = useState("idle");
  const [results, setResults] = useState([]);

  const runDiagnostics = async () => {
    setStatus("running");
    setResults([]);

    try {
      // Add log entry
      addResult("info", "Starting API diagnostics check...");

      // Check if Firebase is initialized
      try {
        const firebase = await import("../firebase");
        addResult("success", "Firebase module imported successfully");

        if (firebase.auth) {
          addResult("success", "Firebase Auth is available");

          // Check if user is logged in
          const user = firebase.auth.currentUser;
          if (user) {
            addResult("success", `Firebase user authenticated: ${user.email}`);
          } else {
            addResult("warning", "No Firebase user is currently logged in");
          }
        } else {
          addResult("error", "Firebase Auth is not available");
        }
      } catch (error) {
        addResult("error", `Firebase import error: ${error.message}`);
      }

      // Check if we can load the mock API service
      try {
        const mockService = await import("../services/mockApiService");
        addResult("success", "Mock API service loaded successfully");

        // Try a sample mock API call
        const mockUser = await mockService.default.user.getProfile();
        if (mockUser) {
          addResult("success", "Mock API test call successful");
        }
      } catch (error) {
        addResult("error", `Mock API service error: ${error.message}`);
      }

      // Browser capabilities check
      addResult("info", "Checking browser capabilities...");

      if ("localStorage" in window) {
        addResult("success", "LocalStorage is available");
      } else {
        addResult("error", "LocalStorage is not available");
      }

      if ("sessionStorage" in window) {
        addResult("success", "SessionStorage is available");
      } else {
        addResult("error", "SessionStorage is not available");
      }

      if ("indexedDB" in window) {
        addResult("success", "IndexedDB is available");
      } else {
        addResult("warning", "IndexedDB is not available");
      }

      addResult("info", "Diagnostics completed");
      setStatus("completed");
    } catch (error) {
      addResult("error", `Diagnostics error: ${error.message}`);
      setStatus("error");
      dispatch(setGlobalError("Diagnostic tool encountered an error"));
    }
  };

  const addResult = (type, message) => {
    setResults((prev) => [...prev, { type, message, timestamp: new Date() }]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-gray-800 rounded-lg shadow-lg p-4 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-white font-medium">API Diagnostics</h3>
          <button
            className="text-gray-400 hover:text-white"
            onClick={() => setResults([])}
          >
            Clear
          </button>
        </div>

        <div className="mb-4">
          <button
            className={`px-4 py-2 rounded-lg font-medium ${
              status === "running"
                ? "bg-yellow-500 text-white cursor-not-allowed"
                : "bg-primary-500 text-white hover:bg-primary-600"
            }`}
            onClick={runDiagnostics}
            disabled={status === "running"}
          >
            {status === "running" ? "Running..." : "Run Diagnostics"}
          </button>
        </div>

        <div className="bg-gray-900 rounded-lg p-2 h-64 overflow-y-auto">
          {results.length === 0 ? (
            <div className="text-gray-500 text-center p-4">
              No diagnostics results yet
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-2 rounded text-sm ${
                    result.type === "error"
                      ? "bg-red-900/30 text-red-300"
                      : result.type === "warning"
                        ? "bg-yellow-900/30 text-yellow-300"
                        : result.type === "success"
                          ? "bg-green-900/30 text-green-300"
                          : "bg-blue-900/30 text-blue-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{result.message}</span>
                    <span className="text-xs opacity-70">
                      {result.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosticTool;
