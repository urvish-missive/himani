// Lead types and labels shared by the public forms and the admin panel.
// API calls live in src/store/leadsApi.ts (RTK Query).

export type LeadSource = 'virtual-cmo' | 'founder-coaching' | 'team-training' | 'speaking';
export type LeadStatus = 'new' | 'contacted' | 'won' | 'lost';

export const LEAD_SOURCES: Record<LeadSource, string> = {
  'virtual-cmo': 'Virtual CMO',
  'founder-coaching': 'Founder Coaching',
  'team-training': 'Team Training',
  speaking: 'Speaking',
};

export const LEAD_STATUSES: LeadStatus[] = ['new', 'contacted', 'won', 'lost'];

export interface LeadInput {
  source: LeadSource;
  name: string;
  email: string;
  company?: string;
  message?: string;
  /** Form-specific answers, shown as label/value pairs in the admin panel. */
  details?: Record<string, string>;
}

export interface Lead {
  id: string;
  source: LeadSource;
  name: string;
  email: string;
  company: string;
  message: string;
  details: Record<string, string>;
  status: LeadStatus;
  page: string;
  /** Epoch millis; null until the server timestamp is written. */
  createdAt: number | null;
  /** Private admin notes; never shown to the visitor. */
  notes: string;
  updatedAt: number | null;
}

/** Must match the limits in firestore.rules, or valid-looking submissions get rejected. */
export const LEAD_LIMITS = { name: 120, email: 200, company: 160, message: 2000 } as const;

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Returns a visitor-facing error message, or null when the lead can be saved. */
export function validateLead(input: LeadInput): string | null {
  const name = input.name.trim();
  const email = input.email.trim();
  if (!name) return 'Add your name so I know who I am speaking with.';
  if (name.length > LEAD_LIMITS.name) return `Keep your name under ${LEAD_LIMITS.name} characters.`;
  if (!EMAIL_RE.test(email) || email.length > LEAD_LIMITS.email) return 'Add a valid email so I can reply.';
  if ((input.company ?? '').trim().length > LEAD_LIMITS.company) return `Keep the company name under ${LEAD_LIMITS.company} characters.`;
  if ((input.message ?? '').trim().length > LEAD_LIMITS.message) return `Keep your message under ${LEAD_LIMITS.message} characters.`;
  return null;
}
