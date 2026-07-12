/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  SearchCode, 
  Hammer, 
  TrendingUp, 
  HelpCircle, 
  CheckCircle2, 
  FileCheck, 
  ChevronRight, 
  Coins, 
  ShieldCheck, 
  AlertCircle
} from 'lucide-react';

interface B2BLandingProps {
  onStartB2B: () => void;
}

export default function B2BLanding({ onStartB2B }: B2BLandingProps) {
  // HQS Mock Pre-Inspection Checklist State
  const [hqsPoints, setHqsPoints] = useState([
    { id: 'hqs-1', text: 'No peeling, chipping, or cracking lead paint (especially built pre-1978)', category: 'Safety/Lead', checked: false },
    { id: 'hqs-2', text: 'Working GFCI outlets installed in kitchen, baths, & within 6ft of water supply', category: 'Electrical', checked: false },
    { id: 'hqs-3', text: 'Double-side handrails installed on all stairwells with 4+ consecutive risers', category: 'Structural', checked: false },
    { id: 'hqs-4', text: 'Smoke, fire, and Carbon Monoxide detectors fully operational on every level', category: 'Security', checked: false },
    { id: 'hqs-5', text: 'Secure, operational locks on all exterior entrance doors and ground floor windows', category: 'Security', checked: false },
    { id: 'hqs-6', text: 'Adequate heating, cooling, and plumbing pressure with no active leaks', category: 'Mechanical', checked: false }
  ]);

  const toggleHqs = (id: string) => {
    setHqsPoints(prev => prev.map(pt => pt.id === id ? { ...pt, checked: !pt.checked } : pt));
  };

  const score = hqsPoints.filter(p => p.checked).length;
  const passPercentage = Math.round((score / hqsPoints.length) * 100);

  return (
    <div className="space-y-12 animate-fade-in" id="b2b-real-estate">
      {/* Intro Header Copy */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest bg-editorial-card/40 px-3 py-1 rounded inline-block border border-editorial-card">
              B2B Institutional Portfolio Consulting
            </span>
            <h2 className="text-3xl md:text-5xl font-serif font-semibold text-editorial-ink tracking-tight leading-tight">
              Institutional Compliance &amp; Contracting<br />
              <span className="text-editorial-rust font-normal italic">for Modern Real Estate Portfolios</span>
            </h2>
          </div>

          <p className="text-editorial-muted text-sm md:text-base leading-relaxed">
            For real estate investors, asset managers, and landlords, optimizing net operating income (NOI) relies entirely on maintaining compliant properties and selecting rock-solid housing programs. We bridge the gap between private real estate operations and municipal housing authorities.
          </p>

          <p className="text-editorial-muted text-sm md:text-base leading-relaxed">
            From parsing Fair Market Rent limits and navigating local Public Housing Authorities to handling intensive HUD rehabs, our specialized consultancy and field contracting crews secure frictionless onboarding timelines.
          </p>

          <div className="pt-2">
            <button
              onClick={onStartB2B}
              className="group flex items-center gap-2.5 bg-editorial-ink hover:bg-editorial-rust text-editorial-paper font-sans font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md transition duration-300 shadow-sm cursor-pointer"
            >
              <span>Submit Portfolio Consultation Brief</span>
              <ChevronRight className="w-4 h-4 text-editorial-paper transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>

        {/* HUD Checklist Simulator Panel */}
        <div className="lg:col-span-5 bg-editorial-paper border border-editorial-card p-6 rounded-xl shadow-sm space-y-5">
          <div className="border-b border-editorial-ink/10 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-sans font-bold text-editorial-ink uppercase tracking-tight flex items-center gap-1.5">
              <span>📋</span> HQS Pre-Inspection Auditor
            </h3>
            <span className="text-[10px] font-mono text-editorial-rust font-semibold">HUD Quality Test</span>
          </div>

          <p className="text-xs text-editorial-muted leading-relaxed">
            Check off key compliance blocks to estimate public housing pass rates:
          </p>

          <div className="space-y-2">
            {hqsPoints.map((pt) => (
              <div 
                key={pt.id} 
                onClick={() => toggleHqs(pt.id)}
                className="flex items-start gap-2.5 bg-editorial-bg border border-editorial-card p-2.5 rounded-lg cursor-pointer hover:border-editorial-rust/30 transition duration-200"
              >
                <input
                  type="checkbox"
                  checked={pt.checked}
                  onChange={() => {}} // handled by parent onClick
                  className="mt-0.5 rounded border-editorial-card text-editorial-rust bg-editorial-bg focus:ring-1 focus:ring-editorial-rust cursor-pointer"
                />
                <div className="text-[11px] leading-tight select-none flex-1">
                  <span className="text-[9px] font-mono text-editorial-muted uppercase block mb-0.5">{pt.category}</span>
                  <span className="text-editorial-ink font-sans font-medium">{pt.text}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Result Output Meter */}
          <div className="bg-editorial-bg border border-editorial-card p-4 rounded-xl text-center space-y-2">
            <p className="text-xs font-mono text-editorial-muted">ESTIMATED FIRST-PASS PROBABILITY</p>
            <div className="relative pt-1">
              <div className="flex mb-1 items-center justify-between text-xs">
                <div>
                  <span className={`text-[10px] font-mono font-bold inline-block py-1 px-2 rounded uppercase ${
                    passPercentage >= 100 
                      ? 'text-purple-800 bg-purple-100 border border-purple-200' 
                      : passPercentage >= 50 
                        ? 'text-amber-800 bg-amber-100 border border-amber-200' 
                        : 'text-red-800 bg-red-100 border border-red-200'
                  }`}>
                    {passPercentage === 100 ? 'Compliant' : passPercentage >= 50 ? 'Moderate Risk' : 'High Risk Failure'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-editorial-ink font-mono">
                    {passPercentage}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2.5 text-xs flex rounded bg-editorial-card border border-editorial-card">
                <div 
                  style={{ width: `${passPercentage}%` }} 
                  className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${
                    passPercentage >= 100 
                      ? 'bg-purple-600' 
                      : passPercentage >= 50 
                        ? 'bg-amber-500' 
                        : 'bg-red-500'
                  }`}
                />
              </div>
            </div>
            {passPercentage < 100 && (
              <p className="text-[10px] text-editorial-muted italic leading-snug">
                ⚠️ Failures in HQS testing will freeze Section 8 onboarding payments. Submit our brief below to dispatch a contractor.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Corporate Offerings Section */}
      <div className="space-y-8 pt-10 border-t border-editorial-ink/10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h3 className="text-2xl md:text-3xl font-serif font-semibold text-editorial-ink">
            Core Professional B2B Offerings
          </h3>
          <p className="text-editorial-muted text-sm">
            Operational methodologies providing regulatory clearance and scale logic to capital investors.
          </p>
        </div>

        {/* Offerings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-editorial-paper border border-editorial-card p-6 rounded-xl space-y-4 hover:border-editorial-rust/40 transition duration-300 shadow-sm">
            <div className="w-11 h-11 bg-editorial-bg text-editorial-rust rounded-lg border border-editorial-card flex items-center justify-center">
              <Building2 className="w-5 h-5 text-editorial-rust" />
            </div>
            <h4 className="text-base font-sans font-bold text-editorial-ink uppercase tracking-tight">
              Section 8 Business Consulting
            </h4>
            <p className="text-xs text-editorial-muted leading-relaxed">
              We navigate local Public Housing Authorities (PHAs) to streamline property onboarding. This includes optimizing maximum allowable rent matches via Fair Market Rent (FMR) criteria, orchestrating tenant pre-screening systems, and configuring back-end voucher structures for uninterrupted cash flow.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-editorial-paper border border-editorial-card p-6 rounded-xl space-y-4 hover:border-editorial-rust/40 transition duration-300 shadow-sm">
            <div className="w-11 h-11 bg-editorial-bg text-editorial-rust rounded-lg border border-editorial-card flex items-center justify-center">
              <Hammer className="w-5 h-5 text-editorial-rust" />
            </div>
            <h4 className="text-base font-sans font-bold text-editorial-ink uppercase tracking-tight">
              Real Estate Contracting &amp; HQS Inspections
            </h4>
            <p className="text-xs text-editorial-muted leading-relaxed">
              Investor-focused rehabs built for longevity and regulatory clearance. We conduct detailed pre-inspections based explicitly on HUD Housing Quality Standards (HQS), correcting potential failures (paint stabilization, mechanical safety, security compliance) to pass on the very first municipal walk-through.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-editorial-paper border border-editorial-card p-6 rounded-xl space-y-4 hover:border-editorial-rust/40 transition duration-300 shadow-sm">
            <div className="w-11 h-11 bg-editorial-bg text-editorial-rust rounded-lg border border-editorial-card flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-editorial-rust" />
            </div>
            <h4 className="text-base font-sans font-bold text-editorial-ink uppercase tracking-tight">
              Strategic Asset Advisory
            </h4>
            <p className="text-xs text-editorial-muted leading-relaxed">
              Consultative planning for scaling real estate investors. We work with you to align mixed-income property portfolios, structure compliant landlord frameworks, and convert challenging legacy properties into high-yield, voucher-backed cash-flow machines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
