/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface SurplusSubmission {
  id: string;
  address: string;
  county: string;
  connection: 'owner' | 'heir' | 'other';
  ownerName: string;
  phone: string;
  email: string;
  submittedAt: string;
  status: 'audit_pending' | 'title_clearing' | 'motion_filed' | 'funds_disbursed';
  caseNumber: string;
  estimatedFunds: number;
}

export interface B2BSubmission {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  portfolioSize: '1-5' | '6-20' | '21+';
  primaryGoal: 'section8' | 'contracting' | 'both';
  roadblockDescription: string;
  submittedAt: string;
  scheduledDate?: string;
}

export interface CountyRecord {
  id: string;
  address: string;
  county: string;
  ownerName: string;
  auctionDate: string;
  surplusAmount: number;
  status: 'Unclaimed' | 'In Audit' | 'Claim Filed' | 'Disbursed';
}
