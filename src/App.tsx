import React, { useState } from 'react';
import { CustomerProvider, useCustomerContext } from './context/CustomerContext.tsx';
import { CustomerListScreen } from './components/CustomerListScreen.tsx';
import { CustomerFormScreen } from './components/CustomerFormScreen.tsx';
import { DashboardScreen } from './components/DashboardScreen.tsx';
import { ActivityScreen } from './components/ActivityScreen.tsx';
import { SettingsScreen } from './components/SettingsScreen.tsx';
import { BottomNavigation } from './components/BottomNavigation.tsx';
import { DeleteConfirmModal } from './components/DeleteConfirmModal.tsx';
import { InstallModal } from './components/InstallModal.tsx';
import { OfflineIndicator } from './components/OfflineIndicator.tsx';
import { Toast, ToastMessage } from './components/Toast.tsx';
import { Customer, TabDestination } from './types.ts';
import { Smartphone, Monitor, Database, Download, QrCode } from 'lucide-react';

const AppContent: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    editingCustomer,
    setEditingCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    restoreCustomer,
    isDbConnected,
  } = useCustomerContext();

  const [activeTab, setActiveTab] = useState<TabDestination>('customers');
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [deviceFrameMode, setDeviceFrameMode] = useState<boolean>(true);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState<boolean>(false);
  const [installModalTab, setInstallModalTab] = useState<'android' | 'ios'>('ios');

  const showToast = (message: ToastMessage) => {
    setToast(message);
    setTimeout(() => {
      setToast((current) => (current?.id === message.id ? null : current));
    }, 4000);
  };

  const handleStartAdd = () => {
    setEditingCustomer(null);
    setCurrentView('form');
  };

  const handleStartEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setCurrentView('form');
  };

  const handleSaveCustomer = async (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    status: Customer['status'];
    tier: Customer['tier'];
    notes: string;
  }) => {
    try {
      if (editingCustomer) {
        await updateCustomer(editingCustomer.id, data);
        showToast({
          id: `toast-${Date.now()}`,
          type: 'success',
          text: `Updated ${data.name} in database`,
        });
      } else {
        await addCustomer(data);
        showToast({
          id: `toast-${Date.now()}`,
          type: 'success',
          text: `Saved ${data.name} to database`,
        });
      }
    } catch {
      showToast({
        id: `toast-${Date.now()}`,
        type: 'info',
        text: 'Changes saved locally',
      });
    }
    setEditingCustomer(null);
    setCurrentView('list');
  };

  const handleCancelForm = () => {
    setEditingCustomer(null);
    setCurrentView('list');
  };

  const handleDeleteRequest = (customer: Customer) => {
    setCustomerToDelete(customer);
  };

  const handleConfirmDelete = async () => {
    if (!customerToDelete) return;
    const target = customerToDelete;
    setCustomerToDelete(null);

    const removed = await deleteCustomer(target.id);
    if (removed) {
      showToast({
        id: `toast-${Date.now()}`,
        type: 'delete',
        text: `Deleted ${target.name}`,
        onUndo: async () => {
          await restoreCustomer(target);
          showToast({
            id: `toast-undo-${Date.now()}`,
            type: 'success',
            text: `Restored ${target.name}`,
          });
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 text-slate-800 antialiased font-sans">
      {/* Top Desktop Controls Toolbar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-[420px] mb-3 px-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 font-medium text-slate-300">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 text-[11px]">
            <Database className="w-3 h-3 text-emerald-400" />
            <span className="text-slate-300">
              {isDbConnected ? 'SQLite 3 Connected' : 'Local Fallback'}
            </span>
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                isDbConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setInstallModalTab('ios');
              setIsInstallModalOpen(true);
            }}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-colors cursor-pointer text-[11px] shadow-xs"
            title="Scan QR Code to install on iPhone"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>iPhone QR</span>
          </button>

          <button
            type="button"
            onClick={() => setIsInstallModalOpen(true)}
            className="flex items-center gap-1.5 py-1 px-2.5 rounded-lg bg-sky-600/90 hover:bg-sky-600 text-white font-medium transition-colors cursor-pointer text-[11px] shadow-xs"
            title="Download App for Android and iOS"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download App</span>
          </button>

          <button
            type="button"
            onClick={() => setDeviceFrameMode(!deviceFrameMode)}
            className="flex items-center gap-1 py-1 px-2.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 transition-colors cursor-pointer text-[11px]"
            title="Toggle iPhone bezel frame"
          >
            {deviceFrameMode ? (
              <>
                <Monitor className="w-3 h-3" />
                <span>Full Fit</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3 h-3" />
                <span>iPhone Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Device Frame Container */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col overflow-hidden bg-slate-50 ${
          deviceFrameMode
            ? 'max-w-[400px] h-[100dvh] sm:h-[844px] sm:rounded-[44px] sm:border-[8px] sm:border-slate-900 sm:ring-1 sm:ring-white/20 sm:shadow-2xl'
            : 'max-w-md h-[100dvh] sm:h-[880px] sm:rounded-2xl sm:shadow-xl'
        }`}
        data-purpose="mobile-device-container"
      >
        {/* Dynamic Island / Speaker notch bar in iPhone Frame mode */}
        {deviceFrameMode && (
          <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-40 items-center justify-center pointer-events-none">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 ml-16" />
          </div>
        )}

        {/* Global Toast */}
        <Toast toast={toast} onClose={() => setToast(null)} />

        {/* Global Offline Indicator */}
        <OfflineIndicator />

        {/* Main View Flow */}
        <div className="flex-1 flex flex-col relative overflow-hidden h-full">
          {currentView === 'form' ? (
            <CustomerFormScreen
              initialCustomer={editingCustomer}
              onSave={handleSaveCustomer}
              onCancel={handleCancelForm}
            />
          ) : (
            <div className="flex-1 flex flex-col h-full relative">
              <div className="flex-1 overflow-hidden relative">
                {activeTab === 'customers' && (
                  <CustomerListScreen
                    onAddCustomer={handleStartAdd}
                    onEditCustomer={handleStartEdit}
                    onDeleteCustomer={handleDeleteRequest}
                    onOpenInstall={() => setIsInstallModalOpen(true)}
                  />
                )}
                {activeTab === 'dashboard' && (
                  <DashboardScreen onAddCustomer={handleStartAdd} />
                )}
                {activeTab === 'activity' && <ActivityScreen />}
                {activeTab === 'settings' && (
                  <SettingsScreen
                    deviceFrameEnabled={deviceFrameMode}
                    onToggleDeviceFrame={() => setDeviceFrameMode(!deviceFrameMode)}
                    onOpenInstall={() => setIsInstallModalOpen(true)}
                  />
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 z-30">
                <BottomNavigation
                  activeTab={activeTab}
                  onTabChange={(tab) => setActiveTab(tab)}
                />
              </div>
            </div>
          )}
        </div>

        {/* Install Modal for Android & iOS */}
        <InstallModal
          isOpen={isInstallModalOpen}
          initialTab={installModalTab}
          onClose={() => setIsInstallModalOpen(false)}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmModal
          customer={customerToDelete}
          isOpen={Boolean(customerToDelete)}
          onConfirm={handleConfirmDelete}
          onCancel={() => setCustomerToDelete(null)}
        />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CustomerProvider>
      <AppContent />
    </CustomerProvider>
  );
}
