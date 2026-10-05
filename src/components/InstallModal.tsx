import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
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
  Copy,
  Check,
  ExternalLink,
} from 'lucide-react';

interface InstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'android' | 'ios';
}

export const InstallModal: React.FC<InstallModalProps> = ({ isOpen, onClose, initialTab }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [platformTab, setPlatformTab] = useState<'android' | 'ios'>(initialTab || (isIOS ? 'ios' : 'ios'));
  const [qrType, setQrType] = useState<'safari' | 'ipa'>('safari');
  const [installing, setInstalling] = useState(false);
  const [dynamicQr, setDynamicQr] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Active working URL
  const activeUrl = typeof window !== 'undefined' && window.location.origin
    ? window.location.origin
    : 'https://ais-dev-e3uege3aujdqlftdejw7ck-797467860036.asia-southeast1.run.app';

  const currentTargetUrl = qrType === 'ipa' ? `${activeUrl}/api/download/ios-ipa` : activeUrl;

  useEffect(() => {
    if (!isOpen) return;
    QRCode.toDataURL(currentTargetUrl, {
      width: 360,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0f172a', light: '#ffffff' },
    })
      .then(setDynamicQr)
      .catch((err) => console.error('Failed to generate QR data URL:', err));
  }, [isOpen, currentTargetUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentTargetUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
            {/* Direct .APK Download Action */}
            <div className="p-3 bg-slate-900 text-white rounded-2xl space-y-2 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🤖</span>
                  <div>
                    <p className="text-xs font-bold leading-tight">CustomerManager.apk</p>
                    <p className="text-[10px] text-slate-400">Android APK Package · 342 KB</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full">
                  Android APK
                </span>
              </div>

              <a
                href="/api/download/android-apk"
                download="CustomerManager.apk"
                className="w-full h-9 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Download .APK File</span>
              </a>

              <p className="text-[10px] text-slate-400 leading-tight">
                Direct installer for any Android phone or tablet. Tap to install directly.
              </p>
            </div>

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
                className="w-full h-10 bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>{installing ? 'Installing...' : '1-Tap Install in Chrome / Edge'}</span>
              </button>
            ) : (
              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <p className="font-semibold text-slate-800">Install via Mobile Browser:</p>
                <ol className="list-decimal pl-4 space-y-1.5 text-[11px] leading-relaxed">
                  <li>
                    Tap the <strong>three dots (⋮)</strong> menu in Chrome or Edge.
                  </li>
                  <li>
                    Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                  </li>
                  <li>Tap <strong>Install</strong> to add the Customer Manager app to your phone.</li>
                </ol>
              </div>
            )}
          </div>
        )}

        {/* iOS Tab Content */}
        {platformTab === 'ios' && (
          <div className="space-y-3.5">
            {/* Prominent iPhone QR Code Card */}
            <div className="p-4 bg-slate-900 text-white rounded-3xl space-y-3 shadow-md border border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                    📱
                  </div>
                  <div>
                    <h4 className="text-xs font-bold leading-tight text-white">
                      Scan with iPhone Camera
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      Open Camera app &amp; point at QR code
                    </p>
                  </div>
                </div>

                <div className="flex bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60 text-[10px]">
                  <button
                    type="button"
                    onClick={() => setQrType('safari')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                      qrType === 'safari'
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Safari App
                  </button>
                  <button
                    type="button"
                    onClick={() => setQrType('ipa')}
                    className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                      qrType === 'ipa'
                        ? 'bg-sky-500 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    .IPA File
                  </button>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 bg-white text-slate-800 p-3.5 rounded-2xl">
                <div className="relative p-1 bg-white rounded-xl shadow-xs border border-slate-100 shrink-0">
                  <img
                    src={dynamicQr || (qrType === 'safari' ? '/qr-iphone.svg' : '/qr-ipa.svg')}
                    alt="iPhone Installation QR Code"
                    className="w-32 h-32 object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-7 h-7 bg-white rounded-lg shadow-sm border border-slate-200 flex items-center justify-center text-xs">
                      {qrType === 'safari' ? '🍎' : '📦'}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 text-left flex-1 min-w-0">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                    {qrType === 'safari' ? 'Instant Safari Web App' : 'Raw iOS .IPA File'}
                  </span>
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {qrType === 'safari'
                      ? 'Point iPhone camera → Tap the yellow Safari notification to launch.'
                      : 'Scan to directly download CustomerManager.ipa onto your iPhone.'}
                  </p>

                  {/* Active URL & Copy Button */}
                  <div className="pt-1 flex items-center gap-1.5">
                    <input
                      type="text"
                      readOnly
                      value={currentTargetUrl}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[10px] font-mono text-slate-600 truncate select-all focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleCopyLink}
                      className="px-2 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 text-[10px] font-semibold flex items-center gap-1 transition-colors cursor-pointer shrink-0"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-tight">
                    {qrType === 'safari'
                      ? 'Sign in with your Google account on iPhone if prompted.'
                      : 'AirDrop or load into AltStore / Sideloadly.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Direct .IPA Download & OTA Buttons */}
            <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <span>📦</span>
                  <span>Direct Files for iPhone</span>
                </span>
                <span className="text-[10px] text-slate-500">224 KB</span>
              </div>

              <div className="flex gap-2">
                <a
                  href="/api/download/ios-ipa"
                  download="CustomerManager.ipa"
                  className="flex-1 h-9 bg-sky-600 hover:bg-sky-700 active:scale-[0.99] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Download .IPA File</span>
                </a>

                <a
                  href={`itms-services://?action=download-manifest&url=${encodeURIComponent(
                    typeof window !== 'undefined'
                      ? `${window.location.origin}/api/download/ios-manifest`
                      : ''
                  )}`}
                  className="px-3 h-9 bg-white hover:bg-slate-100 active:scale-[0.99] text-slate-700 font-semibold text-xs rounded-xl border border-slate-200 transition-all flex items-center justify-center gap-1 cursor-pointer"
                  title="Over-The-Air iOS installation for registered enterprise/developer devices"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>OTA Install</span>
                </a>
              </div>
            </div>

            {/* Instant Safari Install Guide */}
            <div className="space-y-2.5 text-xs text-slate-600 bg-sky-50/50 p-3.5 rounded-2xl border border-sky-100">
              <p className="font-semibold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>How to install once opened in Safari:</span>
                </span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-100/70 px-2 py-0.5 rounded-full">
                  1-Tap Native App
                </span>
              </p>
              <div className="space-y-2 text-[11px] leading-relaxed">
                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    In Safari, tap the <strong>Share</strong> button <Share className="w-3.5 h-3.5 inline text-sky-600 mx-0.5" /> at the bottom bar.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    Scroll down and tap <PlusSquare className="w-3.5 h-3.5 inline text-slate-700 mx-0.5" /> <strong>"Add to Home Screen"</strong>.
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    Tap <strong>"Add"</strong> in the top right. The Customer Manager icon will now appear on your home screen.
                  </div>
                </div>
              </div>
            </div>
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
                src={dynamicQr || `https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(currentTargetUrl)}`}
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
