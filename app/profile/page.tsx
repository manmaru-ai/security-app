import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Navigation from '@/components/Navigation';
import ProfileManager from '@/components/ProfileManager';

export default async function ProfilePage() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userEmail = headersList.get('x-user-email');
  const userRole = headersList.get('x-user-role') as 'user' | 'editor' | 'admin';

  if (!userId || !userEmail || !userRole) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation userRole={userRole} />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">プロフィール設定</h1>
            <p className="mt-2 text-gray-600">
              アカウント情報の確認と更新
            </p>
          </div>

          <ProfileManager 
            userId={userId}
            userEmail={userEmail}
            userRole={userRole}
          />
        </div>
      </main>
    </div>
  );
}
