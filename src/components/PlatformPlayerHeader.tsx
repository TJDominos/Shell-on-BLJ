import { useEffect, useId, useRef, useState, type ReactElement } from "react";
import { Bell, LogOut, Menu, Search, Triangle, UserRound, Users } from "lucide-react";
import type { RuntimeState } from "../player-runtime/runtimeProtocol";
import "./platform-player.css";

export interface PlatformPlayerHeaderProps {
  gameName: string;
  state: RuntimeState;
  onNavigateHome: () => void;
  onSignIn: () => void;
  signInPending?: boolean;
  defaultSidebarOpen?: boolean;
  onSignOut: () => void;
  onOpenNotifications: () => void;
  onToggleMute: () => void;
}

export function PlatformPlayerHeader({ state, onNavigateHome, onSignIn, signInPending = false, defaultSidebarOpen = false, onSignOut, onOpenNotifications }: PlatformPlayerHeaderProps): ReactElement {
  const [sidebarOpen, setSidebarOpen] = useState(defaultSidebarOpen);
  const [search, setSearch] = useState("");
  const [avatarFailed, setAvatarFailed] = useState(false);
  const accountRef = useRef<HTMLDetailsElement>(null);
  const sidebarId = useId();
  const authenticated = state.session.status === "authenticated";
  const userLabel = state.session.user?.displayName || "Player";
  const avatarUrl = state.session.user?.avatarUrl;
  const notificationLabel = state.notifications.unreadCount > 0 ? `${state.notifications.unreadCount} unread notifications` : "Notifications";

  useEffect(() => setAvatarFailed(false), [avatarUrl]);
  useEffect(() => {
    const dismissAccount = (event: PointerEvent) => {
      if (event.target instanceof Node && !accountRef.current?.contains(event.target)) accountRef.current?.removeAttribute("open");
    };
    const dismissPanels = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (accountRef.current?.open) {
        accountRef.current.removeAttribute("open");
        accountRef.current.querySelector("summary")?.focus();
      }
      setSidebarOpen(false);
    };
    document.addEventListener("pointerdown", dismissAccount);
    document.addEventListener("keydown", dismissPanels);
    return () => {
      document.removeEventListener("pointerdown", dismissAccount);
      document.removeEventListener("keydown", dismissPanels);
    };
  }, []);

  return (
    <>
      <header className="platform-player-header">
        <div className="platform-player-header__inner">
          <div className="platform-player-header__brand">
            <button className="btn btn--outline btn--icon-only platform-player-header__icon-button platform-player-header__category-toggle" type="button" aria-label={sidebarOpen ? "Collapse game categories" : "Expand game categories"} title={sidebarOpen ? "Collapse game categories" : "Expand game categories"} aria-expanded={sidebarOpen} aria-controls={sidebarId} onClick={() => setSidebarOpen(value => !value)}>
              <span className="platform-player-header__category-symbol" aria-hidden="true">
                <Menu size={28} />
                <Triangle className="platform-player-header__category-direction" size={12} />
              </span>
            </button>
            <a className="platform-player-header__logo" href="/home" aria-label="Randseed game home" onClick={event => { event.preventDefault(); onNavigateHome(); }}>
              <img src="https://storage.randseed.org/Logo/Logo.png" alt="Randseed" />
            </a>
          </div>
          {/* Desktop search bar with input */}
          <label className="platform-player-header__search platform-player-header__search--desktop">
            <Search size={18} aria-hidden="true" />
            <input type="search" aria-label="Search games" placeholder="Search" value={search} onChange={event => setSearch(event.target.value)} />
          </label>
          <div className="platform-player-header__actions">
            {/* Mobile search icon only */}
            <button 
              className="btn btn--outline btn--icon-only platform-player-header__icon-button platform-player-header__search-mobile" 
              type="button" 
              aria-label="Search games" 
              title="Search"
              onClick={() => {}}
            >
              <Search className="btn__icon" size={22} aria-hidden="true" />
            </button>
            <a className="btn btn--outline btn--icon-only platform-player-header__icon-button" href={`${import.meta.env.VITE_MAIN_SITE_URL || window.location.origin}/friends`} aria-label="Friends" title="Friends">
              <Users className="btn__icon" size={22} aria-hidden="true" />
            </a>
            <button className="btn btn--outline btn--icon-only platform-player-header__icon-button" type="button" aria-label={notificationLabel} title={notificationLabel} onClick={onOpenNotifications}>
              <Bell className="btn__icon" size={22} aria-hidden="true" />
              {state.notifications.unreadCount > 0 && <span className="platform-player-header__notification-badge" aria-hidden="true">{state.notifications.unreadCount > 99 ? "99+" : state.notifications.unreadCount}</span>}
            </button>
            {authenticated ? (
              <details ref={accountRef} className="platform-player-header__account">
                <summary className="platform-player-header__avatar" aria-label={`Account: ${userLabel}`} title={`Account: ${userLabel}`}>
                  {avatarUrl && !avatarFailed ? <img src={avatarUrl} alt="" onError={() => setAvatarFailed(true)} /> : <UserRound size={22} aria-hidden="true" />}
                </summary>
                <div className="platform-player-header__dropdown">
                  <span className="platform-player-header__user-name">{userLabel}</span>
                  <button className="btn btn--outline btn--sm" type="button" onClick={() => { accountRef.current?.removeAttribute("open"); onSignOut(); }}><LogOut className="btn__icon" size={16} aria-hidden="true" />Sign Out</button>
                </div>
              </details>
            ) : <button className={`btn btn--solid btn--sm platform-player-header__auth-button${signInPending ? " btn--loading" : ""}`} type="button" disabled={signInPending} aria-busy={signInPending} onClick={onSignIn}>Sign In</button>}
          </div>
        </div>
      </header>
      <aside id={sidebarId} className="platform-player-sidebar" aria-label="Game categories" hidden={!sidebarOpen} />
    </>
  );
}
