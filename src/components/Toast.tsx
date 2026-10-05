import React from 'react';
import { CheckCircle2, Trash2, RotateCcw } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'delete' | 'info';
  text: string;
  onUndo?: () => void;
}

export const Toast: React.FC<{
  toast: ToastMessage | null;
  onClose: () => void;
}> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div className="absolute top-12 left-4 right-4 z-50 flex justify-center pointer-events-none animate-fadeIn">
      <div className="bg-slate-900/95 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center justify-between gap-3 text-xs max-w-sm w-full pointer-events-auto border border-slate-700/60">
        <div className="flex items-center gap-2 truncate">
          {toast.type === 'delete' ? (
            <Trash2 className="w-4 h-4 text-rose-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="truncate">{toast.text}</span>
        </div>

        {toast.onUndo ? (
          <button
            type="button"
            onClick={() => {
              toast.onUndo?.();
              onClose();
            }}
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold text-[11px] shrink-0 uppercase tracking-wider px-2 py-0.5 rounded bg-sky-950/60 border border-sky-800/80 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};
