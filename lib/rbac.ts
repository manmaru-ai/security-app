// ロールベースアクセス制御（RBAC）システム

export type Role = 'user' | 'editor' | 'admin';

export interface Permission {
  action: string;
  resource: string;
}

// ロール階層の定義
const roleHierarchy: Record<Role, Role[]> = {
  'user': ['user'],
  'editor': ['user', 'editor'],
  'admin': ['user', 'editor', 'admin']
};

// ロールごとの権限定義
const rolePermissions: Record<Role, Permission[]> = {
  'user': [
    { action: 'read', resource: 'profile' },
    { action: 'update', resource: 'profile' },
    { action: 'read', resource: 'dashboard' },
    { action: 'read', resource: 'sessions' },
    { action: 'delete', resource: 'sessions' }, // 自分のセッション削除
  ],
  'editor': [
    { action: 'read', resource: 'content' },
    { action: 'create', resource: 'content' },
    { action: 'update', resource: 'content' },
    { action: 'read', resource: 'users' }, // ユーザー一覧の閲覧
  ],
  'admin': [
    { action: 'read', resource: 'admin' },
    { action: 'create', resource: 'users' },
    { action: 'update', resource: 'users' },
    { action: 'delete', resource: 'users' },
    { action: 'read', resource: 'logs' },
    { action: 'read', resource: 'analytics' },
    { action: 'manage', resource: 'sessions' }, // 全ユーザーのセッション管理
    { action: 'manage', resource: 'security' }, // セキュリティ設定
  ]
};

/**
 * ユーザーが特定の権限を持っているかチェック
 */
export function hasPermission(userRole: Role, action: string, resource: string): boolean {
  const userRoles = roleHierarchy[userRole];
  
  for (const role of userRoles) {
    const permissions = rolePermissions[role];
    const hasPermission = permissions.some(
      permission => permission.action === action && permission.resource === resource
    );
    
    if (hasPermission) {
      return true;
    }
  }
  
  return false;
}

/**
 * ユーザーが特定のロール以上の権限を持っているかチェック
 */
export function hasRole(userRole: Role, requiredRole: Role): boolean {
  return roleHierarchy[userRole].includes(requiredRole);
}

/**
 * ユーザーがリソースにアクセス可能かチェック
 */
export function canAccess(userRole: Role, path: string): boolean {
  // パスベースの簡単なアクセス制御
  if (path.startsWith('/admin')) {
    return hasRole(userRole, 'admin');
  }
  
  if (path.startsWith('/editor')) {
    return hasRole(userRole, 'editor');
  }
  
  // デフォルトは認証済みユーザーであればアクセス可能
  return true;
}

/**
 * ロールの表示名を取得
 */
export function getRoleDisplayName(role: Role): string {
  const roleNames: Record<Role, string> = {
    'user': '一般ユーザー',
    'editor': '編集者',
    'admin': '管理者'
  };
  
  return roleNames[role];
}

/**
 * 利用可能なロール一覧を取得
 */
export function getAvailableRoles(): { value: Role; label: string }[] {
  return [
    { value: 'user', label: '一般ユーザー' },
    { value: 'editor', label: '編集者' },
    { value: 'admin', label: '管理者' }
  ];
}

/**
 * ロールに基づいてナビゲーションアイテムをフィルタリング
 */
export function getAuthorizedNavItems(userRole: Role): Array<{
  href: string;
  label: string;
  icon?: string;
}> {
  const allNavItems = [
    { href: '/dashboard', label: 'ダッシュボード' },
    { href: '/profile', label: 'プロフィール' },
    { href: '/sessions', label: 'セッション管理' },
    { href: '/admin', label: '管理者ページ' },
    { href: '/admin/users', label: 'ユーザー管理' },
  ];

  return allNavItems.filter(item => canAccess(userRole, item.href));
}

/**
 * セキュリティコンテキストの作成
 */
export interface SecurityContext {
  user: {
    id: string;
    email: string;
    role: Role;
  };
  permissions: Permission[];
  canAccess: (path: string) => boolean;
  hasPermission: (action: string, resource: string) => boolean;
  hasRole: (role: Role) => boolean;
}

export function createSecurityContext(user: { id: string; email: string; role: Role }): SecurityContext {
  const userPermissions: Permission[] = [];
  const userRoles = roleHierarchy[user.role];
  
  // ユーザーが持つ全ての権限を収集
  for (const role of userRoles) {
    userPermissions.push(...rolePermissions[role]);
  }

  return {
    user,
    permissions: userPermissions,
    canAccess: (path: string) => canAccess(user.role, path),
    hasPermission: (action: string, resource: string) => hasPermission(user.role, action, resource),
    hasRole: (role: Role) => hasRole(user.role, role)
  };
}
