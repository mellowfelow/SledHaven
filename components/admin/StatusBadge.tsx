import React from 'react';
import {
  CheckCircle2,
  Clock,
  MailCheck,
  PackageCheck,
  XCircle,
} from 'lucide-react';

const STATUS_MAP: Record<
  string,
  { label: string; textClass: string; Icon: React.ComponentType<{ className?: string }> }
> = {
  new: { label: 'New', textClass: 'text-[#835931]', Icon: Clock },
  payment_sent: { label: 'Payment Sent', textClass: 'text-sky-700', Icon: MailCheck },
  payment_confirmed: { label: 'Payment Confirmed', textClass: 'text-emerald-700', Icon: CheckCircle2 },
  dispatched: { label: 'Dispatched', textClass: 'text-slate-900', Icon: PackageCheck },
  cancelled: { label: 'Cancelled', textClass: 'text-red-700', Icon: XCircle },
  replied: { label: 'Replied', textClass: 'text-emerald-700', Icon: CheckCircle2 },
  archived: { label: 'Archived', textClass: 'text-slate-500', Icon: PackageCheck },
};

export default function StatusBadge({ status }: { status: string }) {
  const entry = STATUS_MAP[status] || {
    label: status,
    textClass: 'text-slate-600',
    Icon: Clock,
  };
  const { Icon } = entry;

  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${entry.textClass}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{entry.label}</span>
    </span>
  );
}
