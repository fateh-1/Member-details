import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import {
  Download,
  Share,
  PlusSquare,
  X,
  Smartphone,
  CheckCircle2,
  QrCode,
  Sparkles,
  WifiOff,
  ShieldCheck,
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [platformTab, setPlatformTab] = useState<'android' | 'ios'>(isIOS ? 'ios' : 'android');
  const [installing, setInstalling] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleInstallClick = async () => {
    setInstalling(true);
    try {
      await install();
    } finally {
      setInstalling(false);
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/60 backdrop-blur-xs p-3 sm:p-4 animate-fadeIn select-none">
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar relative animate-scaleUp text-slate-800"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header with App Icon */}
        <div className="flex items-center space-x-3.5 pt-1">
          <img
            src="/pwa-192x192.png"
            alt="Customer Manager"
            className="w-12 h-12 rounded-2xl shadow-md border border-slate-100 object-cover"
          />
          <div>
            <h2 className="text-base font-bold text-slate-900 leading-snug">
              Download App
            </h2>
            <p className="text-xs text-slate-500">Install for Android &amp; iOS</p>
          </div>
        </div>

        {/* Feature Badges */}
        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
          <div className="flex items-center gap-1.5 p-2 bg-sky-50/70 border border-sky-100 rounded-xl">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-600 shrink-0" />
            <span className="truncate">Standalone App</span>
          </div>
          <div className="flex items-center gap-1.5 p-2 bg-emerald-50/70 border border-emerald-100 rounded-xl">
            <WifiOff className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="truncate">Offline Access</span>
          </div>
        </div>

        {/* Platform Tabs */}
        <div className="flex rounded-xl bg-slate-100 p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setPlatformTab('android')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              platformTab === 'android'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🤖 Android</span>
          </button>
          <button
            type="button"
            onClick={() => setPlatformTab('ios')}
            className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              platformTab === 'ios'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>🍎 iOS / iPhone</span>
          </button>
        </div>

        {/* Android Tab Content */}
        {platformTab === 'android' && (
          <div className="space-y-3">
            {isInstalled ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>App is already installed and running on this device!</span>
              </div>
            ) : isInstallable ? (
              <button
                type="button"
                onClick={handleInstallClick}
                disabled={installing}
                className="w-full h-11 bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-floating-btn transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{installing ? 'Installing...' : 'Install Now on Android'}</span>
              </button>
            ) : (
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="font-semibold text-slate-800">How to install on Android (Chrome / Brave / Edge):</p>
                <ol className="list-decimal pl-4 space-y-1.5 text-[11px] leading-relaxed">
                  <li>
                    Tap the <strong>three dots (⋮)</strong> menu in your browser's top right corner.
                  </li>
                  <li>
                    Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>Tap <strong>Install</strong> to add the Customer Manager icon to your phone.</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* iOS Tab Content */}
        {platformTab === 'ios' && (
          <div className="space-y-3">
            {isInstalled ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-800">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>App is running as an installed iOS Web App!</span>
              </div>
            ) : (
              <div className="space-y-2.5 text-xs text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p className="font-semibold text-slate-800">How to install on iPhone &amp; iPad (Safari):</p>
                <div className="space-y-2 text-[11px] leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      In Safari, tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" /> at the bottom bar.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      Scroll down the share sheet and tap <PlusSquare className="w-3.5 h-3.5 inline text-slate-700 mx-0.5" /> <strong>"Add to Home Screen"</strong>.
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      Tap <strong>"Add"</strong> in the top right. The Customer Manager icon will now appear on your home screen.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scan from Phone section (QR code) */}
        <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
            <span className="flex items-center gap-1.5">
              <QrCode className="w-3.5 h-3.5 text-sky-600" />
              <span>Scan to Open on Mobile</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Camera App</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct QR Code SVG rendering of current URL */}
            <div className="p-2 bg-white rounded-xl shadow-xs border border-slate-200 shrink-0">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(currentUrl)}`}
                alt="QR Code to install on mobile"
                className="w-18 h-18 rounded"
                referrerPolicy="no-referrer"
              />
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Open your iPhone or Android camera and scan this QR code to load the app directly on your phone and tap install.
            </p>
          </div>
        </div>

        {/* Footer Close */}
        <button
          type="button"
          onClick={onClose}
          className="w-full h-9 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
        >
          Done
        </button>
      </div>
    </div>
  );
};
