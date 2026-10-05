import fs from 'fs';
import path from 'path';

export interface CustomerRecord {
  id: string;
  displayId: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'lead' | 'inactive' | 'archived';
  tier: 'standard' | 'vip' | 'commercial';
  notes: string;
  initials: string;
  colorTheme: 'blue' | 'purple' | 'amber' | 'emerald' | 'rose' | 'indigo' | 'cyan';
  createdAt: string;
  updatedAt: string;
}

export interface ActivityRecord {
  id: string;
  customerId: string;
  customerName: string;
  action: 'create' | 'update' | 'delete' | 'status_change';
  details: string;
  timestamp: string;
}

export interface DatabaseSchema {
  customers: CustomerRecord[];
  activities: ActivityRecord[];
  meta: {
    version: number;
    lastUpdated: string;
    totalCountBaseline: number;
  };
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'database.json');

const INITIAL_RECORDS: CustomerRecord[] = [
  {
    id: 'cust-011',
    displayId: 'ID #011',
    name: 'John Smith',
    email: 'john@email.com',
    phone: '0400 111 222',
    address: 'Sydney NSW',
    status: 'active',
    tier: 'standard',
    notes: 'Preferred contact times, gate access notes...',
    initials: 'JS',
    colorTheme: 'blue',
    createdAt: '2026-09-12T10:30:00Z',
    updatedAt: '2026-10-01T14:20:00Z',
  },
  {
    id: 'cust-012',
    displayId: 'ID #012',
    name: 'Mary Jones',
    email: 'mary@email.com',
    phone: '0400 333 444',
    address: 'Melbourne VIC',
    status: 'active',
    tier: 'vip',
    notes: 'Key decision maker for regional enterprise account.',
    initials: 'MJ',
    colorTheme: 'purple',
    createdAt: '2026-09-15T09:15:00Z',
    updatedAt: '2026-10-02T11:45:00Z',
  },
  {
    id: 'cust-013',
    displayId: 'ID #013',
    name: 'David Lee',
    email: 'david@email.com',
    phone: '0400 555 666',
    address: 'Brisbane QLD',
    status: 'lead',
    tier: 'standard',
    notes: 'Met at TechExpo 2026. Follow up on Q4 quote.',
    initials: 'DL',
    colorTheme: 'amber',
    createdAt: '2026-10-01T08:00:00Z',
    updatedAt: '2026-10-03T16:30:00Z',
  },
  {
    id: 'cust-014',
    displayId: 'ID #014',
    name: 'Emma Watson',
    email: 'emma.w@globalops.io',
    phone: '0412 888 999',
    address: 'Perth WA',
    status: 'active',
    tier: 'commercial',
    notes: 'Annual service contract renewed. Invoicing quarterly.',
    initials: 'EW',
    colorTheme: 'emerald',
    createdAt: '2026-08-20T12:00:00Z',
    updatedAt: '2026-09-28T09:10:00Z',
  },
  {
    id: 'cust-015',
    displayId: 'ID #015',
    name: 'Liam Chen',
    email: 'liam.chen@pacifictech.com',
    phone: '0423 456 789',
    address: 'Adelaide SA',
    status: 'lead',
    tier: 'vip',
    notes: 'Requested custom API integration overview for team.',
    initials: 'LC',
    colorTheme: 'indigo',
    createdAt: '2026-10-02T14:15:00Z',
    updatedAt: '2026-10-03T10:00:00Z',
  },
  {
    id: 'cust-016',
    displayId: 'ID #016',
    name: 'Sophia Rodriguez',
    email: 'sophia@rodriguez-design.co',
    phone: '0434 777 111',
    address: 'Hobart TAS',
    status: 'active',
    tier: 'standard',
    notes: 'Creative partner studio. Regular monthly retainer.',
    initials: 'SR',
    colorTheme: 'rose',
    createdAt: '2026-07-11T16:45:00Z',
    updatedAt: '2026-09-15T15:20:00Z',
  },
  {
    id: 'cust-017',
    displayId: 'ID #017',
    name: 'Oliver Vance',
    email: 'oliver.vance@harborcapital.com.au',
    phone: '0450 222 333',
    address: 'Sydney NSW',
    status: 'archived',
    tier: 'commercial',
    notes: 'Account merged into North America headquarters.',
    initials: 'OV',
    colorTheme: 'cyan',
    createdAt: '2026-05-04T11:00:00Z',
    updatedAt: '2026-09-01T13:00:00Z',
  },
  {
    id: 'cust-018',
    displayId: 'ID #018',
    name: 'Grace Kim',
    email: 'grace.kim@apexlogistics.au',
    phone: '0461 999 000',
    address: 'Canberra ACT',
    status: 'active',
    tier: 'vip',
    notes: 'Executive stakeholder for national distribution network.',
    initials: 'GK',
    colorTheme: 'blue',
    createdAt: '2026-09-18T10:20:00Z',
    updatedAt: '2026-10-04T08:00:00Z',
  },
  {
    id: 'cust-019',
    displayId: 'ID #019',
    name: 'Marcus Bell',
    email: 'marcus.b@novasolutions.com',
    phone: '0472 123 456',
    address: 'Gold Coast QLD',
    status: 'lead',
    tier: 'standard',
    notes: 'Scheduled for demo call next Tuesday.',
    initials: 'MB',
    colorTheme: 'purple',
    createdAt: '2026-10-03T11:30:00Z',
    updatedAt: '2026-10-03T11:30:00Z',
  },
  {
    id: 'cust-020',
    displayId: 'ID #020',
    name: 'Zoe Campbell',
    email: 'zoe@campbelldesign.net',
    phone: '0483 654 321',
    address: 'Darwin NT',
    status: 'active',
    tier: 'standard',
    notes: 'Prefers SMS contact for delivery notifications.',
    initials: 'ZC',
    colorTheme: 'amber',
    createdAt: '2026-08-30T13:40:00Z',
    updatedAt: '2026-09-29T17:10:00Z',
  },
];

