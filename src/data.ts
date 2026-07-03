/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CountyRecord } from './types';

export const mockCountyRecords: CountyRecord[] = [
  {
    id: 'rec-001',
    address: '412 N Pine Street, Orlando, FL 32801',
    county: 'Orange County',
    ownerName: 'Margaret H. Mitchell',
    auctionDate: '2025-10-12',
    surplusAmount: 64150.00,
    status: 'Unclaimed'
  },
  {
    id: 'rec-002',
    address: '8914 Whispering Oaks Lane, Jacksonville, FL 32210',
    county: 'Duval County',
    ownerName: 'James L. Peterson',
    auctionDate: '2025-12-05',
    surplusAmount: 112450.00,
    status: 'Unclaimed'
  },
  {
    id: 'rec-003',
    address: '105 Orchard Ave, Tampa, FL 33603',
    county: 'Hillsborough County',
    ownerName: 'Arthur Vance Jr.',
    auctionDate: '2026-02-18',
    surplusAmount: 48900.00,
    status: 'Unclaimed'
  },
  {
    id: 'rec-004',
    address: '2234 SW 15th Street, Miami, FL 33145',
    county: 'Miami-Dade County',
    ownerName: 'Renata Alvarez Estebes',
    auctionDate: '2025-11-20',
    surplusAmount: 185200.00,
    status: 'In Audit'
  },
  {
    id: 'rec-005',
    address: '710 East Lake Drive, Decatur, GA 30030',
    county: 'DeKalb County',
    ownerName: 'Walter Miller Estate',
    auctionDate: '2026-01-08',
    surplusAmount: 95600.00,
    status: 'Unclaimed'
  },
  {
    id: 'rec-006',
    address: '1422 Peachtree St NE, Atlanta, GA 30309',
    county: 'Fulton County',
    ownerName: 'Cynthia Marie Reynolds',
    auctionDate: '2026-03-02',
    surplusAmount: 137400.00,
    status: 'Unclaimed'
  },
  {
    id: 'rec-007',
    address: '389 S Broadway, Gary, IN 46402',
    county: 'Lake County',
    ownerName: 'Thomas & Beverly Higgins',
    auctionDate: '2025-08-14',
    surplusAmount: 32890.00,
    status: 'Claim Filed'
  },
  {
    id: 'rec-008',
    address: '525 W Arlington Place, Chicago, IL 60614',
    county: 'Cook County',
    ownerName: 'Sherman Capital Holdings LLC',
    auctionDate: '2025-09-30',
    surplusAmount: 420900.00,
    status: 'Claim Filed'
  },
  {
    id: 'rec-009',
    address: '1702 E Maple Ave, El Segundo, CA 90245',
    county: 'Los Angeles County',
    ownerName: 'Douglas P. Sterling',
    auctionDate: '2026-01-15',
    surplusAmount: 289100.00,
    status: 'Unclaimed'
  },
  {
    id: 'rec-010',
    address: '1105 Woodlawn Dr, Charlotte, NC 28209',
    county: 'Mecklenburg County',
    ownerName: 'The Estate of Sarah Jenkins',
    auctionDate: '2026-04-10',
    surplusAmount: 76300.00,
    status: 'Unclaimed'
  }
];

export interface FAQItem {
  id: string;
  qty: string;
  ans: string;
  category: 'funds' | 'b2b' | 'general';
}

export const faqItems: FAQItem[] = [
  {
    id: 'faq-1',
    qty: 'If the government is holding money that belongs to me, why haven\'t they sent it directly?',
    ans: 'County administrative agencies operate under system-wide bureaucracy. Treasurers are legally required to file notification elements, but they typically send notices to the very address that went to foreclosure. Because you no longer live at that address, notices go unread. Furthermore, government offices are not incentivized to actively track down missing owners because unclaimed assets eventually default directly into state or county general revenue funds.',
    category: 'funds'
  },
  {
    id: 'faq-2',
    qty: 'How can you afford to not charge any upfront retainers? What\'s the catch?',
    ans: 'We operate strictly on a contingency fee model. We are confident in our forensic auditing systems. Before we contact you, we have already audited the public records and verified that excess funds exist. We absorb every single line-item expense—attorney evaluations, background checks, record pull costs, notary tracking, and document filing fees. If we fail to successfully deliver your check, our company absorbs the full financial loss. You never write us a check out of pocket.',
    category: 'funds'
  },
  {
    id: 'faq-3',
    qty: 'Can I just attempt to claim these surplus funds by myself?',
    ans: 'Yes, you can technically file a claim independently with the Clerk of Courts. However, navigating the legal requirements can be complex. You must correctly execute a series of motions, present precise title evidence proving no other liens outrank you, and appear before a judge or magistrate. If a previous credit card vendor, second mortgage holder, or HOA files a competing motion, you must legally contest them. A single technical error can result in your claim being permanently denied. Our team handles everything to ensure your claim is approved.',
    category: 'funds'
  },
  {
    id: 'faq-4',
    qty: 'How does your Section 8 consulting integrate with your contracting wing?',
    ans: 'Most landlords lose thousands of dollars in rental income because they fail their initial Public Housing Authority (PHA) inspection, delaying tenant move-in dates by months. We solve this completely. Our consulting arm determines exactly what structural modifications are needed to meet strict federal Housing Quality Standards (HQS). Then, our investor-friendly contracting crew immediately executes those exact repairs. We provide a seamless, end-to-end service that transforms your property into a highly profitable, voucher-backed asset.',
    category: 'b2b'
  },
  {
    id: 'faq-5',
    qty: 'What exactly are "Surplus Proceeds" or "Excess Funds"?',
    ans: 'When a bank or the county auctions off a foreclosed/tax-delinquent property, the sale price often exceeds the mortgage balance or the unpaid tax bill. For instance, if you owed $150,000 on a home, and it sold for $250,000 at the foreclosure auction, there is a $100,000 surplus. By law, that surplus equity belongs to you, not the bank or state. But government offices have strict timelines to file a legal claim, usually between 60 days to a few months, before the state claims it permanently.',
    category: 'funds'
  },
  {
    id: 'faq-6',
    qty: 'Who is considered an "Heir" eligible to claim funds?',
    ans: 'If the owner of record has passed away, their heirs (children, surviving spouse, siblings, or other relatives specified in a will or through state intestacy law) have the legal right to retrieve the surplus capital. Our legal team is highly specialized in proving lineage, handling probate requirements, and clearing title hurdles to make claims successful for heirs.',
    category: 'general'
  },
  {
    id: 'faq-7',
    qty: 'What is HUD Housing Quality Standards (HQS) testing?',
    ans: 'HQS inspections ensure that Section 8 tenant properties are safe, sanitarily sound, and structurally secure before federal housing assistance payments are authorized. Failures usually stem from peeling paint, window seals, electrical wiring, or handrail safety. Our real estate contracting team does targeted inspections and makes precise, cost-effective adjustments to pass that HQS walk-through on the first attempt.',
    category: 'b2b'
  }
];
