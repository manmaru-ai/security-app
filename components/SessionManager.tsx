'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Session {
  id: string;
  user_agent: string | null;
  ip_address: string | null;
  created_at: string;
  last_activity: string;
  is_current?: boolean;
}

interface SessionManagerProps {
  userId: string;
  currentSessionId: string;
}

export default function SessionManager({ userId, currentSessionId }: SessionManagerProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [terminating, setTerminating] = useState<string | null>(null);
  const router = useRouter();

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        const sessionsWithCurrent = data.sessions.map((session: Session) => ({
          ...session,
          is_current: session.id === currentSessionId
        }));
        setSessions(sessionsWithCurrent);
      }
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const terminateSession = async (sessionId: string) => {
    setTerminating(sessionId);
    
    try {
      const response = await fetch('/api/sessions/terminate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        if (sessionId === currentSessionId) {
          // 現在のセッションを終了した場合はログインページにリダイレクト
          router.push('/login');
        } else {
          // 他のセッションを終了した場合は一覧を更新
          await fetchSessions();
        }
      }
    } catch (error) {
      console.error('Failed to terminate session:', error);
    } finally {
      setTerminating(null);
    }
  };

  const terminateAllOtherSessions = async () => {
    setTerminating('all');
    
    try {
      const response = await fetch('/api/sessions/terminate-others', {
        method: 'POST',
      });

      if (response.ok) {
        await fetchSessions();
      }
    } catch (error) {
      console.error('Failed to terminate other sessions:', error);
    } finally {
      setTerminating(null);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const getDeviceInfo = (userAgent: string | null) => {
    if (!userAgent) return { device: '不明', browser: '不明' };

    let device = '不明';
    let browser = '不明';

    // デバイス判定
    if (/Mobile|Android|iPhone|iPad/.test(userAgent)) {
      device = 'モバイル';
    } else if (/Windows/.test(userAgent)) {
      device = 'Windows';
    } else if (/Mac/.test(userAgent)) {
      device = 'Mac';
    } else if (/Linux/.test(userAgent)) {
      device = 'Linux';
    }

    // ブラウザ判定
    if (/Chrome/.test(userAgent)) {
      browser = 'Chrome';
    } else if (/Firefox/.test(userAgent)) {
      browser = 'Firefox';
    } else if (/Safari/.test(userAgent)) {
      browser = 'Safari';
    } else if (/Edge/.test(userAgent)) {
      browser = 'Edge';
    }

    return { device, browser };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ja-JP');
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'たった今';
    if (diffMins < 60) return `${diffMins}分前`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}時間前`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}日前`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* アクション */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">セッション一括管理</h3>
            <p className="text-sm text-gray-500">
              {sessions.length}個のアクティブセッション
            </p>
          </div>
          <button
            onClick={terminateAllOtherSessions}
            disabled={terminating === 'all' || sessions.length <= 1}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {terminating === 'all' ? (
              <>
                <svg className="animate-spin mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                終了中...
              </>
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
                </svg>
                他の全セッションを終了
              </>
            )}
          </button>
        </div>
      </div>

      {/* セッション一覧 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            アクティブセッション
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            あなたのアカウントの全てのアクティブセッション一覧
          </p>
        </div>
        <div className="border-t border-gray-200">
          {sessions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">セッションがありません</h3>
              <p className="mt-1 text-sm text-gray-500">アクティブなセッションが見つかりませんでした。</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {sessions.map((session) => {
                const { device, browser } = getDeviceInfo(session.user_agent);
                return (
                  <li key={session.id} className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {session.is_current ? (
                            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                              <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <p className="text-sm font-medium text-gray-900">
                              {browser} on {device}
                            </p>
                            {session.is_current && (
                              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                現在のセッション
                              </span>
                            )}
                          </div>
                          <div className="mt-1 text-sm text-gray-500">
                            <p>IP: {session.ip_address || '不明'}</p>
                            <p>ログイン: {formatDate(session.created_at)}</p>
                            <p>最終アクティビティ: {getTimeAgo(session.last_activity)}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => terminateSession(session.id)}
                          disabled={terminating === session.id}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {terminating === session.id ? (
                            <>
                              <svg className="animate-spin mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              終了中
                            </>
                          ) : (
                            <>
                              <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              {session.is_current ? 'ログアウト' : '終了'}
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      {/* セキュリティのヒント */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              セキュリティのヒント
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc list-inside space-y-1">
                <li>不審なセッションを見つけた場合は、すぐに終了してください</li>
                <li>公共のコンピューターを使用した後は、セッションを確認してください</li>
                <li>定期的にアクティブセッションを確認することをお勧めします</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
