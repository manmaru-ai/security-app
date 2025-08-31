import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import UserManagement from '@/components/UserManagement';

export default async function AdminUsersPage() {
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
            <h1 className="text-3xl font-bold text-gray-900">ユーザー管理</h1>
            <p className="mt-2 text-gray-600">
              システム内の全ユーザーの管理とロール変更
            </p>
          </div>

          <UserManagement />
        </div>
      </main>
    </div>
  );
}
