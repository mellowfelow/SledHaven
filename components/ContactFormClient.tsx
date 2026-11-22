'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, Send } from 'lucide-react';

export default function ContactFormClient() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Inventory & Freight Inquiry');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formName: subject.toLowerCase().includes('financ') ? 'financing' : 'contact',
          name,
          email,
          phone,
          subject,
          message,
          website,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error || 'Could not send message. Please check your details.');
        setSubmitting(false);
        return;
      }
      router.push(`/thank-you-contact/?ref=${encodeURIComponent(data.enquiryId || '')}`);
    } catch {
      setError('Network error sending message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E4E6E8] rounded-lg p-6 sm:p-8 space-y-5"
    >
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {error && (
        <div className="flex items-start gap-2 p-3.5 rounded-md bg-red-50 border border-red-200 text-xs text-red-800">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="c-name" className="block text-xs font-medium text-[#111418] mb-1.5">
            Full Name *
          </label>
          <input
            id="c-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-3.5 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
          />
        </div>
        <div>
          <label htmlFor="c-email" className="block text-xs font-medium text-[#111418] mb-1.5">
            Email Address *
          </label>
          <input
            id="c-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@domain.com"
            className="w-full px-3.5 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="c-phone" className="block text-xs font-medium text-[#111418] mb-1.5">
            Phone Number (Optional)
          </label>
          <input
            id="c-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 (555) 234-5678"
            className="w-full px-3.5 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
          />
        </div>
        <div>
          <label htmlFor="c-subject" className="block text-xs font-medium text-[#111418] mb-1.5">
            Topic *
          </label>
          <select
            id="c-subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm bg-white border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
          >
            <option value="Inventory & Freight Inquiry">Inventory &amp; Freight Inquiry</option>
            <option value="Pay-in-4 Financing Question">Pay-in-4 Financing Question</option>
            <option value="Crypto (BTC/USDT) 10% Discount">Crypto (BTC/USDT) 10% Discount</option>
            <option value="Existing Order Question">Existing Order Question</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="c-message" className="block text-xs font-medium text-[#111418] mb-1.5">
          Message *
        </label>
        <textarea
          id="c-message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us which model you are considering, your delivery state, or any questions about payment methods..."
          className="w-full px-3.5 py-2.5 text-sm border border-[#D6DBE0] rounded-md focus:outline-none focus:border-[#9A6B3E]"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-medium text-white bg-[#111418] hover:bg-[#9A6B3E] disabled:opacity-50 transition-colors cursor-pointer"
      >
        {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        <span>{submitting ? 'Sending...' : 'Send Enquiry'}</span>
      </button>
    </form>
  );
}
