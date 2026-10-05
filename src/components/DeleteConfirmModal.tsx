import React from 'react';
import { Customer } from '../types.ts';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  customer: Customer | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  customer,
  isOpen,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !customer) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 animate-fadeIn">
      <div
        className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl border border-slate-100 space-y-4 animate-scaleUp"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 border border-rose-100">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 leading-snug">Delete Customer</h3>
            <p className="text-xs text-slate-500">Remove from directory</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Are you sure you want to delete <span className="font-semibold text-slate-800">{customer.name}</span> ({customer.displayId})?
        </p>

        <div className="space-y-2 pt-1">
          <button
            type="button"
            onClick={onConfirm}
            className="w-full h-10 bg-rose-600 hover:bg-rose-700 active:scale-[0.98] text-white font-semibold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm Delete</span>
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full h-9 bg-slate-100 hover:bg-slate-200 active:scale-[0.98] text-slate-700 font-medium text-xs rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
