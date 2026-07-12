/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileSearch, 
  HelpCircle, 
  Coins, 
  Compass, 
  CheckCircle2, 
  Scale, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  FileText,
  Download,
  X,
  Loader2
} from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface SurplusLandingProps {
  onStartInquiry: () => void;
}

export default function SurplusLanding({ onStartInquiry }: SurplusLandingProps) {
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [guideEmail, setGuideEmail] = useState('');
  const [isSubmittingGuide, setIsSubmittingGuide] = useState(false);
  const [guideSubmitted, setGuideSubmitted] = useState(false);

  const handleGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!guideEmail || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(guideEmail.trim())) return;

    setIsSubmittingGuide(true);
    try {
      const downloadId = `guide-${Date.now()}`;
      await setDoc(doc(db, 'guide_downloads', downloadId), {
        email: guideEmail.trim(),
        createdAt: serverTimestamp()
      });

      // Send the automated email confirmation
      await fetch('/api/send-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: guideEmail.trim()
        }),
      });

      setGuideSubmitted(true);
    } catch (error) {
      console.error('Error recording guide download:', error);
      alert('Failed to process request. Please try again.');
    } finally {
      setIsSubmittingGuide(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in" id="surplus-recovery-why-us">
      {/* Editorial Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-editorial-rust font-semibold uppercase tracking-widest bg-editorial-rust/5 border border-editorial-rust/20 px-3 py-1 rounded inline-block">
              Asset Recovery contingency division
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-editorial-ink tracking-tight leading-tight">
              Your Property Was Sold.<br />
              <span className="text-editorial-rust italic font-normal">Your Equity Didn't Disappear.</span>
            </h2>
          </div>

          <p className="text-editorial-muted text-sm md:text-base leading-relaxed">
            When properties pass through foreclosure or tax deed auctions, the bidding often clears a number substantially higher than the underlying tax or mortgage default balance. By law, those extra funds—the <strong className="text-editorial-ink font-semibold">"Surplus Proceeds"</strong>—do not belong to the bank or the municipality. They belong to you, the former owner, or your heirs.
          </p>

          <p className="text-editorial-muted text-sm md:text-base leading-relaxed">
            However, county Treasurers and Clerks of Court maintain strict, complex legal windows for claims. If a highly technical petition isn't filed before the expiration date, your money defaults permanently into government accounts.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <button
              onClick={onStartInquiry}
              className="group flex items-center justify-center gap-2.5 bg-editorial-ink hover:bg-editorial-rust text-editorial-paper font-sans font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md transition duration-300 shadow-sm cursor-pointer w-full sm:w-auto"
            >
              <span>Launch Step-by-Step Incident Review</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={() => setIsGuideModalOpen(true)}
              className="group flex items-center justify-center gap-2.5 bg-editorial-paper border border-editorial-card hover:border-editorial-rust hover:text-editorial-rust text-editorial-ink font-sans font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md transition duration-300 shadow-sm cursor-pointer w-full sm:w-auto"
            >
              <Download className="w-4 h-4" />
              <span>Download Recovery Guide</span>
            </button>
          </div>
        </div>

        {/* Visual Callout Info Block */}
        <div className="lg:col-span-5 bg-editorial-paper border border-editorial-card p-6 md:p-8 rounded-xl shadow-sm space-y-5 relative">
          <div className="absolute top-0 right-0 w-24 h-24 bg-editorial-rust/5 rounded-full blur-xl pointer-events-none" />
          
          <h3 className="text-sm font-sans font-bold text-editorial-ink uppercase tracking-wider text-left pb-3 border-b border-editorial-ink/10 flex items-center gap-2">
            <span className="text-editorial-rust">■</span> Stat &amp; Statutory Deadlines
          </h3>

          <div className="space-y-3.5">
            <div className="flex justify-between items-center text-xs border-b border-editorial-ink/5 pb-2">
              <span className="text-editorial-muted">Surplus List Updates:</span>
              <span className="text-editorial-rust font-semibold font-mono">Every 3 Days</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-editorial-ink/5 pb-2">
              <span className="text-editorial-muted">Claim Filing Window:</span>
              <span className="text-editorial-rust font-semibold font-mono">60 to 120 Days Avg.</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-editorial-ink/5 pb-2">
              <span className="text-editorial-muted">Retainer Fee:</span>
              <span className="text-editorial-ink font-semibold font-mono">$0 Upfront (100% Contingent)</span>
            </div>
            <div className="flex justify-between items-center text-xs border-b border-editorial-ink/5 pb-2">
              <span className="text-editorial-muted">Secondary Liens Resolution:</span>
              <span className="text-editorial-muted font-semibold font-mono">In-House Legal Abstractors</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-editorial-muted">Default Recipient:</span>
              <span className="text-editorial-rust font-semibold font-mono">State General Revenue Fund</span>
            </div>
          </div>

          <div className="bg-editorial-bg p-4 rounded-lg border border-editorial-card space-y-2">
            <div className="flex items-center gap-2 text-editorial-rust text-xs font-bold font-mono">
              <ShieldAlert className="w-4 h-4 text-editorial-rust" />
              <span>SOCIETY FRAUD ADVISORY</span>
            </div>
            <p className="text-[11px] text-editorial-muted leading-normal font-sans">
              Unlike third-party scraper finders who demand immediate retainer checks and upfront outlays, we assume 100% of risk. No checks are ever cut by client to us.
            </p>
          </div>
        </div>
      </div>

      {/* Why Work With Us Section */}
      <div className="space-y-8 pt-10 border-t border-editorial-ink/10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h3 className="text-2xl md:text-3xl font-serif font-semibold text-editorial-ink">
            Why Work With Us Instead of Going It Alone?
          </h3>
          <p className="text-editorial-muted text-sm">
            Auditing records and handling abstract filings directly is incredibly hazardous. Our structure removes the legal complexities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-editorial-paper border border-editorial-card p-6 rounded-xl space-y-4 hover:border-editorial-rust/40 transition duration-300 shadow-sm">
            <div className="w-11 h-11 bg-editorial-bg text-editorial-rust rounded-lg flex items-center justify-center border border-editorial-card">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="text-base font-sans font-bold text-editorial-ink uppercase tracking-tight">
              Title &amp; Lien Resolution
            </h4>
            <p className="text-xs text-editorial-muted leading-relaxed">
              Government agencies and secondary lienholders (such as credit cards or old medical debts) frequently attempt to claim your funds. Our title abstractors successfully isolate and eliminate unlawful claims.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-editorial-paper border border-editorial-card p-6 rounded-xl space-y-4 hover:border-editorial-rust/40 transition duration-300 shadow-sm">
            <div className="w-11 h-11 bg-editorial-bg text-editorial-rust rounded-lg flex items-center justify-center border border-editorial-card">
              <Coins className="w-5 h-5" />
            </div>
            <h4 className="text-base font-sans font-bold text-editorial-ink uppercase tracking-tight">
              Upfront Capital Injection
            </h4>
            <p className="text-xs text-editorial-muted leading-relaxed">
              Filing an asset recovery claim requires title research, formal records indexing, notary services, and precise legal motion preparation. We front 100% of these expenses out of our own pocket.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-editorial-paper border border-editorial-card p-6 rounded-xl space-y-4 hover:border-editorial-rust/40 transition duration-300 shadow-sm">
            <div className="w-11 h-11 bg-editorial-bg text-editorial-rust rounded-lg flex items-center justify-center border border-editorial-card">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <h4 className="text-base font-sans font-bold text-editorial-ink uppercase tracking-tight">
              Protection From Fraud
            </h4>
            <p className="text-xs text-editorial-muted leading-relaxed">
              Unlicensed, unbonded "finders" frequently scrape listings to trick former owners into predatory upfront fee setups. We are fully transparent and operate strictly on a verified, successful recovery model.
            </p>
          </div>
        </div>
      </div>
      
      {/* Required Documents Accordion */}
      <div className="pt-10 border-t border-editorial-ink/10">
        <div className="max-w-4xl mx-auto">
          <div className={`bg-editorial-paper border rounded-xl overflow-hidden transition-all duration-300 ${
              isDocsOpen 
                ? 'border-editorial-rust shadow-sm ring-1 ring-editorial-rust/10' 
                : 'border-editorial-card hover:border-editorial-rust/40'
            }`}
          >
            <button
              onClick={() => setIsDocsOpen(!isDocsOpen)}
              className="w-full flex items-center justify-between text-left p-6 gap-4 font-sans focus:outline-none cursor-pointer"
            >
              <div className="flex gap-4 items-center">
                <FileText className={`w-6 h-6 transition-colors ${
                  isDocsOpen ? 'text-editorial-rust' : 'text-editorial-muted'
                }`} />
                <div>
                  <h4 className="text-base font-bold text-editorial-ink">Required Documents for Intake</h4>
                  <p className="text-sm text-editorial-muted mt-1">Review the proof-of-identity documentation needed to start your claim.</p>
                </div>
              </div>
              <span className="bg-editorial-bg p-2 rounded-full">
                {isDocsOpen ? (
                  <ChevronUp className="w-5 h-5 text-editorial-rust shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-editorial-muted shrink-0" />
                )}
              </span>
            </button>

            <AnimatePresence>
              {isDocsOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  className="bg-editorial-bg border-t border-editorial-card"
                >
                  <div className="p-6 md:p-8 space-y-6">
                    <p className="text-sm text-editorial-muted leading-relaxed">
                      To expedite the initial audit of your claim, we require certain documentation to verify your identity and association with the property. Depending on your connection to the property, the required documents may vary.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <h5 className="text-sm font-bold text-editorial-ink flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-editorial-rust" /> 
                          For Former Property Owners
                        </h5>
                        <ul className="text-sm text-editorial-muted space-y-2 list-disc list-inside ml-1">
                          <li>Valid Government-Issued Photo ID</li>
                          <li>Proof of Prior Residency (e.g., old utility bill, tax statement)</li>
                          <li>Signed Contingency Agreement (provided by our team)</li>
                        </ul>
                      </div>
                      
                      <div className="space-y-4">
                        <h5 className="text-sm font-bold text-editorial-ink flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-editorial-rust" /> 
                          For Heirs or Relatives
                        </h5>
                        <ul className="text-sm text-editorial-muted space-y-2 list-disc list-inside ml-1">
                          <li>Your Valid Government-Issued Photo ID</li>
                          <li>Death Certificate of the Deceased Owner</li>
                          <li>Will, Probate Documents, or Proof of Kinship</li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-editorial-paper p-4 rounded-lg border border-editorial-card mt-4">
                      <p className="text-xs text-editorial-muted leading-normal">
                        <strong className="text-editorial-ink font-semibold">Note:</strong> Please do not send sensitive personal information (such as full Social Security Numbers or bank account details) via initial forms or unencrypted email. Our legal team will provide a secure portal for document transmission once your claim is verified.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Guide Download Modal */}
      <AnimatePresence>
        {isGuideModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-editorial-ink/60 backdrop-blur-sm"
              onClick={() => !isSubmittingGuide && setIsGuideModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-editorial-paper border border-editorial-card rounded-2xl shadow-xl max-w-md w-full p-8 relative z-10"
            >
              <button
                onClick={() => setIsGuideModalOpen(false)}
                disabled={isSubmittingGuide}
                className="absolute top-4 right-4 text-editorial-muted hover:text-editorial-ink transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>

              {guideSubmitted ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-editorial-ink mb-2">Check Your Inbox</h3>
                  <p className="text-editorial-muted text-sm mb-6">
                    We've sent the comprehensive Surplus Recovery Guide to <span className="font-semibold text-editorial-ink">{guideEmail}</span>.
                  </p>
                  <button
                    onClick={() => {
                      setIsGuideModalOpen(false);
                      setTimeout(() => {
                        setGuideSubmitted(false);
                        setGuideEmail('');
                      }, 300);
                    }}
                    className="w-full bg-editorial-ink hover:bg-editorial-rust text-editorial-paper font-bold text-xs uppercase tracking-wider py-3 rounded-md transition-colors"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <div className="w-12 h-12 bg-editorial-bg border border-editorial-card rounded-xl flex items-center justify-center mx-auto mb-4 text-editorial-rust">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-editorial-ink mb-2">Surplus Recovery Guide</h3>
                    <p className="text-editorial-muted text-sm">
                      Enter your email below to instantly receive our free 12-page PDF breakdown of the statutory asset recovery process.
                    </p>
                  </div>

                  <form onSubmit={handleGuideSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="guide-email" className="sr-only">Email Address</label>
                      <input
                        id="guide-email"
                        type="email"
                        required
                        value={guideEmail}
                        onChange={(e) => setGuideEmail(e.target.value)}
                        placeholder="Enter your email address"
                        className="w-full bg-editorial-bg border border-editorial-card focus:border-editorial-rust focus:ring-editorial-rust/20 rounded-lg px-4 py-3 text-sm transition-all"
                        disabled={isSubmittingGuide}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingGuide || !guideEmail}
                      className="w-full flex items-center justify-center gap-2 bg-editorial-ink hover:bg-editorial-rust text-editorial-paper font-bold text-xs uppercase tracking-wider py-3.5 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isSubmittingGuide ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4" />
                      )}
                      <span>{isSubmittingGuide ? 'Sending...' : 'Send Me The Guide'}</span>
                    </button>
                  </form>
                  <p className="text-center text-[10px] text-editorial-muted mt-4">
                    Your email is secure. We never sell your data to third-party finders.
                  </p>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