const INITIAL_ACTIVITIES: ActivityRecord[] = [
  {
    id: 'act-1',
    customerId: 'cust-013',
    customerName: 'David Lee',
    action: 'create',
    details: 'New Lead registered via Database API',
    timestamp: '2 hours ago',
  },
  {
    id: 'act-2',
    customerId: 'cust-012',
    customerName: 'Mary Jones',
    action: 'status_change',
    details: 'Upgraded tier to Premium / VIP Client',
    timestamp: '5 hours ago',
  },
  {
    id: 'act-3',
    customerId: 'cust-011',
    customerName: 'John Smith',
    action: 'update',
    details: 'Verified phone & updated delivery address',
    timestamp: '1 day ago',
  },
  {
    id: 'act-4',
    customerId: 'cust-018',
    customerName: 'Grace Kim',
    action: 'create',
    details: 'Customer profile verified in database',
    timestamp: '2 days ago',
  },
  {
    id: 'act-5',
    customerId: 'cust-017',
    customerName: 'Oliver Vance',
    action: 'status_change',
    details: 'Account archived following entity reorganization',
    timestamp: '3 days ago',
  },
];

class DatabaseEngine {
  private cache: DatabaseSchema | null = null;

  constructor() {
    this.ensureDatabase();
  }

  private ensureDatabase(): void {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_PATH)) {
      const initialDb: DatabaseSchema = {
        customers: INITIAL_RECORDS,
        activities: INITIAL_ACTIVITIES,
        meta: {
          version: 1,
          lastUpdated: new Date().toISOString(),
          totalCountBaseline: 125,
        },
      };
      this.writeDatabaseSync(initialDb);
      this.cache = initialDb;
    } else {
      this.readDatabaseSync();
    }
  }

  private readDatabaseSync(): DatabaseSchema {
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      const data = JSON.parse(raw) as DatabaseSchema;
      this.cache = data;
      return data;
    } catch {
      const fallback: DatabaseSchema = {
        customers: INITIAL_RECORDS,
        activities: INITIAL_ACTIVITIES,
        meta: {
          version: 1,
          lastUpdated: new Date().toISOString(),
          totalCountBaseline: 125,
        },
      };
      this.writeDatabaseSync(fallback);
      this.cache = fallback;
      return fallback;
    }
  }

  private writeDatabaseSync(data: DatabaseSchema): void {
    const tmpPath = `${DB_PATH}.tmp.${Date.now()}`;
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tmpPath, DB_PATH);
    this.cache = data;
  }

  public getDatabase(): DatabaseSchema {
    if (!this.cache) {
      return this.readDatabaseSync();
    }
    return this.cache;
  }

  public getCustomers(filter?: string, query?: string): CustomerRecord[] {
    const db = this.getDatabase();
    return db.customers.filter((c) => {
      if (filter === 'active' && c.status !== 'active') return false;
      if (filter === 'new' && c.status !== 'lead') return false;
      if (filter === 'archived' && c.status !== 'archived') return false;

      if (query && query.trim()) {
        const q = query.toLowerCase().trim();
        const matchName = c.name.toLowerCase().includes(q);
        const matchEmail = c.email.toLowerCase().includes(q);
        const matchPhone = c.phone.toLowerCase().includes(q);
        const matchAddress = c.address.toLowerCase().includes(q);
        const matchId = c.displayId.toLowerCase().includes(q);
        const matchNotes = c.notes.toLowerCase().includes(q);
        return matchName || matchEmail || matchPhone || matchAddress || matchId || matchNotes;
      }

      return true;
    });
  }

  public getCustomerById(id: string): CustomerRecord | null {
    const db = this.getDatabase();
    return db.customers.find((c) => c.id === id) || null;
  }

  public createCustomer(data: Omit<CustomerRecord, 'id' | 'displayId' | 'initials' | 'colorTheme' | 'createdAt' | 'updatedAt'>): CustomerRecord {
    const db = this.getDatabase();
    const nextNum = db.customers.length + 11;
    const padded = String(nextNum).padStart(3, '0');
    const newId = `cust-${Date.now()}`;

    const parts = data.name.trim().split(/\s+/);
    const initials = parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

    const colors: CustomerRecord['colorTheme'][] = ['blue', 'purple', 'amber', 'emerald', 'rose', 'indigo', 'cyan'];
    const colorTheme = colors[Math.floor(Math.random() * colors.length)];
    const now = new Date().toISOString();

    const newRecord: CustomerRecord = {
      ...data,
      id: newId,
      displayId: `ID #${padded}`,
      initials,
      colorTheme,
      createdAt: now,
      updatedAt: now,
    };

    const newActivity: ActivityRecord = {
      id: `act-${Date.now()}`,
      customerId: newRecord.id,
      customerName: newRecord.name,
      action: 'create',
      details: `Registered as ${newRecord.status === 'lead' ? 'New Lead' : 'Active Client'}`,
      timestamp: 'Just now',
    };

    db.customers.unshift(newRecord);
    db.activities.unshift(newActivity);
    db.meta.lastUpdated = now;

    this.writeDatabaseSync(db);
    return newRecord;
  }

  public updateCustomer(id: string, updates: Partial<CustomerRecord>): CustomerRecord | null {
    const db = this.getDatabase();
    const index = db.customers.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const existing = db.customers[index];
    let initials = existing.initials;
    if (updates.name && updates.name !== existing.name) {
      const parts = updates.name.trim().split(/\s+/);
      initials = parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    const updated: CustomerRecord = {
      ...existing,
      ...updates,
      initials,
      updatedAt: new Date().toISOString(),
    };

    db.customers[index] = updated;

    const newActivity: ActivityRecord = {
      id: `act-${Date.now()}`,
      customerId: id,
      customerName: updated.name,
      action: updates.status && updates.status !== existing.status ? 'status_change' : 'update',
      details: updates.status && updates.status !== existing.status
        ? `Status updated to ${updates.status}`
        : 'Profile and contact information updated',
      timestamp: 'Just now',
    };

    db.activities.unshift(newActivity);
    db.meta.lastUpdated = new Date().toISOString();

    this.writeDatabaseSync(db);
    return updated;
  }

  public deleteCustomer(id: string): CustomerRecord | null {
    const db = this.getDatabase();
    const index = db.customers.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const [deleted] = db.customers.splice(index, 1);

    const newActivity: ActivityRecord = {
      id: `act-${Date.now()}`,
      customerId: id,
      customerName: deleted.name,
      action: 'delete',
      details: 'Customer removed from active directory',
      timestamp: 'Just now',
    };

    db.activities.unshift(newActivity);
    db.meta.lastUpdated = new Date().toISOString();

    this.writeDatabaseSync(db);
    return deleted;
  }

  public restoreCustomer(customer: CustomerRecord): CustomerRecord {
    const db = this.getDatabase();
    db.customers.unshift(customer);

    const newActivity: ActivityRecord = {
      id: `act-${Date.now()}`,
      customerId: customer.id,
      customerName: customer.name,
      action: 'create',
      details: 'Customer profile restored to database',
      timestamp: 'Just now',
    };

    db.activities.unshift(newActivity);
    db.meta.lastUpdated = new Date().toISOString();

    this.writeDatabaseSync(db);
    return customer;
  }

  public getStats() {
    const db = this.getDatabase();
    const customerDiff = db.customers.length - INITIAL_RECORDS.length;
    const activeCountInList = db.customers.filter((c) => c.status === 'active').length;
    const leadCountInList = db.customers.filter((c) => c.status === 'lead').length;
    const archivedCountInList = db.customers.filter((c) => c.status === 'archived').length;

    const total = Math.max(0, 125 + customerDiff);
    const active = Math.max(0, 110 + (activeCountInList - 6));
    const newThisMonth = Math.max(0, 18 + (leadCountInList - 3));
    const archived = Math.max(0, 3 + (archivedCountInList - 1));

    return {
      total,
      active,
      newThisMonth,
      archived,
      totalDatabaseRecords: db.customers.length,
      lastUpdated: db.meta.lastUpdated,
    };
  }

  public getActivities(): ActivityRecord[] {
    const db = this.getDatabase();
    return db.activities;
  }

  public resetDatabase(): DatabaseSchema {
    const initialDb: DatabaseSchema = {
      customers: INITIAL_RECORDS,
      activities: INITIAL_ACTIVITIES,
      meta: {
        version: 1,
        lastUpdated: new Date().toISOString(),
        totalCountBaseline: 125,
      },
    };
    this.writeDatabaseSync(initialDb);
    return initialDb;
  }
}

export const dbEngine = new DatabaseEngine();
