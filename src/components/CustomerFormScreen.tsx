import React, { useState, useEffect } from 'react';
import { Customer, AccountStatus, CustomerTier } from '../types.ts';
import { IOSStatusBar } from './iOSStatusBar.tsx';
import { IOSHomeIndicator } from './iOSHomeIndicator.tsx';
import { User, Mail, Phone, MapPin, ChevronLeft, Check, Loader2 } from 'lucide-react';

interface CustomerFormScreenProps {
  initialCustomer?: Customer | null;
  onSave: (data: {
    name: string;
    email: string;
    phone: string;
    address: string;
    status: AccountStatus;
    tier: CustomerTier;
    notes: string;
  }) => void;
  onCancel: () => void;
}

export const CustomerFormScreen: React.FC<CustomerFormScreenProps> = ({
  initialCustomer,
  onSave,
  onCancel,
}) => {
  const isEditing = Boolean(initialCustomer);

  const [name, setName] = useState(initialCustomer?.name || 'John Smith');
  const [email, setEmail] = useState(initialCustomer?.email || 'john@email.com');
  const [phone, setPhone] = useState(initialCustomer?.phone || '0400 111 222');
  const [address, setAddress] = useState(initialCustomer?.address || 'Sydney NSW');
  const [status, setStatus] = useState<AccountStatus>(initialCustomer?.status || 'active');
  const [tier, setTier] = useState<CustomerTier>(initialCustomer?.tier || 'standard');
  const [notes, setNotes] = useState(initialCustomer?.notes || '');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (initialCustomer) {
      setName(initialCustomer.name);
      setEmail(initialCustomer.email);
      setPhone(initialCustomer.phone);
      setAddress(initialCustomer.address);
      setStatus(initialCustomer.status);
      setTier(initialCustomer.tier);
      setNotes(initialCustomer.notes);
    }
  }, [initialCustomer]);

  const isValidEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  };

  const isEmailValid = isValidEmail(email);

  const handleReset = () => {
    if (initialCustomer) {
      setName(initialCustomer.name);
      setEmail(initialCustomer.email);
      setPhone(initialCustomer.phone);
      setAddress(initialCustomer.address);
      setStatus(initialCustomer.status);
      setTier(initialCustomer.tier);
      setNotes(initialCustomer.notes);
    } else {
      setName('');
      setEmail('');
      setPhone('');
      setAddress('');
      setStatus('active');
      setTier('standard');
      setNotes('');
    }
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Customer name is required';
    if (!email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!phone.trim()) newErrors.phone = 'Phone number is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Realistic visual response matching the wireframe interaction script
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);

      setTimeout(() => {
        onSave({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          status,
          tier,
          notes: notes.trim(),
        });
      }, 700);
    }, 600);
  };

  return (
    <div
      className="w-full h-full bg-[#F8FAFC] text-slate-800 flex flex-col relative select-none"
      data-purpose="mobile-device-container"
    >
      {/* BEGIN: iOSStatusBar */}
      <div className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100/50">
        <IOSStatusBar time="9:41" />
      </div>
      {/* END: iOSStatusBar */}

      {/* BEGIN: NavigationHeader */}
      <nav
        className="w-full bg-white/80 backdrop-blur-md px-4 py-3 border-b border-slate-200/80 flex items-center justify-between sticky top-[33px] z-20 shrink-0"
        data-purpose="top-navigation"
      >
        {/* Back button matching wireframe '<- Back' */}
        <button
          aria-label="Go back"
          onClick={onCancel}
          className="flex items-center text-sky-600 hover:text-sky-700 active:opacity-60 transition text-sm font-medium -ml-1 py-1 px-2 rounded-lg cursor-pointer"
          type="button"
        >
          <ChevronLeft className="w-4 h-4 mr-0.5 stroke-[2.5]" />
          <span>Back</span>
        </button>

        {/* Center Title */}
        <h1 className="text-base font-semibold text-slate-900 tracking-tight absolute left-1/2 -translate-x-1/2 whitespace-nowrap">
          {isEditing ? 'Edit Customer' : 'Add New Customer'}
        </h1>

        {/* Right Action / Reset helper */}
        <button
          onClick={handleReset}
          className="text-xs font-medium text-slate-400 hover:text-slate-600 active:opacity-70 transition px-1 py-1 cursor-pointer"
          type="button"
        >
          Reset
        </button>
      </nav>
      {/* END: NavigationHeader */}

      {/* BEGIN: FormContentScrollArea */}
      <main
        className="flex-1 overflow-y-auto px-4 py-4 space-y-4 no-scrollbar"
        data-purpose="form-scrollable-content"
      >
        {/* Informative Subtitle Banner */}
        <div className="px-1">
          <p className="text-xs text-slate-500">
            {isEditing
              ? 'Update the profile details and account tier for this customer.'
              : 'Fill in the profile details below to register a customer account.'}
          </p>
        </div>

        {/* BEGIN: CustomerForm */}
        <form className="space-y-3.5 pb-6" id="add-customer-form" onSubmit={handleSubmit}>
          {/* Input 1: Customer Name */}
          <div
            className={`bg-white rounded-xl p-3 shadow-ios-card border transition-all form-input-focus ${
              errors.name ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200'
            }`}
            data-purpose="input-group"
          >
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
              htmlFor="customer-name"
            >
              CUSTOMER NAME <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-0 text-slate-400 pl-0.5 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                className="w-full pl-7 pr-3 py-0.5 text-sm font-medium text-slate-800 placeholder-slate-400 bg-transparent border-none focus:ring-0 focus:outline-none"
                id="customer-name"
                name="customerName"
                placeholder="Enter full name"
                required
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
              />
            </div>
            {errors.name && <p className="text-[11px] text-rose-500 mt-1 pl-1">{errors.name}</p>}
          </div>

          {/* Input 2: Email */}
          <div
            className={`bg-white rounded-xl p-3 shadow-ios-card border transition-all form-input-focus ${
              errors.email ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200'
            }`}
            data-purpose="input-group"
          >
            <div className="flex justify-between items-center mb-1.5">
              <label
                className="block text-xs font-semibold uppercase tracking-wider text-slate-500"
                htmlFor="email"
              >
                EMAIL ADDRESS <span className="text-rose-500">*</span>
              </label>
              {email.trim() && isEmailValid ? (
                <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 flex items-center gap-0.5">
                  <Check className="w-2.5 h-2.5" />
                  Verified Format
                </span>
              ) : email.trim() ? (
                <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                  Invalid Format
                </span>
              ) : null}
            </div>
            <div className="relative flex items-center">
              <span className="absolute left-0 text-slate-400 pl-0.5 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                className="w-full pl-7 pr-3 py-0.5 text-sm font-medium text-slate-800 placeholder-slate-400 bg-transparent border-none focus:ring-0 focus:outline-none"
                id="email"
                name="email"
                placeholder="e.g. name@domain.com"
                required
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: '' }));
                }}
              />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1 pl-1">{errors.email}</p>}
          </div>

          {/* Input 3: Phone */}
          <div
            className={`bg-white rounded-xl p-3 shadow-ios-card border transition-all form-input-focus ${
              errors.phone ? 'border-rose-400 ring-1 ring-rose-200' : 'border-slate-200'
            }`}
            data-purpose="input-group"
          >
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
              htmlFor="phone"
            >
              PHONE NUMBER <span className="text-rose-500">*</span>
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-0 text-slate-400 pl-0.5 pointer-events-none">
                <Phone className="w-4 h-4" />
              </span>
              <input
                className="w-full pl-7 pr-3 py-0.5 text-sm font-medium text-slate-800 placeholder-slate-400 bg-transparent border-none focus:ring-0 focus:outline-none font-mono"
                id="phone"
                name="phone"
                placeholder="e.g. 0400 000 000"
                required
                type="tel"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: '' }));
                }}
              />
            </div>
            {errors.phone && <p className="text-[11px] text-rose-500 mt-1 pl-1">{errors.phone}</p>}
          </div>

          {/* Input 4: Address */}
          <div
            className="bg-white rounded-xl p-3 shadow-ios-card border border-slate-200 transition-all form-input-focus"
            data-purpose="input-group"
          >
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5"
              htmlFor="address"
            >
              ADDRESS
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-0 text-slate-400 pl-0.5 pointer-events-none">
                <MapPin className="w-4 h-4" />
              </span>
              <input
                className="w-full pl-7 pr-3 py-0.5 text-sm font-medium text-slate-800 placeholder-slate-400 bg-transparent border-none focus:ring-0 focus:outline-none"
                id="address"
                name="address"
                placeholder="Street, City, State, Postcode"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Extra Production Fields: Account Status & Customer Tier */}
          <div className="grid grid-cols-2 gap-3">
            {/* Status Dropdown */}
            <div className="bg-white rounded-xl p-2.5 shadow-ios-card border border-slate-200 form-input-focus">
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1"
                htmlFor="status"
              >
                ACCOUNT STATUS
              </label>
              <select
                className="w-full py-0.5 pl-1 pr-6 text-xs font-medium text-slate-700 bg-transparent border-none focus:ring-0 focus:outline-none cursor-pointer"
                id="status"
                name="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as AccountStatus)}
              >
                <option value="active">Active</option>
                <option value="lead">Lead</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            {/* Customer Tier */}
            <div className="bg-white rounded-xl p-2.5 shadow-ios-card border border-slate-200 form-input-focus">
              <label
                className="block text-[11px] font-semibold uppercase tracking-wider text-slate-500 mb-1"
                htmlFor="customer-type"
              >
                CUSTOMER TIER
              </label>
              <select
                className="w-full py-0.5 pl-1 pr-6 text-xs font-medium text-slate-700 bg-transparent border-none focus:ring-0 focus:outline-none cursor-pointer"
                id="customer-type"
                name="customerType"
                value={tier}
                onChange={(e) => setTier(e.target.value as CustomerTier)}
              >
                <option value="standard">Standard</option>
                <option value="vip">Premium / VIP</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>
          </div>

          {/* Optional Notes */}
          <div className="bg-white rounded-xl p-3 shadow-ios-card border border-slate-200 form-input-focus">
            <label
              className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1"
              htmlFor="notes"
            >
              ADDITIONAL NOTES
            </label>
            <textarea
              className="w-full text-xs font-medium text-slate-800 placeholder-slate-400 bg-transparent border-none p-0 focus:ring-0 focus:outline-none resize-none"
              id="notes"
              name="notes"
              placeholder="Preferred contact times, gate access notes..."
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </form>
        {/* END: CustomerForm */}
      </main>
      {/* END: FormContentScrollArea */}

      {/* BEGIN: BottomActionSection */}
      <footer
        className="p-4 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-lg space-y-2 sticky bottom-0 z-20 shrink-0"
        data-purpose="action-footer"
      >
        {/* Save Customer Button matching wireframe '[ Save Customer ]' */}
        <button
          className={`w-full h-12 text-white font-semibold text-sm rounded-xl flex items-center justify-center space-x-2 shadow-floating-btn transition-all duration-200 ease-out cursor-pointer ${
            isSuccess
              ? 'bg-emerald-600 hover:bg-emerald-700'
              : 'bg-sky-600 hover:bg-sky-700 active:scale-[0.99]'
          } ${isSubmitting ? 'opacity-90 cursor-wait' : ''}`}
          data-purpose="save-button"
          form="add-customer-form"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-white" />
              <span>Saving Customer...</span>
            </>
          ) : isSuccess ? (
            <>
              <Check className="w-4 h-4 text-white stroke-[2.5]" />
              <span>Customer Saved!</span>
            </>
          ) : (
            <>
              <Check className="w-4 h-4 text-white stroke-[2.5]" />
              <span>{isEditing ? 'Save Changes' : 'Save Customer'}</span>
            </>
          )}
        </button>

        {/* Secondary Cancel Option */}
        <button
          className="w-full py-1.5 text-center text-xs font-medium text-slate-500 hover:text-slate-700 active:opacity-60 transition cursor-pointer"
          type="button"
          onClick={onCancel}
        >
          Discard & Exit
        </button>
      </footer>
      {/* END: BottomActionSection */}

      {/* BEGIN: iOSHomeIndicator */}
      <IOSHomeIndicator bg="bg-white" />
      {/* END: iOSHomeIndicator */}
    </div>
  );
};
