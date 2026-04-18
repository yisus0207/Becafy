'use client';

import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { useTabTitle } from "@/hooks/useTabTitle";
import BottomNav from "@/components/BottomNav";

function GlobalHooks() {
  useTabTitle();
  return null;
}

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ToastProvider>
        <GlobalHooks />
        {children}
        <BottomNav />
      </ToastProvider>
    </AuthProvider>
  );
}
