import React, { useState } from 'react';
import { Customer, ColorTheme } from '../types.ts';
import { Pencil, Trash2, Mail, Phone, MapPin, ChevronDown, ChevronUp, Star, ShieldCheck } from 'lucide-react';

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

const COLOR_CLASSES: Record<ColorTheme, { bg: string; text: string; border: string }> = {
  blue: { bg: 'bg-blue-100', text: 'text-sky-700', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
  amber: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200' },
  emerald: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  rose: { bg: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
  indigo: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-200' },
  cyan: { bg: 'bg-cyan-100', text: 'text-cyan-800', border: 'border-cyan-200' },
};

export const CustomerCard: React.FC<CustomerCardProps> = ({ customer, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const colors = COLOR_CLASSES[customer.colorTheme] || COLOR_CLASSES.blue;

  const getStatusLabelAndDot = (status: Customer['status']) => {
    switch (status) {
      case 'active':
        return {
          label: 'Active Client',
          dot: 'bg-emerald-500',
        };
      case 'lead':
        return {
          label: 'New Lead',
          dot: 'bg-amber-500',
        };
      case 'inactive':
        return {
          label: 'Inactive',
          dot: 'bg-slate-400',
        };
      case 'archived':
        return {
          label: 'Archived',
          dot: 'bg-slate-300',
        };
    }
  };

  const statusInfo = getStatusLabelAndDot(customer.status);

  const getTierBadge = (tier: Customer['tier']) => {
    switch (tier) {
      case 'vip':
        return {
          name: 'VIP Tier',
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
        };
      case 'commercial':
        return {
          name: 'Commercial',
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
        };
      default:
        return {
          name: 'Standard Tier',
          bg: 'bg-slate-50 text-slate-600 border-slate-200',
        };
    }
  };

  const tierBadge = getTierBadge(customer.tier);

  return (
    <article
      className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-ios-card transition-all duration-150 hover:shadow-md hover:border-slate-300 relative group"
      data-purpose="customer-card"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {/* Avatar with Initials */}
          <div
            className={`w-11 h-11 rounded-full ${colors.bg} ${colors.text} ${colors.border} flex items-center justify-center font-bold text-sm tracking-tight border shrink-0`}
          >
            {customer.initials}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                {customer.name}
              </h3>
              {customer.tier === 'vip' && (
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400 shrink-0" />
              )}
            </div>
            <div className="flex items-center text-xs text-slate-500 mt-0.5">
              <span className={`inline-block w-1.5 h-1.5 rounded-full ${statusInfo.dot} mr-1.5`} />
              <span>{statusInfo.label}</span>
            </div>
          </div>
        </div>

        {/* Top right status indicator / ID */}
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider font-mono">
            {customer.displayId}
          </span>
        </div>
      </div>

      {/* Customer Details Block */}
      <div className="mt-3.5 pt-3 border-t border-slate-100 grid grid-cols-1 gap-1.5 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <a
            className="text-sky-600 hover:text-sky-700 hover:underline truncate"
            href={`mailto:${customer.email}`}
            onClick={(e) => e.stopPropagation()}
          >
            {customer.email}
          </a>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <a
            className="text-slate-700 font-mono text-[11px] hover:text-sky-600"
            href={`tel:${customer.phone.replace(/\s+/g, '')}`}
            onClick={(e) => e.stopPropagation()}
          >
            {customer.phone}
          </a>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="mt-2 pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600 animate-fadeIn">
            {customer.address && (
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="text-slate-700">{customer.address}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${tierBadge.bg}`}>
                {tierBadge.name}
              </span>
            </div>
            {customer.notes && (
              <div className="p-2 bg-slate-50 rounded-lg text-[11px] text-slate-600 italic border border-slate-100 mt-1">
                "{customer.notes}"
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wireframe Actions: Edit & Delete + Expand Toggle */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-[11px] font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1 py-1"
          aria-expanded={isExpanded}
        >
          {isExpanded ? (
            <>
              <span>Less</span>
              <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              <span>Details</span>
              <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => onEdit(customer)}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-sky-600 hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1 active:scale-95"
            data-purpose="action-edit"
          >
            <Pencil className="w-3 h-3" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => onDelete(customer)}
            className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors flex items-center gap-1 active:scale-95"
            data-purpose="action-delete"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </article>
  );
};
