import { NextRequest, NextResponse } from 'next/server';
import { checkAdminPasscode } from '@/lib/adminAuth';
import { listEnquiries } from '@/lib/enquiryStore';

export async function GET(req: NextRequest) {
  if (!(await checkAdminPasscode(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const enquiries = await listEnquiries();
  return NextResponse.json({ count: enquiries.length, enquiries });
}
