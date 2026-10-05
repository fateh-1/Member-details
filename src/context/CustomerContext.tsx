import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Customer, ActivityLog, FilterCategory, CustomerTier, AccountStatus } from '../types.ts';
import { INITIAL_CUSTOMERS, INITIAL_ACTIVITY_LOGS } from '../data/initialCustomers.ts';
import { api, DatabaseStats } from '../services/api.ts';

interface CustomerContextType {
  customers: Customer[];
  filteredCustomers: Customer[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeFilter: FilterCategory;
  setActiveFilter: (filter: FilterCategory) => void;
  addCustomer: (data: Omit<Customer, 'id' | 'displayId' | 'initials' | 'colorTheme' | 'createdAt' | 'updatedAt'>) => Promise<Customer>;
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<Customer | null>;
  deleteCustomer: (id: string) => Promise<Customer | null>;
  restoreCustomer: (customer: Customer) => Promise<void>;
  resetToDemoData: () => Promise<void>;
  activityLogs: ActivityLog[];
  stats: {
    total: number;
    newThisMonth: number;
    active: number;
    archived: number;
  };
  editingCustomer: Customer | null;
  setEditingCustomer: (customer: Customer | null) => void;
  currentView: 'list' | 'form';
  setCurrentView: (view: 'list' | 'form') => void;
  isDbConnected: boolean;
  isLoading: boolean;
  refreshData: () => Promise<void>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_ACTIVITY_LOGS);
  const [stats, setStats] = useState({
    total: 125,
    newThisMonth: 18,
    active: 110,
    archived: 3,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all');
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [currentView, setCurrentView] = useState<'list' | 'form'>('list');
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch all data from database API
  const refreshData = useCallback(async () => {
    try {
      const [health, custRes, statsRes, actRes] = await Promise.all([
        api.checkHealth().catch(() => null),
        api.getCustomers(),
        api.getDashboardStats().catch(() => null),
        api.getActivities().catch(() => null),
      ]);

      if (health && health.status === 'ok') {
        setIsDbConnected(true);
      }

      if (custRes && custRes.customers) {
        setCustomers(custRes.customers);
      }

      if (statsRes) {
        setStats({
          total: statsRes.total,
          newThisMonth: statsRes.newThisMonth,
          active: statsRes.active,
          archived: statsRes.archived,
        });
      }

      if (actRes) {
        setActivityLogs(actRes);
      }
    } catch (err) {
      console.warn('Backend database sync, falling back to local store', err);
      setIsDbConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const addCustomer = async (
    data: Omit<Customer, 'id' | 'displayId' | 'initials' | 'colorTheme' | 'createdAt' | 'updatedAt'>
  ): Promise<Customer> => {
    try {
      const created = await api.createCustomer(data);
      await refreshData();
      return created;
    } catch {
      // Fallback
      const nextNum = customers.length + 11;
      const padded = String(nextNum).padStart(3, '0');
      const newCustomer: Customer = {
        ...data,
        id: `cust-${Date.now()}`,
        displayId: `ID #${padded}`,
        initials: data.name.slice(0, 2).toUpperCase(),
        colorTheme: 'blue',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setCustomers((prev) => [newCustomer, ...prev]);
      return newCustomer;
    }
  };

  const updateCustomer = async (id: string, data: Partial<Customer>): Promise<Customer | null> => {
    try {
      const updated = await api.updateCustomer(id, data);
      await refreshData();
      return updated;
    } catch {
      let result: Customer | null = null;
      setCustomers((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            result = { ...c, ...data, updatedAt: new Date().toISOString() };
            return result;
          }
          return c;
        })
      );
      return result;
    }
  };

  const deleteCustomer = async (id: string): Promise<Customer | null> => {
    const target = customers.find((c) => c.id === id) || null;
    try {
      await api.deleteCustomer(id);
      await refreshData();
      return target;
    } catch {
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      return target;
    }
  };

  const restoreCustomer = async (customer: Customer): Promise<void> => {
    try {
      await api.restoreCustomer(customer);
      await refreshData();
    } catch {
      setCustomers((prev) => [customer, ...prev]);
    }
  };

  const resetToDemoData = async (): Promise<void> => {
    try {
      await api.resetDatabase();
      await refreshData();
    } catch {
      setCustomers(INITIAL_CUSTOMERS);
      setActivityLogs(INITIAL_ACTIVITY_LOGS);
    }
    setSearchQuery('');
    setActiveFilter('all');
    setEditingCustomer(null);
    setCurrentView('list');
  };

  // Filtered customer list
  const filteredCustomers = customers.filter((customer) => {
    if (activeFilter === 'active' && customer.status !== 'active') return false;
    if (activeFilter === 'new' && customer.status !== 'lead') return false;
    if (activeFilter === 'archived' && customer.status !== 'archived') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = customer.name.toLowerCase().includes(q);
      const matchEmail = customer.email.toLowerCase().includes(q);
      const matchPhone = customer.phone.toLowerCase().includes(q);
      const matchAddress = customer.address.toLowerCase().includes(q);
      const matchId = customer.displayId.toLowerCase().includes(q);
      const matchNotes = customer.notes.toLowerCase().includes(q);
      return matchName || matchEmail || matchPhone || matchAddress || matchId || matchNotes;
    }

    return true;
  });

  return (
    <CustomerContext.Provider
      value={{
        customers,
        filteredCustomers,
        searchQuery,
        setSearchQuery,
        activeFilter,
        setActiveFilter,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        restoreCustomer,
        resetToDemoData,
        activityLogs,
        stats,
        editingCustomer,
        setEditingCustomer,
        currentView,
        setCurrentView,
        isDbConnected,
        isLoading,
        refreshData,
      }}
    >
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomerContext must be used within a CustomerProvider');
  }
  return context;
};
