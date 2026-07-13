'use client';

import { AdminProvider } from '@/context/AdminContext';

export default function AdminLayoutRoot({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminProvider>{children}</AdminProvider>;
}
