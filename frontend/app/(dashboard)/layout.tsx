/**
 * Dashboard layout — wraps all protected pages with Sidebar and Header.
 * Redirects to login if not authenticated.
 */
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStoredToken } from "@/lib/api";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
    } else {
      setIsChecking(false);
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-fixed-dim border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-on-surface relative">
      <div className="scan-line"></div>
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden z-10 relative">
        <Header />
        <main className="flex-1 overflow-y-auto px-margin-page pb-12 pt-6">
          {children}
        </main>
      </div>
    </div>
  );
}
