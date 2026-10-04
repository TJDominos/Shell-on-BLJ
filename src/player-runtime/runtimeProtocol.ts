export interface RuntimeUser {
  id?: string;
  displayName?: string;
  avatarUrl?: string;
}

export interface RuntimeSession {
  status: 'authenticated' | 'unauthenticated' | 'loading';
  user?: RuntimeUser;
}

export interface RuntimeNotifications {
  unreadCount: number;
}

export interface RuntimeState {
  session: RuntimeSession;
  notifications: RuntimeNotifications;
}
