/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Phone, 
  Scale, 
  Coins, 
  FileText, 
  HelpCircle, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Search, 
  Users, 
  Database,
  ArrowBigUpDash,
  Mail
} from 'lucide-react';
import { motion } from 'motion/react';
import LeadCaptureFunnels from './components/LeadCaptureFunnels';
import StatusChecker from './components/StatusChecker';
import SurplusLanding from './components/SurplusLanding';
import B2BLanding from './components/B2BLanding';
import FaqSection from './components/FaqSection';
import TestimonialsSection from './components/TestimonialsSection';
import { SurplusSubmission, B2BSubmission } from './types';
import LanceviewLogo from './components/LanceviewLogo';
import AIAdvisor from './components/AIAdvisor';

export default function App() {
  // Dual-Funnel Tab: 'funds' / 'b2b'
  const [activeSegment, setActiveSegment] = useState<'funds' | 'b2b'>('funds');
  
  // Prefill details from the Live Database search engine below
  const [prefilledAddress, setPrefilledAddress] = useState('');
  const [prefilledCounty, setPrefilledCounty] = useState('');
  
  // Dynamic collections of case numbers submitted by user in this session
  const [submittedCases, setSubmittedCases] = useState<Array<{
    caseNumber: string;
    address: string;
    ownerName: string;
    estimatedFunds: number;
  }>>([]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectRecordFromDatabase = (address: string, county: string) => {
    // Lock in pre-fill state
    setPrefilledAddress(address);
    setPrefilledCounty(county);
    // Align tab segment
    setActiveSegment('funds');
    // Scroll smoothly to Lead intake sector
    scrollToSection('intake-anchor');
  };

  const handleFundsSubmitSuccess = (sub: SurplusSubmission) => {
    setSubmittedCases(prev => [
      ...prev,
      {
        caseNumber: sub.caseNumber,
        address: sub.address,
        ownerName: sub.ownerName,
        estimatedFunds: sub.estimatedFunds
      }
    ]);
  };

  const handleB2BSubmitSuccess = (sub: B2BSubmission) => {
    // Log corporate schedule
    console.log('B2B strategic schedule provisioned:', sub);
  };

  return (
    <div className="min-h-screen bg-editorial-bg text-editorial-ink selection:bg-editorial-rust selection:text-white font-sans overflow-x-hidden antialiased">
      
      {/* GLOBAL UTILITY STRIP & TRUST HEADER (TOP BAR) */}
      <div className="w-full bg-editorial-paper border-b border-editorial-card text-[11px] md:text-xs text-editorial-muted py-2.5 px-4 font-sans flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-hidden truncate">
          <span className="text-editorial-rust font-mono">📢</span>
          <span className="truncate text-editorial-muted">Notice: We monitor state, county, and judicial foreclosure auction records daily.</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 font-mono">
          <a href="mailto:info@lanceviewconsulting.com" className="hidden sm:flex hover:text-editorial-rust transition items-center gap-1 leading-none select-none">
            <Mail className="w-3.5 h-3.5 text-editorial-rust" />
            <span>info@lanceviewconsulting.com</span>
          </a>
          <span className="hidden sm:inline text-editorial-card">|</span>
          <a href="tel:6015688374" className="hover:text-editorial-rust transition flex items-center gap-1 leading-none select-none">
            <Phone className="w-3.5 h-3.5 text-editorial-rust" />
            <span>Speak with an Auditor: (601) 568-8374</span>
          </a>
          <span className="hidden md:inline text-editorial-card">|</span>
          <span className="hidden md:inline text-emerald-800 font-semibold uppercase tracking-wider bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
            Zero Upfront Retainers Required
          </span>
        </div>
      </div>

      {/* Main Professional Corporate Menu */}
      <header className="sticky top-0 z-50 bg-editorial-paper/95 backdrop-blur-md border-b border-editorial-card shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-18 flex items-center justify-between gap-4">
          
          {/* Brand Logo Identity */}
          <LanceviewLogo variant="horizontal" size={44} />

          {/* Navigation Links (Matching precise site map on page 2) */}
          <nav className="hidden lg:flex items-center gap-8 justify-center flex-1 text-xs font-bold text-editorial-muted uppercase tracking-wider self-stretch">
            {/* Left Portion of menu map */}
            <div className="flex items-center gap-6 justify-end flex-1 border-r border-editorial-card pr-8">
              <button 
                id="nav-home"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
                className="hover:text-editorial-rust transition cursor-pointer"
              >
                Home
              </button>
              <button 
                id="nav-why-us"
                onClick={() => { setActiveSegment('funds'); scrollToSection('deep-dive-anchor'); }} 
                className="hover:text-editorial-rust transition cursor-pointer"
              >
                Surplus Recovery
              </button>
              <button 
                id="nav-how-it-works"
                onClick={() => scrollToSection('case-tracker')} 
                className="hover:text-editorial-rust transition cursor-pointer"
              >
                How It Works
              </button>
            </div>
            
            {/* Right Portion of menu map */}
            <div className="flex items-center gap-6 justify-start flex-1 lg:pl-6">
              <button 
                id="nav-b2b"
                onClick={() => { setActiveSegment('b2b'); scrollToSection('deep-dive-anchor'); }} 
                className="hover:text-editorial-rust transition cursor-pointer"
              >
                B2B Real Estate
              </button>
              <button 
                id="nav-section8"
                onClick={() => { setActiveSegment('b2b'); scrollToSection('deep-dive-anchor'); }} 
                className="hover:text-editorial-rust transition cursor-pointer"
              >
                Section 8
              </button>
              <button 
                id="nav-contact"
                onClick={() => scrollToSection('intake-anchor')} 
                className="hover:text-editorial-rust transition cursor-pointer"
              >
                Contact
              </button>
            </div>
          </nav>

          {/* Core Action Button Right */}
          <button
            id="nav-cta-funds"
            onClick={() => scrollToSection('case-tracker')}
            className="bg-editorial-ink hover:bg-editorial-rust text-editorial-paper font-sans text-xs uppercase tracking-wider font-extrabold px-4.5 py-2.5 rounded transition shadow-sm cursor-pointer text-center"
          >
            Check My Fund Status
          </button>
        </div>
      </header>

      {/* ABOVE-THE-FOLD HERO BLUEPRINT SECTION */}
      <section className="relative py-16 md:py-24 px-4 overflow-hidden border-b border-editorial-card bg-editorial-paper" id="hero-segment">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          
          {/* Target Niches Header Badges */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-rust bg-editorial-rust/5 border border-editorial-rust/20 px-3 py-1 rounded-full">
              Asset Recovery (Contingency)
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-editorial-ink bg-editorial-bg border border-editorial-card/85 px-3 py-1 rounded-full">
              B2B Real Estate (Consulting)
            </span>
          </div>

          {/* PRIMARY HEADLINE (H1) */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-editorial-ink tracking-tight max-w-4xl mx-auto leading-tight md:leading-tight">
            The Government &amp; Banks May Be Holding Cash Owed To You. <span className="text-editorial-rust font-normal italic">We Recover It.</span>
          </h1>

          {/* SUB-HEADLINE (H2 VALUE PROP) */}
          <p className="text-sm md:text-base lg:text-lg text-editorial-ink/90 max-w-3xl mx-auto leading-relaxed font-sans font-light">
            When real estate sells at a foreclosure or tax auction for more than the debt owed, the excess money legally belongs to the previous owner or their heirs. We audit county records, clear title conflicts, handle the legal filings, and recover your capital.
          </p>

          {/* Our Performance Mandate (Callout Box) */}
          <div className="max-w-2xl mx-auto bg-editorial-bg border border-editorial-card rounded-xl p-5 text-center text-xs text-editorial-muted leading-relaxed">
            🔒 <strong className="text-editorial-ink">Our Performance Mandate:</strong> We work strictly on contingency. We absorb 100% of the legal fees, corporate search expenses, and filing costs. If we do not successfully recover your funds, <span className="text-editorial-rust font-semibold underline">you owe us nothing</span>.
          </div>

          {/* Call to Action Layout (Dual Split Buttons) */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 max-w-md mx-auto">
            <button
              id="hero-btn-primary"
              onClick={() => scrollToSection('case-tracker')}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-editorial-rust hover:bg-editorial-ink text-white font-sans uppercase tracking-wider font-bold text-xs px-6 py-4 rounded-md transition duration-300 shadow-sm cursor-pointer"
            >
              👉 Check My Property Cash Status
            </button>
            <button
              id="hero-btn-secondary"
              onClick={() => { setActiveSegment('b2b'); scrollToSection('deep-dive-anchor'); }}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-editorial-paper hover:bg-editorial-card border border-editorial-card text-editorial-ink font-sans uppercase tracking-wider font-bold text-xs px-6 py-4 rounded-md transition cursor-pointer"
            >
              🏢 Real Estate Investor &amp; Landlord Portals
            </button>
          </div>

        </div>
      </section>

      {/* STRUCTURAL VERIFICATION / SOCIAL PROOF ROW (TRUST COMPLIANCE BAR) */}
      <section className="w-full bg-editorial-paper border-b border-editorial-card py-8 px-4" id="compliance-bar">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center select-none">
          
          {/* Block 1 */}
          <div className="space-y-1.5 px-4 md:border-r border-editorial-card last:border-0">
            <div className="text-editorial-ink flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-editorial-rust shrink-0" />
              <span>State &amp; County Bonded</span>
            </div>
            <p className="text-xs text-editorial-muted font-sans">
              Compliant with state-specific surplus asset rules.
            </p>
          </div>

          {/* Block 2 */}
          <div className="space-y-1.5 px-4 md:border-r border-editorial-card last:border-0 font-sans">
            <div className="text-editorial-ink flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-widest">
              <Scale className="w-4 h-4 text-editorial-rust shrink-0" />
              <span>In-House Legal Review</span>
            </div>
            <p className="text-xs text-editorial-muted font-sans">
              All title abstracts and motions managed by licensed attorneys.
            </p>
          </div>

          {/* Block 3 */}
          <div className="space-y-1.5 px-4 last:border-0 z-0 font-sans">
            <div className="text-editorial-ink flex items-center justify-center gap-2 text-xs font-mono font-bold uppercase tracking-widest">
              <Coins className="w-4 h-4 text-editorial-rust shrink-0" />
              <span>100% Contingency Guarantee</span>
            </div>
            <p className="text-xs text-editorial-muted font-sans">
              Zero upfront retainer, deposit, or out-of-pocket costs.
            </p>
          </div>

        </div>
      </section>

      {/* DEEP DIVE PORTFOLIOS & INTENT SEGREGATION BLOCK */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16 space-y-12" id="deep-dive-anchor">
        
        {/* Dual segment landing navigation triggers */}
        <div className="flex border-b border-editorial-card">
          <button
            id="segment-btn-funds"
            onClick={() => setActiveSegment('funds')}
            className={`flex-1 py-4 text-center font-sans uppercase tracking-wider text-xs font-bold transition duration-300 ${
              activeSegment === 'funds' 
                ? 'border-b-2 border-editorial-rust text-editorial-rust' 
                : 'border-b border-transparent text-editorial-muted hover:text-editorial-ink'
            }`}
          >
            Surplus Funds Recovery Inner Funnel
          </button>
          <button
            id="segment-btn-b2b"
            onClick={() => setActiveSegment('b2b')}
            className={`flex-1 py-4 text-center font-sans uppercase tracking-wider text-xs font-bold transition duration-300 ${
              activeSegment === 'b2b' 
                ? 'border-b-2 border-editorial-rust text-editorial-rust' 
                 : 'border-b border-transparent text-editorial-muted hover:text-editorial-ink'
            }`}
          >
            Real Estate B2B &amp; Section 8 Hub
          </button>
        </div>

        {/* Dynamic Inner Funnels */}
        <div id="landing-page-content">
          {activeSegment === 'funds' ? (
            <SurplusLanding onStartInquiry={() => scrollToSection('intake-anchor')} />
          ) : (
            <B2BLanding onStartB2B={() => scrollToSection('intake-anchor')} />
          )}
        </div>

      </section>

      {/* CORE FORM FIELDS & MULTI-STEP LEAD CAPTURE FUNNEL SECTOR */}
      <section className="bg-editorial-bg border-y border-editorial-card py-16 px-4" id="intake-anchor">
        <div className="max-w-7xl mx-auto space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-editorial-ink uppercase tracking-tight">
              Lead Capture Portals
            </h3>
            <p className="text-editorial-muted text-xs md:text-sm leading-relaxed">
              To maximize conversion ratios, specify your sector below. Our system deploys target-optimized fields rather than one generic contact form.
            </p>
          </div>

          {/* Shared Interactive Lead Capture Component */}
          <LeadCaptureFunnels
            initialFunnel={activeSegment}
            prefilledAddress={prefilledAddress}
            prefilledCounty={prefilledCounty}
            onFundsSubmit={handleFundsSubmitSuccess}
            onB2BSubmit={handleB2BSubmitSuccess}
          />

        </div>
      </section>

      {/* INTERACTIVE FORECLOSURE REGISTRY DATABASE SEARCHER & progression tracker */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-16">
        <StatusChecker 
          onSelectRecord={handleSelectRecordFromDatabase} 
          submittedCases={submittedCases}
        />
      </section>

      {/* DIRECT-RESPONSE FAQ CREDIBILITY BLOCK */}
      <TestimonialsSection />

      <section className="bg-editorial-paper border-t border-editorial-card py-16 px-4">
        <FaqSection />
      </section>

      {/* PROFESSIONAL COMPLIANCE FOOTER */}
      <footer className="w-full bg-editorial-paper border-t border-editorial-card text-xs text-editorial-muted pt-12 pb-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand section */}
          <div className="space-y-4">
            <LanceviewLogo variant="horizontal" size={38} />
            <p className="leading-relaxed text-[11px] text-editorial-muted">
              Professional asset forensics and real estate portfolio consulting representing record holders and institutional partners on strict contingency or advisory frameworks.
            </p>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="text-editorial-ink font-bold font-sans text-xs uppercase tracking-wider border-b border-editorial-card/80 pb-1.5">
              Surplus Channels
            </h4>
            <ul className="space-y-2 text-[11px] font-sans">
              <li>
                <button onClick={() => { setActiveSegment('funds'); scrollToSection('deep-dive-anchor'); }} className="hover:text-editorial-rust transition text-left cursor-pointer">
                  Why Work With Us
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('case-tracker')} className="hover:text-editorial-rust transition text-left cursor-pointer">
                  Search Unclaimed Database
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('case-tracker')} className="hover:text-editorial-rust transition text-left cursor-pointer">
                  Audit Tracking Toolbar
                </button>
              </li>
            </ul>
          </div>

          {/* B2B Services */}
          <div className="space-y-3">
            <h4 className="text-editorial-ink font-bold font-sans text-xs uppercase tracking-wider border-b border-editorial-card/80 pb-1.5">
              B2B Services
            </h4>
            <ul className="space-y-2 text-[11px] font-sans">
              <li>
                <button onClick={() => { setActiveSegment('b2b'); scrollToSection('deep-dive-anchor'); }} className="hover:text-editorial-rust transition text-left cursor-pointer">
                  Section 8 Business Consulting
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveSegment('b2b'); scrollToSection('deep-dive-anchor'); }} className="hover:text-editorial-rust transition text-left cursor-pointer">
                  HQS pre-Inspections
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveSegment('b2b'); scrollToSection('deep-dive-anchor'); }} className="hover:text-editorial-rust transition text-left cursor-pointer">
                  Investor-focused Rehabs
                </button>
              </li>
            </ul>
          </div>

          {/* Legal Compliance & Contact */}
          <div className="space-y-3 font-sans">
            <h4 className="text-editorial-ink font-bold text-xs uppercase tracking-wider border-b border-editorial-card/80 pb-1.5">
              Contact &amp; Counsel
            </h4>
            <div className="text-[11px] text-editorial-ink space-y-2">
              <p className="font-semibold">Lanceview Consulting LLC</p>
              <div className="space-y-1">
                <p className="flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-editorial-rust" />
                  <a href="tel:6015688374" className="hover:text-editorial-rust transition">
                    (601) 568-8374
                  </a>
                </p>
                <p className="flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-editorial-rust" />
                  <a href="mailto:info@lanceviewconsulting.com" className="hover:text-editorial-rust transition">
                    info@lanceviewconsulting.com
                  </a>
                </p>
              </div>
            </div>
            <p className="leading-relaxed text-[10px] text-editorial-muted">
              Disclaimer: We do not serve as personal banking advisors, financial advisors, or public tax agents. Contingency terms are outlined explicitly in motion abstract agreements and notarized filings.
            </p>
            <p className="text-[10px] text-editorial-muted font-mono">
              Target Meta: Surplus Funds Recovery Experts | Real Estate Contracting &amp; HUD Section 8 Prep
            </p>
          </div>

        </div>

        {/* Base strip copyright */}
        <div className="max-w-7xl mx-auto pt-8 mt-8 border-t border-editorial-card flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-editorial-muted font-sans">
          <p>© 2026 Lanceview Consulting LLC. All Rights Reserved.</p>
          <div className="flex gap-4">
            <span className="cursor-pointer hover:text-editorial-rust transition">Terms of Service</span>
            <span>•</span>
            <span className="cursor-pointer hover:text-editorial-rust transition">Privacy Protocols</span>
          </div>
        </div>
      </footer>

      {/* AI Advisor Chat Widget */}
      <AIAdvisor />
    </div>
  );
}
