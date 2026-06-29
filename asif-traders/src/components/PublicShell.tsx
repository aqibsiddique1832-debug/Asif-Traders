'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import LocationModal from '@/components/LocationModal';
import ToastContainer from '@/components/ToastContainer';
import { ReactNode } from 'react';

export default function PublicShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute =
    pathname.startsWith('/admin-login') ||
    pathname.startsWith('/admin-dashboard') ||
    pathname.startsWith('/admin/') ||
    pathname === '/admin';

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1 mobile-padding-bottom">{children}</main>
      <Footer />
      <BottomNav />
      <LocationModal />
      <ToastContainer />
    </>
  );
}
