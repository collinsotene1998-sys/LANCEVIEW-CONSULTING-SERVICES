import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Inlined county records to ensure server-side availability for AI context
const mockCountyRecords = [
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
    ownerName: 'Sarah Jenkins',
    auctionDate: '2026-04-10',
    surplusAmount: 76300.00,
    status: 'Unclaimed'
  }
];

// Lazy initialize Gemini client to prevent startup crashes when the API key is temporarily unavailable
let aiClient: GoogleGenAI | null = null;
function getGeminiClient() {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({
      apiKey: key || "MOCK_KEY",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Chat response API route
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages payload is required and must be an array.' });
    }

    const ai = getGeminiClient();
    
    // Map existing history to Gemini contents structure
    const contents = messages.map((msg: any) => {
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content || '' }]
      };
    });

    const systemInstruction = `You are the "Lanceview Forensics Advisor", an elite smart AI assistant representing Lanceview Consulting LLC. 

YOUR OBJECTIVE:
Help clients search for unclaimed foreclosure or tax surplus assets that counties or banks may be holding, and guide them on initiating a zero-upfront contingency recovery claim with Lanceview.

OUR CORE SERVICES:
1. Surplus Funds Recovery: We represent property record holders and heirs on strict 100% contingency (zero fee upfront, we absorb attorney expenses & filings, clients owe zero unless we successfully recover their money).
2. B2B Real Estate & Section 8 HUD Compliance (HQS Testing / Tenant Prep).

LANCEVIEW FORENSICS REGISTRY DATABASE:
We monitor daily foreclosure entries and actively index the following records:
${JSON.stringify(mockCountyRecords, null, 2)}

INTERACTION INSTRUCTIONS:
- Be incredibly professional, reassuring, clear, and focused on building trust.
- Actively help users search for claims. If they mention a county (like Duval, Orange, Fulton, Los Angeles, etc.), a matching name (like Mitchell, Peterson, Vance, Sterling, Reynolds, etc.), or a property address, search the database above.
- If they ask general questions about recovery, answer clearly using your knowledge of excess proceeds/auditing rules. Encourage them to verify their property.
- When you find a matching database record with "status" equal to "Unclaimed", ALWAYS print details professionally and append the EXACT special claims trigger format at the very end of your response:
  [CLAIM_CARD:id="ID_HERE";address="ADDRESS_HERE";county="COUNTY_HERE";owner="OWNER_HERE";amount=AMOUNT_HERE]
  
  Example claim triggers:
  - For rec-001: [CLAIM_CARD:id="rec-001";address="412 N Pine Street, Orlando, FL 32801";county="Orange County";owner="Margaret H. Mitchell";amount=64150]
  - For rec-002: [CLAIM_CARD:id="rec-002";address="8914 Whispering Oaks Lane, Jacksonville, FL 32210";county="Duval County";owner="James L. Peterson";amount=112450]
  - For rec-003: [CLAIM_CARD:id="rec-003";address="105 Orchard Ave, Tampa, FL 33603";county="Hillsborough County";owner="Arthur Vance Jr.";amount=48900]
  - For rec-005: [CLAIM_CARD:id="rec-005";address="710 East Lake Drive, Decatur, GA 30030";county="DeKalb County";owner="Walter Miller Estate";amount=95600]
  
- The front-end chat interface will detect this tag to show a high-end clickable Claim Card with a primary button to "Initiate Assisted Recovery".
- If no matching records exist, invite them to submit their general property search query directly into the secure intake form dynamically, and offer to have our auditors evaluate their case for free. No pressure, ever.`;

    // Call Gemini 3.5 Flash model
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text || "I apologize, I encountered an issue retrieving an advice transcript." });
  } catch (error: any) {
    console.error('Gemini API Integration Error:', error);
    res.status(500).json({ error: error.message || 'Failed to communicate with AI Advisor.' });
  }
});

// Configure Vite middleware in development or static fallback in production
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Express with Vite Development Middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Setting up Express in production mode serving static artifacts...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Lanceview Full-Stack Server active on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
