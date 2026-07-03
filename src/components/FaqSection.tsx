/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp, Search, Layers } from 'lucide-react';
import { faqItems } from '../data';

export default function FaqSection() {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'All' | 'funds' | 'b2b'>('All');
  const [faqSearch, setFaqSearch] = useState('');

  const toggleAccordion = (id: string) => {
    setActiveFaq(prev => prev === id ? null : id);
  };

  const filteredFaqs = faqItems.filter(item => {
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesSearch = 
      item.qty.toLowerCase().includes(faqSearch.toLowerCase()) || 
      item.ans.toLowerCase().includes(faqSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in" id="faq-section">
      {/* FAQ Headers */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] font-mono text-editorial-muted uppercase tracking-widest bg-editorial-card/40 px-3 py-1 rounded inline-block border border-editorial-card">
          Direct-Response Credibility &amp; Compliance Register
        </span>
        <h3 className="text-2xl md:text-3xl font-serif font-bold text-editorial-ink tracking-tight">
          Trust Blocks &amp; Answers To Pressing Inquiries
        </h3>
        <p className="text-editorial-muted text-sm leading-relaxed">
          An intensive, direct FAQ block is mandatory for this specific business model to completely eliminate skepticism and answer compliance inquiries transparently.
        </p>
      </div>

      {/* Toolbar - Category selectors & Search query */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-editorial-paper border border-editorial-card p-4 rounded-xl max-w-3xl mx-auto">
        <div className="flex gap-2">
          {(['All', 'funds', 'b2b'] as const).map(cat => (
            <button
              key={cat}
              id={`btn-faq-cat-${cat}`}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10px] uppercase tracking-wider font-bold font-sans border transition cursor-pointer ${
                filterCategory === cat 
                  ? 'bg-editorial-ink border-editorial-ink text-editorial-paper' 
                  : 'bg-editorial-bg hover:bg-editorial-card/40 border-editorial-card text-editorial-muted'
              }`}
            >
              {cat === 'All' ? 'All Questions' : cat === 'funds' ? 'Surplus Recovery' : 'Section 8 & B2B'}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64 font-sans">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-editorial-muted">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            id="faq-search-input"
            placeholder="Search questions or answers..."
            value={faqSearch}
            onChange={(e) => setFaqSearch(e.target.value)}
            className="w-full bg-editorial-bg border border-editorial-card text-editorial-ink placeholder:text-editorial-muted/70 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-editorial-rust focus:ring-1 focus:ring-editorial-rust/20 transition"
          />
        </div>
      </div>

      {/* FAQs List Wrapper */}
      <div className="max-w-4xl mx-auto space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <motion.div
                  key={faq.id}
                  layoutId={faq.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-editorial-paper border rounded-xl overflow-hidden transition-all duration-300 ${
                    isOpen 
                      ? 'border-editorial-rust shadow-sm ring-1 ring-editorial-rust/10' 
                      : 'border-editorial-card hover:border-editorial-rust/40'
                  }`}
                >
                  {/* Button bar */}
                  <button
                    id={`btn-faq-toggle-${faq.id}`}
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-center justify-between text-left p-5 gap-4 font-sans focus:outline-none cursor-pointer"
                  >
                    <div className="flex gap-3">
                      <HelpCircle className={`w-5 h-5 mt-0.5 shrink-0 transition-colors ${
                        isOpen ? 'text-editorial-rust' : 'text-editorial-muted'
                      }`} />
                      <span className="text-sm font-semibold text-editorial-ink hover:text-editorial-rust transition leading-normal">
                        {faq.qty}
                      </span>
                    </div>
                    <span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-editorial-rust shrink-0" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-editorial-muted shrink-0" />
                      )}
                    </span>
                  </button>

                  {/* Desc area */}
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="bg-editorial-bg border-t border-editorial-card"
                      >
                        <p className="p-5 text-editorial-muted text-xs md:text-sm leading-relaxed whitespace-pre-line">
                          {faq.ans}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-sm text-editorial-muted">No matching credibility items found.</p>
              <button 
                onClick={() => { setFaqSearch(''); setFilterCategory('All'); }}
                className="text-xs text-editorial-rust font-bold hover:underline mt-1 cursor-pointer"
              >
                Clear Search Filter
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
