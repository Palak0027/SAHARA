import React from "react";
import { Search } from "lucide-react";

interface DonationsTabProps {
  filteredDonations: any[];
  donationSearch: string;
  setDonationSearch: (search: string) => void;
  donationStatusFilter: string;
  setDonationStatusFilter: (status: string) => void;
  onUpdateDonationStatus: (donationId: string, status: string) => void;
  onOpenDispatchForDonation: (donation: any) => void;
}

export const DonationsTab: React.FC<DonationsTabProps> = ({
  filteredDonations,
  donationSearch,
  setDonationSearch,
  donationStatusFilter,
  setDonationStatusFilter,
  onUpdateDonationStatus,
  onOpenDispatchForDonation
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#26332F]">Donation Management</h2>
          <p className="text-xs text-[#71817A]">
            Review food safety details, available items, and fulfillment stages.
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9891]" />
          <input
            value={donationSearch}
            onChange={(e) => setDonationSearch(e.target.value)}
            placeholder="Search by title, donor name, or location..."
            className="w-full rounded-xl border border-[#D9E1DB] bg-white py-2 pl-9 pr-4 text-xs sm:text-sm outline-none focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]"
          />
        </div>

        <select
          value={donationStatusFilter}
          onChange={(e) => setDonationStatusFilter(e.target.value)}
          className="rounded-xl border border-[#D9E1DB] bg-white px-3 py-2 text-xs sm:text-sm font-medium text-[#26332F] outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="available">Available</option>
          <option value="matched">Matched</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Donations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDonations.map((d) => (
          <div
            key={d._id}
            className="rounded-2xl border border-[#DDE6DF] bg-white p-4 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="rounded-lg bg-[#EBF3ED] text-[#2F5547] px-2.5 py-1 text-xs font-bold">
                  {d.categoryId?.name || "General"}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                    d.status === "available"
                      ? "bg-emerald-100 text-emerald-800"
                      : d.status === "matched"
                      ? "bg-blue-100 text-blue-800"
                      : d.status === "completed"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {d.status}
                </span>
              </div>

              <h4 className="font-bold text-sm text-[#26332F]">{d.title}</h4>
              <p className="text-xs text-[#4F7C68] font-semibold mt-0.5">
                Quantity: {d.quantity} {d.unit}
              </p>

              <div className="mt-3 space-y-1 text-xs text-[#71817A]">
                <p>👤 Donor: {d.donorId?.name || "Anonymous Donor"}</p>
                <p>📍 Location: {d.location?.city || "Delhi"}</p>
                {d.foodDetails?.isVeg !== undefined && (
                  <p>
                    🥗 Food Type: {d.foodDetails.isVeg ? "100% Vegetarian" : "Non-Veg"}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-[#E6ECE8] flex items-center justify-between gap-2">
              <select
                value={d.status}
                onChange={(e) => onUpdateDonationStatus(d._id, e.target.value)}
                className="rounded-lg border border-[#D9E1DB] bg-[#F7F9F7] px-2 py-1 text-xs font-medium text-[#26332F] outline-none"
              >
                <option value="available">Available</option>
                <option value="matched">Matched</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <button
                onClick={() => onOpenDispatchForDonation(d)}
                className="rounded-lg bg-[#2F5547] text-white px-3 py-1 text-xs font-semibold hover:bg-[#254439] transition"
              >
                Dispatch
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
