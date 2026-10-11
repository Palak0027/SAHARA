import React from "react";
import { UserPlus, X, AlertTriangle } from "lucide-react";

interface CreateVolunteerModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: {
    name: string;
    phone: string;
    email: string;
    password: string;
    city: string;
    address: string;
    vehicleType: string;
    availability: boolean;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      phone: string;
      email: string;
      password: string;
      city: string;
      address: string;
      vehicleType: string;
      availability: boolean;
    }>
  >;
  modalError: string | null;
  actionLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const CreateVolunteerModal: React.FC<CreateVolunteerModalProps> = ({
  isOpen,
  onClose,
  form,
  setForm,
  modalError,
  actionLoading,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[#E6ECE8] pb-3">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#2F5547]" />
            <h3 className="font-bold text-base text-[#26332F]">
              Onboard New Field Volunteer
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#8A9891] hover:bg-[#F3F6F3]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-xs text-[#71817A]">
          Volunteers are verified and onboarded exclusively by Administrators for community safety.
        </p>

        {/* Inline Error Alert */}
        {modalError && (
          <div className="flex items-center gap-2.5 rounded-xl bg-red-50 border border-red-200 p-3.5 text-red-700 text-xs font-semibold shadow-xs">
            <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
            <span className="flex-1">{modalError}</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-[#26332F] mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Ramesh Kumar"
              className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none focus:border-[#4F7C68]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#26332F] mb-1">
                Mobile Number (10 Digits) <span className="text-red-500">*</span>
              </label>
              <input
                required
                maxLength={10}
                value={form.phone}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value.replace(/\D/g, "") })
                }
                placeholder="9876543210"
                className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none focus:border-[#4F7C68]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#26332F] mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="ramesh@example.com"
                className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none focus:border-[#4F7C68]"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#26332F] mb-1">
              Initial Password <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Min 6 characters (e.g. Vol@2026)"
              className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none focus:border-[#4F7C68]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#26332F] mb-1">
                City / Region
              </label>
              <input
                required
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="New Delhi, Noida, etc."
                className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none focus:border-[#4F7C68]"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#26332F] mb-1">
                Vehicle Type
              </label>
              <select
                value={form.vehicleType}
                onChange={(e) =>
                  setForm({ ...form, vehicleType: e.target.value })
                }
                className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none bg-white font-medium"
              >
                <option value="two_wheeler">Two Wheeler (Bike / Scooter)</option>
                <option value="four_wheeler">Four Wheeler (Car / Van)</option>
                <option value="bicycle">Bicycle</option>
                <option value="none">On Foot / Public Transit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#26332F] mb-1">
              Locality / Base Address
            </label>
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              placeholder="e.g. Sector 18, Near Metro Station"
              className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none focus:border-[#4F7C68]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#E6ECE8]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#DDE6DF] px-4 py-2 font-semibold text-[#71817A] hover:bg-[#F3F6F3]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="rounded-xl bg-[#2F5547] text-white px-5 py-2 font-bold hover:bg-[#254439] transition disabled:opacity-50"
            >
              {actionLoading ? "Creating..." : "Create & Authorize Volunteer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
