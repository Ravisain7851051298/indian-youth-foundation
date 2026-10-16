"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiSearch,
  FiUserCheck,
  FiMail,
  FiPhone,
  FiUploadCloud,
  FiX,
  FiRefreshCw,
  FiAlertCircle
} from "react-icons/fi";
import api from "@/services/api";
import { getContentImageUrl } from "@/lib/authApi";

const DEPARTMENTS = [
  "All",
  "Leadership & Board",
  "Youth Empowerment & Training",
  "Child Education Drives",
  "Healthcare & Emergency Relief",
  "Community & Volunteer Force",
  "Administration & Accounts"
];

export default function TeamMembersManagement() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deleteModalItem, setDeleteModalItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [form, setForm] = useState({
    name: "",
    position: "",
    department: "Leadership & Board",
    bio: "",
    email: "",
    phone: "",
    image: ""
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await api.get("/team-members");
      const list = res.data?.data || res.data?.items || [];
      setMembers(Array.isArray(list) ? list : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    api.get("/team-members").then(res => {
      const list = res.data?.data || res.data?.items || [];
      if (isMounted) setMembers(Array.isArray(list) ? list : []);
    }).catch(err => {
      if (isMounted) toast.error(err.response?.data?.message || "Failed to load team members");
    }).finally(() => {
      if (isMounted) setLoading(false);
    });

    return () => { isMounted = false; };
  }, []);

  const openAdd = () => {
    setEditingMember(null);
    setForm({
      name: "",
      position: "",
      department: "Leadership & Board",
      bio: "",
      email: "",
      phone: "",
      image: ""
    });
    setPhotoFile(null);
    setPhotoPreview("");
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditingMember(member);
    setForm({
      name: member.name || "",
      position: member.position || "",
      department: member.department || "Leadership & Board",
      bio: member.bio || "",
      email: member.email || "",
      phone: member.phone || "",
      image: member.image || ""
    });
    setPhotoFile(null);
    setPhotoPreview(member.image ? getContentImageUrl(member.image) : "");
    setModalOpen(true);
  };

  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview("");
    setForm((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.position) {
      toast.error("Name and Position are required");
      return;
    }

    try {
      setSubmitting(true);
      let imageUrl = form.image;

      if (photoFile) {
        const formData = new FormData();
        formData.append("file", photoFile);
        const upRes = await api.post("/upload", formData);
        if (upRes.data?.url) {
          imageUrl = upRes.data.url;
        }
      }

      const payload = { ...form, image: imageUrl };

      if (editingMember) {
        const id = editingMember._id || editingMember.id;
        await api.put(`/team-members/${id}`, payload);
        toast.success("Team member updated successfully!");
      } else {
        await api.post("/team-members", payload);
        toast.success("Team member added successfully!");
      }

      setModalOpen(false);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModalItem) return;
    try {
      setDeleting(true);
      const id = deleteModalItem._id || deleteModalItem.id;
      await api.delete(`/team-members/${id}`);
      toast.success("Team member deleted successfully!");
      setDeleteModalItem(null);
      loadData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete team member");
    } finally {
      setDeleting(false);
    }
  };

  const filtered = members.filter((m) => {
    const matchDept = selectedDept === "All" || m.department === selectedDept;
    const q = searchQuery.toLowerCase();
    const name = (m.name || "").toLowerCase();
    const pos = (m.position || "").toLowerCase();
    return matchDept && (name.includes(q) || pos.includes(q));
  });

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white p-4 rounded-b-2xl border-b border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-black tracking-tight">Team &amp; Board Management</h1>
          <p className="text-xs text-slate-700 mt-1">
            Manage trustees, executive officers, program leads, and departmental coordinators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition cursor-pointer"
            title="Refresh"
          >
            <FiRefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-red-600" : ""}`} />
          </button>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/25 transition cursor-pointer"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white mx-3 p-1 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full max-w-md">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search by name or position..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-red-500 text-black placeholder:text-slate-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 bg-white text-black"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="bg-white mx-3 rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6">
        {loading ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiRefreshCw className="w-6 h-6 animate-spin mx-auto text-red-600" />
            <p>Loading team members...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-700 text-xs space-y-2">
            <FiAlertCircle className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-black">No team members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-10 sm:gap-x-8 sm:gap-y-12 justify-items-center py-4">
            {filtered.map((m) => {
              const id = m._id || m.id;
              const photo = m.image;
              return (
                <div
                  key={id}
                  className="group flex flex-col items-center text-center transition-transform duration-300 w-full max-w-[200px]"
                >
                  {/* Profile Picture */}
                  <div className="relative mb-3">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden shadow-md border-3 border-white ring-4 ring-red-100 group-hover:ring-red-500 transition-all duration-300 group-hover:scale-105 bg-slate-100">
                      {photo ? (
                        <img
                          src={getContentImageUrl(photo)}
                          alt={m.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src =
                              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-red-100 text-red-600 flex items-center justify-center font-black text-2xl">
                          {m.name.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-sm sm:text-base font-black text-black group-hover:text-red-600 transition-colors tracking-tight leading-snug">
                    {m.name}
                  </h3>

                  {/* Position */}
                  <p className="text-xs font-semibold text-red-600 tracking-normal mt-0.5 leading-snug">
                    {m.position}
                  </p>

                  {/* Department */}
                  {m.department && (
                    <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200/80">
                      {m.department}
                    </span>
                  )}

                  {/* Action Buttons */}
                  <div className="mt-3 flex items-center justify-center gap-1.5 opacity-90 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openEdit(m)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 hover:text-black hover:border-slate-300 font-bold text-[11px] shadow-2xs transition cursor-pointer"
                      title="Edit Profile"
                    >
                      <FiEdit2 className="w-3 h-3 text-slate-600" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => setDeleteModalItem(m)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-bold text-[11px] shadow-2xs transition cursor-pointer"
                      title="Delete Member"
                    >
                      <FiTrash2 className="w-3 h-3 text-rose-600" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full border border-slate-200 shadow-2xl relative max-h-[90vh] overflow-y-auto text-black">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-black text-black mb-1">
              {editingMember ? "Edit Team Member" : "Add Team Member"}
            </h2>
            <p className="text-xs text-slate-600 mb-6">
              Official photograph includes live preview and remove image option.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs text-black">
              {/* Photo with Display Preview & Remove Image */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="font-extrabold text-black text-xs block">
                  Official Portrait Photo (Display &amp; Remove Option)
                </span>

                {photoPreview || form.image ? (
                  <div className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-200">
                    <img
                      src={photoPreview || getContentImageUrl(form.image)}
                      alt="Team Member Preview"
                      className="w-20 h-20 object-cover rounded-xl border-2 border-red-500 shadow-sm"
                    />
                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-black">Selected Photo Preview</div>
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white border border-rose-200 text-xs font-bold transition cursor-pointer"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                        <span>Remove Photo</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 border-2 border-dashed border-slate-300 rounded-xl bg-white">
                    <label className="cursor-pointer space-y-1 block">
                      <div className="w-9 h-9 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto text-lg">
                        <FiUploadCloud />
                      </div>
                      <span className="text-xs font-bold text-red-600 hover:underline block">
                        Click to select portrait photograph
                      </span>
                      <span className="text-[10px] text-slate-400 block">PNG, JPG or JPEG up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoSelect}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-extrabold text-black block mb-1">Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-black block mb-1">Position / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Managing Trustee / Field Director"
                    value={form.position}
                    onChange={(e) => setForm({ ...form, position: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>

                <div>
                  <label className="font-extrabold text-black block mb-1">Department</label>
                  <select
                    value={form.department}
                    onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  >
                    {DEPARTMENTS.filter((d) => d !== "All").map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-extrabold text-black block mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-extrabold text-black block mb-1">Official Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-extrabold text-black block mb-1">Bio / Profile Summary</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    placeholder="Brief background, achievements, and responsibilities..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-red-500 font-medium text-black bg-white"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 text-slate-700 font-bold hover:bg-slate-100 rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-xl shadow-md transition cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Saving..." : editingMember ? "Update Member" : "Save Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModalItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-2xl text-center space-y-4 text-black">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto text-xl border border-rose-200">
              <FiTrash2 className="w-6 h-6" />
            </div>
            <h3 className="font-black text-lg text-black">Delete Team Member?</h3>
            <p className="text-xs text-slate-600">
              Are you sure you want to remove <strong>{deleteModalItem.name}</strong> from the executive directory?
            </p>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalItem(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleting}
                onClick={handleDeleteConfirm}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
