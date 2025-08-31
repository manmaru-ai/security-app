import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="ml-2 text-2xl font-bold text-gray-900">SecureApp</span>
            </div>
            <div className="flex space-x-4">
              <Link
                href="/login"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                ログイン
              </Link>
              <Link
                href="/signup"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-md text-sm font-medium"
              >
                無料で始める
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main>
        {/* ヒーローセクション */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="text-center">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                企業レベルの
                <span className="text-indigo-600">セキュリティ</span>
                を
                <br />
                簡単に実現
              </h1>
              <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-500">
                Next.jsで構築された最高水準のセキュリティ機能。ロールベースアクセス制御、高度なセッション管理、
                多層防御によるセキュリティ対策で、あなたのアプリケーションを守ります。
              </p>
              <div className="mt-10 flex justify-center space-x-4">
                <Link
                  href="/signup"
                  className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 py-3 rounded-md text-lg font-medium"
                >
                  今すぐ始める
                </Link>
                <Link
                  href="#features"
                  className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-8 py-3 rounded-md text-lg font-medium"
                >
                  機能を見る
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 機能セクション */}
        <section id="features" className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                最高水準のセキュリティ機能
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                企業が求めるセキュリティ要件を全て満たす包括的なソリューション
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* RBAC */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">ロールベースアクセス制御</h3>
                <p className="text-gray-600">
                  管理者、編集者、一般ユーザーの3段階の権限管理。細かなアクセス制御でセキュリティを強化します。
                </p>
              </div>

              {/* セッション管理 */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">高度なセッション管理</h3>
                <p className="text-gray-600">
                  マルチデバイス対応、リアルタイム監視、強制ログアウト機能でセキュリティを最大化します。
                </p>
              </div>

              {/* 認証システム */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">強固な認証システム</h3>
                <p className="text-gray-600">
                  bcryptハッシュ化、JWT、CSRF保護、アカウントロック機能で最高レベルのセキュリティを実現。
                </p>
              </div>

              {/* 監査ログ */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">包括的監査ログ</h3>
                <p className="text-gray-600">
                  全アクティビティの詳細記録、ログイン履歴、セキュリティイベントの追跡で透明性を確保。
                </p>
              </div>

              {/* パスワード管理 */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">スマートパスワード管理</h3>
                <p className="text-gray-600">
                  リアルタイム強度チェック、自動ロック機能、セキュアな変更機能でパスワードセキュリティを強化。
                </p>
              </div>

              {/* セキュリティヘッダー */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">多層セキュリティヘッダー</h3>
                <p className="text-gray-600">
                  CSP、HSTS、XSS保護など、最新のセキュリティヘッダーでWebアプリケーションを保護。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 技術仕様セクション */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                最新技術スタック
              </h2>
              <p className="mt-4 text-xl text-gray-600">
                モダンな技術で構築された堅牢なセキュリティシステム
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Next.js 15</h3>
                <p className="text-gray-600">最新のReactフレームワーク</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">SQLite</h3>
                <p className="text-gray-600">軽量で高速なデータベース</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">bcrypt</h3>
                <p className="text-gray-600">強固なパスワードハッシュ化</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Tailwind CSS</h3>
                <p className="text-gray-600">モダンなCSSフレームワーク</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-24 bg-indigo-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              今すぐセキュリティを強化
            </h2>
            <p className="mt-4 text-xl text-indigo-100">
              企業レベルのセキュリティ機能を無料で体験できます
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <Link
                href="/signup"
                className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium"
              >
                無料で始める
              </Link>
              <Link
                href="/login"
                className="border-2 border-white text-white hover:bg-white hover:text-indigo-600 px-8 py-3 rounded-md text-lg font-medium"
              >
                ログイン
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center">
                <svg className="h-8 w-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="ml-2 text-xl font-bold text-white">SecureApp</span>
              </div>
              <p className="mt-4 text-gray-300">
                最高水準のセキュリティ機能を提供するNext.jsアプリケーション
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">セキュリティ機能</h3>
              <ul className="space-y-2">
                <li><Link href="#features" className="text-gray-300 hover:text-white">RBAC</Link></li>
                <li><Link href="#features" className="text-gray-300 hover:text-white">セッション管理</Link></li>
                <li><Link href="#features" className="text-gray-300 hover:text-white">認証システム</Link></li>
                <li><Link href="#features" className="text-gray-300 hover:text-white">監査ログ</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">開発者向け</h3>
              <ul className="space-y-2">
                <li><a href="https://github.com" className="text-gray-300 hover:text-white">GitHub</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">ドキュメント</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">API リファレンス</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">サンプルコード</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">サポート</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">ヘルプセンター</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">お問い合わせ</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">ステータス</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">セキュリティ</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400 text-sm text-center">
              © 2024 SecureApp. 教育・学習目的で作成されています。
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}