export type AccountStatus = 'active' | 'lead' | 'inactive' | 'archived';

export type CustomerTier = 'standard' | 'vip' | 'commercial';

export type ColorTheme = 'blue' | 'purple' | 'amber' | 'emerald' | 'rose' | 'indigo' | 'cyan';

export interface Customer {
  id: string;
  displayId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: AccountStatus;
  tier: CustomerTier;
  notes: string;
  initials: string;
  colorTheme: ColorTheme;
  createdAt: string;
  updatedAt: string;
}

export type FilterCategory = 'all' | 'active' | 'new' | 'archived';

export type TabDestination = 'dashboard' | 'customers' | 'activity' | 'settings';

export interface ActivityLog {
  id: string;
  customerId: string;
  customerName: string;
  action: 'create' | 'update' | 'delete' | 'status_change';
  details: string;
  timestamp: string;
}

export interface CustomerStats {
  total: number;
  newThisMonth: number;
  active: number;
  archived: number;
}
