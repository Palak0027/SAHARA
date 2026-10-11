import React from "react";
import { Search } from "lucide-react";

interface UsersTabProps {
  filteredUsers: any[];
  userSearch: string;
  setUserSearch: (search: string) => void;
  userRoleFilter: string;
  setUserRoleFilter: (role: string) => void;
  onToggleUserStatus: (userId: string, currentStatus: boolean) => void;
  actionLoading: boolean;
}

export const UsersTab: React.FC<UsersTabProps> = ({
  filteredUsers,
  userSearch,
  setUserSearch,
  userRoleFilter,
  setUserRoleFilter,
  onToggleUserStatus,
  actionLoading
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#26332F]">User Directory</h2>
          <p className="text-xs text-[#71817A]">
            Manage donor, receiver, volunteer, and admin accounts.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#71817A]">
            Total: {filteredUsers.length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A9891]" />
          <input
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            placeholder="Search by name, phone, email, or city..."
            className="w-full rounded-xl border border-[#D9E1DB] bg-white py-2 pl-9 pr-4 text-xs sm:text-sm outline-none focus:border-[#4F7C68] focus:ring-2 focus:ring-[#E5F0E8]"
          />
        </div>

        <select
          value={userRoleFilter}
          onChange={(e) => setUserRoleFilter(e.target.value)}
          className="rounded-xl border border-[#D9E1DB] bg-white px-3 py-2 text-xs sm:text-sm font-medium text-[#26332F] outline-none"
        >
          <option value="all">All Roles</option>
          <option value="donor">Donors</option>
          <option value="receiver">Receivers / NGOs</option>
          <option value="volunteer">Volunteers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-[#DDE6DF] bg-white shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left">
            <thead className="bg-[#F6F8F6] text-[11px] font-bold uppercase tracking-wider text-[#71817A]">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E6ECE8] text-xs sm:text-sm">
              {filteredUsers.map((item) => (
                <tr key={item._id} className="hover:bg-[#F9FAF9] transition">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-[#26332F]">{item.name}</div>
                    {item.organization?.orgName && (
                      <div className="text-[11px] text-[#4F7C68] font-medium">
                        {item.organization.orgName}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[#26332F]">{item.phone}</div>
                    <div className="text-[11px] text-[#8A9891]">
                      {item.email || "No email"}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-[#EEF4F0] px-2.5 py-1 text-[11px] font-semibold text-[#2F5547] uppercase">
                      {item.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#71817A]">
                    {item.location?.city || "New Delhi"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                        item.isActive
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.isActive ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {item.role !== "admin" && (
                      <button
                        onClick={() => onToggleUserStatus(item._id, item.isActive)}
                        disabled={actionLoading}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          item.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        }`}
                      >
                        {item.isActive ? "Block" : "Activate"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
