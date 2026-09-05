import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import apiService from "../../../services/apiService";
import { fetchUserProfile } from "../../../redux/slices/userSlice";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCamera,
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaFileAlt,
  FaIdCard,
  FaInfoCircle,
  FaTimes,
  FaTimesCircle,
  FaUpload,
} from "react-icons/fa";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EMPTY_FILES = { frontImage: null, backImage: null, proofOfAddressImage: null, selfieImage: null };
const EMPTY_PREVIEWS = { frontImage: null, backImage: null, proofOfAddressImage: null, selfieImage: null };
const STEPS = [
  { id: 1, label: "Identity details", short: "Identity" },
  { id: 2, label: "Home address", short: "Address" },
  { id: 3, label: "Upload photos", short: "Photos" },
  { id: 4, label: "Review & submit", short: "Review" },
];

const fieldClass = (hasError) => `w-full bg-gray-900 border ${hasError ? "border-red-500 focus:ring-red-500" : "border-gray-600 focus:ring-primary-500"} text-gray-100 rounded-lg px-3 py-2.5 outline-none focus:ring-2`;

function readableSubmitError(error) {
  const status = error?.response?.status;
  const code = error?.response?.data?.code || error?.response?.data?.error?.code;
  const message = error?.response?.data?.message || error?.response?.data?.error?.message;
  if (code === "duplicate_request" || /already submitted|pending review/i.test(message || "")) return "Your documents were already received and are waiting for review. You do not need to submit them again.";
  if (status === 401) return "Your login session has expired. Sign in again, then return here to continue.";
  if (status === 413) return "One or more photos are too large. Choose images smaller than 5 MB each.";
  if (!error?.response) return "We could not reach the verification service. Check your internet connection; your form is still here, so you can try again.";
  if (/front id image/i.test(message || "")) return "The photo of the front of your identity document was not received. Please choose it again.";
  if (/selfie image/i.test(message || "")) return "Your selfie was not received. Please choose it again and make sure your face and ID are visible.";
  if (/proof of address/i.test(message || "")) return "Your proof-of-address photo was not received. Please choose the correct document again.";
  if (/required fields/i.test(message || "")) return "Some required information was not received. Return to the highlighted step and complete every field.";
  return message || "We could not submit your verification. Review the highlighted items and try again.";
}

