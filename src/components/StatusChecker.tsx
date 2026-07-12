/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Database, 
  Coins, 
  MapPin, 
  Calendar, 
  User, 
  ArrowRight, 
  Info, 
  ShieldCheck, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  Scale, 
  Sparkles,
  Send,
  ArrowUpRight,
  HelpCircle,
  TrendingUp,
  Briefcase
} from 'lucide-react';
import { mockCountyRecords } from '../data';
import { CountyRecord } from '../types';

interface StatusCheckerProps {
  onSelectRecord: (address: string, county: string) => void;
  submittedCases?: Array<{ caseNumber: string; address: string; ownerName: string; estimatedFunds: number }>;
}

interface ClaimCardInfo {
  id: string;
  address: string;
  county: string;
  owner: string;
  amount: number;
}

// Parses special structured tags like:
// [CLAIM_CARD:id="rec-001";address="412 N Pine Street, Orlando, FL 32801";county="Orange County";owner="Margaret H. Mitchell";amount=64150]
function parseClaimCards(content: string): { text: string; cards: ClaimCardInfo[] } {
  const cards: ClaimCardInfo[] = [];
  const regex = /\[CLAIM_CARD:id="([^"]*)";address="([^"]*)";county="([^"]*)";owner="([^"]*)";amount=([0-9.]*)\]/g;
  
  let match;
  let cleanText = content;
  
  while ((match = regex.exec(content)) !== null) {
    const [fullMatch, id, address, county, owner, amountStr] = match;
    cards.push({
      id,
      address,
      county,
      owner,
      amount: parseFloat(amountStr) || 0
    });
    cleanText = cleanText.replace(fullMatch, '');
  }
  
  return { text: cleanText, cards };
}

