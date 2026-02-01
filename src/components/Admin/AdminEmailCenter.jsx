import { useEffect, useMemo, useState } from "react";
import { FaEnvelope, FaPaperPlane, FaSave, FaSyncAlt } from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";
import PageTransition from "../common/PageTransition";
import ComponentLoader from "../common/ComponentLoader";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const safeJsonParse = (value) => {
  try {
    if (!value) return { ok: true, data: {} };
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === "object") return { ok: true, data: parsed };
    return { ok: false, error: "JSON must be an object" };
  } catch (e) {
    return { ok: false, error: e.message || "Invalid JSON" };
  }
};

const AdminEmailCenter = () => {
  const { darkMode } = useDarkMode();

  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const [templates, setTemplates] = useState([]);
  const [selectedKey, setSelectedKey] = useState("");

  const [subject, setSubject] = useState("");
  const [html, setHtml] = useState("");
  const [text, setText] = useState("");
  const [description, setDescription] = useState("");

  const [sendToEmail, setSendToEmail] = useState("");
  const [sendToAdmins, setSendToAdmins] = useState(false);
  const [variablesJson, setVariablesJson] = useState(
    JSON.stringify(
      {
        name: "User",
        kycLink: "https://ffbroker.cam/login/accountsettings",
        suspiciousDetails: "Multiple login locations",
      },
      null,
      2,
    ),
  );

  const token = useMemo(() => localStorage.getItem("ffb_admin_token"), []);

  const fetchTemplates = async () => {
    setStatus("loading");
    setError(null);

    try {
      if (!token) throw new Error("Admin authentication required");

      const res = await fetch(`${API_URL}/admin/emails/templates`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to load templates");

      const list = data.data || [];
      setTemplates(list);

      if (!selectedKey && list.length) {
        setSelectedKey(list[0].templateKey);
      }

      setStatus("succeeded");
    } catch (e) {
      setStatus("failed");
      setError(e.message || "Failed to load templates");
    }
  };

  useEffect(() => {
    document.title = "Email Center | Admin Dashboard";
    fetchTemplates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!selectedKey) return;
    const t = templates.find((x) => x.templateKey === selectedKey);
    if (!t) return;

    setSubject(t.subject || "");
    setHtml(t.html || "");
    setText(t.text || "");
    setDescription(t.description || "");
  }, [selectedKey, templates]);

  const handleSave = async () => {
    setError(null);
    try {
      if (!token) throw new Error("Admin authentication required");
      if (!selectedKey) throw new Error("Select a template");
      if (!subject.trim()) throw new Error("Subject is required");
      if (!html.trim() && !text.trim()) throw new Error("HTML or Text content is required");

      const res = await fetch(`${API_URL}/admin/emails/templates/${selectedKey}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subject, html, text, description }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save template");

      await fetchTemplates();
    } catch (e) {
      setError(e.message || "Failed to save template");
    }
  };

  const handleSend = async () => {
    setError(null);
    try {
      if (!token) throw new Error("Admin authentication required");
      if (!selectedKey) throw new Error("Select a template");
      if (!sendToAdmins && !sendToEmail.trim()) {
        throw new Error("Provide a recipient email or enable 'Send to admins'");
      }

      const parsed = safeJsonParse(variablesJson);
      if (!parsed.ok) throw new Error(parsed.error);

      const res = await fetch(`${API_URL}/admin/emails/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateKey: selectedKey,
          toEmail: sendToEmail.trim() || undefined,
          toAdmins: sendToAdmins,
          variables: parsed.data,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to send email");

      alert(`Email queued/sent to: ${(data.data?.recipients || []).join(", ")}`);
    } catch (e) {
      setError(e.message || "Failed to send email");
    }
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <div
          className={`rounded-lg shadow-md border ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <FaEnvelope />
              </div>
              <div>
                <h2 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Email Center
                </h2>
                <p className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                  Edit templates and send emails to users (Mailjet).
                </p>
              </div>
            </div>

            <button
              onClick={fetchTemplates}
              className="px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 flex items-center"
            >
              <FaSyncAlt className="mr-2" /> Refresh
            </button>
          </div>

          <div className="p-6">
            {status === "loading" ? (
              <ComponentLoader height="220px" message="Loading email templates..." />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Template editor */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Template Editor
                  </h3>

                  <label className={`block text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Template
                  </label>
                  <select
                    value={selectedKey}
                    onChange={(e) => setSelectedKey(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border mb-4 ${
                      darkMode
                        ? "bg-gray-900 border-gray-700 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  >
                    {templates.map((t) => (
                      <option key={t.templateKey} value={t.templateKey}>
                        {t.templateKey}{t.isOverridden ? " (custom)" : ""}
                      </option>
                    ))}
                  </select>

                  <label className={`block text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Subject
                  </label>
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border mb-4 ${
                      darkMode
                        ? "bg-gray-900 border-gray-700 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />

                  <label className={`block text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Description (internal)
                  </label>
                  <input
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={`w-full px-3 py-2 rounded-md border mb-4 ${
                      darkMode
                        ? "bg-gray-900 border-gray-700 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />

                  <label className={`block text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    HTML (Handlebars supported)
                  </label>
                  <textarea
                    value={html}
                    onChange={(e) => setHtml(e.target.value)}
                    rows={12}
                    className={`w-full px-3 py-2 rounded-md border mb-4 font-mono text-xs ${
                      darkMode
                        ? "bg-gray-900 border-gray-700 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                    placeholder="<p>Hi {{name}}</p>"
                  />

                  <label className={`block text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                    Text (fallback)
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={6}
                    className={`w-full px-3 py-2 rounded-md border mb-4 font-mono text-xs ${
                      darkMode
                        ? "bg-gray-900 border-gray-700 text-gray-200"
                        : "bg-white border-gray-300 text-gray-900"
                    }`}
                  />

                  <button
                    onClick={handleSave}
                    className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white flex items-center"
                  >
                    <FaSave className="mr-2" /> Save Template
                  </button>
                </div>

                {/* Send panel */}
                <div>
                  <h3 className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}>
                    Send Email
                  </h3>

                  <div className={`p-4 rounded-lg border ${darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"}`}>
                    <label className={`block text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Recipient email (optional if sending to admins)
                    </label>
                    <input
                      value={sendToEmail}
                      onChange={(e) => setSendToEmail(e.target.value)}
                      placeholder="user@example.com"
                      className={`w-full px-3 py-2 rounded-md border mb-3 ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />

                    <label className="flex items-center space-x-2 mb-3">
                      <input
                        type="checkbox"
                        checked={sendToAdmins}
                        onChange={(e) => setSendToAdmins(e.target.checked)}
                      />
                      <span className={`${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                        Also send to all admins
                      </span>
                    </label>

                    <label className={`block text-sm mb-1 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
                      Variables (JSON object)
                    </label>
                    <textarea
                      value={variablesJson}
                      onChange={(e) => setVariablesJson(e.target.value)}
                      rows={10}
                      className={`w-full px-3 py-2 rounded-md border mb-4 font-mono text-xs ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-gray-200"
                          : "bg-white border-gray-300 text-gray-900"
                      }`}
                    />

                    <button
                      onClick={handleSend}
                      className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white flex items-center"
                    >
                      <FaPaperPlane className="mr-2" /> Send Email
                    </button>
                  </div>

                  {error && (
                    <div
                      className={`mt-4 p-3 rounded-md border ${
                        darkMode
                          ? "border-red-800 bg-red-900/20 text-red-300"
                          : "border-red-200 bg-red-50 text-red-800"
                      }`}
                    >
                      {error}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default AdminEmailCenter;
