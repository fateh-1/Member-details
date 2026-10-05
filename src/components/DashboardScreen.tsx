import React from 'react';
import { useCustomerContext } from '../context/CustomerContext.tsx';
import { IOSStatusBar } from './iOSStatusBar.tsx';
import {
  TrendingUp,
  Award,
  Users,
  Building2,
  Clock,
  CheckCircle,
  Plus,
  BarChart3,
} from 'lucide-react';

export const DashboardScreen: React.FC<{ onAddCustomer: () => void }> = ({ onAddCustomer }) => {
  const { customers, stats } = useCustomerContext();

  const standardCount = customers.filter((c) => c.tier === 'standard').length;
  const vipCount = customers.filter((c) => c.tier === 'vip').length;
  const commercialCount = customers.filter((c) => c.tier === 'commercial').length;

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col relative select-none">
      {/* iOSStatusBar */}
      <div className="bg-white sticky top-0 z-30 border-b border-slate-100">
        <IOSStatusBar time="9:41" />
      </div>

      {/* MainHeader */}
      <header className="bg-white px-5 py-4 border-b border-slate-200/80 sticky top-[33px] z-20 flex items-center justify-between shadow-xs shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Performance</h1>
          <p className="text-xs text-slate-500 font-medium">Analytics &amp; Portfolio Growth</p>
        </div>
        <button
          onClick={onAddCustomer}
          className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow-xs transition-all cursor-pointer"
          type="button"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Client</span>
        </button>
      </header>

      {/* Content */}
      <div className="px-4 py-5 space-y-5 flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* KPI Grid */}
        <section className="grid grid-cols-2 gap-3">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-ios-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                +14.2%
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500">Client Retention</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">96.8%</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-ios-card">
            <div className="flex items-center justify-between text-slate-400 mb-2">
              <span className="p-1.5 rounded-lg bg-sky-50 text-sky-600">
                <Clock className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-semibold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                Fast
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500">Avg Lead Response</p>
            <p className="text-2xl font-bold text-slate-900 mt-1 tabular-nums">1.4 hrs</p>
          </div>
        </section>

        {/* Account Tiers Breakdown */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-ios-card space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Customer Tier Distribution
            </h3>
            <span className="text-[11px] text-slate-400">Total: {stats.total}</span>
          </div>

          {/* Progress bar */}
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden flex">
            <div
              className="bg-purple-500 h-full"
              style={{ width: `${Math.round((vipCount / (customers.length || 1)) * 100)}%` }}
              title="VIP"
            />
            <div
              className="bg-sky-500 h-full"
              style={{ width: `${Math.round((commercialCount / (customers.length || 1)) * 100)}%` }}
              title="Commercial"
            />
            <div
              className="bg-slate-400 h-full flex-1"
              title="Standard"
            />
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="p-2 bg-purple-50/70 border border-purple-100 rounded-xl">
              <p className="text-[10px] font-medium text-purple-700">VIP / Premium</p>
              <p className="text-base font-bold text-purple-900 mt-0.5 tabular-nums">
                {Math.round(stats.total * 0.25)}
              </p>
            </div>
            <div className="p-2 bg-sky-50/70 border border-sky-100 rounded-xl">
              <p className="text-[10px] font-medium text-sky-700">Commercial</p>
              <p className="text-base font-bold text-sky-900 mt-0.5 tabular-nums">
                {Math.round(stats.total * 0.35)}
              </p>
            </div>
            <div className="p-2 bg-slate-100/70 border border-slate-200 rounded-xl">
              <p className="text-[10px] font-medium text-slate-700">Standard</p>
              <p className="text-base font-bold text-slate-900 mt-0.5 tabular-nums">
                {Math.round(stats.total * 0.40)}
              </p>
            </div>
          </div>
        </section>

        {/* Directory Health */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-ios-card space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Directory Status
          </h3>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Active Accounts</span>
              </div>
              <span className="font-semibold text-slate-900 tabular-nums">{stats.active}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>New Inbound Leads</span>
              </div>
              <span className="font-semibold text-slate-900 tabular-nums">{stats.newThisMonth}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                <span>Archived Accounts</span>
              </div>
              <span className="font-semibold text-slate-900 tabular-nums">{stats.archived}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
