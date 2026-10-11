import React from "react";
import { UserCheck, UserPlus, Plus } from "lucide-react";

interface VolunteersTabProps {
  volunteersList: any[];
  tasksList: any[];
  onOpenCreateVolunteer: () => void;
  onOpenDispatchModal: (volunteerId?: string) => void;
}

export const VolunteersTab: React.FC<VolunteersTabProps> = ({
  volunteersList,
  tasksList,
  onOpenCreateVolunteer,
  onOpenDispatchModal
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#26332F]">Volunteer Coordination Hub</h2>
          <p className="text-xs text-[#71817A]">
            Assign ground pickup and distribution tasks to active volunteers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenCreateVolunteer}
            className="rounded-xl border border-[#2F5547] bg-[#EBF3ED] text-[#2F5547] px-4 py-2 text-xs font-bold hover:bg-[#DCEBE0] transition shadow-xs flex items-center gap-1.5"
          >
            <UserPlus className="h-4 w-4" />
            <span>+ Onboard New Volunteer</span>
          </button>

          <button
            onClick={() => onOpenDispatchModal()}
            className="rounded-xl bg-[#2F5547] text-white px-4 py-2 text-xs font-bold hover:bg-[#254439] transition shadow-xs flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            <span>Create Dispatch Task</span>
          </button>
        </div>
      </div>

      {/* Volunteers List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {volunteersList.map((vol) => (
          <div
            key={vol._id}
            className="rounded-2xl border border-[#DDE6DF] bg-white p-4 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                  <UserCheck className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-[#26332F]">{vol.name}</h4>
                  <p className="text-xs text-[#71817A]">{vol.phone}</p>
                </div>
              </div>

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  vol.volunteerDetails?.availability
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {vol.volunteerDetails?.availability ? "Available" : "Busy"}
              </span>
            </div>

            <div className="rounded-xl bg-[#F8FAF8] p-3 text-xs space-y-1">
              <p>
                <span className="font-semibold text-[#26332F]">Vehicle: </span>
                <span className="capitalize text-[#4F7C68]">
                  {vol.volunteerDetails?.vehicleType?.replace("_", " ") || "2 Wheeler"}
                </span>
              </p>
              <p>
                <span className="font-semibold text-[#26332F]">Area: </span>
                <span>{vol.location?.city || "Delhi NCR"}</span>
              </p>
              <p>
                <span className="font-semibold text-[#26332F]">Active Tasks: </span>
                <span>{vol.activeTasksCount || 0}</span>
              </p>
            </div>

            <button
              onClick={() => onOpenDispatchModal(vol._id)}
              className="w-full rounded-xl border border-[#DDE6DF] bg-white py-2 text-xs font-semibold text-[#2F5547] hover:bg-[#F3F6F3] transition"
            >
              Assign Task to {vol.name.split(" ")[0]}
            </button>
          </div>
        ))}
      </div>

      {/* Active Tasks Feed */}
      <div className="rounded-2xl border border-[#DDE6DF] bg-white p-5 shadow-xs">
        <h3 className="font-bold text-sm text-[#26332F] mb-3">
          Recent Dispatched Tasks ({tasksList.length})
        </h3>

        <div className="space-y-2.5">
          {tasksList.map((task) => (
            <div
              key={task._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-[#E6ECE8] p-3 text-xs"
            >
              <div>
                <span className="font-bold text-sm text-[#26332F]">{task.title}</span>
                <p className="text-[#71817A] mt-0.5">
                  Assigned to: <strong>{task.volunteerId?.name || "Unassigned"}</strong> · Time: {task.scheduledTime}
                </p>
              </div>

              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase self-start sm:self-auto ${
                  task.status === "completed"
                    ? "bg-purple-100 text-purple-800"
                    : task.status === "assigned"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-emerald-100 text-emerald-800"
                }`}
              >
                {task.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