export default function StatusChecker({ onSelectRecord, submittedCases = [] }: StatusCheckerProps) {
  // Navigation tabs for the dual finder interface
  const [activeTab, setActiveTab] = useState<'database' | 'ai-assistant'>('database');

  // Database standard search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCounty, setSelectedCounty] = useState('All');
  const [searchResults, setSearchResults] = useState<CountyRecord[]>(mockCountyRecords);
  const [trackedCaseNumber, setTrackedCaseNumber] = useState('');
  const [trackingRecord, setTrackingRecord] = useState<any>(null);
  const [trackingError, setTrackingError] = useState('');

  // AI Assistant Chat States
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: "Hello! I am your Lanceview Forensics AI Advisor. I have real-time access to our proprietary surplus database of unclaimed foreclosure and tax sale proceeds.\n\nTell me your name, an address, or a county you are interested in (such as Duval, Orange, Fulton, or Los Angeles County), and I'll immediately search for potential matches and guide you on zero-risk recovery options!"
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Extract unique list of counties for filters
  const counties = ['All', ...Array.from(new Set(mockCountyRecords.map(r => r.county)))];

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    
    const filtered = mockCountyRecords.filter(record => {
      const matchesSearch = 
        record.address.toLowerCase().includes(query) || 
        record.ownerName.toLowerCase().includes(query) ||
        record.county.toLowerCase().includes(query);
      const matchesCounty = selectedCounty === 'All' || record.county === selectedCounty;
      return matchesSearch && matchesCounty;
    });

    setSearchResults(filtered);
  };

  // Run handleSearch automatically when components updates query or county drop-down
  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedCounty]);

  // Keep chat scrolled down smoothly
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatLoading]);

  // Handle checking a Case ID
  const handleTrackCase = (e: React.FormEvent) => {
    e.preventDefault();
    setTrackingError('');
    setTrackingRecord(null);

    const cNum = trackedCaseNumber.trim().toUpperCase();
    if (!cNum) {
      setTrackingError('Please enter a case number');
      return;
    }

    const userCase = submittedCases.find(c => c.caseNumber.toUpperCase() === cNum);
    
    if (userCase) {
      setTrackingRecord({
        caseNumber: userCase.caseNumber,
        address: userCase.address,
        ownerName: userCase.ownerName,
        estimatedFunds: userCase.estimatedFunds,
        status: 'audit_pending',
        submittedAt: new Date().toLocaleDateString(),
        steps: [
          { name: 'Forensic Audit', desc: 'County records reviewed & verified', status: 'active', duration: '1-3 Days' },
          { name: 'Title Clearance', desc: 'Isolating secondary liens or interest holders', status: 'upcoming', duration: '5-10 Days' },
          { name: 'Legal Abstracting', desc: 'Preparation of formal surplus court motions', status: 'upcoming', duration: '14-20 Days' },
          { name: 'Funds Disbursed', desc: 'Check shipping and escrow clearance', status: 'upcoming', duration: 'Completed' }
        ]
      });
      return;
    }

    if (cNum === 'SF-SAMPLE') {
      setTrackingRecord({
        caseNumber: 'SF-SAMPLE',
        address: '105 Orchard Ave, Tampa, FL 33603',
        ownerName: 'Arthur Vance Jr.',
        estimatedFunds: 48900,
        status: 'title_clearing',
        submittedAt: '05/12/2026',
        steps: [
          { name: 'Forensic Audit', desc: 'County records reviewed & verified', status: 'completed', duration: 'Done' },
          { name: 'Title Clearance', desc: 'Isolating secondary liens or interest holders', status: 'active', duration: 'In Progress' },
          { name: 'Legal Abstracting', desc: 'Preparation of formal surplus court motions', status: 'upcoming', duration: 'Next Week' },
          { name: 'Funds Disbursed', desc: 'Check shipping and escrow clearance', status: 'upcoming', duration: '60 Days Est' }
        ]
      });
    } else if (cNum === 'SF-948210') {
      setTrackingRecord({
        caseNumber: 'SF-948210',
        address: '8914 Whispering Oaks Lane, Jacksonville, FL 32210',
        ownerName: 'James L. Peterson',
        estimatedFunds: 112450,
        status: 'motion_filed',
        submittedAt: '04/08/2026',
        steps: [
          { name: 'Forensic Audit', desc: 'County records reviewed & verified', status: 'completed', duration: 'Done' },
          { name: 'Title Clearance', desc: 'Isolating secondary liens or interest holders', status: 'completed', duration: 'Done' },
          { name: 'Legal Abstracting', desc: 'Docket motion filed at County Courthouse', status: 'active', duration: 'Approved' },
          { name: 'Funds Disbursed', desc: 'Check shipping and escrow clearance', status: 'upcoming', duration: '3-5 Business Days' }
        ]
      });
    } else if (cNum === 'SF-COMPLETE') {
      setTrackingRecord({
        caseNumber: 'SF-COMPLETE',
        address: '412 N Pine Street, Orlando, FL 32801',
        ownerName: 'Margaret H. Mitchell',
        estimatedFunds: 64150,
        status: 'funds_disbursed',
        submittedAt: '03/10/2026',
        steps: [
          { name: 'Forensic Audit', desc: 'County records reviewed & verified', status: 'completed', duration: 'Done' },
          { name: 'Title Clearance', desc: 'Isolating secondary liens or interest holders', status: 'completed', duration: 'Done' },
          { name: 'Legal Abstracting', desc: 'Docket motion filed and cleared by Magistrate', status: 'completed', duration: 'Done' },
          { name: 'Funds Disbursed', desc: 'Disbursed check $64,150.00 posted via FedEx', status: 'completed', duration: 'Delivered' }
        ]
      });
    } else {
      setTrackingError('No matching active case folder found. Submissions take 10-15 minutes to register in this lookup toolbar. Use "SF-948210" or "SF-COMPLETE" for preview.');
    }
  };

  // AI Chat dispatch trigger
  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    const newMessages = [...messages, { role: 'user' as const, content: query }];
    setMessages(newMessages);
    setChatInput('');
    setChatLoading(true);
    setChatError('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!response.ok) {
        throw new Error('Our AI advisory agent was temporarily disconnected. Please try again.');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant' as const, content: data.text }]);
    } catch (err: any) {
      setChatError(err.message || 'Connecting to the secure AI services failed.');
    } finally {
      setChatLoading(false);
    }
  };

  // Quick prompt templates for AI Advisor
  const handleSendQuickQuery = (queryText: string) => {
    setChatInput(queryText);
  };

  return (
    <div className="space-y-10 animate-fade-in" id="case-tracker">
      
      {/* Dynamic Selector Header Tab Selection */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-editorial-card pb-5">
        <div className="space-y-1">
          <h2 className="text-xl md:text-2xl font-serif font-bold text-editorial-ink">
            Lanceview Forensic Search Suite
          </h2>
          <p className="text-xs text-editorial-muted">
            Locate your surplus proceeds using active registry records or chat with our live AI Forensics Advisor.
          </p>
        </div>

        {/* Custom Tab Pills */}
        <div className="flex bg-editorial-bg border border-editorial-card p-1 rounded-xl self-start font-sans text-xs">
          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition duration-200 cursor-pointer ${
              activeTab === 'database'
                ? 'bg-editorial-paper text-editorial-ink shadow-sm'
                : 'text-editorial-muted hover:text-editorial-ink'
            }`}
          >
            <Database className="w-4 h-4 text-editorial-rust" />
            <span>Foreclosure Registry DB</span>
          </button>
          
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition duration-200 cursor-pointer relative ${
              activeTab === 'ai-assistant'
                ? 'bg-editorial-paper text-editorial-ink shadow-sm'
                : 'text-editorial-muted hover:text-editorial-ink'
            }`}
          >
            <Sparkles className="w-4 h-4 text-editorial-rust animate-pulse" />
            <span>AI Forensic Advisor</span>
            <span className="absolute -top-1.5 -right-1.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-editorial-rust opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-editorial-rust"></span>
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'database' ? (
          <motion.div
            key="traditional-monitor"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left: Forensic County Monitor Database */}
            <div className="lg:col-span-7 bg-editorial-paper border border-editorial-card rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between flex-wrap gap-4 border-b border-editorial-ink/15 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-editorial-bg text-editorial-rust border border-editorial-card rounded-xl flex items-center justify-center">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-editorial-ink">
                      Foreclosure Registry Auditor Tool
                    </h3>
                    <p className="text-xs text-editorial-muted">
                      Database updated every 3 days from state and county auction records.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded flex items-center gap-1.5 font-semibold">
                  <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" />
                  Active Forensics DB
                </span>
              </div>
      
              {/* Filters Row */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3" id="database-filters">
                <div className="md:col-span-8 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-editorial-muted">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    id="search-query-field"
                    placeholder="Search addresses, owners, or counties..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-editorial-bg border border-editorial-card text-editorial-ink placeholder:text-editorial-muted/70 rounded-lg pl-9 pr-4 py-2.5 text-xs focus:outline-none focus:border-editorial-rust focus:ring-1 focus:ring-editorial-rust/20 transition-all font-sans"
                  />
                </div>
                <div className="md:col-span-4">
                  <select
                    id="search-county-select"
                    value={selectedCounty}
                    onChange={(e) => setSelectedCounty(e.target.value)}
                    className="w-full bg-editorial-bg border border-editorial-card text-editorial-ink rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-editorial-rust focus:ring-1 focus:ring-editorial-rust/20 transition cursor-pointer font-sans"
                  >
                    {counties.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
      
              {/* Results Area */}
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                <AnimatePresence mode="popLayout">
                  {searchResults.length > 0 ? (
                    searchResults.map((record) => (
                      <motion.div
                        key={record.id}
                        layout
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="group bg-editorial-bg hover:bg-editorial-card/30 border border-editorial-card hover:border-editorial-rust/35 p-4 rounded-xl transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-mono text-editorial-muted uppercase tracking-wider bg-editorial-card px-2 py-0.5 rounded border border-editorial-card/85">
                              {record.county}
                            </span>
                            <span className={`text-[9px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                              record.status === 'Unclaimed' 
                                ? 'bg-emerald-100 border-emerald-200 text-emerald-800' 
                                : record.status === 'In Audit'
                                  ? 'bg-amber-100 border-amber-200 text-amber-800'
                                  : 'bg-editorial-card border-editorial-card text-editorial-muted'
                            }`}>
                              {record.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-editorial-ink font-sans truncate">
                            {record.address}
                          </h4>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-editorial-muted font-mono">
                            <span className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-editorial-rust" />
                              Owner: <span className="text-editorial-ink">{record.ownerName}</span>
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-editorial-rust" />
                              Auction: <span className="text-editorial-ink">{record.auctionDate}</span>
                            </span>
                          </div>
                        </div>
      
                        <div className="flex items-center md:flex-col items-end gap-3 md:gap-2 self-stretch md:self-auto justify-between border-t md:border-t-0 border-editorial-card/80 md:pt-0 pt-2.5">
                          <div className="text-left md:text-right">
                            <p className="text-[9px] font-mono text-editorial-muted uppercase">UNCLAIMED SURPLUS</p>
                            <p className="text-base font-bold text-emerald-700 font-mono">
                              ${record.surplusAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                          {record.status === 'Unclaimed' ? (
                            <button
                              id={`btn-claim-${record.id}`}
                              onClick={() => onSelectRecord(record.address, record.county)}
                              className="flex items-center gap-1 bg-editorial-rust hover:bg-editorial-ink text-white font-sans uppercase font-bold text-[10px] tracking-wide px-3.5 py-1.5 rounded-md transition duration-200 cursor-pointer"
                            >
                              <span>Claim Funds</span>
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                            </button>
                          ) : (
                            <span className="text-xs text-editorial-muted font-mono italic">Protected</span>
                          )}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10 space-y-2">
                      <Info className="w-8 h-8 text-editorial-rust mx-auto" />
                      <p className="text-sm text-editorial-ink font-serif font-bold">No matching county surplus properties discovered.</p>
                      <p className="text-xs text-editorial-muted">Try modifying your query filters or county boundaries.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
      
              <div className="bg-editorial-bg p-4 rounded-xl border border-editorial-card/60 flex items-start gap-2.5">
                <Coins className="w-5 h-5 text-editorial-rust shrink-0 mt-0.5" />
                <p className="text-[11px] text-editorial-muted leading-normal">
                  ⚖️ <strong className="text-editorial-ink">County Policy Reminder:</strong> Under state surplus asset rules, excessive bid capital from tax foreclosure acts as private equity belonging to the original home title holder. State and County treasuries will absorb these funds if no formal abstracting claim is filed during the statutory window, which sometimes expires in as little as 60-90 days.
                </p>
              </div>
            </div>
      
            {/* Right: Lead Case Tracking Panel */}
            <div className="lg:col-span-5 bg-editorial-paper border border-editorial-card rounded-2xl p-6 shadow-sm space-y-6">
              <div className="space-y-1.5 border-b border-editorial-ink/10 pb-4">
                <h3 className="text-base font-serif font-bold text-editorial-ink flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-editorial-rust" />
                  Auditing Tracker Toolbar
                </h3>
                <p className="text-xs text-editorial-muted">
                  Check your pending contingency application progression.
                </p>
              </div>
      
              {/* Search Box */}
              <form onSubmit={handleTrackCase} className="space-y-2">
                <label className="block text-[10px] font-mono font-bold text-editorial-muted">
                  ENTER PRIVATE CASE NUMBER
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="case-tracker-input"
                    placeholder="e.g., SF-SAMPLE, SF-948210..."
                    value={trackedCaseNumber}
                    onChange={(e) => setTrackedCaseNumber(e.target.value)}
                    className="flex-1 bg-editorial-bg border border-editorial-card text-editorial-ink placeholder:text-editorial-muted/70 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-editorial-rust font-mono"
                  />
                  <button
                    type="submit"
                    id="btn-track-case"
                    className="bg-editorial-ink hover:bg-editorial-rust text-editorial-paper px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition duration-200 cursor-pointer"
                  >
                    Query
                  </button>
                </div>
                
                {trackingError && (
                  <p className="text-[11px] text-editorial-rust leading-normal bg-editorial-rust/5 border border-editorial-rust/20 p-2.5 rounded">
                    ⚠️ {trackingError}
                  </p>
                )}
              </form>
      
              {/* Tracking Case Timeline Block */}
              <AnimatePresence mode="wait">
                {trackingRecord ? (
                  <motion.div
                    key="tracking-info"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-editorial-bg border border-editorial-card rounded-xl p-4 space-y-4"
                  >
                    {/* Header detail */}
                    <div className="flex justify-between items-start gap-3 border-b border-editorial-card/80 pb-3">
                      <div className="min-w-0">
                        <p className="text-[8px] font-mono text-editorial-muted">ACTIVE DOCKET</p>
                        <h4 className="text-xs font-bold text-editorial-ink truncate">{trackingRecord.address}</h4>
                        <p className="text-[9px] text-editorial-muted font-mono">Owner: {trackingRecord.ownerName}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-1 rounded font-bold">
                          ${trackingRecord.estimatedFunds.toLocaleString()}
                        </span>
                        <p className="text-[9px] text-editorial-muted font-mono mt-1">Submitted: {trackingRecord.submittedAt}</p>
                      </div>
                    </div>
      
                    {/* Vertical Timeline Steps */}
                    <div className="space-y-4 pt-1">
                      {trackingRecord.steps.map((step: any, idx: number) => {
                        const isCompleted = step.status === 'completed';
                        const isActive = step.status === 'active';
      
                        return (
                          <div key={idx} className="flex gap-3">
                            {/* Dot column */}
                            <div className="flex flex-col items-center">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-mono font-bold shrink-0 transition-colors duration-300 ${
                                isCompleted 
                                  ? 'bg-emerald-100 border-emerald-200 text-emerald-800'
                                  : isActive
                                    ? 'bg-amber-100 border-amber-200 text-amber-800 animate-pulse font-bold'
                                    : 'bg-editorial-bg border-editorial-card text-editorial-muted'
                              }`}>
                                {isCompleted ? (
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                ) : isActive ? (
                                  <Clock className="w-3.5 h-3.5" />
                                ) : (
                                  <span>{idx + 1}</span>
                                )}
                              </div>
                              {idx < trackingRecord.steps.length - 1 && (
                                <div className={`w-0.5 h-10 my-1 ${
                                  isCompleted ? 'bg-emerald-600/35' : 'bg-editorial-card'
                                }`} />
                              )}
                            </div>
      
                            {/* Text and status */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`text-xs font-medium uppercase tracking-tight ${
                                  isActive ? 'text-editorial-rust font-bold' : isCompleted ? 'text-editorial-ink' : 'text-editorial-muted'
                                }`}>
                                  {step.name}
                                </span>
                                <span className="text-[9px] font-mono text-editorial-muted shrink-0">
                                  {step.duration}
                                </span>
                              </div>
                              <p className="text-[10px] text-editorial-muted mt-0.5 leading-normal">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
      
                    {/* Performance message */}
                    <div className="flex items-center gap-2 bg-editorial-card/35 border border-editorial-card/60 p-2.5 rounded-lg text-[10px] text-editorial-muted">
                      <ShieldCheck className="w-4 h-4 text-editorial-rust shrink-0" />
                      <span>Bonded representative managing county abstracts on contingency.</span>
                    </div>
                  </motion.div>
                ) : (
                  // Empty View placeholders
                  <div className="bg-editorial-bg border border-editorial-card rounded-xl p-8 text-center space-y-2 text-editorial-muted font-sans">
                    <ClipboardList className="w-10 h-10 text-editorial-rust/50 mx-auto" />
                    <p className="text-xs font-bold text-editorial-ink uppercase tracking-wider">No cases queried yet</p>
                    <p className="text-[10px] max-w-[220px] mx-auto leading-normal">
                      Submit a form in the intake sector, or insert <strong>SF-948210</strong> or <strong>SF-COMPLETE</strong> above for a preview.
                    </p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          /* Live AI Forensic Claims Assistance Area */
          <motion.div
            key="ai-advisor"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
          >
            {/* Left Portion: Active Conversational Console */}
            <div className="lg:col-span-8 bg-editorial-paper border border-editorial-card rounded-2xl shadow-sm overflow-hidden flex flex-col h-[520px]">
              
              {/* Chat Header bar */}
              <div className="bg-editorial-bg px-5 py-4 border-b border-editorial-card flex items-center justify-between gap-4 font-sans">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 bg-editorial-ink text-editorial-rust rounded-full flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-editorial-rust" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-editorial-ink">Lanceview Forensics AI Advisor</h3>
                    <p className="text-[10px] text-editorial-muted flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse inline-block" />
                      Online • Grounded in County Records Index
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setMessages([
                      {
                        role: 'assistant',
                        content: "Hello! I am your Lanceview Forensics AI Advisor. I have real-time access to our proprietary surplus database of unclaimed foreclosure and tax sale proceeds.\n\nTell me your name, an address, or a county you are interested in (such as Duval, Orange, Fulton, or Los Angeles County), and I'll immediately search for potential matches and guide you on zero-risk recovery options!"
                      }
                    ]);
                  }}
                  className="text-[10px] underline hover:text-editorial-rust text-editorial-muted font-bold tracking-wider uppercase transition cursor-pointer"
                >
                  Reset Consultation
                </button>
              </div>

              {/* Chat Messages Log Area */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 scroll-container bg-editorial-paper">
                {messages.map((msg, index) => {
                  const isUser = msg.role === 'user';
                  const parsed = parseClaimCards(msg.content);

                  return (
                    <div
                      key={index}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                      <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl p-4 text-xs md:text-sm leading-relaxed space-y-3 ${
                        isUser
                          ? 'bg-editorial-ink text-editorial-paper rounded-tr-none'
                          : 'bg-editorial-bg text-editorial-ink rounded-tl-none border border-editorial-card/60'
                      }`}>
                        
                        {/* Print Cleaned Text Response */}
                        <div className="whitespace-pre-wrap font-sans">
                          {parsed.text}
                        </div>

                        {/* If matching unclaimed record tags were discovered, render rich claim card */}
                        {parsed.cards.length > 0 && (
                          <div className="space-y-2 mt-3 pt-3 border-t border-editorial-card/60">
                            <span className="text-[10px] font-mono uppercase tracking-widest text-editorial-rust block font-bold">
                              Verified Registry Matches Found:
                            </span>
                            
                            {parsed.cards.map((card, cIndex) => (
                              <div 
                                key={cIndex}
                                className="bg-editorial-paper border border-editorial-rust/50 rounded-xl p-3.5 space-y-3 shadow-sm hover:border-editorial-rust transition duration-200 text-editorial-ink"
                              >
                                <div className="flex justify-between items-start gap-2">
                                  <div>
                                    <p className="text-[8px] font-mono text-editorial-rust bg-editorial-rust/5 border border-editorial-rust/20 px-1.5 py-0.5 rounded inline-block font-semibold">
                                      {card.county} Official Docket
                                    </p>
                                    <h5 className="text-xs font-bold font-sans mt-1.5">{card.address}</h5>
                                    <p className="text-[10px] text-editorial-muted mt-0.5">Title Owner of Record: <strong>{card.owner}</strong></p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <p className="text-[8px] font-mono text-editorial-muted uppercase">Unclaimed Surplus</p>
                                    <p className="text-sm font-black text-emerald-800 font-mono">
                                      ${card.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-editorial-card pt-3 text-[11px]">
                                  <span className="text-editorial-muted font-mono leading-tight">
                                    🛡️ 100% Contingency (No upfront fees)
                                  </span>
                                  <button
                                    onClick={() => onSelectRecord(card.address, card.county)}
                                    className="flex items-center justify-center gap-1.5 bg-editorial-rust hover:bg-editorial-ink text-white font-sans uppercase font-bold text-[10px] tracking-wider px-3.5 py-2 rounded-lg transition duration-200 cursor-pointer shadow-sm shrink-0"
                                  >
                                    <span>Initiate Assisted Recovery</span>
                                    <ArrowUpRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}

                {chatLoading && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-editorial-bg text-editorial-muted rounded-2xl rounded-tl-none p-4 text-xs font-sans border border-editorial-card flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-editorial-rust opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-editorial-rust"></span>
                      </span>
                      <span>Auditor Agent index search in progress...</span>
                    </div>
                  </div>
                )}

                {chatError && (
                  <div className="bg-editorial-rust/5 border border-editorial-rust/35 p-3 rounded-xl text-xs text-editorial-rust">
                    ⚠️ {chatError}
                  </div>
                )}
                
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input form bar */}
              <form onSubmit={handleChatSubmit} className="p-4 bg-editorial-bg border-t border-editorial-card flex gap-2">
                <input
                  type="text"
                  placeholder="Type a query (e.g. 'Search for Peterson' or 'How do I claim money?')"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  disabled={chatLoading}
                  className="flex-1 bg-editorial-paper border border-editorial-card text-editorial-ink placeholder:text-editorial-muted/75 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:border-editorial-rust-gold focus:ring-1 focus:ring-editorial-rust/15 font-sans"
                />
                <button
                  type="submit"
                  disabled={chatLoading || !chatInput.trim()}
                  className="bg-editorial-ink hover:bg-editorial-rust disabled:bg-editorial-card disabled:text-editorial-muted text-editorial-paper font-sans text-xs uppercase font-extrabold px-5 rounded-xl transition duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Send</span>
                </button>
              </form>

            </div>

            {/* Right Portion: Quick advisory & FAQs Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Smart query helper triggers */}
              <div className="bg-editorial-paper border border-editorial-card rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-mono uppercase tracking-widest text-editorial-rust font-bold flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-editorial-rust" />
                  Suggested AI Searches
                </h4>
                <p className="text-[11px] text-editorial-muted leading-relaxed">
                  Click any query below to pre-populate the search console and check local dockets immediately:
                </p>
                
                <div className="space-y-2 font-sans text-xs">
                  <button
                    onClick={() => handleSendQuickQuery('Search for James Peterson')}
                    disabled={chatLoading}
                    className="w-full text-left bg-editorial-bg hover:bg-editorial-card/45 border border-editorial-card p-2.5 rounded-lg text-editorial-ink transition duration-150 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>🔍 James Peterson (Duval County claim)</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-editorial-rust" />
                  </button>

                  <button
                    onClick={() => handleSendQuickQuery('Search for Orange County')}
                    disabled={chatLoading}
                    className="w-full text-left bg-editorial-bg hover:bg-editorial-card/45 border border-editorial-card p-2.5 rounded-lg text-editorial-ink transition duration-150 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>📍 Search Orange County Florida Claims</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-editorial-rust" />
                  </button>

                  <button
                    onClick={() => handleSendQuickQuery('Explain the contingency model')}
                    disabled={chatLoading}
                    className="w-full text-left bg-editorial-bg hover:bg-editorial-card/45 border border-editorial-card p-2.5 rounded-lg text-editorial-ink transition duration-150 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>⚖️ What is our 100% contingency model?</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-editorial-rust" />
                  </button>

                  <button
                    onClick={() => handleSendQuickQuery('How do I claim surplus as inheritance heir')}
                    disabled={chatLoading}
                    className="w-full text-left bg-editorial-bg hover:bg-editorial-card/45 border border-editorial-card p-2.5 rounded-lg text-editorial-ink transition duration-150 flex items-center justify-between gap-2 cursor-pointer"
                  >
                    <span>👤 Can an legal heir claim family funds?</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 text-editorial-rust" />
                  </button>
                </div>
              </div>

              {/* Trust Metric banner */}
              <div className="bg-editorial-paper border border-editorial-card rounded-2xl p-5 shadow-sm space-y-3 font-sans">
                <h4 className="text-xs font-mono uppercase tracking-widest text-editorial-ink font-bold flex items-center gap-11.5">
                  <TrendingUp className="w-4 h-4 text-emerald-700 shrink-0" />
                  Lanceview Safety Promise
                </h4>
                <div className="text-[11px] text-editorial-muted leading-relaxed space-y-2">
                  <p>
                    Unlike third-party agencies, Lanceview works with bonded attorneys to draft court petitions. We provide full state notary coverage and absorb all docket recording expenses.
                  </p>
                  <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg text-emerald-800 text-[10px] font-semibold">
                    ✅ $1.2M+ in forensics surplus assets successfully disbursed to date.
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
