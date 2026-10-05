import React, { useState } from 'react';
import { useCustomerContext } from '../context/CustomerContext.tsx';
import { IOSStatusBar } from './iOSStatusBar.tsx';
import {
  RotateCcw,
  Download,
  Database,
  Smartphone,
  Check,
  Info,
  Shield,
} from 'lucide-react';

interface SettingsScreenProps {
  deviceFrameEnabled: boolean;
  onToggleDeviceFrame: () => void;
  onOpenInstall: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({
  deviceFrameEnabled,
  onToggleDeviceFrame,
  onOpenInstall,
}) => {
  const { customers, resetToDemoData } = useCustomerContext();
  const [copied, setCopied] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(customers, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `customer_directory_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    resetToDemoData();
    setResetConfirm(false);
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
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Settings</h1>
          <p className="text-xs text-slate-500 font-medium">Preferences &amp; Data Management</p>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-5 space-y-4 flex-1 overflow-y-auto no-scrollbar pb-24">
        {/* Mobile Download Card (Android & iOS) */}
        <section className="bg-linear-to-br from-sky-600 to-sky-700 text-white rounded-2xl p-4 shadow-md space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Download className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs font-bold leading-tight">Install App on Phone</p>
              <p className="text-[11px] text-sky-100">Native standalone experience for Android &amp; iOS</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onOpenInstall}
            className="w-full h-10 bg-white hover:bg-sky-50 active:scale-[0.99] text-sky-700 font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Download &amp; Install App</span>
          </button>
        </section>

        {/* Device Viewport Mode */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-ios-card space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900">iPhone Device Frame</p>
                <p className="text-[11px] text-slate-500">Realistic iOS mockup view on desktop</p>
              </div>
            </div>
            <button
              type="button"
              onClick={onToggleDeviceFrame}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                deviceFrameEnabled ? 'bg-sky-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform absolute top-0.5 ${
                  deviceFrameEnabled ? 'translate-x-5.5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </section>

        {/* Data Management */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-ios-card space-y-3">
          <div className="flex items-center space-x-3 pb-2 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-900">Directory Storage</p>
              <p className="text-[11px] text-slate-500">{customers.length} records saved locally</p>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <button
              type="button"
              onClick={handleExportJSON}
              className="w-full h-10 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl px-3 flex items-center justify-between text-xs font-medium text-slate-700 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export Directory (JSON)</span>
              </div>
              {copied && (
                <span className="text-emerald-600 text-[11px] flex items-center gap-1 font-semibold">
                  <Check className="w-3.5 h-3.5" /> Downloaded
                </span>
              )}
            </button>

            <a
              href="/api/database/download-sqlite"
              download="customers.sqlite"
              className="w-full h-10 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl px-3 flex items-center justify-between text-xs font-medium text-sky-800 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-sky-600" />
                <span>Download SQLite Database (.sqlite file)</span>
              </div>
              <span className="text-[10px] text-sky-600 font-semibold bg-white px-2 py-0.5 rounded border border-sky-200">
                SQLite 3
              </span>
            </a>

            <a
              href="/api/download/android-apk"
              download="CustomerManager.apk"
              className="w-full h-10 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-3 flex items-center justify-between text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Download Android Package (.apk file)</span>
              </div>
              <span className="text-[10px] text-emerald-300 font-semibold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                Android .APK
              </span>
            </a>

            <a
              href="/api/download/ios-ipa"
              download="CustomerManager.ipa"
              className="w-full h-10 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl px-3 flex items-center justify-between text-xs font-medium text-white transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-sky-400" />
                <span>Download iOS App Package (.ipa file)</span>
              </div>
              <span className="text-[10px] text-sky-300 font-semibold bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                iOS .IPA
              </span>
            </a>

            {resetConfirm ? (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <p className="text-xs text-rose-700 font-medium">
                  Reset directory back to original wireframe state (John Smith, Mary Jones, David Lee)?
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => setResetConfirm(false)}
                    className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs rounded-lg font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setResetConfirm(true)}
                className="w-full h-10 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-xl px-3 flex items-center gap-2 text-xs font-medium text-rose-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-rose-500" />
                <span>Reset to Sample Wireframe Data</span>
              </button>
            )}
          </div>
        </section>

        {/* App Info */}
        <section className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-ios-card space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
            <Info className="w-4 h-4 text-slate-400" />
            <span>Customer Manager Mobile Suite</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">
            High-fidelity mobile client management platform inspired by clean iOS interfaces with realtime search, validation, and performance tracking.
          </p>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Version 2.4.0</span>
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-500" /> Secure Local Storage
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
