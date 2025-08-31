import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
            <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-gray-900">
            アクセス権限がありません
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            このページにアクセスするための権限が不足しています。
          </p>
          <p className="mt-2 text-sm text-gray-500">
            必要な権限を持つロールが割り当てられていません。
          </p>
          
          <div className="mt-8 space-y-4">
            <Link
              href="/dashboard"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              ダッシュボードに戻る
            </Link>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                管理者にお問い合わせください
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-800 mb-2">アクセス制御について</h3>
            <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
              <li>管理者ページは管理者ロールのみアクセス可能</li>
              <li>編集者ページは編集者・管理者ロールがアクセス可能</li>
              <li>一般ユーザーは基本機能のみ利用可能</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
