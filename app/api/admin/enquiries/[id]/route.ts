import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPasscode } from '@/lib/adminAuth';
import {
  deleteEnquiry,
  getEnquiry,
  saveEnquiry,
  type EnquiryStatus,
} from '@/lib/enquiryStore';

const VALID_STATUSES = new Set<EnquiryStatus>(['new', 'replied', 'archived']);

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminPasscode(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  const enquiry = await getEnquiry(id);
  if (!enquiry) {
    return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
  }
  return NextResponse.json({ enquiry });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminPasscode(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  const existing = await getEnquiry(id);
  if (!existing) {
    return NextResponse.json({ error: 'Enquiry not found' }, { status: 404 });
  }
  const body = await req.json();
  const status = String(body?.status || '') as EnquiryStatus;
  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }
  const updated = await saveEnquiry({
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  });
  return NextResponse.json({ ok: true, enquiry: updated });
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (!(await checkAdminPasscode(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { id } = await context.params;
  await deleteEnquiry(id);
  return NextResponse.json({ ok: true });
}
