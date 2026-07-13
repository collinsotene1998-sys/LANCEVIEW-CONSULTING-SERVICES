/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  ArrowLeft, 
  ShieldCheck, 
  Briefcase, 
  BarChart3, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { SurplusSubmission, B2BSubmission } from '../types';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Toast } from './Toast';

interface LeadCaptureFunnelsProps {
  initialFunnel?: 'funds' | 'b2b';
  prefilledAddress?: string;
  prefilledCounty?: string;
  onFundsSubmit: (submission: SurplusSubmission) => void;
  onB2BSubmit: (submission: B2BSubmission) => void;
}

export default function LeadCaptureFunnels({
  initialFunnel = 'funds',
  prefilledAddress = '',
  prefilledCounty = '',
  onFundsSubmit,
  onB2BSubmit
}: LeadCaptureFunnelsProps) {
  const [activeTab, setActiveTab] = useState<'funds' | 'b2b'>(initialFunnel);
  
  // Funnel A (Surplus) State
  const [fundsStep, setFundsStep] = useState<number>(1);
  const [fundsData, setFundsData] = useState({
    address: prefilledAddress,
    county: prefilledCounty,
    connection: 'owner' as 'owner' | 'heir' | 'other',
    ownerName: '',
    phone: '',
    email: ''
  });
  const [fundsErrors, setFundsErrors] = useState<Record<string, string>>({});
  const [isFundsComplete, setIsFundsComplete] = useState(false);
  const [submittedFundsRecord, setSubmittedFundsRecord] = useState<SurplusSubmission | null>(null);
  const [isSubmittingFunds, setIsSubmittingFunds] = useState(false);

  // Toast state
  const [toastConfig, setToastConfig] = useState({ isVisible: false, message: '' });

  // Sync pre-fills from parent (e.g. from the property search widget)
  React.useEffect(() => {
    if (prefilledAddress) {
      setFundsData(prev => ({
        ...prev,
        address: prefilledAddress,
        county: prefilledCounty || prev.county
      }));
      setFundsStep(1); // switch back to first step to review or proceed
      setIsFundsComplete(false);
    }
  }, [prefilledAddress, prefilledCounty]);

  // Funnel B (B2B) State
  const [b2bData, setB2bData] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    portfolioSize: '1-5' as '1-5' | '6-20' | '21+',
    primaryGoal: 'section8' as 'section8' | 'contracting' | 'both',
    roadblockDescription: ''
  });
  const [b2bErrors, setB2bErrors] = useState<Record<string, string>>({});
  const [isB2BComplete, setIsB2BComplete] = useState(false);
  const [submittedB2BRecord, setSubmittedB2BRecord] = useState<B2BSubmission | null>(null);
  const [isSubmittingB2B, setIsSubmittingB2B] = useState(false);

  // --- Funnel A Logic ---
  const validateFundsStep = (step: number) => {
    const errors: Record<string, string> = {};
    if (step === 1) {
      if (!fundsData.address.trim()) errors.address = 'Property address is required';
      if (!fundsData.county.trim()) errors.county = 'County is required';
    } else if (step === 2) {
      if (!fundsData.ownerName.trim()) {
        errors.ownerName = 'Recorded owner full legal name is required';
      }
    } else if (step === 3) {
      if (!fundsData.phone.trim()) {
        errors.phone = 'Phone number is required';
      } else if (!/^\+?[0-9\s\-()]{7,15}$/.test(fundsData.phone.trim())) {
        errors.phone = 'Please enter a valid phone number';
      }
      if (!fundsData.email.trim()) {
        errors.email = 'Secure email address is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fundsData.email.trim())) {
        errors.email = 'Please enter a valid email address';
      }
    }
    setFundsErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFundsNext = () => {
    if (validateFundsStep(fundsStep)) {
      setFundsStep(prev => prev + 1);
    }
  };

  const handleFundsBack = () => {
    setFundsStep(prev => Math.max(1, prev - 1));
  };

  const handleFundsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFundsStep(3)) return;

    setIsSubmittingFunds(true);
    const caseNumber = `SF-${Math.floor(100000 + Math.random() * 900000)}`;
    const estFunds = Math.floor(15000 + Math.random() * 180000);
    const submissionId = `sub-${Date.now()}`;
    
    const newSubmission: SurplusSubmission = {
      id: submissionId,
      address: fundsData.address,
      county: fundsData.county,
      connection: fundsData.connection,
      ownerName: fundsData.ownerName,
      phone: fundsData.phone,
      email: fundsData.email,
      submittedAt: new Date().toLocaleString(),
      status: 'audit_pending',
      caseNumber,
      estimatedFunds: estFunds
    };

    try {
      await setDoc(doc(db, 'surplus_submissions', submissionId), {
        ...newSubmission,
        createdAt: serverTimestamp()
      });
      
      // Trigger automated acknowledgement email
      await fetch('/api/send-acknowledgement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fundsData.ownerName,
          email: fundsData.email,
          type: 'funds'
        }),
      });

      onFundsSubmit(newSubmission);
      setSubmittedFundsRecord(newSubmission);
      setIsFundsComplete(true);
      setToastConfig({ isVisible: true, message: 'Surplus Funds case file generated successfully.' });
    } catch (error) {
      console.error('Error saving submission:', error);
      alert('Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmittingFunds(false);
    }
  };

  const resetFundsForm = () => {
    setFundsData({
      address: '',
      county: '',
      connection: 'owner',
      ownerName: '',
      phone: '',
      email: ''
    });
    setFundsStep(1);
    setIsFundsComplete(false);
    setSubmittedFundsRecord(null);
    setFundsErrors({});
  };

  // --- Funnel B Logic ---
  const handleB2BSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!b2bData.companyName.trim()) errors.companyName = 'Company / Investor Name is required';
    if (!b2bData.contactPerson.trim()) errors.contactPerson = 'Contact Person name is required';
    if (!b2bData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(b2bData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }
    if (!b2bData.roadblockDescription.trim()) {
      errors.roadblockDescription = 'Please provide a brief description of your asset roadblock';
    }

    setB2bErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmittingB2B(true);
    const submissionId = `b2b-${Date.now()}`;
    const newB2bSubmission: B2BSubmission = {
      id: submissionId,
      companyName: b2bData.companyName,
      contactPerson: b2bData.contactPerson,
      email: b2bData.email,
      portfolioSize: b2bData.portfolioSize,
      primaryGoal: b2bData.primaryGoal,
      roadblockDescription: b2bData.roadblockDescription,
      submittedAt: new Date().toLocaleString(),
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    };

    try {
      await setDoc(doc(db, 'b2b_submissions', submissionId), {
        ...newB2bSubmission,
        createdAt: serverTimestamp()
      });
      
      // Trigger automated acknowledgement email
      await fetch('/api/send-acknowledgement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: b2bData.contactPerson,
          email: b2bData.email,
          type: 'b2b'
        }),
      });

      onB2BSubmit(newB2bSubmission);
      setSubmittedB2BRecord(newB2bSubmission);
      setIsB2BComplete(true);
      setToastConfig({ isVisible: true, message: 'B2B Portfolio Consultation booked successfully.' });
    } catch (error) {
      console.error('Error saving submission:', error);
      alert('Failed to submit brief. Please try again.');
    } finally {
      setIsSubmittingB2B(false);
    }
  };

  const resetB2BForm = () => {
    setB2bData({
      companyName: '',
      contactPerson: '',
      email: '',
      portfolioSize: '1-5',
      primaryGoal: 'section8',
      roadblockDescription: ''
    });
    setIsB2BComplete(false);
    setSubmittedB2BRecord(null);
    setB2bErrors({});
  };

  return (
    <div className="w-full max-w-4xl mx-auto" id="lead-capture-funnels">
      {/* Tab Switcher */}
      <div className="flex bg-editorial-card/40 p-1 rounded-xl border border-editorial-card/85 mb-6">
        <button
          id="btn-tab-funds"
          onClick={() => setActiveTab('funds')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg font-sans text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
            activeTab === 'funds' 
              ? 'bg-editorial-ink text-editorial-paper shadow-sm' 
              : 'text-editorial-muted hover:text-editorial-ink hover:bg-editorial-card/35'
          }`}
        >
          <ShieldCheck className="w-4.5 h-4.5" />
          <span>Surplus Funds Recovery Funnel</span>
        </button>
        <button
          id="btn-tab-b2b"
          onClick={() => setActiveTab('b2b')}
          className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-lg font-sans text-xs uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
            activeTab === 'b2b' 
              ? 'bg-editorial-ink text-editorial-paper shadow-sm' 
              : 'text-editorial-muted hover:text-editorial-ink hover:bg-editorial-card/35'
          }`}
        >
          <Building2 className="w-4.5 h-4.5" />
          <span>B2B Investor &amp; Landlord Portal</span>
        </button>
      </div>
      
      <Toast 
        message={toastConfig.message} 
        isVisible={toastConfig.isVisible} 
        onClose={() => setToastConfig(prev => ({ ...prev, isVisible: false }))} 
      />

      <AnimatePresence mode="wait">
        {activeTab === 'funds' ? (
          <motion.div
            key="funds-funnel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-editorial-paper border border-editorial-card rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden"
          >
            {/* Visual Header Decors */}
            <div className="absolute top-0 left-0 w-full h-1 bg-editorial-rust" />
            
            {!isFundsComplete ? (
              <div>
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-editorial-ink/10 pb-5">
                  <div>
                    <span className="text-[9px] font-mono text-editorial-rust font-semibold uppercase tracking-widest bg-editorial-rust/5 px-2.5 py-1 rounded border border-editorial-rust/20 inline-block mb-1.5">
                      Contingency Intake Funnel
                    </span>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-editorial-ink">
                      Surplus Funds Discovery Inquiry
                    </h3>
                  </div>
                  {/* Grid Step Indicators */}
                  <div className="flex items-center gap-2 mt-1">
                    {[1, 2, 3].map((num) => (
                      <div key={num} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-semibold border-2 transition-all duration-300 ${
                          fundsStep === num 
                            ? 'bg-editorial-rust border-editorial-rust text-white' 
                            : fundsStep > num 
                              ? 'bg-editorial-ink border-editorial-ink text-editorial-paper' 
                              : 'bg-editorial-bg border-editorial-card text-editorial-muted'
                        }`}>
                          {num}
                        </div>
                        {num < 3 && (
                          <div className={`w-8 h-0.5 transition-all duration-300 ${
                            fundsStep > num ? 'bg-editorial-rust' : 'bg-editorial-card'
                          }`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleFundsSubmit} className="space-y-6">
                  {/* Step 1: Property Identification */}
                  {fundsStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <div className="flex items-start gap-3 bg-editorial-bg border border-editorial-card p-4 rounded-xl text-xs md:text-sm text-editorial-ink leading-relaxed">
                        <MapPin className="w-5.5 h-5.5 text-editorial-rust shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-editorial-ink uppercase tracking-wider text-xs font-sans block">Step 1: Property Identification</strong>
                          <p className="mt-0.5 text-editorial-muted">
                            Identify the property that went through foreclosure or tax auction. Our forensics database checks against this precise layout boundary.
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                          Foreclosed/Sold Property Address <span className="text-editorial-rust">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            id="funds-input-address"
                            placeholder="e.g., 123 Main Street, City, State, Zip"
                            value={fundsData.address}
                            onChange={(e) => {
                              setFundsData({ ...fundsData, address: e.target.value });
                              if (fundsErrors.address) setFundsErrors({ ...fundsErrors, address: '' });
                            }}
                            className={`w-full bg-editorial-bg border text-editorial-ink placeholder:text-editorial-muted/65 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                              fundsErrors.address 
                                ? 'border-editorial-rust focus:ring-editorial-rust/20' 
                                : 'border-editorial-card focus:border-editorial-rust focus:ring-editorial-rust/20'
                            }`}
                          />
                        </div>
                        {fundsErrors.address && (
                          <p className="text-xs text-editorial-rust flex items-center gap-1.5 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {fundsErrors.address}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                          What County is the Property Located In? (If known) <span className="text-editorial-rust">*</span>
                        </label>
                        <input
                           type="text"
                           required
                           id="funds-input-county"
                           placeholder="e.g., Cook County, Orange County, Fulton County..."
                           value={fundsData.county}
                           onChange={(e) => {
                             setFundsData({ ...fundsData, county: e.target.value });
                             if (fundsErrors.county) setFundsErrors({ ...fundsErrors, county: '' });
                           }}
                           className={`w-full bg-editorial-bg border text-editorial-ink placeholder:text-editorial-muted/65 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                             fundsErrors.county 
                               ? 'border-editorial-rust focus:ring-editorial-rust/20' 
                               : 'border-editorial-card focus:border-editorial-rust focus:ring-editorial-rust/20'
                           }`}
                        />
                        {fundsErrors.county && (
                          <p className="text-xs text-editorial-rust flex items-center gap-1.5 mt-1">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {fundsErrors.county}
                          </p>
                        )}
                      </div>

                      <div className="pt-4 border-t border-editorial-ink/10 flex justify-end">
                        <button
                          type="button"
                          id="btn-funds-step1-next"
                          onClick={handleFundsNext}
                          className="flex items-center gap-2 bg-editorial-ink hover:bg-editorial-rust text-editorial-paper px-5 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                        >
                          <span>Proceed to Participant Ownership</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Connection & Claimant Details */}
                  {fundsStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <div className="flex items-start gap-3 bg-editorial-bg border border-editorial-card p-4 rounded-xl text-xs md:text-sm text-editorial-ink leading-relaxed">
                        <User className="w-5.5 h-5.5 text-editorial-rust shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-editorial-ink uppercase tracking-wider text-xs font-sans block">Step 2: Ownership &amp; Claimant Rights</strong>
                          <p className="mt-0.5 text-editorial-muted">
                            Provide records pertaining to the legal title holders. Unclaimed money belongs strictly to the original record holders or their bloodline heirs.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                            Your Connection to the Property <span className="text-editorial-rust">*</span>
                          </label>
                          <select
                            id="funds-select-connection"
                            value={fundsData.connection}
                            onChange={(e) => setFundsData({ ...fundsData, connection: e.target.value as any })}
                            className="w-full bg-editorial-bg border border-editorial-card text-editorial-ink rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-editorial-rust focus:ring-2 focus:ring-editorial-rust/20 transition-all cursor-pointer font-sans"
                          >
                            <option value="owner">I am the Original Registered Owner</option>
                            <option value="heir">I am an Heir / Family Member</option>
                            <option value="other">Other / Representatives / Third Party</option>
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                            Full Legal Name of Owner at Time of Sale <span className="text-editorial-rust">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            id="funds-input-ownerName"
                            placeholder="John Doe or Jane Smith Corporation"
                            value={fundsData.ownerName}
                            onChange={(e) => {
                              setFundsData({ ...fundsData, ownerName: e.target.value });
                              if (fundsErrors.ownerName) setFundsErrors({ ...fundsErrors, ownerName: '' });
                            }}
                            className={`w-full bg-editorial-bg border text-editorial-ink placeholder:text-editorial-muted/65 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                              fundsErrors.ownerName 
                                ? 'border-editorial-rust focus:ring-editorial-rust/20' 
                                : 'border-editorial-card focus:border-editorial-rust focus:ring-editorial-rust/20'
                            }`}
                          />
                          {fundsErrors.ownerName && (
                            <p className="text-xs text-editorial-rust flex items-center gap-1.5 mt-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {fundsErrors.ownerName}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 border-t border-editorial-ink/10 flex justify-between gap-4">
                        <button
                          type="button"
                          id="btn-funds-step2-back"
                          onClick={handleFundsBack}
                          className="flex items-center gap-2 bg-editorial-bg hover:bg-editorial-card border border-editorial-card text-editorial-muted px-5 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back</span>
                        </button>
                        <button
                          type="button"
                          id="btn-funds-step2-next"
                          onClick={handleFundsNext}
                          className="flex items-center gap-2 bg-editorial-ink hover:bg-editorial-rust text-editorial-paper px-5 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                        >
                          <span>Proceed to Contact Authorization</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Fast-Track Contact Authorization */}
                  {fundsStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <div className="flex items-start gap-3 bg-purple-50 border border-purple-200 p-4 rounded-xl text-xs md:text-sm text-purple-800 leading-relaxed">
                        <ShieldCheck className="w-5.5 h-5.5 text-purple-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-purple-900 uppercase tracking-wider text-xs font-sans block">Step 3: Secure Legal Audit Request</strong>
                          <p className="mt-0.5 text-purple-800">
                            We work on a strict contingency basis. There are zero retainers, zero deposits, and no out-of-pocket costs whatsoever. Provide your communication details below.
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                            Preferred Phone Number <span className="text-editorial-rust">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-editorial-muted">
                              <Phone className="w-4 h-4" />
                            </span>
                            <input
                              type="tel"
                              required
                              id="funds-input-phone"
                              placeholder="(555) 555-5555"
                              value={fundsData.phone}
                              onChange={(e) => {
                                setFundsData({ ...fundsData, phone: e.target.value });
                                if (fundsErrors.phone) setFundsErrors({ ...fundsErrors, phone: '' });
                              }}
                              className={`w-full bg-editorial-bg border text-editorial-ink placeholder:text-editorial-muted/65 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                                fundsErrors.phone 
                                  ? 'border-editorial-rust focus:ring-editorial-rust/20' 
                                  : 'border-editorial-card focus:border-editorial-rust focus:ring-editorial-rust/20'
                              }`}
                            />
                          </div>
                          {fundsErrors.phone && (
                            <p className="text-xs text-editorial-rust flex items-center gap-1.5 mt-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {fundsErrors.phone}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                            Secure Email Address <span className="text-editorial-rust">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-editorial-muted">
                              <Mail className="w-4 h-4" />
                            </span>
                            <input
                              type="email"
                              required
                              id="funds-input-email"
                              placeholder="name@example.com"
                              value={fundsData.email}
                              onChange={(e) => {
                                setFundsData({ ...fundsData, email: e.target.value });
                                if (fundsErrors.email) setFundsErrors({ ...fundsErrors, email: '' });
                              }}
                              className={`w-full bg-editorial-bg border text-editorial-ink placeholder:text-editorial-muted/65 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                                fundsErrors.email 
                                  ? 'border-editorial-rust focus:ring-editorial-rust/20' 
                                  : 'border-editorial-card focus:border-editorial-rust focus:ring-editorial-rust/20'
                              }`}
                            />
                          </div>
                          {fundsErrors.email && (
                            <p className="text-xs text-editorial-rust flex items-center gap-1.5 mt-1">
                              <AlertCircle className="w-3.5 h-3.5" />
                              {fundsErrors.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-3.5 bg-editorial-bg rounded-xl border border-editorial-card text-xs text-editorial-muted leading-normal">
                        🔒 <strong className="text-editorial-ink">Intake Policy:</strong> Under contingency, our internal legal team will audit public land, mortgage, tax, and foreclosure dockets immediately. If valid assets exist, we prepare motion documents. We absorb 100% of outlays.
                      </div>

                      <div className="pt-4 border-t border-editorial-ink/10 flex justify-between gap-4">
                        <button
                          type="button"
                          id="btn-funds-step3-back"
                          onClick={handleFundsBack}
                          className="flex items-center gap-2 bg-editorial-bg hover:bg-editorial-card border border-editorial-card text-editorial-muted px-5 py-3 rounded-md text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                        >
                          <ArrowLeft className="w-4 h-4" />
                          <span>Back</span>
                        </button>
                        <button
                          type="submit"
                          id="btn-funds-step3-submit"
                          className="flex items-center gap-2 bg-editorial-rust hover:bg-editorial-ink text-white px-6 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                        >
                          <span>Submit Claim Review Request</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </div>
            ) : (
              // Funnel A Success Notification Block
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6 animate-fade-in"
              >
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 bg-purple-50 border border-purple-200 text-purple-600 rounded-full flex items-center justify-center shadow-inner relative z-10"
                  >
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="absolute inset-0 bg-purple-200 rounded-full z-0"
                  />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-editorial-ink">
                    Claim Audit File Created Successfully!
                  </h3>
                  <p className="text-editorial-muted text-sm max-w-lg mx-auto leading-relaxed">
                    Our forensic database team has received your property inquiry. A case folder has been generated and queued for auditing review by our bonded legal counsel.
                  </p>
                </div>

                {submittedFundsRecord && (
                  <div className="max-w-md mx-auto bg-editorial-bg rounded-xl p-5 border border-editorial-card text-left space-y-3.5">
                    <div className="flex justify-between items-center pb-2 border-b border-editorial-card/80">
                      <span className="text-[10px] font-mono font-bold text-editorial-muted">CASE NUMBER:</span>
                      <span className="text-xs font-mono text-editorial-rust font-bold bg-editorial-rust/5 px-2 py-0.5 rounded border border-editorial-rust/20">
                        {submittedFundsRecord.caseNumber}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-editorial-ink">
                      <div>
                        <span className="text-editorial-muted select-none">Property Adr: </span>
                        <strong className="font-semibold">{submittedFundsRecord.address}</strong>
                      </div>
                      <div>
                        <span className="text-editorial-muted select-none">County Area: </span>
                        <span>{submittedFundsRecord.county}</span>
                      </div>
                      <div>
                        <span className="text-editorial-muted select-none">Owner of Record: </span>
                        <span>{submittedFundsRecord.ownerName}</span>
                      </div>
                      <div>
                        <span className="text-editorial-muted select-none">Estimated Recoverable: </span>
                        <strong className="text-purple-700 text-sm font-semibold">
                          ${submittedFundsRecord.estimatedFunds.toLocaleString()} (est.)
                        </strong>
                      </div>
                    </div>

                    <div className="mt-2 text-[11px] text-editorial-muted leading-normal bg-editorial-paper p-2.5 rounded border border-editorial-card/60">
                      💡 You can search this case number in the <a href="#case-tracker" className="text-editorial-rust font-semibold hover:underline">Auditing Tracker Toolbar</a> below to check actual progression statuses in real-time.
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-center gap-4">
                  <button
                    onClick={resetFundsForm}
                    className="bg-editorial-bg border border-editorial-card hover:bg-editorial-card/40 text-editorial-ink text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition cursor-pointer"
                  >
                    Submit Another Inquiry
                  </button>
                  <a
                    href="#case-tracker"
                    className="bg-editorial-ink hover:bg-editorial-rust text-editorial-paper text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition"
                  >
                    Check Audit Status
                  </a>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          // Funnel B: B2B Lead Form
          <motion.div
            key="b2b-funnel"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="bg-editorial-paper border border-editorial-card rounded-2xl p-6 md:p-8 shadow-sm relative overflow-hidden"
          >
            {/* Visual Header Decors */}
            <div className="absolute top-0 left-0 w-full h-1 bg-editorial-rust" />

            {!isB2BComplete ? (
              <div>
                <div className="mb-6 border-b border-editorial-ink/10 pb-5">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-widest bg-editorial-card/40 px-2.5 py-1 rounded border border-editorial-card/60 inline-block mb-1.5">
                    Institutional Intake
                  </span>
                  <h3 className="text-xl md:text-2xl font-serif font-bold text-editorial-ink flex items-center gap-2">
                    <Building2 className="w-5 md:w-6 text-editorial-rust shrink-0" />
                    B2B Investor &amp; Landlord Consultation Brief
                  </h3>
                </div>

                <form onSubmit={handleB2BSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                        Investor/Company Name <span className="text-editorial-rust">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        id="b2b-company"
                        placeholder="e.g., Summit Holdings LLC"
                        value={b2bData.companyName}
                        onChange={(e) => {
                          setB2bData({ ...b2bData, companyName: e.target.value });
                          if (b2bErrors.companyName) setB2bErrors({ ...b2bErrors, companyName: '' });
                        }}
                        className={`w-full bg-editorial-bg border text-editorial-ink placeholder:text-editorial-muted/65 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                          b2bErrors.companyName 
                            ? 'border-editorial-rust focus:ring-editorial-rust/20' 
                            : 'border-editorial-card focus:border-editorial-rust focus:ring-editorial-rust/20'
                        }`}
                      />
                      {b2bErrors.companyName && (
                        <p className="text-xs text-editorial-rust flex items-center gap-1.5 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {b2bErrors.companyName}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                        Contact Person <span className="text-editorial-rust">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        id="b2b-contact"
                        placeholder="Marcus Vance"
                        value={b2bData.contactPerson}
                        onChange={(e) => {
                          setB2bData({ ...b2bData, contactPerson: e.target.value });
                          if (b2bErrors.contactPerson) setB2bErrors({ ...b2bErrors, contactPerson: '' });
                        }}
                        className={`w-full bg-editorial-bg border text-editorial-ink placeholder:text-editorial-muted/65 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                          b2bErrors.contactPerson 
                            ? 'border-editorial-rust focus:ring-editorial-rust/20' 
                            : 'border-editorial-card focus:border-editorial-rust focus:ring-editorial-rust/20'
                        }`}
                      />
                      {b2bErrors.contactPerson && (
                        <p className="text-xs text-editorial-rust flex items-center gap-1.5 mt-1">
                          <AlertCircle className="w-3.5 h-3.5" />
                          {b2bErrors.contactPerson}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                      Secure Email Address <span className="text-editorial-rust">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-editorial-muted">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        required
                        id="b2b-email"
                        placeholder="marcus@summitholdings.com"
                        value={b2bData.email}
                        onChange={(e) => {
                          setB2bData({ ...b2bData, email: e.target.value });
                          if (b2bErrors.email) setB2bErrors({ ...b2bErrors, email: '' });
                        }}
                        className={`w-full bg-editorial-bg border text-editorial-ink placeholder:text-editorial-muted/65 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 transition-all ${
                          b2bErrors.email 
                            ? 'border-editorial-rust focus:ring-editorial-rust/20' 
                            : 'border-editorial-card focus:border-editorial-rust focus:ring-editorial-rust/20'
                        }`}
                      />
                    </div>
                    {b2bErrors.email && (
                      <p className="text-xs text-editorial-rust flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {b2bErrors.email}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                        Portfolio Size <span className="text-editorial-rust">*</span>
                      </label>
                      <select
                        id="b2b-portfolio"
                        value={b2bData.portfolioSize}
                        onChange={(e) => setB2bData({ ...b2bData, portfolioSize: e.target.value as any })}
                        className="w-full bg-editorial-bg border border-editorial-card text-editorial-ink rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-editorial-rust focus:ring-2 focus:ring-editorial-rust/20 transition-all cursor-pointer font-sans"
                      >
                        <option value="1-5">1 - 5 units (Local Individual)</option>
                        <option value="6-20">6 - 20 units (Regional Growth)</option>
                        <option value="21+">21+ units (Institutional Scale)</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                        Primary Goal Needed <span className="text-editorial-rust">*</span>
                      </label>
                      <select
                        id="b2b-goal"
                        value={b2bData.primaryGoal}
                        onChange={(e) => setB2bData({ ...b2bData, primaryGoal: e.target.value as any })}
                        className="w-full bg-editorial-bg border border-editorial-card text-editorial-ink rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-editorial-rust focus:ring-2 focus:ring-editorial-rust/10 transition-all cursor-pointer font-sans"
                      >
                        <option value="section8">Section 8 Housing Business Consultation</option>
                        <option value="contracting">Real Estate Contracting &amp; HQS Inspections</option>
                        <option value="both">Both Services (Complete Portfolio Package)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-xs uppercase tracking-wider font-bold text-editorial-muted">
                      Briefly describe your current asset roadblock or contracting timeline <span className="text-editorial-rust">*</span>
                    </label>
                    <textarea
                      required
                      id="b2b-roadblock"
                      rows={4}
                      placeholder="Provide context here so our principal consultant can review it... (e.g., pending HUD inspections, tenant onboarding delay, property rehab specifications)"
                      value={b2bData.roadblockDescription}
                      onChange={(e) => {
                        setB2bData({ ...b2bData, roadblockDescription: e.target.value });
                        if (b2bErrors.roadblockDescription) setB2bErrors({ ...b2bErrors, roadblockDescription: '' });
                      }}
                      className={`w-full bg-editorial-bg border text-editorial-ink placeholder:text-editorial-muted/65 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 resize-none transition-all ${
                        b2bErrors.roadblockDescription 
                          ? 'border-editorial-rust focus:ring-editorial-rust/20' 
                          : 'border-editorial-card focus:border-editorial-rust focus:ring-editorial-rust/20'
                      }`}
                    />
                    {b2bErrors.roadblockDescription && (
                      <p className="text-xs text-editorial-rust flex items-center gap-1.5 mt-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {b2bErrors.roadblockDescription}
                      </p>
                    )}
                  </div>

                  <div className="pt-4 border-t border-editorial-ink/10 flex justify-end">
                    <button
                      type="submit"
                      id="btn-b2b-submit"
                      className="flex items-center gap-2 bg-editorial-rust hover:bg-editorial-ink text-white px-6 py-3.5 rounded-md text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer"
                    >
                      <Calendar className="w-4 h-4 text-white" />
                      <span>Book Strategic Portfolio Discovery Session →</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              // Funnel B Success Block
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8 space-y-6 animate-fade-in"
              >
                <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                    className="w-16 h-16 bg-purple-50 border border-purple-200 text-purple-650 rounded-full flex items-center justify-center shadow-inner relative z-10"
                  >
                    <CheckCircle2 className="w-8 h-8 text-purple-600" />
                  </motion.div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0.8 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                    className="absolute inset-0 bg-purple-200 rounded-full z-0"
                  />
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-serif font-bold text-editorial-ink">
                    Brief Submitted &amp; Session Reserved!
                  </h3>
                  <p className="text-editorial-muted text-sm max-w-lg mx-auto leading-relaxed">
                    Thank you, <strong className="text-editorial-ink font-semibold">{submittedB2BRecord?.contactPerson}</strong>. Your portfolio consultation brief for <span className="text-editorial-ink font-semibold">{submittedB2BRecord?.companyName}</span> has been processed. A principal consultant has been notified and scheduled.
                  </p>
                </div>

                {submittedB2BRecord && (
                  <div className="max-w-md mx-auto bg-editorial-bg rounded-xl p-5 border border-editorial-card text-left space-y-3.5">
                    <div className="flex justify-between items-center pb-2 border-b border-editorial-card/80">
                      <span className="text-[10px] font-mono font-bold text-editorial-muted">SERVICE VECTOR:</span>
                      <strong className="text-xs uppercase text-editorial-rust tracking-wide font-mono">
                        {submittedB2BRecord.primaryGoal === 'section8' 
                          ? 'Section 8 Consulting' 
                          : submittedB2BRecord.primaryGoal === 'contracting' 
                            ? 'HQS Contracting rehab' 
                            : 'Combined Portfolio Support'}
                      </strong>
                    </div>

                    <div className="space-y-1.5 text-xs text-editorial-ink">
                      <div>
                        <span className="text-editorial-muted">Representative:</span>{' '}
                        <strong>{submittedB2BRecord.contactPerson}</strong>
                      </div>
                      <div>
                        <span className="text-editorial-muted">Portfolio Size:</span>{' '}
                        <span>{submittedB2BRecord.portfolioSize} Unit Capacity</span>
                      </div>
                      <div>
                        <span className="text-editorial-muted">Consultation Date:</span>{' '}
                        <strong className="text-editorial-rust">{submittedB2BRecord.scheduledDate}</strong>
                      </div>
                    </div>

                    <div className="bg-editorial-paper border border-editorial-card/85 p-3 rounded-lg mt-2 font-sans">
                      <p className="text-[10px] text-editorial-muted font-mono uppercase mb-1">PROVISIONED FOCUS TOPIC:</p>
                      <p className="text-xs text-editorial-ink italic line-clamp-2 leading-relaxed">
                        "{submittedB2BRecord.roadblockDescription}"
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 flex justify-center gap-4">
                  <button
                    onClick={resetB2BForm}
                    className="bg-editorial-bg hover:bg-editorial-card border border-editorial-card text-editorial-ink text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg transition"
                  >
                    Submit Another Portfolio Brief
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
