'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';

interface AdminPasscodeContextValue {
  passcode: string;
  authenticated: boolean;
  setVerifiedPasscode: (code: string) => void;
  signOut: () => void;
  adminFetch: (input: string, init?: RequestInit) => Promise<Response>;
}

const AdminPasscodeContext = createContext<AdminPasscodeContextValue | null>(null);

export function AdminPasscodeProvider({ children }: { children: React.ReactNode }) {
  // Held strictly in React memory (never localStorage or sessionStorage)
  const [passcode, setPasscode] = useState('');

  const setVerifiedPasscode = useCallback((code: string) => {
    setPasscode(code.trim());
  }, []);

  const signOut = useCallback(() => {
    setPasscode('');
  }, []);

  const adminFetch = useCallback(
    (input: string, init: RequestInit = {}) => {
      const headers = new Headers(init.headers);
      headers.set('X-Admin-Passcode', passcode);
      return fetch(input, { ...init, headers });
    },
    [passcode]
  );

  return (
    <AdminPasscodeContext.Provider
      value={{
        passcode,
        authenticated: Boolean(passcode),
        setVerifiedPasscode,
        signOut,
        adminFetch,
      }}
    >
      {children}
    </AdminPasscodeContext.Provider>
  );
}

export function useAdminPasscode(): AdminPasscodeContextValue {
  const ctx = useContext(AdminPasscodeContext);
  if (!ctx) {
    throw new Error('useAdminPasscode must be used inside AdminPasscodeProvider');
  }
  return ctx;
}