const KycTab = () => {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const [activeStep, setActiveStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState(EMPTY_FILES);
  const [previews, setPreviews] = useState(EMPTY_PREVIEWS);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [confirmed, setConfirmed] = useState(false);
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

  const kycStatus = profile?.kycStatus || "not_submitted";
  const isVerified = Boolean(profile?.kycVerified || kycStatus === "approved");
  const needsBackImage = kycData.documentType !== "passport";

  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
      return;
    }
    setKycData((previous) => ({
      ...previous,
      dateOfBirth: previous.dateOfBirth || (profile.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().slice(0, 10) : ""),
      street: previous.street || profile.address?.street || "",
      city: previous.city || profile.address?.city || "",
      state: previous.state || profile.address?.state || "",
      postalCode: previous.postalCode || profile.address?.postalCode || "",
      country: previous.country || profile.address?.country || profile.country || "",
    }));
  }, [dispatch, profile]);

  const updateField = (field, value) => {
    setKycData((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
    setSubmitError("");
  };

  const validateStep = (step) => {
    const nextErrors = {};
    if (step === 1) {
      if (!kycData.documentNumber.trim()) nextErrors.documentNumber = "Enter the number exactly as it appears on your document.";
      else if (kycData.documentNumber.trim().length < 4) nextErrors.documentNumber = "This document number looks too short. Check it and try again.";
      if (!kycData.countryOfIssue.trim()) nextErrors.countryOfIssue = "Enter the country that issued your document.";
      if (!kycData.dateOfBirth) nextErrors.dateOfBirth = "Select your date of birth.";
      else if (new Date(kycData.dateOfBirth) >= new Date()) nextErrors.dateOfBirth = "Your date of birth must be in the past.";
    }
    if (step === 2) {
      [["street", "Enter the full street address shown on your proof of address."], ["city", "Enter your city or town."], ["state", "Enter your state, province, or region."], ["postalCode", "Enter your postal or ZIP code."], ["country", "Enter your country of residence."]].forEach(([field, message]) => {
        if (!kycData[field].trim()) nextErrors[field] = message;
      });
    }
    if (step === 3) {
      if (!files.frontImage) nextErrors.frontImage = "Add a clear photo of the front or photo page.";
      if (needsBackImage && !files.backImage) nextErrors.backImage = "This document has two sides. Add a photo of the back.";
      if (!files.proofOfAddressImage) nextErrors.proofOfAddressImage = "Add a recent proof-of-address document.";
      if (!files.selfieImage) nextErrors.selfieImage = "Add a selfie showing your face and the same identity document.";
    }
    if (step === 4 && !confirmed) nextErrors.confirmed = "Confirm that the details and images belong to you and are accurate.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const goNext = () => {
    if (!validateStep(activeStep)) return;
    setActiveStep((step) => Math.min(4, step + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileChange = (event) => {
    const { name, files: selectedFiles } = event.target;
    const file = selectedFiles?.[0];
    if (!file) return;
    let message = "";
    if (!ACCEPTED_TYPES.includes(file.type)) message = "Choose a JPG, PNG, or WEBP image. PDF and HEIC files are not accepted.";
    else if (file.size > MAX_FILE_SIZE) message = `This image is ${(file.size / 1024 / 1024).toFixed(1)} MB. Choose one smaller than 5 MB.`;
    else if (file.size < 20 * 1024) message = "This image file is unusually small and may be unreadable. Choose the original photo.";
    if (message) {
      setErrors((previous) => ({ ...previous, [name]: message }));
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const image = new Image();
      image.onload = () => {
        if (Math.min(image.width, image.height) < 400 || Math.max(image.width, image.height) < 600) {
          setErrors((previous) => ({ ...previous, [name]: `This photo is only ${image.width}×${image.height}px and may be rejected. Use a clearer image at least 600×400px.` }));
          event.target.value = "";
          return;
        }
        setFiles((previous) => ({ ...previous, [name]: file }));
        setPreviews((previous) => ({ ...previous, [name]: reader.result }));
        setErrors((previous) => ({ ...previous, [name]: "" }));
      };
      image.onerror = () => setErrors((previous) => ({ ...previous, [name]: "We could not read this image. Choose a different JPG, PNG, or WEBP file." }));
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const removeFile = (name) => {
    setFiles((previous) => ({ ...previous, [name]: null }));
    setPreviews((previous) => ({ ...previous, [name]: null }));
    setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateStep(4)) return;
    for (const step of [1, 2, 3]) {
      if (!validateStep(step)) {
        setActiveStep(step);
        setSubmitError(`Please complete step ${step} before submitting.`);
        return;
      }
    }
    const formData = new FormData();
    Object.entries(kycData).forEach(([key, value]) => formData.append(key, value.trim ? value.trim() : value));
    Object.entries(files).forEach(([key, value]) => { if (value) formData.append(key, value); });
    setLoading(true);
    setUploadStatus("");
    setSubmitError("");
    try {
      await apiService.uploadKYC(formData);
      setUploadStatus("success");
      setFiles(EMPTY_FILES);
      setPreviews(EMPTY_PREVIEWS);
      setTimeout(() => dispatch(fetchUserProfile()), 500);
    } catch (error) {
      console.error("KYC upload error:", error);
      setUploadStatus("error");
      setSubmitError(readableSubmitError(error));
    } finally {
      setLoading(false);
    }
  };

  const documentLabel = { passport: "Passport", national_id: "National ID", drivers_license: "Driver's licence" }[kycData.documentType];
  const proofLabel = { utility_bill: "Utility bill", bank_statement: "Bank statement", government_letter: "Government letter" }[kycData.proofOfAddressType];
  const uploadedCount = [files.frontImage, files.proofOfAddressImage, files.selfieImage, needsBackImage ? files.backImage : true].filter(Boolean).length;
  const requiredUploadCount = needsBackImage ? 4 : 3;

  const statusBadge = useMemo(() => {
    if (isVerified) return <span className="inline-flex items-center gap-2 px-3 py-2 bg-green-900/30 border border-green-500 rounded-lg text-green-400 font-medium"><FaCheckCircle /> Verified</span>;
    if (kycStatus === "pending") return <span className="inline-flex items-center gap-2 px-3 py-2 bg-yellow-900/30 border border-yellow-500 rounded-lg text-yellow-400 font-medium"><FaClock /> Under review</span>;
    if (kycStatus === "rejected") return <span className="inline-flex items-center gap-2 px-3 py-2 bg-red-900/30 border border-red-500 rounded-lg text-red-400 font-medium"><FaTimesCircle /> Changes required</span>;
    return <span className="inline-flex items-center gap-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 font-medium"><FaClock /> Not submitted</span>;
  }, [isVerified, kycStatus]);

  if (isVerified || kycStatus === "pending") {
    return <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h2 className="text-xl font-bold text-white">Identity verification</h2><p className="text-gray-400 mt-1">Your current verification status.</p></div>{statusBadge}</div>
      <div className={`${isVerified ? "bg-green-900/20 border-green-500/50" : "bg-yellow-900/20 border-yellow-500/50"} border rounded-xl p-7 text-center`}>
        {isVerified ? <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" /> : <FaClock className="text-yellow-500 text-5xl mx-auto mb-4" />}
        <h3 className={`text-xl font-bold ${isVerified ? "text-green-400" : "text-yellow-400"}`}>{isVerified ? "Your identity is verified" : "Your documents are being reviewed"}</h3>
        <p className="text-gray-300 mt-2">{isVerified ? "No further action is needed." : "Please do not submit again. You will be notified when the review is complete or if a clearer document is needed."}</p>
      </div>
    </div>;
  }

  const ErrorText = ({ name }) => errors[name] ? <p className="text-sm text-red-400 mt-1 flex items-start gap-2"><FaExclamationTriangle className="mt-0.5 shrink-0" />{errors[name]}</p> : null;
  const UploadCard = ({ name, title, help, icon: Icon, required = true }) => <div className={`rounded-xl border p-4 ${errors[name] ? "border-red-500 bg-red-950/10" : files[name] ? "border-green-600 bg-green-950/10" : "border-gray-600 bg-gray-900/40"}`}>
    <div className="flex items-start justify-between gap-3"><div className="flex gap-3"><span className="w-10 h-10 rounded-lg bg-primary-900/50 text-primary-400 flex items-center justify-center shrink-0"><Icon /></span><div><h4 className="font-semibold text-white">{title} {required && <span className="text-red-400">*</span>}</h4><p className="text-sm text-gray-400 mt-1">{help}</p></div></div>{files[name] && <FaCheckCircle className="text-green-400 mt-1" />}</div>
    {previews[name] && <div className="relative mt-4 w-fit"><img src={previews[name]} alt={`${title} preview`} className="h-40 max-w-full object-contain rounded-lg border border-gray-600 bg-black" /><button type="button" onClick={() => removeFile(name)} aria-label={`Remove ${title}`} className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center"><FaTimes /></button></div>}
    <label className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 text-sm font-semibold"><FaUpload />{files[name] ? "Choose a different photo" : "Choose photo"}<input type="file" name={name} accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="sr-only" /></label>
    {files[name] && <p className="text-xs text-green-400 mt-2">{files[name].name} · {(files[name].size / 1024 / 1024).toFixed(1)} MB</p>}<ErrorText name={name} />
  </div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"><div><h2 className="text-xl font-bold text-white">Verify your identity</h2><p className="text-gray-400 mt-1">Complete one small step at a time. You can review everything before sending.</p></div>{statusBadge}</div>

      {kycStatus === "rejected" && <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-4"><h3 className="font-semibold text-red-300 flex items-center gap-2"><FaExclamationTriangle />Your previous submission needs changes</h3><p className="text-gray-200 text-sm mt-2">{profile?.kycNotes || "Please check every detail and replace any unclear or incorrect document before resubmitting."}</p></div>}

      <div className="grid grid-cols-4 gap-2" aria-label="Verification progress">
        {STEPS.map((step) => <button key={step.id} type="button" onClick={() => step.id < activeStep && setActiveStep(step.id)} className={`rounded-lg p-2 md:p-3 text-center border transition-colors ${activeStep === step.id ? "border-primary-500 bg-primary-900/40 text-white" : step.id < activeStep ? "border-green-700 bg-green-900/20 text-green-300" : "border-gray-700 text-gray-500"}`}><span className="mx-auto w-7 h-7 rounded-full border border-current flex items-center justify-center text-xs font-bold">{step.id < activeStep ? <FaCheck /> : step.id}</span><span className="block text-xs md:text-sm font-medium mt-1"><span className="hidden sm:inline">{step.label}</span><span className="sm:hidden">{step.short}</span></span></button>)}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {activeStep === 1 && <section className="space-y-5">
          <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4"><h3 className="font-semibold text-blue-300 flex items-center gap-2"><FaInfoCircle />Use one valid government-issued document</h3><ul className="text-sm text-gray-300 mt-2 space-y-1 list-disc pl-5"><li>It must belong to you and must not be expired.</li><li>Your name and date of birth must match your account.</li><li>Enter the document number exactly, including letters.</li></ul></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm font-medium text-gray-300">Document type *<select value={kycData.documentType} onChange={(event) => updateField("documentType", event.target.value)} className={`${fieldClass(false)} mt-1`}><option value="passport">Passport</option><option value="national_id">National ID</option><option value="drivers_license">Driver's licence</option></select></label>
            <label className="text-sm font-medium text-gray-300">Document number *<input value={kycData.documentNumber} onChange={(event) => updateField("documentNumber", event.target.value.toUpperCase())} className={`${fieldClass(errors.documentNumber)} mt-1`} placeholder="Exactly as printed" autoComplete="off" /><ErrorText name="documentNumber" /></label>
            <label className="text-sm font-medium text-gray-300">Country that issued it *<input value={kycData.countryOfIssue} onChange={(event) => updateField("countryOfIssue", event.target.value)} className={`${fieldClass(errors.countryOfIssue)} mt-1`} placeholder="For example: Netherlands" /><ErrorText name="countryOfIssue" /></label>
            <label className="text-sm font-medium text-gray-300">Date of birth *<input type="date" value={kycData.dateOfBirth} max={new Date().toISOString().slice(0, 10)} onChange={(event) => updateField("dateOfBirth", event.target.value)} className={`${fieldClass(errors.dateOfBirth)} mt-1`} /><ErrorText name="dateOfBirth" /></label>
          </div>
        </section>}

        {activeStep === 2 && <section className="space-y-5">
          <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4"><h3 className="font-semibold text-blue-300 flex items-center gap-2"><FaFileAlt />Choose a recent proof of address</h3><p className="text-sm text-gray-300 mt-2">Use a full-page document showing your name, this residential address, the issuer, and a recent date. Screenshots cropped around one line are usually not enough.</p></div>
          <label className="block text-sm font-medium text-gray-300">Proof-of-address document *<select value={kycData.proofOfAddressType} onChange={(event) => updateField("proofOfAddressType", event.target.value)} className={`${fieldClass(false)} mt-1`}><option value="utility_bill">Utility bill</option><option value="bank_statement">Bank statement</option><option value="government_letter">Government letter</option></select></label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-sm font-medium text-gray-300 md:col-span-2">Street address *<input value={kycData.street} onChange={(event) => updateField("street", event.target.value)} className={`${fieldClass(errors.street)} mt-1`} placeholder="House number and street name" /><ErrorText name="street" /></label>
            <label className="text-sm font-medium text-gray-300">City or town *<input value={kycData.city} onChange={(event) => updateField("city", event.target.value)} className={`${fieldClass(errors.city)} mt-1`} /><ErrorText name="city" /></label>
            <label className="text-sm font-medium text-gray-300">State, province, or region *<input value={kycData.state} onChange={(event) => updateField("state", event.target.value)} className={`${fieldClass(errors.state)} mt-1`} /><ErrorText name="state" /></label>
            <label className="text-sm font-medium text-gray-300">Postal or ZIP code *<input value={kycData.postalCode} onChange={(event) => updateField("postalCode", event.target.value)} className={`${fieldClass(errors.postalCode)} mt-1`} /><ErrorText name="postalCode" /></label>
            <label className="text-sm font-medium text-gray-300">Country of residence *<input value={kycData.country} onChange={(event) => updateField("country", event.target.value)} className={`${fieldClass(errors.country)} mt-1`} /><ErrorText name="country" /></label>
          </div>
        </section>}

        {activeStep === 3 && <section className="space-y-5">
          <div className="bg-blue-900/20 border border-blue-700 rounded-xl p-4"><h3 className="font-semibold text-blue-300 flex items-center gap-2"><FaCamera />Photo checklist</h3><p className="text-sm text-gray-300 mt-2">Use original colour photos in JPG, PNG, or WEBP format, 600×400px or larger, up to 5 MB. Avoid glare, blur, shadows, screenshots, filters, and cropped corners.</p></div>
          <div className="flex items-center justify-between text-sm"><span className="text-gray-300">Required photos added</span><span className={uploadedCount === requiredUploadCount ? "text-green-400 font-semibold" : "text-gray-400"}>{uploadedCount} of {requiredUploadCount}</span></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <UploadCard name="frontImage" title={kycData.documentType === "passport" ? "Passport photo page" : `Front of ${documentLabel}`} help="Show the entire document, sharp and readable, with all corners visible." icon={FaIdCard} />
            {needsBackImage && <UploadCard name="backImage" title={`Back of ${documentLabel}`} help="Use the same document and show the complete back side." icon={FaIdCard} />}
            <UploadCard name="proofOfAddressImage" title={proofLabel} help="Show the full page with your name, address, issuer, and date visible." icon={FaFileAlt} />
            <UploadCard name="selfieImage" title="Selfie holding your ID" help="Your face, the same ID, and its photo must all be visible. Remove hats and sunglasses." icon={FaCamera} />
          </div>
        </section>}

        {activeStep === 4 && <section className="space-y-5">
          <div><h3 className="text-lg font-semibold text-white">Check before you send</h3><p className="text-sm text-gray-400 mt-1">Incorrect details or unreadable photos can delay your review.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-4"><h4 className="font-semibold text-white">Identity</h4><dl className="mt-3 text-sm space-y-2"><div className="flex justify-between gap-4"><dt className="text-gray-400">Document</dt><dd className="text-gray-200 text-right">{documentLabel}</dd></div><div className="flex justify-between gap-4"><dt className="text-gray-400">Number</dt><dd className="text-gray-200 text-right">{kycData.documentNumber}</dd></div><div className="flex justify-between gap-4"><dt className="text-gray-400">Issued by</dt><dd className="text-gray-200 text-right">{kycData.countryOfIssue}</dd></div><div className="flex justify-between gap-4"><dt className="text-gray-400">Date of birth</dt><dd className="text-gray-200 text-right">{kycData.dateOfBirth}</dd></div></dl><button type="button" onClick={() => setActiveStep(1)} className="text-primary-400 text-sm mt-4 hover:text-primary-300">Edit identity details</button></div>
            <div className="rounded-xl border border-gray-700 bg-gray-900/50 p-4"><h4 className="font-semibold text-white">Address & files</h4><p className="text-sm text-gray-300 mt-3">{kycData.street}, {kycData.city}, {kycData.state}, {kycData.postalCode}, {kycData.country}</p><p className="text-sm text-gray-400 mt-2">{requiredUploadCount} required photos ready · {proofLabel}</p><div className="flex gap-4"><button type="button" onClick={() => setActiveStep(2)} className="text-primary-400 text-sm mt-4 hover:text-primary-300">Edit address</button><button type="button" onClick={() => setActiveStep(3)} className="text-primary-400 text-sm mt-4 hover:text-primary-300">Check photos</button></div></div>
          </div>
          <label className={`flex items-start gap-3 rounded-xl border p-4 cursor-pointer ${errors.confirmed ? "border-red-500 bg-red-950/10" : "border-gray-600 bg-gray-900/40"}`}><input type="checkbox" checked={confirmed} onChange={(event) => { setConfirmed(event.target.checked); setErrors((previous) => ({ ...previous, confirmed: "" })); }} className="mt-1 w-4 h-4 accent-primary-600" /><span className="text-sm text-gray-300">I confirm that this information is accurate, the documents belong to me, and the photos are clear and unedited.</span></label><ErrorText name="confirmed" />
          {submitError && <div role="alert" className="bg-red-900/30 border border-red-500 rounded-xl p-4 text-red-200"><h4 className="font-semibold flex items-center gap-2"><FaExclamationTriangle />We could not submit yet</h4><p className="text-sm mt-1">{submitError}</p></div>}
          {uploadStatus === "success" && <div role="status" className="bg-green-900/30 border border-green-500 rounded-xl p-4 text-green-300"><FaCheckCircle className="inline mr-2" />Your documents were received. They are now waiting for review.</div>}
        </section>}

        <div className="mt-7 pt-5 border-t border-gray-700 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
          <button type="button" onClick={() => setActiveStep((step) => Math.max(1, step - 1))} disabled={activeStep === 1 || loading} className="inline-flex justify-center items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 disabled:opacity-40"><FaArrowLeft /> Back</button>
          {activeStep < 4 ? <button type="button" onClick={goNext} className="inline-flex justify-center items-center gap-2 px-5 py-2.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold">Continue to {STEPS[activeStep].short.toLowerCase()} <FaArrowRight /></button> : <button type="submit" disabled={loading} className="inline-flex justify-center items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-500 text-white font-semibold disabled:opacity-50">{loading ? <><span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />Sending securely…</> : <><FaUpload />Submit for verification</>}</button>}
        </div>
      </form>
    </div>
  );
};

export default KycTab;
