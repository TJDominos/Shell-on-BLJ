export type CurrencyType = 'Gcoin' | 'Bonus';

export interface PlatformUser {
  id: string;
  name: string;
  avatarUrl?: string;
  vipLevel?: number;
  balance: number;       // GCoin
  bonusBalance: number;  // Bonus Coins
}

export interface PlatformGameConfig {
  id: string;
  title: string;
  category: string;
  version?: string;
  provablyFair?: boolean;
}

export interface PlatformHeaderProps {
  platformName?: string;
  platformLogoUrl?: string;
  gameTitle?: string;
  category?: string;
  user: PlatformUser;
  activeCurrency?: CurrencyType;
  onCurrencyChange?: (currency: CurrencyType) => void;
  onDepositClick?: () => void;
  onBackToLobby?: () => void;
  onToggleSound?: (muted: boolean) => void;
  isMuted?: boolean;
  onToggleFullscreen?: () => void;
  isFullscreen?: boolean;
  onOpenRules?: () => void;
  onOpenSettings?: () => void;
  onOpenFairness?: () => void;
  onRefreshGame?: () => void;
}
