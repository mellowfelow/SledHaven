import React from 'react';
import type { Metadata } from 'next';
import { AdminPasscodeProvider } from '@/components/admin/AdminPasscodeContext';
import PasscodeGate from '@/components/admin/PasscodeGate';
import AdminNav from '@/components/admin/AdminNav';

export const metadata: Metadata = {
  title: 'SledHaven Reply Portal',
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminPasscodeProvider>
      <PasscodeGate>
        <div className="min-h-screen bg-[#F7F7F5] flex flex-col">
          <AdminNav />
          <main className="flex-1 max-w-[1200px] w-full mx-auto px-4 sm:px-6 py-8">
            {children}
          </main>
        </div>
      </PasscodeGate>
    </AdminPasscodeProvider>
  );
}
