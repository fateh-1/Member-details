import React from 'react';

interface iOSStatusBarProps {
  time?: string;
  theme?: 'light' | 'dark';
}

export const IOSStatusBar: React.FC<iOSStatusBarProps> = ({
  time = '9:41',
  theme = 'light',
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-800';
  const batteryBorder = isDark ? 'border-white' : 'border-slate-800';
  const batteryFill = isDark ? 'bg-white' : 'bg-slate-800';

  return (
    <header
      className={`w-full pt-3 px-7 pb-1 flex justify-between items-center select-none ${textColor}`}
      data-purpose="status-bar"
    >
      <span className="text-xs font-semibold tracking-tight">{time}</span>
      <div className="flex items-center space-x-2">
        {/* Cellular Signal Icon */}
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-label="Cellular signal">
          <path d="M2 17h2.5v4H2v-4zm4.5-3.5H9v7.5H6.5v-7.5zM11 9h2.5v12H11V9zm4.5-4H18v16h-2.5V5zM20 1h2.5v20H20V1z" />
        </svg>

        {/* WiFi Icon */}
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-label="Wi-Fi">
          <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3.2c3.8 0 7.24 1.54 9.74 4.04L12 19.46 2.26 11.24C4.76 8.74 8.2 7.2 12 7.2z" />
        </svg>

        {/* Battery Icon */}
        <div
          className={`w-5 h-2.5 border ${batteryBorder} rounded-xs p-0.5 flex items-center`}
          aria-label="Battery 75%"
        >
          <div className={`h-full ${batteryFill} w-3/4 rounded-2xs`} />
        </div>
      </div>
    </header>
  );
};
