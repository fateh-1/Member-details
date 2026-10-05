import { Customer, ActivityLog, FilterCategory } from '../types.ts';

export interface DatabaseStats {
  total: number;
  newThisMonth: number;
  active: number;
  archived: number;
  totalDatabaseRecords: number;
  lastUpdated: string;
}

export interface HealthResponse {
  status: string;
  database: string;
  engine: string;
  recordsCount: number;
  timestamp: string;
}

export const api = {
  async checkHealth(): Promise<HealthResponse> {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Database server not responding');
    return res.json();
  },

  async getCustomers(filter?: FilterCategory, search?: string): Promise<{ customers: Customer[]; total: number }> {
    const params = new URLSearchParams();
    if (filter && filter !== 'all') params.set('filter', filter);
    if (search && search.trim()) params.set('q', search.trim());

    const url = `/api/customers${params.toString() ? `?${params.toString()}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to fetch customers from database');
    }
    return res.json();
  },

  async getCustomerById(id: string): Promise<Customer> {
    const res = await fetch(`/api/customers/${encodeURIComponent(id)}`);
    if (!res.ok) throw new Error('Customer not found in database');
    const data = await res.json();
    return data.customer;
  },

  async createCustomer(
    data: Omit<Customer, 'id' | 'displayId' | 'initials' | 'colorTheme' | 'createdAt' | 'updatedAt'>
  ): Promise<Customer> {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Database rejected customer creation');
    }
    const result = await res.json();
    return result.customer;
  },

  async updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
    const res = await fetch(`/api/customers/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Database rejected update');
    }
    const result = await res.json();
    return result.customer;
  },

  async deleteCustomer(id: string): Promise<Customer> {
    const res = await fetch(`/api/customers/${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Database rejected deletion');
    }
    const result = await res.json();
    return result.customer;
  },

  async restoreCustomer(customer: Customer): Promise<Customer> {
    const res = await fetch('/api/customers/restore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Database failed to restore customer');
    }
    const result = await res.json();
    return result.customer;
  },

  async getDashboardStats(): Promise<DatabaseStats> {
    const res = await fetch('/api/dashboard/stats');
    if (!res.ok) throw new Error('Failed to load dashboard statistics');
    const data = await res.json();
    return data.stats;
  },

  async getActivities(): Promise<ActivityLog[]> {
    const res = await fetch('/api/activities');
    if (!res.ok) throw new Error('Failed to load activity logs');
    const data = await res.json();
    return data.activities;
  },

  async resetDatabase(): Promise<void> {
    const res = await fetch('/api/database/reset', {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reset database');
  },
};
