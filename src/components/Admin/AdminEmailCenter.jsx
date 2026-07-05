import { useEffect, useMemo, useState } from "react";
import {
  FaEnvelope,
  FaPaperPlane,
  FaSave,
  FaSearch,
  FaSyncAlt,
} from "react-icons/fa";
import { useDarkMode } from "../../context/DarkModeContext";
import PageTransition from "../common/PageTransition";
import ComponentLoader from "../common/ComponentLoader";
import { API_BASE_URL } from "../../utils/apiConfig";

const API_URL = API_BASE_URL;
const CUSTOM_TEMPLATE_KEY = "__custom";

const getUserName = (user) =>
  `${user?.firstName || ""} ${user?.lastName || ""}`.trim() ||
  user?.username ||
  user?.email ||
  "User";

const normalizeTemplateMessage = (template) =>
  template?.message || template?.text || "";

const AdminEmailCenter = () => {
  const { darkMode } = useDarkMode();

  const [status, setStatus] = useState("idle");
  const [sendStatus, setSendStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [templates, setTemplates] = useState([]);
  const [selectedKey, setSelectedKey] = useState(CUSTOM_TEMPLATE_KEY);

  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [description, setDescription] = useState("");

  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState("");
  const [sendToEmail, setSendToEmail] = useState("");
  const [sendToAdmins, setSendToAdmins] = useState(false);

  const token = useMemo(() => localStorage.getItem("ffb_admin_token"), []);
  const selectedTemplate = templates.find((t) => t.templateKey === selectedKey);
  const isCustomEmail = selectedKey === CUSTOM_TEMPLATE_KEY;

  const inputClass = `w-full px-3 py-2 rounded-md border ${
    darkMode
      ? "bg-gray-900 border-gray-700 text-gray-100 placeholder:text-gray-500"
      : "bg-white border-gray-300 text-gray-900"
  }`;
  const labelClass = `block text-sm font-medium mb-1 ${
    darkMode ? "text-gray-300" : "text-gray-700"
  }`;
  const panelClass = `rounded-lg border ${
    darkMode ? "border-gray-700 bg-gray-900" : "border-gray-200 bg-gray-50"
  }`;

  const applyTemplate = (template) => {
    setTitle(template?.title || template?.subject || "");
    setSubject(template?.subject || "");
    setMessage(normalizeTemplateMessage(template));
    setDescription(template?.description || "");
  };

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
      if (!res.ok) {
        throw new Error(
          data?.error?.message || data?.message || "Failed to load templates",
        );
      }

      const list = data.data || [];
      setTemplates(list);

      const firstTemplate = list[0];
      if (selectedKey === CUSTOM_TEMPLATE_KEY && firstTemplate) {
        setSelectedKey(firstTemplate.templateKey);
        applyTemplate(firstTemplate);
      }

      setStatus("succeeded");
    } catch (e) {
      setStatus("failed");
      setError(e.message || "Failed to load templates");
    }
  };

  const fetchUsers = async (search = "") => {
    try {
      if (!token) return;
      const params = new URLSearchParams({
        role: "user",
        limit: "20",
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`${API_URL}/admin/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if (!res.ok) return;
      setUsers(data.users || data.data?.users || []);
    } catch {
      setUsers([]);
    }
  };

  useEffect(() => {
    document.title = "Email Center | Admin Dashboard";
    fetchTemplates();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsers(userSearch), 350);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userSearch]);

  const handleTemplateChange = (value) => {
    setSelectedKey(value);
    setSuccess(null);
    setError(null);

    if (value === CUSTOM_TEMPLATE_KEY) {
      setTitle("");
      setSubject("");
      setMessage("");
      setDescription("Custom email");
      return;
    }

    const template = templates.find((t) => t.templateKey === value);
    if (template) applyTemplate(template);
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(null);

    try {
      if (!token) throw new Error("Admin authentication required");
      if (isCustomEmail)
        throw new Error("Select a saved template before saving changes");
      if (!subject.trim()) throw new Error("Subject is required");
      if (!message.trim()) throw new Error("Message is required");

      const res = await fetch(
        `${API_URL}/admin/emails/templates/${selectedKey}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            subject,
            message,
            description,
          }),
        },
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data?.error?.message || data?.message || "Failed to save template",
        );
      }

      await fetchTemplates();
      setSuccess("Template saved successfully.");
    } catch (e) {
      setError(e.message || "Failed to save template");
    }
  };

  const handleSend = async () => {
    setError(null);
    setSuccess(null);
    setSendStatus("loading");

    try {
      if (!token) throw new Error("Admin authentication required");
      if (!subject.trim()) throw new Error("Subject is required");
      if (!message.trim()) throw new Error("Message is required");
      if (!selectedUserId && !sendToEmail.trim() && !sendToAdmins) {
        throw new Error(
          "Choose a user, enter an email address, or send to admins",
        );
      }

      const selectedUser = users.find((user) => user._id === selectedUserId);
      const variables = selectedUser
        ? {
            name: getUserName(selectedUser),
            email: selectedUser.email,
            kycLink: `${window.location.origin}/login/accountsettings`,
            dashboardLink: `${window.location.origin}/login/dashboardpage`,
          }
        : {
            name: "Customer",
            kycLink: `${window.location.origin}/login/accountsettings`,
            dashboardLink: `${window.location.origin}/login/dashboardpage`,
          };

      const res = await fetch(`${API_URL}/admin/emails/send`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          templateKey: isCustomEmail ? undefined : selectedKey,
          toUserId: selectedUserId || undefined,
          toEmail: sendToEmail.trim() || undefined,
          toAdmins: sendToAdmins,
          variables,
          title,
          subject,
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          data?.error?.message || data?.message || "Failed to send email",
        );
      }

      setSuccess(`Email sent to ${(data.data?.recipients || []).join(", ")}.`);
    } catch (e) {
      setError(e.message || "Failed to send email");
    } finally {
      setSendStatus("idle");
    }
  };

  return (
    <PageTransition>
      <div className="max-w-6xl mx-auto">
        <div
          className={`rounded-lg shadow-md border ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-lg bg-primary-600 flex items-center justify-center text-white">
                <FaEnvelope />
              </div>
              <div>
                <h2
                  className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Email Center
                </h2>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Choose a template, pick a user, and send polished FFB emails
                  without HTML.
                </p>
              </div>
            </div>

            <button
              onClick={fetchTemplates}
              className="px-3 py-2 text-sm rounded-md bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 flex items-center justify-center"
            >
              <FaSyncAlt className="mr-2" /> Refresh
            </button>
          </div>

          <div className="p-6">
            {status === "loading" ? (
              <ComponentLoader
                height="220px"
                message="Loading email templates..."
              />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className={`p-4 ${panelClass}`}>
                    <h3
                      className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      Recipient
                    </h3>

                    <label className={labelClass}>Find user</label>
                    <div className="relative mb-3">
                      <FaSearch className="absolute left-3 top-3 text-gray-500" />
                      <input
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className={`${inputClass} pl-9`}
                        placeholder="Search by name or email"
                      />
                    </div>

                    <label className={labelClass}>Select app user</label>
                    <select
                      value={selectedUserId}
                      onChange={(e) => setSelectedUserId(e.target.value)}
                      className={`${inputClass} mb-3`}
                    >
                      <option value="">Choose a user...</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {getUserName(user)} - {user.email}
                        </option>
                      ))}
                    </select>

                    <label className={labelClass}>Email address</label>
                    <input
                      value={sendToEmail}
                      onChange={(e) => setSendToEmail(e.target.value)}
                      className={`${inputClass} mb-3`}
                      placeholder="Optional external email"
                    />

                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={sendToAdmins}
                        onChange={(e) => setSendToAdmins(e.target.checked)}
                      />
                      <span
                        className={`${darkMode ? "text-gray-200" : "text-gray-800"}`}
                      >
                        Also send to all admins
                      </span>
                    </label>
                  </div>

                  <div className={`p-4 ${panelClass}`}>
                    <h3
                      className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      Template
                    </h3>
                    <label className={labelClass}>Default template</label>
                    <select
                      value={selectedKey}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                      className={inputClass}
                    >
                      <option value={CUSTOM_TEMPLATE_KEY}>
                        Write a custom email
                      </option>
                      {templates.map((template) => (
                        <option
                          key={template.templateKey}
                          value={template.templateKey}
                        >
                          {template.description || template.templateKey}
                          {template.isOverridden ? " (customized)" : ""}
                        </option>
                      ))}
                    </select>
                    {selectedTemplate && (
                      <p
                        className={`mt-2 text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                      >
                        Template key: {selectedTemplate.templateKey}
                      </p>
                    )}
                  </div>
                </div>

                <div className="lg:col-span-3">
                  <div className={`p-4 ${panelClass}`}>
                    <h3
                      className={`text-lg font-semibold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      Compose Email
                    </h3>

                    <label className={labelClass}>Email title</label>
                    <input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className={`${inputClass} mb-4`}
                      placeholder="Heading shown inside the email"
                    />

                    <label className={labelClass}>Subject</label>
                    <input
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className={`${inputClass} mb-4`}
                      placeholder="Subject line users see in their inbox"
                    />

                    {!isCustomEmail && (
                      <>
                        <label className={labelClass}>Template note</label>
                        <input
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          className={`${inputClass} mb-4`}
                          placeholder="Internal template description"
                        />
                      </>
                    )}

                    <label className={labelClass}>Message</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={12}
                      className={`${inputClass} mb-4 leading-relaxed`}
                      placeholder="Write the message in plain text. You can use {{name}} to personalize it."
                    />

                    <div
                      className={`rounded-lg border p-4 mb-4 ${darkMode ? "border-gray-700 bg-gray-950" : "border-gray-200 bg-white"}`}
                    >
                      <p
                        className={`text-xs uppercase tracking-wide mb-2 ${darkMode ? "text-gray-500" : "text-gray-500"}`}
                      >
                        Preview
                      </p>
                      <h4
                        className={`text-lg font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {title || subject || "Email title"}
                      </h4>
                      <p
                        className={`mt-1 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                      >
                        Subject: {subject || "Subject line"}
                      </p>
                      <div
                        className={`mt-4 whitespace-pre-wrap text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                      >
                        {message || "Your message will appear here."}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      {!isCustomEmail && (
                        <button
                          onClick={handleSave}
                          className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center"
                        >
                          <FaSave className="mr-2" /> Save Template
                        </button>
                      )}
                      <button
                        onClick={handleSend}
                        disabled={sendStatus === "loading"}
                        className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white flex items-center justify-center"
                      >
                        <FaPaperPlane className="mr-2" />
                        {sendStatus === "loading" ? "Sending..." : "Send Email"}
                      </button>
                    </div>

                    {error && (
                      <div className="mt-4 p-3 rounded-md border border-red-800 bg-red-900/20 text-red-300">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="mt-4 p-3 rounded-md border border-green-800 bg-green-900/20 text-green-300">
                        {success}
                      </div>
                    )}
                  </div>
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
