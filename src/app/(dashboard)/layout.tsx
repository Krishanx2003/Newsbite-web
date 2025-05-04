import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inflo - Dashboard',
  description: 'Dashboard area of Inflo application',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add padding-top to the main content to avoid overlap with the fixed Navbar */}
      <main className="pt-16"> {/* Adjust the padding-top value as needed */}
        {children}
      </main>
    </div>
  );
}