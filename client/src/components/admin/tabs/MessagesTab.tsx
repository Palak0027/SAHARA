import React, { useState, useMemo } from "react";
import {
  Mail,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Trash2,
  ExternalLink,
  MessageSquare,
  X,
  Phone,
  User,
  Calendar,
  AlertCircle
} from "lucide-react";
import type { ContactMessageItem } from "../../../services/api/admin";

interface MessagesTabProps {
  messagesList: ContactMessageItem[];
  onUpdateStatus: (id: string, status: "unread" | "read" | "resolved") => Promise<void>;
  onDeleteMessage: (id: string) => Promise<void>;
  actionLoading: boolean;
}

export const MessagesTab: React.FC<MessagesTabProps> = ({
  messagesList,
  onUpdateStatus,
  onDeleteMessage,
  actionLoading
}) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "unread" | "read" | "resolved">("all");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messagesList.filter((msg) => {
      const q = search.toLowerCase();
      const matchesSearch =
        msg.name?.toLowerCase().includes(q) ||
        msg.email?.toLowerCase().includes(q) ||
        msg.phone?.includes(q) ||
        msg.subject?.toLowerCase().includes(q) ||
        msg.message?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === "all" || msg.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [messagesList, search, statusFilter]);

  const counts = useMemo(() => {
    return {
      all: messagesList.length,
      unread: messagesList.filter((m) => m.status === "unread").length,
      read: messagesList.filter((m) => m.status === "read").length,
      resolved: messagesList.filter((m) => m.status === "resolved").length
    };
  }, [messagesList]);

  const handleOpenDetail = (msg: ContactMessageItem) => {
    setSelectedMessage(msg);
    // Auto-mark unread as read when opened
    if (msg.status === "unread") {
      onUpdateStatus(msg._id, "read");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[#DDE6DF] bg-white p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F4EC] text-[#2F5547]">
              <MessageSquare className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-[#26332F]">
              Contact Us Inquiries
            </h2>
          </div>
          <p className="mt-1 text-xs text-[#71817A]">
            Messages and inquiries submitted by visitors from the SAHARA home page.
          </p>
        </div>

        {/* Status Count Badges */}
        <div className="flex flex-wrap items-center gap-2">
          {(["all", "unread", "read", "resolved"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === st
                  ? "bg-[#2F5547] text-white shadow-sm"
                  : "bg-[#F3F6F4] text-[#63756E] hover:bg-[#E9EFEA]"
              }`}
            >
              <span className="capitalize">{st}</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  statusFilter === st
                    ? "bg-white/20 text-white"
                    : st === "unread" && counts.unread > 0
                    ? "bg-red-500 text-white"
                    : "bg-[#DDE5E0] text-[#4F615A]"
                }`}
              >
                {counts[st]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#8C9C94]" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by sender name, email, phone, subject or keyword..."
          className="w-full rounded-xl border border-[#DDE6DF] bg-white pl-11 pr-4 py-3 text-sm text-[#26332F] outline-none transition focus:border-[#2F5547] focus:ring-4 focus:ring-[#2F5547]/10"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C9C94] hover:text-[#26332F]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Messages Table / List */}
      {filteredMessages.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#DDE6DF] bg-white py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF2EC] text-[#2F5547]">
            <Mail className="h-7 w-7" />
          </div>
          <h3 className="mt-4 text-base font-bold text-[#26332F]">No inquiries found</h3>
          <p className="mt-1 max-w-sm text-xs text-[#71817A]">
            {search || statusFilter !== "all"
              ? "Try adjusting your search query or status filter."
              : "When visitors submit the Contact Us form on the home page, messages will appear here."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#DDE6DF] bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-[#26332F]">
              <thead className="border-b border-[#E8EFEA] bg-[#F7F9F7] text-[11px] font-bold uppercase tracking-wider text-[#71817A]">
                <tr>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Sender</th>
                  <th className="px-5 py-3.5">Topic / Subject</th>
                  <th className="px-5 py-3.5">Message Preview</th>
                  <th className="px-5 py-3.5">Received</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFEFEF]">
                {filteredMessages.map((msg) => {
                  const dateStr = new Date(msg.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  });

                  return (
                    <tr
                      key={msg._id}
                      onClick={() => handleOpenDetail(msg)}
                      className={`cursor-pointer transition hover:bg-[#F4F8F5] ${
                        msg.status === "unread" ? "bg-[#F0F8F3]/60 font-medium" : ""
                      }`}
                    >
                      {/* Status Badge */}
                      <td className="px-5 py-4 whitespace-nowrap">
                        {msg.status === "unread" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                            Unread
                          </span>
                        )}
                        {msg.status === "read" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                            <Clock className="h-3 w-3" />
                            Read
                          </span>
                        )}
                        {msg.status === "resolved" && (
                          <span className="inline-flex items-center gap-1 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Resolved
                          </span>
                        )}
                      </td>

                      {/* Sender */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-[#26332F]">{msg.name}</div>
                        <div className="text-xs text-[#71817A]">{msg.email}</div>
                        {msg.phone && (
                          <div className="text-xs text-[#71817A] flex items-center gap-1 mt-0.5">
                            <Phone className="h-3 w-3 text-[#2F5547]" /> {msg.phone}
                          </div>
                        )}
                      </td>

                      {/* Subject */}
                      <td className="px-5 py-4">
                        <span className="inline-block rounded-lg bg-[#EAF2EC] px-2.5 py-1 text-xs font-bold text-[#2F5547]">
                          {msg.subject || "General Inquiry"}
                        </span>
                      </td>

                      {/* Message Preview */}
                      <td className="px-5 py-4 max-w-xs">
                        <p className="line-clamp-2 text-xs text-[#63756E]">
                          {msg.message}
                        </p>
                      </td>

                      {/* Date */}
                      <td className="px-5 py-4 whitespace-nowrap text-xs text-[#71817A]">
                        {dateStr}
                      </td>

                      {/* Actions */}
                      <td
                        className="px-5 py-4 whitespace-nowrap text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-1.5">
                          {msg.status !== "resolved" ? (
                            <button
                              disabled={actionLoading}
                              onClick={() => onUpdateStatus(msg._id, "resolved")}
                              className="rounded-lg border border-[#CDE5D5] bg-white px-2.5 py-1 text-xs font-bold text-[#287B53] transition hover:bg-[#E8F5EB]"
                              title="Mark as Resolved"
                            >
                              Resolve
                            </button>
                          ) : (
                            <button
                              disabled={actionLoading}
                              onClick={() => onUpdateStatus(msg._id, "unread")}
                              className="rounded-lg border border-[#DDE6DF] bg-white px-2.5 py-1 text-xs font-semibold text-[#71817A] transition hover:bg-[#F3F6F4]"
                              title="Mark as Unread"
                            >
                              Re-open
                            </button>
                          )}

                          <button
                            disabled={actionLoading}
                            onClick={() => {
                              if (window.confirm(`Delete message from ${msg.name}?`)) {
                                onDeleteMessage(msg._id);
                              }
                            }}
                            className="rounded-lg p-1.5 text-[#B0BDB6] transition hover:bg-red-50 hover:text-red-600"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-xl overflow-hidden rounded-3xl border border-[#DDE6DF] bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E8EFEA] bg-[#F7F9F7] px-6 py-4">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#E8F4EC] text-[#2F5547]">
                  <Mail className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-[#26332F]">Contact Inquiry</h3>
                  <p className="text-[11px] text-[#71817A]">
                    Received on {new Date(selectedMessage.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg p-1 text-[#71817A] hover:bg-[#EAEFEA]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Sender Details Card */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 rounded-2xl border border-[#E8EFEA] bg-[#F8FAF8] p-4 text-xs">
                <div>
                  <span className="text-[#889991] font-semibold">Sender Name</span>
                  <p className="font-bold text-[#26332F] text-sm mt-0.5">{selectedMessage.name}</p>
                </div>

                <div>
                  <span className="text-[#889991] font-semibold">Email Address</span>
                  <p className="font-bold text-[#26332F] text-sm mt-0.5">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                        selectedMessage.subject
                      )}`}
                      className="text-[#086474] hover:underline flex items-center gap-1"
                    >
                      {selectedMessage.email}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </p>
                </div>

                {selectedMessage.phone && (
                  <div>
                    <span className="text-[#889991] font-semibold">Phone</span>
                    <p className="font-bold text-[#26332F] text-sm mt-0.5">
                      <a href={`tel:${selectedMessage.phone}`} className="text-[#2F5547] hover:underline">
                        {selectedMessage.phone}
                      </a>
                    </p>
                  </div>
                )}

                <div>
                  <span className="text-[#889991] font-semibold">Topic</span>
                  <p className="font-bold text-[#2F5547] text-sm mt-0.5">
                    {selectedMessage.subject}
                  </p>
                </div>
              </div>

              {/* Message Content */}
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#71817A]">
                  Message Content
                </label>
                <div className="mt-2 rounded-2xl border border-[#DDE6DF] bg-white p-4 text-sm leading-6 text-[#26332F] whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-[#E8EFEA] bg-[#F7F9F7] px-6 py-4">
              <div className="flex items-center gap-2">
                <button
                  disabled={actionLoading}
                  onClick={async () => {
                    const newSt = selectedMessage.status === "resolved" ? "unread" : "resolved";
                    await onUpdateStatus(selectedMessage._id, newSt);
                    setSelectedMessage((prev) => (prev ? { ...prev, status: newSt } : null));
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
                    selectedMessage.status === "resolved"
                      ? "border border-[#DDE6DF] bg-white text-[#71817A] hover:bg-gray-50"
                      : "bg-[#287B53] text-white hover:bg-[#1E6040]"
                  }`}
                >
                  {selectedMessage.status === "resolved" ? "Re-open Inquiry" : "Mark as Resolved"}
                </button>

                <button
                  disabled={actionLoading}
                  onClick={async () => {
                    if (window.confirm("Delete this message permanently?")) {
                      await onDeleteMessage(selectedMessage._id);
                      setSelectedMessage(null);
                    }
                  }}
                  className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-100"
                >
                  Delete
                </button>
              </div>

              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                  selectedMessage.subject
                )}`}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#086474] to-[#0A4D59] px-5 py-2 text-xs font-bold text-white shadow-sm hover:opacity-90"
              >
                <Mail className="h-3.5 w-3.5" />
                Reply via Email →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
