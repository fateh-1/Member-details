import React from 'react';
import { TabDestination } from '../types.ts';

interface BottomNavigationProps {
  activeTab: TabDestination;
  onTabChange: (tab: TabDestination) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav
      className="w-full bg-white/95 backdrop-blur-md border-t border-slate-200 px-6 py-2 z-30 flex items-center justify-between text-[11px] font-medium text-slate-500 shadow-lg shrink-0 select-none"
      data-purpose="bottom-nav"
    >
      {/* Nav Item: Dashboard */}
      <button
        type="button"
        onClick={() => onTabChange('dashboard')}
        className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
          activeTab === 'dashboard' ? 'text-sky-600 font-semibold' : 'text-slate-400 hover:text-sky-600'
        }`}
      >
        <svg
          className="w-5 h-5"
          fill={activeTab === 'dashboard' ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth={activeTab === 'dashboard' ? '0' : '2'}
          viewBox="0 0 24 24"
        >
          <path
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Dashboard</span>
      </button>

      {/* Nav Item: Customers */}
      <button
        type="button"
        onClick={() => onTabChange('customers')}
        className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
          activeTab === 'customers' ? 'text-sky-600 font-semibold' : 'text-slate-400 hover:text-sky-600'
        }`}
      >
        <svg
          className="w-5 h-5 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.633 13.067 13.067 0 01-6.761 1.87 13.067 13.067 0 01-6.761-1.87.75.75 0 01-.363-.633l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.5 10.5 0 006.234-1.104.75.75 0 00.363-.633v-.122c0-3.18-2.1-5.87-5.045-6.726a6.37 6.37 0 01-1.318 7.481z" />
        </svg>
        <span>Customers</span>
      </button>

      {/* Nav Item: Activity */}
      <button
        type="button"
        onClick={() => onTabChange('activity')}
        className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
          activeTab === 'activity' ? 'text-sky-600 font-semibold' : 'text-slate-400 hover:text-sky-600'
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>Activity</span>
      </button>

      {/* Nav Item: Settings */}
      <button
        type="button"
        onClick={() => onTabChange('settings')}
        className={`flex flex-col items-center gap-1 transition-colors cursor-pointer ${
          activeTab === 'settings' ? 'text-sky-600 font-semibold' : 'text-slate-400 hover:text-sky-600'
        }`}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>Settings</span>
      </button>
    </nav>
  );
};
