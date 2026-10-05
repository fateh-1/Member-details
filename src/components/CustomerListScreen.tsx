import React, { useRef } from 'react';
import { Customer, FilterCategory } from '../types.ts';
import { useCustomerContext } from '../context/CustomerContext.tsx';
import { CustomerCard } from './CustomerCard.tsx';
import { IOSStatusBar } from './iOSStatusBar.tsx';
import {
  Users,
  UserPlus,
  CheckCircle2,
  Search,
  Plus,
  ArrowDown,
  UserX,
  X,
  Download,
} from 'lucide-react';

interface CustomerListScreenProps {
  onAddCustomer: () => void;
  onEditCustomer: (customer: Customer) => void;
  onDeleteCustomer: (customer: Customer) => void;
  onOpenInstall: () => void;
}

export const CustomerListScreen: React.FC<CustomerListScreenProps> = ({
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  onOpenInstall,
}) => {
  const {
    filteredCustomers,
    customers,
    searchQuery,
    setSearchQuery,
    activeFilter,
    setActiveFilter,
    stats,
  } = useCustomerContext();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col relative select-none">
      {/* BEGIN: iOSStatusBar */}
      <div className="bg-white sticky top-0 z-30 border-b border-slate-100">
        <IOSStatusBar time="9:41" />
      </div>
      {/* END: iOSStatusBar */}

      {/* BEGIN: MainHeader */}
      <header className="bg-white px-5 py-4 border-b border-slate-200/80 sticky top-[33px] z-20 flex items-center justify-between shadow-xs shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Customer Manager</h1>
          <p className="text-xs text-slate-500 font-medium">Directory &amp; Performance</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Download App trigger */}
          <button
            onClick={onOpenInstall}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Download for Android & iOS"
            type="button"
          >
            <Download className="w-4 h-4 text-sky-600" />
          </button>

          {/* Add Customer Action Button */}
          <button
            onClick={onAddCustomer}
            className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-1 cursor-pointer"
            data-purpose="add-customer-button"
            type="button"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Add Customer</span>
          </button>
        </div>
      </header>
      {/* END: MainHeader */}

      {/* Scrollable Content Area */}
      <div
        ref={scrollContainerRef}
        className="px-4 py-5 space-y-6 flex-1 overflow-y-auto no-scrollbar pb-24"
      >
        {/* BEGIN: DashboardMetrics */}
        <section aria-label="Dashboard Overview" data-purpose="metrics-dashboard">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Dashboard</h2>
            <span className="text-[11px] font-medium text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
              Updated today
            </span>
          </div>

          {/* 3 Horizontal Metric Cards */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Card 1: Total Customers */}
            <div
              onClick={() => setActiveFilter('all')}
              className={`bg-white border rounded-2xl p-3 shadow-ios-card flex flex-col justify-between transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'border-sky-400 ring-2 ring-sky-100'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="p-1.5 rounded-lg bg-blue-50 text-sky-600">
                  <Users className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <p className="text-[11px] leading-tight font-medium text-slate-500">Total Customers</p>
                <p className="text-xl font-bold tracking-tight text-slate-900 mt-1 tabular-nums">
                  {stats.total}
                </p>
              </div>
            </div>

            {/* Card 2: New This Month */}
            <div
              onClick={() => setActiveFilter('new')}
              className={`bg-white border rounded-2xl p-3 shadow-ios-card flex flex-col justify-between transition-all cursor-pointer ${
                activeFilter === 'new'
                  ? 'border-emerald-400 ring-2 ring-emerald-100'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                  <UserPlus className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <p className="text-[11px] leading-tight font-medium text-slate-500">New This Month</p>
                <p className="text-xl font-bold tracking-tight text-slate-900 mt-1 tabular-nums">
                  {stats.newThisMonth}
                </p>
              </div>
            </div>

            {/* Card 3: Active Customers */}
            <div
              onClick={() => setActiveFilter('active')}
              className={`bg-white border rounded-2xl p-3 shadow-ios-card flex flex-col justify-between transition-all cursor-pointer ${
                activeFilter === 'active'
                  ? 'border-indigo-400 ring-2 ring-indigo-100'
                  : 'border-slate-200/90 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <p className="text-[11px] leading-tight font-medium text-slate-500">Active Customers</p>
                <p className="text-xl font-bold tracking-tight text-slate-900 mt-1 tabular-nums">
                  {stats.active}
                </p>
              </div>
            </div>
          </div>
        </section>
        {/* END: DashboardMetrics */}

        {/* BEGIN: SearchAndFilters */}
        <section className="space-y-2.5" data-purpose="search-section">
          <div className="relative">
            <input
              className="w-full bg-white border border-slate-200 rounded-2xl py-3 pl-4 pr-11 text-sm text-slate-800 placeholder-slate-400 shadow-xs focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all outline-none"
              id="customer-search"
              placeholder="Search customers..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {/* Search Icon / Clear Action */}
            <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
              ) : (
                <div className="p-1.5 rounded-lg bg-slate-100 text-slate-500 pointer-events-none">
                  <Search className="w-4 h-4 text-sky-600" />
                </div>
              )}
            </div>
          </div>

          {/* Filter Quick-Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => setActiveFilter('all')}
              className={`text-xs px-3 py-1.5 font-medium rounded-full shadow-xs whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
              type="button"
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setActiveFilter('active')}
              className={`text-xs px-3 py-1.5 font-medium rounded-full whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === 'active'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
              type="button"
            >
              Active ({stats.active})
            </button>
            <button
              onClick={() => setActiveFilter('new')}
              className={`text-xs px-3 py-1.5 font-medium rounded-full whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === 'new'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
              type="button"
            >
              New ({stats.newThisMonth})
            </button>
            <button
              onClick={() => setActiveFilter('archived')}
              className={`text-xs px-3 py-1.5 font-medium rounded-full whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === 'archived'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
              type="button"
            >
              Archived ({stats.archived})
            </button>
          </div>
        </section>
        {/* END: SearchAndFilters */}

        {/* BEGIN: CustomerListSection */}
        <section aria-labelledby="customers-header" data-purpose="customer-records">
          <div className="flex items-center justify-between mb-3 px-1">
            <h2
              className="text-xs font-bold uppercase tracking-wider text-slate-500"
              id="customers-header"
            >
              Customers
            </h2>
            <span className="text-xs text-slate-400">
              Showing {filteredCustomers.length} of {customers.length}
            </span>
          </div>

          {/* Contact Cards Container */}
          {filteredCustomers.length > 0 ? (
            <div className="space-y-3">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onEdit={onEditCustomer}
                  onDelete={onDeleteCustomer}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-8 text-center shadow-ios-card space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <UserX className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">No customers found</h3>
                <p className="text-xs text-slate-500 mt-1">
                  {searchQuery
                    ? `No results match "${searchQuery}". Try a different keyword.`
                    : 'No customer profiles in this category.'}
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-2">
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                  >
                    Clear Search
                  </button>
                )}
                <button
                  onClick={onAddCustomer}
                  className="px-3 py-1.5 text-xs font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
                >
                  Add Customer
                </button>
              </div>
            </div>
          )}
        </section>
        {/* END: CustomerListSection */}

        {/* Scroll to bottom quick target (wireframe circle with down arrow) */}
        <div className="flex justify-end pt-2 pb-2">
          <button
            aria-label="Scroll to bottom"
            onClick={scrollToBottom}
            className="w-10 h-10 rounded-full bg-white shadow-md border border-slate-200 flex items-center justify-center text-slate-600 hover:text-sky-600 active:scale-95 transition-all cursor-pointer"
            type="button"
          >
            <ArrowDown className="w-5 h-5" />
          </button>
        </div>

        <div ref={bottomAnchorRef} className="h-2" />
      </div>
    </div>
  );
};
