/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  FileSearch, 
  HelpCircle, 
  Coins, 
  Compass, 
  CheckCircle2, 
  Scale, 
  AlertTriangle,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

interface SurplusLandingProps {
  onStartInquiry: () => void;
}

export default function SurplusLanding({ onStartInquiry }: SurplusLandingProps) {
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

          <div className="pt-2">
            <button
              onClick={onStartInquiry}
              className="group flex items-center gap-2.5 bg-editorial-ink hover:bg-editorial-rust text-editorial-paper font-sans font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-md transition duration-300 shadow-sm cursor-pointer"
            >
              <span>Launch Step-by-Step Incident Review</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
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
    </div>
  );
}
