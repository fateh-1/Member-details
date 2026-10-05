import React from 'react';
import { useCustomerContext } from '../context/CustomerContext.tsx';
import { IOSStatusBar } from './iOSStatusBar.tsx';
import { UserPlus, Edit3, Trash2, RefreshCw, Clock } from 'lucide-react';

export const ActivityScreen: React.FC = () => {
  const { activityLogs } = useCustomerContext();

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'create':
        return {
          icon: <UserPlus className="w-3.5 h-3.5" />,
          bg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        };
      case 'update':
        return {
          icon: <Edit3 className="w-3.5 h-3.5" />,
          bg: 'bg-sky-50 text-sky-600 border-sky-100',
        };
      case 'delete':
        return {
          icon: <Trash2 className="w-3.5 h-3.5" />,
          bg: 'bg-rose-50 text-rose-600 border-rose-100',
        };
      default:
        return {
          icon: <RefreshCw className="w-3.5 h-3.5" />,
          bg: 'bg-purple-50 text-purple-600 border-purple-100',
        };
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 flex flex-col relative select-none">
      {/* iOSStatusBar */}
      <div className="bg-white sticky top-0 z-30 border-b border-slate-100">
        <IOSStatusBar time="9:41" />
      </div>

      {/* MainHeader */}
      <header className="bg-white px-5 py-4 border-b border-slate-200/80 sticky top-[33px] z-20 flex items-center justify-between shadow-xs shrink-0">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Activity</h1>
          <p className="text-xs text-slate-500 font-medium">Audit Trail &amp; Client History</p>
        </div>
        <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
          {activityLogs.length} events
        </span>
      </header>

      {/* Content */}
      <div className="px-4 py-5 space-y-4 flex-1 overflow-y-auto no-scrollbar pb-24">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-ios-card divide-y divide-slate-100">
          {activityLogs.map((log) => {
            const config = getActionIcon(log.action);
            return (
              <div key={log.id} className="py-3 first:pt-0 last:pb-0 flex items-start space-x-3">
                <div
                  className={`w-8 h-8 rounded-xl ${config.bg} border flex items-center justify-center shrink-0 mt-0.5`}
                >
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-slate-900 truncate">
                      {log.customerName}
                    </p>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 shrink-0">
                      <Clock className="w-2.5 h-2.5" />
                      {log.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">{log.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
