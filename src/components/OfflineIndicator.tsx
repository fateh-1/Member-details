import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div className="absolute top-12 left-4 right-4 z-40 flex justify-center pointer-events-none animate-fadeIn">
      {isOnline ? (
        <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-[11px] font-medium border border-emerald-500">
          <Wifi className="w-3.5 h-3.5" />
          <span>Back online — database synchronized</span>
        </div>
      ) : (
        <div className="bg-amber-600 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 text-[11px] font-medium border border-amber-500">
          <WifiOff className="w-3.5 h-3.5" />
          <span>Offline mode — database cached locally</span>
        </div>
      )}
    </div>
  );
};
