import { hashDelete, hashGet, hashGetAll, hashSet } from '@/lib/redis';

export type EnquiryStatus = 'new' | 'replied' | 'archived';

export interface StoredEnquiry {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: 'contact' | 'financing' | 'general';
  status: EnquiryStatus;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  reply?: {
    subject: string;
    body: string;
    sentAt: string;
    emailSent: boolean;
  };
}

const ENQUIRIES_HASH = 'sledhaven:enquiries';

export function generateEnquiryId(): string {
  const now = new Date();
  const stamp = `${String(now.getFullYear()).slice(-2)}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ENQ-${stamp}-${rand}`;
}

export async function saveEnquiry(enquiry: StoredEnquiry): Promise<StoredEnquiry> {
  await hashSet(ENQUIRIES_HASH, enquiry.id, enquiry);
  return enquiry;
}

export async function getEnquiry(id: string): Promise<StoredEnquiry | null> {
  if (!id) return null;
  return hashGet<StoredEnquiry>(ENQUIRIES_HASH, id.trim().toUpperCase());
}

export async function listEnquiries(): Promise<StoredEnquiry[]> {
  const all = await hashGetAll<StoredEnquiry>(ENQUIRIES_HASH);
  return all.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function markEnquiryReplied(
  id: string,
  payload: { subject: string; body: string; emailSent: boolean }
): Promise<StoredEnquiry | null> {
  const existing = await getEnquiry(id);
  if (!existing) return null;
  const now = new Date().toISOString();
  const updated: StoredEnquiry = {
    ...existing,
    status: 'replied',
    updatedAt: now,
    reply: {
      subject: payload.subject,
      body: payload.body,
      sentAt: now,
      emailSent: payload.emailSent,
    },
  };
  await saveEnquiry(updated);
  return updated;
}

export async function deleteEnquiry(id: string): Promise<void> {
  await hashDelete(ENQUIRIES_HASH, id.trim().toUpperCase());
}
