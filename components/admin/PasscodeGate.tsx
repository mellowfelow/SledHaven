'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowLeft, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { SITE } from '@/config/site';
import { useAdminPasscode } from '@/components/admin/AdminPasscodeContext';
import BrandLogo from '@/components/BrandLogo';

export default function PasscodeGate({ children }: { children: React.ReactNode }) {
  const { authenticated, setVerifiedPasscode } = useAdminPasscode();
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [mode, setMode] = useState<'env' | 'claimed' | 'unclaimed'>('env');
  const [passcodeInput, setPasscodeInput] = useState('');
  const [confirmInput, setConfirmInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/admin/status/')
      .then((res) => res.json())
      .then((data) => {
        if (!active) return;
        setMode(data.mode || 'env');
        setLoadingStatus(false);
      })
      .catch(() => {
        if (active) setLoadingStatus(false);
      });
    return () => {
      active = false;
    };
  }, []);

  if (authenticated) {
    return <>{children}</>;
  }

  async function handleClaimSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (passcodeInput.trim().length < 8) {
      setError('Choose a passcode of at least 8 characters.');
      return;
    }
    if (passcodeInput !== confirmInput) {
      setError('Passcodes do not match.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/status/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: passcodeInput }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Could not claim initial passcode.');
        setSubmitting(false);
        return;
      }
      setVerifiedPasscode(passcodeInput);
    } catch {
      setError('Network error setting up passcode.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!passcodeInput.trim()) {
      setError('Enter your admin passcode.');
      return;
    }

    setSubmitting(true);
    try {
      // Verify directly against passcode-gated orders endpoint (no separate /verify route)
      const res = await fetch('/api/admin/orders/', {
        headers: { 'X-Admin-Passcode': passcodeInput.trim() },
      });
      if (res.status === 401) {
        setError('Incorrect passcode. Please try again.');
        setSubmitting(false);
        return;
      }
      if (!res.ok) {
        setError('Unable to verify passcode right now.');
        setSubmitting(false);
        return;
      }
      setVerifiedPasscode(passcodeInput.trim());
    } catch {
      setError('Network error verifying passcode.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F7F5] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white border border-[#E4E6E8] rounded-lg overflow-hidden shadow-sm">
        <div
          className="px-6 py-5 text-white border-b-2"
          style={{
            backgroundColor: SITE.reply.brand.headerDark,
            borderColor: SITE.reply.brand.primary,
          }}
        >
          <BrandLogo tone="light" size="sm" />
          <p className="text-xs text-[#C2C8D0] mt-1.5">Reply Portal &amp; Order Desk</p>
        </div>

        <div className="p-6">
          {loadingStatus ? (
            <div className="py-10 flex items-center justify-center text-sm text-[#5C636E] gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Checking portal security...</span>
            </div>
          ) : mode === 'unclaimed' ? (
            <form onSubmit={handleClaimSubmit} className="space-y-4">
              <div className="flex items-start gap-2.5 p-3.5 rounded-md bg-[#FAF6F1] border border-[#E8DACB] text-xs text-[#4F3B27]">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#9A6B3E]" />
                <div>
                  <p className="font-semibold text-[#111418]">First-Run Admin Setup</p>
                  <p className="mt-1 leading-relaxed">
                    <code className="font-mono text-[11px]">ADMIN_PASSCODE</code> is not set in environment variables yet. Claim a temporary staff passcode below (hashed on the server with scrypt). Setting <code className="font-mono text-[11px]">ADMIN_PASSCODE</code> in Vercel/Secrets will override this automatically.
                  </p>
                </div>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-800">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="claim-pass" className="block text-xs font-medium text-[#111418] mb-1">
                  Create Admin Passcode (min. 8 characters)
                </label>
                <input
                  id="claim-pass"
                  type="password"
                  required
                  minLength={8}
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter strong staff passcode"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
                />
              </div>

              <div>
                <label htmlFor="claim-confirm" className="block text-xs font-medium text-[#111418] mb-1">
                  Confirm Passcode
                </label>
                <input
                  id="claim-confirm"
                  type="password"
                  required
                  minLength={8}
                  value={confirmInput}
                  onChange={(e) => setConfirmInput(e.target.value)}
                  placeholder="Re-enter passcode"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: SITE.reply.brand.primary }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>Claim &amp; Open Reply Portal</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <h1 className="font-serif text-lg font-semibold text-[#111418]">
                  Staff Sign In
                </h1>
                <p className="text-xs text-[#5C636E] mt-1">
                  Enter your server-configured passcode to manage orders, send payment details, and answer enquiries.
                </p>
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-800">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="admin-passcode" className="block text-xs font-medium text-[#111418] mb-1">
                  Admin Passcode
                </label>
                <input
                  id="admin-passcode"
                  type="password"
                  required
                  autoFocus
                  value={passcodeInput}
                  onChange={(e) => setPasscodeInput(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full px-3.5 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 px-4 rounded-md text-sm font-medium text-white transition-colors inline-flex items-center justify-center gap-2 cursor-pointer"
                style={{ backgroundColor: SITE.reply.brand.primary }}
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                <span>Unlock Reply Portal</span>
              </button>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-[#ECEEF0] flex items-center justify-between text-xs text-[#5C636E]">
            <Link href="/" className="inline-flex items-center gap-1 hover:text-[#111418]">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
