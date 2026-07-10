import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import nodemailer from 'nodemailer';

// Initialize environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Set up Nodemailer transporter (User will need to provide real SMTP credentials)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password',
  },
});

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

// Function to handle sending the inquiry email
async function sendInquiryEmail(name: string, email: string, phone: string, details: string) {
  const mailOptions = {
    from: process.env.SMTP_USER || 'your-email@gmail.com',
    to: 'info@lanceviewconsulting.com',
    subject: `New Lead Inquiry from AI Advisor: ${name}`,
    text: `
      You have received a new inquiry via the Lanceview AI Advisor.

      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      
      Inquiry Details:
      ${details}
      
      Please reach out to them as soon as possible.
    `,
  };

  console.log('Attempting to send email to info@lanceviewconsulting.com with details:', { name, email, phone, details });
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials not configured. Email logged to console but not sent.");
    return { success: true, message: "Email logged to console (SMTP not configured)." };
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log('Inquiry email sent successfully.');
    return { success: true, message: "Email sent successfully." };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: "Failed to send email." };
  }
}

async function sendAcknowledgementEmail(name: string, email: string, type: 'funds' | 'b2b') {
  const isFunds = type === 'funds';
  const mailOptions = {
    from: process.env.SMTP_USER || 'info@lanceviewconsulting.com',
    to: email,
    subject: isFunds ? 'Lanceview Consulting - Surplus Funds Inquiry Received' : 'Lanceview Consulting - B2B Inquiry Received',
    text: `Dear ${name},

Thank you for reaching out to Lanceview Consulting LLC. We have successfully received your ${isFunds ? 'Surplus Funds Recovery' : 'B2B Real Estate'} inquiry.

One of our specialized auditors will review your details and contact you shortly to discuss the next steps.

If you have any immediate questions, please feel free to reply to this email or call us at (601) 568-8374.

Best Regards,
The Lanceview Consulting Team
info@lanceviewconsulting.com
(601) 568-8374`,
  };

  console.log(`Attempting to send acknowledgement email to ${email}`);
  
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials not configured. Acknowledgement email logged to console but not sent.");
    return { success: true };
  }

  try {
    await transporter.sendMail(mailOptions);
    console.log('Acknowledgement email sent successfully.');
    return { success: true };
  } catch (error) {
    console.error('Error sending acknowledgement email:', error);
    return { success: false, error };
  }
}

app.post('/api/send-acknowledgement', async (req, res) => {
  const { name, email, type } = req.body;
  if (!name || !email || !type) {
    return res.status(400).json({ error: 'Missing required fields: name, email, type' });
  }

  const result = await sendAcknowledgementEmail(name, email, type);
  if (result.success) {
    res.json({ success: true });
  } else {
    res.status(500).json({ error: 'Failed to send acknowledgement email' });
  }
});

// Chat response API route
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages payload is required and must be an array.' });
    }

    const ai = getGeminiClient();
    
    // Map existing history to Gemini contents structure
    let contents = messages.map((msg: any) => {
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content || '' }]
      };
    });

    const systemInstruction = `You are the "Lanceview Forensics Advisor", an elite smart AI assistant representing Lanceview Consulting LLC. 

YOUR OBJECTIVE:
Help clients search for unclaimed foreclosure or tax surplus assets that counties or banks may be holding, answer simple questions about our services, and collect their data (Name, Email, Phone) to submit a formal inquiry to our business team.

OUR CORE SERVICES:
1. Surplus Funds Recovery: We represent property record holders and heirs on strict 100% contingency (zero fee upfront, we absorb attorney expenses & filings, clients owe zero unless we successfully recover their money).
2. B2B Real Estate & Section 8 HUD Compliance (HQS Testing / Tenant Prep).

LANCEVIEW FORENSICS REGISTRY DATABASE:
We monitor daily foreclosure entries and actively index the following records:
${JSON.stringify(mockCountyRecords, null, 2)}

INTERACTION INSTRUCTIONS:
- Be incredibly professional, reassuring, clear, and focused on building trust.
- Actively help users search for claims. If they mention a county, a matching name, or a property address, search the database above.
- If they ask general questions about recovery, answer clearly using your knowledge of excess proceeds/auditing rules.
- IMPORTANT: Once you have answered their initial questions, or if they express interest in proceeding, ask for their Name, Email Address, and Phone Number to have an auditor contact them.
- Once the user provides their Name, Email, and Phone Number, you MUST call the "submit_inquiry" tool with those details and a brief summary of their situation.
- After calling the tool, confirm to the user that their inquiry has been forwarded to the Lanceview team (info@lanceviewconsulting.com and (601) 568-8374).`;

    const chatConfig = {
      systemInstruction,
      temperature: 0.7,
      tools: [{
        functionDeclarations: [{
          name: 'submit_inquiry',
          description: 'Submit a user inquiry to the Lanceview Consulting business team.',
          parameters: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING', description: 'Full name of the prospect' },
              email: { type: 'STRING', description: 'Email address of the prospect' },
              phone: { type: 'STRING', description: 'Phone number of the prospect' },
              details: { type: 'STRING', description: 'Summary of the user inquiry or situation' }
            },
            required: ['name', 'email', 'phone', 'details']
          }
        }]
      }]
    };

    // Call Gemini 3.5 Flash model
    let response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: chatConfig
    });
    
    let inquiryData = null;

    // Handle function calling if the model decides to use the tool
    if (response.functionCalls && response.functionCalls.length > 0) {
      const call = response.functionCalls[0];
      if (call.name === 'submit_inquiry') {
        const { name, email, phone, details } = call.args as any;
        inquiryData = { name, email, phone, details };
        const result = await sendInquiryEmail(name, email, phone, details);
        
        // Append the model's function call and the tool response to the history to generate the final response
        contents.push({
          role: 'model',
          parts: [{ functionCall: call }]
        });
        
        contents.push({
          role: 'user',
          parts: [{
            functionResponse: {
              name: 'submit_inquiry',
              response: { result: result.message }
            }
          }]
        });
        
        // Generate final response telling the user it was sent
        response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: contents,
          config: chatConfig
        });
      }
    }

    res.json({ 
      text: response.text || "I apologize, I encountered an issue retrieving an advice transcript.",
      inquiryData
    });
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
