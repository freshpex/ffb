import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import DashboardLayout from "../Layout/DashboardLayout";
import ProfileTab from "./ProfileTab";
import SecurityTab from "./SecurityTab";
import PaymentMethodsTab from "./PaymentMethodsTab";
import KycTab from "./KycTab";
import { FaArrowRight, FaCheckCircle, FaCreditCard, FaIdCard, FaInfoCircle, FaLock, FaUserCircle } from "react-icons/fa";

const TABS = [
  { id: "profile", label: "Personal details", shortLabel: "Profile", description: "Keep your contact and address information accurate.", icon: FaUserCircle },
  { id: "security", label: "Security & login", shortLabel: "Security", description: "Protect your account and review login security.", icon: FaLock },
  { id: "kyc", label: "Identity verification", shortLabel: "Verify ID", description: "Complete KYC to unlock eligible account features.", icon: FaIdCard },
  { id: "payment", label: "Payment methods", shortLabel: "Payments", description: "Manage the methods used for deposits and withdrawals.", icon: FaCreditCard },
];

const AccountSettings = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const profile = useSelector((state) => state.user.profile);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (TABS.some((item) => item.id === tab)) setActiveTab(tab);
  }, [searchParams]);

  const steps = useMemo(() => ({
    profile: Boolean(profile?.firstName && profile?.lastName && profile?.email),
    security: true,
    kyc: Boolean(profile?.kycVerified || profile?.kycStatus === "approved"),
    payment: Boolean(profile?.paymentMethods?.length),
  }), [profile]);
  const completedCount = Object.values(steps).filter(Boolean).length;

  const chooseTab = (tab) => {
    setActiveTab(tab);
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    next.delete("section");
    setSearchParams(next, { replace: true });
  };

  const renderActiveTab = () => {
    if (activeTab === "security") return <SecurityTab section={searchParams.get("section")} />;
    if (activeTab === "kyc") return <KycTab />;
    if (activeTab === "payment") return <PaymentMethodsTab />;
    return <ProfileTab />;
  };
  const current = TABS.find((tab) => tab.id === activeTab) || TABS[0];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        <div>
          <p className="text-sm font-medium text-primary-400">Account centre</p>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100 mt-1">Set up and manage your account</h1>
          <p className="text-gray-400 mt-2 max-w-3xl">Follow the steps below in order. Your changes are grouped by purpose, so you always know where to go next.</p>
        </div>

        <section className="bg-gradient-to-r from-primary-900/60 to-gray-800 border border-primary-700/40 rounded-xl p-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-white font-semibold"><FaInfoCircle className="text-primary-400" /> Account setup progress</div>
              <p className="text-sm text-gray-300 mt-1">{completedCount} of {TABS.length} important areas ready</p>
            </div>
            <div className="w-full md:w-72">
              <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden" aria-label={`${completedCount} of ${TABS.length} setup areas complete`}>
                <div className="h-full bg-primary-500 transition-all" style={{ width: `${(completedCount / TABS.length) * 100}%` }} />
              </div>
            </div>
            {!steps.kyc && <button onClick={() => chooseTab("kyc")} className="inline-flex justify-center items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white px-4 py-2.5 font-medium">Start identity verification <FaArrowRight /></button>}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-[290px_minmax(0,1fr)] gap-6">
          <nav className="bg-gray-800 border border-gray-700 rounded-xl p-3 h-fit" aria-label="Account settings sections">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Choose a section</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-2">
              {TABS.map((tab, index) => {
                const Icon = tab.icon;
                const selected = activeTab === tab.id;
                return <button key={tab.id} onClick={() => chooseTab(tab.id)} aria-current={selected ? "page" : undefined} className={`text-left rounded-lg p-3 transition-colors border ${selected ? "bg-primary-900/40 border-primary-600 text-white" : "border-transparent text-gray-300 hover:bg-gray-700"}`}>
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${selected ? "bg-primary-600" : "bg-gray-700"}`}><Icon /></span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 font-medium"><span className="text-xs text-gray-500">{index + 1}</span><span className="hidden lg:inline">{tab.label}</span><span className="lg:hidden">{tab.shortLabel}</span>{steps[tab.id] && <FaCheckCircle className="text-green-400 shrink-0" title="Ready" />}</div>
                      <p className="hidden lg:block text-xs text-gray-400 mt-1">{tab.description}</p>
                    </div>
                  </div>
                </button>;
              })}
            </div>
          </nav>

          <section className="bg-gray-800 rounded-xl border border-gray-700 shadow-md overflow-hidden">
            <header className="px-5 md:px-6 py-5 border-b border-gray-700">
              <p className="text-xs font-semibold text-primary-400 uppercase tracking-wider">Current section</p>
              <h2 className="text-xl font-semibold text-white mt-1">{current.label}</h2>
              <p className="text-sm text-gray-400 mt-1">{current.description}</p>
            </header>
            <div className="p-4 md:p-6">{renderActiveTab()}</div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AccountSettings;
