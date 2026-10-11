import React from "react";
import { Truck, X } from "lucide-react";

interface DispatchTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  form: {
    title: string;
    description: string;
    volunteerId: string;
    donationId: string;
    needId: string;
    scheduledTime: string;
    urgency: string;
    peopleNeeded: number;
  };
  setForm: React.Dispatch<
    React.SetStateAction<{
      title: string;
      description: string;
      volunteerId: string;
      donationId: string;
      needId: string;
      scheduledTime: string;
      urgency: string;
      peopleNeeded: number;
    }>
  >;
  volunteersList: any[];
  donationsList: any[];
  needsList: any[];
  actionLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export const DispatchTaskModal: React.FC<DispatchTaskModalProps> = ({
  isOpen,
  onClose,
  form,
  setForm,
  volunteersList,
  donationsList,
  needsList,
  actionLoading,
  onSubmit
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#E6ECE8] pb-3">
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-[#2F5547]" />
            <h3 className="font-bold text-base text-[#26332F]">
              Dispatch Volunteer Mission
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#8A9891] hover:bg-[#F3F6F3]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-[#26332F] mb-1">
              Mission Title
            </label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Pickup 100 food packets and deliver to shelter"
              className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none focus:border-[#4F7C68]"
            />
          </div>

          <div>
            <label className="block font-semibold text-[#26332F] mb-1">
              Assign To Volunteer
            </label>
            <select
              value={form.volunteerId}
              onChange={(e) =>
                setForm({ ...form, volunteerId: e.target.value })
              }
              className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none bg-white font-medium"
            >
              <option value="">-- Open for any available volunteer --</option>
              {volunteersList.map((vol) => (
                <option key={vol._id} value={vol._id}>
                  {vol.name} ({vol.volunteerDetails?.vehicleType || "2-wheeler"}) · {vol.location?.city}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#26332F] mb-1">
                Related Donation
              </label>
              <select
                value={form.donationId}
                onChange={(e) =>
                  setForm({ ...form, donationId: e.target.value })
                }
                className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none bg-white"
              >
                <option value="">None / Direct task</option>
                {donationsList.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.title} ({d.quantity} {d.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-[#26332F] mb-1">
                Related Need Request
              </label>
              <select
                value={form.needId}
                onChange={(e) => setForm({ ...form, needId: e.target.value })}
                className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none bg-white"
              >
                <option value="">None / Open relief</option>
                {needsList.map((n) => (
                  <option key={n._id} value={n._id}>
                    {n.title} ({n.urgency})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#26332F] mb-1">
                Scheduled Time
              </label>
              <input
                value={form.scheduledTime}
                onChange={(e) =>
                  setForm({ ...form, scheduledTime: e.target.value })
                }
                className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#26332F] mb-1">
                Urgency
              </label>
              <select
                value={form.urgency}
                onChange={(e) => setForm({ ...form, urgency: e.target.value })}
                className="w-full rounded-xl border border-[#D9E1DB] p-2.5 outline-none bg-white font-medium"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
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
              {actionLoading ? "Dispatching..." : "Confirm & Dispatch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
