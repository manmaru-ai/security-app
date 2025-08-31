import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import SessionManager from '@/components/SessionManager';

export default async function SessionsPage() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userEmail = headersList.get('x-user-email');
  const userRole = headersList.get('x-user-role') as 'user' | 'editor' | 'admin';
  const currentSessionId = headersList.get('x-session-id');

  if (!userId || !userEmail || !userRole || !currentSessionId) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole={userRole} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">セッション管理</h1>
            <p className="mt-2 text-gray-600">
              アクティブなセッションを管理し、不審なアクセスを監視できます
            </p>
          </div>

          <SessionManager 
            userId={userId}
            currentSessionId={currentSessionId}
          />
        </div>
      </main>
    </div>
  );
}
