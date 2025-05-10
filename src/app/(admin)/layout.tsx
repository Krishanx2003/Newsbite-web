import type { Metadata } from 'next';
import Sidebar from './_components/Sidebar';
import Header from './_components/Header';


// Define props with TypeScript
interface AdminLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Admin Dashboard',
  description: 'Manage your application',
};

export default async function AdminLayout({ children }: AdminLayoutProps) {

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}