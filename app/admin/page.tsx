import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import AdminDashboard from '@/components/AdminDashboard';

export default async function AdminPage() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userEmail = headersList.get('x-user-email');
  const userRole = headersList.get('x-user-role') as 'user' | 'editor' | 'admin';

  if (!userId || !userEmail || !userRole) {
    redirect('/login');
  }

  if (userRole !== 'admin') {
    redirect('/unauthorized');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole={userRole} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">管理者ダッシュボード</h1>
            <p className="mt-2 text-gray-600">
              システム全体の管理とセキュリティ監視
            </p>
          </div>

          <AdminDashboard />
        </div>
      </main>
    </div>
  );
}
